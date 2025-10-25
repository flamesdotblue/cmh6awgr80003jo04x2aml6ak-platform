import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SignalList from './components/SignalList';

export default function App() {
  const [lastRefreshedAt, setLastRefreshedAt] = useState(null);

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <div className="fixed inset-0 -z-0">
        <Hero />
      </div>
      <div className="relative z-10 bg-gradient-to-b from-black/40 via-black/70 to-black/90 pointer-events-none" />
      <div className="relative z-10">
        <Header onRefreshed={(t) => setLastRefreshedAt(t)} lastRefreshedAt={lastRefreshedAt} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SignalList onRefreshed={(t) => setLastRefreshedAt(t)} />
        </main>
        <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-xs text-white/60">
          <p>Educational experimental tool using Bybit public market data. Not financial advice. Futures trading involves significant risk.</p>
        </footer>
      </div>
    </div>
  );
}
