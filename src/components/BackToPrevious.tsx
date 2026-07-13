'use client';

import { useRouter } from 'next/navigation';

export default function BackToPrevious() {
  const router = useRouter();

  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <button onClick={goBack} className="brutal-btn brutal-btn-mint text-base">
      العودة للمكان السابق
    </button>
  );
}
