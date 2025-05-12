import React, { useState, useEffect, useRef } from "react";
import "./CyberSite.css";
import AudioVisualizer from "./components/visualizer/AudioVisualizer";
import Navbar from "./components/navbar/Navbar";
import ReactLeaflet from "./ReactLeaflet";

interface TelangalanCyberSiteProps {
    victimAudioRef: React.RefObject<HTMLAudioElement | null>;
    scammerAudioRef: React.RefObject<HTMLAudioElement | null>;
    activeSpeaker: "caller" | "victim";
    callStatus: "incoming" | "analyzing" | "scam-detected" | "call-ended";
    currentAudioIndex: Number;
}

type LogSeverity = "info" | "warning" | "error" | "success";

interface LogEntry {
    timestamp: string;
    message: string;
    type: LogSeverity;
    progress?: number; // Track progress for each log
    completed?: boolean; // Track if progress is complete
}

const TelangalanCyberSite: React.FC<TelangalanCyberSiteProps> = ({
    victimAudioRef,
    scammerAudioRef,
    activeSpeaker,
    callStatus,
    currentAudioIndex,
}) => {
    const [victimLogs, setVictimLogs] = useState<LogEntry[]>([]);
    const [scammerLogs, setScammerLogs] = useState<LogEntry[]>([]);
    const [currentScammerMessageIndex, setCurrentScammerMessageIndex] = useState(0);

    const victimTerminalRef = useRef<HTMLDivElement>(null);
    const scammerTerminalRef = useRef<HTMLDivElement>(null);

    const victimMessages = useRef<{ message: string; severity: LogSeverity }[]>([
        { message: "Voice profile loaded: 'Female: nervous tone' (ID: VCTM-8872).", severity: "success" },
        { message: "Connected to OpenAI GPT-4-turbo model for dynamic response generation...", severity: "info" },
        { message: "Deepfake voice engaged: 'Frightened woman' (ElevenLabs v3.4).", severity: "info" },
    ]);

    const scammerMessages = useRef<{ message: string; severity: LogSeverity; hasProgress: boolean }[]>([
        { message: "Initial connection detected from VPN IP: 180.252.113.199 (NordVPN, Jakarta)", severity: "info", hasProgress: false },
        { message: "Analyzing VPN tunnel characteristics for timing anomalies...", severity: "info", hasProgress: true },
        { message: "Detected WebRTC leak - possible real IP fragment: 103.240.180.*", severity: "info", hasProgress: false },
        { message: "Cross-referencing IP fragment with known scammer infrastructure...", severity: "info", hasProgress: true },
        { message: "Running TTL analysis on network packets to estimate true hop distance...", severity: "info", hasProgress: true },
        { message: "Detected VPN session cookie - correlating with previous scam patterns...", severity: "info", hasProgress: false },
        { message: "Analyzing voiceprint against known scammer databases...", severity: "info", hasProgress: true },
        { message: "Confirmed real IP behind VPN: 103.240.180.25 (Phnom Penh, Cambodia)", severity: "success", hasProgress: false },
        { message: "Mapping network path: VPN exit (Jakarta) → actual origin (Phnom Penh)", severity: "info", hasProgress: true },
        { message: "Identified ISP: Cellcard (Cambodia) - known scammer hotspot", severity: "info", hasProgress: false },
        { message: "Geolocation triangulation complete - accuracy: 92%", severity: "success", hasProgress: false },
        { message: "Compiling digital fingerprint for law enforcement submission...", severity: "info", hasProgress: true },
        {
            message:
                "Tracking details: IP 103.240.180.25, ISP: Cellcard, Device: Android 13, Browser: Chrome 118, Location: 11.5621°N, 104.8885°E (Central Phnom Penh)",
            severity: "success",
            hasProgress: false,
        },
    ]);

    useEffect(() => {
        // Initial victim log
        const initialVictimLog: LogEntry = {
            timestamp: new Date().toLocaleTimeString(),
            message: "[SYSTEM BOOT] Deepfake voice synthesis initialized via ElevenLabs API v3.2.",
            type: "info",
        };

        // Initial scammer log
        const initialScammerLog: LogEntry = {
            timestamp: new Date().toLocaleTimeString(),
            message: "Call connected - tracking scammer through VPN tunnel...",
            type: "info",
        };

        setVictimLogs([initialVictimLog]);
        setScammerLogs([initialScammerLog]);

        // Victim log interval
        const victimInterval = setInterval(() => {
            const timestamp = new Date().toLocaleTimeString();
            const victimMsg = victimMessages.current[0];
            if (victimMsg) {
                setVictimLogs((prev) => [...prev, { timestamp, message: victimMsg.message, type: victimMsg.severity }]);
                victimMessages.current.shift();
            }
        }, 5000);

        return () => {
            clearInterval(victimInterval);
        };
    }, []);

    // Scammer progress bar effect
    useEffect(() => {
        if (currentScammerMessageIndex >= scammerMessages.current.length) return;

        const scammerMsg = scammerMessages.current[currentScammerMessageIndex];
        if (!scammerMsg) return;

        // Check if this message has already been added to logs
        const messageExists = scammerLogs.some((log) => log.message === scammerMsg.message && log.type === scammerMsg.severity);

        if (!messageExists) {
            const timestamp = new Date().toLocaleTimeString();
            setScammerLogs((prevLogs) => [
                ...prevLogs,
                {
                    timestamp,
                    message: scammerMsg.message,
                    type: scammerMsg.severity,
                    progress: scammerMsg.hasProgress ? 0 : undefined, // Only set progress if hasProgress is true
                    completed: !scammerMsg.hasProgress, // Mark as completed immediately if no progress bar
                },
            ]);
        }

        // Only set up progress interval if this message should have a progress bar
        if (scammerMsg.hasProgress) {
            const scammerProgressInterval = setInterval(() => {
                setScammerLogs((prevLogs) => {
                    const updatedLogs = [...prevLogs];
                    const currentLogIndex = updatedLogs.findIndex((log) => log.message === scammerMsg.message && !log.completed);

                    if (currentLogIndex === -1) return prevLogs;

                    const currentProgress = updatedLogs[currentLogIndex].progress || 0;
                    const newProgress = Math.min(currentProgress + 10, 100);

                    updatedLogs[currentLogIndex] = {
                        ...updatedLogs[currentLogIndex],
                        progress: newProgress,
                        completed: newProgress === 100,
                    };

                    return updatedLogs;
                });
            }, 700);

            return () => clearInterval(scammerProgressInterval);
        }
    }, [currentScammerMessageIndex, scammerLogs]);

    // Handle moving to the next message
    useEffect(() => {
        if (scammerLogs.length === 0) return;

        const lastLog = scammerLogs[scammerLogs.length - 1];
        if (lastLog.completed && currentScammerMessageIndex < scammerMessages.current.length - 1) {
            // Add a small delay before moving to next message
            const timer = setTimeout(() => {
                setCurrentScammerMessageIndex((prev) => prev + 1);
            }, 1800);

            return () => clearTimeout(timer);
        }
    }, [scammerLogs, currentScammerMessageIndex]);

    // Victim response logs based on audio index
    useEffect(() => {
        if (currentAudioIndex === 6) {
            const timestamp = new Date().toLocaleTimeString();
            const newLog: LogEntry = {
                timestamp,
                message:
                    "Deepfake Response: What! This sounds serious. I have no one at Taiwan. I don't know anyone from there. I have never sent or received anything from Taiwan. There is a mistake.",
                type: "warning",
            };
            setVictimLogs((prev) => [...prev, newLog]);
        } else if (currentAudioIndex === 8) {
            const timestamp = new Date().toLocaleTimeString();
            const newLog: LogEntry = {
                timestamp,
                message:
                    "Deepfake Response: Kindly listen, I believe there is some sort of misunderstanding. I truly don't know anything about this parcel. I assure you, I have done nothing wrong. Could you please let me know how can I resolve this?",
                type: "warning",
            };
            setVictimLogs((prev) => [...prev, newLog]);
        } else if (currentAudioIndex === 9) {
            const timestamp = new Date().toLocaleTimeString();
            const newLog: LogEntry = {
                timestamp,
                message: "[SYNTH CORE] High-stress scenario detected. Adjusting vocal modulation parameters.",
                type: "info",
            };
            setVictimLogs((prev) => [...prev, newLog]);
        }
    }, [currentAudioIndex]);

    useEffect(() => {
        if (victimTerminalRef.current) {
            victimTerminalRef.current.scrollTop = victimTerminalRef.current.scrollHeight;
        }
    }, [victimLogs]);

    useEffect(() => {
        if (scammerTerminalRef.current) {
            scammerTerminalRef.current.scrollTop = scammerTerminalRef.current.scrollHeight;
        }
    }, [scammerLogs]);

    const renderProgressBar = (progressValue: number) => {
        return (
            <div className="cyber-modern-progress-bar-container">
                <div className="cyber-modern-progress-bar">
                    <div className="cyber-modern-progress-fill" style={{ width: `${progressValue}%` }}></div>
                </div>
                <span className="cyber-progress-percent-modern">{progressValue.toFixed(0)}%</span>
            </div>
        );
    };

    return (
        <div style={{ width: "100vw" }}>
            <Navbar />
            <div className="cyber-main-container">
                <div className="cyber-left-panel">
                    <div className="cyber-terminal-wrapper">
                        {/* Victim Terminal */}
                        <div className="cyber-terminal-window">
                            <AudioVisualizer audioRef={victimAudioRef} active={activeSpeaker === "victim"} type="victim" />
                            <div className="cyber-terminal-topbar">
                                <div className="cyber-terminal-controls">
                                    <div className="cyber-terminal-btn cyber-terminal-btn-close"></div>
                                    <div className="cyber-terminal-btn cyber-terminal-btn-minimize"></div>
                                    <div className="cyber-terminal-btn cyber-terminal-btn-maximize"></div>
                                </div>
                                <div className="cyber-terminal-titlebar">
                                    <span className="cyber-terminal-appname">Digital Robocop</span>
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
                                    <div key={index} className={`cyber-log-entry cyber-log-${log.type}`}>
                                        <span className="cyber-log-time">[{log.timestamp}]</span>
                                        <span className="cyber-log-message">{log.message}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Scammer Terminal with progress bars */}
                        <div className="cyber-terminal-window">
                            <AudioVisualizer audioRef={scammerAudioRef} active={activeSpeaker === "caller"} type="caller" />
                            <div className="cyber-terminal-topbar">
                                <div className="cyber-terminal-controls">
                                    <div className="cyber-terminal-btn cyber-terminal-btn-close"></div>
                                    <div className="cyber-terminal-btn cyber-terminal-btn-minimize"></div>
                                    <div className="cyber-terminal-btn cyber-terminal-btn-maximize"></div>
                                </div>
                                <div className="cyber-terminal-titlebar">
                                    <span className="cyber-terminal-appname">Scam Source Log</span>
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
                                    <React.Fragment key={index}>
                                        <div className={`cyber-log-entry cyber-log-${log.type}`}>
                                            <span className="cyber-log-time">[{log.timestamp}]</span>
                                            <span className="cyber-log-message">{log.message}</span>
                                        </div>
                                        {/* Only show progress bar if progress is defined */}
                                        {log.progress !== undefined && <div className="cyber-log-progress">{renderProgressBar(log.progress)}</div>}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="map-container">
                        <ReactLeaflet
                            victimLocation={[17.385, 78.4867]} // Hyderabad, Telangana
                            scammerLocation={[11.5564, 104.9282]} // Phnom Penh, Cambodia
                            vpnLocation={[-6.2088, 106.8456]} // Jakarta, Indonesia
                            connectionStrength={75}
                            isCallActive={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TelangalanCyberSite;
