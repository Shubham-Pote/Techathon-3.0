import { useParams, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { useTranslation } from "react-i18next";
import { translateText, translateArray } from "../utils/translate";
import { getSchemeById } from "../services/schemeService";
import Tag from "../Components/SchemeSectionComponents";
import SchemeContent from "../Components/SchemeContent";

import DownloadButton from "../Components/DownloadButton";

export default function SchemeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [scheme, setScheme] = useState(null);
  const [active, setActive] = useState("details");
  const [translatedSummary, setTranslatedSummary] = useState(null);
  const [trName, setTrName] = useState("");
  const [trCategory, setTrCategory] = useState("");
  const [trMode, setTrMode] = useState("");
  const [trCrops, setTrCrops] = useState([]);

  const detailsRef = useRef(null);
  const benefitsRef = useRef(null);
  const eligibilityRef = useRef(null);
  const processRef = useRef(null);
  const docsRef = useRef(null);

  // Translate header fields (name, category, mode, crops) whenever language or scheme changes
  useEffect(() => {
    if (!scheme) return;
    const rawName = scheme.scheme_name || "";
    const rawCat = scheme.category || "";
    const rawMode = scheme.application_process?.mode || "";
    const rawCrops = scheme.supported_crops || [];

    if (lang === "en") {
      setTrName(rawName);
      setTrCategory(rawCat);
      setTrMode(rawMode);
      setTrCrops(rawCrops);
      return;
    }

    let cancelled = false;
    Promise.all([
      translateText(rawName, lang),
      translateText(rawCat, lang),
      translateText(rawMode, lang),
      translateArray(rawCrops, lang),
    ]).then(([name, cat, mode, crops]) => {
      if (cancelled) return;
      setTrName(name);
      setTrCategory(cat);
      setTrMode(mode);
      setTrCrops(crops);
    });
    return () => { cancelled = true; };
  }, [scheme, lang]);

  // Translate financial_assistance_summary whenever language or scheme changes
  useEffect(() => {
    const summary = scheme?.details?.financial_assistance_summary
    if (!summary || lang === "en") { setTranslatedSummary(null); return }
    let cancelled = false
    setTranslatedSummary(null)
    translateText(summary, lang).then(r => { if (!cancelled) setTranslatedSummary(r) })
    return () => { cancelled = true }
  }, [scheme, lang])

  const sidebarSections = [
    { id: "details", label: t('schemeDetail.sidebar.details'), ref: detailsRef },
    { id: "benefits", label: t('schemeDetail.sidebar.benefits'), ref: benefitsRef },
    { id: "eligibility", label: t('schemeDetail.sidebar.eligibility'), ref: eligibilityRef },
    { id: "process", label: t('schemeDetail.sidebar.process'), ref: processRef },
    { id: "docs", label: t('schemeDetail.sidebar.docs'), ref: docsRef },
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
            <p className="text-slate-400 text-sm">{t('schemeDetail.loading')}</p>
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

      <div className="min-h-screen bg-gray-50 flex pt-20">
        {/* ===== SIDEBAR ===== */}
        <aside className="hidden lg:block w-72 shrink-0">
          <nav className="sticky top-24 py-12 pl-8 pr-6">
            <div className="mb-6">
              <p className="text-sm font-bold uppercase tracking-wider text-gray-400">
                {t('schemeDetail.schemeSection')}
              </p>
            </div>

            <ul className="space-y-2 relative">
              {sidebarSections.map((sec) => (
                <li
                  key={sec.id}
                  onClick={() => scrollTo(sec.ref)}
                  className={`group cursor-pointer relative px-4 py-3 rounded-lg text-[15px] transition-all duration-200
                    ${
                      active === sec.id
                        ? "bg-emerald-100 text-gray-900 font-semibold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                >
                  <span
                    className={`absolute left-0 top-0 h-full w-1 rounded-r-full transition-all duration-300
                      ${
                        active === sec.id
                          ? "bg-emerald-400"
                          : "bg-transparent group-hover:bg-gray-300"
                      }`}
                  />
                  {sec.label}
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* ===== MAIN ===== */}
        <main className="flex-1 max-w-[960px] px-4 sm:px-6 lg:px-16 py-6 sm:py-10 pb-24 sm:pb-32">
          <button
            onClick={() => navigate("/home")}
            className="inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-900 text-sm font-medium mb-6 transition-colors"
          >
            {t('schemeDetail.back')}
          </button>

          {/* ===== HEADER ===== */}
          {/* ─── HEADER ─── */}
<div className="mb-10">
  

  {/* Title + Download in same row */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 mb-4 sm:mb-5">
    <h1 className="text-xl sm:text-2xl md:text-[32px] font-bold text-gray-900 leading-tight">
      {trName || scheme.scheme_name}
    </h1>
   

    <DownloadButton
      scheme={scheme}
      details={details}
      benefits={benefits}
      proc={proc}
    />
    
  </div>
   

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2.5 mb-4 sm:mb-6">
              <Tag label={trCategory || scheme.category} color="emerald" />
              {proc.mode && <Tag label={trMode || proc.mode} color="blue" />}
              {scheme.min_land_acres && (
                <Tag
                  label={t('schemeDetail.minAcre', { n: scheme.min_land_acres })}
                  color="violet"
                />
              )}
              {(trCrops.length > 0 ? trCrops : scheme.supported_crops || []).map((crop, i) => (
                <Tag key={i} label={crop} color="green" />
              ))}
            </div>

            {/* Financial summary */}
            {details.financial_assistance_summary && (
              <div className="bg-emerald-50 border-l-4 border-emerald-600 rounded-r px-3 sm:px-5 py-3 sm:py-4 mb-4 sm:mb-6">
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                  {t('schemeDetail.financialAssistance')}
                </p>
                <p className="text-sm sm:text-[16px] text-gray-900 font-semibold leading-relaxed">
                  {translatedSummary ?? details.financial_assistance_summary}
                </p>
              </div>
            )}
          </div>

          <hr className="border-t border-gray-200 mb-10" />

          <SchemeContent
            scheme={scheme}
            proc={proc}
            details={details}
            benefits={benefits}
            detailsRef={detailsRef}
            benefitsRef={benefitsRef}
            eligibilityRef={eligibilityRef}
            processRef={processRef}
            docsRef={docsRef}
          />
        </main>
      </div>

      {/* Floating Apply Button */}
      {proc.portal_url && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
          <a
            href={proc.portal_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 bg-emerald-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold shadow-lg hover:bg-emerald-700 hover:shadow-xl transition-all duration-300"
          >
            {t('schemeDetail.applyNow')}
          </a>
        </div>
      )}
    </>
  );
}