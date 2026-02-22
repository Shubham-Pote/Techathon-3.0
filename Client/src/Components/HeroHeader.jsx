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
    <section className="relative w-full h-[280px] sm:h-[340px] text-white overflow-hidden">

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

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      <div className="relative z-10 max-w-3xl mx-auto h-full flex flex-col items-center justify-center px-4 sm:px-6 text-center">

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-2">
          {t('hero.title1')}
          <br />
          <span className="text-emerald-400">{t('hero.title2')}</span>
        </h2>

        <p className="text-white/70 text-xs sm:text-sm mb-4 sm:mb-6 max-w-md px-2">
          {t('hero.subtitle')}
        </p>

        <div className="w-full max-w-xl px-2">
          <div className="flex bg-white rounded-lg overflow-hidden shadow-lg shadow-black/20">
            <div className="flex items-center pl-3 sm:pl-4 text-slate-400">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={t('hero.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-2 sm:px-4 py-3 sm:py-3.5 text-slate-800 text-sm outline-none bg-transparent placeholder-slate-400"
            />
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 sm:px-8 text-sm font-semibold transition">
              <span className="hidden sm:inline">{t('hero.searchBtn')}</span>
              <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Carousel dots */}
        <div className="flex gap-1.5 mt-5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-6 bg-emerald-400" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
