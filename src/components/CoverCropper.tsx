'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, X } from 'lucide-react';

interface CoverCropperProps {
  file: File;
  onCancel: () => void;
  onConfirm: (file: File) => void;
}

const OUTPUT_WIDTH = 1200;
const OUTPUT_HEIGHT = 600;

export default function CoverCropper({ file, onCancel, onConfirm }: CoverCropperProps) {
  const sourceUrl = useMemo(() => URL.createObjectURL(file), [file]);
  const [zoom, setZoom] = useState(1);
  const [positionX, setPositionX] = useState(50);
  const [positionY, setPositionY] = useState(50);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => () => URL.revokeObjectURL(sourceUrl), [sourceUrl]);

  const confirmCrop = () => {
    if (!sourceUrl) return;

    setIsProcessing(true);
    const image = new window.Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = OUTPUT_WIDTH;
      canvas.height = OUTPUT_HEIGHT;
      const context = canvas.getContext('2d');

      if (!context) {
        setIsProcessing(false);
        return;
      }

      const sourceRatio = image.naturalWidth / image.naturalHeight;
      const targetRatio = OUTPUT_WIDTH / OUTPUT_HEIGHT;
      let renderedWidth: number;
      let renderedHeight: number;

      if (sourceRatio > targetRatio) {
        renderedHeight = OUTPUT_HEIGHT;
        renderedWidth = renderedHeight * sourceRatio;
      } else {
        renderedWidth = OUTPUT_WIDTH;
        renderedHeight = renderedWidth / sourceRatio;
      }

      renderedWidth *= zoom;
      renderedHeight *= zoom;
      const offsetX = (OUTPUT_WIDTH - renderedWidth) * (positionX / 100);
      const offsetY = (OUTPUT_HEIGHT - renderedHeight) * (positionY / 100);

      context.fillStyle = '#F8F9FB';
      context.fillRect(0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT);
      context.drawImage(image, offsetX, offsetY, renderedWidth, renderedHeight);

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
      <div className="dashboard-cropper-card brutal-card w-full max-w-2xl p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-bold text-[#111111]/45 mb-1">تجهيز الغلاف</p>
            <h3 className="text-xl font-black text-[#111111]">حدد الجزء الظاهر في البطاقة</h3>
            <p className="text-xs text-[#111111]/50 mt-1">منطقة العرض: 1200 × 600 بنسبة 2:1</p>
          </div>
          <button type="button" onClick={onCancel} className="p-1.5 rounded-lg border-2 border-[#111111]">
            <X size={16} />
          </button>
        </div>

        <div className="dashboard-crop-frame">
          {sourceUrl && (
            <img
              src={sourceUrl}
              alt="معاينة الغلاف"
              style={{
                transform: `scale(${zoom})`,
                objectPosition: `${positionX}% ${positionY}%`,
              }}
            />
          )}
          <div className="dashboard-crop-frame-border" aria-hidden="true"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          <label className="text-xs font-bold text-[#111111]/65">
            التكبير
            <input className="w-full accent-[#0F0F0F] mt-2" type="range" min="1" max="3" step="0.05" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} />
          </label>
          <label className="text-xs font-bold text-[#111111]/65">
            التحريك الأفقي
            <input className="w-full accent-[#0F0F0F] mt-2" type="range" min="0" max="100" value={positionX} onChange={(event) => setPositionX(Number(event.target.value))} />
          </label>
          <label className="text-xs font-bold text-[#111111]/65">
            التحريك الرأسي
            <input className="w-full accent-[#0F0F0F] mt-2" type="range" min="0" max="100" value={positionY} onChange={(event) => setPositionY(Number(event.target.value))} />
          </label>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end mt-6">
          <button type="button" onClick={onCancel} className="brutal-btn bg-white text-sm">
            إلغاء
          </button>
          <button type="button" onClick={confirmCrop} disabled={isProcessing} className="brutal-btn brutal-btn-mint text-sm">
            <Check size={16} />
            {isProcessing ? 'جاري التجهيز...' : 'اعتماد الغلاف'}
          </button>
        </div>
      </div>
    </div>
  );
}
