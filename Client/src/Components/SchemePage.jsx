import { useState, useEffect, useMemo } from "react"
import SchemeCard from "./SchemeCard"
import { getAllSchemes } from "../services/schemeService"
import { useAuth } from "../context/AuthContext"
import { useBookmarks } from "../context/BookmarkContext"
import { isEligible } from "../utils/eligibility"
import { useTranslation } from "react-i18next"

export default function SchemePage({ search = "" }) {
  const { t } = useTranslation()

  const [schemes, setSchemes] = useState([])

  const [stateFilter, setStateFilter] = useState([])
  const [categoryFilter, setCategoryFilter] = useState([])
  const [cropFilter, setCropFilter] = useState([])
  const [eligibilityFilter, setEligibilityFilter] = useState("all")
  const [showBookmarks, setShowBookmarks] = useState(false)

  const [sortOrder, setSortOrder] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const schemesPerPage = 10

  const { user } = useAuth()
  const { bookmarks } = useBookmarks()
  const farmerProfile = user?.profile

  /* ================= FETCH ALL SCHEMES ONCE ================= */
  useEffect(() => {
    async function fetchSchemes() {
      try {
        const res = await getAllSchemes()
        if (res?.success && Array.isArray(res.data)) {
          setSchemes(res.data)
        } else {
          setSchemes([])
        }
      } catch (err) {
        console.error("Scheme fetch error:", err)
        setSchemes([])
      }
      setLoading(false)
    }
    fetchSchemes()
  }, [])

  /* ================= RESET PAGE on filter/search change ================= */
  useEffect(() => {
    setCurrentPage(1)
  }, [stateFilter, categoryFilter, cropFilter, eligibilityFilter, sortOrder, search, showBookmarks])

  /* ================= UNIQUE VALUES FOR FILTERS ================= */
  const states = [...new Set(schemes.map((s) => s?.state).filter(Boolean))]
  const categories = [...new Set(schemes.map((s) => s?.category).filter(Boolean))]
  const crops = [...new Set(schemes.flatMap((s) => s?.supported_crops || []))]

  /* ================= FILTER + SORT ================= */
  const filtered = useMemo(() => {
    const searchTerm = search?.toLowerCase().trim() || ""

    let result = schemes.filter((s) => {
      const eligible = farmerProfile ? isEligible(s, farmerProfile) : true
      const schemeCrops = s?.supported_crops || []

      const matchesSearch = !searchTerm || [
        s?.scheme_name || "",
        s?.state || "",
        s?.category || "",
        s?.details?.description || "",
        s?.details?.financial_assistance_summary || "",
        ...(schemeCrops),
      ].some((field) => field.toLowerCase().includes(searchTerm))

      return (
        matchesSearch &&
        (!showBookmarks || bookmarks.includes(s?.scheme_id)) &&
        (stateFilter.length === 0 || stateFilter.includes(s?.state)) &&
        (categoryFilter.length === 0 || categoryFilter.includes(s?.category)) &&
        (cropFilter.length === 0 || schemeCrops.length === 0 || cropFilter.some((c) => schemeCrops.includes(c))) &&
        (eligibilityFilter === "all" ||
          (eligibilityFilter === "eligible" && eligible) ||
          (eligibilityFilter === "notEligible" && !eligible))
      )
    })

    if (sortOrder === "asc") result.sort((a, b) => (a?.scheme_name || "").localeCompare(b?.scheme_name || ""))
    if (sortOrder === "desc") result.sort((a, b) => (b?.scheme_name || "").localeCompare(a?.scheme_name || ""))

    return result
  }, [schemes, search, stateFilter, categoryFilter, cropFilter, eligibilityFilter, sortOrder, farmerProfile, showBookmarks, bookmarks])

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filtered.length / schemesPerPage)
  const paginatedSchemes = filtered.slice(
    (currentPage - 1) * schemesPerPage,
    currentPage * schemesPerPage
  )

  /* ================= ACTIVE FILTER COUNT ================= */
  const activeFilterCount =
    stateFilter.length +
    categoryFilter.length +
    cropFilter.length +
    (eligibilityFilter !== "all" ? 1 : 0)

  /* ================= UI ================= */
  return (
    <div className="flex bg-slate-50 min-h-screen">

      {/* ================= SIDEBAR ================= */}
       <aside className="hidden md:block w-80 shrink-0 sticky top-20 h-[calc(100vh-5rem)]">
        <div className="h-full rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg text-slate-800">
                {t('schemes.filters')}
              </h2>

              {activeFilterCount > 0 && (
                <span className="text-[11px] bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full font-semibold">
                  {activeFilterCount} {t('schemes.active')}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {t('schemes.filtersDesc')}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
            {/* STATE */}
            <FilterSection title={t('schemes.state')} count={stateFilter.length}>
              {states.map((s) => (
                <CheckboxItem
                  key={s}
                  label={s}
                  checked={stateFilter.includes(s)}
                  onChange={() =>
                    setStateFilter((prev) =>
                      prev.includes(s)
                        ? prev.filter((x) => x !== s)
                        : [...prev, s]
                    )
                  }
                />
              ))}
            </FilterSection>

            {/* CATEGORY */}
            <FilterSection title={t('schemes.supportType')} count={categoryFilter.length}>
              {categories.map((c) => (
                <CheckboxItem
                  key={c}
                  label={c}
                  checked={categoryFilter.includes(c)}
                  onChange={() =>
                    setCategoryFilter((prev) =>
                      prev.includes(c)
                        ? prev.filter((x) => x !== c)
                        : [...prev, c]
                    )
                  }
                />
              ))}
            </FilterSection>

            {/* CROPS */}
            <FilterSection title={t('schemes.crop')} count={cropFilter.length}>
              {crops.map((c) => (
                <CheckboxItem
                  key={c}
                  label={c}
                  checked={cropFilter.includes(c)}
                  onChange={() =>
                    setCropFilter((prev) =>
                      prev.includes(c)
                        ? prev.filter((x) => x !== c)
                        : [...prev, c]
                    )
                  }
                />
              ))}
            </FilterSection>

            {/* ELIGIBILITY */}
            {farmerProfile && (
              <FilterSection title={t('schemes.eligibility')}>
                <RadioItem
                  label={t('schemes.allSchemes')}
                  value="all"
                  selected={eligibilityFilter}
                  onChange={setEligibilityFilter}
                />
                <RadioItem
                  label={t('schemes.eligibleOnly')}
                  value="eligible"
                  selected={eligibilityFilter}
                  onChange={setEligibilityFilter}
                />
                <RadioItem
                  label={t('schemes.notEligible')}
                  value="notEligible"
                  selected={eligibilityFilter}
                  onChange={setEligibilityFilter}
                />
              </FilterSection>
            )}
          </div>

          {activeFilterCount > 0 && (
            <div className="px-6 py-4 border-t border-slate-100">
              <button
                onClick={() => {
                  setStateFilter([])
                  setCategoryFilter([])
                  setCropFilter([])
                  setEligibilityFilter("all")
                }}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition"
              >
                {t('schemes.clearFilters')}
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ================= CONTENT ================= */}
      <main className="flex-1 px-3 sm:px-6 py-4 sm:py-6 lg:px-8">

        {/* Stats bar */}
       

        {/* Title + Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-5">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-800">
              {t('schemes.heading')}
            </h1>
            {!loading && (
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                🌾 More than 100 schemes available
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Bookmarks toggle */}
            {user && (
              <button
                onClick={() => setShowBookmarks((v) => !v)}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-xl border font-semibold transition-all ${
                  showBookmarks
                    ? "bg-amber-50 border-amber-300 text-amber-700"
                    : "bg-white border-slate-200 text-slate-600 hover:border-amber-300 hover:text-amber-600"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={showBookmarks ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
                {bookmarks.length > 0 && (
                  <span className="text-xs bg-amber-200/60 text-amber-800 px-1.5 py-0.5 rounded-full leading-none">{bookmarks.length}</span>
                )}
              </button>
            )}

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 outline-none"
            >
              <option value="">{t('schemes.sortDefault')}</option>
              <option value="asc">{t('schemes.sortAZ')}</option>
              <option value="desc">{t('schemes.sortZA')}</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            <p className="text-slate-500 text-sm">{t('schemes.loading')}</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {paginatedSchemes.map((s) => (
                <SchemeCard
                  key={s?.scheme_id}
                  scheme={s}
                />
              ))}

              {filtered.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-slate-600 font-medium">{t('schemes.noResults')}</p>
                  <p className="text-sm text-slate-400 mt-1">{t('schemes.noResultsHint')}</p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}

/* ================= REUSABLE COMPONENTS ================= */

function FilterSection({ title, count, children }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-slate-100 pb-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full py-2 text-left"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            {title}
          </h3>
          {count > 0 && (
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold">
              {count}
            </span>
          )}
        </div>
        <span className={`text-slate-400 text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>
      {open && (
        <div className="space-y-0.5 pb-1">
          {children}
        </div>
      )}
    </div>
  )
}

function CheckboxItem({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 text-sm cursor-pointer py-1 px-2 rounded-lg hover:bg-slate-50 transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 accent-emerald-600 rounded"
      />
      <span className={checked ? "text-slate-800 font-medium" : "text-slate-600"}>{label}</span>
    </label>
  )
}

function RadioItem({ label, value, selected, onChange }) {
  return (
    <label className="flex items-center gap-2.5 text-sm cursor-pointer py-1 px-2 rounded-lg hover:bg-slate-50 transition-colors">
      <input
        type="radio"
        checked={selected === value}
        onChange={() => onChange(value)}
        className="w-4 h-4 accent-emerald-600"
      />
      <span className={selected === value ? "text-slate-800 font-medium" : "text-slate-600"}>{label}</span>
    </label>
  )
}

function Pagination({ currentPage, totalPages, setCurrentPage }) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center justify-center gap-2 mt-8">

      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((p) => p - 1)}
        className="px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium text-slate-700"
      >
        {t('schemes.prev')}
      </button>

      <div className="flex items-center gap-1 mx-2">
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          let page
          if (totalPages <= 5) {
            page = i + 1
          } else if (currentPage <= 3) {
            page = i + 1
          } else if (currentPage >= totalPages - 2) {
            page = totalPages - 4 + i
          } else {
            page = currentPage - 2 + i
          }
          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-9 h-9 text-sm rounded-lg font-medium transition ${
                currentPage === page
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {page}
            </button>
          )
        })}
      </div>

      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((p) => p + 1)}
        className="px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium text-slate-700"
      >
        {t('schemes.next')}
      </button>

    </div>
  )
}