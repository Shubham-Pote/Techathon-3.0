import { useState } from "react"
import { useTranslation } from "react-i18next"
import api from "../../utils/api"

export default function OtpStep({ phone, devOtp, onSuccess }) {
  const { t } = useTranslation()
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function verify(event) {
    event.preventDefault()
    if (!/^\d{6}$/.test(otp)) {
      setError(t("auth.invalidOtp"))
      return
    }

    setLoading(true)
    setError("")
    try {
      const { data } = await api.post("/auth/verify-otp", { mobile: phone, otp })
      localStorage.setItem("token", data.token)
      onSuccess(data.token)
    } catch (err) {
      setError(err.response?.data?.message || t("auth.invalidOtp"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={verify} className="kc-auth-fields">
      {devOtp && <p className="kc-demo-otp">{t("auth.demoOtp")} <strong>{devOtp}</strong></p>}
      <label htmlFor="login-otp">{t("auth.otpLabel")}</label>
      <input
        id="login-otp"
        className="kc-otp-input"
        value={otp}
        autoComplete="one-time-code"
        inputMode="numeric"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "otp-error" : undefined}
        autoFocus
        onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
      />
      {error && <p className="text-red-700 text-sm" id="otp-error" role="alert">{error}</p>}
      <button type="submit" disabled={loading} className="kc-button">{t(loading ? "auth.verifying" : "auth.verifyOtp")}</button>
    </form>
  )
}
