import { useEffect, useRef } from "react";

interface AudioVisualizerProps {
    audioRef: React.RefObject<HTMLAudioElement>;
    active?: boolean;
    type: "victim" | "caller"; // Add this prop to distinguish between victim and caller
}

const AudioVisualizer = ({ audioRef, active = false, type }: AudioVisualizerProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

    useEffect(() => {
        if (!active || !audioRef.current) return;

        // Initialize audio context and nodes only once
        if (!audioContextRef.current) {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            audioContextRef.current = new AudioContext();
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;
            dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
        }

        // Create source node only if it doesn't exist or if the audio element changed
        if (!sourceRef.current || sourceRef.current.mediaElement !== audioRef.current) {
            if (sourceRef.current) {
                sourceRef.current.disconnect();
            }
            sourceRef.current = audioContextRef.current!.createMediaElementSource(audioRef.current);
            sourceRef.current.connect(analyserRef.current!);
            analyserRef.current!.connect(audioContextRef.current!.destination);
        }

        // Resume audio context if suspended
        if (audioContextRef.current.state === "suspended") {
            audioContextRef.current.resume().catch((err) => console.error("Error resuming audio context:", err));
        }

        const drawVisualizer = () => {
            if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return;

            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const analyser = analyserRef.current;
            const dataArray = dataArrayRef.current;
            const WIDTH = canvas.width;
            const HEIGHT = canvas.height;

            const draw = () => {
                animationRef.current = requestAnimationFrame(draw);
                analyser.getByteTimeDomainData(dataArray);

                ctx.fillStyle = "#0a0a0a";
                ctx.fillRect(0, 0, WIDTH, HEIGHT);

                ctx.lineWidth = 2;
                ctx.strokeStyle = type === "victim" ? "#00ffaa" : "#ff5555"; // Different colors for victim and caller
                ctx.beginPath();

                const sliceWidth = WIDTH / dataArray.length;
                let x = 0;

                for (let i = 0; i < dataArray.length; i++) {
                    const v = dataArray[i] / 128.0;
                    const y = (v * HEIGHT) / 2;

                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }

                    x += sliceWidth;
                }

                ctx.lineTo(WIDTH, HEIGHT / 2);
                ctx.stroke();
            };

            draw();
        };

        drawVisualizer();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [active, audioRef, type]);

    return (
        <div className="visualizer-container">
            <canvas ref={canvasRef} width={300} height={80} className="audio-visualizer" />
            <div className="visualizer-labels">
                <span className="visualizer-label">
                    {type === "victim" ? "VICTIM" : "SCAMMER"} {active ? "ACTIVE" : "STANDBY"}
                </span>
                <div className={`visualizer-status ${active ? "active" : ""}`}></div>
            </div>
        </div>
    );
};

export default AudioVisualizer;
