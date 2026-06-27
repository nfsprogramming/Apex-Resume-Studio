import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="bg-midnight-slate text-slate-300 font-sans h-screen w-full overflow-hidden flex">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative" data-purpose="main-layout-container">
        {children}
      </main>
    </div>
  );
};

export default Layout;
