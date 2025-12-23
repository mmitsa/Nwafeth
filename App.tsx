
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Calculator, Wallet, BrainCircuit, Menu, X, Bell, User, Globe, Settings as SettingsIcon, Activity, Search, Building2, Users, Map as MapIcon, GitBranch, Building, Banknote, Briefcase, Shield } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { ValuationTool } from './components/ValuationTool';
import { SmartWallet } from './components/SmartWallet';
import { AIMatching } from './components/AIMatching';
import { AIChatWidget } from './components/AIChatWidget';
import { Settings } from './components/Settings';
import { PropertyMarket } from './components/PropertyMarket';
import { MyListings } from './components/MyListings';
import { PartnersNetwork } from './components/PartnersNetwork';
import { AffiliateNetwork } from './components/AffiliateNetwork';
import { DeveloperDashboard } from './components/DeveloperDashboard';
import { BrokerCenter } from './components/BrokerCenter';
import { AdminDashboard } from './components/AdminDashboard';
import { PayoutSystem } from './components/PayoutSystem';
import { InteractiveMap } from './components/InteractiveMap';
import { AppView, UserRole } from './types';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import clsx from 'clsx';

const AppContent: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { language, setLanguage, t, dir } = useLanguage();
  const { currentUser } = useAuth();

  // Define all nav items
  const allNavItems = [
    { id: AppView.DASHBOARD, label: 'nav.dashboard', icon: LayoutDashboard, roles: ['investor', 'agent', 'admin', 'developer'] },
    { id: AppView.ADMIN_DASHBOARD, label: 'nav.admin', icon: Shield, roles: ['admin'] }, // Super Admin Only
    { id: AppView.BROKER_CENTER, label: 'nav.broker', icon: Briefcase, roles: ['agent', 'admin', 'developer'] }, // Access for Brokers & Developer Sales Teams
    { id: AppView.DEVELOPER, label: 'nav.developer', icon: Building, roles: ['developer', 'admin', 'investor'] },
    { id: AppView.MAP, label: 'nav.map', icon: MapIcon, roles: ['investor', 'agent'] },
    { id: AppView.MARKET, label: 'nav.market', icon: Activity, roles: ['investor', 'agent', 'developer'] },
    { id: AppView.MY_LISTINGS, label: 'nav.mylistings', icon: Building2, roles: ['agent', 'admin', 'investor'] },
    { id: AppView.PARTNERS, label: 'nav.partners', icon: Users, roles: ['agent', 'admin', 'investor', 'developer'] },
    { id: AppView.AFFILIATE, label: 'nav.affiliate', icon: GitBranch, roles: ['agent', 'admin', 'developer', 'investor'] }, 
    { id: AppView.PAYOUTS, label: 'nav.payouts', icon: Banknote, roles: ['agent', 'developer', 'admin', 'investor'] },
    { id: AppView.VALUATION, label: 'nav.valuation', icon: Calculator, roles: ['investor', 'agent'] },
    { id: AppView.WALLET, label: 'nav.wallet', icon: Wallet, roles: ['investor'] },
    { id: AppView.MATCHING, label: 'nav.matching', icon: BrainCircuit, roles: ['investor', 'agent'] },
  ];

  // Filter items based on user role
  const navItems = allNavItems.filter(item => item.roles.includes(currentUser.role));

  // Redirect if current view is not allowed for the new role
  useEffect(() => {
    const isAllowed = navItems.find(item => item.id === activeView) || activeView === AppView.SETTINGS;
    
    // Force redirect logic if on a restricted page
    if (!isAllowed) {
      if (currentUser.role === 'agent') {
        setActiveView(AppView.BROKER_CENTER);
      } else if (currentUser.role === 'developer') {
        setActiveView(AppView.DEVELOPER);
      } else if (currentUser.role === 'admin') {
        setActiveView(AppView.ADMIN_DASHBOARD);
      } else {
        setActiveView(AppView.DASHBOARD);
      }
    }
  }, [currentUser.role, activeView, navItems]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const renderContent = () => {
    switch (activeView) {
      case AppView.DASHBOARD:
        return <Dashboard />;
      case AppView.ADMIN_DASHBOARD:
        return <AdminDashboard />;
      case AppView.DEVELOPER:
        return <DeveloperDashboard />;
      case AppView.BROKER_CENTER:
        return <BrokerCenter />;
      case AppView.MARKET:
        return <PropertyMarket />;
      case AppView.MY_LISTINGS:
        return <MyListings />;
      case AppView.PARTNERS:
        return <PartnersNetwork />;
      case AppView.AFFILIATE:
        return <AffiliateNetwork />;
      case AppView.PAYOUTS:
        return <PayoutSystem />;
      case AppView.MAP:
        return <InteractiveMap />;
      case AppView.VALUATION:
        return <ValuationTool />;
      case AppView.WALLET:
        return <SmartWallet />;
      case AppView.MATCHING:
        return <AIMatching />;
      case AppView.SETTINGS:
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar for Desktop */}
      <aside className={clsx(
        "fixed inset-y-0 z-50 w-72 bg-[#0f172a] text-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : (dir === 'rtl' ? "translate-x-full" : "-translate-x-full"),
        dir === 'rtl' ? "right-0" : "left-0"
      )}>
        {/* Logo Area */}
        <div className="h-20 flex items-center px-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/30">
              N
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">Nawafiz</span>
              <span className="text-[10px] block text-gray-400 uppercase tracking-wider">Real Estate AI</span>
            </div>
          </div>
          <button onClick={toggleSidebar} className="ml-auto lg:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-5rem)] justify-between p-4">
          <nav className="space-y-1.5">
            <div className="px-4 py-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('nav.platform')}</p>
            </div>
            
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={clsx(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                    isActive 
                      ? "bg-brand-600 text-white shadow-lg shadow-brand-900/20" 
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon size={20} className={clsx("transition-colors", isActive ? "text-white" : "text-gray-400 group-hover:text-white")} />
                  <span className="relative z-10">{t(item.label)}</span>
                  {isActive && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-full h-full animate-shimmer" />}
                </button>
              );
            })}
            
            <div className="pt-4 mt-4 border-t border-white/10">
              <div className="px-4 py-2">
                 <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">System</p>
              </div>
              <button
                onClick={() => {
                  setActiveView(AppView.SETTINGS);
                  setIsSidebarOpen(false);
                }}
                className={clsx(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  activeView === AppView.SETTINGS
                    ? "bg-brand-600 text-white shadow-lg" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <SettingsIcon size={20} className={clsx(activeView === AppView.SETTINGS ? "text-white" : "text-gray-400")} />
                {t('nav.settings')}
              </button>
            </div>
          </nav>

          {/* User Profile Snippet */}
          <div className="mt-auto pt-4 border-t border-white/10">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-500 to-brand-300 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {currentUser.avatar}
              </div>
              <div className="overflow-hidden text-start">
                <p className="text-sm font-semibold text-white truncate">{currentUser.name}</p>
                <p className="text-[10px] text-gray-400 truncate uppercase tracking-wider">{currentUser.role} Access</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-secondary-50">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 h-20 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4 lg:hidden">
            <button onClick={toggleSidebar} className="text-gray-500 hover:text-brand-600 transition-colors">
              <Menu size={24} />
            </button>
            <span className="font-bold text-gray-900">Nawafiz</span>
          </div>

          {/* Search Bar (Visual Only) - Hidden in MAP view as it has its own */}
          {activeView !== AppView.MAP ? (
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full border border-transparent focus-within:border-brand-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-100 transition-all w-96">
                <Search size={18} className="text-gray-400" />
                <input 
                type="text" 
                placeholder={t('chat.placeholder')} 
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400"
                />
            </div>
          ) : (
            <div className="hidden md:block text-lg font-bold text-gray-800">{t('nav.map')}</div>
          )}

          <div className="flex flex-1 justify-end items-center gap-3 md:gap-5">
            
            {/* Language Switcher */}
            <button 
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-700 transition-all text-xs font-bold uppercase tracking-wide shadow-sm"
            >
              <Globe size={14} />
              {language === 'en' ? 'العربية' : 'English'}
            </button>

            <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

            <button className="relative p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-all">
              <Bell size={20} />
              {currentUser.preferences.notifications && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>
            
            <div className="hidden md:flex items-center gap-2 text-xs font-medium text-brand-700 bg-brand-50 px-3 py-1.5 rounded-full border border-brand-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              {t('nav.marketOpen')}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={clsx("flex-1 overflow-y-auto scroll-smooth", activeView !== AppView.MAP && "p-4 md:p-6 lg:p-8")}>
          <div className={clsx(activeView !== AppView.MAP && "max-w-7xl mx-auto pb-20")}>
            {renderContent()}
          </div>
        </main>

        {/* AI Chat Widget */}
        <AIChatWidget />
      </div>
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
