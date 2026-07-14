'use client';

// ============================================================
// MediaSlider.tsx — معرض الصور والفيديوهات
// Client Component: الفيديوهات أولاً مع تحميل خلفي للوسائط
// ============================================================

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ProjectMedia } from '@/types';
import { ChevronLeft, ChevronRight, Play, Pause, X, Maximize2, Download } from 'lucide-react';

interface MediaSliderProps {
  media: ProjectMedia[];
}

export default function MediaSlider({ media }: MediaSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedMediaId, setLoadedMediaId] = useState<number | null>(null);
  const [mediaError, setMediaError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [lightboxPan, setLightboxPan] = useState({ x: 0, y: 0 });
  const lightboxDragRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const orderedMedia = useMemo(
    () => [...media].sort((a, b) => {
      if (a.media_type !== b.media_type) return a.media_type === 'video' ? -1 : 1;
      return a.sort_order - b.sort_order;
    }),
    [media],
  );

  // تحميل الصور في الخلفية، وطلب بيانات الفيديوهات بالتتابع كل خمس ثوانٍ.
  useEffect(() => {
    const images = orderedMedia.filter((item) => item.media_type === 'image');
    images.forEach((item) => {
      const image = new window.Image();
      image.src = item.media_url;
    });

    const videos = orderedMedia.filter((item) => item.media_type === 'video');
    let nextVideo = 0;
    const preloadVideo = () => {
      const item = videos[nextVideo];
      if (!item) return;
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = item.media_url;
      video.load();
      nextVideo += 1;
    };

    preloadVideo();
    const interval = window.setInterval(preloadVideo, 5000);
    return () => window.clearInterval(interval);
  }, [orderedMedia]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxOpen]);

  if (orderedMedia.length === 0) {
    return (
      <div className="project-media-empty brutal-card h-64 flex items-center justify-center bg-brutal-gray">
        <p className="text-sm font-bold text-[#111111]/45">لا توجد وسائط مضافة لهذا العمل</p>
      </div>
    );
  }

  const currentMedia = orderedMedia[currentIndex];
  const isLoading = loadedMediaId !== currentMedia.id && !mediaError;

  const openLightbox = () => {
    setLightboxZoom(1);
    setLightboxPan({ x: 0, y: 0 });
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxZoom(1);
    setLightboxPan({ x: 0, y: 0 });
    setLightboxOpen(false);
  };

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

  const handleLightboxWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setLightboxZoom((current) => {
      const nextZoom = Math.min(4, Math.max(1, current + (event.deltaY < 0 ? 0.2 : -0.2)));
      if (nextZoom === 1) setLightboxPan({ x: 0, y: 0 });
      return nextZoom;
    });
  };

  const handleLightboxPointerDown = (event: React.PointerEvent<HTMLImageElement>) => {
    if (lightboxZoom <= 1) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    lightboxDragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      panX: lightboxPan.x,
      panY: lightboxPan.y,
    };
  };

  const handleLightboxPointerMove = (event: React.PointerEvent<HTMLImageElement>) => {
    if (!lightboxDragRef.current) return;
    const drag = lightboxDragRef.current;
    setLightboxPan({
      x: drag.panX + event.clientX - drag.startX,
      y: drag.panY + event.clientY - drag.startY,
    });
  };

  const stopLightboxDragging = (event: React.PointerEvent<HTMLImageElement>) => {
    if (lightboxDragRef.current) {
      event.currentTarget.releasePointerCapture(event.pointerId);
      lightboxDragRef.current = null;
    }
  };

  const handleDownload = async () => {
    const extension = currentMedia.media_type === 'video' ? 'mp4' : 'jpg';
    const fileName = `work-media-${currentMedia.id}.${extension}`;
    try {
      const response = await fetch(currentMedia.media_url);
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(currentMedia.media_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="project-media-viewer relative">
      <div className="project-media-frame brutal-card overflow-hidden bg-black border-4 border-[#111111] shadow-[6px_6px_0px_#111111] rounded-xl">
        <div className="project-media-header bg-[#111111] px-4 py-2 flex items-center justify-between gap-3">
          <span className="text-white text-xs font-bold">
            {currentMedia.media_type === 'video' ? 'فيديو' : 'صورة'} — {currentIndex + 1} / {orderedMedia.length}
          </span>
          {!isLoading && !mediaError && (
            <div className="flex items-center gap-3">
              <button type="button" onClick={handleDownload} className="text-white/70 hover:text-white" aria-label="تنزيل الوسيطة">
                <Download size={16} />
              </button>
              <button type="button" onClick={openLightbox} className="text-white/70 hover:text-white" aria-label="عرض الوسيطة بحجم كبير">
                <Maximize2 size={16} />
              </button>
            </div>
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
                preload="auto"
                playsInline
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
            <button key={item.id} onClick={() => selectMedia(index)} className={`media-slider-dot ${index === currentIndex ? 'is-active' : ''}`} aria-label={`عرض الوسيطة ${index + 1}`} />
          ))}
        </div>
        <button onClick={goToNext} className="media-slider-control" aria-label="الوسائط التالية">
          <ChevronLeft size={20} />
        </button>
      </div>

      {lightboxOpen && !mediaError && (
        <div className="project-media-lightbox fixed inset-0 z-[80] flex items-center justify-center p-4" onClick={closeLightbox} onWheel={currentMedia.media_type === 'image' ? handleLightboxWheel : undefined}>
          <div className="media-lightbox-content" onClick={(event) => event.stopPropagation()}>
            {currentMedia.media_type === 'image' ? (
              <img
                src={currentMedia.media_url}
                alt={`صورة العمل ${currentIndex + 1} بالحجم الكامل`}
                className="media-lightbox-image object-contain border-4 border-white shadow-[8px_8px_0px_#0F0F0F]"
                style={{ transform: `translate(${lightboxPan.x}px, ${lightboxPan.y}px) scale(${lightboxZoom})` }}
                onPointerDown={handleLightboxPointerDown}
                onPointerMove={handleLightboxPointerMove}
                onPointerUp={stopLightboxDragging}
                onPointerCancel={stopLightboxDragging}
                onWheel={handleLightboxWheel}
              />
            ) : (
              <video src={currentMedia.media_url} className="media-lightbox-video" controls autoPlay playsInline />
            )}
            <div className="media-lightbox-toolbar">
              {currentMedia.media_type === 'image' ? `مرّر عجلة الماوس للتكبير — ${Math.round(lightboxZoom * 100)}%` : 'يمكنك تشغيل الفيديو والتحكم به من هنا'}
              <button type="button" onClick={handleDownload} className="media-lightbox-download"><Download size={15} /> تنزيل</button>
            </div>
          </div>
          <button type="button" onClick={closeLightbox} className="absolute top-5 right-5 media-lightbox-close" aria-label="إغلاق الوسيطة">
            <X size={22} />
          </button>
        </div>
      )}
    </div>
  );
}
