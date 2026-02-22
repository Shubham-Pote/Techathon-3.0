import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../Components/LanguageToggle";

const farmerBg = "/farmer-bg.png";

/* ─── Component ─── */
export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const problems    = t('landing.challenges',  { returnObjects: true });
  const metrics     = t('landing.metrics',     { returnObjects: true });
  const howItWorks  = t('landing.howItWorks',  { returnObjects: true });

  return (
    <div className="bg-background-light text-[#111811]" style={{ fontFamily: '"Public Sans", sans-serif' }}>

      {/* ── Header Bar ── */}
      <div className="text-white px-6 lg:px-10 py-4" style={{ background: '#1E0F05' }}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl" style={{ color: '#1E0F05' }}>agriculture</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wide">Krishiculture</h1>
              <p className="text-sm text-white/80">Government of India</p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <LanguageToggle transparent={true} />
          </div>
        </div>
      </div>

      {/* ── Golden accent line ── */}
      <div className="h-[5px]" style={{ background: 'linear-gradient(90deg, #B8952F, #D4A843, #C8A84E, #D4A843, #B8952F)' }}></div>

      <main>
        {/* ── Hero ── */}
        <section className="relative min-h-[600px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src="/wheat.png" alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'rgba(253,248,240,0.03)' }}></div>
          </div>

          <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 w-full">
            <div className="grid lg:grid-cols-2 gap-4 items-center py-16 lg:py-20">
              {/* Left - Text */}
              <div className="order-2 lg:order-1">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight mb-6" style={{ color: '#1A0A00' }}>
                  Krishi<span style={{ color: '#D4A843' }}>culture</span>
                </h1>
                <p className="text-2xl md:text-3xl font-normal mb-8 max-w-2xl leading-relaxed" style={{ color: '#000000' }}>
                  {t('landing.heroSubtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => navigate("/login")}
                    className="min-w-[200px] h-14 text-white rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-transform"
                    style={{ background: 'linear-gradient(135deg, #B8952F 0%, #D4A843 50%, #C8A84E 100%)', boxShadow: '0 8px 24px rgba(184, 149, 47, 0.35)' }}
                  >
                    {t('landing.checkYourEligibility')}
                  </button>
                  <button
                    onClick={() => navigate("/home")}
                    className="min-w-[200px] h-14 text-white rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-transform"
                    style={{ background: 'linear-gradient(135deg, #B8952F 0%, #D4A843 50%, #C8A84E 100%)', boxShadow: '0 8px 24px rgba(184, 149, 47, 0.35)' }}
                  >
                    {t('landing.exploreSchemes')}
                  </button>
                </div>
              </div>

              {/* Right - Circular Farmer Image */}
              <div className="order-1 lg:order-2 flex justify-center lg:justify-end lg:-mr-12">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-full opacity-20" style={{ background: 'linear-gradient(135deg, #D4A843, #C8A84E, #B8952F)', filter: 'blur(16px)' }}></div>
                  <div className="relative w-[380px] h-[380px] md:w-[460px] md:h-[460px] lg:w-[550px] lg:h-[550px] rounded-full p-2" style={{ background: 'linear-gradient(135deg, #D4A843 0%, #F0D78C 30%, #C8A84E 60%, #B8952F 100%)', boxShadow: '0 20px 60px rgba(184, 149, 47, 0.3), 0 8px 24px rgba(0,0,0,0.1)' }}>
                    <div className="w-full h-full rounded-full overflow-hidden" style={{ boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1)' }}>
                      <img className="w-full h-full object-cover" alt="Happy Indian farmer in wheat field" src="/farmer-bg.png" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Problem Section ── */}
        <section id="problems" className="py-20 px-6 lg:px-40 bg-primary/5">
          <div className="max-w-[1280px] mx-auto text-center mb-16">
            <h3 className="text-4xl font-black text-[#112211] mb-6">{t('landing.challengeTitle')}</h3>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-20 max-w-[1200px] mx-auto">
            {problems.map((p, i) => (
              <div
                key={i}
                className="group flex flex-col items-center justify-center text-center px-10 py-12 transition-all duration-300 hover:scale-105"
                style={{
                  width: '340px',
                  minHeight: '240px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f0faf0 60%, #e6f4e6 100%)',
                  border: '3px solid #a8d5a8',
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-black text-white mb-4 group-hover:scale-110 transition-transform"
                  style={{ background: 'linear-gradient(135deg, #B8952F, #D4A843)' }}
                >
                  {i + 1}
                </div>
                <h4 className="text-lg font-black mb-2 text-[#112211]">{p.title}</h4>
                <p className="text-sm text-[#618961] leading-relaxed max-w-[200px]">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── How It Works with Stylish Boxes ── */}
        <section id="schemes" className="py-20 px-6 lg:px-40 bg-white relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-8">
            <img 
              src="/leaf.png" 
              alt="leaf background" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(ellipse at top right, rgba(212,168,67,0.03) 0%, transparent 70%)' }}></div>
          <div className="max-w-[1280px] mx-auto relative z-10">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-black text-[#112211] mb-6">{t('landing.solutionTitle')}</h3>
              <p className="text-lg text-[#618961] max-w-xl mx-auto">
                {t('landing.solutionDesc')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1280px] mx-auto">
              {(Array.isArray(howItWorks) ? howItWorks : []).map((a, i) => (
                <div
                  key={i}
                  className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-[#D4A843] transition-all duration-300 hover:shadow-xl"
                  style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)' }}
                >
                  {/* Step number + icon */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#B8952F]/10 to-[#D4A843]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-[#D4A843]/20">
                      <span className="material-symbols-outlined text-3xl" style={{ color: '#B8952F' }}>{a.icon}</span>
                    </div>
                    <span className="text-4xl font-black" style={{ color: '#D4A843', opacity: 0.3 }}>{a.num}</span>
                  </div>

                  <h4 className="text-lg font-bold mb-3 text-[#1E0F05] group-hover:text-[#B8952F] transition-colors duration-300">
                    {a.title}
                  </h4>
                  <p className="text-sm text-[#618961] leading-relaxed">{a.desc}</p>

                  <div className="w-0 h-0.5 bg-gradient-to-r from-[#B8952F] to-[#D4A843] group-hover:w-full transition-all duration-300 mt-4"></div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── Impact ── */}
        <section id="impact" className="py-20 px-6 lg:px-40 bg-[#112211] text-white">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-16">
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
            <h3 className="text-4xl md:text-5xl font-black text-[#112211] mb-8 leading-tight">
              {t('landing.ctaTitle')}
            </h3>
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

    </div>
  );
}