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
        triangulation?: L.Polyline;
        midpoint?: L.CircleMarker;
        rippleCircles?: L.Circle[];
    }>({});
    const zoomIntervalRef = useRef<number | null>(null);
    const [currentZoom, setCurrentZoom] = useState(3);
    const [showOverlay, setShowOverlay] = useState(false);
    const [realLocationFound, setRealLocationFound] = useState(false);

    // Determine which location to use for scammer (VPN or real)
    const currentScammerLocation = realLocationFound ? scammerLocation : vpnLocation;

    console.log(realLocationFound);

    // Create custom icons
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
                className: `scammer-marker ${isCallActive ? "active" : ""}`,
                html: `
          <div class="alert-marker">
            <div class="inner-alert">!</div>
            ${isCallActive ? '<div class="ripple"></div>' : ""}
          </div>
        `,
                iconSize: [30, 30],
                iconAnchor: [15, 15],
            }),
        };
    }, [isCallActive]);

    // Create rippling circles around scammer location
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

        // Create 3 concentric circles with different radii and colors
        for (let i = 0; i < 3; i++) {
            const circle = L.circle(currentScammerLocation, {
                radius: 500 + i * 300, // 500m, 800m, 1100m
                color: colors[i],
                fillColor: colors[i],
                fillOpacity: 0.1,
                weight: 1,
                className: `ripple-circle ripple-circle-${i}`,
            }).addTo(mapRef.current);

            rippleCircles.push(circle);
        }

        markersRef.current.rippleCircles = rippleCircles;
    }, [currentScammerLocation]);

    // Initialize map
    const initMap = useCallback(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        mapRef.current = L.map(mapContainerRef.current, {
            zoomControl: false,
            attributionControl: false,
            fadeAnimation: true,
            zoomAnimation: true,
        }).setView(currentScammerLocation, currentZoom);

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
    }, [currentZoom, createRippleCircles, currentScammerLocation]);

    // Update markers and triangulation
    const updateMarkers = useCallback(() => {
        if (!mapRef.current) return;

        const icons = createIcons();

        // Clear previous markers (except ripple circles)
        if (markersRef.current.victim) mapRef.current.removeLayer(markersRef.current.victim);
        if (markersRef.current.scammer) mapRef.current.removeLayer(markersRef.current.scammer);
        if (markersRef.current.triangulation) mapRef.current.removeLayer(markersRef.current.triangulation);
        if (markersRef.current.midpoint) mapRef.current.removeLayer(markersRef.current.midpoint);

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

        // Add new scammer marker
        markersRef.current.scammer = L.marker(currentScammerLocation, {
            icon: icons.scammer,
            zIndexOffset: 1000,
        }).addTo(mapRef.current).bindPopup(`
      <div class="map-popup">
        <strong>${realLocationFound ? "Suspected Scammer" : "VPN Exit Node"}</strong><br>
        ${currentScammerLocation[0].toFixed(4)}, ${currentScammerLocation[1].toFixed(4)}<br>
        <div class="risk-meter">
          <span>Risk Level:</span>
          <div class="meter">
            <div class="level" style="width: ${connectionStrength}%"></div>
          </div>
        </div>
      </div>
    `);

        // Add triangulation if enabled (from victim to scammer)
        if (showTriangulation) {
            const lineColor = connectionStrength > 70 ? "#ff3b30" : connectionStrength > 40 ? "#ff9500" : "#ffcc00";

            markersRef.current.triangulation = L.polyline([victimLocation, currentScammerLocation], {
                color: lineColor,
                dashArray: connectionStrength > 50 ? "10, 5" : "5, 5",
                weight: 1 + connectionStrength / 50,
                opacity: 0.7 + connectionStrength / 200,
                className: "triangulation-line",
            }).addTo(mapRef.current);

            // Add animated midpoint
            const midpoint: [number, number] = [
                (victimLocation[0] + currentScammerLocation[0]) / 2,
                (victimLocation[1] + currentScammerLocation[1]) / 2,
            ];

            markersRef.current.midpoint = L.circleMarker(midpoint, {
                radius: 3 + connectionStrength / 30,
                color: lineColor,
                fillColor: lineColor,
                fillOpacity: 0.7,
                className: "triangulation-midpoint",
            }).addTo(mapRef.current);
        }
    }, [victimLocation, currentScammerLocation, showTriangulation, createIcons, connectionStrength, realLocationFound]);

    // Auto-zoom functionality
    const startAutoZoom = useCallback(() => {
        if (currentZoom >= 15) {
            setShowOverlay(true);
            return;
        }
        if (zoomIntervalRef.current) {
            clearInterval(zoomIntervalRef.current);
        }

        let zoomLevel = currentZoom;
        let zoomIn = true;

        zoomIntervalRef.current = setInterval(() => {
            if (zoomIn) {
                zoomLevel = Math.min(zoomLevel + 0.5, 15); // Max zoom
                if (zoomLevel === 15) zoomIn = false;
            } else {
                zoomLevel = Math.max(zoomLevel - 1, 10); // Min zoom
                if (zoomLevel === 10) zoomIn = true;
            }

            setCurrentZoom(zoomLevel);
            mapRef.current?.setView(currentScammerLocation, zoomLevel, {
                animate: true,
                duration: 1,
            });
        }, 2000); // Change zoom level every 2 seconds
    }, [currentZoom, currentScammerLocation]);

    useEffect(() => {
        initMap();
        updateMarkers();
        startAutoZoom();

        // Set timeout to reveal real location after 10 seconds
        setTimeout(() => {
            setRealLocationFound(true);
        }, 10000);

        return () => {
            if (zoomIntervalRef.current) {
                clearInterval(zoomIntervalRef.current);
            }
        };
    }, [initMap, updateMarkers, startAutoZoom]);

    // Handle view changes (but keep centered on the midpoint)
    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.setView(currentScammerLocation, currentZoom, {
                animate: true,
                duration: 1,
                easeLinearity: 0.25,
            });
        }
    }, [currentZoom, currentScammerLocation]);

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
