import { useState } from "react"

const cropsEnum = [
  "COTTON",
  "PADDY",
  "WHEAT",
  "SUGARCANE",
  "SOYBEAN",
  "MAIZE",
  "OTHER",
]

export default function DetailsStep({ onFinish }) {
  const [form, setForm] = useState({
    name: "",
    state: "",
    land_acres: "",
    crops: [],
    land_owner: false,
    has_aadhaar: false,
    has_bank_account: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
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

  const handleSubmit = () => {
    onFinish({
      ...form,
      land_acres: Number(form.land_acres),
    })
  }

  return (
    <div className="space-y-6">

      <p className="text-gray-700 text-sm">
        Complete your farming details to check scheme eligibility
      </p>

      {/* Name */}
      <input
        name="name"
        placeholder="Full Name"
        onChange={handleChange}
        className="w-full border border-gray-200 rounded-xl px-4 py-3"
      />

      {/* State */}
      <input
        name="state"
        placeholder="State"
        onChange={handleChange}
        className="w-full border border-gray-200 rounded-xl px-4 py-3"
      />

      {/* Land */}
      <input
        type="number"
        name="land_acres"
        placeholder="Land Size (acres)"
        onChange={handleChange}
        className="w-full border border-gray-200 rounded-xl px-4 py-3"
      />

      {/* Crops multi-select */}
      <div>
        <p className="text-sm mb-2">Crops Grown</p>

        <div className="flex flex-wrap gap-2">
          {cropsEnum.map((crop) => (
            <button
              key={crop}
              type="button"
              onClick={() => toggleCrop(crop)}
              className={`px-3 py-1 rounded-full border text-sm transition
                ${
                  form.crops.includes(crop)
                    ? "bg-emerald-600 text-white"
                    : "bg-white"
                }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-2 text-sm">

        <label className="flex gap-2">
          <input
            type="checkbox"
            name="land_owner"
            onChange={handleChange}
          />
          I am the land owner
        </label>

        <label className="flex gap-2">
          <input
            type="checkbox"
            name="has_aadhaar"
            onChange={handleChange}
          />
          I have Aadhaar card
        </label>

        <label className="flex gap-2">
          <input
            type="checkbox"
            name="has_bank_account"
            onChange={handleChange}
          />
          I have bank account
        </label>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="w-full bg-gradient-to-r from-emerald-700 to-green-700 text-white py-4 rounded-2xl font-semibold"
      >
        Save & Continue
      </button>
    </div>
  )
}
