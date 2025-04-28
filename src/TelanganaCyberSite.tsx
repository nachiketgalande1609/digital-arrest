import React, { useState, useEffect, useRef } from "react";
import "./CyberSite.css";
import AudioVisualizer from "./components/visualizer/AudioVisualizer";
import Navbar from "./components/navbar/Navbar";
import ReactLeaflet from "./ReactLeaflet";
import ScammerDetailsModal from "./components/modal/ScammerDetailsModal";

interface TelangalanCyberSiteProps {
    victimAudioRef: React.RefObject<HTMLAudioElement | null>;
    scammerAudioRef: React.RefObject<HTMLAudioElement | null>;
    activeSpeaker: "caller" | "victim";
    callStatus: "incoming" | "analyzing" | "scam-detected" | "call-ended";
    mapCenter: [number, number];
    mapZoom: number;
    locations: { victim: [number, number]; scammer: [number, number] };
    showTriangulation: boolean;
    showScammerDetails: boolean;
    setShowScammerDetails: React.Dispatch<React.SetStateAction<boolean>>;
}

const TelangalanCyberSite: React.FC<TelangalanCyberSiteProps> = ({
    victimAudioRef,
    scammerAudioRef,
    activeSpeaker,
    callStatus,
    mapCenter,
    mapZoom,
    locations,
    showTriangulation,
    showScammerDetails,
    setShowScammerDetails,
}) => {
    const [victimLogs, setVictimLogs] = useState<Array<{ timestamp: string; message: string; type: string }>>([]);
    const [scammerLogs, setScammerLogs] = useState<Array<{ timestamp: string; message: string; type: string }>>([]);
    const victimTerminalRef = useRef<HTMLDivElement>(null);
    const scammerTerminalRef = useRef<HTMLDivElement>(null);
    const loggingIntervalRef = useRef<number | null>(null);

    // Generate timestamp for logs
    const getTimestamp = () => {
        return new Date().toISOString().split("T")[1].split(".")[0];
    };

    // Generate random scammer details for ongoing logging
    const generateScammerDetails = () => {
        const locations = ["Hyderabad, Telangana"];
        const networks = ["Jio Mobile Network", "Airtel Mobile Network", "Vi Mobile Network", "BSNL Landline", "Unknown VoIP Provider"];
        const names = ["Ramesh Kumar", "Priya Sharma", "Vikram Singh", "Anjali Patel", "Rajesh Iyer"];

        return {
            location: locations[Math.floor(Math.random() * locations.length)],
            network: networks[Math.floor(Math.random() * networks.length)],
            name: names[Math.floor(Math.random() * names.length)],
            callDuration: `${Math.floor(Math.random() * 10) + 1}m ${Math.floor(Math.random() * 60)}s`,
        };
    };

    // Initialize logs when component mounts
    useEffect(() => {
        // Victim logs
        const initialVictimLogs = [
            { timestamp: getTimestamp(), message: "Incoming call detected", type: "info" },
            { timestamp: getTimestamp(), message: "Caller ID: +91 98765 43210", type: "info" },
            { timestamp: getTimestamp(), message: "Answering call...", type: "info" },
            { timestamp: getTimestamp(), message: "Call connected", type: "success" },
            { timestamp: getTimestamp(), message: "Call analysis initiated", type: "warning" },
        ];

        // Scammer logs
        const initialScammerLogs = [
            { timestamp: getTimestamp(), message: "Call pattern analysis started", type: "info" },
            { timestamp: getTimestamp(), message: "Voice signature captured", type: "success" },
            { timestamp: getTimestamp(), message: "Keyword detection active", type: "info" },
            { timestamp: getTimestamp(), message: "Suspicious keywords detected: 'bank account', 'OTP', 'refund'", type: "warning" },
        ];

        setVictimLogs(initialVictimLogs);
        setScammerLogs(initialScammerLogs);
    }, [callStatus]);

    // Add scam detection logs when callStatus changes to scam-detected
    useEffect(() => {
        if (callStatus === "scam-detected") {
            const scamDetectedLogs = [
                { timestamp: getTimestamp(), message: "WARNING: High probability scam call detected!", type: "error" },
                { timestamp: getTimestamp(), message: "Caller matches known scam patterns", type: "error" },
                { timestamp: getTimestamp(), message: "Voice signature matches known scammer database", type: "error" },
                { timestamp: getTimestamp(), message: "Location triangulation complete", type: "info" },
                { timestamp: getTimestamp(), message: "Scammer location pinpointed", type: "success" },
                { timestamp: getTimestamp(), message: "Alerting authorities...", type: "info" },
            ];

            setScammerLogs((prev) => [...prev, ...scamDetectedLogs]);

            // Add corresponding victim logs
            setVictimLogs((prev) => [
                ...prev,
                { timestamp: getTimestamp(), message: "WARNING: Potential scam detected!", type: "error" },
                { timestamp: getTimestamp(), message: "Terminating call for your safety", type: "warning" },
                { timestamp: getTimestamp(), message: "Call ended", type: "info" },
            ]);

            // Start ongoing logging interval
            loggingIntervalRef.current = setInterval(() => {
                const details = generateScammerDetails();

                const newScammerLogs = [
                    { timestamp: getTimestamp(), message: `Tracking scammer movement: ${details.location}`, type: "info" },
                    { timestamp: getTimestamp(), message: `Network analysis: ${details.network}`, type: "info" },
                    { timestamp: getTimestamp(), message: `Probable scammer identity: ${details.name}`, type: "warning" },
                    { timestamp: getTimestamp(), message: `Call duration analyzed: ${details.callDuration}`, type: "info" },
                    { timestamp: getTimestamp(), message: "Updating cyber crime database...", type: "success" },
                ];

                setScammerLogs((prev) => [...prev, ...newScammerLogs]);

                // Add occasional victim logs
                if (Math.random() > 0.7) {
                    setVictimLogs((prev) => [
                        ...prev,
                        { timestamp: getTimestamp(), message: "Cyber crime report generated", type: "info" },
                        { timestamp: getTimestamp(), message: "Local authorities notified", type: "success" },
                    ]);
                }
            }, 5000); // Log every 5 seconds
        }

        return () => {
            if (loggingIntervalRef.current) {
                window.clearInterval(loggingIntervalRef.current);
            }
        };
    }, [callStatus]);

    // Auto-scroll terminals when new logs are added
    useEffect(() => {
        if (victimTerminalRef.current) {
            victimTerminalRef.current.scrollTop = victimTerminalRef.current.scrollHeight;
        }
        if (scammerTerminalRef.current) {
            scammerTerminalRef.current.scrollTop = scammerTerminalRef.current.scrollHeight;
        }
    }, [victimLogs, scammerLogs]);

    return (
        <div style={{ width: "100vw" }}>
            <Navbar />
            <div className="cyber-main-container">
                <div className="cyber-left-panel">
                    <div className="cyber-terminal-wrapper">
                        {/* Victim Terminal (Left) */}
                        <div className="cyber-terminal-window">
                            <AudioVisualizer audioRef={victimAudioRef} active={activeSpeaker === "victim"} type="victim" />
                            <div className="cyber-terminal-topbar">
                                <div className="cyber-terminal-controls">
                                    <div className="cyber-terminal-btn cyber-terminal-btn-close"></div>
                                    <div className="cyber-terminal-btn cyber-terminal-btn-minimize"></div>
                                    <div className="cyber-terminal-btn cyber-terminal-btn-maximize"></div>
                                </div>
                                <div className="cyber-terminal-titlebar">
                                    <span className="cyber-terminal-appname">Victim Terminal</span>
                                    <span className="cyber-terminal-version">v2.3.7</span>
                                </div>
                                <div className="cyber-terminal-state">
                                    <div
                                        className={`cyber-status-indicator ${
                                            callStatus === "incoming"
                                                ? "cyber-status-incoming"
                                                : callStatus === "analyzing"
                                                ? "cyber-status-analyzing"
                                                : callStatus === "scam-detected"
                                                ? "cyber-status-detected"
                                                : ""
                                        }`}
                                    ></div>
                                    <span>{callStatus.toUpperCase()}</span>
                                </div>
                            </div>
                            <div className="cyber-terminal-content cyber-terminal-scroll" ref={victimTerminalRef}>
                                {victimLogs.map((log, index) => (
                                    <div key={index} className={`cyber-log-entry ${log.type}`}>
                                        <span className="cyber-log-time">[{log.timestamp}]</span>
                                        <span className="cyber-log-message">{log.message}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Scammer Terminal (Right) */}
                        <div className="cyber-terminal-window">
                            <AudioVisualizer audioRef={scammerAudioRef} active={activeSpeaker === "caller"} type="caller" />
                            <div className="cyber-terminal-topbar">
                                <div className="cyber-terminal-controls">
                                    <div className="cyber-terminal-btn cyber-terminal-btn-close"></div>
                                    <div className="cyber-terminal-btn cyber-terminal-btn-minimize"></div>
                                    <div className="cyber-terminal-btn cyber-terminal-btn-maximize"></div>
                                </div>
                                <div className="cyber-terminal-titlebar">
                                    <span className="cyber-terminal-appname">Scam Detector</span>
                                    <span className="cyber-terminal-version">v2.3.7</span>
                                </div>
                                <div className="cyber-terminal-state">
                                    <div
                                        className={`cyber-status-indicator ${
                                            callStatus === "incoming"
                                                ? "cyber-status-incoming"
                                                : callStatus === "analyzing"
                                                ? "cyber-status-analyzing"
                                                : callStatus === "scam-detected"
                                                ? "cyber-status-detected"
                                                : ""
                                        }`}
                                    ></div>
                                    <span>{callStatus.toUpperCase()}</span>
                                </div>
                            </div>
                            <div className="cyber-terminal-content cyber-terminal-scroll" ref={scammerTerminalRef}>
                                {scammerLogs.map((log, index) => (
                                    <div key={index} className={`cyber-log-entry ${log.type}`}>
                                        <span className="cyber-log-time">[{log.timestamp}]</span>
                                        <span className="cyber-log-message">{log.message}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="map-container">
                        <ReactLeaflet
                            center={[mapCenter[0], mapCenter[1]]}
                            zoom={mapZoom}
                            victimLocation={locations.victim}
                            scammerLocation={locations.scammer}
                            showTriangulation={showTriangulation}
                            isCallActive={callStatus === "analyzing"}
                        />
                    </div>
                </div>
            </div>
            {showScammerDetails && <ScammerDetailsModal onClose={() => setShowScammerDetails(false)} />}
        </div>
    );
};

export default TelangalanCyberSite;
