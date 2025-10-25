import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="w-full h-[48vh] sm:h-[56vh] md:h-[64vh] lg:h-[72vh] xl:h-[78vh] relative overflow-hidden">
      <Spline scene="https://prod.spline.design/44zrIZf-iQZhbQNQ/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/90 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-6 px-6 flex flex-col items-start gap-3">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">Crypto Futures Alpha Signals</h1>
        <p className="text-sm sm:text-base text-white/70 max-w-2xl">Scalping and quick swing execution ideas refreshed every 5 minutes, formatted for instant action.</p>
      </div>
    </section>
  );
}
