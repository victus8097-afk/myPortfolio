'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Move, X } from 'lucide-react';

interface CoverCropperProps {
  file: File;
  onCancel: () => void;
  onConfirm: (file: File) => void;
}

interface CropBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageSize {
  width: number;
  height: number;
}

const OUTPUT_WIDTH = 1200;
const OUTPUT_HEIGHT = 600;
const CROP_RATIO = OUTPUT_WIDTH / OUTPUT_HEIGHT;

export default function CoverCropper({ file, onCancel, onConfirm }: CoverCropperProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; crop: CropBox } | null>(null);
  const sourceUrl = useMemo(() => URL.createObjectURL(file), [file]);
  const [imageSize, setImageSize] = useState<ImageSize | null>(null);
  const [cropBox, setCropBox] = useState<CropBox | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => () => URL.revokeObjectURL(sourceUrl), [sourceUrl]);

  const updateCropBox = useCallback(() => {
    if (!stageRef.current || !imageSize || cropBox) return;

    const stage = stageRef.current.getBoundingClientRect();
    const width = Math.min(stage.width * 0.82, stage.height * CROP_RATIO);
    const height = width / CROP_RATIO;

    setCropBox({
      x: (stage.width - width) / 2,
      y: (stage.height - height) / 2,
      width,
      height,
    });
  }, [cropBox, imageSize]);

  useEffect(() => {
    if (!stageRef.current || !imageSize) return;
    const observer = new ResizeObserver(updateCropBox);
    observer.observe(stageRef.current);
    updateCropBox();
    return () => observer.disconnect();
  }, [imageSize, updateCropBox]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!cropBox) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      crop: cropBox,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || !stageRef.current) return;
    const stage = stageRef.current.getBoundingClientRect();
    const { startX, startY, crop } = dragRef.current;
    const nextX = Math.max(0, Math.min(stage.width - crop.width, crop.x + event.clientX - startX));
    const nextY = Math.max(0, Math.min(stage.height - crop.height, crop.y + event.clientY - startY));
    setCropBox({ ...crop, x: nextX, y: nextY });
  };

  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current) {
      event.currentTarget.releasePointerCapture(event.pointerId);
      dragRef.current = null;
    }
  };

  const confirmCrop = () => {
    if (!cropBox || !imageSize || !stageRef.current) return;

    setIsProcessing(true);
    const image = new window.Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = OUTPUT_WIDTH;
      canvas.height = OUTPUT_HEIGHT;
      const context = canvas.getContext('2d');
      const stage = stageRef.current?.getBoundingClientRect();

      if (!context || !stage) {
        setIsProcessing(false);
        return;
      }

      const sourceX = (cropBox.x / stage.width) * imageSize.width;
      const sourceY = (cropBox.y / stage.height) * imageSize.height;
      const sourceWidth = (cropBox.width / stage.width) * imageSize.width;
      const sourceHeight = (cropBox.height / stage.height) * imageSize.height;

      context.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        OUTPUT_WIDTH,
        OUTPUT_HEIGHT,
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          setIsProcessing(false);
          return;
        }
        const fileName = file.name.replace(/\.[^/.]+$/, '') || 'cover';
        onConfirm(new File([blob], `${fileName}-cover.jpg`, { type: 'image/jpeg' }));
        setIsProcessing(false);
      }, 'image/jpeg', 0.92);
    };
    image.onerror = () => setIsProcessing(false);
    image.src = sourceUrl;
  };

  return (
    <div className="dashboard-cropper fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="dashboard-cropper-card brutal-card w-full max-w-3xl p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-bold text-[#111111]/45 mb-1">تجهيز الغلاف</p>
            <h3 className="text-xl font-black text-[#111111]">حدد الجزء الظاهر في البطاقة</h3>
            <p className="text-xs text-[#111111]/50 mt-1">حرّك الإطار داخل الصورة — مساحة العرض 1200 × 600 بنسبة 2:1</p>
          </div>
          <button type="button" onClick={onCancel} className="p-1.5 rounded-lg border-2 border-[#111111]">
            <X size={16} />
          </button>
        </div>

        <div ref={stageRef} className="dashboard-crop-stage" style={{ aspectRatio: imageSize ? `${imageSize.width} / ${imageSize.height}` : '16 / 9' }}>
          <img
            src={sourceUrl}
            alt="معاينة الصورة قبل اعتماد الغلاف"
            onLoad={(event) => setImageSize({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })}
          />
          {cropBox && (
            <div
              className="dashboard-crop-box"
              style={{ left: cropBox.x, top: cropBox.y, width: cropBox.width, height: cropBox.height }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={stopDragging}
              onPointerCancel={stopDragging}
            >
              <div className="dashboard-crop-grid" aria-hidden="true"></div>
              <span className="dashboard-crop-hint"><Move size={15} /> اسحب لتحديد الجزء الظاهر</span>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end mt-6">
          <button type="button" onClick={onCancel} className="brutal-btn bg-white text-sm">
            إلغاء
          </button>
          <button type="button" onClick={confirmCrop} disabled={!cropBox || isProcessing} className="brutal-btn brutal-btn-mint text-sm">
            <Check size={16} />
            {isProcessing ? 'جاري تجهيز الغلاف...' : 'اعتماد الغلاف'}
          </button>
        </div>
      </div>
    </div>
  );
}
