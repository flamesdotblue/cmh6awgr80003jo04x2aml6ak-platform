import { RefreshCw, Rocket } from 'lucide-react';

export default function Header({ onRefreshed, lastRefreshedAt }) {
  return (
    <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
          <Rocket className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-medium">Live Bybit Signals</h2>
          <p className="text-xs text-white/60">Targets sized for 100%+ potential via leverage, with tight risk controls</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => onRefreshed?.(Date.now())}
          className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 transition"
        >
          <RefreshCw className="h-4 w-4" /> Manual Refresh
        </button>
        <div className="text-xs text-white/60">
          {lastRefreshedAt ? `Last refresh: ${new Date(lastRefreshedAt).toLocaleTimeString()}` : 'Waiting for first update...'}
        </div>
      </div>
    </header>
  );
}
