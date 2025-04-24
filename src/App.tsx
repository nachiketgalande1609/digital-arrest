import React, { useState, useEffect, useRef } from "react";
import "./App.css";

type CallStatus = "incoming" | "analyzing" | "scam-detected";
type LogEntry = {
    timestamp: string;
    message: string;
    type: "info" | "warning" | "error" | "success" | "debug";
};

interface CallerInfo {
    name: string;
    number: string;
    avatar: string;
}

const generateRandomHex = (size: number): string => {
    return [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
};

const generateRandomUUID = (): string => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

const App: React.FC = () => {
    const [callStatus, setCallStatus] = useState<CallStatus>("incoming");
    const [progress, setProgress] = useState<number>(0);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [activeSpeaker, setActiveSpeaker] = useState<"caller" | "aditi">("caller");

    const [callerInfo] = useState<CallerInfo>({
        name: "Unknown Caller",
        number: "+1 (555) 123-4567",
        avatar: "https://img.freepik.com/premium-photo/male-customer-service-3d-cartoon-avatar-portrait_839035-522335.jpg",
    });
    const terminalRef = useRef<HTMLDivElement>(null);
    const ringtoneRef = useRef<HTMLAudioElement | null>(null);
    const callRef = useRef<HTMLAudioElement | null>(null);
    const aditiRef = useRef<HTMLAudioElement | null>(null);

    const addLog = (message: string, type: LogEntry["type"] = "info") => {
        const timestamp = new Date().toISOString().split("T")[1].split(".")[0];
        setLogs((prev) => [...prev.slice(-200), { timestamp, message, type }]);
    };

    // Auto-scroll terminal to bottom
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [logs]);

    const logFeatureAnalysis = () => {
        const features = ["pitch variance", "spectral centroid", "MFCC coefficients", "formant dispersion", "jitter", "shimmer", "harmonicity"];
        const feature = features[Math.floor(Math.random() * features.length)];
        addLog(`Analyzing ${feature}: deviation ${(Math.random() * 10).toFixed(2)}%`, "info");
    };

    const logModelUpdate = () => {
        if (Math.random() > 0.9) {
            addLog(`Updating detection model weights (epoch: ${Math.floor(Math.random() * 100)}, loss: ${Math.random().toFixed(4)})`, "debug");
        }
    };

    // Simulate call flow with reduced logging
    useEffect(() => {
        if (callStatus === "incoming") {
            addLog("=== DEEPFAKE DETECTION ENGINE v2.3.7 ===", "info");
            addLog("Initializing system...", "info");
            addLog(`Session ID: ${generateRandomUUID()}`, "debug");
            addLog("Loading neural network models...", "info");
            addLog('Model "voiceprint-v5" loaded (43.7MB, SHA-256: ' + generateRandomHex(64) + ")", "success");
            addLog('Model "spectral-v3" loaded (28.2MB, SHA-256: ' + generateRandomHex(64) + ")", "success");
            addLog("Incoming call detected from " + callerInfo.number, "info");
            addLog("Establishing secure connection...", "info");
            addLog("Connection encrypted (TLS 1.3, AES-256-GCM)", "success");
        }

        if (callStatus === "analyzing") {
            addLog("=== BEGINNING REAL-TIME ANALYSIS ===", "info");
            addLog("Extracting 256-dimensional voice features...", "info");

            const analysisInterval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(analysisInterval);
                        setCallStatus("scam-detected");
                        addLog("WARNING: SYNTHETIC VOICE PATTERNS DETECTED!", "error");
                        addLog("Confidence: 94.2% (±2.1%)", "error");
                        addLog("Signature match to known GAN-generated samples", "error");
                        addLog("Vocal artifact detection: POSITIVE", "error");
                        return 100;
                    }

                    if (Math.random() > 0.6) {
                        const randomActions = [
                            logFeatureAnalysis,
                            logModelUpdate,
                            () => addLog(`Processing frame ${Math.floor(prev * 50)} (checksum: ${generateRandomHex(8)})`),
                            () => addLog(`Comparing to ${Math.floor(Math.random() * 10000)} known samples`),
                        ];
                        randomActions[Math.floor(Math.random() * randomActions.length)]();
                    }

                    return prev + (Math.random() * 3 + 2);
                });
            }, 400);

            return () => clearInterval(analysisInterval);
        }
    }, [callStatus]);

    const handleAnswer = (): void => {
        addLog("User answered call - beginning analysis", "success");
        setCallStatus("analyzing");

        if (callRef.current) {
            callRef.current.play().catch((err) => console.error("Error playing call audio:", err));
            callRef.current.onended = () => {
                if (aditiRef.current) {
                    setActiveSpeaker("aditi");
                    addLog("Agent Aditi has taken over the call", "info");
                    aditiRef.current.play().catch((err) => console.error("Error playing Aditi audio:", err));
                    aditiRef.current.onended = () => {
                        setActiveSpeaker("caller");
                    };
                }
            };
        }
    };

    const handleDecline = (): void => {
        addLog("Call declined by user - terminating session", "warning");
        addLog("Releasing GPU memory...", "info");
        addLog("Closing network connections...", "info");
        addLog("Session terminated cleanly", "success");
        setCallStatus("incoming");
        setProgress(0);
        setLogs([]);
    };

    return (
        <>
            <audio ref={ringtoneRef} src="/ringtone.mp3" />
            <audio ref={callRef} src="/initial_call.m4a" />
            <audio ref={aditiRef} src="/aditi.mp3" />
            <div className="app-container">
                <div className="terminal-panel">
                    <div className="terminal-header">
                        <div className="terminal-buttons">
                            <div className="terminal-btn close"></div>
                            <div className="terminal-btn minimize"></div>
                            <div className="terminal-btn maximize"></div>
                        </div>
                        <div className="terminal-title">
                            <span className="app-name">Digital</span>
                            <span className="app-version">v2.3.7</span>
                        </div>
                        <div className="terminal-status">
                            <div className={`status-indicator ${callStatus}`}></div>
                            <span>{callStatus.toUpperCase()}</span>
                        </div>
                    </div>
                    <div className="terminal-body" ref={terminalRef}>
                        {logs.map((log, index) => (
                            <div key={index} className={`log-entry ${log.type}`}>
                                <span className="timestamp">[{log.timestamp}]</span>
                                <span className="log-message">{log.message}</span>
                            </div>
                        ))}
                        {callStatus === "analyzing" && (
                            <div className="log-entry info">
                                <span className="timestamp">[{new Date().toISOString().split("T")[1].split(".")[0]}]</span>
                                <span className="log-message">
                                    Analysis progress: {Math.min(progress, 100).toFixed(1)}% (ETA: {Math.floor((100 - progress) / 3)}s)
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="terminal-input">
                        <span className="prompt">root@detection-engine:~#</span>
                        <span className="cursor">|</span>
                    </div>
                </div>

                <div className="call-panel">
                    {activeSpeaker === "caller" ? (
                        <div className={`call-screen ${callStatus}`}>
                            <div className="caller-info">
                                <div className="avatar-container">
                                    <img src={callerInfo.avatar} alt="Caller" className="caller-avatar" />
                                    {callStatus === "analyzing" && (
                                        <div className="scanning-animation">
                                            <div className="scan-line"></div>
                                        </div>
                                    )}
                                </div>
                                <h2>{callerInfo.name}</h2>
                                <p className="caller-number">{callerInfo.number}</p>

                                {callStatus === "incoming" && (
                                    <div className="call-status">
                                        <div className="ripple-animation"></div>
                                        <span>INCOMING CALL</span>
                                    </div>
                                )}
                            </div>

                            {callStatus === "incoming" && (
                                <div className="call-buttons">
                                    <button className="decline-btn" onClick={handleDecline}>
                                        <span className="icon">✕</span>
                                        <span>Decline</span>
                                    </button>
                                    <button className="answer-btn" onClick={handleAnswer}>
                                        <span className="icon">✓</span>
                                        <span>Answer</span>
                                    </button>
                                </div>
                            )}

                            {callStatus === "analyzing" && (
                                <div className="analysis-container">
                                    <div className="analyzing-animation">
                                        <div className="wave"></div>
                                        <div className="wave"></div>
                                        <div className="wave"></div>
                                    </div>
                                    <p className="analyzing-text">Analyzing voice patterns...</p>
                                    <div className="progress-container">
                                        <div className="progress-bar">
                                            <div className="progress" style={{ width: `${progress}%` }}></div>
                                        </div>
                                        <span className="progress-text">{Math.min(progress, 100).toFixed(0)}%</span>
                                    </div>
                                </div>
                            )}

                            {callStatus === "scam-detected" && (
                                <div className="scam-alert">
                                    <div className="warning-icon">
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <h2>SCAM ALERT</h2>
                                    <p className="scam-description">Deepfake AI voice detected</p>
                                    <button className="end-call-btn" onClick={handleDecline}>
                                        <span className="icon">☎</span>
                                        <span>End Call</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="call-screen agent-active">
                            <div className="agent-info">
                                <div className="agent-avatar-container">
                                    <img src="/aditi-avatar.jpg" alt="Agent Aditi" className="agent-avatar" />
                                    <div className="verified-badge">
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M9 12L11 14L15 10M19.8761 9.12499C20.1184 9.88141 20.2366 10.6808 20.2366 11.5C20.2366 16.5 16.5 20.5 12 20.5C7.5 20.5 3.76343 16.5 3.76343 11.5C3.76343 6.5 7.5 2.5 12 2.5C13.3192 2.5 14.6186 2.88155 15.75 3.5M16.5 7.5C16.5 7.5 16.875 9.5 18 10.5C19.125 11.5 21 10.5 21 10.5"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <h2>Agent Aditi</h2>
                                <p className="agent-title">Security Specialist</p>
                                <div className="agent-status">
                                    <div className="pulse-animation"></div>
                                    <span>Active Intervention</span>
                                </div>
                            </div>
                            <div className="call-controls">
                                <button className="end-call-btn" onClick={handleDecline}>
                                    <span className="icon">☎</span>
                                    <span>End Intervention</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default App;
