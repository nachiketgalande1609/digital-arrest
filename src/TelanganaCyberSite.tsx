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
    currentAudioIndex: Number
}

type LogSeverity = "info" | "warning" | "error" | "success";

interface LogEntry {
    timestamp: string;
    message: string;
    type: LogSeverity;
}

const TelangalanCyberSite: React.FC<TelangalanCyberSiteProps> = ({ victimAudioRef, scammerAudioRef, activeSpeaker, callStatus, currentAudioIndex }) => {
    const [victimLogs, setVictimLogs] = useState<LogEntry[]>([]);
    const [scammerLogs, setScammerLogs] = useState<LogEntry[]>([]);

    const victimTerminalRef = useRef<HTMLDivElement>(null);
    const scammerTerminalRef = useRef<HTMLDivElement>(null);

    console.log(currentAudioIndex);
    

    const victimMessages = useRef<{ message: string; severity: LogSeverity }[]>([
        { message: "Voice profile loaded: 'Female: nervous tone' (ID: VCTM-8872).", severity: "success" },
        { message: "Connected to OpenAI GPT-4-turbo model for dynamic response generation...", severity: "info" },
        { message: "Deepfake voice engaged: 'Frightened woman' (ElevenLabs v3.4).", severity: "info" },
        { message: "VPN Detection: Call origin masked via NordVPN exit node (Cambodia).", severity: "error" },
        { message: "RTP packet analysis: High jitter (187ms) → Likely overseas routing.", severity: "error" },
        { message: "Countermeasure: AI feigns panic—'Oh god! But I didn’t order anything!'.", severity: "info" },
        { message: "STUN server probe: Attempting to bypass VPN via WebRTC leak.", severity: "info" },
        { message: "Voice stress analysis: Scammer frustration rising (pitch +12%).", severity: "success" },
        { message: "Traceroute initiated: Hopping through VPN nodes (Cambodia → India).", severity: "error" },
        { message: "Fake 'Mumbai Police' portal loaded (scammer phishing link clicked).", severity: "success" },
        { message: "DNS tunneling detected: Malicious .onion domain resolved.", severity: "error" },
        { message: "VPN IP stripped! Real IP exposed: 117.211.75.63 (BSNL, New Delhi).", severity: "success" },
        { message: "Scammer demands: 'Pay ₹92,000 as a security deposit or face arrest!'.", severity: "error" },
        { message: "Final handoff: Cyber Crime Division notified w/ full call logs.", severity: "success" },
    ]);

    const scammerMessages = useRef<{ message: string; severity: LogSeverity }[]>([
        // Initial call detection
        { message: "Incoming WhatsApp call detected from +855 XX XXXX (Cambodia prefix)", severity: "info" },
        { message: "Call pattern matches known tech support scam signatures (98.7% confidence)", severity: "error" },
        { message: "Starting call metadata analysis - building connection fingerprint", severity: "info" },
    
        // VPN detection
        { message: "Initial IP trace: 182.72.123.45 registered to Nord VPN (Cambodia)", severity: "success" },
        { message: "VPN detection: Nord VPN configuration identified (UDP port 1194)", severity: "info" },
        { message: "Analyzing packet timings - high latency suggests distant VPN server", severity: "info" },
        { message: "VPN server linked to 14 other scam operations this month", severity: "error" },
    
        // Technical tracing
        { message: "Triangulating via STUN servers - estimating true geographical region", severity: "info" },
        { message: "Cross-referencing with Indian scam call databases...", severity: "info" },
        { message: "Timezone analysis: Call patterns match IST (UTC+5:30)", severity: "success" },
    
        // WebRTC breakthrough
        { message: "WebRTC ICE candidate leak detected - gathering IP clues", severity: "info" },
        { message: "Partial IP fragment: 117.212.XX.XX (Indian IP range)", severity: "success" },
        { message: "Signal strength analysis suggests urban location", severity: "info" },
    
        // VPN correlation
        { message: "Matching VPN timestamps with BSNL outage reports...", severity: "info" },
        { message: "VPN connection instability detected (3 packet drops in 2 minutes)", severity: "info" },
        { message: "Momentary VPN disconnect - captured partial real IP", severity: "success" },
    
        // Critical breakthrough
        { message: "TRUE IP CONFIRMED: 117.212.87.34 (Jio Mobile Hyderabad)", severity: "warning" },
    
        // Scammer identification
        { message: "Device fingerprint: Redmi Note 9 (MIUI 12.5.3)", severity: "info" },
        { message: "Matching IMEI pattern to previous scam operations", severity: "error" },
        { message: "Call center signature detected (multiple voices in background)", severity: "info" },
    
        // Scammer reaction
        { message: "Scammer noticed tracing attempt - call duration extended artificially", severity: "error" },
        { message: "VPN killswitch activated - maintaining RTP stream analysis", severity: "error" },
        { message: "Emergency wipe initiated on scammer device", severity: "error" },
    
        // Post-call forensics
        { message: "Recovering DNS cache from packet captures...", severity: "info" },
        { message: "Evidence package compiled with 14 verification points", severity: "success" },
        { message: "Cybercrime report filed with Indian CERT-In", severity: "info" },
        { message: "Operation complete - scammer location 92% verified", severity: "success" }
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

        // Scammer log interval
        const scammerInterval = setInterval(() => {
            const timestamp = new Date().toLocaleTimeString();
            const scammerMsg = scammerMessages.current[0];
            if (scammerMsg) {
                setScammerLogs((prev) => [...prev, { timestamp, message: scammerMsg.message, type: scammerMsg.severity }]);
                scammerMessages.current.shift();
            }
        }, 4000);

        return () => {
            clearInterval(victimInterval);
            clearInterval(scammerInterval);
        };
    }, []);

    useEffect(() => {
        if (currentAudioIndex === 6) {
            const timestamp = new Date().toLocaleTimeString();
            const newLog: LogEntry = {
                timestamp,
                message: "Deepfake Response: What! This sounds serious. I have no one at Taiwan. I don't know anyone from there. I have never sent or received anything from Taiwan. There is a mistake.",
                type: "warning"
            };
            setVictimLogs(prev => [...prev, newLog]);
        } else if (currentAudioIndex === 8) {
            const timestamp = new Date().toLocaleTimeString();
            const newLog: LogEntry = {
                timestamp,
                message: "Deepfake Response: Please listen, there is some mistake. I swear, I am innocent. How can I fix this?",
                type: "warning"
            };
            setVictimLogs(prev => [...prev, newLog]);
        } else if (currentAudioIndex === 10) {
            const timestamp = new Date().toLocaleTimeString();
            const newLog: LogEntry = {
                timestamp,
                message: "Deepfake Response: Aadhar Number? That sounds I need to give some important stuff to you. Also do I need to send the money today?",
                type: "warning"
            };
            setVictimLogs(prev => [...prev, newLog]);
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

                        {/* Scammer Terminal */}
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
                                    <div key={index} className={`cyber-log-entry cyber-log-${log.type}`}>
                                        <span className="cyber-log-time">[{log.timestamp}]</span>
                                        <span className="cyber-log-message">{log.message}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="map-container">
                        <ReactLeaflet
                            victimLocation={[19.1197, 72.8464]} // Andheri, Mumbai
                            scammerLocation={[17.4849, 78.4138]} // Kukatpally, Hyderabad
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
