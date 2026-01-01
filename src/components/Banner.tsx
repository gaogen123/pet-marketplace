import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const banners = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1584867818838-5312e821fe15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBzdG9yZSUyMGJhbm5lcnxlbnwxfHx8fDE3NjcyNjQ1Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: '新年大促',
    subtitle: '全场满199减50，满399减120',
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1581888227599-779811939961?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBiZWR8ZW58MXx8fHwxNzY3MjY0NDQ0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: '宠物用品专场',
    subtitle: '精选好物，舒适生活每一天',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1589924749359-9697080c3577?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjB0b3lzfGVufDF8fHx8MTc2NzE3Mjk3MXww&ixlib=rb-4.1.0&q=80&w=1080',
    title: '玩具总动员',
    subtitle: '让宠物玩得更开心',
    color: 'from-purple-500 to-indigo-500'
  },
];

export function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
    setIsAutoPlaying(false);
  };

  return (
    <div 
      className="relative w-full h-[300px] md:h-[400px] overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === currentIndex
              ? 'opacity-100 translate-x-0'
              : index < currentIndex
              ? 'opacity-0 -translate-x-full'
              : 'opacity-0 translate-x-full'
          }`}
        >
          <div className="relative w-full h-full">
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${banner.color} opacity-60`} />
            <div className="absolute inset-0 flex items-center justify-center text-white text-center px-4">
              <div>
                <h2 className="text-4xl md:text-6xl mb-4 drop-shadow-lg">{banner.title}</h2>
                <p className="text-lg md:text-2xl drop-shadow-md">{banner.subtitle}</p>
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
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
