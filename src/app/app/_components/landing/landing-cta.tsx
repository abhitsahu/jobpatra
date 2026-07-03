import Link from 'next/link';

export function LandingCta() {
  return (
    <section className="py-24 px-4 md:px-16">
      <div className="max-w-4xl mx-auto bg-[#7a1f1f] p-10 md:p-16 rounded-3xl text-center relative overflow-hidden shadow-xl">
        {/* Decorative Envelope Flap */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[100px] border-l-transparent border-r-[100px] border-r-transparent border-t-[50px] border-t-[#FFF8F6] opacity-10" />

        <h2 className="font-['Playfair_Display'] text-[32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.02em] font-bold text-white mb-6 relative z-10 leading-tight">
          Ready to Send Your <br />
          Next Opportunity?
        </h2>

        <p className="text-[#ff8b85] font-['Hanken_Grotesk'] text-[18px] leading-[28px] mb-10 max-w-lg mx-auto relative z-10">
          Seal your success today. Join 50,000+ professionals who trust JobPatra for their most
          important career introductions.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
          <Link
            href="/app/signup"
            className="bg-[#ba1a1a] text-white px-10 py-5 rounded-xl font-['Hanken_Grotesk'] text-[14px] leading-[20px] tracking-[0.05em] font-semibold hover:bg-red-800 transition-colors shadow-lg flex items-center justify-center gap-3"
          >
            Draft Your Letter Now <span className="material-symbols-outlined">send</span>
          </Link>
        </div>

        {/* Background Grain/Texture */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://www.transparenttextures.com/patterns/natural-paper.png')",
          }}
        />
      </div>
    </section>
  );
}
