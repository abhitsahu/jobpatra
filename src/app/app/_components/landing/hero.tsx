import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Container } from '../ui/container';

interface HeroProps {
  isLoggedIn: boolean;
}

export function Hero({ isLoggedIn }: HeroProps) {
  return (
    <section className="relative z-10 pt-24">
      <Container className="py-20 min-h-[870px] flex flex-col lg:flex-row items-center justify-between gap-12">
        {/*  Left: copy  */}
        <div className="lg:w-1/2 flex flex-col gap-6 items-start">
          <Badge icon="auto_awesome">AI-Powered Precision</Badge>

          <h1 className="font-[Space_Grotesk] text-[32px] md:text-[72px] md:leading-[80px] md:tracking-[-0.04em] font-bold text-[#dfe3e9] leading-tight">
            Build ATS Optimized <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a91f0] to-[#a0caff]">
              Resumes with AI
            </span>
          </h1>

          <p className="font-[Inter] text-[18px] leading-[28px] text-[#bfc7d4] max-w-xl">
            Land more interviews with surgically precise resumes. Our AI analyzes job descriptions
            and tailors your experience to bypass Applicant Tracking Systems with maximum impact.
          </p>

          {/* CTAs — conditional */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
            {isLoggedIn ? (
              <Button href="/app/dashboard" variant="primary">
                Go to Dashboard
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  arrow_forward
                </span>
              </Button>
            ) : (
              <>
                <Button href="/app/signup" variant="primary">
                  Get Started
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                    rocket_launch
                  </span>
                </Button>
                <Button href="/app/login" variant="secondary">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                    radar
                  </span>
                  Check ATS Score
                </Button>
              </>
            )}
          </div>
        </div>

        {/*  Right: mock resume visual  */}
        <div className="lg:w-1/2 relative h-[500px] w-full flex items-center justify-center">
          {/* Main mock resume card */}
          <div className="absolute w-[320px] h-[420px] bg-[#171c20]/80 backdrop-blur-2xl border border-[rgba(255,255,255,0.08)] rounded-xl shadow-2xl p-6 flex flex-col gap-4 hover:-translate-y-2 transition-transform duration-500">
            {/* Card header */}
            <div className="flex items-center gap-4 border-b border-[rgba(255,255,255,0.08)] pb-4">
              <div className="w-12 h-12 rounded-full bg-[#1b2024] flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[#bfc7d4]">person</span>
              </div>
              <div className="flex-1">
                <div className="h-3 w-24 bg-[#30353a] rounded mb-2" />
                <div className="h-2 w-16 bg-[#1b2024] rounded" />
              </div>
            </div>

            {/* Skeleton lines */}
            <div className="space-y-3">
              <div className="h-2 w-full bg-[#1b2024] rounded" />
              <div className="h-2 w-5/6 bg-[#1b2024] rounded" />
              <div className="h-2 w-4/6 bg-[#1b2024] rounded" />
            </div>

            {/* Card footer */}
            <div className="mt-auto pt-4 border-t border-[rgba(255,255,255,0.08)] flex justify-between items-center">
              <span className="font-[Space_Grotesk] text-[12px] font-semibold text-[#a0caff]">
                Senior Developer
              </span>
              <div className="h-4 w-12 bg-[#a0caff]/20 rounded-full flex justify-center items-center">
                <span className="font-[Space_Grotesk] text-[10px] text-[#a0caff]">MATCH</span>
              </div>
            </div>
          </div>

          {/* Floating AI suggestion widget */}
          <div className="absolute top-10 right-0 lg:-right-4 xl:right-4 w-[220px] bg-[#262b2f]/90 backdrop-blur-3xl border border-[#a855f7]/50 rounded-lg p-4 shadow-[0_0_30px_rgba(168,85,247,0.15)] z-20 translate-y-[-20px]">
            <div className="flex items-start gap-3">
              <span
                className="material-symbols-outlined text-[#a855f7] animate-pulse flex-shrink-0"
                style={{ fontSize: '20px' }}
              >
                auto_awesome
              </span>
              <div>
                <p className="font-[Space_Grotesk] text-[12px] tracking-[0.1em] font-semibold text-[#a855f7] mb-1 uppercase">
                  AI Suggestion
                </p>
                <p className="text-[12px] text-[#bfc7d4] leading-relaxed">
                  Quantify your impact. Try: &ldquo;Reduced load times by 40% using Redis
                  caching.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Floating ATS score badge */}
          <div className="absolute bottom-16 left-0 lg:-left-8 bg-[#0a0f13]/90 backdrop-blur-xl border border-[#1a91f0]/30 rounded-full py-2 px-4 shadow-[0_0_20px_rgba(26,145,240,0.2)] z-20 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#1a91f0] flex items-center justify-center flex-shrink-0">
              <span className="font-[Space_Grotesk] text-[10px] font-bold text-[#1a91f0]">94%</span>
            </div>
            <span className="font-[Space_Grotesk] text-[14px] font-medium text-[#dfe3e9]">
              ATS Score
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
