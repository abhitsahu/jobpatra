'use client';

import { useRef, useCallback } from 'react';

const testimonials = [
  {
    postmark: 'NYC',
    year: '2024',
    quote:
      'The AI suggestions felt less like a machine and more like a seasoned mentor guiding my hand. I landed my role at Google within two weeks.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDsYZMNKnqAoqlqGoyVYRvG20yCRnA_T-Tjf4QtWyDHOoVGqVe0CVl3bmFJ6h6iHPHuyfHUpMgFnKBPn8FqLOnKgPAuZtB5_MyzPGYB8ypDeaixkhC0jr4OQBjTLh_VIANk4NuSCdx82b4eaRszTbR_hyG2zKbB1SzUnZjx_1hu-GVuEaOTe6hNH4WPNRfYk_Jji7_1d9UBQpiLZS5m6zz93H8FWROW-TxuO7hUF-VoBvyOfROWjTW3ssy7bJLqpIZ6bUIFmTkMPPsj',
    name: 'Sarah Jenkins',
    role: 'Senior Product Designer',
    rotation: '-rotate-1',
    hoverRotation: 'rotate(0deg)',
    restRotation: 'rotate(-1deg)',
  },
  {
    postmark: 'LON',
    year: '2024',
    quote:
      'The tactile interface makes resume building feel like an art. It\u2019s the most sophisticated career tool I have used in 15 years.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBUHmPKl912_-M-7vbvajI2Tf8Yp0uruPquhZniW9itMdx2GRfl9EyRpEmWMnb9DrOLcL-HPfMDsPFqIDb-yZN9EoqsEbLN2JasZVA1jjYMw0Vy3BwKg6go5KcS2Ga4-79aibnHQQJIz167I3iSi8PiuDtpdNBqiRbTXBAFnhZ3GpjvuGlOqScLitiPgGWMYd4idZRGTtbzeIBCHIIIFl8dEheHg7zcYTjSeK_nA7bl-hJQReFvTe1WQrNr1RkhG-jX9dohinMI0p-Y',
    name: 'David Sterling',
    role: 'Engineering Director',
    rotation: 'rotate-2',
    hoverRotation: 'rotate(0deg)',
    restRotation: 'rotate(2deg)',
  },
];

export function LandingTestimonials() {
  return (
    <section className="py-24 bg-[#FFF8F6]">
      <div className="max-w-7xl mx-auto px-4 md:px-16">
        <h2 className="font-['Playfair_Display'] text-[32px] leading-[40px] font-semibold text-[#2b1611] text-center mb-16 italic">
          Words of Recommendation
        </h2>

        <div className="flex flex-wrap justify-center gap-12">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  postmark,
  year,
  quote,
  image,
  name,
  role,
  rotation,
  hoverRotation,
  restRotation,
}: (typeof testimonials)[number]) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleEnter = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = `translateY(-10px) ${hoverRotation}`;
    el.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    el.style.boxShadow = '0 20px 40px rgba(78, 52, 46, 0.08)';
  }, [hoverRotation]);

  const handleLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = `translateY(0) ${restRotation}`;
    el.style.boxShadow = '0 4px 20px rgba(78, 52, 46, 0.04)';
  }, [restRotation]);

  return (
    <div
      ref={cardRef}
      className={`landing-paper-sheet max-w-sm p-10 transform ${rotation}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-10 h-10 border border-[#ddc0bd] bg-[#ffe9e4] flex items-center justify-center">
          <span className="text-[8px] font-bold text-[#8a716f]">{postmark}</span>
        </div>
        <span className="font-['Hanken_Grotesk'] text-[12px] leading-[16px] font-medium text-[#8a716f] uppercase tracking-widest">
          Postmark {year}
        </span>
      </div>

      <p className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold text-[#564240] italic mb-8 leading-relaxed">
        &ldquo;{quote}&rdquo;
      </p>

      <div className="flex items-center gap-4 border-t border-[#ddc0bd] pt-6">
        <div className="w-12 h-12 rounded-full bg-[#ffe9e4] overflow-hidden flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="font-bold text-[#5b060c] font-['Hanken_Grotesk'] text-[16px]">{name}</div>
          <div className="font-['Hanken_Grotesk'] text-[12px] leading-[16px] font-medium text-[#564240] uppercase">
            {role}
          </div>
        </div>
      </div>
    </div>
  );
}
