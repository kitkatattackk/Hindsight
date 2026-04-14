import React from 'react';

interface MobileShellProps {
  children: React.ReactNode;
}

export default function MobileShell({ children }: MobileShellProps) {
  return (
    <div className="min-h-screen bg-zinc-100 flex justify-center items-center p-0 sm:p-4 md:p-8">
      {/* Mobile Frame */}
      <div className="w-full max-w-[450px] h-[100dvh] sm:h-[850px] sm:max-h-[90vh] bg-brand-yellow flex flex-col relative overflow-hidden sm:rounded-[3rem] sm:border-[8px] sm:border-black sm:shadow-retro-lg">
        {children}
      </div>
    </div>
  );
}
