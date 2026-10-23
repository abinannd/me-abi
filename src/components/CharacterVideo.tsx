import React, { useEffect, useRef } from 'react';

export interface CharacterVideoProps {
  className?: string;
  style?: React.CSSProperties;
  src?: string;
}

export const CharacterVideo: React.FC<CharacterVideoProps> = ({
  className,
  style,
  src = '/assets/character/me2.mp4',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Safely attempt autoplay
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay may be restricted by some browser policies until user interacts
      });
    }

    // Cleanup on unmount
    return () => {
      video.pause();
    };
  }, []);

  return (
    <div className={`character-container ${className || ''}`} style={style}>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="character-media"
      />
    </div>
  );
};
