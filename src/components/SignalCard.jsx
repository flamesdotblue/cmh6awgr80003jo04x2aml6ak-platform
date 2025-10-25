import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

function formatNumber(n, p = 2) {
  if (n === null || n === undefined || Number.isNaN(n)) return '-';
  return Number(n).toLocaleString(undefined, { maximumFractionDigits: p, minimumFractionDigits: 0 });
}

export default function SignalCard({ signal }) {
  const up = signal.side === 'LONG';
  const color = up ? 'from-emerald-500/20 to-transparent border-emerald-400/30' : 'from-rose-500/20 to-transparent border-rose-400/30';

  return (
    <div className={`rounded-xl border ${color} bg-white/5 backdrop-blur p-4 relative overflow-hidden`}> 
      <div className="absolute inset-0 bg-gradient-to-tr opacity-60 pointer-events-none" />
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex items-start gap-3">
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${up ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
            {up ? <ArrowUpRight className="h-5 w-5 text-emerald-300" /> : <ArrowDownRight className="h-5 w-5 text-rose-300" />}
          </div>
          <div>
            <div className="text-sm text-white/60">Current Coin Live Market Price (Bybit)</div>
            <div className="text-xl font-semibold">{signal.symbol} · ${formatNumber(signal.price, signal.priceDP)}</div>
            <div className={`text-xs mt-1 ${up ? 'text-emerald-300' : 'text-rose-300'}`}>{signal.side} {signal.symbol}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:border-l md:border-white/10 md:pl-4">
          <div>
            <div className="text-xs text-white/60">Recommended Amount</div>
            <div className="text-sm">${formatNumber(signal.recommendedAmount)} · {signal.leverage}x</div>
          </div>
          <div>
            <div className="text-xs text-white/60">Capital Used</div>
            <div className="text-sm">${formatNumber(signal.capitalUsed)}</div>
          </div>
          <div>
            <div className="text-xs text-white/60">Profit Target</div>
            <div className="text-sm">${formatNumber(signal.profitTargetUSDT)}</div>
          </div>
          <div>
            <div className="text-xs text-white/60">Risk Amount</div>
            <div className="text-sm">${formatNumber(signal.riskAmountUSDT)}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 md:border-l md:border-white/10 md:pl-4">
          <div>
            <div className="text-xs text-white/60">Entry</div>
            <div className="text-sm">${formatNumber(signal.entry, signal.priceDP)}</div>
          </div>
          <div>
            <div className="text-xs text-white/60">Take Profit</div>
            <div className="text-sm">${formatNumber(signal.takeProfit, signal.priceDP)}</div>
          </div>
          <div>
            <div className="text-xs text-white/60">Stop Loss</div>
            <div className="text-sm">${formatNumber(signal.stopLoss, signal.priceDP)}</div>
          </div>
        </div>

        <div className="md:border-l md:border-white/10 md:pl-4 flex flex-col justify-between">
          <div>
            <div className="text-xs text-white/60">Reasoning</div>
            <div className="text-sm text-white/90">{signal.reasoning}</div>
          </div>
          <div className="text-[10px] text-white/50 mt-3">Execution-focused format. Use at your own risk. Slippage and funding may affect results.</div>
        </div>
      </div>
    </div>
  );
}
