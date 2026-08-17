import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigationStore } from './lib/navigationStore';
import { AppProvider } from './providers/AppProvider';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { MaintenanceBanner } from './components/common/MaintenanceBanner';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { SafetyPage } from './pages/SafetyPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { DesignSystemShowcase } from './components/common/DesignSystemShowcase';

// Future Module Placeholders
import { ChatPage } from './pages/ChatPage';
import { VideoPage } from './pages/VideoPage';
import { VoicePage } from './pages/VoicePage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { FriendsPage } from './pages/FriendsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { DashboardPage } from './pages/DashboardPage';
import { PremiumPage } from './pages/PremiumPage';
import { AdminPage } from './pages/AdminPage';
import { ReportsPage } from './pages/ReportsPage';
import { SupportPage } from './pages/SupportPage';

function AppContent() {
  const { currentPage } = useNavigationStore();

  // Determine if current page is an app module that displays the left sidebar
  const isModulePage = [
    'dashboard',
    'chat',
    'video',
    'voice',
    'friends',
    'notifications',
    'profile',
    'settings',
    'premium',
    'admin',
    'reports',
    'support',
  ].includes(currentPage);

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'about':
        return <AboutPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'terms':
        return <TermsPage />;
      case 'safety':
        return <SafetyPage />;
      case 'contact':
        return <ContactPage />;
      case 'maintenance':
        return <MaintenancePage />;
      case 'design-system':
        return <DesignSystemShowcase />;
      // App Module Placeholders
      case 'chat':
        return <ChatPage />;
      case 'video':
        return <VideoPage />;
      case 'voice':
        return <VoicePage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      case 'friends':
        return <FriendsPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'premium':
        return <PremiumPage />;
      case 'admin':
        return <AdminPage />;
      case 'reports':
        return <ReportsPage />;
      case 'support':
        return <SupportPage />;
      case 'not-found':
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <MaintenanceBanner />
      <Navbar />

      <div className="flex-1 flex w-full">
        {isModulePage && <Sidebar />}

        <main className="flex-1 w-full min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {!isModulePage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
