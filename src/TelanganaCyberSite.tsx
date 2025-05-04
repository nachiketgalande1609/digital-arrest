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

const TelangalanCyberSite: React.FC<TelangalanCyberSiteProps> = ({ victimAudioRef, scammerAudioRef, activeSpeaker, callStatus }) => {
    const [victimLogs, setVictimLogs] = useState<any[]>([]);
    const [scammerLogs, setScammerLogs] = useState<any[]>([]);

    const victimTerminalRef = useRef<HTMLDivElement>(null);
    const scammerTerminalRef = useRef<HTMLDivElement>(null);

    const victimMessages = useRef<string[]>([
        "Initiated conversation loop: expressing confusion to prolong interaction.",
        "Analyzing scammer's message pattern… injecting logical inconsistencies.",
        "Deployed counter-questions to simulate gullibility while assessing intent.",
        "Location triangulation in progress… delaying with false banking questions.",
        "Responded with emotional vulnerability script to escalate scammer engagement.",
        "Simulated typing delay to mimic human thought process.",
        "GPS signal lock: 62% — maintaining chatter with fabricated account issue.",
        "Internal reasoning: scammer’s story has contradiction, escalating confusion.",
        "Behavioral markers matched — scammer profile 87% confidence.",
        "Geolocation fix achieved — handing off to enforcement.",
    ]);

    const scammerMessages = useRef<string[]>([
        "Call analyzing: scam script initiated — impersonating victim.",
        "Voice detected — initiating vocal pattern analysis...",
        "AI Response Delay Detected — possible stalling tactic.",
        "Voice stress level rising — 72% inconsistency with claimed identity.",
        "IP trace started... routing through suspicious proxy (Singapore node).",
        "Deep packet inspection triggered — unusual DNS tunneling behavior found.",
        "Cross-referencing vocal pattern with scammer database (v3.4)...",
        "Match found: previously flagged voiceprint — Confidence: 91.2%",
        "AI assistant repeating queries — scammer agitation detected.",
        "IP re-routing failed — real IP identified: 182.72.89.54",
        "Location triangulated via IP, voice latency, and call metadata.",
        "Final Location: **Koti, Hyderabad, Telangana, India**",
        "Flagged for law enforcement handoff — tracker engaged.",
    ]);

    useEffect(() => {
        const victimInterval = setInterval(() => {
            const timestamp = new Date().toLocaleTimeString();
            const victimMsg = victimMessages.current[0];
            if (victimMsg) {
                setVictimLogs((prev) => [...prev, { timestamp, message: victimMsg, type: "info" }]);
                victimMessages.current.shift();
            }
        }, 5000);

        return () => clearInterval(victimInterval);
    }, []);

    useEffect(() => {
        // Initial victim log
        const initialVictimLog = {
            timestamp: new Date().toLocaleTimeString(),
            message: "AI Assistant activated — initiating scammer time-wasting protocol...",
            type: "info",
        };

        // Initial scammer log
        const initialScammerLog = {
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
                setVictimLogs((prev) => [...prev, { timestamp, message: victimMsg, type: "info" }]);
                victimMessages.current.shift();
            }
        }, 5000);

        // Scammer log interval
        const scammerInterval = setInterval(() => {
            const timestamp = new Date().toLocaleTimeString();
            const scammerMsg = scammerMessages.current[0];
            if (scammerMsg) {
                setScammerLogs((prev) => [...prev, { timestamp, message: scammerMsg, type: "info" }]);
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
