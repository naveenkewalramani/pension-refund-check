export default function ProgressBar({ progress, country }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
          {country && (
            <>
              <span>{country.flag}</span>
              <span>{country.name}</span>
            </>
          )}
        </div>
        <span className="text-xs text-gray-400">{progress}%</span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
