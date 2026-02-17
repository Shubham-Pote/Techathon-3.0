import { useNavigate } from "react-router-dom"
import { useLang } from "../context/LanguageContext"
import { useAuth } from "../context/AuthContext"
import { isEligible } from "../utils/eligibility"

export default function SchemeCard({ scheme }) {
  const { t } = useLang()
  const navigate = useNavigate()
  const { user } = useAuth()

  const farmerProfile = user?.profile

  const eligible =
    farmerProfile && isEligible(scheme, farmerProfile)

  const handleCardClick = () => {
    if (!scheme?.scheme_id) return
    navigate(`/schemes/${scheme.scheme_id}`)
  }

  return (
    <div
      onClick={handleCardClick}
      className="
        relative
        cursor-pointer
        bg-white
        rounded-2xl
        border border-slate-200
        p-5
        shadow-sm
        hover:shadow-md
        transition
        flex
        justify-between
        gap-6
      "
    >

      {/* ELIGIBILITY BADGE */}
      {farmerProfile && (
        <div
          className={`
            absolute top-4 right-4
            px-3 py-1 rounded-full
            text-sm font-semibold
            shadow-sm
            ${
              eligible
                ? "bg-blue-600 text-white shadow-blue-200/60"
                : "bg-gray-300 text-gray-700"
            }
          `}
        >
          {eligible ? "Eligible" : "Not Eligible"}
        </div>
      )}

      {/* LEFT CONTENT */}
      <div className="flex gap-4 flex-1">

        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center text-xl shrink-0">
          🌾
        </div>

        <div className="flex-1">

          <h3 className="text-lg font-semibold text-slate-800">
            {scheme?.scheme_name || "Unnamed Scheme"}
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            {scheme?.state || "All India"}
          </p>

          <p className="text-sm text-slate-600 mt-2 line-clamp-2">
            {scheme?.details?.description || "No description available"}
          </p>

          <div className="flex flex-wrap gap-2 mt-3">

            {scheme?.category && (
              <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                {scheme.category}
              </span>
            )}

            {scheme?.supported_crops
              ?.slice(0, 2)
              ?.map((crop, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs bg-slate-100 text-slate-700 rounded-full"
                >
                  {crop}
                </span>
              ))}

          </div>
        </div>
      </div>

      {/* APPLY BUTTON */}
      <div className="flex items-center">
        <a
          href={scheme?.application_process?.portal_url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="
            px-6 py-2
            rounded-xl
            bg-green-600
            text-white
            font-medium
            hover:bg-green-700
            transition
            whitespace-nowrap
          "
        >
          {t?.apply || "Apply"}
        </a>
      </div>

    </div>
  )
}
