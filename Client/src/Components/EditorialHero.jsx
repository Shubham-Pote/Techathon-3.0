import BlurText from "./BlurText"

// Adapted from Editorial Image Hero by felipemenezes098 (MIT), via 21st.dev.
// https://21st.dev/@felipemenezes098/components/hero-07
export default function EditorialHero({ tagline, title, accent, description, landscapeImage, children }) {
  return (
    <section className="kc-shell kc-editorial" aria-labelledby="landing-heading" data-enter>
      <div className="kc-editorial-image">
        <img src={landscapeImage} alt="" fetchPriority="high" decoding="async" />
      </div>
      <div className="kc-editorial-copy">
        <p className="kc-kicker">{tagline}</p>
        <h1 id="landing-heading" className="kc-display">
          {title} <em><BlurText text={accent} /></em>
        </h1>
        <p className="kc-editorial-description">{description}</p>
        {children}
      </div>
    </section>
  )
}
