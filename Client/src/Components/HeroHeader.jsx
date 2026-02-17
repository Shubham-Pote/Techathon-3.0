import { useEffect, useState } from "react"

/* keep imports if they work */
import hero1 from "../assets/features/hero.jpeg"
import hero2 from "../assets/features/hero1.jpeg"
import hero3 from "../assets/features/hero5.png"
import hero4 from "../assets/features/hero1.jpeg"
import hero5 from "../assets/features/hero7.webp"

export default function HeroHeader({ search, setSearch }) {

  const images = [hero1, hero2, hero3, hero4, hero5]

  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [images.length]) // 👈 important

  return (
    <section className="relative w-full h-[310px] text-white overflow-hidden">

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

      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-center pl-24">

        <div className="max-w-xl">
          <h2 className="text-3xl font-bold leading-tight mb-6 text-center ml-20">
            Find the Right Government Scheme
            
            for Your Farm
          </h2>
        </div>

        <div className="mt-4 max-w-xl ml-20">
          <div className="flex bg-white rounded-xl shadow-xl overflow-hidden">
            <input
              type="text"
              placeholder="Search schemes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-6 py-4 text-black outline-none"
            />

            <button className="bg-green-700 hover:bg-green-800 text-white px-10 font-semibold transition">
              Search
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
