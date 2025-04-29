import React, { useState, useEffect, useRef } from "react";
import "./App.css";

interface LogEntry {
    timestamp: string;
    message: string;
    type: string;
}

interface VictimPageProps {
    callStatus: "incoming" | "analyzing" | "scam-detected" | "call-ended";
    progress: number;
    callerInfo: { avatar: string; name: string; number: string };
    activeSpeaker: "caller" | "victim";
    handleDecline: () => void;
    handleAnswer: () => void;
}

const VictimPage: React.FC<VictimPageProps> = ({ callStatus, progress, callerInfo, activeSpeaker, handleDecline }) => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const scammerTerminalRef = useRef<HTMLDivElement>(null);
    const lastLogTimestamp = useRef<Date | null>(null);
    const loggedSteps = useRef<Set<number>>(new Set());

    // Helper function to add a new log entry with enhanced context
    const addLog = (message: string, type: string = "info") => {
        const timestamp = new Date().toISOString().split("T")[1].split(".")[0];
        const now = new Date();

        // Only log if enough time has passed since the last log (e.g., 1 second)
        if (!lastLogTimestamp.current || now.getTime() - lastLogTimestamp.current.getTime() > 1000) {
            setLogs((prev) => [...prev, { timestamp, message, type }]);
            lastLogTimestamp.current = now;
        }
    };

    // Scroll to bottom of terminal when logs update
    useEffect(() => {
        if (scammerTerminalRef.current) {
            scammerTerminalRef.current.scrollTop = scammerTerminalRef.current.scrollHeight;
        }
    }, [logs]);

    // Initialize logs when component mounts
    useEffect(() => {
        const initialLogs: LogEntry[] = [
            { timestamp: new Date().toISOString().split("T")[1].split(".")[0], message: "Initializing scam detection system...", type: "system" },
            { timestamp: new Date().toISOString().split("T")[1].split(".")[0], message: "Loading voice pattern databases...", type: "system" },
            {
                timestamp: new Date().toISOString().split("T")[1].split(".")[0],
                message: "Connecting to Telangana Cyber Bureau API...",
                type: "system",
            },
            {
                timestamp: new Date().toISOString().split("T")[1].split(".")[0],
                message: "System ready - waiting for incoming call",
                type: "success",
            },
        ];
        setLogs(initialLogs);
    }, []);

    // Handle call status changes with detailed logging
    useEffect(() => {
        switch (callStatus) {
            case "incoming":
                addLog(`Incoming call detected from ${callerInfo.number}. Starting call screening process...`, "warning");
                addLog(`Caller info: ${callerInfo.name} (${callerInfo.number})`, "info");
                break;
            case "analyzing":
                addLog(`Analyzing voice patterns for ${activeSpeaker}...`, "info");
                addLog("Comparing to known scam patterns and databases...", "info");
                break;
            case "scam-detected":
                addLog("Pattern matches known IRS scam template.", "danger");
                addLog("Alerting authorities and terminating call immediately.", "warning");
                break;
            case "call-ended":
                addLog("Call terminated by user.", "info");
                addLog("Saving analysis results to database for further investigation.", "system");
                break;
        }
    }, [callStatus, callerInfo.number, activeSpeaker]);

    // Handle progress updates with enhanced messages
    useEffect(() => {
        if (callStatus === "analyzing" && progress > 0 && progress <= 100) {
            if (progress >= 20 && progress < 40 && !loggedSteps.current.has(1)) {
                addLog(
                    "Step 1 (2025‑04‑21T00:34:02Z): Captured VoIP SIP INVITE at edge firewall, extracted source IP 203.207.64.100, logged Call‑ID “ABC123XYZ” and timestamp.",
                    "warning"
                );
                loggedSteps.current.add(1);
            } else if (progress >= 40 && progress < 60 && !loggedSteps.current.has(2)) {
                addLog(
                    "Step 2 (2025‑04‑21T00:34:48Z): Ran WHOIS on 203.207.64.100; found allocation to EZECOM Ltd (AS24560), Phnom Penh, Cambodia; flagged in threat‑intel DB for past VoIP fraud reports.",
                    "warning"
                );
                loggedSteps.current.add(2);
            } else if (progress >= 60 && progress < 80 && !loggedSteps.current.has(3)) {
                addLog(
                    "Step 3 (2025‑04‑21T00:35:10Z): Cross‑referenced 203.207.64.100 against known VPN exit nodes—matched “ExpressVPN Phnom Penh Exit.” Submitted MLAT request to Cambodian Ministry of Post & Telecom for subscriber logs.",
                    "warning"
                );
                loggedSteps.current.add(3);
            } else if (progress >= 80 && progress < 90 && !loggedSteps.current.has(4)) {
                addLog(
                    "Step 4 (2025‑04‑21T00:35:34Z): Analyzed ISP NetFlow—identified NAT of 203.207.64.100:5060 to Smart Axiata 4G tower ID 10234 in Phnom Penh; updated geofence alert to cyber cell dashboard.",
                    "warning"
                );
                loggedSteps.current.add(4);
            } else if (progress >= 90 && progress <= 100 && !loggedSteps.current.has(5)) {
                addLog(
                    "Step 5 (2025‑04‑21T00:35:58Z): Finalized full packet capture; case CYB20250421‑0567 opened with Mumbai Cybercrime Dept and evidence forwarded via Interpol to Cambodia Cyber & Joint Crimes Unit for subscriber identification.",
                    "error"
                );
                loggedSteps.current.add(5);
            }
        }
    }, [progress, callStatus]);

    return (
        <div style={{ width: "100vw" }}>
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
                                <span className="app-name">Digital Arrest</span>
                                <span className="app-version">v2.3.7</span>
                            </div>
                            <div className="terminal-status">
                                <div className={`status-indicator ${callStatus}`}></div>
                                <span>{callStatus.toUpperCase()}</span>
                            </div>
                        </div>
                        <div className="terminal-body" ref={scammerTerminalRef}>
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

                {/* Rest of your existing JSX remains the same */}
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

                        {callStatus === "analyzing" && (
                            <div className="analysis-container">
                                <div className="milestone-log">
                                    {progress < 20 && <p className="milestone-log sky">🔍 Starting voice analysis...</p>}
                                    {progress >= 20 && progress < 40 && (
                                        <p className="milestone-log sky">
                                            📡 {activeSpeaker === "caller" ? "Scammer" : "Victim"} speaking - analyzing voice patterns
                                        </p>
                                    )}
                                    {progress >= 40 && progress < 60 && (
                                        <p className="milestone-log green">
                                            🌐 Comparing to known {activeSpeaker === "caller" ? "scam" : "legitimate"} voice samples
                                        </p>
                                    )}
                                    {progress >= 60 && progress < 80 && (
                                        <p className="milestone-log yellow">
                                            🔍 Detecting {activeSpeaker === "caller" ? "synthetic" : "natural"} speech characteristics
                                        </p>
                                    )}
                                    {progress >= 80 && progress < 100 && (
                                        <p className="milestone-log orange">
                                            📶 {activeSpeaker === "caller" ? "High" : "Low"} probability of voice manipulation
                                        </p>
                                    )}
                                    {progress >= 100 && <p className="milestone-log red">✅ Analysis complete</p>}
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
                                <h2>Transfering the Call to Telangana Cyber Bureau</h2>
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
