import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

import PhoneStep from "../Components/LoginSteps/PhoneStep"
import OtpStep from "../Components/LoginSteps/OtpStep"
import DetailsStep from "../Components/LoginSteps/DetailsStep"
import { useAuth } from "../context/AuthContext"
import Shetkari2 from "../assets/features/shetkari2.jpeg"

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [step, setStep] = useState(1)
  const [phone, setPhone] = useState("")
  const [tempToken, setTempToken] = useState(null)

  const steps = ["Phone", "OTP", "Details"]

  // ✅ After OTP verification → go to Details step
  const handleOtpSuccess = (token) => {
    setTempToken(token)
    setStep(3)
  }

  // ✅ After Details submitted → login + redirect
  const handleDetailsFinish = (formData) => {
  login({
    mobile: phone,
    token: tempToken,
    profile: formData,   // store full profile here
  })

  navigate("/")
}


  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 relative">
        <img
          src={Shetkari2}
          alt="Farmer"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-emerald-700/60 to-green-500/40"></div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Welcome Farmer !!
          </h1>
          <p className="text-xl opacity-90 max-w-md mb-6">
            Access government schemes, benefits, and support designed especially for you.
          </p>
          <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl w-fit">
            Empowering Farmers Digitally
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 p-6">
        <div className="w-full max-w-md">
          <div className="bg-white/75 backdrop-blur-2xl p-10 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.15)] border border-white/50">

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Farmer Login
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Secure & quick access
              </p>
            </div>

            {/* Step Indicator */}
            <div className="flex justify-between mb-8 text-xs font-medium text-gray-500">
              {steps.map((label, i) => {
                const active = step >= i + 1
                return (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition
                      ${active ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-500"}`}
                    >
                      {i + 1}
                    </div>
                    <span className={active ? "text-emerald-700" : ""}>
                      {label}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Animated Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >

                {/* STEP 1 */}
                {step === 1 && (
                  <PhoneStep
                    phone={phone}
                    setPhone={setPhone}
                    next={() => setStep(2)}
                  />
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <OtpStep
                    phone={phone}
                    onSuccess={handleOtpSuccess}
                  />
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <DetailsStep
                    onFinish={handleDetailsFinish}
                  />
                )}

              </motion.div>
            </AnimatePresence>

            <p className="text-xs text-center text-gray-400 mt-8">
              Secure • Government Verified • No data shared
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}