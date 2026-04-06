import React from 'react';

import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faYoutube,
  faSpotify,
  faTiktok,
  faApple,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function PrivacyPolicy() {
  const [isDarkMode, setIsDarkMode] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.volume = 0.5;
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "KeyM") setIsDarkMode((d) => !d);
      if (e.code === "KeyS") setIsPlaying((p) => !p);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div
      className={`relative min-h-screen font-sans tracking-tight overflow-x-hidden ${
        isDarkMode ? "bg-black text-[#f5f5f5]" : "bg-[#a0c4d0] text-[#2f2f2f]"
      }`}
    >
      {/* Sound toggle */}
      <button
        onClick={() => setIsPlaying((p) => !p)}
        aria-label={isPlaying ? "Pause background audio" : "Play background audio"}
        className="z-30 fixed top-4 right-16 md:right-24 bg-white/60 dark:bg-black/60 border border-gray-300 dark:border-gray-700 rounded-full p-2 shadow hover:scale-105 transition-all backdrop-blur"
        style={{ fontSize: 22 }}
      >
        <span className="sr-only">Toggle sound</span>
        <svg
          width="1.3em"
          height="1.3em"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="inline align-middle"
        >
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          {isPlaying ? (
            <path d="M19 9v6" />
          ) : (
            <path d="M19 9l2 2m0 0l-2 2" />
          )}
        </svg>
      </button>
      {/* Dark mode toggle */}
      <button
        onClick={() => setIsDarkMode((d) => !d)}
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        className="z-30 fixed top-4 right-4 bg-white/60 dark:bg-black/60 border border-gray-300 dark:border-gray-700 rounded-full p-2 shadow hover:scale-105 transition-all backdrop-blur"
        style={{ fontSize: 22 }}
      >
        <span className="sr-only">Toggle dark mode</span>
        <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
      </button>
      {/* Floating DELIA */}
      <div className="fixed top-1/2 left-0 -translate-y-1/2 -rotate-90 text-3xl md:text-5xl font-black tracking-widest text-[#5b5b5b] dark:text-[#f5f5f5] opacity-30 pointer-events-none select-none z-20 drop-shadow-xl">
        DELIA
      </div>
      <main className="px-8 py-20">
        <div className="max-w-3xl mx-auto border border-[#5b5b5b] dark:border-gray-600 p-8 bg-white/90 dark:bg-white/10 rounded-md shadow-xl backdrop-blur-sm">
          <h1 className="text-4xl font-black mb-6 uppercase">Privacy Policy</h1>
          <p className="mb-4">
            DELIA respects your privacy and is committed to protecting your personal information.
          </p>
          <p className="mb-4">
            When you sign up for our mailing list, we collect your email address so we can share occasional updates
            about our music, shows, and other moments worth remembering.
          </p>
          <p className="mb-4">
            We will never sell, trade, or give away your information to third parties. Your data stays safe with us,
            like memories in a shoebox.
          </p>
          <p className="mb-4">
            You can unsubscribe at any time by clicking the link in any email we send you. If you ever have questions
            about your data, email us at{" "}
            <a href="mailto:madebydelia1@gmail.com" className="underline hover:text-[#94b17c]">
              madebydelia1@gmail.com
            </a>.
          </p>
          <p className="mt-6 text-sm italic">
            This policy may change slightly as we grow — but our respect for your privacy will always remain.
          </p>
        </div>
      </main>
      {/* Footer */}
      <footer
        className={`w-full px-4 py-8 text-center z-10 relative
        ${isDarkMode ? "bg-black/80 text-gray-200" : "bg-[#a0c4d0]/80 text-[#2f2f2f]"}
        flex flex-col items-center gap-2`}
      >
        <div className="flex flex-row items-center justify-center gap-6 text-2xl mb-2">
          <a
            href="https://instagram.com/madebydelia"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#94b17c] transition"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a
            href="https://youtube.com/@madebydelia"
            aria-label="YouTube"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#94b17c] transition"
          >
            <FontAwesomeIcon icon={faYoutube} />
          </a>
          <a
            href="https://open.spotify.com/artist/3rQGgfHdCqkfNNpJBbGAbI"
            aria-label="Spotify"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#94b17c] transition"
          >
            <FontAwesomeIcon icon={faSpotify} />
          </a>
          <a
            href="https://tiktok.com/@madebydelia"
            aria-label="TikTok"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#94b17c] transition"
          >
            <FontAwesomeIcon icon={faTiktok} />
          </a>
          <a
            href="https://music.apple.com/us/artist/delia/1691680286"
            aria-label="Apple Music"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#94b17c] transition"
          >
            <FontAwesomeIcon icon={faApple} />
          </a>
          <a
            href="mailto:madebydelia1@gmail.com"
            aria-label="Email"
            className="hover:text-[#94b17c] transition"
          >
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
        </div>
        <div className="text-xs opacity-70">
          &copy; {new Date().getFullYear()} DELIA. All rights reserved.
        </div>
      </footer>
      {/* Grainy overlay with floating animation */}
      <div
        className="fixed inset-0 pointer-events-none z-0 grainy-motion"
        style={{
          background:
            "url('/grain.png'), repeating-linear-gradient(135deg,rgba(0,0,0,0.04) 0 2px,transparent 2px 6px)",
          opacity: isDarkMode ? 0.25 : 0.18,
          mixBlendMode: isDarkMode ? "screen" : "multiply",
          animation: "floatGrain 22s linear infinite alternate",
        }}
      />
      {/* Background gradient */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            isDarkMode
              ? "radial-gradient(ellipse 70% 60% at 50% 0%, #222 0%, #000 100%)"
              : "radial-gradient(ellipse 70% 60% at 50% 0%, #c7e5e9 0%, #a0c4d0 100%)",
        }}
      />
      {/* Audio element */}
      <audio ref={audioRef} src="/audio/loop.mp3" loop preload="auto" />
      {/* Grainy/floating style */}
      <style>{`
        @keyframes floatGrain {
          0% {
            transform: translateY(0) scale(1) rotate(0deg);
          }
          100% {
            transform: translateY(-18px) scale(1.03) rotate(0.6deg);
          }
        }
        .grainy-motion {
          will-change: transform;
        }
      `}</style>
    </div>
  );
}