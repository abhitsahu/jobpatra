import Link from 'next/link';
import { Container } from '../ui/container';

export function Footer() {
  return (
    <footer className="w-full py-20 bg-[#0a0f13] border-t border-[rgba(255,255,255,0.08)]">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span
                className="material-symbols-outlined text-[#1a91f0] text-2xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                bolt
              </span>
              <span className="font-[Space_Grotesk] text-[20px] font-bold text-[#dfe3e9]">
                JobPatra
              </span>
            </div>
            <p className="font-[Inter] text-[16px] text-[#bfc7d4] max-w-sm">
              © 2026 JobPatra. Precision engineered for professionals.
            </p>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <h4 className="font-[Space_Grotesk] text-[12px] tracking-[0.1em] font-semibold text-[#dfe3e9] uppercase mb-2">
              Legal
            </h4>
            <Link
              href="/privacy"
              className="font-[Inter] text-[16px] text-[#bfc7d4] hover:text-[#1a91f0] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="font-[Inter] text-[16px] text-[#bfc7d4] hover:text-[#1a91f0] transition-colors"
            >
              Terms of Service
            </Link>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-3">
            <h4 className="font-[Space_Grotesk] text-[12px] tracking-[0.1em] font-semibold text-[#dfe3e9] uppercase mb-2">
              Support
            </h4>
            <Link
              href="/help"
              className="font-[Inter] text-[16px] text-[#bfc7d4] hover:text-[#1a91f0] transition-colors"
            >
              Help Center
            </Link>
            <Link
              href="/contact"
              className="font-[Inter] text-[16px] text-[#bfc7d4] hover:text-[#1a91f0] transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
