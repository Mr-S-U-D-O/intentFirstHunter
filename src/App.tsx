import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthGate } from './components/AuthProvider';
import { DataProvider } from './components/DataProvider';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { ScraperView } from './components/ScraperView';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { LogsView } from './components/LogsView';
import { ClientPortal } from './components/ClientPortal';
import { CRMView } from './components/CRMView';
import { ChatManager } from './components/ChatManager';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LandingPage } from './components/public/LandingPage';
import { MagicCursor } from './components/ui/smooth-cursor';
import { Toaster } from './components/ui/toast';

function GlobalProviders({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <MagicCursor />
      <Toaster />
      {children}
    </TooltipProvider>
  );
}

export default function App() {
  const hostname = window.location.hostname;
  
  const isPortal = hostname.startsWith('portal.');
  const isHQ = hostname.startsWith('hq.');
  const isPublic = hostname === 'bepreemptly.com' || hostname === 'www.bepreemptly.com' || (!isPortal && !isHQ && hostname === 'localhost');
  
  if (isPublic && !isPortal && !isHQ) {
    return (
      <GlobalProviders>
        <LandingPage />
      </GlobalProviders>
    );
  }

  return (
    <AuthProvider>
      <DataProvider>
        <GlobalProviders>
          <BrowserRouter>
            <Routes>
              <Route path="/portal/:token" element={<ClientPortal />} />
              <Route path="/:token" element={<ClientPortal />} />
              <Route path="/" element={<AuthGate><Layout /></AuthGate>}>
                <Route index element={<Home />} />
                <Route path="scraper/:id" element={<ScraperView />} />
                <Route path="privacy" element={<PrivacyPolicy />} />
                <Route path="logs" element={<LogsView />} />
                <Route path="crm" element={<CRMView />} />
                <Route path="inbox" element={<ChatManager />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </GlobalProviders>
      </DataProvider>
    </AuthProvider>
  );
}
