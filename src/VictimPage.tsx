import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import ScammerDetailsModal from "./components/modal/ScammerDetailsModal";

type CallStatus = "incoming" | "analyzing" | "scam-detected" | "call-ended";
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

const generateRandomUUID = (): string => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

const VictimPage: React.FC = () => {
    const [callStatus, setCallStatus] = useState<CallStatus>("incoming");
    const [progress, setProgress] = useState<number>(0);
    const [scammerLogs, setScammerLogs] = useState<LogEntry[]>([]);
    const [activeSpeaker, setActiveSpeaker] = useState<"victim" | "caller">("caller");
    const [currentAudioIndex, setCurrentAudioIndex] = useState<number>(0);
    const [showScammerDetails, setShowScammerDetails] = useState<boolean>(false);

    const audioFiles = [
        { src: "/1_victim.mp3", type: "victim" },
        { src: "/2_scammer.mp3", type: "caller" },
        { src: "/3_victim.mp3", type: "victim" },
        { src: "/4_scammer.mp3", type: "caller" },
        { src: "/5_victim.mp3", type: "victim" },
        { src: "/6_scammer.mp3", type: "caller" },
        { src: "/7_victim.mp3", type: "victim" },
    ];

    const [callerInfo] = useState<CallerInfo>({
        name: "Unknown Caller",
        number: "+1 (555) 123-4567",
        avatar: "https://img.freepik.com/premium-photo/male-customer-service-3d-cartoon-avatar-portrait_839035-522335.jpg",
    });

    const scammerTerminalRef = useRef<HTMLDivElement>(null);
    const ringtoneRef = useRef<HTMLAudioElement | null>(null);
    const victimAudioRef = useRef<HTMLAudioElement | null>(null);
    const scammerAudioRef = useRef<HTMLAudioElement | null>(null);
    const beepRef = useRef<HTMLAudioElement | null>(null);

    const addScammerLog = (message: string, type: LogEntry["type"] = "info") => {
        const timestamp = new Date().toISOString().split("T")[1].split(".")[0];
        setScammerLogs((prev) => [...prev.slice(-200), { timestamp, message, type }]);
    };

    const logFeatureAnalysis = () => {
        const features = ["pitch variance", "spectral centroid", "MFCC coefficients", "formant dispersion", "jitter", "shimmer", "harmonicity"];
        const feature = features[Math.floor(Math.random() * features.length)];
        addScammerLog(`Analyzing ${feature}: deviation ${(Math.random() * 10).toFixed(2)}%`, "info");
    };

    const logModelUpdate = () => {
        if (Math.random() > 0.9) {
            addScammerLog(`Updating detection model weights (epoch: ${Math.floor(Math.random() * 100)}, loss: ${Math.random().toFixed(4)})`, "debug");
        }
    };

    // Simulate call flow with reduced logging
    useEffect(() => {
        if (callStatus === "incoming") {
            addScammerLog("=== SCAM DETECTOR TERMINAL v2.3.7 ===", "info");
            addScammerLog("Initializing scam detection...", "info");
            addScammerLog(`Session ID: ${generateRandomUUID()}`, "debug");
            addScammerLog("Loading threat intelligence...", "info");
            addScammerLog('Model "spectral-v3" loaded (28.2MB)', "success");
            addScammerLog("Call initiated to victim", "info");
        }

        if (callStatus === "analyzing") {
            addScammerLog("=== BEGINNING SCAMMER ANALYSIS ===", "info");
            addScammerLog("Analyzing scammer voice patterns...", "info");

            const loggedMilestones = new Set();

            const analysisInterval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(analysisInterval);

                        if (!loggedMilestones.has(100)) {
                            loggedMilestones.add(100);
                            addScammerLog("ALERT: Synthetic voice patterns detected!", "error");
                            addScammerLog("Confidence: 94.2% (±2.1%)", "error");
                            addScammerLog("Signature match to known GAN-generated samples", "error");
                        }

                        return 100;
                    }

                    const nextProgress = prev + (Math.random() * 3 + 2);

                    const milestones = [
                        {
                            threshold: 20,
                            scammerMsg: "Step 1: Detected VoIP masking patterns",
                        },
                        {
                            threshold: 40,
                            scammerMsg: "Step 2: Identified Cambodian IP address",
                        },
                        {
                            threshold: 60,
                            scammerMsg: "Step 3: Matched to known scammer tactics",
                        },
                        {
                            threshold: 80,
                            scammerMsg: "Step 4: Confirmed synthetic voice artifacts",
                        },
                    ];

                    milestones.forEach(({ threshold, scammerMsg }) => {
                        if (prev < threshold && nextProgress >= threshold && !loggedMilestones.has(threshold)) {
                            addScammerLog(scammerMsg, "warning");
                            loggedMilestones.add(threshold);
                        }
                    });

                    if (Math.random() > 0.6) {
                        const randomActions = [
                            () => logFeatureAnalysis(),
                            () => logModelUpdate(),
                            () => addScammerLog(`Analyzing scammer sample ${Math.floor(prev * 50)}`),
                        ];
                        randomActions[Math.floor(Math.random() * randomActions.length)]();
                    }

                    return nextProgress;
                });
            }, 1500);

            return () => clearInterval(analysisInterval);
        }
    }, [callStatus]);

    const playAudioSequence = () => {
        if (currentAudioIndex >= audioFiles.length) {
            setCallStatus("call-ended");
            addScammerLog("Call session terminated", "info");
            return;
        }

        const currentAudio = audioFiles[currentAudioIndex];
        setActiveSpeaker(currentAudio.type === "victim" ? "victim" : "caller");

        const targetAudioRef = currentAudio.type === "victim" ? victimAudioRef : scammerAudioRef;

        if (targetAudioRef.current) {
            targetAudioRef.current.src = currentAudio.src;
            targetAudioRef.current.onended = () => {
                if (currentAudioIndex === audioFiles.length - 1) {
                    setCallStatus("scam-detected");
                } else {
                    setCurrentAudioIndex((prev) => prev + 1);
                }
            };

            targetAudioRef.current.play().catch((err) => {
                console.error("Error playing audio:", err);
                setTimeout(() => {
                    if (currentAudioIndex === audioFiles.length - 1) {
                        setCallStatus("scam-detected");
                    } else {
                        setCurrentAudioIndex((prev) => prev + 1);
                    }
                }, 1000);
            });

            if (currentAudio.type === "victim") {
                addScammerLog("Listening to victim response", "info");
            } else {
                addScammerLog("Scammer speaking - analyzing tactics", "info");
            }
        }
    };

    useEffect(() => {
        if (callStatus === "analyzing") {
            playAudioSequence();
        }
    }, [currentAudioIndex, callStatus]);

    const handleAnswer = (): void => {
        addScammerLog("Call answered - initiating analysis", "info");
        setCallStatus("analyzing");
        setCurrentAudioIndex(0);
    };

    const handleDecline = (): void => {
        addScammerLog("Call rejected by target", "warning");
        setCallStatus("incoming");
        setProgress(0);
        setScammerLogs([]);
        setActiveSpeaker("caller");
        setCurrentAudioIndex(0);
    };

    useEffect(() => {
        if (callStatus === "scam-detected" && beepRef.current) {
            setShowScammerDetails(true);
            beepRef.current.currentTime = 0;
            beepRef.current.play().catch((err) => {
                console.error("Error playing beep sound:", err);
            });
        }
    }, [callStatus]);

    // Auto-scroll terminal to bottom
    useEffect(() => {
        if (scammerTerminalRef.current) {
            scammerTerminalRef.current.scrollTop = scammerTerminalRef.current.scrollHeight;
        }
    }, [scammerLogs]);

    return (
        <div style={{ width: "100vw" }}>
            <audio ref={ringtoneRef} src="/ringtone.mp3" />
            <audio ref={beepRef} src="/beep.mp3" />
            <audio ref={victimAudioRef} />
            <audio ref={scammerAudioRef} />
            <div className="victim-container">
                <div className="terminal-container">
                    {/* Single Terminal */}
                    <div className="terminal-panel">
                        <div className="terminal-header">
                            <div className="terminal-buttons">
                                <div className="terminal-btn close"></div>
                                <div className="terminal-btn minimize"></div>
                                <div className="terminal-btn maximize"></div>
                            </div>
                            <div className="terminal-title">
                                <span className="app-name">Scam Detector</span>
                                <span className="app-version">v2.3.7</span>
                            </div>
                            <div className="terminal-status">
                                <div className={`status-indicator ${callStatus}`}></div>
                                <span>{callStatus.toUpperCase()}</span>
                            </div>
                        </div>
                        <div className="terminal-body" ref={scammerTerminalRef}>
                            {scammerLogs.map((log, index) => (
                                <div key={index} className={`log-entry ${log.type}`}>
                                    <span className="timestamp">[{log.timestamp}]</span>
                                    <span className="log-message">{log.message}</span>
                                </div>
                            ))}
                            {callStatus === "analyzing" && (
                                <div className="log-entry info">
                                    <span className="timestamp">[{new Date().toISOString().split("T")[1].split(".")[0]}]</span>
                                    <span className="log-message">
                                        Detection progress: {Math.min(progress, 100).toFixed(1)}% (ETA: {Math.floor((100 - progress) / 3)}s)
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="terminal-input">
                            <span className="prompt">scam@detector:~#</span>
                            <span className="cursor">|</span>
                        </div>
                    </div>
                </div>

                <div className="call-panel">
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
                            <h2>{activeSpeaker === "caller" ? callerInfo.name : "Victim"}</h2>
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
                                <div className="milestone-log-stack">
                                    {progress >= 20 && (
                                        <p className={`milestone-log sky ${progress >= 40 ? "faded faded-4" : ""}`}>
                                            📡 {activeSpeaker === "caller" ? "Scammer" : "Victim"} speaking - analyzing voice patterns
                                        </p>
                                    )}
                                    {progress >= 40 && (
                                        <p className={`milestone-log green ${progress >= 60 ? "faded faded-3" : ""}`}>
                                            🌐 Comparing to known {activeSpeaker === "caller" ? "scam" : "legitimate"} voice samples
                                        </p>
                                    )}
                                    {progress >= 60 && (
                                        <p className={`milestone-log yellow ${progress >= 80 ? "faded faded-2" : ""}`}>
                                            🔍 Detecting {activeSpeaker === "caller" ? "synthetic" : "natural"} speech characteristics
                                        </p>
                                    )}
                                    {progress >= 80 && (
                                        <p className={`milestone-log orange ${progress >= 100 ? "faded faded-1" : ""}`}>
                                            📶 {activeSpeaker === "caller" ? "High" : "Low"} probability of voice manipulation
                                        </p>
                                    )}
                                </div>

                                <div className="analyzing-animation">
                                    <div className="wave"></div>
                                    <div className="wave"></div>
                                    <div className="wave"></div>
                                </div>

                                <p className="analyzing-text">Analyzing {activeSpeaker === "caller" ? "scammer" : "victim"} voice...</p>

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
                                <div className="milestone-log-stack">
                                    <p className="milestone-log red-glow">
                                        🚨 SCAM DETECTED | Confidence: 94.2% | Synthetic voice patterns identified
                                    </p>
                                </div>
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
                        {callStatus === "call-ended" && (
                            <div className="call-ended-screen">
                                <div className="call-ended-icon">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M16 8L8 16M8 8L16 16M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                                <h2>Call Ended</h2>
                                <p className="call-duration">Duration: 1:24</p>
                                <div className="call-summary">
                                    <div className="summary-item">
                                        <span className="summary-label">Result:</span>
                                        <span className="summary-value scam">Scam Detected</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">Action:</span>
                                        <span className="summary-value">Call terminated</span>
                                    </div>
                                </div>
                                <button className="close-call-btn" onClick={handleDecline}>
                                    <span className="icon">✕</span>
                                    <span>Close</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {showScammerDetails && <ScammerDetailsModal onClose={() => setShowScammerDetails(false)} />}
        </div>
    );
};

export default VictimPage;
