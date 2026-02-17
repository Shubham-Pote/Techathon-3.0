import { useParams, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { getSchemeById } from "../services/schemeService";

export default function SchemeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [scheme, setScheme] = useState(null);
  const [active, setActive] = useState("details");

  const detailsRef = useRef(null);
  const benefitsRef = useRef(null);
  const eligibilityRef = useRef(null);
  const processRef = useRef(null);
  const docsRef = useRef(null);

  const sidebarSections = [
    { id: "details", label: "Details", ref: detailsRef },
    { id: "benefits", label: "Benefits", ref: benefitsRef },
    { id: "eligibility", label: "Eligibility", ref: eligibilityRef },
    { id: "process", label: "Application Process", ref: processRef },
    { id: "docs", label: "Documents Required", ref: docsRef },
  ];

  useEffect(() => {
    async function fetchScheme() {
      try {
        const response = await getSchemeById(id);
        if (!response?.success) return;
        let data = response.data;
        const p = (v) => (typeof v === "string" ? JSON.parse(v) : v);
        data.details = p(data.details);
        data.benefits = p(data.benefits);
        data.eligibility = p(data.eligibility);
        data.application_process = p(data.application_process);
        data.documents_required = p(data.documents_required);
        setScheme(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchScheme();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      sidebarSections.forEach((sec) => {
        if (!sec.ref.current) return;
        const top = sec.ref.current.offsetTop;
        const height = sec.ref.current.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          setActive(sec.id);
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (ref) => {
    window.scrollTo({ top: ref.current.offsetTop - 100, behavior: "smooth" });
  };

  if (!scheme) {
    return (
      <>
        <Navbar />
        <div className="pt-20 min-h-screen bg-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  const proc = scheme.application_process || {};
  const details = scheme.details || {};
  const benefits = scheme.benefits || {};

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-white flex pt-20">

        {/* ===== SIDEBAR ===== */}
        <aside className="hidden lg:block w-64 shrink-0">
          <nav className="sticky top-24 py-12 pl-6">
            <ul className="border-l border-gray-300">
              {sidebarSections.map((sec) => (
                <li
                  key={sec.id}
                  onClick={() => scrollTo(sec.ref)}
                  className={`cursor-pointer block py-6 pl-6 text-[16px] leading-snug transition-colors
                    ${active === sec.id
                      ? "text-gray-900 font-semibold border-l-[3px] border-gray-900 -ml-px"
                      : "text-gray-600 font-normal hover:text-gray-900"
                    }`}
                >
                  {sec.label}
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* ===== MAIN ===== */}
        <main className="flex-1 max-w-[820px] px-10 lg:px-16 py-10">

          {/* Back button - compact */}
          <button
            onClick={() => navigate("/home")}
            className="inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-900 text-sm font-medium mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Schemes
          </button>

          {/* ─── HEADER ─── */}
          <div className="mb-10">
            <p className="text-sm font-medium text-gray-500 mb-2">
              {scheme.state || "Central Government"}
            </p>
            <h1 className="text-[32px] font-bold text-gray-900 leading-tight mb-5">
              {scheme.scheme_name}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-2.5 mb-6">
              <Tag label={scheme.category} color="emerald" />
              {proc.mode && <Tag label={proc.mode} color="blue" />}
              {scheme.min_land_acres && <Tag label={`Min ${scheme.min_land_acres} Acre`} color="violet" />}
              {scheme.supported_crops?.map((crop, i) => (
                <Tag key={i} label={crop} color="green" />
              ))}
            </div>

            {/* Financial summary */}
            {details.financial_assistance_summary && (
              <div className="bg-emerald-50 border-l-4 border-emerald-600 rounded-r px-5 py-4 mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">Financial Assistance</p>
                <p className="text-[16px] text-gray-900 font-semibold leading-relaxed">
                  {details.financial_assistance_summary}
                </p>
              </div>
            )}

            {/* Apply CTA */}
            {proc.portal_url && (
              <a
                href={proc.portal_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3.5 rounded-lg text-base font-bold hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all"
              >
                Apply Now →
              </a>
            )}
          </div>

          <hr className="border-t border-gray-200 mb-10" />

          {/* ─── DETAILS ─── */}
          <section ref={detailsRef} id="details" className="mb-14">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">Details</h2>
            <p className="text-[16px] text-gray-700 leading-[1.9]">
              {details.description || "No description available."}
            </p>

            {details.technical_highlights?.length > 0 && (
              <div className="mt-8">
                <p className="text-[16px] text-gray-700 leading-[1.9]">
                  {details.technical_highlights.map((t, i) => (
                    <span key={i} className="block mb-4">{t}</span>
                  ))}
                </p>
              </div>
            )}
          </section>

          {/* ─── BENEFITS ─── */}
          <section ref={benefitsRef} id="benefits" className="mb-14">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">Benefits</h2>

            {benefits.assistance_details?.length > 0 ? (
              <div className="space-y-6">
                {benefits.assistance_details.map((b, i) => (
                  <div key={i} className="border-l-3 border-emerald-400 pl-5">
                    <h4 className="font-semibold text-gray-900 text-[17px] mb-1">{b.scheme_component}</h4>
                    <p className="text-[16px] text-gray-700 leading-[1.9]">{b.assistance}</p>
                    <div className="mt-3 flex flex-wrap gap-x-8 text-[15px] text-gray-600">
                      {b.max_limit && (
                        <span><span className="font-semibold text-gray-800">Max Limit:</span> {b.max_limit}</span>
                      )}
                      {b.implementing_agency && (
                        <span><span className="font-semibold text-gray-800">Agency:</span> {b.implementing_agency}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[16px] text-gray-400">No benefits listed.</p>
            )}

            {benefits.disbursing_authority && (
              <p className="mt-5 text-[16px] text-gray-700 leading-[1.9]">
                <span className="font-semibold text-gray-900">Disbursing Authority:</span> {benefits.disbursing_authority}
              </p>
            )}
          </section>

          {/* ─── ELIGIBILITY ─── */}
          <section ref={eligibilityRef} id="eligibility" className="mb-14">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">Eligibility</h2>

            {scheme.eligibility?.length > 0 ? (
              <ul className="space-y-4">
                {scheme.eligibility.map((e, i) => (
                  <li key={i} className="flex items-start gap-3 text-[16px] text-gray-700 leading-[1.9]">
                    <span className="mt-2 w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    {e}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[16px] text-gray-400">No eligibility conditions available.</p>
            )}
          </section>

          {/* ─── APPLICATION PROCESS ─── */}
          <section ref={processRef} id="process" className="mb-14">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">Application Process</h2>

            {/* Mode & Portal */}
            <div className="flex flex-wrap gap-x-10 gap-y-2 mb-6 text-[16px]">
              {proc.mode && (
                <div>
                  <span className="font-semibold text-gray-900">Mode: </span>
                  <span className="text-gray-700">{proc.mode}</span>
                </div>
              )}
              {proc.portal_name && (
                <div>
                  <span className="font-semibold text-gray-900">Portal: </span>
                  <span className="text-gray-700">{proc.portal_name}</span>
                </div>
              )}
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-3 mb-6">
              {proc.portal_url && (
                <a
                  href={proc.portal_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 bg-emerald-600 text-white px-5 py-2.5 rounded-md text-[15px] font-medium hover:bg-emerald-700 transition"
                >
                  Visit Portal →
                </a>
              )}
              {proc.application_status_url && proc.application_status_url !== proc.portal_url && (
                <a
                  href={proc.application_status_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-md text-[15px] font-medium hover:bg-gray-50 transition"
                >
                  Check Status →
                </a>
              )}
            </div>

            {/* Steps */}
            {proc.steps?.length > 0 && (
              <div className="space-y-0">
                {proc.steps.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                        {i + 1}
                      </div>
                      {i < proc.steps.length - 1 && (
                        <div className="w-px flex-1 bg-emerald-200 my-0.5" />
                      )}
                    </div>
                    <p className="flex-1 text-[16px] text-gray-700 leading-[1.9] pt-1 pb-4">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {proc.payment_note && (
              <p className="mt-4 text-[15px] text-gray-600 border-t border-gray-100 pt-4">
                <span className="font-semibold text-gray-800">Note:</span> {proc.payment_note}
              </p>
            )}
          </section>

          {/* ─── DOCUMENTS ─── */}
          <section ref={docsRef} id="docs" className="mb-14">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">Documents Required</h2>

            {scheme.documents_required?.length > 0 ? (
              <ul className="space-y-3">
                {scheme.documents_required.map((d, i) => (
                  <li key={i} className="flex items-center gap-3 text-[16px] text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[16px] text-gray-400">No documents listed.</p>
            )}
          </section>

        </main>
      </div>
    </>
  );
}

/* ─── Helpers ─── */

function Tag({ label, color }) {
  const colors = {
    emerald: "border-emerald-300 text-emerald-800 bg-emerald-100",
    blue: "border-blue-300 text-blue-800 bg-blue-100",
    violet: "border-violet-300 text-violet-800 bg-violet-100",
    green: "border-green-300 text-green-800 bg-green-100",
    amber: "border-amber-300 text-amber-800 bg-amber-100",
  };
  return (
    <span className={`px-3.5 py-1.5 rounded-full border text-[13px] font-semibold ${colors[color] || colors.emerald}`}>
      {label}
    </span>
  );
}