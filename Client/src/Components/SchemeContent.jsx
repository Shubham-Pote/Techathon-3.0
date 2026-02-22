import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { translateText, translateArray } from "../utils/translate"

export default function SchemeContent({
  scheme,
  proc,
  details,
  benefits,
  detailsRef,
  benefitsRef,
  eligibilityRef,
  processRef,
  docsRef
}) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  const [tx, setTx] = useState(null)
  const [translating, setTranslating] = useState(false)

  useEffect(() => {
    if (lang === "en") { setTx(null); setTranslating(false); return }
    let cancelled = false
    setTranslating(true)
    const ad = benefits.assistance_details ?? []
    Promise.all([
      translateText(details.description, lang),
      translateArray(details.technical_highlights ?? [], lang),
      translateText(benefits.disbursing_authority, lang),
      translateArray(scheme.eligibility ?? [], lang),
      translateArray(proc.steps ?? [], lang),
      translateText(proc.payment_note, lang),
      translateArray(scheme.documents_required ?? [], lang),
      translateArray(ad.map(b => b.scheme_component), lang),
      translateArray(ad.map(b => b.assistance), lang),
      translateArray(ad.map(b => b.max_limit), lang),
      translateArray(ad.map(b => b.implementing_agency), lang),
    ]).then(([desc, highlights, disbursing, eligibility, steps, paymentNote, documents, comps, assists, limits, agcs]) => {
      if (cancelled) return
      setTx({
        description: desc,
        technical_highlights: highlights,
        disbursing_authority: disbursing,
        eligibility,
        steps,
        payment_note: paymentNote,
        documents,
        assistance_details: ad.map((b, i) => ({
          ...b,
          scheme_component: comps[i],
          assistance: assists[i],
          max_limit: limits[i],
          implementing_agency: agcs[i],
        })),
      })
      setTranslating(false)
    }).catch(() => { if (!cancelled) setTranslating(false) })
    return () => { cancelled = true }
  }, [lang, details, benefits, proc, scheme])

  const desc             = tx?.description             ?? details.description
  const highlights       = tx?.technical_highlights    ?? details.technical_highlights
  const disbursing       = tx?.disbursing_authority    ?? benefits.disbursing_authority
  const eligibility      = tx?.eligibility             ?? scheme.eligibility
  const steps            = tx?.steps                  ?? proc.steps
  const paymentNote      = tx?.payment_note            ?? proc.payment_note
  const documents        = tx?.documents               ?? scheme.documents_required
  const assistanceDetails = tx?.assistance_details     ?? benefits.assistance_details

  if (translating) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-8 h-8 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">{t('schemeDetail.loading')}</p>
      </div>
    )
  }

  return (
    <>
      {/* ─── DETAILS ─── */}
      <section ref={detailsRef} id="details" className="mb-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">{t('schemeDetail.content.detailsHeading')}</h2>
        <p className="text-[16px] text-gray-700 leading-[1.9]">
          {desc || t('schemeDetail.content.noDescription')}
        </p>

        {highlights?.length > 0 && (
          <div className="mt-8">
            <p className="text-[16px] text-gray-700 leading-[1.9]">
              {highlights.map((highlight, i) => (
                <span key={i} className="block mb-4">{highlight}</span>
              ))}
            </p>
          </div>
        )}
        
      </section>

      {/* ─── BENEFITS ─── */}
      <section ref={benefitsRef} id="benefits" className="mb-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">{t('schemeDetail.content.benefitsHeading')}</h2>

        {assistanceDetails?.length > 0 ? (
          <div className="space-y-6">
            {assistanceDetails.map((b, i) => (
              <div key={i} className="border-l-3 border-emerald-400 pl-5">
                <h4 className="font-semibold text-gray-900 text-[17px] mb-1">{b.scheme_component}</h4>
                <p className="text-[16px] text-gray-700 leading-[1.9]">{b.assistance}</p>
                <div className="mt-3 flex flex-wrap gap-x-8 text-[15px] text-gray-600">
                  {b.max_limit && (
                    <span><span className="font-semibold text-gray-800">{t('schemeDetail.content.maxLimit')}</span> {b.max_limit}</span>
                  )}
                  {b.implementing_agency && (
                    <span><span className="font-semibold text-gray-800">{t('schemeDetail.content.agency')}</span> {b.implementing_agency}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[16px] text-gray-400">{t('schemeDetail.content.noBenefits')}</p>
        )}

        {disbursing && (
          <p className="mt-5 text-[16px] text-gray-700 leading-[1.9]">
            <span className="font-semibold text-gray-900">{t('schemeDetail.content.disbursingAuthority')}</span> {disbursing}
          </p>
        )}
      </section>

      {/* ─── ELIGIBILITY ─── */}
      <section ref={eligibilityRef} id="eligibility" className="mb-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">{t('schemeDetail.content.eligibilityHeading')}</h2>

        {eligibility?.length > 0 ? (
          <ul className="space-y-4">
            {eligibility.map((e, i) => (
              <li key={i} className="flex items-start gap-3 text-[16px] text-gray-700 leading-[1.9]">
                <span className="mt-2 w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                {e}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[16px] text-gray-400">{t('schemeDetail.content.noEligibility')}</p>
        )}
      </section>

      {/* ─── APPLICATION PROCESS ─── */}
      <section ref={processRef} id="process" className="mb-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">{t('schemeDetail.content.processHeading')}</h2>

        {/* Mode & Portal */}
        <div className="flex flex-wrap gap-x-10 gap-y-2 mb-6 text-[16px]">
          {proc.mode && (
            <div>
              <span className="font-semibold text-gray-900">{t('schemeDetail.content.mode')} </span>
              <span className="text-gray-700">{proc.mode}</span>
            </div>
          )}
          {proc.portal_name && (
            <div>
              <span className="font-semibold text-gray-900">{t('schemeDetail.content.portal')} </span>
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
              {t('schemeDetail.content.visitPortal')}
            </a>
          )}
          {proc.application_status_url && proc.application_status_url !== proc.portal_url && (
            <a
              href={proc.application_status_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-md text-[15px] font-medium hover:bg-gray-50 transition"
            >
              {t('schemeDetail.content.checkStatus')}
            </a>
          )}
        </div>

        {/* Steps */}
        {steps?.length > 0 && (
          <div className="space-y-0">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    {i + 1}
                  </div>
                  {i < steps.length - 1 && (
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

        {paymentNote && (
          <p className="mt-4 text-[15px] text-gray-600 border-t border-gray-100 pt-4">
            <span className="font-semibold text-gray-800">{t('schemeDetail.content.note')}</span> {paymentNote}
          </p>
        )}
      </section>

      {/* ─── DOCUMENTS ─── */}
      <section ref={docsRef} id="docs" className="mb-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">{t('schemeDetail.content.docsHeading')}</h2>

        {documents?.length > 0 ? (
          <ul className="space-y-3">
            {documents.map((d, i) => (
              <li key={i} className="flex items-center gap-3 text-[16px] text-gray-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                {d}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[16px] text-gray-400">{t('schemeDetail.content.noDocs')}</p>
        )}
      </section>
    </>
  );
}