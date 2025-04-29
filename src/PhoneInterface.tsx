import React, { useState, useEffect } from "react";
import "./PhoneInterface.css";

interface PhoneInterfaceProps {
    onAnswer: () => void;
    onReject: () => void;
    callerInfo: {
        name: string;
        number: string;
        avatar: string;
        callType: "voice" | "video";
    };
}

const PhoneInterface: React.FC<PhoneInterfaceProps> = ({ onAnswer, onReject, callerInfo }) => {
    const [isRinging, setIsRinging] = useState(true);
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        // Set initial time
        const now = new Date();
        setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));

        // Update time every minute
        const interval = setInterval(() => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="whatsapp-call-container">
            <div className="phone">
                {/* Phone notch */}
                <div className="phone-notch"></div>

                {/* Phone screen */}
                <div className="phone-screen">
                    {/* Status bar */}
                    <div className="status-bar">
                        <span className="time">{currentTime}</span>
                        <div className="status-icons">
                            <span className="icon">
                                <svg viewBox="0 0 24 24" width="16" height="16">
                                    <path
                                        fill="currentColor"
                                        d="M17,9H7V7H17M17,13H7V11H17M14,17H7V15H14M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z"
                                    />
                                </svg>
                            </span>
                            <span className="icon wifi">
                                <svg viewBox="0 0 24 24" width="16" height="16">
                                    <path
                                        fill="currentColor"
                                        d="M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z"
                                    />
                                </svg>
                            </span>
                            <span className="icon battery">
                                <svg viewBox="0 0 24 24" width="18" height="16">
                                    <path
                                        fill="currentColor"
                                        d="M16,20H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z"
                                    />
                                </svg>
                            </span>
                        </div>
                    </div>

                    {/* Call screen */}
                    <div className={`call-screen ${isRinging ? "ringing" : ""}`}>
                        {/* Top gradient overlay */}
                        <div className="top-gradient"></div>

                        {/* Caller info */}
                        <div className="caller-info">
                            <div className="caller-avatar-container">
                                <div className="caller-avatar">
                                    <img src={callerInfo.avatar} alt="Caller" />
                                    {callerInfo.callType === "video" && (
                                        <div className="video-icon">
                                            <svg viewBox="0 0 24 24" width="24" height="24">
                                                <path
                                                    fill="currentColor"
                                                    d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <img src="/whatsapp.png" alt="WhatsApp Icon" className="whatsapp-icon" />

                                <div className="pulse-ring"></div>
                                <div className="pulse-ring delay"></div>
                            </div>

                            <h1 className="caller-name">{callerInfo.name}</h1>
                            <p className="caller-number">{callerInfo.number}</p>
                            <p className="call-status">
                                {isRinging ? "Ringing" : callerInfo.callType === "video" ? "WhatsApp video call..." : "WhatsApp call..."}
                            </p>
                        </div>

                        {/* Call actions */}
                        <div className="call-actions">
                            <button className="action-btn decline" onClick={onReject}>
                                <div className="action-icon">
                                    <svg viewBox="0 0 24 24" width="28" height="28">
                                        <path
                                            fill="currentColor"
                                            d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                                        />
                                    </svg>
                                </div>
                                <span className="action-label">Decline</span>
                            </button>

                            <button className="action-btn answer" onClick={onAnswer}>
                                <div className="action-icon">
                                    <svg viewBox="0 0 24 24" width="28" height="28">
                                        <path
                                            fill="currentColor"
                                            d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"
                                        />
                                    </svg>
                                </div>
                                <span className="action-label">Answer</span>
                            </button>
                        </div>

                        {/* Bottom gradient overlay */}
                        <div className="bottom-gradient"></div>

                        {/* Phone home indicator */}
                        <div className="home-indicator"></div>
                    </div>
                </div>

                {/* Phone side buttons */}
                <div className="phone-side-button volume-up"></div>
                <div className="phone-side-button volume-down"></div>
                <div className="phone-side-button power"></div>
            </div>
        </div>
    );
};

export default PhoneInterface;
