import React, { useEffect, useRef, useCallback, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface ReactLeafletProps {
    connectionStrength?: number; // 0-100
    isCallActive?: boolean;
    victimLocation: [number, number]; // [lat, lng]
    scammerLocation: [number, number]; // [lat, lng]
    vpnLocation: [number, number];
}

const ReactLeaflet: React.FC<ReactLeafletProps> = ({
    connectionStrength = 80,
    isCallActive = false,
    victimLocation,
    scammerLocation,
    vpnLocation,
}) => {
    const showTriangulation = true;
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const markersRef = useRef<{
        victim?: L.Marker;
        scammer?: L.Marker;
        vpnMarker?: L.Marker;
        vpnCircle?: L.Marker;
        triangulation?: L.Polyline;
        triangulationToVPN?: L.Polyline;
        scammerToVPN?: L.Polyline;
        midpoint?: L.CircleMarker;
        rippleCircles?: L.Circle[];
        victimLabel?: L.Tooltip;
        vpnLabel?: L.Tooltip;
        scammerLabel?: L.Tooltip;
    }>({});
    const zoomIntervalRef = useRef<number | null>(null);
    const [currentZoom, setCurrentZoom] = useState(3);
    const [showOverlay, setShowOverlay] = useState(false);
    const [realLocationFound, setRealLocationFound] = useState(false);

    const createIcons = useCallback(() => {
        return {
            victim: L.divIcon({
                className: `victim-marker ${isCallActive ? "active" : ""}`,
                html: `
                    <div class="pulse-marker">
                    <div class="inner-circle"></div>
                    ${isCallActive ? '<div class="ripple"></div>' : ""}
                    </div>
                `,
                iconSize: [30, 30],
                iconAnchor: [15, 15],
            }),
            scammer: L.divIcon({
                className: `scammer-marker ${realLocationFound ? "blinking" : ""} ${isCallActive ? "active" : ""}`,
                html: `
                    <div class="alert-marker">
                    <div class="inner-alert">!</div>
                    ${isCallActive ? '<div class="ripple"></div>' : ""}
                    </div>
                `,
                iconSize: [30, 30],
                iconAnchor: [15, 15],
            }),
            vpn: L.divIcon({
                className: `vpn-marker ${isCallActive ? "active" : ""}`,
                html: `
                    <div class="vpn-marker-inner">
                    <div class="inner-vpn">VPN</div>
                    ${isCallActive ? '<div class="ripple"></div>' : ""}
                    </div>
                `,
                iconSize: [30, 30],
                iconAnchor: [15, 15],
            }),
            vpnCircle: L.divIcon({
                className: "vpn-circle-marker",
                html: `
                    <div class="vpn-circle">
                    <div class="vpn-circle-inner"></div>
                    </div>
                `,
                iconSize: [20, 20],
                iconAnchor: [10, 10],
            }),
        };
    }, [isCallActive, realLocationFound]);

    // Create rippling circles around locations
    const createRippleCircles = useCallback(() => {
        if (!mapRef.current) return;

        // Clear previous ripple circles
        if (markersRef.current.rippleCircles) {
            markersRef.current.rippleCircles.forEach((circle) => {
                mapRef.current?.removeLayer(circle);
            });
        }

        const colors = ["#ff3b30", "#ff9500", "#ffcc00"];
        const rippleCircles: L.Circle[] = [];

        // Create ripples around both scammer and VPN locations if real location is found
        const locations = realLocationFound ? [scammerLocation, vpnLocation] : [vpnLocation];

        locations.forEach((location, locIndex) => {
            // Create 3 concentric circles with different radii and colors
            for (let i = 0; i < 3; i++) {
                const circle = L.circle(location, {
                    radius: 500 + i * 300, // 500m, 800m, 1100m
                    color: colors[i],
                    fillColor: colors[i],
                    fillOpacity: 0.1,
                    weight: 1,
                    className: `ripple-circle ripple-circle-${i} ${locIndex === 0 ? "scammer-ripple" : "vpn-ripple"}`,
                }).addTo(mapRef.current);

                rippleCircles.push(circle);
            }
        });

        markersRef.current.rippleCircles = rippleCircles;
    }, [realLocationFound, scammerLocation, vpnLocation]);

    // Initialize map
    const initMap = useCallback(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        // Set initial view to center between victim and VPN location
        const initialCenter: [number, number] = [(victimLocation[0] + vpnLocation[0]) / 2, (victimLocation[1] + vpnLocation[1]) / 2];

        mapRef.current = L.map(mapContainerRef.current, {
            zoomControl: false,
            attributionControl: false,
            fadeAnimation: true,
            zoomAnimation: true,
        }).setView(initialCenter, currentZoom);

        // Add tile layer with dark mode variant
        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
            maxZoom: 19,
        }).addTo(mapRef.current);

        // Add zoom control with custom position
        L.control
            .zoom({
                position: "bottomright",
            })
            .addTo(mapRef.current);

        createRippleCircles();
    }, [currentZoom, createRippleCircles, victimLocation, vpnLocation]);

    // Update markers and triangulation
    const updateMarkers = useCallback(() => {
        if (!mapRef.current) return;

        const icons = createIcons();

        // Clear previous markers (except ripple circles)
        if (markersRef.current.victim) mapRef.current.removeLayer(markersRef.current.victim);
        if (markersRef.current.scammer) mapRef.current.removeLayer(markersRef.current.scammer);
        if (markersRef.current.vpnMarker) mapRef.current.removeLayer(markersRef.current.vpnMarker);
        if (markersRef.current.vpnCircle) mapRef.current?.removeLayer(markersRef.current.vpnCircle);
        if (markersRef.current.triangulation) mapRef.current.removeLayer(markersRef.current.triangulation);
        if (markersRef.current.triangulationToVPN) mapRef.current.removeLayer(markersRef.current.triangulationToVPN);
        if (markersRef.current.scammerToVPN) mapRef.current.removeLayer(markersRef.current.scammerToVPN);
        if (markersRef.current.midpoint) mapRef.current.removeLayer(markersRef.current.midpoint);
        if (markersRef.current.victimLabel) mapRef.current.removeLayer(markersRef.current.victimLabel);
        if (markersRef.current.vpnLabel) mapRef.current.removeLayer(markersRef.current.vpnLabel);
        if (markersRef.current.scammerLabel) mapRef.current.removeLayer(markersRef.current.scammerLabel);

        // Add VPN text marker (existing code)
        markersRef.current.vpnMarker = L.marker(vpnLocation, {
            icon: icons.vpn,
            zIndexOffset: 900,
        }).addTo(mapRef.current).bindPopup(`
            <div class="map-popup">
                <strong>VPN Exit Node</strong><br>
                ${vpnLocation[0].toFixed(4)}, ${vpnLocation[1].toFixed(4)}<br>
                <div class="vpn-info">
                    <span>Connection routed through VPN</span>
                </div>
            </div>
        `);

        // Add circular VPN marker (new code)
        markersRef.current.vpnCircle = L.marker(vpnLocation, {
            icon: icons.vpnCircle,
            zIndexOffset: 899, // Slightly lower than the text marker
        }).addTo(mapRef.current);

        // Add new victim marker
        markersRef.current.victim = L.marker(victimLocation, {
            icon: icons.victim,
            zIndexOffset: 1000,
        }).addTo(mapRef.current).bindPopup(`
            <div class="map-popup">
                <strong>Victim Location</strong><br>
                ${victimLocation[0].toFixed(4)}, ${victimLocation[1].toFixed(4)}<br>
                <div class="signal-strength">
                <span>Signal:</span>
                <div class="strength-bars">
                    ${Array(5)
                        .fill(0)
                        .map((_, i) => `<div class="bar ${i < Math.floor(connectionStrength / 20) ? "active" : ""}"></div>`)
                        .join("")}
                </div>
                </div>
            </div>
        `);

        // Add victim label
        markersRef.current.victimLabel = L.tooltip({
            permanent: true,
            direction: "left",
            className: "map-label victim-label",
            offset: L.point(-16, -3),
        })
            .setContent("Victim (Hyderabad, Telangana)")
            .setLatLng([victimLocation[0], victimLocation[1]])
            .addTo(mapRef.current);

        // Always show VPN marker
        markersRef.current.vpnMarker = L.marker(vpnLocation, {
            icon: icons.vpn,
            zIndexOffset: 900,
        }).addTo(mapRef.current).bindPopup(`
            <div class="map-popup">
                <strong>VPN Exit Node</strong><br>
                ${vpnLocation[0].toFixed(4)}, ${vpnLocation[1].toFixed(4)}<br>
                <div class="vpn-info">
                <span>Connection routed through VPN</span>
                </div>
            </div>
        `);

        // Add VPN label
        markersRef.current.vpnLabel = L.tooltip({
            permanent: true,
            direction: "right",
            className: "map-label vpn-label",
            offset: L.point(20, -2),
        })
            .setContent("VPN (Jakarta, Indonesia)")
            .setLatLng([vpnLocation[0], vpnLocation[1]])
            .addTo(mapRef.current);

        // Add scammer marker if real location is found
        if (realLocationFound) {
            markersRef.current.scammer = L.marker(scammerLocation, {
                icon: icons.scammer,
                zIndexOffset: 1000,
            }).addTo(mapRef.current).bindPopup(`
                <div class="map-popup">
                <strong>Suspected Scammer</strong><br>
                ${scammerLocation[0].toFixed(4)}, ${scammerLocation[1].toFixed(4)}<br>
                <div class="risk-meter">
                    <span>Risk Level:</span>
                    <div class="meter">
                    <div class="level" style="width: ${connectionStrength}%"></div>
                    </div>
                </div>
                </div>
            `);

            // Add scammer label
            markersRef.current.scammerLabel = L.tooltip({
                permanent: true,
                direction: "right",
                className: "map-label scammer-label",
                offset: L.point(22, -1.5),
            })
                .setContent("Scammer Located (Phnom Penh, Cambodia)")
                .setLatLng([scammerLocation[0], scammerLocation[1]])
                .addTo(mapRef.current);
        }

        // Add triangulation if enabled
        if (showTriangulation) {
            const lineColor = connectionStrength > 70 ? "#ff3b30" : connectionStrength > 40 ? "#ff9500" : "#ffcc00";

            // Line from victim to VPN
            markersRef.current.triangulation = L.polyline([victimLocation, vpnLocation], {
                color: lineColor,
                dashArray: connectionStrength > 50 ? "10, 5" : "5, 5",
                weight: 1 + connectionStrength / 50,
                opacity: 0.7 + connectionStrength / 200,
                className: "triangulation-line",
            }).addTo(mapRef.current);

            // If real location found, add line from scammer to VPN
            if (realLocationFound) {
                markersRef.current.scammerToVPN = L.polyline([scammerLocation, vpnLocation], {
                    color: "#30a5ff",
                    dashArray: "5, 5",
                    weight: 2,
                    opacity: 0.7,
                    className: "scammer-vpn-line",
                }).addTo(mapRef.current);
            }
        }
    }, [victimLocation, scammerLocation, vpnLocation, showTriangulation, createIcons, connectionStrength, realLocationFound]);

    useEffect(() => {
        initMap();
        updateMarkers();
        // Set timeout to reveal real location after 40 seconds
        setTimeout(() => {
            setRealLocationFound(true);
        }, 17000);

        return () => {
            if (zoomIntervalRef.current) {
                clearInterval(zoomIntervalRef.current);
            }
        };
    }, [initMap, updateMarkers]);

    // Update markers when realLocationFound changes
    useEffect(() => {
        if (mapRef.current) {
            updateMarkers();
            createRippleCircles();
        }
    }, [realLocationFound, updateMarkers, createRippleCircles]);

    return (
        <div className="map-container">
            <div ref={mapContainerRef} className={`leaflet-map ${isCallActive ? "call-active" : ""}`} />

            {showOverlay && (
                <div className="scammer-overlay">
                    <div className="overlay-content">
                        <h3>Scammer IP Traced</h3>
                        <div className="coordinates">
                            <span>
                                VPN Exit: {vpnLocation[0].toFixed(4)}, {vpnLocation[1].toFixed(4)}
                            </span>
                            {realLocationFound && (
                                <span>
                                    Real Location: {scammerLocation[0].toFixed(4)}, {scammerLocation[1].toFixed(4)}
                                </span>
                            )}
                        </div>
                        <button className="close-button" onClick={() => setShowOverlay(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReactLeaflet;
