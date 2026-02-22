import { useState } from "react"
import api from "../../utils/api"

const cropsEnum = [
  "COTTON",
  "PADDY",
  "WHEAT",
  "SUGARCANE",
  "SOYBEAN",
  "MAIZE",
  "OTHER",
]

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
]

export default function DetailsStep({ onFinish }) {
  const [form, setForm] = useState({
    state: "",
    landSizeAcres: "",
    crops: [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: value,
    })
  }

  const toggleCrop = (crop) => {
    setForm((prev) => ({
      ...prev,
      crops: prev.crops.includes(crop)
        ? prev.crops.filter((c) => c !== crop)
        : [...prev.crops, crop],
    }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError("")

      const payload = {
        state: form.state || null,
        landSizeAcres: form.landSizeAcres ? Number(form.landSizeAcres) : null,
        crops: form.crops,
      }

      // Persist profile to server (token auto-attached by api interceptor)
      const res = await api.put("/farmers/me", payload)

      // Pass back the saved farmer record from the server
      onFinish(res.data.farmer ?? payload)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-h-[480px] overflow-y-auto pr-2 space-y-4">

      <div>
        <p className="text-gray-700 text-sm font-medium mb-4">
          Complete your farm details to find eligible schemes
        </p>
      </div>

      {/* State */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          State <span className="text-red-500">*</span>
        </label>
        <select
          name="state"
          value={form.state}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
        >
          <option value="">Select your state</option>
          {indianStates.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      {/* Land Size */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Land Size (in acres)
        </label>
        <input
          type="number"
          name="landSizeAcres"
          value={form.landSizeAcres}
          placeholder="e.g., 5.5"
          step="0.1"
          min="0"
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
        />
      </div>

      {/* Crops multi-select */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Crops You Grow
        </label>
        <div className="grid grid-cols-2 gap-2">
          {cropsEnum.map((crop) => (
            <button
              key={crop}
              type="button"
              onClick={() => toggleCrop(crop)}
              className={`px-3 py-2 rounded-md border text-xs font-medium transition-all
                ${
                  form.crops.includes(crop)
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "bg-white border-gray-300 text-gray-700 hover:border-emerald-400"
                }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-gradient-to-r from-emerald-700 to-green-700 text-white py-4 rounded-xl font-bold text-base hover:from-emerald-800 hover:to-green-800 shadow-lg hover:shadow-xl transition-all disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save & Continue"}
      </button>
    </div>
  )
}
