
import React, { useState } from 'react';
import { Building2, Plus, Search, Eye, MousePointer2, BarChart2, MoreHorizontal, Edit, Sparkles, Zap, Filter, Home, MapPin, DollarSign } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import clsx from 'clsx';

// Mock Data for listings
const MY_LISTINGS_DATA = [
  {
    id: '101',
    title: 'Modern Villa in Al Malqa',
    type: 'Residential',
    price: 3500000,
    status: 'Active',
    views: 1240,
    clicks: 85,
    leads: 12,
    location: 'Riyadh, Al Malqa',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '102',
    title: 'Commercial Plot on King Road',
    type: 'Land',
    price: 8200000,
    status: 'Active',
    views: 850,
    clicks: 42,
    leads: 8,
    location: 'Jeddah, Al Shati',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '103',
    title: 'Luxury Apartment - KAFD',
    type: 'Residential',
    price: 2100000,
    status: 'Review',
    views: 0,
    clicks: 0,
    leads: 0,
    location: 'Riyadh, KAFD',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '104',
    title: 'Dammam Seafront Duplex',
    type: 'Residential',
    price: 1800000,
    status: 'Sold',
    views: 3200,
    clicks: 156,
    leads: 24,
    location: 'Dammam, Corniche',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

export const MyListings: React.FC = () => {
  const { t, dir } = useLanguage();
  const [listings, setListings] = useState(MY_LISTINGS_DATA);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Review' | 'Sold'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Derived stats
  const totalValue = listings.reduce((acc, item) => item.status !== 'Sold' ? acc + item.price : acc, 0);
  const totalViews = listings.reduce((acc, item) => acc + item.views, 0);
  const totalLeads = listings.reduce((acc, item) => acc + item.leads, 0);

  const filteredListings = listings.filter(item => {
    const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleBoost = (id: string) => {
    alert("Boost feature coming soon! This will prioritize your listing in search results.");
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Building2 className="text-brand-600" />
            {t('listings.title')}
          </h2>
          <p className="text-gray-500 mt-1">{t('listings.subtitle')}</p>
        </div>
        <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 shadow-lg shadow-gray-900/20 transition-all flex items-center justify-center gap-2 group">
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          {t('listings.btn.add')}
        </button>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-brand-50 text-brand-600 rounded-lg"><Home size={18} /></div>
            <span className="text-sm font-medium text-gray-500">{t('listings.stats.total')}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{listings.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><DollarSign size={18} /></div>
            <span className="text-sm font-medium text-gray-500">{t('listings.stats.value')}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900" dir="ltr">{totalValue.toLocaleString()} <span className="text-xs text-gray-400 font-normal">SAR</span></p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Eye size={18} /></div>
            <span className="text-sm font-medium text-gray-500">{t('listings.stats.views')}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-accent-50 text-accent-600 rounded-lg"><MousePointer2 size={18} /></div>
            <span className="text-sm font-medium text-gray-500">{t('listings.stats.leads')}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex overflow-x-auto no-scrollbar gap-1">
           {(['All', 'Active', 'Review', 'Sold'] as const).map((status) => (
             <button
               key={status}
               onClick={() => setFilterStatus(status)}
               className={clsx(
                 "px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                 filterStatus === status 
                   ? "bg-gray-100 text-gray-900 font-bold" 
                   : "text-gray-500 hover:bg-gray-50"
               )}
             >
               {status === 'All' ? t('market.tab.all') : t(`listings.status.${status.toLowerCase()}`)}
             </button>
           ))}
        </div>
        <div className="flex-1 relative">
           <Search className="absolute ltr:left-3 rtl:right-3 top-2.5 text-gray-400" size={18} />
           <input 
             type="text" 
             placeholder={t('listings.search')}
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-brand-300 focus:ring-4 focus:ring-brand-50 rounded-xl py-2 ltr:pl-10 rtl:pr-10 outline-none transition-all text-sm"
           />
        </div>
        <button className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter size={18} />
        </button>
      </div>

      {/* Inventory Grid */}
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          {filteredListings.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group flex flex-col sm:flex-row h-full sm:h-48">
                {/* Image Side */}
                <div className="sm:w-48 h-48 sm:h-auto relative shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                    <span className={clsx(
                        "absolute top-3 left-3 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm",
                        item.status === 'Active' ? "bg-green-500 text-white" :
                        item.status === 'Sold' ? "bg-gray-800 text-white" : "bg-accent-500 text-white"
                    )}>
                        {t(`listings.status.${item.status.toLowerCase()}`)}
                    </span>
                </div>

                {/* Content Side */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{item.title}</h3>
                            <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={20} /></button>
                        </div>
                        <p className="text-gray-500 text-xs flex items-center gap-1 mb-3">
                            <MapPin size={12} /> {item.location} • {item.type}
                        </p>
                        <p className="text-xl font-bold text-gray-900" dir="ltr">{item.price.toLocaleString()} <span className="text-xs text-gray-400 font-normal">SAR</span></p>
                    </div>

                    {/* Metrics & Actions */}
                    <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-50">
                        <div className="flex gap-4 text-center">
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase font-bold">{t('listings.card.views')}</p>
                                <p className="text-sm font-bold text-gray-900">{item.views}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase font-bold">{t('listings.card.leads')}</p>
                                <p className="text-sm font-bold text-brand-600">{item.leads}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {item.status === 'Active' && (
                                <button 
                                    onClick={() => handleBoost(item.id)}
                                    className="p-2 text-accent-600 bg-accent-50 hover:bg-accent-100 rounded-lg transition-colors"
                                    title={t('listings.action.boost')}
                                >
                                    <Zap size={18} />
                                </button>
                            )}
                             <button className="p-2 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors" title={t('common.edit')}>
                                <Edit size={18} />
                            </button>
                             <button className="p-2 text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors" title={t('listings.action.ai')}>
                                <Sparkles size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                 <Building2 size={32} />
             </div>
             <h3 className="text-lg font-bold text-gray-900 mb-2">{t('listings.empty')}</h3>
             <button className="text-brand-600 font-bold text-sm hover:underline">{t('listings.btn.add')}</button>
        </div>
      )}
    </div>
  );
};
