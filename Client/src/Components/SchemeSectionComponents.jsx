/* ======================================================
   CLEAN MINIMAL SECTION STYLE (NO BIG BOXES)
   ====================================================== */

export function SectionWrapper({ id, title, children, sectionRef }) {
  return (
    <section
      id={id}
      ref={sectionRef}
      className="space-y-8 py-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-1.5 h-8 bg-emerald-500 rounded-full" />

        <h2 className="text-2xl font-semibold text-slate-800">
          {title}
        </h2>
      </div>

      {/* subtle divider */}
      <div className="h-px bg-slate-200" />

      {children}
    </section>
  )
}


/* ======================================================
   SIDEBAR
   ====================================================== */

export function SidebarItem({ label, active, onClick }) {
  return (
    <li
      onClick={onClick}
      className={`cursor-pointer px-4 py-2 rounded-xl transition-all duration-300
      ${
        active
          ? "bg-emerald-100 text-emerald-700 font-semibold shadow-sm"
          : "text-slate-600 hover:bg-slate-100 hover:translate-x-1"
      }`}
    >
      {label}
    </li>
  )
}


/* ======================================================
   BENEFITS (soft card only here)
   ====================================================== */

export function BenefitCard({ title, description }) {
  return (
    <div className="p-6 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 border border-slate-100">
      <h3 className="font-semibold text-emerald-600 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  )
}


/* ======================================================
   ELIGIBILITY (NO BOX — simple clean list)
   ====================================================== */

export function ChecklistItem({ text }) {
  return (
    <div className="flex gap-3 items-start py-2">
      <span className="mt-1 w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center">
        ✓
      </span>
      <p className="text-slate-700">{text}</p>
    </div>
  )
}


/* ======================================================
   PROCESS TIMELINE (floating style)
   ====================================================== */

export function TimelineStep({ step, index }) {
  return (
    <div className="flex gap-6 group">
      <div className="flex flex-col items-center">
        <div className="w-9 h-9 bg-emerald-600 text-white rounded-full flex items-center justify-center font-semibold shadow-md group-hover:scale-110 transition">
          {index + 1}
        </div>
        <div className="w-[2px] flex-1 bg-emerald-200 mt-2"></div>
      </div>

      {/* no big card */}
      <p className="flex-1 text-slate-700 leading-relaxed pt-1">
        {step}
      </p>
    </div>
  )
}


/* ======================================================
   DOCUMENTS (small tag style instead of big cards)
   ====================================================== */

export function DocumentCard({ doc }) {
  return (
    <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium inline-block hover:bg-emerald-100 transition">
      {doc}
    </div>
  )
}
