import React from "react";
import "./modal.css";

interface ScammerDetails {
    id: string;
    name: string;
    phoneNumber: string;
    location: string;
    realLocation: string;
    coordinates: [number, number];
    ipAddress: string;
    realIpAddress: string;
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
        location: "Phnom Penh, Cambodia (VPN Exit)",
        realLocation: "Hyderabad, Telangana, India (Actual)",
        coordinates: [11.5564, 104.9282], // Phnom Penh coordinates
        ipAddress: "182.72.123.45 → VPN Exit (Cambodia)",
        realIpAddress: "117.212.87.34 (Identified Real IP - Hyderabad)",
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
                <div className="cyber-modal-header">
                    <div className="case-id-badge">{scammerData.id}</div>
                    <h2>
                        <span className="threat-level-badge">{scammerData.threatLevel}</span>
                        {scammerData.name}
                    </h2>
                </div>

                <div className="cyber-close-btn" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="#ff4d4d" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>

                <div className="cyber-modal-body">
                    {/* <div className="cyber-stats-grid">
                        <div className="cyber-stat-card critical">
                            <div className="stat-label">Location Confidence</div>
                            <div className="stat-value">92%</div>
                            <div className="stat-bar">
                                <div className="stat-bar-fill" style={{ width: `92%` }}></div>
                            </div>
                        </div>

                        <div className="cyber-stat-card high">
                            <div className="stat-label">Identity Match</div>
                            <div className="stat-value">{scammerData.voiceBiometrics.match}%</div>
                            <div className="stat-bar">
                                <div className="stat-bar-fill" style={{ width: `${scammerData.voiceBiometrics.match}%` }}></div>
                            </div>
                        </div>

                        <div className="cyber-stat-card">
                            <div className="stat-label">Case Status</div>
                            <div className="stat-value status-badge">{scammerData.caseStatus}</div>
                        </div>
                    </div> */}

                    <div className="cyber-detail-section">
                        <h3 className="section-title">LOCATION TRACKING</h3>
                        <div className="cyber-detail-grid">
                            <div className="detail-item">
                                <span className="detail-label">VPN Exit Location</span>
                                <span className="detail-value">
                                    {scammerData.location}
                                    <span className="gps-coords">{scammerData.coordinates.join(", ")}</span>
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Real Location</span>
                                <span className="detail-value success">{scammerData.realLocation}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">VPN IP Address</span>
                                <span className="detail-value">{scammerData.ipAddress}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Real IP Address</span>
                                <span className="detail-value success">{scammerData.realIpAddress}</span>
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
                            <div className="tech-item">
                                <span className="tech-label">Call Pattern</span>
                                <span className="tech-value">{scammerData.technicalFootprint.callPattern}</span>
                            </div>
                            <div className="tech-item full-width">
                                <span className="tech-label">VPN Detection Method</span>
                                <span className="tech-value">TCP timestamp analysis + VPN server fingerprint mismatch</span>
                            </div>
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

                <div className="cyber-modal-footer">
                    <div className="cyber-actions">
                        <button className="cyber-action-btn primary">INITIATE TRACKING</button>
                        <button className="cyber-action-btn secondary">FREEZE ASSETS</button>
                        <button className="cyber-action-btn tertiary">ISSUE WARRANT</button>
                    </div>
                    <div className="cyber-timestamp">Last updated: {new Date().toLocaleString()} | VPN detection confidence: 87%</div>
                </div>
            </div>
        </div>
    );
};

export default ScammerDetailsModal;
