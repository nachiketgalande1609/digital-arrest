import { useEffect, useRef } from "react";

interface AudioVisualizerProps {
    audioRef: React.RefObject<HTMLAudioElement | null>;
    active?: boolean;
    type: "victim" | "caller";
}

const AudioVisualizer = ({ audioRef, active = false, type }: AudioVisualizerProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

    useEffect(() => {
        if (!audioRef.current) return;

        if (!audioContextRef.current) {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            audioContextRef.current = new AudioContext();
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;
            dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
        }

        if (!sourceRef.current || sourceRef.current.mediaElement !== audioRef.current) {
            if (sourceRef.current) {
                sourceRef.current.disconnect();
            }
            sourceRef.current = audioContextRef.current!.createMediaElementSource(audioRef.current);
            sourceRef.current.connect(analyserRef.current!);
            analyserRef.current!.connect(audioContextRef.current!.destination);
        }

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

                // Dark cyberpunk background with subtle grid
                ctx.fillStyle = "#0a0a0a";
                ctx.fillRect(0, 0, WIDTH, HEIGHT);

                // Draw subtle grid lines
                ctx.strokeStyle = "rgba(0, 255, 255, 0.05)";
                ctx.lineWidth = 1;
                for (let x = 0; x < WIDTH; x += 20) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, HEIGHT);
                    ctx.stroke();
                }
                for (let y = 0; y < HEIGHT; y += 20) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(WIDTH, y);
                    ctx.stroke();
                }

                // Draw center line
                ctx.strokeStyle = "rgba(0, 255, 255, 0.15)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, HEIGHT / 2);
                ctx.lineTo(WIDTH, HEIGHT / 2);
                ctx.stroke();

                // Main waveform settings
                const primaryColor = type === "victim" ? "#00ffaa" : "#ff5555";
                const secondaryColor = type === "victim" ? "#007755" : "#aa0000";

                // Draw the main waveform
                ctx.lineWidth = 2;
                ctx.strokeStyle = primaryColor;
                ctx.shadowColor = primaryColor;
                ctx.shadowBlur = 10;
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

                // Draw a secondary inner waveform for depth
                ctx.lineWidth = 1;
                ctx.strokeStyle = secondaryColor;
                ctx.shadowColor = "transparent";
                ctx.beginPath();
                x = 0;

                ctx.lineTo(WIDTH, HEIGHT / 2);
                ctx.stroke();

                // Reset shadow
                ctx.shadowColor = "transparent";
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
        <div
            className="visualizer-container"
            style={{
                position: "relative",
                border: "1px solid rgba(0, 255, 255, 0.2)",
                borderRadius: "4px",
                overflow: "hidden",
                background: "#0a0a0a",
                boxShadow: "0 0 15px rgba(0, 255, 255, 0.1)",
            }}
        >
            <canvas
                ref={canvasRef}
                width={400}
                height={120}
                style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: "8px",
                    left: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                }}
            >
                <span
                    style={{
                        color: type === "victim" ? "#00ffaa" : "#ff5555",
                        fontFamily: '"Courier New", monospace',
                        fontSize: "12px",
                        fontWeight: "bold",
                        textShadow: `0 0 5px ${type === "victim" ? "rgba(0, 255, 170, 0.7)" : "rgba(255, 85, 85, 0.7)"}`,
                    }}
                >
                    {type === "victim" ? "VICTIM" : "CALLER"} {active ? "ACTIVE" : "STANDBY"}
                </span>
                <div
                    style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: active ? (type === "victim" ? "#00ffaa" : "#ff5555") : "#333",
                        boxShadow: active ? `0 0 5px 2px ${type === "victim" ? "rgba(0, 255, 170, 0.7)" : "rgba(255, 85, 85, 0.7)"}` : "none",
                    }}
                ></div>
            </div>
        </div>
    );
};

export default AudioVisualizer;
