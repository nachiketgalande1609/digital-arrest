import React, { useState, useEffect, useRef } from "react";
import VictimPage from "./VictimPage";
import TelangalanCyberSite from "./TelanganaCyberSite";

type CallStatus = "incoming" | "analyzing" | "scam-detected" | "call-ended";
type LogEntry = {
    timestamp: string;
    message: string;
    type: "info" | "warning" | "error" | "success" | "debug";
};

interface CallerInfo {
    name: string;
    number: string;
    avatar: string;
}

const generateRandomUUID = (): string => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

const App: React.FC = () => {
    const [callStatus, setCallStatus] = useState<CallStatus>("incoming");
    const [progress, setProgress] = useState<number>(0);
    const [victimLogs, setVictimLogs] = useState<LogEntry[]>([]);
    const [scammerLogs, setScammerLogs] = useState<LogEntry[]>([]);
    const [activeSpeaker, setActiveSpeaker] = useState<"victim" | "caller">("caller");
    const [currentAudioIndex, setCurrentAudioIndex] = useState<number>(0);
    const [showScammerDetails, setShowScammerDetails] = useState<boolean>(false);

    const audioFiles = [
        { src: "/1_victim.mp3", type: "victim" },
        { src: "/2_scammer.mp3", type: "caller" },
        { src: "/3_victim.mp3", type: "victim" },
        { src: "/4_scammer.mp3", type: "caller" },
        { src: "/5_victim.mp3", type: "victim" },
        { src: "/6_scammer.mp3", type: "caller" },
        { src: "/7_victim.mp3", type: "victim" },
    ];

    const [callerInfo] = useState<CallerInfo>({
        name: "Unknown Caller",
        number: "+1 (555) 123-4567",
        avatar: "https://img.freepik.com/premium-photo/male-customer-service-3d-cartoon-avatar-portrait_839035-522335.jpg",
    });

    const victimTerminalRef = useRef<HTMLDivElement>(null);
    const scammerTerminalRef = useRef<HTMLDivElement>(null);
    const ringtoneRef = useRef<HTMLAudioElement | null>(null);
    const victimAudioRef = useRef<HTMLAudioElement | null>(null);
    const scammerAudioRef = useRef<HTMLAudioElement | null>(null);
    const beepRef = useRef<HTMLAudioElement | null>(null);

    const addVictimLog = (message: string, type: LogEntry["type"] = "info") => {
        const timestamp = new Date().toISOString().split("T")[1].split(".")[0];
        setVictimLogs((prev) => [...prev.slice(-200), { timestamp, message, type }]);
    };

    const addScammerLog = (message: string, type: LogEntry["type"] = "info") => {
        const timestamp = new Date().toISOString().split("T")[1].split(".")[0];
        setScammerLogs((prev) => [...prev.slice(-200), { timestamp, message, type }]);
    };

    // Auto-scroll terminals to bottom
    useEffect(() => {
        if (victimTerminalRef.current) {
            victimTerminalRef.current.scrollTop = victimTerminalRef.current.scrollHeight;
        }
        if (scammerTerminalRef.current) {
            scammerTerminalRef.current.scrollTop = scammerTerminalRef.current.scrollHeight;
        }
    }, [victimLogs, scammerLogs]);

    const logFeatureAnalysis = (isVictim: boolean) => {
        const features = ["pitch variance", "spectral centroid", "MFCC coefficients", "formant dispersion", "jitter", "shimmer", "harmonicity"];
        const feature = features[Math.floor(Math.random() * features.length)];
        const logFn = isVictim ? addVictimLog : addScammerLog;
        logFn(`Analyzing ${feature}: deviation ${(Math.random() * 10).toFixed(2)}%`, "info");
    };

    const logModelUpdate = (isVictim: boolean) => {
        if (Math.random() > 0.9) {
            const logFn = isVictim ? addVictimLog : addScammerLog;
            logFn(`Updating detection model weights (epoch: ${Math.floor(Math.random() * 100)}, loss: ${Math.random().toFixed(4)})`, "debug");
        }
    };

    // Simulate call flow with reduced logging
    useEffect(() => {
        if (callStatus === "incoming") {
            addVictimLog("=== VICTIM TERMINAL v2.3.7 ===", "info");
            addVictimLog("Initializing victim-side analysis...", "info");
            addVictimLog(`Session ID: ${generateRandomUUID()}`, "debug");
            addVictimLog("Loading voiceprint models...", "info");
            addVictimLog('Model "voiceprint-v5" loaded (43.7MB)', "success");

            addScammerLog("=== SCAMMER TERMINAL v2.3.7 ===", "info");
            addScammerLog("Initializing scam detection...", "info");
            addScammerLog(`Session ID: ${generateRandomUUID()}`, "debug");
            addScammerLog("Loading threat intelligence...", "info");
            addScammerLog('Model "spectral-v3" loaded (28.2MB)', "success");

            addVictimLog("Incoming call detected from " + callerInfo.number, "info");
            addScammerLog("Call initiated to victim", "info");
        }

        if (callStatus === "analyzing") {
            addVictimLog("=== BEGINNING VICTIM ANALYSIS ===", "info");
            addScammerLog("=== BEGINNING SCAMMER ANALYSIS ===", "info");

            addVictimLog("Extracting victim voice features...", "info");
            addScammerLog("Analyzing scammer voice patterns...", "info");

            const loggedMilestones = new Set();

            const analysisInterval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(analysisInterval);

                        if (!loggedMilestones.has(100)) {
                            loggedMilestones.add(100);
                            addVictimLog("WARNING: Potential scam call detected!", "warning");
                            addScammerLog("ALERT: Synthetic voice patterns detected!", "error");
                            addScammerLog("Confidence: 94.2% (±2.1%)", "error");
                            addScammerLog("Signature match to known GAN-generated samples", "error");
                        }

                        return 100;
                    }

                    const nextProgress = prev + (Math.random() * 3 + 2);

                    const milestones = [
                        {
                            threshold: 20,
                            victimMsg: "Step 1: Captured victim voice sample",
                            scammerMsg: "Step 1: Detected VoIP masking patterns",
                        },
                        {
                            threshold: 40,
                            victimMsg: "Step 2: Analyzing victim speech patterns",
                            scammerMsg: "Step 2: Identified Cambodian IP address",
                        },
                        {
                            threshold: 60,
                            victimMsg: "Step 3: Comparing to victim voice baseline",
                            scammerMsg: "Step 3: Matched to known scammer tactics",
                        },
                        {
                            threshold: 80,
                            victimMsg: "Step 4: Verifying victim identity",
                            scammerMsg: "Step 4: Confirmed synthetic voice artifacts",
                        },
                    ];

                    milestones.forEach(({ threshold, victimMsg, scammerMsg }) => {
                        if (prev < threshold && nextProgress >= threshold && !loggedMilestones.has(threshold)) {
                            addVictimLog(victimMsg, "warning");
                            addScammerLog(scammerMsg, "warning");
                            loggedMilestones.add(threshold);
                        }
                    });

                    if (Math.random() > 0.6) {
                        const randomActions = [
                            () => logFeatureAnalysis(true),
                            () => logFeatureAnalysis(false),
                            () => logModelUpdate(true),
                            () => logModelUpdate(false),
                            () => addVictimLog(`Processing victim frame ${Math.floor(prev * 50)}`),
                            // () => addScammerLog(`Analyzing scammer sample ${Math.floor(prev * 50)}`),
                        ];
                        randomActions[Math.floor(Math.random() * randomActions.length)]();
                    }

                    return nextProgress;
                });
            }, 1500);

            return () => clearInterval(analysisInterval);
        }
    }, [callStatus]);

    const playAudioSequence = () => {
        if (currentAudioIndex >= audioFiles.length) {
            setCallStatus("call-ended");
            addVictimLog("Call session completed", "success");
            addScammerLog("Call session terminated", "info");
            return;
        }

        const currentAudio = audioFiles[currentAudioIndex];
        setActiveSpeaker(currentAudio.type === "victim" ? "victim" : "caller");

        // Use the appropriate audio ref based on who's speaking
        const targetAudioRef = currentAudio.type === "victim" ? victimAudioRef : scammerAudioRef;

        if (targetAudioRef.current) {
            targetAudioRef.current.src = currentAudio.src;
            targetAudioRef.current.onended = () => {
                // Only mark as scam-detected when the last audio file (7_victim) finishes
                if (currentAudioIndex === audioFiles.length - 1) {
                    setCallStatus("scam-detected");
                } else {
                    setCurrentAudioIndex((prev) => prev + 1);
                }
            };

            targetAudioRef.current.play().catch((err) => {
                console.error("Error playing audio:", err);
                setTimeout(() => {
                    if (currentAudioIndex === audioFiles.length - 1) {
                        setCallStatus("scam-detected");
                    } else {
                        setCurrentAudioIndex((prev) => prev + 1);
                    }
                }, 1000);
            });

            // Add log based on who is speaking
            if (currentAudio.type === "victim") {
                addVictimLog("Victim speaking - analyzing voice patterns", "info");
                addScammerLog("Listening to victim response", "info");
            } else {
                addVictimLog("Caller speaking - analyzing voice patterns", "info");
                addScammerLog("Scammer speaking - analyzing tactics", "info");
            }
        }
    };

    useEffect(() => {
        if (callStatus === "analyzing") {
            playAudioSequence();
        }
    }, [currentAudioIndex, callStatus]);

    const handleAnswer = (): void => {
        addVictimLog("User answered call - beginning analysis", "success");
        addScammerLog("Call answered - initiating analysis", "info");
        setCallStatus("analyzing");
        setCurrentAudioIndex(0); // Reset to first audio file
    };

    const handleDecline = (): void => {
        addVictimLog("Call declined by user - terminating session", "warning");
        addScammerLog("Call rejected by target", "warning");
        setCallStatus("incoming");
        setProgress(0);
        setVictimLogs([]);
        setScammerLogs([]);
        setActiveSpeaker("caller");
        setCurrentAudioIndex(0);
    };

    useEffect(() => {
        if (callStatus === "scam-detected" && beepRef.current) {
            setShowScammerDetails(true);

            beepRef.current.currentTime = 0; // Rewind to start in case it's already playing
            beepRef.current.play().catch((err) => {
                console.error("Error playing beep sound:", err);
            });
        }
    }, [callStatus]);

    const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]); // Center of India
    const [mapZoom, setMapZoom] = useState<number>(5);
    const [showTriangulation, setShowTriangulation] = useState<boolean>(false);

    // Locations for victim and scammer
    const locations = {
        victim: [19.076, 72.8777] as [number, number], // Mumbai
        scammer: [17.385, 78.4867] as [number, number], // Hyderabad
    };

    // Effect to handle map animation when call status changes
    useEffect(() => {
        if (callStatus === "analyzing") {
            // Zoom in when analysis starts
            setMapZoom(6);
            setTimeout(() => setShowTriangulation(true), 1000);

            // Alternate between centers during call
            const interval = setInterval(() => {
                setMapCenter((prev) => (prev[0] === locations.victim[0] ? locations.scammer : locations.victim));
            }, 3000);

            return () => clearInterval(interval);
        } else if (callStatus === "scam-detected") {
            // Focus on scammer location when detected
            setMapCenter(locations.scammer);
            setMapZoom(10);
        } else {
            // Reset when call ends
            setMapCenter([20.5937, 78.9629]);
            setMapZoom(5);
            setShowTriangulation(false);
        }
    }, [callStatus]);

    return (
        <div style={{ width: "100vw" }}>
            <VictimPage
                ringtoneRef={ringtoneRef}
                beepRef={beepRef}
                victimAudioRef={victimAudioRef}
                scammerAudioRef={scammerAudioRef}
                callStatus={callStatus}
                scammerLogs={scammerLogs}
                scammerTerminalRef={scammerTerminalRef}
                progress={progress}
                callerInfo={callerInfo}
                activeSpeaker={activeSpeaker}
                handleDecline={handleDecline}
                handleAnswer={handleAnswer}
                showScammerDetails={showScammerDetails}
                setShowScammerDetails={setShowScammerDetails}
            />

            <TelangalanCyberSite
                ringtoneRef={ringtoneRef}
                beepRef={beepRef}
                victimAudioRef={victimAudioRef}
                scammerAudioRef={scammerAudioRef}
                activeSpeaker={activeSpeaker}
                callStatus={callStatus}
                victimTerminalRef={victimTerminalRef}
                victimLogs={victimLogs}
                scammerTerminalRef={scammerTerminalRef}
                progress={progress}
                scammerLogs={scammerLogs}
                mapCenter={mapCenter}
                mapZoom={mapZoom}
                locations={locations}
                showTriangulation={showTriangulation}
                showScammerDetails={showScammerDetails}
                setShowScammerDetails={setShowScammerDetails}
            />
        </div>
    );
};

export default App;
