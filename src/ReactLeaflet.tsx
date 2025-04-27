import React, { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface ReactLeafletProps {
    center: [number, number];
    zoom: number;
    victimLocation: [number, number];
    scammerLocation: [number, number];
    showTriangulation: boolean;
    connectionStrength?: number; // 0-100
    isCallActive?: boolean;
}

const ReactLeaflet: React.FC<ReactLeafletProps> = ({
    center,
    zoom,
    victimLocation,
    scammerLocation,
    showTriangulation,
    connectionStrength = 80,
    isCallActive = false,
}) => {
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const markersRef = useRef<{
        victim?: L.Marker;
        scammer?: L.Marker;
        triangulation?: L.Polyline;
        midpoint?: L.CircleMarker;
    }>({});

    // Create custom icons with memoization
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

    // Initialize map
    const initMap = useCallback(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        mapRef.current = L.map(mapContainerRef.current, {
            zoomControl: false,
            attributionControl: false,
            fadeAnimation: true,
            zoomAnimation: true,
        }).setView(center, zoom);

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
    }, [center, zoom]);

    // Update markers and triangulation
    const updateMarkers = useCallback(() => {
        if (!mapRef.current) return;

        const icons = createIcons();

        // Clear previous markers
        Object.values(markersRef.current).forEach((marker) => {
            if (marker && mapRef.current) {
                mapRef.current.removeLayer(marker);
            }
        });

        // Add new markers
        markersRef.current.victim = L.marker(victimLocation, {
            icon: icons.victim,
            zIndexOffset: 1000,
        }).addTo(mapRef.current).bindPopup(`
                <div class="map-popup">
                    <strong>Victim Location</strong><br>
                    Mumbai, India<br>
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

        markersRef.current.scammer = L.marker(scammerLocation, {
            icon: icons.scammer,
            zIndexOffset: 1000,
        }).addTo(mapRef.current).bindPopup(`
                <div class="map-popup">
                    <strong>Suspected Scammer</strong><br>
                    Hyderabad, India<br>
                    <div class="risk-meter">
                        <span>Risk Level:</span>
                        <div class="meter">
                            <div class="level" style="width: ${connectionStrength}%"></div>
                        </div>
                    </div>
                </div>
            `);

        // Add triangulation if enabled
        if (showTriangulation) {
            const lineColor = connectionStrength > 70 ? "#ff3b30" : connectionStrength > 40 ? "#ff9500" : "#ffcc00";

            markersRef.current.triangulation = L.polyline([victimLocation, scammerLocation], {
                color: lineColor,
                dashArray: connectionStrength > 50 ? "10, 5" : "5, 5",
                weight: 1 + connectionStrength / 50,
                opacity: 0.7 + connectionStrength / 200,
                className: "triangulation-line",
            }).addTo(mapRef.current);

            // Add animated midpoint
            const midpoint = [(victimLocation[0] + scammerLocation[0]) / 2, (victimLocation[1] + scammerLocation[1]) / 2];

            markersRef.current.midpoint = L.circleMarker(midpoint, {
                radius: 3 + connectionStrength / 30,
                color: lineColor,
                fillColor: lineColor,
                fillOpacity: 0.7,
                className: "triangulation-midpoint",
            }).addTo(mapRef.current);
        }
    }, [victimLocation, scammerLocation, showTriangulation, createIcons, connectionStrength]);

    useEffect(() => {
        initMap();
        updateMarkers();

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [initMap, updateMarkers]);

    // Handle view changes
    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.setView(center, zoom, {
                animate: true,
                duration: 1,
                easeLinearity: 0.25,
            });
        }
    }, [center, zoom]);

    return <div ref={mapContainerRef} className={`leaflet-map ${isCallActive ? "call-active" : ""}`} />;
};

export default ReactLeaflet;
