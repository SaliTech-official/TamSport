import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { id: 1, image: "/images/banners/tam_academy.jpg" },
    { id: 2, image: "/images/banners/tam_isfahan.jpg" },
    { id: 3, image: "/images/banners/the_ceo_of_tam.jpg" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-full max-w-[1300px] h-[240px] sm:h-[320px] md:h-[420px] lg:h-[540px] xl:h-[640px] mx-auto rounded-2xl overflow-hidden">
      {slides.map((slide, index) => (
        <Link to={`/pre-register`} key={slide.id}>
          <div
          key={slide.id}
          className={`absolute w-full h-full transition-opacity duration-500 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={`slider-${slide.id}`}
            className="w-full h-full object-cover"
          />
        </div>
        </Link>
      ))}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-quinary-tint-900 shadow-[0_0_12px_rgba(1,22,56,1)]'
                : 'bg-quinary-tint-900/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider; 