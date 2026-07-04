'use client';

import { SheetCard, SectionHeading, SettingsRow, Toggle } from './settings-primitives';

export function AccountSection() {
  return (
    <SheetCard id="account">
      <SectionHeading>Account &amp; Security</SectionHeading>

      <div className="space-y-0">
        <SettingsRow label="Password Management" description="Last changed 3 months ago">
          <button
            className="text-[#5b060c] text-[14px] font-semibold border border-[#5b060c] px-4 py-2 rounded-lg hover:bg-[#5b060c]/5 transition-colors"
            style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
            onClick={() => alert('Change password (placeholder)')}
          >
            Update Password
          </button>
        </SettingsRow>

        <SettingsRow
          label="Two-Factor Authentication"
          description="Secure your account with SMS or Authenticator App"
        >
          <div className="flex items-center gap-3">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{
                background: '#ffc641',
                color: '#261a00',
                fontFamily: 'Hanken Grotesk, sans-serif',
              }}
            >
              ENABLED
            </span>
            <Toggle on={true} />
          </div>
        </SettingsRow>

        <SettingsRow
          label="Verified Email Identity"
          description="Your primary email has been formally verified"
          bordered={false}
        >
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-green-600"
              style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <span
              className="text-[13px] text-[#564240]"
              style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}
            >
              active
            </span>
          </div>
        </SettingsRow>
      </div>
    </SheetCard>
  );
}
