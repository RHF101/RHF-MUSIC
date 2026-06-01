import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { PlayerBar } from './PlayerBar';
import { RightPanel } from './RightPanel';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rightPanel, setRightPanel] = useState<'queue' | 'lyrics' | null>(null);

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background text-foreground selection:bg-primary/30">
      <Sidebar />
      <main 
        className={`flex-1 relative transition-all duration-300 ${
          rightPanel ? 'mr-[300px]' : 'mr-0'
        } ml-[220px] pb-[90px] h-full overflow-y-auto custom-scrollbar`}
      >
        <div className="min-h-full">
          {children}
        </div>
      </main>
      <RightPanel panel={rightPanel} />
      <PlayerBar onToggleRightPanel={setRightPanel} activeRightPanel={rightPanel} />
    </div>
  );
};
