import "./Navbar.css";
import { useState, useEffect } from "react";

const Navbar = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isAlertActive, setIsAlertActive] = useState(false);
    const [cyberThreatLevel, setCyberThreatLevel] = useState(3); // 1-5 scale

    useEffect(() => {
        // Update time every second
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Simulate random cyber alerts
        const alertInterval = setInterval(() => {
            if (Math.random() > 0.7) {
                setIsAlertActive(true);
                setTimeout(() => setIsAlertActive(false), 3000);
            }
        }, 15000);

        // Simulate threat level changes
        const threatInterval = setInterval(() => {
            setCyberThreatLevel(Math.floor(Math.random() * 3) + 2); // Random between 2-4
        }, 20000);

        return () => {
            clearInterval(timer);
            clearInterval(alertInterval);
            clearInterval(threatInterval);
        };
    }, []);

    const formatTime = (date: any) => {
        return date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });
    };

    const formatDate = (date: any) => {
        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-left">
                    <img src="/logo.png" alt="Telangana Cyber Cell Logo" className="navbar-logo-img" />
                    <div>
                        <h1 className="navbar-title">Telangana</h1>
                        <h1 className="navbar-title">Cyber Security Bureau</h1>
                    </div>
                </div>

                <div className="navbar-right">
                    <div className="threat-level-container">
                        <span className="threat-label">Threat Level:</span>
                        <div className="threat-levels">
                            <div key={1} className={`threat-level active high}`} />
                            <div key={2} className={`threat-level active high}`} />
                            <div key={3} className={`threat-level active high}`} />
                            <div key={4} className={`threat-level active high}`} />
                            <div key={5} className={`threat-level active}`} />
                        </div>
                    </div>

                    <div className="cyber-status-container">
                        <div className="time-display">
                            <div className="cyber-date">{formatDate(currentTime)}</div>
                            <div className="cyber-time">{formatTime(currentTime)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
