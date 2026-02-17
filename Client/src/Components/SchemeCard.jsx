import { useNavigate } from "react-router-dom"
import { useLang } from "../context/LanguageContext"
import { useAuth } from "../context/AuthContext"
import { isEligible } from "../utils/eligibility"

const categoryColors = {
  SUBSIDY: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  INSURANCE: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  WELFARE: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
}

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

  const cat = categoryColors[scheme?.category] || categoryColors.SUBSIDY
  const crops = scheme?.supported_crops || []
  const financialSummary = scheme?.details?.financial_assistance_summary || ""
  const mode = scheme?.application_process?.mode || ""

  return (
    <div
      onClick={handleCardClick}
      className="
        relative cursor-pointer bg-white rounded-2xl
        border border-slate-200
        shadow-sm hover:shadow-lg hover:border-slate-300
        transition-all duration-200
        overflow-hidden group
      "
    >
      {/* Top accent bar */}
      <div className={`h-1 w-full ${scheme?.category === "INSURANCE" ? "bg-blue-500" : scheme?.category === "WELFARE" ? "bg-amber-500" : "bg-emerald-500"}`} />

      <div className="p-5 flex gap-5">

        {/* LEFT: Category indicator */}
        <div className={`w-1.5 self-stretch rounded-full shrink-0 ${scheme?.category === "INSURANCE" ? "bg-blue-500" : scheme?.category === "WELFARE" ? "bg-amber-500" : "bg-emerald-500"}`} />

        {/* MIDDLE: Content */}
        <div className="flex-1 min-w-0">

          {/* Title row */}
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3 className="text-base font-semibold text-slate-800 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
              {scheme?.scheme_name || "Unnamed Scheme"}
            </h3>

            {/* Eligibility badge */}
            {farmerProfile && (
              <span
                className={`
                  shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap
                  ${eligible
                    ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
                    : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
                  }
                `}
              >
                {eligible ? "✓ Eligible" : "Not Eligible"}
              </span>
            )}
          </div>

          {/* State + Category */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <span>{scheme?.state || "All India"}</span>
            <span className="text-slate-300">•</span>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${cat.bg} ${cat.text}`}>
              {scheme?.category}
            </span>
            {mode && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-400">{mode}</span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 line-clamp-2 mb-3 leading-relaxed">
            {scheme?.details?.description || "No description available"}
          </p>

          {/* Financial summary highlight */}
          {financialSummary && (
            <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 mb-3">
              <p className="text-xs text-slate-500 font-medium mb-0.5">Financial Assistance</p>
              <p className="text-sm text-slate-700 font-medium line-clamp-1">
                {financialSummary}
              </p>
            </div>
          )}

          {/* Tags row */}
          <div className="flex flex-wrap items-center gap-1.5">
            {crops.slice(0, 4).map((crop, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-[11px] font-medium bg-green-50 text-green-700 rounded-md border border-green-100 uppercase tracking-wide"
              >
                {crop}
              </span>
            ))}
            {crops.length > 4 && (
              <span className="text-[11px] text-slate-400 font-medium">
                +{crops.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* RIGHT: Apply button */}
        <div className="flex flex-col items-end justify-between shrink-0">
          {scheme?.min_land_acres && (
            <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap mb-2">
              Min {scheme.min_land_acres} acre
            </span>
          )}

          <a
            href={scheme?.application_process?.portal_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="
              px-5 py-2.5 rounded-xl
              bg-emerald-600 text-white
              text-sm font-semibold
              hover:bg-emerald-700 active:scale-95
              transition-all whitespace-nowrap
              shadow-sm hover:shadow-md
            "
          >
            Apply Now
          </a>
        </div>
      </div>
    </div>
  )
}
