import React from "react";
import "./modal.css";

interface ScammerDetails {
    id: string;
    name: string;
    phoneNumber: string;
    location: string;
    coordinates: [number, number];
    ipAddress: string;
    vpnProvider: string;
    carrier: string;
    threatLevel: "HIGH" | "CRITICAL" | "SEVERE";
    knownAssociates: string[];
    modusOperandi: string[];
    voiceBiometrics: {
        match: number;
        syntheticScore: number;
        gANFeatures: string[];
    };
    technicalFootprint: {
        deviceFingerprint: string;
        callPattern: string;
        infrastructure: string[];
    };
    caseStatus: "Active" | "Archived" | "Warrant Issued";
}

const ScammerDetailsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const scammerData: ScammerDetails = {
        id: "CCD-2023-4872",
        name: "Operation Silver Tongue - Primary Suspect",
        phoneNumber: "+91 98XXXXXX21 (Burner)",
        location: "Hyderabad, Telangana, India",
        coordinates: [17.385, 78.4867],
        ipAddress: "182.72.123.45 → VPN Exit (Singapore)",
        vpnProvider: "NordVPN (Compromised Account)",
        carrier: "Jio Mobile (SIM Box Spoofing)",
        threatLevel: "CRITICAL",
        knownAssociates: ["CCD-2023-4871 (Money Mule)", "CCD-2022-3156 (SIM Provider)", "Unidentified Voice Actor"],
        modusOperandi: ["AI Voice Cloning (v3.2)", "Call Center Spoofing", "IRS/Tech Support Hybrid", "Multi-layer Money Laundering"],
        voiceBiometrics: {
            match: 89,
            syntheticScore: 94,
            gANFeatures: ["Spectro-temporal artifacts", "Pitch consistency 98.2%"],
        },
        technicalFootprint: {
            deviceFingerprint: "Android 11 (Custom ROM) → IMEI Spoofed",
            callPattern: "48hr cycles, targets elderly between 10AM-2PM",
            infrastructure: ["AWS EC2 t3.large", "Ozeki SMS Gateway", "Custom SIP Trunk"],
        },
        caseStatus: "Active",
    };

    return (
        <div className="cyber-modal-overlay">
            <div className="cyber-modal">
                {/* <div className="cyber-modal-header">
                    <div className="case-id-badge">{scammerData.id}</div>
                    <h2>
                        <span className="threat-level-badge">{scammerData.threatLevel}</span>
                        {scammerData.name}
                    </h2>
                    
                </div> */}

                <div className="cyber-close-btn" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="#ff4d4d" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>

                <div className="cyber-modal-body">
                    <div className="cyber-stats-grid">
                        <div className="cyber-stat-card critical">
                            <div className="stat-label">Voice Synthetic Score</div>
                            <div className="stat-value">{scammerData.voiceBiometrics.syntheticScore}%</div>
                            <div className="stat-bar">
                                <div className="stat-bar-fill" style={{ width: `${scammerData.voiceBiometrics.syntheticScore}%` }}></div>
                            </div>
                        </div>

                        <div className="cyber-stat-card high">
                            <div className="stat-label">Biometric Match</div>
                            <div className="stat-value">{scammerData.voiceBiometrics.match}%</div>
                            <div className="stat-bar">
                                <div className="stat-bar-fill" style={{ width: `${scammerData.voiceBiometrics.match}%` }}></div>
                            </div>
                        </div>

                        <div className="cyber-stat-card">
                            <div className="stat-label">Case Status</div>
                            <div className="stat-value status-badge">{scammerData.caseStatus}</div>
                        </div>
                    </div>

                    <div className="cyber-detail-section">
                        <h3 className="section-title">OPERATIONAL INTELLIGENCE</h3>
                        <div className="cyber-detail-grid">
                            <div className="detail-item">
                                <span className="detail-label">Last Known Location</span>
                                <span className="detail-value">
                                    {scammerData.location}
                                    <span className="gps-coords">{scammerData.coordinates.join(", ")}</span>
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Network Path</span>
                                <span className="detail-value warning">{scammerData.ipAddress}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">VPN Provider</span>
                                <span className="detail-value">{scammerData.vpnProvider}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Carrier Spoof</span>
                                <span className="detail-value">{scammerData.carrier}</span>
                            </div>
                        </div>
                    </div>

                    <div className="cyber-detail-section">
                        <h3 className="section-title">TECHNICAL FOOTPRINT</h3>
                        <div className="cyber-tech-grid">
                            <div className="tech-item">
                                <span className="tech-label">Device Fingerprint</span>
                                <span className="tech-value">{scammerData.technicalFootprint.deviceFingerprint}</span>
                            </div>
                            {/* <div className="tech-item full-width">
                                <span className="tech-label">Infrastructure</span>
                                <div className="tech-tags">
                                    {scammerData.technicalFootprint.infrastructure.map((item, i) => (
                                        <span key={i} className="tech-tag">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div> */}
                        </div>
                    </div>

                    <div className="cyber-detail-section">
                        <h3 className="section-title">VOICE BIOMETRICS</h3>
                        <div className="cyber-bio-features">
                            {scammerData.voiceBiometrics.gANFeatures.map((feature, i) => (
                                <div key={i} className="bio-feature">
                                    <span className="bio-feature-icon">⟁</span>
                                    <span className="bio-feature-text">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="cyber-detail-section">
                        <h3 className="section-title">KNOWN ASSOCIATES</h3>
                        <div className="cyber-associates">
                            {scammerData.knownAssociates.map((associate, i) => (
                                <div key={i} className="associate-badge">
                                    {associate}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* 
                <div className="cyber-modal-footer">
                    <div className="cyber-actions">
                        <button className="cyber-action-btn primary">INITIATE TRACING</button>
                        <button className="cyber-action-btn secondary">FREEZE ASSETS</button>
                        <button className="cyber-action-btn tertiary">ISSUE WARRANT</button>
                    </div>
                    <div className="cyber-timestamp">Last updated: {new Date().toISOString().replace("T", " ").substring(0, 19)}</div>
                </div> */}
            </div>
        </div>
    );
};

export default ScammerDetailsModal;
