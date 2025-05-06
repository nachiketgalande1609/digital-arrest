import React, { useState, useEffect, useRef } from "react";
import "./App.css";

interface VictimPageProps {
  callStatus: "incoming" | "analyzing" | "scam-detected" | "call-ended";
  progress: number;
  callerInfo: { avatar: string; name: string; number: string };
  handleDecline: () => void;
  handleAnswer: () => void;
}

interface LogEntry {
  log: string;
  severity: "default" | "info" | "success" | "warning" | "error";
}

const VictimPage: React.FC<VictimPageProps> = ({
  callStatus,
  progress,
  callerInfo,
  handleDecline,
}) => {
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
    { log: "Boot sequence initiated...", severity: "default" },
    { log: "Verifying hardware integrity...", severity: "info" },
    { log: "CPU diagnostics passed", severity: "success" },
    { log: "Memory diagnostics passed", severity: "success" },
    { log: "Initializing real-time monitoring modules...", severity: "info" },
    { log: "Activating machine learning engine", severity: "info" },
    { log: "Loading NLP-based threat classification models", severity: "info" },
    { log: "Compiling behavioral detection logic", severity: "default" },
    { log: "Integrating external threat intelligence APIs", severity: "info" },
    {
      log: "Threat intelligence API #1 (GovSafe) connected",
      severity: "success",
    },
    {
      log: "Threat intelligence API #2 (ScamNet) connected",
      severity: "success",
    },
    {
      log: "Threat intelligence API #3 (VoiceTrack) connected",
      severity: "success",
    },
    { log: "Starting anomaly detection engine", severity: "info" },
    { log: "Loading user protection preferences", severity: "info" },
    { log: "Geo-fencing scam detection enabled", severity: "success" },
    { log: "Voiceprint library synchronized", severity: "success" },
    { log: "Creating secure analysis sandbox", severity: "info" },
    { log: "Sandbox integrity check passed", severity: "success" },
    {
      log: "Establishing secure connection with backend services",
      severity: "info",
    },
    { log: "Backend handshake completed", severity: "success" },
    { log: "Fetching latest scam pattern definitions", severity: "info" },
    { log: "Scam pattern database updated (v2025.05.01)", severity: "success" },
    { log: "AI risk evaluation module online", severity: "info" },
    { log: "Sentiment analysis engine initialized", severity: "info" },
    { log: "Phishing keyword database loaded", severity: "info" },
    { log: "Analyzing baseline audio fingerprints", severity: "info" },
    { log: "Baseline fingerprint generation complete", severity: "success" },
    { log: "Enabling proactive call scanning", severity: "info" },
    { log: "Configuring adaptive threat response flow", severity: "info" },
    { log: "Detecting local telephony environment", severity: "info" },
    { log: "VoIP routing paths mapped", severity: "success" },
    { log: "Call spoofing defense enabled", severity: "success" },
    { log: "Loading multilingual voice analysis models", severity: "info" },
    {
      log: "Language support initialized: EN, HI, MR, TA",
      severity: "success",
    },
    { log: "Voice gender profiling active", severity: "info" },
    { log: "Tone and urgency analysis calibrated", severity: "info" },
    { log: "AI model ready for incoming signal", severity: "success" },

    { log: "Loading AI voice pattern recognition models...", severity: "info" },
    { log: "Connected to Audio Fingerprinting Service", severity: "success" },
    { log: "System ready - awaiting call events", severity: "success" },
    {
      log: `Incoming call detected from ${callerInfo.number}`,
      severity: "warning",
    },
    { log: `Caller identified as ${callerInfo.name}`, severity: "info" },
    {
      log: "Starting comprehensive scam analysis protocol",
      severity: "default",
    },

    // Threat pattern detection logs
    { log: "Scanning for known threat patterns...", severity: "info" },
    {
      log: "Detecting Threat Pattern #TSC-0042: IRS/Tax Scam",
      severity: "warning",
    },
    {
      log: "Detecting Threat Pattern #TSC-0115: Tech Support Fraud",
      severity: "warning",
    },
    {
      log: "Detecting Threat Pattern #TSC-0087: Fake Bank Alert",
      severity: "warning",
    },
    {
      log: "Detecting Threat Pattern #TSC-0031: Social Security Number Suspension",
      severity: "warning",
    },
    {
      log: "Detecting Threat Pattern #TSC-0099: Fake Prize/Lottery Winning",
      severity: "warning",
    },
    {
      log: "Detecting Threat Pattern #TSC-0065: Grandparent/Relative Emergency",
      severity: "warning",
    },
    {
      log: "Detecting Threat Pattern #TSC-0073: Fake Debt Collection",
      severity: "warning",
    },
    {
      log: "Detecting Threat Pattern #TSC-0028: Romance Scam Opening",
      severity: "warning",
    },
    {
      log: "Detecting Threat Pattern #TSC-0054: Fake Job Offer",
      severity: "warning",
    },
    {
      log: "Detecting Threat Pattern #TSC-0042: Customs Narcotics Scam",
      severity: "warning",
    },
    {
      log: "Scammer impersonating Mumbai Customs Narcotics Division",
      severity: "error",
    },
    {
      log: "Scammer warning about parcel containing drugs and illegal items",
      severity: "error",
    },
    {
      log: "Threat pattern scan complete - Fraud detected: Customs Narcotics Scam",
      severity: "error",
    },

    // Continue with existing logs
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
    { log: "SCAM DETECTED: High confidence", severity: "error" },
    {
      log: "Confidence level: 98.7% - Scam call highly likely",
      severity: "warning",
    },
    {
      log: "Reverifying call analysis to confirm scam detection",
      severity: "info",
    },
    { log: "Reverification complete: Confirmed Scam Call", severity: "error" },
    {
      log: "Transfering call to Telangana Cyber Crime Command Center",
      severity: "warning",
    },
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
        timeoutId = window.setTimeout(
          () => displayLogsSequentially(index + 1),
          500
        );
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
      scammerTerminalRef.current.scrollTop =
        scammerTerminalRef.current.scrollHeight;
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
                <img
                  src={callerInfo.avatar}
                  alt="Caller"
                  className="caller-avatar"
                />
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
                  {currentStep === 0 && (
                    <p className="milestone-log sky">
                      🔍 Starting comprehensive analysis...
                    </p>
                  )}
                  {currentStep === 1 && (
                    <p className="milestone-log sky">
                      📡 Analyzing call metadata and routing
                    </p>
                  )}
                  {currentStep === 2 && (
                    <p className="milestone-log green">
                      🌐 Checking threat databases
                    </p>
                  )}
                  {currentStep === 3 && (
                    <p className="milestone-log yellow">
                      🔍 Running voice pattern analysis
                    </p>
                  )}
                  {currentStep === 4 && (
                    <p className="milestone-log orange">
                      📶 Validating caller identity
                    </p>
                  )}
                  {currentStep >= 5 && (
                    <p className="milestone-log red">
                      ✅ Finalizing assessment
                    </p>
                  )}
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
                    <div
                      className="progress"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {Math.min(progress, 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            )}

            {callStatus === "scam-detected" && (
              <div className="scam-alert">
                <div className="warning-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
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
                <h2>
                  Transfering the Call to Telangana Cyber Crime Command Center
                </h2>
                <button className="end-call-btn" onClick={handleDecline}>
                  <span className="icon">☎</span>
                  <span>End Call</span>
                </button>
              </div>
            )}
            {callStatus === "call-ended" && (
              <div className="call-ended-screen">
                <div className="call-ended-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
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
