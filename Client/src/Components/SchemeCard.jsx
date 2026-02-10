import { useLang } from "../context/LanguageContext"

export default function SchemeCard({ scheme }) {
  const { t } = useLang()

  return (
    <div
      className="
        rounded-2xl
        p-6
        
        shadow-md
        hover:shadow-xl
        hover:-translate-y-1
        transition
        border border-slate-300
      "
    >
      {/* Top icon + title */}
      <div className="flex items-start gap-4">

        <div className="w-12 h-12 bg-white rounded-xl shadow flex items-center justify-center text-xl">
          📄
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-800 leading-snug">
            {scheme.title}
          </h3>

          <p className="text-slate-600 text-sm mt-1">
            {scheme.desc}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-300 my-4" />

      {/* Info row */}
      {scheme.deadline && (
        <p className="text-md text-slate-600 mb-3">
          Deadline: {scheme.deadline}
        </p>
      )}

      {/* Apply Button */}
      <a
        href={scheme.url}
        target="_blank"
        rel="noopener noreferrer"
        className="
          block
          w-full
          text-center
          py-3
          rounded-xl
          font-semibold
          bg-blue-700
          text-white
          hover:bg-blue-800
          active:scale-95
          transition
        "
      >
        {t.apply}
      </a>
    </div>
  )
}
