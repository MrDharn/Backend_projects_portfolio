export default function Header({ activeTab, setActiveTab, hasToken }) {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="font-mono font-bold text-slate-100 tracking-tight">
            backend.dev<span className="text-emerald-400">/api</span>
          </span>
        </div>

        <nav className="flex items-center gap-2 font-mono text-sm">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'portfolio'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Public Showcase
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'admin'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Admin Portal {hasToken && '🔒'}
          </button>
        </nav>
      </div>
    </header>
  );
}