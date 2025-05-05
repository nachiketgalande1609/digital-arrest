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
}

type LogSeverity = "info" | "warning" | "error" | "success";

interface LogEntry {
    timestamp: string;
    message: string;
    type: LogSeverity;
}

const TelangalanCyberSite: React.FC<TelangalanCyberSiteProps> = ({ victimAudioRef, scammerAudioRef, activeSpeaker, callStatus }) => {
    const [victimLogs, setVictimLogs] = useState<LogEntry[]>([]);
    const [scammerLogs, setScammerLogs] = useState<LogEntry[]>([]);

    const victimTerminalRef = useRef<HTMLDivElement>(null);
    const scammerTerminalRef = useRef<HTMLDivElement>(null);

    const victimMessages = useRef<{ message: string; severity: LogSeverity }[]>([
        { message: "[SYSTEM BOOT] Deepfake voice synthesis initialized via ElevenLabs API v3.2.", severity: "info" },
        { message: "Voice profile loaded: 'Middle-aged female, nervous tone' (ID: VCTM-8872).", severity: "success" },
        { message: "Connecting to OpenAI GPT-4-turbo model for dynamic response generation...", severity: "info" },
        { message: "Deepfake voice engaged: 'Frightened woman' (ElevenLabs v3.4).", severity: "info" },
        { message: "VPN Detection: Call origin masked via NordVPN exit node (Singapore).", severity: "error" },
        { message: "AI Response: 'H-Hello? Who is this?!' (simulating call pickup confusion).", severity: "info" },
        { message: "Scammer script: 'This is Officer Sharma from Mumbai Narcotics! A parcel in your name...'.", severity: "warning" },
        { message: "RTP packet analysis: High jitter (187ms) → Likely overseas routing.", severity: "error" },
        { message: "Countermeasure: AI feigns panic—'Oh god! But I didn’t order anything!'.", severity: "info" },
        { message: "STUN server probe: Attempting to bypass VPN via WebRTC leak.", severity: "warning" },
        { message: "Scammer demands: 'Pay ₹1.2 lakh via Bitcoin or face arrest!'.", severity: "error" },
        { message: "AI stalls: 'My son has Bitcoin... but he’s traveling! Can I pay tomorrow?'.", severity: "info" },
        { message: "Voice stress analysis: Scammer frustration rising (pitch +12%).", severity: "warning" },
        { message: "Traceroute initiated: Hopping through VPN nodes (Singapore → Netherlands).", severity: "error" },
        { message: "Fake 'Mumbai Police' portal loaded (scammer phishing link clicked).", severity: "success" },
        { message: "Scammer enters credentials: [ID: narcotics_scam@protonmail.com].", severity: "error" },
        { message: "DNS tunneling detected: Malicious .onion domain resolved.", severity: "error" },
        { message: "VPN IP stripped! Real IP exposed: 117.211.75.63 (BSNL, New Delhi).", severity: "success" },
        { message: "Final handoff: Cyber Crime Division notified w/ full call logs.", severity: "success" },
    ]);

    const scammerMessages = useRef<{ message: string; severity: LogSeverity }[]>([
        { message: "VOIP call initiated via Twilio SIP proxy (spoofing Mumbai Customs number).", severity: "info" },
        { message: "VPN enabled: Traffic routed through NordVPN (Singapore exit node).", severity: "info" },
        { message: "Victim answered call — deploying 'narcotics threat' script.", severity: "success" },
        { message: "AI detected? Unusual response delay (+4.2s).", severity: "warning" },
        { message: "Target stalling: 'My son will transfer money...'.", severity: "warning" },
        { message: "RTP stream interrupted — possible packet inspection.", severity: "error" },
        { message: "Switching VPN servers (Singapore → Netherlands).", severity: "info" },
        { message: "Target clicked fake 'Mumbai Police' link — session hijacked.", severity: "success" },
        { message: "WebRTC leak detected! Real IP exposed (117.211.75.63).", severity: "error" },
        { message: "VPN killswitch failed — ISP metadata leaked (BSNL, New Delhi).", severity: "error" },
        { message: "Call terminated abruptly — law enforcement trace detected.", severity: "error" },
        { message: "EMERGENCY: All sessions disconnected. Device wipe initiated.", severity: "error" },
    ]);

    useEffect(() => {
        // Initial victim log
        const initialVictimLog: LogEntry = {
            timestamp: new Date().toLocaleTimeString(),
            message: "AI Assistant activated — initiating scammer time-wasting protocol...",
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
