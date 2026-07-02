export function LandingFeatures() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-16">
        <div className="text-center mb-16">
          <h2 className="font-['Playfair_Display'] text-[32px] leading-[40px] font-semibold text-[#2b1611] mb-4">
            The Digital Ledger Suite
          </h2>
          <p className="text-[#564240] max-w-xl mx-auto font-['Hanken_Grotesk']">
            Modern tools for the professional historian. Every feature is designed to elevate your story from a record to a legacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-2xl border border-[#ddc0bd] shadow-sm hover:shadow-md transition-shadow relative group">
            <div className="w-12 h-12 bg-[#7a1f1f]/10 rounded-lg flex items-center justify-center mb-6 text-[#5b060c]">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
            </div>
            <h3 className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold text-[#2b1611] mb-4">
              Letterpress Layouts
            </h3>
            <p className="text-[#564240] font-['Hanken_Grotesk']">
              Choose from templates that prioritize clarity and tactile elegance over digital clutter. Designed for the human eye.
            </p>
            <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-100 transition-opacity text-[#ddc0bd]">
              <span className="material-symbols-outlined text-4xl">inventory_2</span>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-2xl border border-[#ddc0bd] shadow-sm hover:shadow-md transition-shadow relative group">
            <div className="w-12 h-12 bg-[#ffc641]/30 rounded-lg flex items-center justify-center mb-6 text-[#795900]">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>approval</span>
            </div>
            <h3 className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold text-[#2b1611] mb-4">
              The AI Notary
            </h3>
            <p className="text-[#564240] font-['Hanken_Grotesk']">
              Our AI doesn&apos;t just fill blanks—it verifies your tone, strengthens your verbs, and ensures your narrative is air-tight.
            </p>
            <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-100 transition-opacity text-[#ddc0bd]">
              <span className="material-symbols-outlined text-4xl">history_edu</span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-2xl border border-[#ddc0bd] shadow-sm hover:shadow-md transition-shadow relative group">
            <div className="w-12 h-12 bg-[#ffe9e4] rounded-lg flex items-center justify-center mb-6 text-[#5e0001]">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>assignment</span>
            </div>
            <h3 className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold text-[#2b1611] mb-4">
              ATS Delivery System
            </h3>
            <p className="text-[#564240] font-['Hanken_Grotesk']">
              Precision-engineered formatting ensures your document remains intact through every digital sorting facility on Earth.
            </p>
            <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-100 transition-opacity text-[#ddc0bd]">
              <span className="material-symbols-outlined text-4xl">local_post_office</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
