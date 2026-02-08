import React, { useState } from 'react';
import { Toaster } from 'sonner';
import VerifyTab from './tabs/VerifyTab';
import TrustTab from './tabs/TrustTab';
import AdminIssueTab from './tabs/AdminIssueTab';
import AdminDashboardTab from './tabs/AdminDashboardTab';
import AdminManagementTab from './tabs/AdminManagementTab';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/AdminLogin';
import WalkthroughOverlay from './components/walkthrough/WalkthroughOverlay';
import CommandPalette from './components/ui/CommandPalette';
import BackgroundAnimation from './components/BackgroundAnimation';
import { useKeyboard } from './hooks/useKeyboard';

function App() {
  // Global State
  const [session, setSession] = useState(null); // { adminId: string, name: string } | null
  const [activePublicTab, setActivePublicTab] = useState('verify');
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard');
  const [showLogin, setShowLogin] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  // Keyboard shortcuts
  useKeyboard((action) => {
    if (action === 'command-palette') {
      setShowCommandPalette(true);
    } else if (action === 'escape') {
      setShowCommandPalette(false);
    }
  });

  // Handlers
  const handleLogin = (adminData) => {
    setSession(adminData);
    setShowLogin(false);
    setActiveAdminTab('dashboard');
  };

  const handleLogout = () => {
    setSession(null);
    setShowLogin(false);
    setActivePublicTab('verify');
  };

  const handleCommand = (action) => {
    switch (action) {
      case 'verify':
        setActivePublicTab('verify');
        setShowLogin(false);
        setSession(null);
        break;
      case 'issue':
        if (session) {
          setActiveAdminTab('issue');
        } else {
          setShowLogin(true);
        }
        break;
      case 'admin':
        setShowLogin(true);
        break;
      default:
        break;
    }
  };

  // 1. Login Screen
  if (showLogin) {
    return (
      <>
        <BackgroundAnimation />
        <div className="relative z-10 min-h-screen flex flex-col">
          <Toaster position="top-right" richColors />
          <CommandPalette
            isOpen={showCommandPalette}
            onClose={() => setShowCommandPalette(false)}
            onCommand={handleCommand}
          />
          <button
            onClick={() => setShowLogin(false)}
            className="absolute top-6 left-6 text-slate-400 hover:text-white flex items-center gap-2 text-sm z-50 transition-colors"
          >
            &larr; Back to Public Verification
          </button>
          <AdminLogin onLogin={handleLogin} />
        </div>
      </>
    );
  }

  // 2. Admin Mode
  if (session) {
    return (
      <>
        <BackgroundAnimation />
        <div className="relative z-10 min-h-screen flex flex-col">
          <Toaster position="top-right" richColors />
          <CommandPalette
            isOpen={showCommandPalette}
            onClose={() => setShowCommandPalette(false)}
            onCommand={handleCommand}
          />
          <AdminLayout
            activeTab={activeAdminTab}
            setActiveTab={setActiveAdminTab}
            onLogout={handleLogout}
            adminName={session.name}
          >
            {activeAdminTab === 'dashboard' && <AdminDashboardTab adminId={session.adminId} />}
            {activeAdminTab === 'issue' && <AdminIssueTab adminId={session.adminId} />}
            {activeAdminTab === 'admins' && <AdminManagementTab adminId={session.adminId} />}
          </AdminLayout>
        </div>
      </>
    );
  }

  // 3. Public Mode
  return (
    <>
      <BackgroundAnimation />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Toaster position="top-right" richColors />
        <WalkthroughOverlay />
        <CommandPalette
          isOpen={showCommandPalette}
          onClose={() => setShowCommandPalette(false)}
          onCommand={handleCommand}
        />
        <PublicLayout
          activeTab={activePublicTab}
          setActiveTab={setActivePublicTab}
          onAdminLoginClick={() => setShowLogin(true)}
        >
          {activePublicTab === 'verify' && <VerifyTab />}
          {activePublicTab === 'trust' && <TrustTab />}
        </PublicLayout>
      </div>
    </>
  );
}

export default App;
