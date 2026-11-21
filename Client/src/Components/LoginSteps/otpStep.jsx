import { useState } from "react"
import api from "../../utils/api"

export default function OtpStep({ phone, devOtp, onSuccess }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]) // 6 digits
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Move focus forward
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus()
    }
  }

  const handleVerify = async (event) => {
    event.preventDefault()
    const finalOtp = otp.join("")

    if (finalOtp.length !== 6) {
      setError("Enter complete 6 digit OTP")
      return
    }

    try {
      setLoading(true)
      setError("")

      const res = await api.post("/auth/verify-otp", {
        mobile: phone,
        otp: finalOtp,
      })

      const token = res.data.token

      localStorage.setItem("token", token)

      onSuccess(token)
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleVerify} className="space-y-6 text-center">
      <div className="text-4xl">🔐</div>
      <p className="text-sm text-gray-500">Enter 6 digit code</p>

      {/* Dev/demo: show the OTP since there's no SMS gateway */}
      {devOtp && (
        <div className="bg-amber-50 border border-amber-300 text-amber-800 rounded-xl px-4 py-2 text-sm font-semibold">
          📋 Demo OTP: <span className="tracking-widest font-mono text-lg">{devOtp}</span>
        </div>
      )}

      <div className="flex justify-center gap-1.5 sm:gap-3 flex-wrap">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            value={digit}
            aria-label={`Code digit ${index + 1}`}
            maxLength={1}
            inputMode="numeric"
            autoFocus={index === 0}
            onChange={(e) => handleChange(e.target.value, index)}
            className="w-9 sm:w-12 h-12 text-center text-lg bg-white border border-gray-200 rounded-xl shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
          />
        ))}
      </div>

      {error && <p className="text-red-700 text-sm" role="alert">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="kc-button w-full"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </form>
  )
}