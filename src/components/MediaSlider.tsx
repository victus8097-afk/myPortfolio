'use client';

// ============================================================
// MediaSlider.tsx — معرض الصور والفيديوهات
// Client Component: عرض الوسائط بترتيب الفيديوهات أولاً
// ============================================================

import { useEffect, useState, useRef } from 'react';
import type { ProjectMedia } from '@/types';
import { ChevronLeft, ChevronRight, Play, Pause, X, Maximize2 } from 'lucide-react';

interface MediaSliderProps {
  media: ProjectMedia[];
}

export default function MediaSlider({ media }: MediaSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedMediaId, setLoadedMediaId] = useState<number | null>(null);
  const [mediaError, setMediaError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxOpen]);

  const openLightbox = () => {
    setLightboxZoom(1);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxZoom(1);
    setLightboxOpen(false);
  };

  const handleLightboxWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setLightboxZoom((current) => Math.min(4, Math.max(1, current + (event.deltaY < 0 ? 0.2 : -0.2))));
  };

  const orderedMedia = [...media].sort((a, b) => {
    if (a.media_type !== b.media_type) return a.media_type === 'video' ? -1 : 1;
    return a.sort_order - b.sort_order;
  });

  if (orderedMedia.length === 0) {
    return (
      <div className="project-media-empty brutal-card h-64 flex items-center justify-center bg-brutal-gray">
        <p className="text-sm font-bold text-[#111111]/45">لا توجد وسائط مضافة لهذا العمل</p>
      </div>
    );
  }

  const currentMedia = orderedMedia[currentIndex];
  const isLoading = loadedMediaId !== currentMedia.id && !mediaError;

  const selectMedia = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false);
    setMediaError(false);
    closeLightbox();
  };

  const goToPrev = () => {
    selectMedia(currentIndex === 0 ? orderedMedia.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    selectMedia(currentIndex === orderedMedia.length - 1 ? 0 : currentIndex + 1);
  };

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="project-media-viewer relative">
      <div className="project-media-frame brutal-card overflow-hidden bg-black border-4 border-[#111111] shadow-[6px_6px_0px_#111111] rounded-xl">
        <div className="project-media-header bg-[#111111] px-4 py-2 flex items-center justify-between gap-3">
          <span className="text-white text-xs font-bold">
            {currentMedia.media_type === 'video' ? 'فيديو' : 'صورة'} — {currentIndex + 1} / {orderedMedia.length}
          </span>
          {currentMedia.media_type === 'image' && !isLoading && !mediaError && (
            <button type="button" onClick={openLightbox} className="text-white/70 hover:text-white" aria-label="تكبير الصورة">
              <Maximize2 size={16} />
            </button>
          )}
        </div>

        <div className="project-media-content relative aspect-video bg-brutal-gray flex items-center justify-center">
          {currentMedia.media_type === 'image' ? (
            <button
              type="button"
              className="w-full h-full cursor-zoom-in disabled:cursor-default"
onClick={openLightbox}
              disabled={isLoading || mediaError}
            >
              <img
                src={currentMedia.media_url}
                alt={`صورة العمل ${currentIndex + 1}`}
                className="w-full h-full object-contain"
                onLoad={() => setLoadedMediaId(currentMedia.id)}
                onError={() => setMediaError(true)}
              />
            </button>
          ) : (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                src={currentMedia.media_url}
                className="w-full h-full object-contain"
                onLoadedData={() => setLoadedMediaId(currentMedia.id)}
                onError={() => setMediaError(true)}
                onEnded={() => setIsPlaying(false)}
              />
              <button onClick={toggleVideoPlay} className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors" aria-label={isPlaying ? 'إيقاف الفيديو' : 'تشغيل الفيديو'}>
                <span className="w-16 h-16 rounded-full bg-white/90 border-3 border-[#111111] shadow-[3px_3px_0px_#111111] flex items-center justify-center">
                  {isPlaying ? <Pause size={24} className="text-[#111111]" /> : <Play size={24} className="text-[#111111] ml-1" />}
                </span>
              </button>
            </div>
          )}

          {isLoading && (
            <div className="project-media-loading absolute inset-0 flex flex-col items-center justify-center gap-3">
              <span className="project-media-spinner" aria-hidden="true"></span>
              <p>جاري تحميل الوسيطة...</p>
            </div>
          )}
          {mediaError && <p className="absolute inset-0 flex items-center justify-center font-bold text-brutal-red bg-white/80">تعذر تحميل الوسيطة</p>}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-4">
        <button onClick={goToPrev} className="media-slider-control" aria-label="الوسائط السابقة">
          <ChevronRight size={20} />
        </button>
        <div className="flex gap-2">
          {orderedMedia.map((item, index) => (
            <button
              key={item.id}
              onClick={() => selectMedia(index)}
              className={`media-slider-dot ${index === currentIndex ? 'is-active' : ''}`}
              aria-label={`عرض الوسيطة ${index + 1}`}
            />
          ))}
        </div>
        <button onClick={goToNext} className="media-slider-control" aria-label="الوسائط التالية">
          <ChevronLeft size={20} />
        </button>
      </div>

      {lightboxOpen && currentMedia.media_type === 'image' && !mediaError && (
        <div
          className="project-media-lightbox fixed inset-0 z-[80] flex items-center justify-center p-4"
          onClick={closeLightbox}
          onWheel={handleLightboxWheel}
        >
          <div className="media-lightbox-toolbar">
            مرّر عجلة الماوس للتكبير — {Math.round(lightboxZoom * 100)}%
          </div>
          <button type="button" onClick={closeLightbox} className="absolute top-5 right-5 media-lightbox-close" aria-label="إغلاق الصورة">
            <X size={22} />
          </button>
          <img
            src={currentMedia.media_url}
            alt={`صورة العمل ${currentIndex + 1} بالحجم الكامل`}
            className="media-lightbox-image object-contain border-4 border-white shadow-[8px_8px_0px_#0F0F0F]"
            style={{ transform: `scale(${lightboxZoom})` }}
            onClick={(event) => event.stopPropagation()}
            onWheel={handleLightboxWheel}
          />
        </div>
      )}
    </div>
  );
}
