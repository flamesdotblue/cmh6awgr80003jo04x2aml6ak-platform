import { useCallback, useEffect, useMemo, useState } from 'react';
import SignalCard from './SignalCard';
import { fetchTicker, fetchKlines } from '../lib/bybit';

const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT'];

function dpForPrice(p) {
  if (!p) return 2;
  if (p >= 10000) return 1;
  if (p >= 1000) return 2;
  if (p >= 100) return 2;
  if (p >= 10) return 3;
  return 4;
}

function genSignalFromData(symbol, price, closes) {
  const last = closes[closes.length - 1];
  const prev = closes[closes.length - 2] ?? last;
  const smaLen = Math.min(9, closes.length);
  const sma = closes.slice(-smaLen).reduce((a, b) => a + b, 0) / smaLen;
  const momentum = last - prev;
  const side = last > sma && momentum > 0 ? 'LONG' : last < sma && momentum < 0 ? 'SHORT' : momentum >= 0 ? 'LONG' : 'SHORT';

  const leverage = 20;
  const entry = price;
  const tp = side === 'LONG' ? entry * 1.05 : entry * 0.95;
  const sl = side === 'LONG' ? entry * (1 - 0.0125) : entry * (1 + 0.0125);

  const capitalUsed = 20;
  const recommendedAmount = 20;
  const profitTargetUSDT = capitalUsed; // 100% potential with 20x on +5% move
  const riskAmountUSDT = 5; // approx 25% risk with -1.25% move at 20x

  const reasoning = side === 'LONG'
    ? 'Momentum up and price above short-term average; seeking +5% move for 100% ROE at 20x.'
    : 'Momentum down and price below short-term average; seeking -5% move for 100% ROE at 20x.';

  const priceDP = dpForPrice(price);

  return {
    symbol,
    side,
    price,
    entry,
    takeProfit: tp,
    stopLoss: sl,
    leverage: `${leverage}x`,
    recommendedAmount,
    profitTargetUSDT,
    riskAmountUSDT,
    capitalUsed,
    reasoning,
    priceDP,
  };
}

export default function SignalList({ onRefreshed }) {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(
        SYMBOLS.map(async (symbol) => {
          const [ticker, kl] = await Promise.all([
            fetchTicker(symbol),
            fetchKlines(symbol, '5', 30),
          ]);
          const price = ticker?.lastPrice ? Number(ticker.lastPrice) : Number(kl?.[kl.length - 1]) || null;
          const closes = kl?.map(Number).filter((n) => Number.isFinite(n)) || [];
          if (!price || closes.length < 3) throw new Error('Data unavailable');
          return genSignalFromData(symbol, price, closes);
        })
      );
      setSignals(results);
      const now = Date.now();
      setLastUpdated(now);
      onRefreshed?.(now);
    } catch (e) {
      setError('Live data fetch failed. Showing simulated signals.');
      const mock = SYMBOLS.map((s, i) => {
        const base = 100 + i * 10;
        const price = base + Math.random() * base * 0.02;
        const closes = Array.from({ length: 20 }, (_, k) => base * (1 + Math.sin((k / 6) + i) * 0.01));
        return genSignalFromData(s, price, closes);
      });
      setSignals(mock);
      const now = Date.now();
      setLastUpdated(now);
      onRefreshed?.(now);
    } finally {
      setLoading(false);
    }
  }, [onRefreshed]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const id = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [load]);

  const headerMeta = useMemo(() => {
    if (!lastUpdated) return 'Updating...';
    return `Signals refreshed ${new Date(lastUpdated).toLocaleTimeString()} · Every 5 minutes`;
  }, [lastUpdated]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-white/70">{headerMeta}</h3>
        <button onClick={load} className="text-xs px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15">Refresh now</button>
      </div>

      {loading && (
        <div className="text-sm text-white/70">Loading live Bybit market data…</div>
      )}
      {error && (
        <div className="text-sm text-amber-300">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {signals.map((s) => (
          <SignalCard key={s.symbol} signal={s} />
        ))}
      </div>
    </section>
  );
}
