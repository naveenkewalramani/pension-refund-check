export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
      <div className="max-w-2xl mx-auto px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💶</span>
          <span className="font-bold text-lg tracking-tight">PensionRefund.io</span>
        </div>
        <span className="text-blue-200 text-sm hidden sm:block">Free · No signup · 2 minutes</span>
      </div>
    </header>
  )
}
