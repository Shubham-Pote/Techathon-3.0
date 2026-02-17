import { useState, useEffect, useMemo } from "react"
import SchemeCard from "./SchemeCard"
import { getAllSchemes } from "../services/schemeService"
import { useAuth } from "../context/AuthContext"
import { isEligible } from "../utils/eligibility"

export default function SchemePage({ search = "" }) {
  const [schemes, setSchemes] = useState([])

  const [stateFilter, setStateFilter] = useState([])
  const [categoryFilter, setCategoryFilter] = useState([])
  const [cropFilter, setCropFilter] = useState([])
  const [eligibilityFilter, setEligibilityFilter] = useState("all")

  const [sortOrder, setSortOrder] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const schemesPerPage = 10

  const { user } = useAuth()
  const farmerProfile = user?.profile

  /* ================= FETCH SCHEMES ================= */
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

  /* ================= RESET PAGE ================= */
  useEffect(() => {
    setCurrentPage(1)
  }, [
    stateFilter,
    categoryFilter,
    cropFilter,
    eligibilityFilter,
    sortOrder,
    search,
  ])

  /* ================= UNIQUE VALUES ================= */
  const states = [
    ...new Set(schemes.map((s) => s?.state).filter(Boolean)),
  ]

  const categories = [
    ...new Set(schemes.map((s) => s?.category).filter(Boolean)),
  ]

  const crops = [
    ...new Set(
      schemes.flatMap((s) => s?.supported_crops || [])
    ),
  ]

  /* ================= FILTER + SORT ================= */
  const filtered = useMemo(() => {
    const searchTerm = search?.toLowerCase() || ""

    let result = schemes.filter((s) => {
      const eligible = farmerProfile
        ? isEligible(s, farmerProfile)
        : true

      const schemeName = (s?.scheme_name || "").toLowerCase()
      const schemeCrops = s?.supported_crops || []

      return (
        schemeName.includes(searchTerm) &&
        (stateFilter.length === 0 ||
          stateFilter.includes(s?.state)) &&
        (categoryFilter.length === 0 ||
          categoryFilter.includes(s?.category)) &&
        (cropFilter.length === 0 ||
          schemeCrops.length === 0 ||
          cropFilter.some((c) => schemeCrops.includes(c))) &&
        (eligibilityFilter === "all" ||
          (eligibilityFilter === "eligible" && eligible) ||
          (eligibilityFilter === "notEligible" && !eligible))
      )
    })

    if (sortOrder === "asc") {
      result.sort((a, b) =>
        (a?.scheme_name || "").localeCompare(
          b?.scheme_name || ""
        )
      )
    }

    if (sortOrder === "desc") {
      result.sort((a, b) =>
        (b?.scheme_name || "").localeCompare(
          a?.scheme_name || ""
        )
      )
    }

    return result
  }, [
    schemes,
    search,
    stateFilter,
    categoryFilter,
    cropFilter,
    eligibilityFilter,
    sortOrder,
    farmerProfile,
  ])

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
      <aside className="hidden md:block w-72 shrink-0 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto bg-white border-r border-slate-200 p-6 rounded-2xl shadow-sm">

        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold text-lg text-slate-800">
            Filters
          </h2>

          {activeFilterCount > 0 && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              {activeFilterCount} active
            </span>
          )}
        </div>

        <div className="space-y-6">

          {/* STATE */}
          <FilterSection title="State">
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
          <FilterSection title="Support Type">
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
          <FilterSection title="Crop">
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
            <FilterSection title="Eligibility">
              <RadioItem
                label="All Schemes"
                value="all"
                selected={eligibilityFilter}
                onChange={setEligibilityFilter}
              />
              <RadioItem
                label="Eligible Only"
                value="eligible"
                selected={eligibilityFilter}
                onChange={setEligibilityFilter}
              />
              <RadioItem
                label="Not Eligible"
                value="notEligible"
                selected={eligibilityFilter}
                onChange={setEligibilityFilter}
              />
            </FilterSection>
          )}

          {/* CLEAR */}
          <button
            onClick={() => {
              setStateFilter([])
              setCategoryFilter([])
              setCropFilter([])
              setEligibilityFilter("all")
            }}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
          >
            Clear Filters
          </button>

        </div>
      </aside>

      {/* ================= CONTENT ================= */}
      <main className="flex-1 p-8">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">
            Available Schemes
          </h1>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-2 border rounded-xl"
          >
            <option value="">Default</option>
            <option value="asc">A → Z</option>
            <option value="desc">Z → A</option>
          </select>
        </div>

        {loading ? (
          <p>Loading schemes...</p>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedSchemes.map((s) => (
                <SchemeCard
                  key={s?.scheme_id}
                  scheme={s}
                />
              ))}

              {filtered.length === 0 && (
                <p className="text-center text-slate-500 mt-10">
                  No schemes found
                </p>
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

function FilterSection({ title, children }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-600 mb-3">
        {title}
      </h3>
      <div className="space-y-2 max-h-44 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

function CheckboxItem({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="accent-green-600"
      />
      {label}
    </label>
  )
}

function RadioItem({ label, value, selected, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input
        type="radio"
        checked={selected === value}
        onChange={() => onChange(value)}
        className="accent-green-600"
      />
      {label}
    </label>
  )
}

function Pagination({ currentPage, totalPages, setCurrentPage }) {
  return (
    <div className="flex justify-center gap-4 mt-8">

      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((p) => p - 1)}
        className="px-4 py-2 border rounded-xl disabled:opacity-50"
      >
        Previous
      </button>

      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((p) => p + 1)}
        className="px-4 py-2 border rounded-xl disabled:opacity-50"
      >
        Next
      </button>

    </div>
  )
}
