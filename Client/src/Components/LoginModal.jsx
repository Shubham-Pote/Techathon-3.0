import { useState } from "react"
import PhoneStep from "./LoginSteps/PhoneStep"
import OtpStep from "./LoginSteps/otpStep"
import DetailsStep from "./LoginSteps/DetailsStep"
import { useAuth } from "../context/AuthContext"

export default function LoginModal({ onClose }) {
  const { login } = useAuth()

  const [step, setStep] = useState(1)
  const [phone, setPhone] = useState("")
  const [userData, setUserData] = useState({})

  const handleFinish = (details) => {
    login(details)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[380px] rounded-2xl p-6 shadow-xl relative">

        {/* close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-2 text-gray-500 text-xl"
        >
          ✕
        </button>

        {step === 1 && (
          <PhoneStep
            phone={phone}
            setPhone={setPhone}
            next={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <OtpStep
            phone={phone}
            next={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <DetailsStep
            onFinish={handleFinish}
          />
        )}
      </div>
    </div>
  )
}
