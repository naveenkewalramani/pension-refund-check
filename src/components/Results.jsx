import { useState } from 'react'

function CheckIcon({ met }) {
  return met ? (
    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">✓</span>
  ) : (
    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xs font-bold">✕</span>
  )
}

export default function Results({ result, country, onRestart }) {
  const [showCalc, setShowCalc] = useState(false)

  if (!result) return null

  const { eligible, preservedRights, symbol, estimatedRefund, headline, criteria, calculation, nextSteps, legalNote, disclaimer } = result

  const bannerClass = eligible
    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
    : preservedRights
    ? 'bg-amber-50 border-amber-200 text-amber-900'
    : 'bg-red-50 border-red-200 text-red-900'

  const amountClass = eligible ? 'text-emerald-700' : 'text-gray-400'

  const statusEmoji = eligible ? '🎉' : preservedRights ? '📋' : '❌'

  return (
    <div className="animate-slide-in space-y-4">
      {/* Status banner */}
      <div className={`rounded-2xl border-2 p-6 ${bannerClass}`}>
        <div className="flex items-start gap-3">
          <span className="text-2xl leading-none">{statusEmoji}</span>
          <div>
            <p className="font-bold text-lg leading-snug">{headline}</p>
            <p className="text-sm mt-1 opacity-80">
              {country.flag} {country.name} · {country.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Estimated refund */}
      {eligible && estimatedRefund > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Estimated Refund</p>
          <p className={`text-5xl font-extrabold tracking-tight ${amountClass}`}>
            {symbol}{Math.round(estimatedRefund).toLocaleString('en-GB')}
          </p>
          <p className="text-xs text-gray-400 mt-2">Approximate value — actual amount determined by the pension authority</p>

          {calculation && calculation.length > 0 && (
            <button
              onClick={() => setShowCalc((v) => !v)}
              className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
            >
              {showCalc ? '▲ Hide calculation' : '▼ Show how this is calculated'}
            </button>
          )}

          {showCalc && (
            <div className="mt-3 rounded-xl bg-gray-50 p-4 space-y-1.5">
              {calculation.map((row) => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{row.label}</span>
                  <span className="font-semibold text-gray-800">{row.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Eligibility criteria */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Eligibility Criteria</p>
        <ul className="space-y-3">
          {criteria.map((c, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckIcon met={c.met} />
              <span className={`text-sm leading-relaxed ${c.met ? 'text-gray-700' : 'text-gray-600'}`}>{c.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Next steps */}
      {nextSteps && nextSteps.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            {eligible ? 'How to Claim' : 'What You Can Do'}
          </p>
          <ol className="space-y-3">
            {nextSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-700 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Legal note */}
      {legalNote && (
        <div className="bg-blue-50 rounded-xl px-4 py-3">
          <p className="text-xs text-blue-700 leading-relaxed">
            <span className="font-semibold">Legal basis:</span> {legalNote}
          </p>
        </div>
      )}

      {/* Disclaimer */}
      {disclaimer && (
        <p className="text-xs text-gray-400 leading-relaxed px-1">
          <span className="font-medium">Disclaimer:</span> {disclaimer} This tool provides estimates for information purposes only and does not constitute financial or legal advice.
        </p>
      )}

      {/* Restart */}
      <button
        onClick={onRestart}
        className="w-full py-3 border-2 border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-700 font-semibold rounded-xl transition-colors text-sm mt-2"
      >
        ← Check another country
      </button>
    </div>
  )
}
