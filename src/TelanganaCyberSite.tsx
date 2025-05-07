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

    const scammerMessages = useRef<{ message: string; severity: LogSeverity }[]>([
        { message: "VPN enabled: Traffic routed through NordVPN (Jakarta, Indonesia).", severity: "info" },
        { message: "RTP stream interrupted — possible packet inspection in progress.", severity: "error" },
        { message: "Switching VPN servers — new endpoint: Jakarta, Indonesia.", severity: "info" },
        { message: "WebRTC leak detected! Real IP exposed (117.211.75.63).", severity: "error" },
        { message: "Initiating GeoIP triangulation... signal pinged in Phnom Penh, Cambodia.", severity: "info" },
        { message: "Cross-referencing device fingerprint with darknet activity... match pending.", severity: "info" },
        { message: "TOR session cookie detected — correlating with previous behavior patterns.", severity: "info" },
        { message: "Rogue AP handshake received — MAC address broadcast identified (Android v12).", severity: "info" },
        { message: "IMSI capture underway... preliminary leak points to Cellcard (Cambodia).", severity: "error" },
        { message: "Running voiceprint match... partial correlation with known scammer profiles.", severity: "info" },
        { message: "Remote access session initializing — monitoring file system and clipboard.", severity: "error" },
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
            message: "Call connected — analyzing audio input for scam indicators...",
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

        // Add the new message with initial progress
        const scammerMsg = scammerMessages.current[currentScammerMessageIndex];
        if (scammerMsg) {
            const timestamp = new Date().toLocaleTimeString();
            setScammerLogs((prevLogs) => [
                ...prevLogs,
                {
                    timestamp,
                    message: scammerMsg.message,
                    type: scammerMsg.severity,
                    progress: 0,
                    completed: false,
                },
            ]);
        }

        const scammerProgressInterval = setInterval(() => {
            setScammerLogs((prevLogs) => {
                // Find the index of the current log being processed
                const currentLogIndex = prevLogs.findIndex(
                    (log) => log.message === scammerMessages.current[currentScammerMessageIndex]?.message && !log.completed
                );

                if (currentLogIndex === -1) return prevLogs;

                const updatedLogs = [...prevLogs];
                const currentProgress = updatedLogs[currentLogIndex].progress || 0;
                const newProgress = Math.min(currentProgress + 10, 100);

                updatedLogs[currentLogIndex] = {
                    ...updatedLogs[currentLogIndex],
                    progress: newProgress,
                    completed: newProgress === 100,
                };

                // Move to next message if current one is complete
                if (newProgress === 100) {
                    setCurrentScammerMessageIndex((prevIndex) => prevIndex + 1);
                }

                return updatedLogs;
            });
        }, 500);

        return () => clearInterval(scammerProgressInterval);
    }, [currentScammerMessageIndex]);

    // Rest of your useEffect hooks for audio index changes remain the same
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
        } else if (currentAudioIndex === 7) {
            const timestamp = new Date().toLocaleTimeString();
            const newLog: LogEntry = {
                timestamp,
                message: "[THINKING] Should I express more panic or seek clarification? Need to maintain emotional consistency.",
                type: "info",
            };
            setVictimLogs((prev) => [...prev, newLog]);
        } else if (currentAudioIndex === 8) {
            const timestamp = new Date().toLocaleTimeString();
            const newLog: LogEntry = {
                timestamp,
                message: "Deepfake Response: Please listen, there is some mistake. I swear I am innocent. How can I fix this?",
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
        } else if (currentAudioIndex === 10) {
            const timestamp = new Date().toLocaleTimeString();
            const newLog: LogEntry = {
                timestamp,
                message:
                    "Deepfake Response: Aadhar Number! That sounds I need to give some important stuff to you. Also do I need to send the money today?",
                type: "warning",
            };
            setVictimLogs((prev) => [...prev, newLog]);
        } else if (currentAudioIndex === 11) {
            const timestamp = new Date().toLocaleTimeString();
            const newLog: LogEntry = {
                timestamp,
                message: "[THINKING] Mentioning money could escalate — should show willingness but also uncertainty.",
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
                                        {/* Show progress bar if this log has progress */}
                                        {log.progress !== undefined && <div className="cyber-log-progress">{renderProgressBar(log.progress)}</div>}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="map-container">
                        <ReactLeaflet
                            victimLocation={[19.1197, 72.8464]} // Andheri, Mumbai
                            scammerLocation={[-6.2088, 106.8456]} // Central Jakarta, Indonesia
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
