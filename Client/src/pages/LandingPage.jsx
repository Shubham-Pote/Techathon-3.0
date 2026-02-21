import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../Components/LanguageToggle";

// Place farmer-bg.jpg in Client/public/ folder
const farmerBg = "/farmer-bg.jpg";

// Icon arrays (language-independent)
const challengeIcons = ["description", "hub", "schedule", "signal_cellular_alt_1_bar"];
const featureIcons  = ["data_usage", "auto_awesome", "account_balance_wallet", "map", "touch_app", "phonelink_setup"];

/* ─── Component ─── */
export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Merge icons with translated data
  const challenges = (t('landing.challenges', { returnObjects: true }) || []).map((c, i) => ({ ...c, icon: challengeIcons[i] }));
  const features   = (t('landing.features',   { returnObjects: true }) || []).map((f, i) => ({ ...f, icon: featureIcons[i] }));
  const steps      = (t('landing.steps',      { returnObjects: true }) || []).map((s, i) => ({ ...s, n: i + 1 }));
  const metrics    = t('landing.metrics',      { returnObjects: true }) || [];
  const platformLinks = t('landing.platformLinks', { returnObjects: true }) || [];
  const resourceLinks = t('landing.resourceLinks', { returnObjects: true }) || [];

  return (
    <div className="bg-background-light text-[#111811]" style={{ fontFamily: '"Public Sans", sans-serif' }}>

      {/* ── Navigation ── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#dbe6db] px-6 lg:px-40 py-3">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-primary">
              <span className="material-symbols-outlined text-3xl">agriculture</span>
            </div>
            <h2 className="text-[#111811] text-xl font-bold tracking-tight">Krishiculture</h2>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a className="text-[#111811] text-sm font-semibold hover:text-primary transition-colors" href="#schemes">{t('nav.schemes')}</a>
            <a className="text-[#111811] text-sm font-semibold hover:text-primary transition-colors" href="#insurance">{t('nav.insurance')}</a>
            <a className="text-[#111811] text-sm font-semibold hover:text-primary transition-colors" href="#how-it-works">{t('nav.howItWorks')}</a>
            <a className="text-[#111811] text-sm font-semibold hover:text-primary transition-colors" href="#impact">{t('nav.impact')}</a>
          </nav>

          <div className="flex gap-3 items-center">
            <LanguageToggle />
            <button
              onClick={() => navigate("/home")}
              className="hidden sm:flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-sm hover:bg-opacity-90 transition-all"
            >
              {t('nav.checkEligibility')}
            </button>
            <button
              onClick={() => navigate("/login")}
              className="flex min-w-[80px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-[#f0f4f0] text-[#111811] text-sm font-bold border border-[#dbe6db]"
            >
              {t('nav.login')}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <img
              className="w-full h-full object-cover"
              alt="Farmer standing in field"
              src={farmerBg}
            />
          </div>
          <div className="relative z-20 max-w-[960px] px-6 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight mb-6">{t('landing.heroTitle')}</h1>
            <p className="text-lg md:text-xl font-normal mb-10 max-w-3xl mx-auto opacity-90">
              {t('landing.heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/home")}
                className="min-w-[200px] h-14 bg-primary text-white rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-transform"
              >
                {t('landing.checkYourEligibility')}
              </button>
              <button
                onClick={() => navigate("/home")}
                className="min-w-[200px] h-14 bg-white/20 backdrop-blur-sm text-white border-2 border-white rounded-xl font-bold text-lg hover:bg-white/30 transition-all"
              >
                {t('landing.exploreSchemes')}
              </button>
            </div>
            <p className="mt-6 text-sm font-medium opacity-80 italic">
              {t('landing.heroNote')}
            </p>
          </div>
        </section>

        {/* ── Problem Section ── */}
        <section className="py-20 px-6 lg:px-40 bg-white">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">{t('landing.challengeLabel')}</h2>
                <h3 className="text-4xl font-black text-[#112211] mb-6 leading-tight">
                  {t('landing.challengeTitle')}
                </h3>
                <p className="text-lg text-[#618961] mb-8 leading-relaxed">
                  {t('landing.challengeDesc')}
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {challenges.map((c, i) => (
                  <div key={i} className="p-6 rounded-xl border border-[#dbe6db] bg-background-light">
                    <span className="material-symbols-outlined text-primary text-3xl mb-4 block">{c.icon}</span>
                    <h4 className="font-bold text-lg mb-2">{c.title}</h4>
                    <p className="text-sm text-[#618961]">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Solution / How It Works ── */}
        <section id="how-it-works" className="py-20 px-6 lg:px-40 bg-primary/5">
          <div className="max-w-[1280px] mx-auto text-center mb-16">
            <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">{t('landing.solutionLabel')}</h2>
            <h3 className="text-4xl font-black text-[#112211] mb-6">{t('landing.solutionTitle')}</h3>
            <p className="text-lg text-[#416941] max-w-3xl mx-auto">
              {t('landing.solutionDesc')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-[1100px] mx-auto">
            {steps.map((s) => (
              <div key={s.n} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-6 group-hover:scale-110 transition-transform">
                  {s.n}
                </div>
                <h4 className="text-xl font-bold mb-3">{s.title}</h4>
                <p className="text-[#618961]">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Key Features ── */}
        <section id="schemes" className="py-20 px-6 lg:px-40 bg-white">
          <div className="max-w-[1280px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="max-w-xl">
                <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">{t('landing.featuresLabel')}</h2>
                <h3 className="text-4xl font-black text-[#112211]">{t('landing.featuresTitle')}</h3>
              </div>
              <button className="text-primary font-bold flex items-center gap-2 hover:underline">
                {t('landing.viewAllFeatures')} <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <div key={i} className="p-8 rounded-2xl border border-[#f0f4f0] bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined">{f.icon}</span>
                  </div>
                  <h4 className="text-lg font-bold mb-3">{f.title}</h4>
                  <p className="text-[#618961] text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Impact ── */}
        <section id="impact" className="py-20 px-6 lg:px-40 bg-[#112211] text-white">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">{t('landing.impactLabel')}</h2>
              <h3 className="text-4xl font-black mb-6">{t('landing.impactTitle')}</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {metrics.map((m, i) => (
                <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <div className="text-5xl font-black text-primary mb-2">{m.value}</div>
                  <div className="text-lg font-bold mb-1">{m.label}</div>
                  <div className="text-sm text-gray-400">{m.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 px-6 lg:px-40 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover opacity-10"
              alt="Crops background"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoDGTnXtY1mMRC3oJ0vC31gRkC5yIQ4nJETzMY_ntbYOWl0U0SCG0S3ybZz9mdS6tFRHD0NBOO246X1ViRS7gr7wNSnvuK73Sq2L9R9G3YylHAjsglT33qZanDFdCSzdo6YRT2FAwkkV8qfLHTr1Yv02PyEyY_9f3VA3XNDkxUvEx9JZcLkH8Jp5aErkd9QMQLebTp0BlXZalu6mCCxtzwhDgaDQthZZ9BCHvKYQeodZLu16DV_0FMvw-YMgXdx_dDW2o45ina4I4"
            />
          </div>
          <div className="relative z-10 max-w-[800px] mx-auto text-center">
            <h3 className="text-4xl md:text-5xl font-black text-[#112211] mb-8 leading-tight">{t('landing.ctaTitle')}</h3>
            <p className="text-xl text-[#416941] mb-12">
              {t('landing.ctaDesc')}
            </p>
            <button
              onClick={() => navigate("/home")}
              className="min-w-[280px] h-16 bg-primary text-white rounded-xl font-black text-xl shadow-xl hover:scale-105 transition-all"
            >
              {t('landing.ctaBtn')}
            </button>
            <div className="mt-8 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">verified</span>
                <span className="text-sm font-semibold text-[#112211]">{t('landing.ctaVerified')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">security</span>
                <span className="text-sm font-semibold text-[#112211]">{t('landing.ctaSecure')}</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-background-light border-t border-[#dbe6db] py-12 px-6 lg:px-40">
        <div className="max-w-[1280px] mx-auto grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="text-primary">
                <span className="material-symbols-outlined text-2xl">agriculture</span>
              </div>
              <h2 className="text-[#111811] text-lg font-bold tracking-tight">Krishiculture</h2>
            </div>
            <p className="text-sm text-[#618961] leading-relaxed">
              {t('landing.footerDesc')}
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-bold text-[#111811] mb-4">{t('landing.platform')}</h4>
            <ul className="space-y-2 text-sm text-[#618961]">
              {platformLinks.map((lk) => (
                <li key={lk}><a className="hover:text-primary transition-colors" href="#">{lk}</a></li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-[#111811] mb-4">{t('landing.resources')}</h4>
            <ul className="space-y-2 text-sm text-[#618961]">
              {resourceLinks.map((lk) => (
                <li key={lk}><a className="hover:text-primary transition-colors" href="#">{lk}</a></li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-bold text-[#111811] mb-4">{t('landing.connect')}</h4>
            <div className="flex gap-4">
              {["public", "mail", "call"].map((icon) => (
                <a key={icon} className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors" href="#">
                  <span className="material-symbols-outlined text-sm">{icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto mt-12 pt-8 border-t border-[#dbe6db] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#618961]">{t('landing.copyright')}</p>
          <div className="flex gap-6 text-xs text-[#618961]">
            <a className="hover:text-primary transition-colors" href="#">{t('landing.privacyPolicy')}</a>
            <a className="hover:text-primary transition-colors" href="#">{t('landing.termsOfService')}</a>
            <a className="hover:text-primary transition-colors" href="#">{t('landing.accessibility')}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
