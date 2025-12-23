
import React, { useState } from 'react';
import { 
  Users, Award, TrendingUp, Briefcase, CheckCircle, Star, 
  ArrowRight, Search, MapPin, Building, FileSignature, 
  ShieldCheck, Loader2, X, Handshake, Crown, Trophy, 
  Medal, Filter, Globe, Phone, Mail, Download, ChevronRight,
  Check, FileText, PenTool, Wallet, PieChart as PieChartIcon, BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { Partner, PartnerType } from '../types';
import clsx from 'clsx';

// Mock Data for Partners
const PARTNERS_DATA: Partner[] = [
  {
    id: '1',
    name: 'Roshn Real Estate',
    type: 'Developer',
    rank: 1,
    nawafizScore: 98,
    verified: true,
    dealsClosed: 1250,
    activeListingsCount: 45,
    collaborationRate: '2.5% Comm',
    location: 'Riyadh',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3dab?auto=format&fit=crop&w=200',
    description: 'Leading national real estate developer powered by PIF, delivering integrated communities across the Kingdom.',
    specialties: ['Residential Communities', 'Master Planning', 'Smart Cities']
  },
  {
    id: '2',
    name: 'Dar Al Arkan',
    type: 'Developer',
    rank: 2,
    nawafizScore: 95,
    verified: true,
    dealsClosed: 980,
    activeListingsCount: 32,
    collaborationRate: '2.0% Comm',
    location: 'Riyadh, Jeddah',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=200',
    description: 'Premier real estate development company in Saudi Arabia listed on the Saudi Stock Exchange.',
    specialties: ['High-rise', 'Commercial', 'Luxury Villas']
  },
  {
    id: '3',
    name: 'Retal Urban Dev',
    type: 'Developer',
    rank: 3,
    nawafizScore: 93,
    verified: true,
    dealsClosed: 650,
    activeListingsCount: 28,
    collaborationRate: '2.25% Comm',
    location: 'Khobar, Riyadh',
    logo: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=200',
    description: 'Urban development company focusing on creating human-centric living spaces.',
    specialties: ['Urban Planning', 'Mixed-use']
  },
  {
    id: '4',
    name: 'Century 21 Saudi',
    type: 'Broker',
    rank: 1,
    nawafizScore: 96,
    verified: true,
    dealsClosed: 840,
    activeListingsCount: 112,
    collaborationRate: '50/50 Split',
    location: 'Riyadh, Jeddah',
    logo: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=200',
    description: 'Global real estate brand with extensive local network and high-performance agents.',
    specialties: ['Luxury Resale', 'Commercial Leasing']
  },
  {
    id: '5',
    name: 'Knight Frank',
    type: 'Broker',
    rank: 2,
    nawafizScore: 91,
    verified: true,
    dealsClosed: 320,
    activeListingsCount: 65,
    collaborationRate: 'Agreed Split',
    location: 'Riyadh',
    logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=200',
    description: 'Independent real estate consultancy with global reach.',
    specialties: ['Valuation', 'Advisory', 'Investment']
  },
  {
    id: '6',
    name: 'Ahmed Al-Harbi',
    type: 'Marketer',
    rank: 1,
    nawafizScore: 94,
    verified: true,
    dealsClosed: 45,
    activeListingsCount: 8,
    collaborationRate: '30% Referral',
    location: 'Jeddah',
    logo: 'AH',
    description: 'Specialized digital marketer focused on off-plan luxury apartments in Jeddah.',
    specialties: ['Digital Ads', 'Social Media', 'Lead Gen']
  }
];

const SUCCESS_RATE_DATA = [
  { name: 'Developers', rate: 92, fill: '#10b981' },
  { name: 'Brokers', rate: 85, fill: '#3b82f6' },
  { name: 'Marketers', rate: 78, fill: '#8b5cf6' },
];

export const PartnersNetwork: React.FC = () => {
  const { t, dir } = useLanguage();
  const [activeTab, setActiveTab] = useState<PartnerType>('Developer');
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  
  // Modal States
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [modalTab, setModalTab] = useState<'profile' | 'inventory' | 'contract'>('profile');
  const [contractStep, setContractStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter Logic
  const filteredPartners = PARTNERS_DATA.filter(p => {
    const matchesType = p.type === activeTab;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = cityFilter === 'All' || p.location.includes(cityFilter);
    return matchesType && matchesSearch && matchesCity;
  }).sort((a, b) => b.nawafizScore - a.nawafizScore);

  // Handlers
  const openPartner = (partner: Partner) => {
    setSelectedPartner(partner);
    setModalTab('profile');
    setContractStep(1);
  };

  const handleGenerateContract = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setContractStep(2);
    }, 1500);
  };

  const handleSignContract = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setContractStep(3);
    }, 2000);
  };

  const RankBadge = ({ rank }: { rank: number }) => {
    if (rank === 1) return (
      <div className="absolute top-0 ltr:left-4 rtl:right-4 -mt-3 bg-yellow-400 text-white p-1.5 rounded-full shadow-lg border-2 border-white z-10">
        <Crown size={16} fill="currentColor" />
      </div>
    );
    if (rank === 2) return (
      <div className="absolute top-0 ltr:left-4 rtl:right-4 -mt-3 bg-gray-300 text-gray-600 p-1.5 rounded-full shadow-lg border-2 border-white z-10">
        <Medal size={16} fill="currentColor" />
      </div>
    );
    if (rank === 3) return (
      <div className="absolute top-0 ltr:left-4 rtl:right-4 -mt-3 bg-amber-600 text-white p-1.5 rounded-full shadow-lg border-2 border-white z-10">
        <Award size={16} fill="currentColor" />
      </div>
    );
    return (
      <div className="absolute top-0 ltr:left-4 rtl:right-4 -mt-3 bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full shadow-sm border border-gray-200 text-xs font-bold z-10 font-mono">
        #{rank}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Header */}
      <div className="relative bg-[#0f172a] rounded-3xl p-8 md:p-12 text-white overflow-hidden shadow-2xl">
        <div className="absolute top-0 ltr:right-0 rtl:left-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 ltr:left-0 rtl:right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/10">
                        <Users className="text-brand-400" size={24} />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold uppercase tracking-wider">
                        {t('nav.partners')}
                    </span>
                </div>
                <h2 className="text-4xl font-extrabold mb-4 tracking-tight">{t('partners.title')}</h2>
                <p className="text-gray-400 max-w-2xl text-lg leading-relaxed">{t('partners.subtitle')}</p>
            </div>
            
            <div className="flex gap-4">
                 <div className="text-center bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-2xl">
                    <p className="text-3xl font-bold text-white mb-1">150+</p>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Active Partners</p>
                 </div>
                 <div className="text-center bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-2xl">
                    <p className="text-3xl font-bold text-brand-400 mb-1">2.4B</p>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Deals Volume</p>
                 </div>
            </div>
        </div>
      </div>

      {/* Partnership Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
        {/* Card 1: Total Commission */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-brand-200 transition-colors">
           <div className="absolute right-0 top-0 p-6 opacity-5 text-brand-600 group-hover:opacity-10 transition-opacity group-hover:scale-110 duration-500"><Wallet size={100} /></div>
           <div className="relative z-10">
             <div className="flex items-center gap-2 mb-3 text-gray-500 text-xs font-bold uppercase tracking-wider">
               <Wallet size={16} className="text-brand-600" />
               {t('partners.analytics.totalComm')}
             </div>
             <div className="flex items-baseline gap-1">
                <p className="text-4xl font-extrabold text-gray-900">15.4M</p>
                <span className="text-sm font-bold text-gray-400">{t('common.sar')}</span>
             </div>
           </div>
           <div className="mt-6 pt-4 border-t border-gray-50 relative z-10">
             <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400">{t('partners.analytics.growth')}</span>
                <div className="flex items-center text-green-600 text-xs font-bold bg-green-50 px-2.5 py-1 rounded-full">
                    <TrendingUp size={12} className="ltr:mr-1 rtl:ml-1" /> +12.5%
                </div>
             </div>
           </div>
        </div>

        {/* Card 2: Avg Deal Value */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-blue-200 transition-colors">
           <div className="absolute right-0 top-0 p-6 opacity-5 text-blue-600 group-hover:opacity-10 transition-opacity group-hover:scale-110 duration-500"><Briefcase size={100} /></div>
           <div>
             <div className="flex items-center gap-2 mb-3 text-gray-500 text-xs font-bold uppercase tracking-wider">
               <Briefcase size={16} className="text-blue-600" />
               {t('partners.analytics.avgDeal')}
             </div>
             <div className="flex items-baseline gap-1">
                <p className="text-4xl font-extrabold text-gray-900">1.85M</p>
                <span className="text-sm font-bold text-gray-400">{t('common.sar')}</span>
             </div>
           </div>
           <div className="mt-4">
               <div className="flex justify-between text-xs font-bold mb-1.5">
                   <span className="text-gray-500">vs Market Avg</span>
                   <span className="text-blue-600">High Value</span>
               </div>
               <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                   <div className="bg-blue-500 w-[70%] h-full rounded-full"></div>
               </div>
           </div>
        </div>

        {/* Card 3: Success Rate Chart */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col relative overflow-hidden">
           <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider">
                   <BarChart3 size={16} className="text-purple-600" />
                   {t('partners.analytics.successRate')}
               </div>
               <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-1 rounded-full">High Performers</span>
           </div>
           
           <div className="h-32 w-full mt-auto">
               <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={SUCCESS_RATE_DATA} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }} barSize={16}>
                       <XAxis type="number" hide />
                       <YAxis dataKey="name" type="category" width={70} tick={{fontSize: 10, fontWeight: 600, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                       <Tooltip 
                           cursor={{fill: '#f3f4f6'}}
                           contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px'}}
                           itemStyle={{fontWeight: 'bold'}}
                       />
                       <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                           {SUCCESS_RATE_DATA.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={entry.fill} />
                           ))}
                       </Bar>
                   </BarChart>
               </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Controls & Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm sticky top-20 z-20">
        <div className="flex p-1 bg-gray-100 rounded-xl w-full lg:w-auto overflow-x-auto no-scrollbar">
            {(['Developer', 'Broker', 'Marketer'] as PartnerType[]).map((type) => (
            <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={clsx(
                "px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === type 
                    ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
                )}
            >
                {type === 'Developer' && <Building size={16} />}
                {type === 'Broker' && <Briefcase size={16} />}
                {type === 'Marketer' && <TrendingUp size={16} />}
                {t(`partners.tab.${type.toLowerCase()}`)}
            </button>
            ))}
        </div>

        <div className="flex w-full lg:w-auto gap-3">
             <div className="relative flex-1 lg:w-64">
                <Search className="absolute ltr:left-3 rtl:right-3 top-2.5 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder={t('map.filter.all')} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-brand-300 focus:ring-2 focus:ring-brand-100 rounded-xl py-2 ltr:pl-10 rtl:pr-10 outline-none transition-all text-sm"
                />
             </div>
             <div className="relative">
                <select 
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="appearance-none bg-gray-50 border border-transparent focus:bg-white focus:border-brand-300 focus:ring-2 focus:ring-brand-100 rounded-xl py-2 ltr:pl-4 rtl:pr-4 ltr:pr-10 rtl:pl-10 outline-none transition-all text-sm font-medium text-gray-700 cursor-pointer h-full"
                >
                    <option value="All">{t('map.filter.all')}</option>
                    <option value="Riyadh">Riyadh</option>
                    <option value="Jeddah">Jeddah</option>
                    <option value="Dammam">Dammam</option>
                </select>
                <MapPin className="absolute ltr:right-3 rtl:left-3 top-2.5 text-gray-400 pointer-events-none" size={16} />
             </div>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredPartners.map((partner, index) => (
            <div 
                key={partner.id}
                onClick={() => openPartner(partner)}
                className={clsx(
                    "group bg-white rounded-3xl border transition-all duration-300 cursor-pointer relative flex flex-col overflow-hidden",
                    index === 0 ? "lg:col-span-3 flex-row border-brand-100 shadow-xl shadow-brand-100/50 min-h-[280px]" : "hover:shadow-xl hover:border-brand-200 hover:-translate-y-1 border-gray-100 shadow-sm"
                )}
            >
                {/* Featured Card Layout (Rank 1) */}
                {index === 0 ? (
                    <>
                        <div className="absolute top-0 ltr:right-0 rtl:left-0 p-6 z-10">
                             <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-2">
                                <Trophy size={14} /> {t('partners.rank.top')}
                             </div>
                        </div>
                        <div className="w-full lg:w-2/5 relative overflow-hidden bg-gray-100">
                             <img src={partner.logo.startsWith('http') ? partner.logo : ''} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
                             <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent flex flex-col justify-end p-8">
                                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl font-bold text-gray-800 shadow-lg mb-4">
                                    {partner.logo.startsWith('http') ? <img src={partner.logo} className="w-full h-full object-cover rounded-2xl" /> : partner.logo}
                                 </div>
                                 <h3 className="text-3xl font-bold text-white mb-1">{partner.name}</h3>
                                 <p className="text-gray-300 flex items-center gap-1 text-sm">
                                    <MapPin size={14} /> {partner.location}
                                 </p>
                             </div>
                        </div>
                        <div className="w-full lg:w-3/5 p-8 flex flex-col">
                             <div className="flex-1">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('partners.about')}</h4>
                                        <p className="text-gray-600 leading-relaxed text-lg">{partner.description}</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-6 mb-8">
                                    <div className="bg-brand-50 p-4 rounded-2xl border border-brand-100">
                                        <p className="text-xs text-brand-600 font-bold uppercase mb-1">{t('partners.score')}</p>
                                        <p className="text-3xl font-extrabold text-brand-700">{partner.nawafizScore}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">{t('partners.deals')}</p>
                                        <p className="text-2xl font-bold text-gray-900">{partner.dealsClosed}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">{t('partners.collab')}</p>
                                        <p className="text-xl font-bold text-gray-900">{partner.collaborationRate}</p>
                                    </div>
                                </div>
                             </div>
                             
                             <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                                <div className="flex gap-2">
                                    {partner.specialties.map(s => (
                                        <span key={s} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg uppercase">{s}</span>
                                    ))}
                                </div>
                                <button className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center gap-2 shadow-lg shadow-gray-200 group-hover:scale-105">
                                    {t('partners.btn.view')} <ArrowRight size={18} />
                                </button>
                             </div>
                        </div>
                    </>
                ) : (
                    /* Standard Card Layout */
                    <div className="p-6 flex flex-col h-full">
                        <RankBadge rank={index + 1} />
                        
                        <div className="flex justify-between items-start mb-6 pt-2">
                             <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                                    {partner.logo.startsWith('http') ? <img src={partner.logo} className="w-full h-full object-cover" /> : <span className="font-bold text-gray-400">{partner.logo}</span>}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg leading-tight flex items-center gap-1">
                                        {partner.name}
                                        {partner.verified && <ShieldCheck size={14} className="text-blue-500" />}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                        <MapPin size={10} /> {partner.location}
                                    </p>
                                </div>
                             </div>
                        </div>

                        <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-1">{partner.description}</p>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                             <div className="bg-gray-50 rounded-xl p-3 text-center">
                                 <p className="text-[10px] text-gray-400 font-bold uppercase">{t('partners.score')}</p>
                                 <p className="font-bold text-brand-600 text-lg">{partner.nawafizScore}</p>
                             </div>
                             <div className="bg-gray-50 rounded-xl p-3 text-center">
                                 <p className="text-[10px] text-gray-400 font-bold uppercase">{t('partners.deals')}</p>
                                 <p className="font-bold text-gray-900 text-lg">{partner.dealsClosed}</p>
                             </div>
                        </div>

                        <button className="w-full py-3 border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2">
                            {t('common.viewDetails')}
                        </button>
                    </div>
                )}
            </div>
        ))}
      </div>

      {/* Partner Detail Modal */}
      {selectedPartner && (
         <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f172a]/70 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setSelectedPartner(null)}
         >
            <div 
                className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden animate-slide-up flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header Image */}
                <div className="h-40 bg-gray-900 relative overflow-hidden shrink-0">
                    <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover opacity-40" />
                    <button 
                        onClick={() => setSelectedPartner(null)}
                        className="absolute top-6 ltr:right-6 rtl:left-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div className="absolute -bottom-12 ltr:left-8 rtl:right-8 flex items-end gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-white p-1.5 shadow-lg">
                             {selectedPartner.logo.startsWith('http') ? (
                                <img src={selectedPartner.logo} className="w-full h-full object-cover rounded-xl" />
                             ) : (
                                <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center font-bold text-2xl">{selectedPartner.logo}</div>
                             )}
                        </div>
                        <div className="mb-14 text-white">
                            <h2 className="text-3xl font-bold flex items-center gap-2">
                                {selectedPartner.name}
                                {selectedPartner.verified && <ShieldCheck size={20} className="text-blue-400" />}
                            </h2>
                            <div className="flex items-center gap-4 text-sm text-gray-300 mt-1">
                                <span className="flex items-center gap-1"><MapPin size={14} /> {selectedPartner.location}</span>
                                <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                                <span className="flex items-center gap-1"><Briefcase size={14} /> {selectedPartner.type}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Tabs */}
                <div className="mt-14 px-8 border-b border-gray-100 flex gap-8 shrink-0">
                    <button 
                        onClick={() => setModalTab('profile')}
                        className={clsx("pb-4 text-sm font-bold border-b-2 transition-colors", modalTab === 'profile' ? "border-brand-600 text-brand-600" : "border-transparent text-gray-500 hover:text-gray-800")}
                    >
                        Overview
                    </button>
                    <button 
                        onClick={() => setModalTab('inventory')}
                        className={clsx("pb-4 text-sm font-bold border-b-2 transition-colors", modalTab === 'inventory' ? "border-brand-600 text-brand-600" : "border-transparent text-gray-500 hover:text-gray-800")}
                    >
                        {t('partners.modal.inventory')}
                    </button>
                    <button 
                        onClick={() => setModalTab('contract')}
                        className={clsx("pb-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2", modalTab === 'contract' ? "border-brand-600 text-brand-600" : "border-transparent text-gray-500 hover:text-gray-800")}
                    >
                        {t('partners.modal.contract')}
                        {contractStep === 3 && <CheckCircle size={14} className="text-green-500" />}
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
                    
                    {/* PROFILE TAB */}
                    {modalTab === 'profile' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-gray-900 mb-4">{t('partners.about')} {selectedPartner.name}</h3>
                                    <p className="text-gray-600 leading-relaxed">{selectedPartner.description}</p>
                                    <div className="mt-6 flex gap-2 flex-wrap">
                                        {selectedPartner.specialties.map(s => (
                                            <span key={s} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg uppercase border border-gray-200">{s}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-bold text-gray-900">{t('partners.performance')}</h3>
                                        <select className="text-xs bg-gray-50 border-none rounded-lg px-2 py-1">
                                            <option>{t('common.last12m')}</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                         <div className="p-4 bg-green-50 rounded-xl">
                                            <p className="text-2xl font-bold text-green-700">{selectedPartner.dealsClosed}</p>
                                            <p className="text-[10px] font-bold text-green-600 uppercase mt-1">{t('partners.deals')}</p>
                                         </div>
                                         <div className="p-4 bg-blue-50 rounded-xl">
                                            <p className="text-2xl font-bold text-blue-700">4.8/5</p>
                                            <p className="text-[10px] font-bold text-blue-600 uppercase mt-1">{t('partners.rating')}</p>
                                         </div>
                                         <div className="p-4 bg-purple-50 rounded-xl">
                                            <p className="text-2xl font-bold text-purple-700">98%</p>
                                            <p className="text-[10px] font-bold text-purple-600 uppercase mt-1">{t('partners.response')}</p>
                                         </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-gray-900 mb-6">{t('partners.contact')}</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500"><Globe size={16} /></div>
                                            <span className="font-medium text-gray-700">www.website.com</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500"><Mail size={16} /></div>
                                            <span className="font-medium text-gray-700">contact@{selectedPartner.name.replace(/\s+/g, '').toLowerCase()}.com</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500"><Phone size={16} /></div>
                                            <span className="font-medium text-gray-700">+966 50 000 0000</span>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                        <button 
                                            onClick={() => setModalTab('contract')}
                                            className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-200"
                                        >
                                            <Handshake size={18} /> {t('partners.request')}
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl text-white shadow-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Award className="text-yellow-400" size={24} />
                                        <span className="font-bold text-lg">{t('partners.score')}</span>
                                    </div>
                                    <div className="flex items-end gap-2 mb-4">
                                        <span className="text-5xl font-extrabold">{selectedPartner.nawafizScore}</span>
                                        <span className="text-gray-400 text-lg font-medium mb-1">/ 100</span>
                                    </div>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        This partner is ranked #{selectedPartner.rank} in {selectedPartner.location} based on trust, transaction volume, and client feedback.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* INVENTORY TAB */}
                    {modalTab === 'inventory' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                             <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-900 text-lg">{selectedPartner.activeListingsCount} {t('partners.activeProjects')}</h3>
                                <div className="flex gap-2">
                                    <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"><Filter size={18} /></button>
                                    <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold">View All</button>
                                </div>
                             </div>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group cursor-pointer">
                                        <div className="h-48 relative overflow-hidden">
                                            <img src={`https://images.unsplash.com/photo-${i % 2 === 0 ? '1512917774080-9991f1c4c750' : '1600596542815-22b845069566'}?auto=format&fit=crop&w=800`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            <span className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase">Selling</span>
                                        </div>
                                        <div className="p-5">
                                            <h4 className="font-bold text-gray-900 text-lg mb-1">Luxury Project {String.fromCharCode(64+i)}</h4>
                                            <p className="text-sm text-gray-500 mb-4 flex items-center gap-1"><MapPin size={14} /> {selectedPartner.location}</p>
                                            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">{t('partners.avgPrice')}</p>
                                                    <p className="font-bold text-gray-900">1.2M SAR</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">{t('partners.commission')}</p>
                                                    <p className="font-bold text-brand-600">{selectedPartner.collaborationRate}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}

                    {/* CONTRACT TAB */}
                    {modalTab === 'contract' && (
                        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
                             {/* Stepper */}
                             <div className="flex items-center justify-center mb-10">
                                <div className={clsx("flex flex-col items-center gap-2", contractStep >= 1 ? "text-brand-600" : "text-gray-300")}>
                                    <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors", contractStep >= 1 ? "bg-brand-50 border-brand-600" : "border-gray-200")}>1</div>
                                    <span className="text-xs font-bold uppercase">Terms</span>
                                </div>
                                <div className={clsx("w-20 h-0.5 mx-2", contractStep >= 2 ? "bg-brand-600" : "bg-gray-200")}></div>
                                <div className={clsx("flex flex-col items-center gap-2", contractStep >= 2 ? "text-brand-600" : "text-gray-300")}>
                                    <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors", contractStep >= 2 ? "bg-brand-50 border-brand-600" : "border-gray-200")}>2</div>
                                    <span className="text-xs font-bold uppercase">Review</span>
                                </div>
                                <div className={clsx("w-20 h-0.5 mx-2", contractStep >= 3 ? "bg-brand-600" : "bg-gray-200")}></div>
                                <div className={clsx("flex flex-col items-center gap-2", contractStep >= 3 ? "text-brand-600" : "text-gray-300")}>
                                    <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors", contractStep >= 3 ? "bg-brand-50 border-brand-600" : "border-gray-200")}>3</div>
                                    <span className="text-xs font-bold uppercase">Sign</span>
                                </div>
                             </div>

                             {/* Step 1: Terms */}
                             {contractStep === 1 && (
                                 <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                                     <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">{t('partners.terms')}</h3>
                                     <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
                                         <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                                             <span className="font-medium text-gray-600">{t('partners.sai')}</span>
                                             <span className="font-bold text-gray-900 text-lg">2.5%</span>
                                         </div>
                                         <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                                             <span className="font-medium text-gray-600">{t('partners.split')}</span>
                                             <span className="font-bold text-brand-600 text-lg">{selectedPartner.collaborationRate}</span>
                                         </div>
                                         <div className="flex justify-between items-center">
                                             <span className="font-medium text-gray-600">{t('partners.duration')}</span>
                                             <span className="font-bold text-gray-900">12 Months (Auto-renew)</span>
                                         </div>
                                     </div>
                                     <button 
                                        onClick={handleGenerateContract}
                                        disabled={isProcessing}
                                        className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-200"
                                     >
                                        {isProcessing ? <Loader2 className="animate-spin" /> : <FileText size={20} />}
                                        {t('partners.contract.gen')}
                                     </button>
                                 </div>
                             )}

                             {/* Step 2: Review */}
                             {contractStep === 2 && (
                                 <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                                     <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-gray-900">{t('partners.agreement')}</h3>
                                        <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded uppercase">{t('common.draft')}</span>
                                     </div>
                                     
                                     <div className="h-64 overflow-y-auto bg-gray-50 p-6 rounded-xl border border-gray-200 font-mono text-sm text-gray-600 mb-8 leading-relaxed">
                                         <p className="mb-4"><strong>AGREEMENT DATE:</strong> {new Date().toLocaleDateString()}</p>
                                         <p className="mb-4"><strong>BETWEEN:</strong> {selectedPartner.name} ("First Party") AND [Your Name] ("Second Party").</p>
                                         <p className="mb-4"><strong>WHEREAS:</strong> The First Party is a licensed {selectedPartner.type} and desires to collaborate with the Second Party for marketing and sales...</p>
                                         <p className="mb-4"><strong>TERMS:</strong> The Parties agree that the Second Party shall be entitled to a commission split of {selectedPartner.collaborationRate} upon successful closure of any deal listed in the First Party's inventory...</p>
                                         <p className="mb-4">This contract is generated automatically by the Nawafiz Platform and is legally binding under the laws of the Kingdom of Saudi Arabia.</p>
                                     </div>

                                     <div className="flex gap-4">
                                         <button onClick={() => setContractStep(1)} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50">{t('common.return')}</button>
                                         <button 
                                            onClick={handleSignContract}
                                            disabled={isProcessing}
                                            className="flex-[2] py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                                         >
                                            {isProcessing ? <Loader2 className="animate-spin" /> : <PenTool size={20} />}
                                            {t('partners.contract.sign')}
                                         </button>
                                     </div>
                                 </div>
                             )}

                             {/* Step 3: Signed */}
                             {contractStep === 3 && (
                                 <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm text-center">
                                     <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 animate-in zoom-in duration-300">
                                        <CheckCircle size={48} />
                                     </div>
                                     <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('partners.active')}</h3>
                                     <p className="text-gray-500 max-w-md mx-auto mb-8">
                                         You are now officially partnered with <strong>{selectedPartner.name}</strong>. You can access their full inventory and start closing deals immediately.
                                     </p>
                                     <div className="flex justify-center gap-4">
                                         <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 flex items-center gap-2">
                                             <Download size={18} /> {t('common.download')}
                                         </button>
                                         <button onClick={() => setSelectedPartner(null)} className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800">
                                             {t('common.return')}
                                         </button>
                                     </div>
                                 </div>
                             )}
                        </div>
                    )}
                </div>
            </div>
         </div>
      )}
    </div>
  );
};
