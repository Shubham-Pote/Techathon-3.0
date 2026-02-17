import { useState } from "react"
import api from "../../utils/api"

export default function PhoneStep({ phone, setPhone, next }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSendOtp = async () => {
    if (!phone || phone.length !== 10) {
      setError("Enter valid 10 digit mobile number")
      return
    }

    try {
      setLoading(true)
      setError("")

      await api.post("/auth/request-otp", {
        mobile: phone,
      })

      next()
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-700 text-sm">
        Enter mobile number to continue
      </p>

      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="9876543210"
        className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={handleSendOtp}
        disabled={loading}
        className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4 rounded-2xl font-semibold shadow-lg"
      >
        {loading ? "Sending..." : "Send OTP"}
      </button>
    </div>
  )
}