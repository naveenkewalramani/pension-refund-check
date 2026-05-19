import { COUNTRIES } from '../data/countries'

export default function CountrySelect({ onSelect }) {
  return (
    <div className="animate-slide-in">
      {/* Hero */}
      <div className="text-center mb-8 pt-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
          Are you eligible for a<br className="hidden sm:block" /> pension refund?
        </h1>
        <p className="text-gray-500 text-base max-w-md mx-auto">
          Millions of people who worked abroad have unclaimed pension contributions. Check your eligibility for free — takes under 2 minutes.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {['✓ 100% free, no signup', '✓ Based on official regulations', '✓ Instant estimate'].map((t) => (
            <span key={t} className="text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Country cards */}
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 text-center">
        Select the country where you worked
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {COUNTRIES.map((country) => (
          <button
            key={country.id}
            onClick={() => onSelect(country)}
            className="group bg-white border-2 border-gray-100 rounded-2xl p-5 text-left hover:border-blue-400 hover:shadow-md transition-all duration-200 focus:outline-none focus:border-blue-500"
          >
            <div className="flex items-start gap-3">
              <span className="text-4xl leading-none">{country.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-900 text-base">{country.name}</p>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-xs font-medium text-blue-600 mt-0.5">{country.tagline}</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{country.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        This tool provides estimates only. Consult a professional for personalised advice.
      </p>
    </div>
  )
}
