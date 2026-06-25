import { Logo } from './logo';

interface AuthLayoutProps {
  children: React.ReactNode;
  alignment?: 'center' | 'top';
}

export function AuthLayout({ children, alignment = 'center' }: AuthLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0b1014] text-[#dfe3e9] selection:bg-[rgba(26,145,240,0.3)] selection:text-white">
      {/*  Left panel: illustration (desktop only)  */}
      <div className="hidden lg:flex lg:w-1/2 h-full relative overflow-hidden bg-[#0a0f13] border-r border-[rgba(255,255,255,0.08)]">
        {/* Background image with AI neural node aesthetic */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDMTfOQNeY6XMdnwmS3RjXeVAvsQg_6pC9Evh0Sp-Wm2-aewifOFBM99sNjx7ndJtQXJPpQsZ50JqZbL6hdT9zkzTQPZ_xu-YmWbUo03sFSijCqbUT9Ny0RLB4NnRasmMd1-rd-3s-nguhXvcITn5cJ6V0BDoQ1xbzGtXWh-63buWdMU5JF2RWmt1xlV69tQV_cIyJmjwADjucDMozDt-UFVPgPIVooUA7C9jXjdFmMHLP2IMQCDoXA77mvtzYAsO7xZkBIQ_DHHNNS')",
          }}
          aria-hidden="true"
        />

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b1014]/80 via-transparent to-[#0b1014]/90" />

        {/* Decorative ambient glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1a91f0]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#a855f7]/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Panel content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Brand */}
          <Logo size="md" />

          {/* Value proposition */}
          <div className="max-w-md">
            <h2 className="font-[Space_Grotesk] text-[48px] leading-[56px] tracking-[-0.02em] font-semibold mb-6">
              Precision engineering for your career trajectory.
            </h2>
            <p className="font-[Inter] text-[18px] leading-[28px] text-[#bfc7d4]">
              Our AI models analyze millions of successful data points to craft resumes that bypass
              ATS filters and demand human attention.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel: auth form  */}
      <div
        className={[
          'w-full lg:w-1/2 h-full overflow-y-auto flex justify-center p-8 sm:p-12 relative',
          alignment === 'top' ? 'items-start' : 'items-center',
        ].join(' ')}
      >
        {/* Mobile subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a91f0]/5 to-transparent lg:hidden pointer-events-none" />

        {/* Auth card — top-alignment adds vertical breathing room above the form */}
        <div
          className={[
            'w-full max-w-[400px] relative z-10',
            alignment === 'top' ? 'py-12' : '',
          ].join(' ')}
        >
          {/* Mobile brand header (hidden on desktop — logo lives in left panel) */}
          <div className="flex items-center justify-center gap-3 mb-12 lg:hidden">
            <Logo size="sm" />
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
