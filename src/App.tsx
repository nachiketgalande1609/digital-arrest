import React, { useState, useEffect, useRef } from "react";
import VictimPage from "./VictimPage";
import TelangalanCyberSite from "./TelanganaCyberSite";
import PhoneInterface from "./PhoneInterface";

type CallStatus = "incoming" | "analyzing" | "scam-detected" | "call-ended";

interface CallerInfo {
    name: string;
    number: string;
    avatar: string;
}

const App: React.FC = () => {
    const [callStatus, setCallStatus] = useState<CallStatus>("incoming");
    const [progress, setProgress] = useState<number>(0);
    const [activeSpeaker, setActiveSpeaker] = useState<"victim" | "caller">("caller");
    const [currentAudioIndex, setCurrentAudioIndex] = useState<number>(0);
    const [showScammerDetails, setShowScammerDetails] = useState<boolean>(false);
    const [currentScreen, setCurrentScreen] = useState<"victim" | "cyber">("victim");

    const [showPhoneInterface, setShowPhoneInterface] = useState(true);
    const [ringing, setRinging] = useState(false);

    const audioFiles = [
        { src: "/1_victim.mp3", type: "victim" },
        { src: "/2_scammer.mp3", type: "caller" },
        { src: "/3_victim.mp3", type: "victim" },
        { src: "/4_scammer.mp3", type: "caller" },
        { src: "/5_victim.mp3", type: "victim" },
        { src: "/6_scammer.mp3", type: "caller" },
        { src: "/7_victim.mp3", type: "victim" },
        { src: "/8_scammer.m4a", type: "caller" },
        { src: "/9_deepfake.mp3", type: "victim" },
        { src: "/10_scammer.m4a", type: "caller" },
        { src: "/11_deepfake.mp3", type: "victim" },
        { src: "/12_scammer.m4a", type: "caller" },
        { src: "/13_deepfake.mp3", type: "victim" },
        { src: "/14_scammer.m4a", type: "caller" },
        { src: "/15_deepfake.mp3", type: "victim" },
        { src: "/16_scammer.m4a", type: "caller" },
        { src: "/17_deepfake.mp3", type: "victim" },
        { src: "/18_scammer.m4a", type: "caller" },
        { src: "/19_deepfake.mp3", type: "victim" },
        { src: "/20_scammer.m4a", type: "caller" },
        { src: "/21_deepfake.mp3", type: "victim" },
        { src: "/22_scammer.m4a", type: "caller" },
        { src: "/23_deepfake.mp3", type: "victim" },
        { src: "/24_scammer.m4a", type: "caller" },
        { src: "/25_deepfake.mp3", type: "victim" },
        { src: "/26_scammer.m4a", type: "caller" },
        { src: "/27_deepfake.mp3", type: "victim" },
        { src: "/28_scammer.m4a", type: "caller" },
    ];

    const [callerInfo] = useState<CallerInfo>({
        name: "Unknown Caller",
        number: "+1 (555) 123-4567",
        avatar: "https://img.freepik.com/premium-photo/male-customer-service-3d-cartoon-avatar-portrait_839035-522335.jpg",
    });

    const ringtoneRef = useRef<HTMLAudioElement | null>(null);
    const victimAudioRef = useRef<HTMLAudioElement | null>(null);
    const scammerAudioRef = useRef<HTMLAudioElement | null>(null);
    const beepRef = useRef<HTMLAudioElement | null>(null);

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
            }, 1500);

            return () => clearInterval(analysisInterval);
        }
    }, [callStatus]);

    const [isBeepPlaying, setIsBeepPlaying] = useState(false);

    const playAudioSequence = () => {
        if (isBeepPlaying) return;

        if (currentAudioIndex >= audioFiles.length) {
            setCallStatus("call-ended");
            return;
        }

        const currentAudio = audioFiles[currentAudioIndex];
        setActiveSpeaker(currentAudio.type === "victim" ? "victim" : "caller");

        // Use the appropriate audio ref based on who's speaking
        const targetAudioRef = currentAudio.type === "victim" ? victimAudioRef : scammerAudioRef;

        if (targetAudioRef.current) {
            targetAudioRef.current.src = currentAudio.src;
            targetAudioRef.current.onended = () => {
                // Special handling for the 7_victim.mp3 (index 6)
                if (currentAudioIndex === 2) {
                    setCallStatus("scam-detected");
                    if (beepRef.current) {
                        setIsBeepPlaying(true);
                        beepRef.current.currentTime = 0;
                        beepRef.current.play().catch(console.error);
                        // Switch to cyber site after beep plays
                        beepRef.current.onended = () => {
                            setIsBeepPlaying(false);
                            setTimeout(() => {
                                setCurrentScreen("cyber");
                                // Continue with next audio
                                setCurrentAudioIndex((prev) => prev + 1);
                            }, 1000);
                        };
                    } else {
                        // If beep fails, still switch screens
                        setCurrentScreen("cyber");
                        setCurrentAudioIndex((prev) => prev + 1);
                    }
                } else {
                    setCurrentAudioIndex((prev) => prev + 1);
                }
            };

            targetAudioRef.current.play().catch((err) => {
                console.error("Error playing audio:", err);
                setTimeout(() => {
                    if (currentAudioIndex === 6) {
                        setCallStatus("scam-detected");
                        setCurrentScreen("cyber");
                        setCurrentAudioIndex((prev) => prev + 1);
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

    useEffect(() => {
        if (callStatus === "scam-detected" && beepRef.current) {
            beepRef.current.currentTime = 0; // Rewind to start in case it's already playing
            beepRef.current.play().catch((err) => {
                console.error("Error playing beep sound:", err);
            });
        }
    }, [callStatus]);

    return (
        <>
            <audio ref={ringtoneRef} src="/ringtone.mp3" />
            <audio ref={beepRef} src="/beep.mp3" />
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
                            activeSpeaker={activeSpeaker}
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
                            showScammerDetails={showScammerDetails}
                            setShowScammerDetails={setShowScammerDetails}
                        />
                    )}
                </>
            )}
        </>
    );
};

export default App;
