import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerData {
  id: number;
  title: string;
  image_url: string;
  description: string;
  link_url: string;
  sort_order: number;
}

export function Banner() {
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('http://localhost:8000/banners/');
        if (response.ok) {
          const data = await response.json();
          setBanners(data);
        }
      } catch (error) {
        console.error('Failed to fetch banners:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || banners.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, banners.length]);

  const goToPrevious = () => {
    if (banners.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    if (banners.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % banners.length);
    setIsAutoPlaying(false);
  };

  if (loading) {
    return (
      <div className="w-full h-[300px] md:h-[400px] bg-gray-100 animate-pulse flex items-center justify-center">
        <span className="text-gray-400">加载中...</span>
      </div>
    );
  }

  if (banners.length === 0) return null;

  // Predefined gradients for variety if not provided by backend
  const gradients = [
    'from-pink-500 to-rose-500',
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-indigo-500',
    'from-orange-500 to-red-500',
    'from-green-500 to-teal-500'
  ];

  return (
    <div
      className="relative w-full h-[300px] md:h-[400px] overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentIndex
              ? 'opacity-100 translate-x-0'
              : index < currentIndex
                ? 'opacity-0 -translate-x-full'
                : 'opacity-0 translate-x-full'
            }`}
        >
          <div className="relative w-full h-full">
            <img
              src={banner.image_url}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${gradients[index % gradients.length]} opacity-60`} />
            <div className="absolute inset-0 flex items-center justify-center text-white text-center px-4">
              <div>
                <h2 className="text-4xl md:text-6xl mb-4 drop-shadow-lg font-bold">{banner.title}</h2>
                <p className="text-lg md:text-2xl drop-shadow-md">{banner.description}</p>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10"
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsAutoPlaying(false);
            }}
            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
              }`}
          />
        ))}
      </div>
    </div>
  );
}
