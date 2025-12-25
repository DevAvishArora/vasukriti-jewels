"use client";

import { useEffect, useRef } from "react";

export default function GlobalAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element if not present
    let audio = document.getElementById("global-audio") as HTMLAudioElement | null;
    if (!audio) {
      audio = document.createElement("audio");
      audio.id = "global-audio";
      // Try CDN source first, fallback to local file
      audio.src = "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kevin_MacLeod/Impact/Kevin_MacLeod_-_Thatched_Villagers.mp3";
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = 0.15; // Start at 15% volume for subtle ambient background
      audio.style.display = "none";
      document.body.appendChild(audio);
      
      // Fallback to local file if CDN fails
      audio.addEventListener('error', () => {
        if (audio?.src.includes('freemusicarchive')) {
          audio.src = "/audio/ambient-music.mp3";
          audio.load();
        }
      }, { once: true });
    }

    audioRef.current = audio;

    // Initialize playing state from localStorage
    const saved = globalThis.localStorage?.getItem?.("global-audio-playing");
    if (saved === "true") {
      // try play, browsers may block until user gesture
      audio.play().catch(() => {
          /* ignore autoplay errors */
        });
    }

    const handleControl = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (!detail || !audioRef.current) return;
      const type = detail.type;
      if (type === "toggle") {
        if (audioRef.current.paused) {
          audioRef.current.play().then(() => {
          globalThis.localStorage?.setItem?.("global-audio-playing", "true");
          globalThis.dispatchEvent(new CustomEvent("global-audio-state", { detail: { isPlaying: true } }));
          }).catch(() => {
          /* ignore */
         });
        } else {
          audioRef.current.pause();
          globalThis.localStorage?.setItem?.("global-audio-playing", "false");
          globalThis.dispatchEvent(new CustomEvent("global-audio-state", { detail: { isPlaying: false } }));
        }
      } else if (type === "play") {
        audioRef.current.play();
        globalThis.localStorage?.setItem?.("global-audio-playing", "true");
        globalThis.dispatchEvent(new CustomEvent("global-audio-state", { detail: { isPlaying: true } }));
      } else if (type === "pause") {
        audioRef.current.pause();
          globalThis.localStorage?.setItem?.("global-audio-playing", "false");
          globalThis.dispatchEvent(new CustomEvent("global-audio-state", { detail: { isPlaying: false } }));
      } else if (type === "mute") {
        audioRef.current.muted = !!detail.value;
      }
    };

    globalThis.addEventListener("global-audio-control", handleControl as EventListener);

    return () => {
      globalThis.removeEventListener("global-audio-control", handleControl as EventListener);
    };
  }, []);

  // Inform other UI about state changes when audio element changes from other sources
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => globalThis.dispatchEvent(new CustomEvent("global-audio-state", { detail: { isPlaying: true } }));
    const onPause = () => globalThis.dispatchEvent(new CustomEvent("global-audio-state", { detail: { isPlaying: false } }));
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  return null; // hidden audio element is managed via DOM
}
