import { motion as Motion, useReducedMotion } from "framer-motion"

// Adapted from React Bits Blur Text by David Haz (MIT + Commons Clause).
// https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md
export default function BlurText({ text }) {
  const reduce = useReducedMotion()
  if (reduce) return text

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(" ").map((word, index) => (
          <span key={index}>
            {index > 0 && " "}
            <Motion.span
              className="kc-reveal-word"
              initial={{ opacity: 0, filter: "blur(8px)", y: 10 }}
              animate={{ opacity: [0, 0.65, 1], filter: ["blur(8px)", "blur(3px)", "blur(0px)"], y: [10, -1, 0] }}
              transition={{ duration: 0.52, delay: 0.08 + index * 0.075, ease: "easeOut" }}
            >
              {word}
            </Motion.span>
          </span>
        ))}
      </span>
    </>
  )
}
