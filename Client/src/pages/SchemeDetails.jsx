import { useParams } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { getSchemeById } from "../services/schemeService";

import {
  SectionWrapper,
  SidebarItem,
  ChecklistItem,
  TimelineStep,
  DocumentCard
} from "../Components/SchemeSectionComponents";

export default function SchemeDetails() {
  const { id } = useParams();

  const [scheme, setScheme] = useState(null);
  const [active, setActive] = useState("details");

  const detailsRef = useRef(null);
  const benefitsRef = useRef(null);
  const eligibilityRef = useRef(null);
  const processRef = useRef(null);
  const docsRef = useRef(null);

  const sections = [
    { id: "details", ref: detailsRef },
    { id: "benefits", ref: benefitsRef },
    { id: "eligibility", ref: eligibilityRef },
    { id: "process", ref: processRef },
    { id: "docs", ref: docsRef }
  ];

  // Fetch Scheme
  useEffect(() => {
    async function fetchScheme() {
      try {
        const response = await getSchemeById(id);
        if (!response?.success) return;

        let data = response.data;
        const parseIfString = (v) =>
          typeof v === "string" ? JSON.parse(v) : v;

        data.details = parseIfString(data.details);
        data.benefits = parseIfString(data.benefits);
        data.eligibility = parseIfString(data.eligibility);
        data.application_process = parseIfString(data.application_process);
        data.documents_required = parseIfString(data.documents_required);

        setScheme(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchScheme();
  }, [id]);

  // Scroll Spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;

      sections.forEach((sec) => {
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
    window.scrollTo({
      top: ref.current.offsetTop - 110,
      behavior: "smooth"
    });
  };

  const downloadPDF = () => {
    window.print(); // Simple browser print-to-PDF
  };

  if (!scheme) {
    return (
      <>
        <Navbar />
        <p className="p-10">Loading...</p>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="pt-20 min-h-screen bg-slate-50 flex">

        {/* Sidebar */}
        <aside className="hidden lg:block w-72 border-r border-slate-200 bg-white">
          <div className="sticky top-24 px-6 py-8">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">
              Scheme Sections
            </h2>

            <ul className="space-y-3">
              <SidebarItem label="Overview" active={active === "details"} onClick={() => scrollTo(detailsRef)} />
              <SidebarItem label="Benefits" active={active === "benefits"} onClick={() => scrollTo(benefitsRef)} />
              <SidebarItem label="Eligibility" active={active === "eligibility"} onClick={() => scrollTo(eligibilityRef)} />
              <SidebarItem label="Application Process" active={active === "process"} onClick={() => scrollTo(processRef)} />
              <SidebarItem label="Documents Required" active={active === "docs"} onClick={() => scrollTo(docsRef)} />
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-8 py-8 space-y-10 max-w-5xl mx-auto">

          {/* Header */}
          <div className="bg-white border border-slate-200 rounded-xl px-8 py-6 shadow-sm"> 
            <h1 className="text-3xl font-semibold text-slate-800"> {scheme.scheme_name} </h1> 
            <div className="flex flex-wrap gap-3 mt-3 text-sm"> 
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-md"> 
                {scheme.state || "Central Government"} </span> 
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-md"> {scheme.category} </span> 
                {scheme.min_land_acres && ( <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md"> 
                  Min Land: {scheme.min_land_acres} acre(s) </span> )} </div> 

            {/* PDF BUTTON */}
            {/* <button
              onClick={downloadPDF}
              className="bg-slate-800 text-white px-5 py-2 rounded-lg text-sm font-medium shadow hover:bg-slate-900 transition"
            >
              Download PDF
            </button> */}
          </div>

          {/* DETAILS */}
          <SectionWrapper id="details" sectionRef={detailsRef} title="Scheme Overview">
            <p className="text-slate-600 leading-relaxed">
              {scheme.details?.description}
            </p>
            {scheme.details?.technical_highlights?.length > 0 && 
            ( <div className="mt-6"> 
              <h3 className="text-xl font-semibold text-slate-700 mb-3"> Technical Highlights </h3> 
              <ul className="list-disc ml-6 space-y-2 text-slate-600"> 
                {scheme.details.technical_highlights.map((t, i) => ( <li key={i}>{t}</li> ))} </ul>
                 </div> )}
          </SectionWrapper>

          {/* BENEFITS */}
          <SectionWrapper
            id="benefits"
            sectionRef={benefitsRef}
            title="Benefits & Financial Assistance"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {scheme.benefits?.assistance_details?.length > 0 ? (
                scheme.benefits.assistance_details.map((b, i) => (
                  <div
                    key={i}
                    className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                  >
                    <h3 className="text-base font-semibold text-slate-800">
                      {b.scheme_component}
                    </h3>

                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      {b.assistance}
                    </p>

                    <div className="mt-4 text-sm text-slate-600 space-y-1">
                      <p>
                        <span className="font-medium text-slate-700">Max Limit:</span> {b.max_limit}
                      </p>
                      <p>
                        <span className="font-medium text-slate-700">Implementing Agency:</span> {b.implementing_agency}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No benefits listed.</p>
              )}
            </div>

            {scheme.benefits?.disbursing_authority && (
              <div className="mt-6 bg-slate-100 border border-slate-200 rounded-lg p-4 text-sm text-slate-700">
                <span className="font-semibold text-slate-800">
                  Disbursing Authority:
                </span>{" "}
                {scheme.benefits.disbursing_authority}
              </div>
            )}
          </SectionWrapper>

          {/* ELIGIBILITY */}
          <SectionWrapper id="eligibility" sectionRef={eligibilityRef} title="Eligibility Criteria">
            <div className="space-y-2">
              {scheme.eligibility?.length > 0 ? (
                scheme.eligibility.map((e, i) => (
                  <ChecklistItem key={i} text={e} />
                ))
              ) : (
                <p>No eligibility conditions available.</p>
              )}
            </div>
          </SectionWrapper>

          {/* APPLICATION PROCESS */}
          <SectionWrapper id="process" sectionRef={processRef} title="Application Process">

            <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">

              {scheme.application_process?.mode && (
                <div className="mb-4">
                  <p className="text-xs uppercase tracking-wide text-blue-600 font-semibold">
                    Application Mode
                  </p>
                  <p className="text-slate-800 font-semibold text-lg mt-1">
                    {scheme.application_process.mode}
                  </p>
                </div>
              )}

              {scheme.application_process?.portal_name && (
                <div className="mb-4">
                  <p className="text-xs uppercase tracking-wide text-blue-600 font-semibold">
                    Official Portal
                  </p>
                  <p className="text-slate-800 font-semibold text-base mt-1">
                    {scheme.application_process.portal_name}
                  </p>
                </div>
              )}

              {scheme.application_process?.portal_url && (
                <a
                  href={scheme.application_process.portal_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium shadow hover:bg-blue-700 transition"
                >
                  Visit Official Portal →
                </a>
              )}
            </div>

            <div className="space-y-6">
              {scheme.application_process?.steps?.length > 0 ? (
                scheme.application_process.steps.map((step, i) => (
                  <TimelineStep key={i} step={step} index={i} />
                ))
              ) : (
                <p>No steps listed.</p>
              )}
            </div>
          </SectionWrapper>

          {/* DOCUMENTS */}
          <SectionWrapper id="docs" sectionRef={docsRef} title="Documents Required">
            <div className="flex flex-wrap gap-4">
              {scheme.documents_required?.length > 0 ? (
                scheme.documents_required.map((d, i) => (
                  <DocumentCard key={i} doc={d} />
                ))
              ) : (
                <p>No documents listed.</p>
              )}
            </div>
          </SectionWrapper>

        </main>
      </div>
    </>
  );
}