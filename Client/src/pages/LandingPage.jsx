import { useNavigate } from "react-router-dom";

// Place farmer-bg.jpg in Client/public/ folder
const farmerBg = "/farmer-bg.jpg";

/* ─── Data ─── */
const challenges = [
  { icon: "description", title: "Complicated Documentation", desc: "Too many forms and confusing legal requirements." },
  { icon: "hub", title: "Lack of Centralized Info", desc: "Information is spread across disconnected departments." },
  { icon: "schedule", title: "Time-Consuming", desc: "Waiting for months to get even simple approvals." },
  { icon: "signal_cellular_alt_1_bar", title: "Digital Barriers", desc: "Complex portals that are hard to navigate on mobile." },
];

const steps = [
  { n: 1, title: "Enter Basic Details", desc: "Simply provide your state, land size, and crop type to get started." },
  { n: 2, title: "Get Recommendations", desc: "Instantly view schemes tailored specifically to your farm profile." },
  { n: 3, title: "Apply with Confidence", desc: "Complete one-click applications with pre-filled documents." },
];

const features = [
  { icon: "data_usage", title: "Minimal Data Requirement", desc: "No need to remember hundreds of details. Just the basics to get you verified." },
  { icon: "auto_awesome", title: "Smart Matching System", desc: "AI-driven engine that finds benefits you didn't even know you qualified for." },
  { icon: "account_balance_wallet", title: "Integrated Support Finder", desc: "Find insurance and financial credit options alongside government subsidies." },
  { icon: "map", title: "State-Specific Recommendations", desc: "Localized schemes that vary by region and agricultural climatic zones." },
  { icon: "touch_app", title: "User-Friendly Interface", desc: "Simple, clean navigation built for farmers of all technological backgrounds." },
  { icon: "phonelink_setup", title: "Low Digital Barriers", desc: "Optimized for low-bandwidth areas and works seamlessly on basic smartphones." },
];

const metrics = [
  { value: "95%", label: "Streamlined Access", desc: "Success rate in identifying eligible schemes" },
  { value: "-80%", label: "Reduced Time", desc: "Faster application processing versus manual" },
  { value: "3X", label: "Improved Awareness", desc: "Increase in scheme utilization per farmer" },
  { value: "$2B+", label: "Financial Inclusion", desc: "Total benefits facilitated through our portal" },
];

const platformLinks = ["Available Schemes", "Insurance Plans", "Eligibility Checker", "Financial Support"];
const resourceLinks = ["Farming Tips", "Success Stories", "Help Center", "Policy Updates"];

/* ─── Component ─── */
export default function LandingPage() {
  const navigate = useNavigate();

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
            <a className="text-[#111811] text-sm font-semibold hover:text-primary transition-colors" href="#schemes">Schemes</a>
            <a className="text-[#111811] text-sm font-semibold hover:text-primary transition-colors" href="#insurance">Insurance</a>
            <a className="text-[#111811] text-sm font-semibold hover:text-primary transition-colors" href="#how-it-works">How it Works</a>
            <a className="text-[#111811] text-sm font-semibold hover:text-primary transition-colors" href="#impact">Impact</a>
          </nav>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/home")}
              className="hidden sm:flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-sm hover:bg-opacity-90 transition-all"
            >
              Check Eligibility
            </button>
            <button
              onClick={() => navigate("/login")}
              className="flex min-w-[80px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-[#f0f4f0] text-[#111811] text-sm font-bold border border-[#dbe6db]"
            >
              Login
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
            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight mb-6">Krishiculture</h1>
            <p className="text-lg md:text-xl font-normal mb-10 max-w-3xl mx-auto opacity-90">
              Simplifying access to government schemes, insurance, and financial support for farmers through minimal input and smart technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/home")}
                className="min-w-[200px] h-14 bg-primary text-white rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-transform"
              >
                Check Your Eligibility
              </button>
              <button
                onClick={() => navigate("/home")}
                className="min-w-[200px] h-14 bg-white/20 backdrop-blur-sm text-white border-2 border-white rounded-xl font-bold text-lg hover:bg-white/30 transition-all"
              >
                Explore Schemes
              </button>
            </div>
            <p className="mt-6 text-sm font-medium opacity-80 italic">
              No complex forms. No confusion. Just the right support.
            </p>
          </div>
        </section>

        {/* ── Problem Section ── */}
        <section className="py-20 px-6 lg:px-40 bg-white">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">The Challenge</h2>
                <h3 className="text-4xl font-black text-[#112211] mb-6 leading-tight">
                  Why Farmers Struggle to Access Benefits
                </h3>
                <p className="text-lg text-[#618961] mb-8 leading-relaxed">
                  Farmers often miss out on government schemes and insurance benefits due to complex procedures, scattered information, and lengthy paperwork.
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
            <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">The Solution</h2>
            <h3 className="text-4xl font-black text-[#112211] mb-6">Our Solution</h3>
            <p className="text-lg text-[#416941] max-w-3xl mx-auto">
              Our platform uses 2-3 smart filters to instantly match farmers with relevant state and central government schemes, insurance, and financial support.
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
                <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Key Features</h2>
                <h3 className="text-4xl font-black text-[#112211]">Designed for Modern Agriculture</h3>
              </div>
              <button className="text-primary font-bold flex items-center gap-2 hover:underline">
                View All Features <span className="material-symbols-outlined">arrow_forward</span>
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
              <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Our Impact</h2>
              <h3 className="text-4xl font-black mb-6">Creating Measurable Impact</h3>
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
            <h3 className="text-4xl md:text-5xl font-black text-[#112211] mb-8 leading-tight">Krishiculture</h3>
            <p className="text-xl text-[#416941] mb-12">
              Join thousands of farmers who are already securing their financial future through AgriScheme Access.
            </p>
            <button
              onClick={() => navigate("/home")}
              className="min-w-[280px] h-16 bg-primary text-white rounded-xl font-black text-xl shadow-xl hover:scale-105 transition-all"
            >
              Get Started Now
            </button>
            <div className="mt-8 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">verified</span>
                <span className="text-sm font-semibold text-[#112211]">Verified Portal</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">security</span>
                <span className="text-sm font-semibold text-[#112211]">Secure Data</span>
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
              Dedicated to bringing the benefits of governance to every farmer's doorstep.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-bold text-[#111811] mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-[#618961]">
              {platformLinks.map((l) => (
                <li key={l}><a className="hover:text-primary transition-colors" href="#">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-[#111811] mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-[#618961]">
              {resourceLinks.map((l) => (
                <li key={l}><a className="hover:text-primary transition-colors" href="#">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-bold text-[#111811] mb-4">Connect</h4>
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
          <p className="text-xs text-[#618961]">© 2024 AgriScheme Access Platform. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-[#618961]">
            <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
            <a className="hover:text-primary transition-colors" href="#">Accessibility</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
