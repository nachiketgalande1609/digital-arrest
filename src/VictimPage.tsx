import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import UnknownCallerProfilePhoto from "../public/blank-profile.png";

interface VictimPageProps {
    callStatus: "incoming" | "analyzing" | "scam-detected" | "call-ended";
    progress: number;
    callerInfo: { name: string; number: string };
    handleDecline: () => void;
    handleAnswer: () => void;
}

interface LogEntry {
    log: string;
    severity: "default" | "info" | "success" | "warning" | "error";
}

const threatPatterns = [
    "IRS/Tax Scam",
    "Tech Support Fraud",
    "Fake Bank Alert",
    "Social Security Number Suspension",
    "Fake Prize/Lottery Winning",
    "Grandparent/Relative Emergency",
    "Fake Debt Collection",
    "Romance Scam Opening",
    "Fake Job Offer",
    "Customs Narcotics Scam",
];

const VictimPage: React.FC<VictimPageProps> = ({ callStatus, progress, callerInfo, handleDecline }) => {
    const scammerTerminalRef = useRef<HTMLDivElement>(null);
    const [currentPatternIndex, setCurrentPatternIndex] = useState(0);
    const [patternProgress, setPatternProgress] = useState(0);
    const [displayedLogs, setDisplayedLogs] = useState<LogEntry[]>([]);

    useEffect(() => {
        let timeoutId: number;
        let progressIntervalId: number;

        const startPatternScan = () => {
            // Reset for new pattern
            setPatternProgress(0);

            // Start progress animation for current pattern
            progressIntervalId = window.setInterval(() => {
                setPatternProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(progressIntervalId);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 100);

            // Move to next pattern after delay
            timeoutId = window.setTimeout(() => {
                if (currentPatternIndex < threatPatterns.length - 1) {
                    setCurrentPatternIndex((prev) => prev + 1);
                }
            }, 1500);
        };

        if (callStatus === "analyzing") {
            if (currentPatternIndex === 0 && displayedLogs.length === 0) {
                // Initial log
                setDisplayedLogs([
                    {
                        log: `Scanning for known threat patterns: ${threatPatterns[0]}`,
                        severity: "info",
                    },
                ]);
            } else if (currentPatternIndex > 0) {
                // Update log for new pattern
                setDisplayedLogs((prev) => [
                    ...prev.slice(0, -1),
                    {
                        log: `Scanning for known threat patterns: ${threatPatterns[currentPatternIndex]}`,
                        severity: "info",
                    },
                ]);
            }
            startPatternScan();
        }

        return () => {
            clearTimeout(timeoutId);
            clearInterval(progressIntervalId);
        };
    }, [callStatus, currentPatternIndex]);

    // Scroll to bottom of terminal when logs update
    useEffect(() => {
        if (scammerTerminalRef.current) {
            scammerTerminalRef.current.scrollTop = scammerTerminalRef.current.scrollHeight;
        }
    }, [displayedLogs]);

    // Helper function to render the progress bar with hash symbols
    const renderProgressBar = (progressValue: number) => {
        const totalChars = 95;
        const filledChars = Math.round((progressValue / 100) * totalChars);
        const emptyChars = totalChars - filledChars;

        return (
            <div className="hash-progress-container">
                <span className="hash-filled">{"#".repeat(filledChars)}</span>
                <span className="hash-empty">{"..".repeat(emptyChars)}</span>
                <span className="progress-percent">{Math.min(progressValue, 100).toFixed(0)}%</span>
            </div>
        );
    };

    return (
        <div style={{ width: "100vw" }}>
            <div className="victim-container">
                <div className="terminal-container">
                    <div className="terminal-panel">
                        <div className="terminal-header">
                            <div className="terminal-buttons">
                                <div className="terminal-btn close"></div>
                                <div className="terminal-btn minimize"></div>
                                <div className="terminal-btn maximize"></div>
                            </div>
                            <div className="terminal-title">
                                <span className="app-name">Digital Robocop</span>
                                <span className="app-version">v2.3.7</span>
                            </div>
                            <div className="terminal-status">
                                <div className={`status-indicator ${callStatus}`}></div>
                                <span>{callStatus.toUpperCase()}</span>
                            </div>
                        </div>
                        <div className="terminal-body" ref={scammerTerminalRef}>
                            {displayedLogs.map((log, index) => (
                                <div key={index} className={`log-entry ${log.severity}`}>
                                    <span className="timestamp">[{new Date().toLocaleTimeString()}]</span>
                                    <span className="log-message">{log.log}</span>
                                </div>
                            ))}
                            {currentPatternIndex < threatPatterns.length && (
                                <div className="hash-progress-container" style={{ marginTop: "10px" }}>
                                    {renderProgressBar(patternProgress)}
                                </div>
                            )}
                            {currentPatternIndex === threatPatterns.length - 1 && patternProgress >= 100 && (
                                <div className={`log-entry error`}>
                                    <span className="timestamp">[{new Date().toLocaleTimeString()}]</span>
                                    <span className="log-message">Identified Threat pattern: Customs Narcotics Scam</span>
                                </div>
                            )}
                        </div>
                        <div className="terminal-input">
                            <span className="prompt">scam@detector:~#</span>
                            <span className="cursor">|</span>
                        </div>
                    </div>
                </div>

                {/* Rest of your existing JSX remains the same */}
                <div className="call-panel">
                    <div className={`call-screen ${callStatus}`}>
                        <div className="caller-info">
                            <div className="avatar-container">
                                <img src={UnknownCallerProfilePhoto} alt="Caller" className="caller-avatar" />
                            </div>
                            <h2>Unknown Caller</h2>
                            <p className="caller-number">{callerInfo.number}</p>

                            {callStatus === "incoming" && (
                                <div className="call-status">
                                    <div className="ripple-animation"></div>
                                    <span>INCOMING CALL</span>
                                </div>
                            )}
                        </div>

                        {callStatus === "analyzing" && (
                            <div className="analysis-container">
                                <div className="milestone-log">
                                    <p className="milestone-log sky">🔍 Scanning for threat patterns...</p>
                                </div>

                                <div className="analyzing-animation">
                                    <div className="wave"></div>
                                    <div className="wave"></div>
                                    <div className="wave"></div>
                                </div>

                                <p className="analyzing-text">
                                    {currentPatternIndex < threatPatterns.length
                                        ? `Checking pattern: ${threatPatterns[currentPatternIndex]}`
                                        : "Compiling final results..."}
                                </p>

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
                                <h1>SCAM ALERT</h1>
                                <h2>Transfering the Call to Telangana Cyber Crime Command Center</h2>
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
        </div>
    );
};

export default VictimPage;
