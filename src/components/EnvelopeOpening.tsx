import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from 'motion/react';

export function EnvelopeOpening({ guestName, onComplete, onMusicStart }: { guestName?: string | null, onComplete: () => void, onMusicStart?: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const completedRef = useRef(false);

  const handleVideoEnd = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  };

  const handleStart = () => {
    setShowButton(false);
    setIsPlaying(true);

    // Play the video first, inside the tap, so iOS Safari treats it as user-initiated
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.play().catch((error) => {
        console.error(error);
        handleVideoEnd();
      });
    } else {
      handleVideoEnd();
    }

    if (onMusicStart) onMusicStart();
  };

  // If the video still hasn't started a few seconds after the tap (Low Power Mode,
  // slow network), open the invitation instead of leaving the guest waiting.
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => {
      if (videoRef.current && videoRef.current.currentTime === 0) handleVideoEnd();
    }, 6000);
    return () => clearTimeout(timer);
  }, [isPlaying]);

  return (
    <div className="fixed inset-0 bg-[#142540] z-[100] flex items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        src="/intro.mp4"
        poster="/intro-poster.jpg"
        className="absolute w-full h-full object-cover transition-opacity duration-1000"
        style={{ opacity: isPlaying ? 1 : 0.3 }}
        playsInline
        preload="auto"
        muted
        onEnded={handleVideoEnd}
        onError={() => { if (isPlaying) handleVideoEnd(); }}
      />
      
      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-10"
          >
            <div className="w-[1px] h-24 bg-gradient-to-b from-transparent to-brand-gold/50 mb-8" />
            {guestName && (
              <div className="text-center mb-8 px-6">
                <span className="block text-brand-gold/80 font-sans uppercase tracking-[0.4em] text-[10px] mb-3">
                  Specially Invited
                </span>
                <p className="font-display text-4xl sm:text-5xl text-brand-champagne drop-shadow-md">{guestName}</p>
              </div>
            )}
            <button
              onClick={handleStart}
              className="px-10 py-4 bg-transparent border border-brand-gold/40 text-brand-gold font-sans uppercase tracking-[0.4em] text-xs hover:bg-brand-gold hover:text-white transition-all duration-700 rounded-full shadow-[0_0_30px_rgba(193,154,75,0.1)]"
            >
              Open Invitation
            </button>
            <div className="w-[1px] h-24 bg-gradient-to-t from-transparent to-brand-gold/50 mt-8" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Skip button for convenience */}
      {!showButton && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          onClick={handleVideoEnd}
          className="absolute bottom-8 right-8 text-white/50 hover:text-white font-sans uppercase tracking-[0.2em] text-[10px] transition-colors z-20"
        >
          Skip Video
        </motion.button>
      )}
    </div>
  );
}
