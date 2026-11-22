import { useState } from "react"
import { useTranslation } from "react-i18next"
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
  const { t } = useTranslation()
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

  const handleSubmit = async (event) => {
    event.preventDefault()
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
      setError(err.response?.data?.message || t("auth.profileError"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="kc-auth-fields">

      <div>
        <p>{t("auth.farmDetails")}</p>
      </div>

      {/* State */}
      <div>
        <label htmlFor="farm-state" className="block text-sm font-semibold text-gray-700 mb-2">
          {t("schemes.state")}
        </label>
        <select
          id="farm-state"
          name="state"
          value={form.state}
          onChange={handleChange}
        >
          <option value="">{t("auth.selectState")}</option>
          {indianStates.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      {/* Land Size */}
      <div>
        <label htmlFor="farm-land" className="block text-sm font-semibold text-gray-700 mb-2">
          {t("auth.landSize")}
        </label>
        <input
          type="number"
          id="farm-land"
          name="landSizeAcres"
          value={form.landSizeAcres}
          placeholder="e.g., 5.5"
          step="0.1"
          min="0"
          onChange={handleChange}
        />
      </div>

      {/* Crops multi-select */}
      <fieldset>
        <legend className="block text-sm font-semibold text-gray-700 mb-2">{t("auth.crops")}</legend>
        <div className="kc-crop-options">
          {cropsEnum.map((crop) => (
            <button
              key={crop}
              aria-pressed={form.crops.includes(crop)}
              type="button"
              onClick={() => toggleCrop(crop)}
              className="kc-button kc-button-outline"
            >
              {crop}
            </button>
          ))}
        </div>
      </fieldset>

      {error && <p className="text-red-700 text-sm" role="alert">{error}</p>}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="kc-button w-full"
      >
        {t(loading ? "auth.saving" : "auth.saveProfile")}
      </button>
    </form>
  )
}
