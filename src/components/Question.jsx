import { useState } from 'react'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function yearRange() {
  const y = new Date().getFullYear()
  const years = []
  for (let i = y; i >= y - 15; i--) years.push(i)
  return years
}

export default function Question({ question, answer, onAnswerAndContinue, onBack, isFirst, questionNumber, totalQuestions }) {
  const [highlighted, setHighlighted] = useState(answer ?? null)
  const [numberValue, setNumberValue] = useState(answer != null ? String(answer) : '')
  const [monthYear, setMonthYear] = useState(answer ?? { month: '', year: '' })

  function handleRadio(value) {
    setHighlighted(value)
    setTimeout(() => onAnswerAndContinue(value), 380)
  }

  function handleNumberContinue() {
    const n = Number(numberValue)
    if (!numberValue || isNaN(n) || n < (question.min ?? 1)) return
    onAnswerAndContinue(n)
  }

  function handleMonthYearContinue() {
    if (!monthYear.month || !monthYear.year) return
    onAnswerAndContinue({ month: Number(monthYear.month), year: Number(monthYear.year) })
  }

  const canContinueNumber =
    numberValue !== '' && !isNaN(Number(numberValue)) && Number(numberValue) >= (question.min ?? 1)
  const canContinueMonthYear = monthYear.month && monthYear.year

  return (
    <div className="animate-slide-in">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Question {questionNumber} of {totalQuestions}
      </p>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2 leading-snug">{question.question}</h2>
        {question.hint && (
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">{question.hint}</p>
        )}

        {/* ── Radio ── */}
        {question.type === 'radio' && (
          <div className="space-y-3">
            {question.options.map((opt) => (
              <button
                key={String(opt.value)}
                onClick={() => handleRadio(opt.value)}
                disabled={highlighted !== null && highlighted !== opt.value}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-150 focus:outline-none ${
                  highlighted === opt.value
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300 text-gray-800 disabled:opacity-40'
                }`}
              >
                <span className="font-medium text-sm sm:text-base">{opt.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* ── Number ── */}
        {question.type === 'number' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {question.unit && (
                <span className="text-base font-semibold text-gray-400 w-12 text-right shrink-0">
                  {question.unit}
                </span>
              )}
              <input
                type="number"
                value={numberValue}
                onChange={(e) => setNumberValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNumberContinue()}
                placeholder={question.placeholder}
                min={question.min}
                max={question.max}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-lg font-semibold text-gray-900 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
            <button
              onClick={handleNumberContinue}
              disabled={!canContinueNumber}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Continue →
            </button>
          </div>
        )}

        {/* ── Month / Year ── */}
        {question.type === 'monthYear' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Month</label>
                <select
                  value={monthYear.month}
                  onChange={(e) => setMonthYear((v) => ({ ...v, month: e.target.value }))}
                  className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none transition-colors bg-white"
                >
                  <option value="">Month</option>
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i + 1}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Year</label>
                <select
                  value={monthYear.year}
                  onChange={(e) => setMonthYear((v) => ({ ...v, year: e.target.value }))}
                  className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none transition-colors bg-white"
                >
                  <option value="">Year</option>
                  {yearRange().map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={handleMonthYearContinue}
              disabled={!canContinueMonthYear}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Continue →
            </button>
          </div>
        )}
      </div>

      <button
        onClick={onBack}
        className="mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {isFirst ? 'Change country' : 'Back'}
      </button>
    </div>
  )
}
