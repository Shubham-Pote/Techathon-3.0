const features = [
  {
    title: "Farmer Corner",
    desc: "Apply for Crop Insurance by yourself",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "Premium Calculator",
    desc: "Know your insurance premium",
    color: "from-green-500 to-green-700",
  },
  {
    title: "Application Status",
    desc: "Track your application status",
    color: "from-orange-400 to-orange-600",
  },
  {
    title: "Helpline",
    desc: "Report grievances & crop loss",
    color: "from-purple-500 to-purple-700",
  },
  {
    title: "Learning Portal",
    desc: "Smart farming learning",
    color: "from-lime-500 to-green-600",
  },
  {
    title: "Yield Estimation",
    desc: "Estimate crop yield",
    color: "from-blue-500 to-blue-700",
  },
]

export default function FeatureCards() {
  const loopData = [...features, ...features] // duplicate for loop

  return (
    <div className="bg-slate-200 py-6 overflow-hidden">

      <div
        className="
          flex flex-nowrap gap-5
          min-w-[200%]
          animate-marquee
        "
      >
        {loopData.map((f, i) => (
          <div
            key={i}
            className={`
              flex-shrink-0
              w-[260px]
              rounded-2xl
              p-6
              text-white
              bg-gradient-to-br ${f.color}
              shadow-lg
              transition-all
              duration-300
              hover:scale-110
              hover:shadow-2xl
              cursor-pointer
            `}
          >
            <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
            <p className="text-sm opacity-95">{f.desc}</p>
          </div>
        ))}
      </div>

    </div>
  )
}
