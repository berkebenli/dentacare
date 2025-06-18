"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SliderImage {
  src: string
  alt: string
  title?: string
  description?: string
}

const heroImages: SliderImage[] = [
  {
    src: "/images/dental-hero.png",
    alt: "Modern Diş Kliniği",
    title: "Dijital Gülüş Tasarımı",
    description: "Size özel dijital gülüş tasarımı ile o özlediğiniz gülümseye şimdi kavuşun."
  },

  {
    src: "/images/dental-team.png",
    alt: "Diş Tedavi Odası",
    title: "Konforlu Ortam",
    description: "Rahat ve hijyenik tedavi ortamı",
  },
    {
    src: "/images/hollywood_smiles.png",
    alt: "Hollywood Gülüşü",
    title: "Hollywood Gülüşü",
    description: "Hayalinizdeki gülüşe kavuşmanın sırrı",
  },

]

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Otomatik geçiş
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
    }, 4000) // 4 saniyede bir değişir

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + heroImages.length) % heroImages.length)
    setIsAutoPlaying(false) // Manuel kontrol yapıldığında otomatik geçişi durdur
    setTimeout(() => setIsAutoPlaying(true), 10000) // 10 saniye sonra tekrar başlat
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return (
    <div className="relative w-full h-[400px] md:h-[300px] lg:h-[300px] overflow-hidden rounded-xl group">
      {/* Ana Slider Container */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {heroImages.map((image, index) => (
          <div key={index} className="relative w-full h-full flex-shrink-0">
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

            {/* Text Overlay */}
            {image.title && (
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-xl md:text-2xl font-bold mb-2">{image.title}</h3>
                {image.description && <p className="text-sm md:text-base opacity-90">{image.description}</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sol Ok */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        onClick={goToPrevious}
        aria-label="Önceki fotoğraf"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Sağ Ok */}
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        onClick={goToNext}
        aria-label="Sonraki fotoğraf"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {heroImages.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white scale-110" : "bg-white/50 hover:bg-white/75"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`${index + 1}. fotoğrafa git`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div
          className="h-full bg-white transition-all duration-100 ease-linear"
          style={{
            width: isAutoPlaying ? `${((currentIndex + 1) / heroImages.length) * 100}%` : "0%",
          }}
        />
      </div>

      {/* Pause/Play Indicator */}
      <div className="absolute top-4 right-4 z-10">
        <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? "bg-green-400" : "bg-yellow-400"} animate-pulse`} />
      </div>
    </div>
  )
}
