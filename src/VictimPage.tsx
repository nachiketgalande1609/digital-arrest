import React from "react";
import "./App.css";
import ScammerDetailsModal from "./components/modal/ScammerDetailsModal";

interface VictimPageProps {
    ringtoneRef: React.RefObject<HTMLAudioElement>;
    beepRef: React.RefObject<HTMLAudioElement>;
    victimAudioRef: React.RefObject<HTMLAudioElement>;
    scammerAudioRef: React.RefObject<HTMLAudioElement>;
    callStatus: "incoming" | "analyzing" | "scam-detected" | "call-ended";
    scammerLogs: Array<{ timestamp: string; message: string; type: string }>;
    scammerTerminalRef: React.RefObject<HTMLDivElement>;
    progress: number;
    callerInfo: { avatar: string; name: string; number: string };
    activeSpeaker: "caller" | "victim";
    handleDecline: () => void;
    handleAnswer: () => void;
    showScammerDetails: boolean;
    setShowScammerDetails: React.Dispatch<React.SetStateAction<boolean>>;
}

const VictimPage: React.FC<VictimPageProps> = ({
    ringtoneRef,
    beepRef,
    victimAudioRef,
    scammerAudioRef,
    callStatus,
    scammerLogs,
    scammerTerminalRef,
    progress,
    callerInfo,
    activeSpeaker,
    handleDecline,
    handleAnswer,
    showScammerDetails,
    setShowScammerDetails,
}) => {
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
