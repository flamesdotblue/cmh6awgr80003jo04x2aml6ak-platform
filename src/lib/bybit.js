const BASE = 'https://api.bybit.com';

export async function fetchTicker(symbol) {
  const url = `${BASE}/v5/market/tickers?category=linear&symbol=${encodeURIComponent(symbol)}`;
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error('ticker fetch failed');
  const data = await res.json();
  const item = data?.result?.list?.[0];
  return item ? { lastPrice: item.lastPrice } : null;
}

export async function fetchKlines(symbol, interval = '5', limit = 30) {
  const url = `${BASE}/v5/market/kline?category=linear&symbol=${encodeURIComponent(symbol)}&interval=${interval}&limit=${limit}`;
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error('kline fetch failed');
  const data = await res.json();
  const list = data?.result?.list || [];
  const closes = list.map((row) => Number(row[4]));
  return closes.reverse();
}
