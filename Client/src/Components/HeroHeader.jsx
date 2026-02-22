import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import hero1 from "../assets/features/hero.jpeg"
import hero2 from "../assets/features/hero1.jpeg"
import hero3 from "../assets/features/hero5.png"
import hero4 from "../assets/features/hero1.jpeg"
import hero5 from "../assets/features/hero7.webp"

export default function HeroHeader({ search, setSearch }) {
  const { t } = useTranslation()

  const images = [hero1, hero2, hero3, hero4, hero5]
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [images.length])

  return (
    <section className="relative w-full h-[300px] sm:h-[360px] text-white overflow-hidden -mt-16">

      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt=""
          className={`
            absolute inset-0 w-full h-full object-cover
            transition-opacity duration-1000 ease-in-out
            ${index === current ? "opacity-100 z-0" : "opacity-0 -z-10"}
          `}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/65" />

      {/* Top border line */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent z-20" />

      {/* Bottom border line */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent z-20" />

      <div className="relative z-10 max-w-3xl mx-auto h-full flex flex-col items-center justify-end px-4 sm:px-6 text-center pb-10 sm:pb-12">

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-1.5">
          {t('hero.title1')}
          <br />
          <span className="text-emerald-400">{t('hero.title2')}</span>
        </h2>

        <p className="text-white/60 text-xs sm:text-sm mb-5 max-w-md px-2">
          {t('hero.subtitle')}
        </p>

        <div className="w-full max-w-xl px-2">
          <div className="flex items-center bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl shadow-black/20 ring-1 ring-white/30 hover:ring-emerald-400/50 transition-all duration-300">
            <div className="flex items-center pl-5 text-emerald-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={t('hero.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3.5 sm:py-4 text-gray-800 text-sm outline-none bg-transparent placeholder-gray-400 font-medium"
            />
            <button className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white px-6 sm:px-8 py-3.5 sm:py-4 text-sm font-semibold transition-all duration-200 shadow-lg shadow-emerald-500/25">
              {t('hero.searchBtn')}
            </button>
          </div>
        </div>

        {/* Carousel dots */}
        <div className="flex gap-2 mt-5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-6 h-2 bg-emerald-400" : "w-2 h-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
