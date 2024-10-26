"use client";

import ReactPlayer from "react-player";
import { useState, useEffect, useCallback, useRef } from "react";
import { Play, Volume2, Pause } from "lucide-react";
import Image from "next/image";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

export function VenuJamsFloatingGradient() {
  const [gradientPosition, setGradientPosition] = useState({ x: 50, y: 50 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime] = useState(0);
  const [duration] = useState(0);
  const [isMuted, setIsMuted] = useState(true); // New state for muting
  const playerRef = useRef<ReactPlayer>(null);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;

    const x = (clientX / innerWidth) * 100;
    const y = (clientY / innerHeight) * 100;

    requestAnimationFrame(() => {
      setGradientPosition({ x, y });
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  const tracks = [
    {
      title: "Taka Taka",
      artist: "Skrillex",
      image:
        "https://i1.sndcdn.com/artworks-fRunA1Jr0ensBTzz-8qGcUQ-t500x500.jpg",
    },
    {
      title: "Sunsleeper",
      artist: "Barry Can't Swim",
      image: "https://f4.bcbits.com/img/a0459176684_65",
    },
    {
      title: "System",
      artist: "Salute",
      image: "https://f4.bcbits.com/img/a3793060197_65",
    },
    {
      title: "Forbidden Feelings",
      artist: "Nia Archives",
      image: "https://i1.sndcdn.com/artworks-uSus4Jxo8AcM-0-t500x500.jpg",
    },
  ];

  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
    setIsMuted(!isMuted);
  }, [isPlaying, isMuted]);

  const handleVolumeChange = useCallback((value: number) => {
    setVolume(value);
    // ReactPlayer handles volume through props, no need to access internal player
  }, []);

  return (
    <div
      className={`min-h-screen bg-black text-white p-6 flex flex-col ${montserrat.className} relative overflow-hidden`}
    >
      {/* Floating gradient element */}
      <div className="absolute w-96 h-96 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div
          className="w-full h-full rounded-full opacity-70 animate-float transition-all duration-1000 ease-out"
          style={{
            background: `radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, #E0EFED, #867CAD, #625B97, #3A0D4D)`,
            filter: "blur(40px)",
          }}
        ></div>
      </div>

      {/* Frosted glassmorphism layer */}
      <div className="absolute inset-0 backdrop-filter backdrop-blur-sm bg-white bg-opacity-10 z-10"></div>

      {/* Frosted glass effect */}
      <div className="absolute inset-0 backdrop-filter backdrop-blur-sm bg-black bg-opacity-20"></div>

      {/* Content */}
      <div className="relative z-20 flex-grow flex flex-col">
        <main className="flex-grow">
          <h2 className="text-lg font-semibold mb-6 text-white">
            CURRENT ROTATION
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tracks.map((track, index) => (
              <div key={index} className="flex items-stretch space-x-4">
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={track.image}
                    alt={`${track.title} by ${track.artist}`}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <h3 className="font-medium text-white">{track.title}</h3>
                  <p className="text-sm text-white text-opacity-80">
                    {track.artist}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </main>

        <footer className="mt-8">
          <h1
            className={`${montserrat.className} text-9xl font-extrabold mb-4 tracking-wider text-white`}
          >
            VENU JAMS
          </h1>
          <div className="border-t border-white border-opacity-20 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-xs text-white text-opacity-80">
                  NOW PLAYING:
                </span>
                <span className="text-sm font-medium text-white">
                  Skrillex — Taka Taka
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={handlePlayPause}>
                  {isPlaying ? (
                    <Pause size={20} className="text-white" />
                  ) : (
                    <Play size={20} className="text-white" />
                  )}
                </button>
                <div className="w-32 h-1 bg-white bg-opacity-20 rounded-full">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{
                      width: `${(currentTime / duration) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="text-xs text-white text-opacity-80">
                  {Math.floor(currentTime / 60)}:
                  {Math.floor(currentTime % 60)
                    .toString()
                    .padStart(2, "0")}
                </span>
                <span className="text-xs text-white text-opacity-80">
                  {Math.floor(duration / 60)}:
                  {Math.floor(duration % 60)
                    .toString()
                    .padStart(2, "0")}
                </span>
                <div className="flex items-center space-x-1">
                  <Volume2 size={20} className="text-white" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) =>
                      handleVolumeChange(parseFloat(e.target.value))
                    }
                    className="w-16"
                  />
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(10px, -10px) rotate(2deg);
          }
          66% {
            transform: translate(-10px, 10px) rotate(-2deg);
          }
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
        }
        .animate-float {
          animation: float 30s ease-in-out infinite;
        }
      `}</style>

      {/* Hidden ReactPlayer */}
      <div className="hidden">
        <ReactPlayer
          ref={playerRef}
          url="https://www.twitch.tv/venujams"
          playing={isPlaying}
          muted={isMuted}
          width="0"
          height="0"
          volume={1}
          config={{
            twitch: {
              options: {
                video: false,
                // Audio only mode
                playsinline: true,
              },
            },
          }}
        />
      </div>
    </div>
  );
}
