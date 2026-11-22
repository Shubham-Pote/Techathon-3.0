import { useState, useEffect, useMemo } from "react"
import { FiBookmark, FiChevronDown, FiInbox, FiSliders } from "react-icons/fi"
import SchemeCard from "./SchemeCard"
import { getAllSchemes } from "../services/schemeService"
import { useAuth } from "../context/AuthContext"
import { useBookmarks } from "../context/BookmarkContext"
import { isEligible } from "../utils/eligibility"
import { useTranslation } from "react-i18next"

export default function SchemePage({ search = "", category }) {
  const { t } = useTranslation()

  const [schemes, setSchemes] = useState([])

  const [stateFilter, setStateFilter] = useState([])
  const [categoryFilter, setCategoryFilter] = useState(category ? [category] : [])
  const [cropFilter, setCropFilter] = useState([])
  const [eligibilityFilter, setEligibilityFilter] = useState("all")
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const [sortOrder, setSortOrder] = useState("")
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [request, setRequest] = useState(0)

  const schemesPerPage = 10

  const { user } = useAuth()
  const { bookmarks } = useBookmarks()
  const farmerProfile = user?.profile
  const savedOnly = Boolean(user && showBookmarks)

  useEffect(() => {
    let cancelled = false

    getAllSchemes()
      .then((response) => {
        if (!response?.success || !Array.isArray(response.data)) throw new Error("Invalid scheme response")
        if (!cancelled) setSchemes(response.data)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [request])

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
        (!savedOnly || bookmarks.includes(s?.scheme_id)) &&
        (stateFilter.length === 0 || stateFilter.includes(s?.state)) &&
        (categoryFilter.length === 0 || categoryFilter.includes(s?.category)) &&
        (cropFilter.length === 0 || schemeCrops.length === 0 || cropFilter.some((c) => schemeCrops.includes(c))) &&
        (!farmerProfile || eligibilityFilter === "all" ||
          (eligibilityFilter === "eligible" && eligible) ||
          (eligibilityFilter === "notEligible" && !eligible))
      )
    })

    if (sortOrder === "asc") result.sort((a, b) => (a?.scheme_name || "").localeCompare(b?.scheme_name || ""))
    if (sortOrder === "desc") result.sort((a, b) => (b?.scheme_name || "").localeCompare(a?.scheme_name || ""))

    return result
  }, [schemes, search, stateFilter, categoryFilter, cropFilter, eligibilityFilter, sortOrder, farmerProfile, savedOnly, bookmarks])

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filtered.length / schemesPerPage)
  const currentPage = pagination?.results === filtered ? pagination.page : 1
  const setCurrentPage = (page) => {
    setPagination({ results: filtered, page })
    document.getElementById("scheme-results").focus()
  }
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

  return (
    <div className="kc-shell kc-directory">
      <button
        className="kc-button kc-button-outline kc-filter-toggle"
        type="button"
        aria-controls="scheme-filters"
        aria-expanded={filtersOpen}
        onClick={() => setFiltersOpen(!filtersOpen)}
      >
        <FiSliders aria-hidden="true" /> {t("schemes.filters")}
        {activeFilterCount > 0 && <span className="kc-filter-count">{activeFilterCount}</span>}
        <FiChevronDown aria-hidden="true" />
      </button>
      <aside id="scheme-filters" className="kc-filters" data-open={filtersOpen} aria-labelledby="filters-heading">
        <div className="kc-filter-heading">
          <h2 id="filters-heading"><FiSliders aria-hidden="true" /> {t("schemes.filters")}</h2>
          <p>{t("schemes.filtersDesc")}</p>
        </div>
        <div className="kc-filter-options">
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
          <button
            className="kc-text-link kc-reset"
            onClick={() => {
              setStateFilter([])
              setCategoryFilter([])
              setCropFilter([])
              setEligibilityFilter("all")
            }}
          >
            {t("schemes.clearFilters")} ({activeFilterCount})
          </button>
        )}
      </aside>

      <section className="kc-results" aria-labelledby="scheme-results">
        <div className="kc-results-bar">
          <div>
            <h2 id="scheme-results" tabIndex={-1}>{t("schemes.results")}</h2>
            {!loading && !failed && (
              <p role="status">{t("schemes.showing", { n: paginatedSchemes.length, total: filtered.length })}</p>
            )}
          </div>
          <div className="kc-results-actions">
            {user && (
              <button
                className="kc-button kc-button-outline kc-bookmark-filter"
                onClick={() => setShowBookmarks((value) => !value)}
                aria-label={t("schemes.bookmarks")}
                aria-pressed={savedOnly}
              >
                <FiBookmark aria-hidden="true" fill={savedOnly ? "currentColor" : "none"} />
                {t("schemes.bookmarks")} {bookmarks.length > 0 && bookmarks.length}
              </button>
            )}
            <select
              aria-label={t("schemes.sortDefault")}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="kc-sort"
            >
              <option value="">{t('schemes.sortDefault')}</option>
              <option value="asc">{t('schemes.sortAZ')}</option>
              <option value="desc">{t('schemes.sortZA')}</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="kc-empty" role="status">
            <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            <p className="text-slate-500 text-sm">{t('schemes.loading')}</p>
          </div>
        ) : failed ? (
          <div className="kc-empty" role="alert">
            <p>{t("schemes.loadError")}</p>
            <button className="kc-button" onClick={() => {
              setLoading(true)
              setFailed(false)
              setRequest((value) => value + 1)
            }}>{t("schemes.retry")}</button>
          </div>
        ) : (
          <>
            <div className="kc-cards">
              {paginatedSchemes.map((s) => (
                <SchemeCard
                  key={s?.scheme_id}
                  scheme={s}
                />
              ))}

              {filtered.length === 0 && (
                <div className="kc-empty">
                  <FiInbox aria-hidden="true" />
                  <strong>{t(savedOnly && bookmarks.length === 0 ? "schemes.noSaved" : "schemes.noResults")}</strong>
                  {!savedOnly && <p>{t("schemes.noResultsHint")}</p>}
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
      </section>
    </div>
  )
}

/* ================= REUSABLE COMPONENTS ================= */

function FilterSection({ title, count, children }) {
  return (
    <details className="kc-filter">
      <summary>
        <span>{title} {count > 0 && <span className="kc-filter-count">{count}</span>}</span>
        <FiChevronDown aria-hidden="true" />
      </summary>
      <div>{children}</div>
    </details>
  )
}

function CheckboxItem({ label, checked, onChange }) {
  return (
    <label className={`flex items-center gap-3 text-sm cursor-pointer py-2 px-3 rounded-lg transition-all duration-200 ${
      checked ? "bg-emerald-50 text-slate-800" : "hover:bg-slate-50 text-slate-600"
    }`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
      />
      <span className={checked ? "font-medium" : ""}>{label}</span>
    </label>
  )
}

function RadioItem({ label, value, selected, onChange }) {
  const isSelected = selected === value
  return (
    <label className={`flex items-center gap-3 text-sm cursor-pointer py-2 px-3 rounded-lg transition-all duration-200 ${
      isSelected ? "bg-emerald-50 text-slate-800" : "hover:bg-slate-50 text-slate-600"
    }`}>
      <input
        type="radio"
        name="eligibility"
        checked={isSelected}
        onChange={() => onChange(value)}
        className="w-4 h-4 accent-emerald-600 cursor-pointer"
      />
      <span className={isSelected ? "font-medium" : ""}>{label}</span>
    </label>
  )
}

function Pagination({ currentPage, totalPages, setCurrentPage }) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-8">

      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
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
              aria-current={currentPage === page ? "page" : undefined}
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
        onClick={() => setCurrentPage(currentPage + 1)}
        className="px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium text-slate-700"
      >
        {t('schemes.next')}
      </button>

    </div>
  )
}
