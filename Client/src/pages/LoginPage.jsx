import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { AnimatePresence, motion as Motion, useReducedMotion } from "framer-motion"
import PhoneStep from "../Components/LoginSteps/PhoneStep"
import OtpStep from "../Components/LoginSteps/otpStep"
import DetailsStep from "../Components/LoginSteps/DetailsStep"
import { useAuth } from "../context/AuthContext"
import { LuWheat } from "react-icons/lu"

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()
  const [step, setStep] = useState(1)
  const [phone, setPhone] = useState("")
  const [tempToken, setTempToken] = useState(null)
  const [devOtp, setDevOtp] = useState(null)

  const steps = ["auth.stepPhone", "auth.stepOtp", "auth.stepDetails"]

  function handleOtpSuccess(token) {
    setTempToken(token)
    setStep(3)
  }

  function handleDetailsFinish(profile) {
    login({ mobile: phone, token: tempToken, profile })
    navigate("/home")
  }

  return (
    <main id="main-content" tabIndex={-1} className="kc-shell kc-auth">
      <div className="kc-auth-form">
        <Link className="kc-text-link" to="/home">{t("schemeDetail.back")}</Link>
        <h1 className="kc-display">{t("auth.loginTitle")}</h1>
        <p>{t("auth.loginSubtitle")}</p>
        <ol className="kc-progress">
          {steps.map((label, index) => (
            <li key={label} aria-current={step === index + 1 ? "step" : undefined} data-complete={step > index + 1}>
              <span>{index + 1}</span>{t(label)}
            </li>
          ))}
        </ol>
        <AnimatePresence mode="wait" initial={false}>
          <Motion.div
            key={step}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
          >
            {step === 1 && <PhoneStep phone={phone} setPhone={setPhone} next={(otp) => {
              setDevOtp(otp)
              setStep(2)
            }} />}
            {step === 2 && <OtpStep phone={phone} devOtp={devOtp} onSuccess={handleOtpSuccess} />}
            {step === 3 && <DetailsStep onFinish={handleDetailsFinish} />}
          </Motion.div>
        </AnimatePresence>
      </div>
      <div className="kc-auth-visual">
        <img src="/field-portrait.webp" alt="" decoding="async" />
        <div><LuWheat aria-hidden="true" /><h2 className="kc-display">{t("auth.welcomeTitle")}</h2></div>
      </div>
    </main>
  )
}
