"use client";

import { useState, useRef, useEffect } from "react";

interface PlaybookAudioPlayerProps {
  audioUrl: string | null;
  audioDurationSeconds: number | null;
}

/**
 * Playbook 音频播放器组件
 * 
 * 功能：
 * - 如果 audio_url 为 null：显示 "音频即将推出" 的禁用状态
 * - 如果 audio_url 不为 null：显示播放器，支持播放/暂停
 */
export default function PlaybookAudioPlayer({
  audioUrl,
  audioDurationSeconds,
}: PlaybookAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // 如果没有音频 URL，显示禁用状态
  if (!audioUrl) {
    return (
      <div className="flex items-center gap-2 text-gray-500 cursor-not-allowed">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-sm">Listen to this article (audio coming soon)</span>
      </div>
    );
  }

  // 如果有音频 URL，显示播放器
  return (
    <div className="flex items-center gap-3">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <button
        onClick={togglePlayPause}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 transition-colors"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 ml-0.5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-sm text-white whitespace-nowrap">
          {formatTime(currentTime)}
        </span>
        <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all"
            style={{
              width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%",
            }}
          />
        </div>
        <span className="text-sm text-gray-400 whitespace-nowrap">
          {audioDurationSeconds
            ? formatTime(audioDurationSeconds)
            : formatTime(duration)}
        </span>
      </div>

      <span className="text-sm text-white">Listen to this article</span>
    </div>
  );
}

