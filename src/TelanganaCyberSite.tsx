import React from "react";
import "./CyberSite.css";
import AudioVisualizer from "./components/visualizer/AudioVisualizer";
import Navbar from "./components/navbar/Navbar";
import ReactLeaflet from "./ReactLeaflet"; // We'll create this component
import ScammerDetailsModal from "./components/modal/ScammerDetailsModal";

interface TelangalanCyberSiteProps {
    victimAudioRef: React.RefObject<HTMLAudioElement | null>;
    scammerAudioRef: React.RefObject<HTMLAudioElement | null>;
    activeSpeaker: "caller" | "victim";
    callStatus: "incoming" | "analyzing" | "scam-detected" | "call-ended";
    victimTerminalRef: React.RefObject<HTMLDivElement | null>;
    victimLogs: Array<{ timestamp: string; message: string; type: string }>;
    scammerTerminalRef: React.RefObject<HTMLDivElement | null>;
    progress: number;
    scammerLogs: Array<{ timestamp: string; message: string; type: string }>;
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
    victimTerminalRef,
    victimLogs,
    scammerTerminalRef,
    progress,
    scammerLogs,
    mapCenter,
    mapZoom,
    locations,
    showTriangulation,
    showScammerDetails,
    setShowScammerDetails,
}) => {
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
                                {callStatus === "analyzing" && (
                                    <div className="cyber-log-entry info">
                                        <span className="cyber-log-time">[{new Date().toISOString().split("T")[1].split(".")[0]}]</span>
                                        <span className="cyber-log-message">
                                            Analysis progress: {Math.min(progress, 100).toFixed(1)}% (ETA: {Math.floor((100 - progress) / 3)}s)
                                        </span>
                                    </div>
                                )}
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
                                {callStatus === "analyzing" && (
                                    <div className="cyber-log-entry info">
                                        <span className="cyber-log-time">[{new Date().toISOString().split("T")[1].split(".")[0]}]</span>
                                        <span className="cyber-log-message">
                                            Detection progress: {Math.min(progress, 100).toFixed(1)}% (ETA: {Math.floor((100 - progress) / 3)}s)
                                        </span>
                                    </div>
                                )}
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
