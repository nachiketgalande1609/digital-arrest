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
    const prabhatRef = useRef<HTMLAudioElement | null>(null);
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

    const logMemoryUsage = () => {
        if (Math.random() > 0.8) {
            // Only log 20% of the time
            addLog(
                `Memory usage: ${(Math.random() * 100).toFixed(2)}% (${Math.floor(Math.random() * 2048)}MB/${Math.floor(Math.random() * 4096)}MB)`,
                "debug"
            );
        }
    };

    const logFeatureAnalysis = () => {
        const features = ["pitch variance", "spectral centroid", "MFCC coefficients", "formant dispersion", "jitter", "shimmer", "harmonicity"];
        const feature = features[Math.floor(Math.random() * features.length)];
        addLog(`Analyzing ${feature}: deviation ${(Math.random() * 10).toFixed(2)}%`, "info");
    };

    const logModelUpdate = () => {
        if (Math.random() > 0.9) {
            // Only log 10% of the time
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

            const initLogs = setInterval(() => {
                logMemoryUsage();
            }, 1500); // Increased interval from 1s to 1.5s

            return () => {
                clearInterval(initLogs);
            };
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

                    // Reduced logging during analysis
                    if (Math.random() > 0.6) {
                        // Only log 40% of the time (down from 70%)
                        const randomActions = [
                            logFeatureAnalysis,
                            logMemoryUsage,
                            logModelUpdate,
                            () => addLog(`Processing frame ${Math.floor(prev * 50)} (checksum: ${generateRandomHex(8)})`),
                            () => addLog(`Comparing to ${Math.floor(Math.random() * 10000)} known samples`),
                        ];
                        randomActions[Math.floor(Math.random() * randomActions.length)]();
                    }

                    return prev + (Math.random() * 3 + 2);
                });
            }, 400); // Increased interval from 300ms to 400ms

            return () => clearInterval(analysisInterval);
        }
    }, [callStatus]);

    const handleAnswer = (): void => {
        addLog("User answered call - beginning analysis", "success");
        setCallStatus("analyzing");

        if (prabhatRef.current) {
            prabhatRef.current.play().catch((err) => console.error("Error playing Prabhat audio:", err));
            prabhatRef.current.onended = () => {
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
            <audio ref={prabhatRef} src="/prabhat.mp3" />
            <audio ref={aditiRef} src="/aditi.mp3" />
            <div className="app-container">
                <div className="terminal-panel">
                    <div className="terminal-header">
                        <div className="terminal-buttons">
                            <div className="terminal-btn close"></div>
                            <div className="terminal-btn minimize"></div>
                            <div className="terminal-btn maximize"></div>
                        </div>
                        <div className="terminal-title">deepfake-detection-engine --log-level=DEBUG</div>
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
                                <img src={callerInfo.avatar} alt="Caller" className="caller-avatar" />
                                <h2>{callerInfo.name}</h2>
                                <p>{callerInfo.number}</p>
                            </div>

                            {callStatus === "incoming" && (
                                <div className="call-buttons">
                                    <button className="decline-btn" onClick={handleDecline}>
                                        Decline
                                    </button>
                                    <button className="answer-btn" onClick={handleAnswer}>
                                        Answer
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
                                    <p>Analyzing voice patterns...</p>
                                    <div className="progress-bar">
                                        <div className="progress" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>
                            )}

                            {callStatus === "scam-detected" && (
                                <div className="scam-alert">
                                    <div className="warning-icon">⚠️</div>
                                    <h2>SCAM ALERT</h2>
                                    <p>Deepfake AI voice detected</p>
                                    <button className="end-call-btn" onClick={handleDecline}>
                                        End Call
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="call-screen agent-active">
                            <div className="agent-info">
                                <img src="/aditi-avatar.jpg" alt="Agent Aditi" className="agent-avatar" />
                                <h2>Agent Aditi</h2>
                                <p>Security Specialist</p>
                                <div className="agent-status">
                                    <div className="pulse-animation"></div>
                                    <span>Active Intervention</span>
                                </div>
                            </div>
                            <div className="call-controls">
                                <button className="end-call-btn" onClick={handleDecline}>
                                    End Intervention
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
