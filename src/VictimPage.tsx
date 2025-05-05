import React, { useState, useEffect, useRef } from "react";
import "./App.css";

interface VictimPageProps {
    callStatus: "incoming" | "analyzing" | "scam-detected" | "call-ended";
    progress: number;
    callerInfo: { avatar: string; name: string; number: string };
    activeSpeaker: "caller" | "victim";
    handleDecline: () => void;
    handleAnswer: () => void;
}

interface LogEntry {
    log: string;
    severity: "default" | "info" | "success" | "warning" | "error";
}

const VictimPage: React.FC<VictimPageProps> = ({ callStatus, progress, callerInfo, activeSpeaker, handleDecline }) => {
    const scammerTerminalRef = useRef<HTMLDivElement>(null);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [displayedLogs, setDisplayedLogs] = useState<any>([]);

    // Steps with their descriptions
    const steps = [
        {
            title: "Connecting to audio fingerprinting service...",
            message: "Establishing secure connection to voice analysis API",
        },
        {
            title: "Analyzing call metadata...",
            message: "Extracting SIP headers and network routing information",
        },
        {
            title: "Checking threat intelligence databases...",
            message: "Querying known scam number registries",
        },
        {
            title: "Running voice pattern analysis...",
            message: "Comparing to known scammer voice profiles",
        },
        {
            title: "Validating caller identity...",
            message: "Cross-referencing with telecom provider records",
        },
        {
            title: "Finalizing scam probability assessment...",
            message: "Compiling all detection indicators",
        },
    ];

    const allLogs: LogEntry[] = [
        { log: "Initializing Digital Robocop...", severity: "default" },
        { log: "Loading AI voice pattern recognition models...", severity: "info" },
        { log: "Connected to Audio Fingerprinting Service", severity: "success" },
        { log: "System ready - awaiting call events", severity: "success" },
        { log: `Incoming call detected from ${callerInfo.number}`, severity: "warning" },
        { log: `Caller identified as ${callerInfo.name}`, severity: "info" },
        { log: "Starting comprehensive scam analysis protocol", severity: "default" },
        { log: "Connecting to audio fingerprinting service...", severity: "info" },
        { log: "Audio fingerprint analysis complete", severity: "success" },
        { log: "Analyzing call metadata...", severity: "info" },
        { log: "Metadata analysis complete", severity: "success" },
        { log: "Checking threat intelligence databases...", severity: "info" },
        { log: "Threat database query complete", severity: "success" },
        { log: "Running voice pattern analysis...", severity: "warning" },
        { log: "Voice pattern matched known scammer profiles", severity: "error" },
        { log: "Validating caller identity...", severity: "info" },
        { log: "Caller identity verification failed", severity: "error" },
        { log: "Finalizing scam probability assessment...", severity: "info" },
        { log: "SCAM DETECTED: High confidence (98.7%)", severity: "error" },
        { log: "Transfering call to Cyber Security Command Center", severity: "warning" },
    ];

    useEffect(() => {
        let timeoutId: number;

        const displayLogsSequentially = (index: number) => {
            if (index < allLogs.length) {
                const logWithTimestamp = {
                    ...allLogs[index],
                    timestamp: new Date().toLocaleTimeString(),
                };
                setDisplayedLogs((prev: any) => [...prev, logWithTimestamp]);
                timeoutId = window.setTimeout(() => displayLogsSequentially(index + 1), 2000);
            }
        };

        if (callStatus === "incoming" || callStatus === "analyzing") {
            if (callStatus === "incoming") {
                setDisplayedLogs([]);
            }
            displayLogsSequentially(0);
        }

        return () => {
            clearTimeout(timeoutId);
        };
    }, [callStatus]);

    // Scroll to bottom of terminal when logs update
    useEffect(() => {
        if (scammerTerminalRef.current) {
            scammerTerminalRef.current.scrollTop = scammerTerminalRef.current.scrollHeight;
        }
    }, [displayedLogs]);

    // Handle call status changes
    useEffect(() => {
        if (callStatus === "incoming") {
            setCurrentStep(0);
        }
    }, [callStatus]);

    // Handle progress updates
    useEffect(() => {
        if (callStatus === "analyzing") {
            const step = Math.floor(progress / (100 / steps.length));

            if (step !== currentStep) {
                setCurrentStep(step);
            }
        }
    }, [progress, callStatus]);

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
                            {displayedLogs.map(
                                (log: any, index: any) =>
                                    log && (
                                        <div key={index} className={`log-entry ${log.severity}`}>
                                            <span className="timestamp">[{log.timestamp}]</span>
                                            <span className="log-message">{log.log}</span>
                                        </div>
                                    )
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
                                <img src={callerInfo.avatar} alt="Caller" className="caller-avatar" />
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
                                    {currentStep === 0 && <p className="milestone-log sky">🔍 Starting comprehensive analysis...</p>}
                                    {currentStep === 1 && <p className="milestone-log sky">📡 Analyzing call metadata and routing</p>}
                                    {currentStep === 2 && <p className="milestone-log green">🌐 Checking threat databases</p>}
                                    {currentStep === 3 && <p className="milestone-log yellow">🔍 Running voice pattern analysis</p>}
                                    {currentStep === 4 && <p className="milestone-log orange">📶 Validating caller identity</p>}
                                    {currentStep >= 5 && <p className="milestone-log red">✅ Finalizing assessment</p>}
                                </div>

                                <div className="analyzing-animation">
                                    <div className="wave"></div>
                                    <div className="wave"></div>
                                    <div className="wave"></div>
                                </div>

                                <p className="analyzing-text">
                                    {currentStep < steps.length
                                        ? `Step ${currentStep + 1}: ${steps[currentStep].title}`
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
                                <h2>Transfering the Call to Telangana Cyber Security Command Center</h2>
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
