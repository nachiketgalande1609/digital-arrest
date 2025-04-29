import React, { useState, useEffect } from "react";
import "./PhoneInterface.css";

interface PhoneInterfaceProps {
    onAnswer: () => void;
    onReject: () => void;
    callerInfo: {
        name: string;
        number: string;
        avatar: string;
    };
}

const PhoneInterface: React.FC<PhoneInterfaceProps> = ({ onAnswer, onReject, callerInfo }) => {
    const [isRinging, setIsRinging] = useState(true);
    const [currentTime, setCurrentTime] = useState("12:34");

    useEffect(() => {
        // Update time every minute
        const interval = setInterval(() => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="phone-container">
            <div className="phone">
                {/* Phone notch */}
                <div className="phone-notch"></div>

                {/* Phone screen */}
                <div className="phone-screen">
                    {/* Phone status bar */}
                    <div className="status-bar">
                        <span className="time">{currentTime}</span>
                        <div className="status-icons">
                            <span className="icon network">📶</span>
                            <span className="icon wifi">📶</span>
                            <span className="icon battery">🔋 87%</span>
                        </div>
                    </div>

                    {/* Call screen */}
                    <div className={`call-screen ${isRinging ? "ringing" : ""}`}>
                        <div className="caller-info">
                            <div className="caller-avatar-container">
                                <div className="caller-avatar">
                                    <img src={callerInfo.avatar} alt="Caller" />
                                    <div className="call-platform-icon">
                                        <svg viewBox="0 0 24 24" width="24" height="24">
                                            <path
                                                fill="currentColor"
                                                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-6.29-3.91a1.38 1.38 0 0 0 .166-.675c0-.338-.133-.654-.373-.887a1.255 1.255 0 0 0-.892-.375 1.267 1.267 0 0 0-.927.392c-.244.249-.38.567-.38.91 0 .342.136.658.38.906.244.248.569.387.912.387.343 0 .668-.139.912-.388zm4.237 0a1.38 1.38 0 0 0 .166-.675c0-.338-.133-.654-.373-.887a1.255 1.255 0 0 0-.892-.375 1.267 1.267 0 0 0-.927.392c-.244.249-.38.567-.38.91 0 .342.136.658.38.906.244.248.569.387.912.387.343 0 .668-.139.912-.388z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div className="pulse-ring"></div>
                                <div className="pulse-ring delay"></div>
                            </div>

                            <h1 className="caller-name">{callerInfo.name}</h1>
                            <p className="caller-number">{callerInfo.number}</p>
                            <p className="call-status">{isRinging ? "Ringing" : "Incoming call"}</p>
                        </div>

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
                                    <svg viewBox="0 0 24 24" width="33" height="28">
                                        <path
                                            fill="currentColor"
                                            d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"
                                        />
                                    </svg>
                                </div>
                                <span className="action-label">Answer</span>
                            </button>
                        </div>
                    </div>

                    {/* Phone home indicator */}
                    <div className="home-indicator"></div>
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
