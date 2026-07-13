'use client';

// ============================================================
// MediaSlider.tsx — معرض الوسائط التفاعلي (Carousel)
// Client Component: Lazy Loading / Dynamic Import فقط
// أزرار تشبه أزرار مسجلات الكاسيت القديمة
// ============================================================

import { useState, useRef } from 'react';
import type { ProjectMedia } from '@/types';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface MediaSliderProps {
  media: ProjectMedia[];
}

export default function MediaSlider({ media }: MediaSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!media || media.length === 0) {
    return (
      <div className="brutal-card h-64 flex items-center justify-center bg-brutal-gray">
        <span className="text-6xl">🖼️</span>
      </div>
    );
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
    setIsPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
    setIsPlaying(false);
  };

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const currentMedia = media[currentIndex];

  return (
    <div className="relative">
      {/* إطار شاشة العرض الكرتوني */}
      <div className="brutal-card overflow-hidden bg-black border-4 border-[#111111] shadow-[6px_6px_0px_#111111] rounded-xl">
        {/* شريط العنوان */}
        <div className="bg-[#111111] px-4 py-2 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-brutal-red border border-[#111111]"></div>
          <div className="w-3 h-3 rounded-full bg-warm border border-[#111111]"></div>
          <div className="w-3 h-3 rounded-full bg-mint border border-[#111111]"></div>
          <span className="text-white text-xs font-mono ml-4">
            عرض الوسائط — {currentIndex + 1} / {media.length}
          </span>
        </div>

        {/* المحتوى */}
        <div className="relative aspect-video bg-brutal-gray flex items-center justify-center">
          {currentMedia.media_type === 'image' ? (
            <img
              src={currentMedia.media_url}
              alt={`وسائط المشروع ${currentIndex + 1}`}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                src={currentMedia.media_url}
                className="w-full h-full object-contain"
                onEnded={() => setIsPlaying(false)}
              />
              <button
                onClick={toggleVideoPlay}
                className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
              >
                <div className="w-16 h-16 rounded-full bg-white/90 border-3 border-[#111111] shadow-[3px_3px_0px_#111111] flex items-center justify-center">
                  {isPlaying ? (
                    <Pause size={24} className="text-[#111111]" />
                  ) : (
                    <Play size={24} className="text-[#111111] ml-1" />
                  )}
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* أزرار التحكم بأسلوب الكاسيت */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={goToPrev}
          className="brutal-btn brutal-btn-dark w-12 h-12 p-0 rounded-full"
          aria-label="السابق"
        >
          <ChevronRight size={20} />
        </button>

        {/* نقاط التقدم */}
        <div className="flex gap-2">
          {media.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsPlaying(false);
              }}
              className={`w-3 h-3 rounded-full border-2 border-[#111111] transition-all ${
                index === currentIndex
                  ? 'bg-mint scale-125'
                  : 'bg-white hover:bg-gray-200'
              }`}
              aria-label={`الانتقال للوسائط ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={goToNext}
          className="brutal-btn brutal-btn-dark w-12 h-12 p-0 rounded-full"
          aria-label="التالي"
        >
          <ChevronLeft size={20} />
        </button>
      </div>
    </div>
  );
}
