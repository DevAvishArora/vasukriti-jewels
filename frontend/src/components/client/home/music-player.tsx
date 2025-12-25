'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Volume2, VolumeX, Play, Pause, Minimize2 } from 'lucide-react';

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Load user preferences from localStorage
  useEffect(() => {
    const savedVolume = localStorage.getItem('music-volume');
    const savedMuted = localStorage.getItem('music-muted');
    const savedPlaying = localStorage.getItem('music-playing');

    if (savedVolume) setVolume(parseFloat(savedVolume));
    if (savedMuted) setIsMuted(savedMuted === 'true');
    if (savedPlaying === 'true' && hasInteracted) {
      setIsPlaying(true);
    }
  }, [hasInteracted]);

  // Auto-start music on first user interaction (browser policy compliant)
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        const savedPlaying = localStorage.getItem('music-playing');
        if (savedPlaying !== 'false') {
          setTimeout(() => {
            setIsPlaying(true);
          }, 1000);
        }
      }
    };

    document.addEventListener('click', handleFirstInteraction, { once: true });
    return () => document.removeEventListener('click', handleFirstInteraction);
  }, [hasInteracted]);

  // Control audio playback
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Control volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Save preferences
  useEffect(() => {
    localStorage.setItem('music-volume', volume.toString());
    localStorage.setItem('music-muted', isMuted.toString());
    localStorage.setItem('music-playing', isPlaying.toString());
  }, [volume, isMuted, isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!hasInteracted) setHasInteracted(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) setIsMuted(false);
  };

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
      >
        <source src="/audio/ambient-music.mp3" type="audio/mpeg" />
        {/* Fallback for browsers that don't support audio */}
      </audio>

      {/* Music Player UI */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <div className="relative group">
              {/* Main Player Card */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-4 min-w-[280px]">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Music className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-white font-medium text-sm">
                      Ambient Music
                    </span>
                  </div>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="text-white/60 hover:text-white transition-colors"
                    aria-label="Minimize player"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Now Playing */}
                <div className="mb-4">
                  <p className="text-white/80 text-xs mb-1">Now Playing</p>
                  <p className="text-white text-sm font-medium">
                    Luxury Shopping Experience
                  </p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                  {/* Play/Pause Button */}
                  <motion.button
                    onClick={togglePlay}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#F4C430] rounded-full flex items-center justify-center text-[#1a1a1a] shadow-lg hover:shadow-[#D4AF37]/50 transition-all duration-300"
                    aria-label={isPlaying ? 'Pause music' : 'Play music'}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" fill="currentColor" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                    )}
                  </motion.button>

                  {/* Volume Control */}
                  <div className="flex-1 flex items-center gap-2">
                    <button
                      onClick={toggleMute}
                      className="text-white/80 hover:text-white transition-colors"
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>

                    {/* Volume Slider */}
                    <div className="flex-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#D4AF37] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                        aria-label="Volume"
                      />
                    </div>
                  </div>
                </div>

                {/* Tooltip - First Visit */}
                {!hasInteracted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-[#1a1a1a] text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg"
                  >
                    🎵 Click anywhere to enable music
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-[#1a1a1a]" />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized Button */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsExpanded(true)}
            className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-br from-[#D4AF37] to-[#F4C430] rounded-full flex items-center justify-center shadow-2xl hover:shadow-[#D4AF37]/50 transition-all duration-300 group"
            aria-label="Open music player"
          >
            <Music className="w-6 h-6 text-[#1a1a1a]" />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
