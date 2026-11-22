import { useState } from "react"
import { useTranslation } from "react-i18next"
import api from "../../utils/api"

export default function PhoneStep({ phone, setPhone, next }) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSendOtp = async (event) => {
    event.preventDefault()
    if (!/^\d{10}$/.test(phone)) {
      setError(t("auth.invalidPhone"))
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
      setError(err.response?.data?.message || t("auth.sendFailed"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSendOtp} className="kc-auth-fields">
      <label htmlFor="sign-in-phone">{t("auth.mobileNumber")}</label>
      <div className="kc-phone">
        <span aria-hidden="true">+91</span>
        <input
          type="tel"
          id="sign-in-phone"
          autoComplete="tel-national"
          inputMode="numeric"
          aria-describedby={error ? "phone-error" : undefined}
          aria-invalid={Boolean(error)}
          value={phone}
          dir="ltr"
          onChange={(event) => setPhone(event.target.value)}
        />
      </div>
      {error && <p className="text-red-700 text-sm" id="phone-error" role="alert">{error}</p>}
      <button type="submit" disabled={loading} className="kc-button">{t(loading ? "auth.sendingOtp" : "auth.sendOtp")}</button>
    </form>
  )
}
