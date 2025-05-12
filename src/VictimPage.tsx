import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import UnknownCallerProfilePhoto from "../public/blank-profile.png";

interface LogEntry {
    log: string;
    severity: "default" | "info" | "success" | "warning" | "error";
    timestamp: string;
}

interface VictimPageProps {
    callStatus: "incoming" | "analyzing" | "scam-detected" | "call-ended";
    progress: number;
    callerInfo: { name: string; number: string };
    handleDecline: () => void;
    handleAnswer: () => void;
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
    "Bank Account Compromise",
    "Fake Charity Donation",
    "Investment Scam",
    "Fake Covid-19 Relief",
    "Fake Government Grant",
    "Fake Delivery Notification",
    "Fake Covid Test Results",
    "Fake Insurance Policy",
    "Fake Inheritance Claim",
    "Fake Rental Property",
    "Fake Cryptocurrency Offer",
    "Fake Online Shopping Refund",
    "Fake Electricity Bill Payment",
    "Fake Water Bill Payment",
    "Fake Gas Connection Offer",
    "QR Code Phishing",
    "SIM Swap Fraud",
    "Business Email Compromise (BEC)",
    "AI Voice Impersonation Scam",
    "Fake Tech Device Recall",
    "Fake Antivirus Alert",
    "Subscription Renewal Scam",
    "Online Marketplace Overpayment Scam",
    "Fake Survey Participation Reward",
    "Phishing Link in Calendar Invite",
    "Scam Job Interview via Video Call",
    "Fake Domain Registrar Renewal",
    "Customs Narcotics Scam",
];

const LogMessage: React.FC<{ severity: string; message: string }> = ({ severity, message }) => {
    const [timestamp] = useState(new Date().toLocaleTimeString());

    return (
        <div className={`log-entry ${severity}`}>
            <span className="timestamp">[{timestamp}]</span>
            <span className="log-message">{message}</span>
        </div>
    );
};

const VictimPage: React.FC<VictimPageProps> = ({ callStatus, progress, callerInfo, handleDecline }) => {
    const scammerTerminalRef = useRef<HTMLDivElement>(null);
    const [currentPatternIndex, setCurrentPatternIndex] = useState(0);
    const [patternProgress, setPatternProgress] = useState(0);
    const [voicePrintProgress, setVoicePrintProgress] = useState(0);
    const [languageSearchProgress, setLanguageSearchProgress] = useState(0);
    const [reverificationProgress, setReverificationProgress] = useState(0);
    const [displayedLogs, setDisplayedLogs] = useState<LogEntry[]>([]);
    const [endingLogs, setEndingLogs] = useState<LogEntry[]>([]);
    const [scanStage, setScanStage] = useState<"initial" | "patterns" | "voiceprint" | "language" | "reverification" | "ending">("initial");
    const [initialLogs] = useState<LogEntry[]>([
        {
            log: "Initializing Digital Robocop v2.3.7",
            severity: "info",
            timestamp: new Date().toLocaleTimeString(),
        },
        {
            log: "Loading threat pattern database...",
            severity: "info",
            timestamp: new Date().toLocaleTimeString(),
        },
        {
            log: "Connecting to voiceprint registry...",
            severity: "info",
            timestamp: new Date().toLocaleTimeString(),
        },
        {
            log: "Establishing link to cognitive language model...",
            severity: "info",
            timestamp: new Date().toLocaleTimeString(),
        },
        {
            log: "Initiating real-time scam detection protocol",
            severity: "info",
            timestamp: new Date().toLocaleTimeString(),
        },
    ]);

    // Show initial logs with 500ms interval
    useEffect(() => {
        if (callStatus !== "analyzing" || scanStage !== "initial") return;

        const timer = setTimeout(() => {
            if (displayedLogs.length < initialLogs.length) {
                setDisplayedLogs((prev) => [...prev, initialLogs[prev.length]]);

                if (displayedLogs.length === initialLogs.length - 1) {
                    setScanStage("patterns");
                }
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [callStatus, displayedLogs.length, initialLogs, scanStage]);

    useEffect(() => {
        let timeoutId: number;
        let progressIntervalId: number;
        let voicePrintIntervalId: number;
        let languageSearchIntervalId: number;
        let reverificationIntervalId: number;

        const startPatternScan = () => {
            setPatternProgress(0);

            progressIntervalId = window.setInterval(() => {
                setPatternProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(progressIntervalId);
                        return 100;
                    }
                    return prev + 20;
                });
            }, 50);

            timeoutId = window.setTimeout(() => {
                if (currentPatternIndex < threatPatterns.length - 1) {
                    setCurrentPatternIndex((prev) => prev + 1);
                } else {
                    setScanStage("voiceprint");
                }
            }, 500);
        };

        const startVoicePrintScan = () => {
            setVoicePrintProgress(0);
            voicePrintIntervalId = window.setInterval(() => {
                setVoicePrintProgress((prev) => {
                    const newProgress = prev + 5;
                    if (newProgress >= 100) {
                        clearInterval(voicePrintIntervalId);
                        if (prev < 100) {
                            setScanStage("language");
                        }
                        return 100;
                    }
                    return newProgress;
                });
            }, 100);
        };

        const startLanguageSearch = () => {
            setLanguageSearchProgress(0);
            languageSearchIntervalId = window.setInterval(() => {
                setLanguageSearchProgress((prev) => {
                    const newProgress = prev + 2;
                    if (newProgress >= 100) {
                        clearInterval(languageSearchIntervalId);
                        if (prev < 100) {
                            setScanStage("reverification");
                        }
                        return 100;
                    }
                    return newProgress;
                });
            }, 80);
        };

        const startReverification = () => {
            setReverificationProgress(0);
            reverificationIntervalId = window.setInterval(() => {
                setReverificationProgress((prev) => {
                    const newProgress = prev + 2;
                    if (newProgress >= 100) {
                        clearInterval(reverificationIntervalId);
                        if (prev < 100) {
                            setScanStage("ending");
                        }
                        return 100;
                    }
                    return newProgress;
                });
            }, 40);
        };

        if (callStatus === "analyzing") {
            if (scanStage === "patterns") {
                startPatternScan();
            } else if (scanStage === "voiceprint") {
                startVoicePrintScan();
            } else if (scanStage === "language") {
                startLanguageSearch();
            } else if (scanStage === "reverification") {
                startReverification();
            }
        }

        return () => {
            clearTimeout(timeoutId);
            clearInterval(progressIntervalId);
            clearInterval(voicePrintIntervalId);
            clearInterval(languageSearchIntervalId);
            clearInterval(reverificationIntervalId);
        };
    }, [callStatus, currentPatternIndex, scanStage]);

    useEffect(() => {
        if (scanStage === "ending") {
            setEndingLogs((prevLogs) => [
                ...prevLogs,
                {
                    log: "Initiating call transfer protocol...",
                    severity: "warning",
                    timestamp: new Date().toLocaleTimeString(),
                },
                {
                    log: "Transferring call to Telangana Cyber Crime Command Center",
                    severity: "error",
                    timestamp: new Date().toLocaleTimeString(),
                },
            ]);
        }
    }, [scanStage]);

    useEffect(() => {
        if (scammerTerminalRef.current) {
            scammerTerminalRef.current.scrollTop = scammerTerminalRef.current.scrollHeight;
        }
    }, [displayedLogs, endingLogs]);

    const renderProgressBar = (progressValue: number) => {
        return (
            <div className="modern-progress-bar-container">
                <div className="modern-progress-bar">
                    <div className="modern-progress-fill" style={{ width: `${Math.min(progressValue, 100)}%` }}></div>
                </div>
                <span className="progress-percent-modern">{Math.min(progressValue, 100).toFixed(0)}%</span>
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
                                <LogMessage key={index} severity={log.severity} message={log.log} />
                            ))}

                            {["patterns", "voiceprint", "language", "reverification", "ending"].includes(scanStage) &&
                                currentPatternIndex < threatPatterns.length && (
                                    <>
                                        <LogMessage
                                            severity="warning"
                                            message={`Scanning for known threat patterns: ${threatPatterns[currentPatternIndex]}`}
                                        />
                                        <div className="hash-progress-container" style={{ marginTop: "10px" }}>
                                            {renderProgressBar(patternProgress)}
                                        </div>
                                    </>
                                )}

                            {["voiceprint", "language", "reverification", "ending"].includes(scanStage) && (
                                <>
                                    <LogMessage severity="error" message="Threat pattern scan complete - Fraud detected: Customs Narcotics Scam" />
                                    <LogMessage severity="warning" message="Searching for known scammer voice fingerprint" />
                                    <div className="hash-progress-container" style={{ marginTop: "10px" }}>
                                        {renderProgressBar(voicePrintProgress)}
                                    </div>
                                </>
                            )}

                            {["language", "reverification", "ending"].includes(scanStage) && (
                                <>
                                    <LogMessage severity="error" message="Voice fingerprint match found in scammer database (87% confidence)" />
                                    <LogMessage severity="info" message="Initiating cognitive language search..." />
                                    <LogMessage severity="warning" message="Cognitive Language Search: Connecting to Fine Tuned Model" />
                                    <div className="hash-progress-container" style={{ marginTop: "10px" }}>
                                        {renderProgressBar(languageSearchProgress)}
                                    </div>
                                </>
                            )}

                            {["reverification", "ending"].includes(scanStage) && (
                                <>
                                    <LogMessage severity="error" message="Language patterns matched known scam scripts (92% confidence)" />
                                    <LogMessage severity="warning" message="Initiating final re-verification process..." />
                                    <div className="hash-progress-container" style={{ marginTop: "10px" }}>
                                        {renderProgressBar(reverificationProgress)}
                                    </div>
                                </>
                            )}

                            {scanStage === "ending" && (
                                <>
                                    <LogMessage severity="error" message="Re-verification complete - all checks confirmed" />
                                    <LogMessage severity="error" message="Final verdict: HIGH CONFIDENCE SCAM DETECTED" />
                                    <LogMessage severity="error" message="SCAM DETECTED: Confidence level: 98.7%" />
                                </>
                            )}

                            {endingLogs.map((log, index) => (
                                <LogMessage key={`ending-${index}`} severity={log.severity} message={log.log} />
                            ))}
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
                                <div className="milestone-log-stack">
                                    {scanStage === "initial" && (
                                        <div className="milestone-log modern">
                                            <div className="log-content">
                                                <div className="log-title">System Initialization</div>
                                                <div className="log-message">Starting scam detection protocols...</div>
                                            </div>
                                        </div>
                                    )}
                                    {scanStage === "patterns" && (
                                        <>
                                            <div className="milestone-log modern accent">
                                                <div className="log-content">
                                                    <div className="log-title">Pattern Analysis</div>
                                                    <div className="log-message">Scanning for known scam patterns...</div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {scanStage === "voiceprint" && (
                                        <>
                                            <div className="milestone-log modern accent">
                                                <div className="log-content">
                                                    <div className="log-title">Voice Analysis</div>
                                                    <div className="log-message">Analyzing voice fingerprint</div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {scanStage === "language" && (
                                        <>
                                            <div className="milestone-log modern accent">
                                                <div className="log-content">
                                                    <div className="log-title">Language Processing</div>
                                                    <div className="log-message">Connecting to Fine Tuned Model</div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {scanStage === "reverification" && (
                                        <>
                                            <div className="milestone-log modern accent">
                                                <div className="log-content">
                                                    <div className="log-title">Final Verification</div>
                                                    <div className="log-message">Re-verifying scam indicators</div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {scanStage === "ending" && (
                                        <>
                                            <div className="milestone-log modern critical">
                                                <div className="log-content">
                                                    <div className="log-title">Final Verdict</div>
                                                    <div className="log-message">98.7% confidence: SCAM DETECTED</div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="analyzing-animation">
                                    <div className="wave"></div>
                                    <div className="wave"></div>
                                    <div className="wave"></div>
                                </div>

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
