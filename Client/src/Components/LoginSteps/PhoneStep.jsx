import { useState } from "react"
import api from "../../utils/api"

export default function PhoneStep({ phone, setPhone, next }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSendOtp = async (event) => {
    event.preventDefault()
    if (!phone || phone.length !== 10) {
      setError("Enter valid 10 digit mobile number")
      return
    }

    try {
      setLoading(true)
      setError("")

      const res = await api.post("/auth/request-otp", {
        mobile: phone,
      })

      // Show OTP on screen (dev/demo mode — no real SMS gateway)

      next(res.data.otp || null)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSendOtp} className="space-y-6">
      <label className="block mb-2 text-gray-700 text-sm" htmlFor="sign-in-phone">
        Enter mobile number to continue
      </label>

      <input
        type="tel"
        id="sign-in-phone"
        autoComplete="tel-national"
        inputMode="numeric"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="9876543210"
        className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
      />

      {error && <p className="text-red-700 text-sm" role="alert">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="kc-button w-full"
      >
        {loading ? "Sending..." : "Send OTP"}
      </button>
    </form>
  )
}