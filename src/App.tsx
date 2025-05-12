import React, { useState, useEffect, useRef } from "react";
import VictimPage from "./VictimPage";
import TelangalanCyberSite from "./TelanganaCyberSite";
import PhoneInterface from "./PhoneInterface";
import ScammerDetailsModal from "./components/modal/ScammerDetailsModal";

type CallStatus = "incoming" | "analyzing" | "scam-detected" | "call-ended";

interface CallerInfo {
    name: string;
    number: string;
}

const App: React.FC = () => {
    const [callStatus, setCallStatus] = useState<CallStatus>("incoming");
    const [progress, setProgress] = useState<number>(0);
    const [activeSpeaker, setActiveSpeaker] = useState<"victim" | "caller">("caller");
    const [currentAudioIndex, setCurrentAudioIndex] = useState<number>(0);
    const [currentScreen, setCurrentScreen] = useState<"victim" | "cyber">("victim");
    const [showScammerDetails, setShowScammerDetails] = useState(false);

    const [showPhoneInterface, setShowPhoneInterface] = useState(true);
    const [ringing, setRinging] = useState(false);

    const audioFiles = [
        { src: "before_beep/1_victim.wav", type: "victim" },
        { src: "before_beep/2_scammer.wav", type: "caller" },
        { src: "before_beep/3_victim.wav", type: "victim" },
        { src: "before_beep/4_scammer.wav", type: "caller" },
        { src: "before_beep/5_victim.wav", type: "victim" },
        { src: "before_beep/6_scammer.wav", type: "caller" },
        { src: "after_beep/7_victim.mp3", type: "victim" },
        { src: "after_beep/8_scammer.mp3", type: "caller" },
        { src: "after_beep/9_victim.mp3", type: "victim" },
        { src: "after_beep/10_scammer.mp3", type: "caller" },
    ];

    const [callerInfo] = useState<CallerInfo>({
        name: "Unknown Caller",
        number: "+855 10 234 567",
    });

    const ringtoneRef = useRef<HTMLAudioElement | null>(null);
    const victimAudioRef = useRef<HTMLAudioElement | null>(null);
    const scammerAudioRef = useRef<HTMLAudioElement | null>(null);
    const beepRef = useRef<HTMLAudioElement | null>(null);
    const interceptorRef = useRef<HTMLAudioElement | null>(null);

    // Simulate call flow with reduced logging
    useEffect(() => {
        if (callStatus === "analyzing") {
            const loggedMilestones = new Set();

            const analysisInterval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(analysisInterval);
                        if (!loggedMilestones.has(100)) {
                            loggedMilestones.add(100);
                        }
                        return 100;
                    }

                    const nextProgress = prev + (Math.random() * 3 + 2);
                    return nextProgress;
                });
            }, 1100);

            return () => clearInterval(analysisInterval);
        }
    }, [callStatus]);

    const [isBeepPlaying, setIsBeepPlaying] = useState(false);

    const playBeepSound = (callback: () => void) => {
        if (beepRef.current) {
            setIsBeepPlaying(true);
            beepRef.current.currentTime = 0;
            beepRef.current.play().catch(console.error);
            beepRef.current.onended = () => {
                setIsBeepPlaying(false);
                callback();
            };
        } else {
            callback();
        }
    };

    const playAudioSequence = () => {
        if (isBeepPlaying) return;

        if (currentAudioIndex >= audioFiles.length) {
            // Play beep before showing scammer details
            playBeepSound(() => {
                setCallStatus("call-ended");
                setShowScammerDetails(true);
            });
            return;
        }

        const currentAudio = audioFiles[currentAudioIndex];
        setActiveSpeaker(currentAudio.type === "victim" ? "victim" : "caller");

        // Use the appropriate audio ref based on who's speaking
        const targetAudioRef = currentAudio.type === "victim" ? victimAudioRef : scammerAudioRef;

        if (targetAudioRef.current) {
            targetAudioRef.current.src = currentAudio.src;
            targetAudioRef.current.onended = () => {
                if (currentAudioIndex === 5) {
                    setCallStatus("scam-detected");
                    // Play beep before switching to cyber site
                    playBeepSound(() => {
                        if (interceptorRef.current) {
                            interceptorRef.current.currentTime = 0;
                            interceptorRef.current.play().catch(console.error);
                            interceptorRef.current.onended = () => {
                                setTimeout(() => {
                                    setCurrentScreen("cyber");
                                    setCurrentAudioIndex((prev) => prev + 1);
                                }, 1000);
                            };
                        } else {
                            setCurrentScreen("cyber");
                            setCurrentAudioIndex((prev) => prev + 1);
                        }
                    });
                } else {
                    setCurrentAudioIndex((prev) => prev + 1);
                }
            };

            targetAudioRef.current.play().catch((err) => {
                console.error("Error playing audio:", err);
                setTimeout(() => {
                    if (currentAudioIndex === 5) {
                        setCallStatus("scam-detected");
                        playBeepSound(() => {
                            setCurrentScreen("cyber");
                            setCurrentAudioIndex((prev) => prev + 1);
                        });
                    } else if (currentAudioIndex === audioFiles.length - 1) {
                        setCallStatus("scam-detected");
                    } else {
                        setCurrentAudioIndex((prev) => prev + 1);
                    }
                }, 1000);
            });
        }
    };

    useEffect(() => {
        if (callStatus === "analyzing" || callStatus === "scam-detected") {
            playAudioSequence();
        }
    }, [currentAudioIndex, callStatus]);

    useEffect(() => {
        if (ringing && ringtoneRef.current) {
            ringtoneRef.current.play().catch((err) => {
                console.error("Error playing ringtone:", err);
            });
        } else if (!ringing && ringtoneRef.current) {
            ringtoneRef.current.pause();
            ringtoneRef.current.currentTime = 0; // Reset to start
        }
    }, [ringing]);

    const handleAnswer = (): void => {
        setCallStatus("analyzing");
        setCurrentAudioIndex(0); // Reset to first audio file
        setRinging(false); // Stop the ringtone when call is answered
    };

    const handleDecline = (): void => {
        setCallStatus("incoming");
        setProgress(0);
        setActiveSpeaker("caller");
        setCurrentAudioIndex(0);
    };

    return (
        <>
            <audio ref={ringtoneRef} src="/ringtone.mp3" />
            <audio ref={beepRef} src="/beep.mp3" />
            <audio ref={interceptorRef} src="/interceptor.mp3" />
            <audio ref={victimAudioRef} />
            <audio ref={scammerAudioRef} />
            {showPhoneInterface ? (
                <PhoneInterface
                    onAnswer={() => {
                        setShowPhoneInterface(false);
                        handleAnswer();
                    }}
                    onReject={() => {
                        setShowPhoneInterface(false);
                        handleDecline();
                    }}
                    callerInfo={callerInfo}
                    setRinging={setRinging}
                />
            ) : (
                <>
                    {currentScreen === "victim" && (
                        <VictimPage
                            callStatus={callStatus}
                            progress={progress}
                            callerInfo={callerInfo}
                            handleDecline={handleDecline}
                            handleAnswer={handleAnswer}
                        />
                    )}

                    {currentScreen === "cyber" && (
                        <TelangalanCyberSite
                            victimAudioRef={victimAudioRef}
                            scammerAudioRef={scammerAudioRef}
                            activeSpeaker={activeSpeaker}
                            callStatus={callStatus}
                            currentAudioIndex={currentAudioIndex}
                        />
                    )}
                </>
            )}
            {showScammerDetails && <ScammerDetailsModal onClose={() => setShowScammerDetails(false)} />}
        </>
    );
};

export default App;
