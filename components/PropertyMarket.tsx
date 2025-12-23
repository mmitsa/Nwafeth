
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Briefcase, User, Building2, Search, Filter, Activity, Clock, Star, X, MapPin, Calendar, BarChart3, Info, Trash2 } from 'lucide-react';
import { PropertyListing } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import clsx from 'clsx';

// Mock Data representing "Live" market
const MOCK_LISTINGS: PropertyListing[] = [
  {
    id: '1',
    ticker: 'ROSHN-SEDRA-104',
    title: 'Sedra Phase 2 - Villa Type A',
    location: 'Riyadh, North',
    price: 2850000,
    lastPrice: 2800000,
    change24h: 1.78,
    volume: 154,
    sellerType: 'Developer',
    sellerName: 'Roshn',
    type: 'Residential',
    status: 'Active',
    isIPO: true,
    completionDate: '2025-Q4'
  },
  {
    id: '2',
    ticker: 'KAFC-OFFICE-20',
    title: 'KAFD Office Floor 20',
    location: 'Riyadh, KAFD',
    price: 12500000,
    lastPrice: 12650000,
    change24h: -1.18,
    volume: 42,
    sellerType: 'Broker',
    sellerName: 'Knight Frank',
    type: 'Commercial',
    status: 'Active',
    isIPO: false
  },
  {
    id: '3',
    ticker: 'JED-OBHUR-LND',
    title: 'Obhur Seafront Plot',
    location: 'Jeddah, Obhur',
    price: 4200000,
    lastPrice: 4200000,
    change24h: 0.00,
    volume: 89,
    sellerType: 'Owner',
    sellerName: 'Private Seller',
    type: 'Land',
    status: 'Active',
    isIPO: false
  },
  {
    id: '4',
    ticker: 'DMM-AJDAN-APT',
    title: 'Ajdan Rise - 3BR Apt',
    location: 'Khobar, Corniche',
    price: 1850000,
    lastPrice: 1820000,
    change24h: 1.65,
    volume: 210,
    sellerType: 'Developer',
    sellerName: 'Ajdan',
    type: 'Residential',
    status: 'Active',
    isIPO: true,
    completionDate: 'Ready'
  },
  {
    id: '5',
    ticker: 'RYD-MALQA-DUP',
    title: 'Al Malqa Modern Duplex',
    location: 'Riyadh, Al Malqa',
    price: 3100000,
    lastPrice: 3050000,
    change24h: 1.64,
    volume: 320,
    sellerType: 'Broker',
    sellerName: 'Century 21',
    type: 'Residential',
    status: 'Active',
    isIPO: false
  },
  {
    id: '6',
    ticker: 'MCC-HARM-HTL',
    title: 'Makkah Hotel Suite Share',
    location: 'Mecca, Central',
    price: 550000,
    lastPrice: 560000,
    change24h: -1.79,
    volume: 56,
    sellerType: 'Developer',
    sellerName: 'Jabal Omar',
    type: 'Commercial',
    status: 'Active',
    isIPO: true,
    completionDate: '2026-Q1'
  }
];

export const PropertyMarket: React.FC = () => {
  const { t, dir } = useLanguage();
  const [activeTab, setActiveTab] = useState<'all' | 'ipo' | 'resale' | 'watchlist'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [listings, setListings] = useState(MOCK_LISTINGS);
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);

  // Initialize Watchlist from LocalStorage
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nawafiz_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Persist Watchlist to LocalStorage
  useEffect(() => {
    localStorage.setItem('nawafiz_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Simulate live price updates on the main listing data
  useEffect(() => {
    const interval = setInterval(() => {
      setListings(prev => prev.map(item => {
        // Randomly update some prices
        if (Math.random() > 0.7) {
          const change = (Math.random() - 0.5) * 0.02; // Small fluctuation
          const newPrice = item.price * (1 + change);
          return {
            ...item,
            price: Math.round(newPrice / 1000) * 1000, // Round to nearest 1000
            lastPrice: item.price,
            change24h: item.change24h + (change * 100),
            volume: item.volume + Math.floor(Math.random() * 5)
          };
        }
        return item;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Derived state for filtering
  const filteredListings = listings.filter(item => {
    // Tab Filter
    if (activeTab === 'ipo' && !item.isIPO) return false;
    if (activeTab === 'resale' && item.isIPO) return false;
    if (activeTab === 'watchlist' && !watchlist.includes(item.id)) return false;
    
    // Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return item.title.toLowerCase().includes(q) || 
             item.ticker.toLowerCase().includes(q) || 
             item.location.toLowerCase().includes(q);
    }
    
    return true;
  });

  const toggleWatchlist = (id: string) => {
    setWatchlist(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getSellerIcon = (type: string) => {
    switch(type) {
      case 'Developer': return <Building2 size={14} />;
      case 'Broker': return <Briefcase size={14} />;
      case 'Owner': return <User size={14} />;
      default: return <User size={14} />;
    }
  };

  const getPropertyImage = (type: string) => {
    switch(type) {
      case 'Residential': return 'https://images.unsplash.com/photo-1600596542815-22b845069566?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
      case 'Commercial': return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
      case 'Land': return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
      default: return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
    }
  };

  const watchedItems = listings.filter(item => watchlist.includes(item.id));

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Activity className="text-brand-600" />
            {t('market.title')}
            </h2>
            <p className="text-gray-500 mt-1">{t('market.subtitle')}</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-[#0f172a] text-green-400 px-4 py-2 rounded-xl font-mono text-xs font-bold shadow-xl shadow-gray-200">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            LIVE MARKET
        </div>
      </div>

      {/* Prominent Watchlist Summary Strip */}
      {watchedItems.length > 0 && (
        <div className="animate-slide-up bg-slate-50 p-5 rounded-3xl border border-slate-200 shadow-inner mb-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                <div className="bg-orange-100 p-1.5 rounded-lg text-orange-600"><Star size={16} className="fill-current" /></div>
                {t('market.watchlist.title')} <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs">{watchedItems.length}</span>
              </div>
              <button 
                onClick={() => {
                  if(window.confirm('Clear entire watchlist?')) setWatchlist([]);
                }} 
                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
              >
                <Trash2 size={14} /> Clear All
              </button>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory">
              {watchedItems.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedProperty(item)}
                  className="min-w-[280px] bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all cursor-pointer hover:border-orange-300 group relative snap-center"
                >
                   <div className="absolute top-3 bottom-3 left-0 w-1 bg-orange-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <div className="flex justify-between items-start mb-3 pl-3">
                      <div>
                          <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200 mb-1.5 block w-fit">{item.ticker}</span>
                          <h4 className="font-bold text-slate-900 text-sm truncate max-w-[190px]">{item.title}</h4>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWatchlist(item.id);
                        }} 
                        className="text-slate-300 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded-full"
                      >
                        <X size={16} />
                      </button>
                   </div>
                   <div className="flex justify-between items-end pl-3">
                      <div>
                          <p className="text-[10px] text-slate-400 mb-0.5 font-bold uppercase tracking-wide">{t('market.price')}</p>
                          <span className="font-bold text-slate-900 text-xl tracking-tight">{item.price.toLocaleString()}</span>
                      </div>
                      <div className={clsx("flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg", item.change24h >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600")}>
                        {item.change24h >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        <span dir="ltr">{Math.abs(item.change24h).toFixed(2)}%</span>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ticker Tape */}
      <div className="w-full bg-[#0f172a] text-white overflow-hidden whitespace-nowrap py-3 rounded-xl shadow-lg shadow-gray-200">
        <div className="inline-block animate-[marquee_30s_linear_infinite] space-x-12 px-4">
          {listings.map(item => (
            <span key={item.id} className="inline-flex items-center gap-3 font-mono text-sm mx-4">
              <span className="text-gray-400 font-bold">{item.ticker}</span>
              <span className="font-medium">{item.price.toLocaleString()}</span>
              <span className={clsx("text-xs", item.change24h >= 0 ? "text-green-400" : "text-red-400")}>
                {item.change24h > 0 ? '▲' : '▼'} {Math.abs(item.change24h).toFixed(2)}%
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Filters and Tabs */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {(['all', 'watchlist', 'ipo', 'resale'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                activeTab === tab 
                  ? "bg-gray-900 text-white shadow-lg shadow-gray-900/20" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              {t(`market.tab.${tab}`)}
            </button>
          ))}
        </div>

        <div className="relative md:w-80">
          <Search className="absolute ltr:left-4 rtl:right-4 top-3 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder={t('market.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ltr:pl-11 rtl:pr-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-brand-300 focus:ring-4 focus:ring-brand-50 outline-none transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Market Grid */}
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedProperty(item)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 group relative cursor-pointer flex flex-col overflow-hidden"
            >
              {/* Watchlist Toggle Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWatchlist(item.id);
                }}
                className="absolute top-4 ltr:right-4 rtl:left-4 z-10 p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full text-gray-400 hover:text-accent-500 transition-colors shadow-sm border border-gray-100"
              >
                <Star size={18} className={clsx(watchlist.includes(item.id) && "fill-accent-500 text-accent-500")} />
              </button>

              {/* Header */}
              <div className="p-5 border-b border-gray-50 flex justify-between items-start bg-gradient-to-b from-gray-50/50 to-white">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-[10px] font-bold text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded shadow-sm">
                      {item.ticker}
                    </span>
                    {item.isIPO && (
                      <span className="bg-brand-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm shadow-brand-200">
                        {t('market.ipo')}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg truncate max-w-[200px] leading-tight">{item.title}</h3>
                  <p className="text-xs font-medium text-gray-500 flex items-center gap-1 mt-1.5">
                    <MapPin size={12} className="text-gray-400" /> {item.location}
                  </p>
                </div>
                <div className={clsx(
                  "flex flex-col items-end mt-1 rounded-lg p-1",
                  item.change24h >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                )}>
                  {item.change24h >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  <span className="text-xs font-bold mt-1" dir="ltr">
                    {Math.abs(item.change24h).toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">{t('market.price')}</p>
                  <p className="text-2xl font-bold text-gray-900 tracking-tight" dir="ltr">
                    {item.price.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">{t('market.volume')}</p>
                  <p className="text-sm font-mono font-medium text-gray-700 bg-gray-50 px-2 py-1 rounded">{item.volume}</p>
                </div>
              </div>

              {/* Seller Info */}
              <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 shrink-0 shadow-sm">
                  {getSellerIcon(item.sellerType)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{t(`market.${item.sellerType.toLowerCase()}`)}</p>
                  <p className="text-xs font-bold text-gray-900 truncate">{item.sellerName}</p>
                </div>
              </div>

              {/* Action Button Area */}
              <div className="p-4 mt-auto">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    // Trigger appropriate action
                  }}
                  className={clsx(
                  "w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 group-hover:shadow-lg",
                  item.isIPO 
                    ? "bg-brand-600 text-white hover:bg-brand-700 shadow-brand-200" 
                    : "bg-gray-900 text-white hover:bg-gray-800 shadow-gray-200"
                )}>
                  {item.isIPO ? <Briefcase size={16} /> : <Activity size={16} />}
                  {item.isIPO ? t('market.buy') : t('market.bid')}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
          <div className="p-5 bg-gray-50 rounded-full mb-4">
             {activeTab === 'watchlist' ? <Star size={32} className="text-gray-300" /> : <Search size={32} className="text-gray-300" />}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {activeTab === 'watchlist' ? t('market.watchlist.empty') : t('market.notFound')}
          </h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            {activeTab === 'watchlist' 
             ? "Star properties in the market view to keep track of them here."
             : t('market.tryAdjust')}
          </p>
        </div>
      )}

      {/* Detailed Modal */}
      {selectedProperty && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f172a]/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedProperty(null)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Image */}
            <div className="h-56 relative shrink-0 group">
              <img 
                src={getPropertyImage(selectedProperty.type)} 
                alt={selectedProperty.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-90"></div>
              
              <button 
                onClick={() => setSelectedProperty(null)}
                className="absolute top-4 ltr:right-4 rtl:left-4 p-2 bg-white/10 text-white rounded-full hover:bg-white hover:text-gray-900 transition-all backdrop-blur-md"
              >
                <X size={20} />
              </button>

              <div className="absolute bottom-6 ltr:left-6 rtl:right-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded text-xs font-mono font-bold border border-white/20 shadow-sm">
                    {selectedProperty.ticker}
                  </span>
                  <span className={clsx(
                    "px-2 py-1 rounded text-xs font-bold uppercase tracking-wide shadow-sm",
                    selectedProperty.status === 'Active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                  )}>
                    {selectedProperty.status}
                  </span>
                </div>
                <h2 className="text-3xl font-bold shadow-sm leading-tight">{selectedProperty.title}</h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-8 border-b border-gray-100 gap-6">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('market.price')}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-gray-900 tracking-tight" dir="ltr">{selectedProperty.price.toLocaleString()}</span>
                    <span className="text-gray-400 text-xl font-light">{t('common.sar')}</span>
                  </div>
                </div>
                <div className={clsx(
                  "flex items-center gap-3 px-4 py-2 rounded-xl",
                  selectedProperty.change24h >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                )}>
                  {selectedProperty.change24h >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                  <div>
                    <span className="font-bold text-xl block leading-none" dir="ltr">
                        {selectedProperty.change24h > 0 ? '+' : ''}{selectedProperty.change24h.toFixed(2)}%
                    </span>
                    <span className="text-[10px] opacity-70 uppercase font-bold tracking-wider">{t('market.change')}</span>
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2 text-lg">
                <Info size={20} className="text-brand-600" /> {t('market.modal.details')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-sm">
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-gray-500 font-medium flex items-center gap-2"><MapPin size={16} /> {t('val.city')}</span>
                  <span className="font-bold text-gray-900">{selectedProperty.location}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-gray-500 font-medium flex items-center gap-2"><Building2 size={16} /> {t('market.modal.type')}</span>
                  <span className="font-bold text-gray-900">{selectedProperty.type}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-gray-500 font-medium flex items-center gap-2"><User size={16} /> {t('market.seller')}</span>
                  <div className="text-right">
                    <span className="font-bold text-gray-900 block">{selectedProperty.sellerName}</span>
                    <span className="text-xs text-gray-400 font-medium">{t(`market.${selectedProperty.sellerType.toLowerCase()}`)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-gray-500 font-medium flex items-center gap-2"><BarChart3 size={16} /> {t('market.volume')}</span>
                  <span className="font-mono font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded">{selectedProperty.volume}</span>
                </div>
                {selectedProperty.completionDate && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-50">
                    <span className="text-gray-500 font-medium flex items-center gap-2"><Calendar size={16} /> {t('market.modal.completion')}</span>
                    <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{selectedProperty.completionDate}</span>
                  </div>
                )}
              </div>

              <div className="mt-10 flex gap-4">
                 <button className={clsx(
                   "flex-1 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1",
                   selectedProperty.isIPO 
                     ? "bg-brand-600 text-white hover:bg-brand-700 shadow-brand-200" 
                     : "bg-gray-900 text-white hover:bg-gray-800 shadow-gray-200"
                 )}>
                   {selectedProperty.isIPO ? t('market.buy') : t('market.bid')}
                 </button>
                 <button 
                    onClick={() => toggleWatchlist(selectedProperty.id)}
                    className={clsx(
                      "px-5 rounded-xl border-2 transition-all flex items-center justify-center hover:shadow-md",
                      watchlist.includes(selectedProperty.id) 
                        ? "border-accent-400 bg-accent-50 text-accent-600" 
                        : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600"
                    )}
                 >
                    <Star size={24} className={clsx(watchlist.includes(selectedProperty.id) && "fill-current")} />
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
