'use client';

import { logoutClient } from '@/app/api/client/auth/auth-client';

export function LogoutButton() {
  const handleLogout = async () => {
    await logoutClient('/'); // redirects to landing page, NOT /app/login
  };

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center gap-2 bg-white/5 border border-[rgba(255,255,255,0.08)] text-[#dfe3e9] hover:bg-white/10 px-6 py-2.5 rounded-full font-[Space_Grotesk] text-[14px] font-medium transition-all duration-200 active:scale-95 cursor-pointer"
    >
      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
        logout
      </span>
      Logout
    </button>
  );
}
