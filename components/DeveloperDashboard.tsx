
import React, { useState } from 'react';
import { 
    Building, Users, Wallet, Briefcase, TrendingUp, Plus, 
    ArrowUpRight, BarChart3, FileText, CheckCircle, Bell, 
    Search, Filter, MoreHorizontal, Phone, Mail, ShieldCheck, 
    Star, MapPin, Box, LayoutGrid, Image, Download, Share2,
    Shield, AlertTriangle, Clock, Sparkles, Map, Target, X, Loader2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { ProjectUnit, MarketingAsset } from '../types';
import clsx from 'clsx';

// Mock Data
const SALES_DATA = [
  { month: 'Jan', value: 4200000 },
  { month: 'Feb', value: 5800000 },
  { month: 'Mar', value: 5100000 },
  { month: 'Apr', value: 7200000 },
  { month: 'May', value: 8500000 },
  { month: 'Jun', value: 9800000 },
];

const INITIAL_PROJECTS = [
  { id: 1, name: 'Sedra Phase 2', location: 'Riyadh', totalUnits: 450, soldUnits: 380, revenue: 152000000, status: 'Active' },
  { id: 2, name: 'Al-Arous Community', location: 'Jeddah', totalUnits: 200, soldUnits: 45, revenue: 28000000, status: 'New Launch' },
  { id: 3, name: 'Warefa', location: 'Riyadh', totalUnits: 180, soldUnits: 180, revenue: 95000000, status: 'Sold Out' },
];

// Mock Units for Live Inventory
const MOCK_UNITS: ProjectUnit[] = [
    { id: 'U101', unitNumber: 'V-101', projectId: '1', type: 'Villa', area: 350, price: 2500000, status: 'Available', lastUpdated: '10 mins ago' },
    { id: 'U102', unitNumber: 'V-102', projectId: '1', type: 'Villa', area: 350, price: 2500000, status: 'Reserved', lastUpdated: '2 hours ago' },
    { id: 'U103', unitNumber: 'V-103', projectId: '1', type: 'Villa', area: 400, price: 2800000, status: 'Sold', lastUpdated: '1 day ago' },
    { id: 'U104', unitNumber: 'A-201', projectId: '2', type: 'Apartment', area: 150, price: 850000, status: 'Available', lastUpdated: 'Just now' },
    { id: 'U105', unitNumber: 'A-202', projectId: '2', type: 'Apartment', area: 150, price: 850000, status: 'Available', lastUpdated: 'Just now' },
    { id: 'U106', unitNumber: 'V-104', projectId: '1', type: 'Villa', area: 450, price: 3200000, status: 'Blocked', lastUpdated: '3 days ago' },
];

// Mock Marketing Assets
const MARKETING_ASSETS: MarketingAsset[] = [
    { id: 'M1', title: 'Sedra Project Brochure', type: 'Brochure', url: '#', fileSize: '12 MB', downloads: 450 },
    { id: 'M2', title: 'Villa Type A - 4K Renders', type: 'Image', url: '#', fileSize: '85 MB', downloads: 1200 },
    { id: 'M3', title: 'Community Walkthrough', type: 'Video', url: '#', fileSize: '240 MB', downloads: 85 },
    { id: 'M4', title: 'Floorplans - All Units', type: 'Floorplan', url: '#', fileSize: '15 MB', downloads: 600 },
];

// Mock Leads for Protection
const PROTECTED_LEADS = [
    { id: 'L1', client: 'Abdullah Al-Faisal', broker: 'Century 21', date: '2024-06-15', expiry: '2024-08-15', status: 'Protected' },
    { id: 'L2', client: 'Sara Ahmed', broker: 'Elite Homes', date: '2024-06-10', expiry: '2024-08-10', status: 'Protected' },
    { id: 'L3', client: 'Mohammed Ali', broker: 'Independent', date: '2024-04-01', expiry: '2024-06-01', status: 'Expired' },
];

const BROKERS_LIST = [
  { 
    id: 1, name: 'Century 21 Saudi', type: 'Agency', location: 'Riyadh', 
    salesVolume: 45000000, dealsClosed: 24, activeLeads: 15, 
    status: 'Platinum', logo: 'C21', rating: 4.9,
    contact: { name: 'Khalid Al-Otaibi', phone: '0501234567', email: 'khalid@c21.sa' }
  },
  { 
    id: 2, name: 'Elite Homes', type: 'Agency', location: 'Jeddah', 
    salesVolume: 12500000, dealsClosed: 8, activeLeads: 4, 
    status: 'Gold', logo: 'EH', rating: 4.7,
    contact: { name: 'Sarah Smith', phone: '0559876543', email: 'sarah@elite.sa' }
  },
  { 
    id: 3, name: 'Ahmed Real Estate', type: 'Freelancer', location: 'Dammam', 
    salesVolume: 5000000, dealsClosed: 3, activeLeads: 2, 
    status: 'Silver', logo: 'AR', rating: 4.5,
    contact: { name: 'Ahmed Ali', phone: '0599887766', email: 'ahmed@gmail.com' }
  }
];

export const DeveloperDashboard: React.FC = () => {
  const { t, dir } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'inventory' | 'marketing' | 'partners' | 'protection' | 'ai'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('All');
  
  // Data States
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [units, setUnits] = useState(MOCK_UNITS);

  // Modal States
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  
  // Form States
  const [newProject, setNewProject] = useState({ name: '', location: '', units: '', status: 'New Launch' });
  const [reportType, setReportType] = useState('sales');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Handlers
  const handleStatusChange = (id: string, newStatus: string) => {
      setUnits(prev => prev.map(u => u.id === id ? { ...u, status: newStatus as any, lastUpdated: 'Just now' } : u));
  };

  const handleAddProject = (e: React.FormEvent) => {
      e.preventDefault();
      const project = {
          id: Date.now(),
          name: newProject.name,
          location: newProject.location,
          totalUnits: Number(newProject.units),
          soldUnits: 0,
          revenue: 0,
          status: newProject.status
      };
      setProjects([...projects, project]);
      setProjectModalOpen(false);
      setNewProject({ name: '', location: '', units: '', status: 'New Launch' });
      setActiveTab('projects');
  };

  const handleGenerateReport = () => {
      setIsGeneratingReport(true);
      setTimeout(() => {
          setIsGeneratingReport(false);
          setReportModalOpen(false);
          alert("Report generated and downloaded successfully.");
      }, 2000);
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'Available': return 'bg-green-100 text-green-700';
          case 'Reserved': return 'bg-yellow-100 text-yellow-700';
          case 'Sold': return 'bg-red-100 text-red-700';
          case 'Blocked': return 'bg-gray-100 text-gray-600';
          default: return 'bg-gray-100';
      }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Building className="text-brand-600" />
            {t('dev.title')}
          </h2>
          <p className="text-gray-500 mt-1">{t('dev.subtitle')}</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={() => setReportModalOpen(true)}
                className="bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
               <FileText size={18} /> Reports
            </button>
            <button 
                onClick={() => setProjectModalOpen(true)}
                className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 shadow-lg shadow-gray-900/20 transition-all flex items-center justify-center gap-2"
            >
            <Plus size={20} />
            {t('dev.btn.newProject')}
            </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 flex gap-6 overflow-x-auto no-scrollbar">
        {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'projects', label: 'Projects', icon: Building },
            { id: 'inventory', label: 'Live Inventory', icon: Box },
            { id: 'marketing', label: 'Marketing Kit', icon: Image },
            { id: 'partners', label: 'Broker Partners', icon: Users },
            { id: 'protection', label: 'Lead Protection', icon: ShieldCheck },
            { id: 'ai', label: 'AI Intelligence', icon: Sparkles },
        ].map(tab => (
            <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={clsx(
                    "pb-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap", 
                    activeTab === tab.id ? "border-brand-600 text-brand-600" : "border-transparent text-gray-500 hover:text-gray-800"
                )}
            >
                <tab.icon size={18} /> {tab.label}
            </button>
        ))}
      </div>

      {/* --- TAB: OVERVIEW --- */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-slide-up">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Wallet size={24} /></div>
                        <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <TrendingUp size={12} /> +14%
                        </span>
                    </div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{t('dev.stats.revenue')}</p>
                    <h3 className="text-2xl font-bold text-gray-900">275M <span className="text-sm font-normal text-gray-400">SAR</span></h3>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Box size={24} /></div>
                    </div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{t('dev.stats.units')}</p>
                    <h3 className="text-2xl font-bold text-gray-900">605 <span className="text-sm font-normal text-gray-400">/ 830</span></h3>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3">
                        <div className="bg-blue-500 w-[72%] h-full rounded-full"></div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Briefcase size={24} /></div>
                        <span className="flex items-center gap-1 text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                            12 New
                        </span>
                    </div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{t('dev.stats.brokers')}</p>
                    <h3 className="text-2xl font-bold text-gray-900">142</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><ShieldCheck size={24} /></div>
                    </div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{t('dev.stats.leads')}</p>
                    <h3 className="text-2xl font-bold text-gray-900">1,250</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <BarChart3 className="text-brand-600" size={20} />
                            {t('dev.chart.sales')}
                        </h3>
                    </div>
                    <div className="h-80 w-full" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={SALES_DATA}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" stroke="#94a3b8" axisLine={false} tickLine={false} />
                                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tickFormatter={(val) => `${(val/1000000).toFixed(1)}M`} />
                                <Tooltip 
                                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                                    formatter={(val: number) => `${(val/1000000).toFixed(2)}M SAR`}
                                />
                                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Brokers */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Star className="text-brand-600" size={20} />
                        Top Performing Brokers
                    </h3>
                    <div className="space-y-4">
                        {BROKERS_LIST.slice(0,2).map((broker) => (
                            <div key={broker.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                                        {broker.logo}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-900">{broker.name}</p>
                                        <p className="text-xs text-gray-500">{broker.dealsClosed} Deals Closed</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-brand-600 text-sm">{(broker.salesVolume / 1000000).toFixed(1)}M</p>
                                    <p className="text-[10px] text-gray-400">Revenue</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button 
                        onClick={() => setActiveTab('partners')}
                        className="w-full mt-6 py-3 bg-gray-50 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors"
                    >
                        View All Brokers
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- TAB: PROJECTS --- */}
      {activeTab === 'projects' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 text-lg">{t('dev.projects.title')}</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 text-start">{t('dev.table.project')}</th>
                            <th className="px-6 py-4 text-start">{t('dev.projects.progress')}</th>
                            <th className="px-6 py-4 text-center">{t('dev.table.units')}</th>
                            <th className="px-6 py-4 text-end">{t('dev.table.rev')}</th>
                            <th className="px-6 py-4 text-center">{t('dev.table.status')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {projects.map((project) => (
                            <tr key={project.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setActiveTab('inventory')}>
                                <td className="px-6 py-4">
                                    <p className="font-bold text-gray-900">{project.name}</p>
                                    <p className="text-xs text-gray-500">{project.location}</p>
                                </td>
                                <td className="px-6 py-4 w-1/3">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-medium text-gray-600">{Math.round((project.soldUnits / project.totalUnits) * 100)}%</span>
                                        <span className="text-gray-400">{project.soldUnits}/{project.totalUnits}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <div 
                                          className="bg-brand-500 h-full rounded-full" 
                                          style={{width: `${(project.soldUnits / project.totalUnits) * 100}%`}}
                                        ></div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center font-medium text-gray-700">
                                    {project.totalUnits}
                                </td>
                                <td className="px-6 py-4 text-end font-bold text-gray-900 font-mono">
                                    {(project.revenue / 1000000).toFixed(1)}M
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={clsx(
                                        "px-3 py-1 rounded-full text-xs font-bold uppercase",
                                        project.status === 'Active' ? "bg-green-100 text-green-700" :
                                        project.status === 'New Launch' ? "bg-blue-100 text-blue-700" :
                                        "bg-gray-100 text-gray-600"
                                    )}>
                                        {project.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {/* --- TAB: LIVE INVENTORY --- */}
      {activeTab === 'inventory' && (
          <div className="space-y-6 animate-slide-up">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex gap-4">
                      <div className="relative min-w-[200px]">
                         <select 
                            className="w-full p-2.5 bg-gray-50 rounded-xl border-transparent outline-none text-sm font-bold"
                            value={selectedProjectFilter}
                            onChange={(e) => setSelectedProjectFilter(e.target.value)}
                         >
                             <option value="All">All Projects</option>
                             <option value="1">Sedra Phase 2</option>
                             <option value="2">Al-Arous Community</option>
                         </select>
                      </div>
                      <div className="flex gap-2 overflow-x-auto no-scrollbar">
                          {['Available', 'Reserved', 'Sold', 'Blocked'].map(s => (
                              <button key={s} className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 whitespace-nowrap">
                                  {s}
                              </button>
                          ))}
                      </div>
                  </div>
                  <div className="flex gap-2">
                      <button className="px-4 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-800">
                          <Plus size={16} /> Add Unit
                      </button>
                      <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50">
                          Bulk Upload
                      </button>
                  </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                          <tr>
                              <th className="px-6 py-4">Unit ID</th>
                              <th className="px-6 py-4">Type</th>
                              <th className="px-6 py-4">Area (m²)</th>
                              <th className="px-6 py-4">Price (SAR)</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4">Last Update</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {units.map(unit => (
                              <tr key={unit.id} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-6 py-4 font-bold text-gray-900">{unit.unitNumber}</td>
                                  <td className="px-6 py-4">{unit.type}</td>
                                  <td className="px-6 py-4">{unit.area}</td>
                                  <td className="px-6 py-4 font-mono font-medium">{unit.price.toLocaleString()}</td>
                                  <td className="px-6 py-4">
                                      <select 
                                        className={clsx("px-2 py-1 rounded-lg text-xs font-bold border-none outline-none cursor-pointer", getStatusColor(unit.status))}
                                        value={unit.status}
                                        onChange={(e) => handleStatusChange(unit.id, e.target.value)}
                                      >
                                          <option value="Available">Available</option>
                                          <option value="Reserved">Reserved</option>
                                          <option value="Sold">Sold</option>
                                          <option value="Blocked">Blocked</option>
                                      </select>
                                  </td>
                                  <td className="px-6 py-4 text-gray-500 text-xs">{unit.lastUpdated}</td>
                                  <td className="px-6 py-4 text-right">
                                      <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={16} /></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      )}

      {/* --- TAB: MARKETING KIT --- */}
      {activeTab === 'marketing' && (
          <div className="space-y-6 animate-slide-up">
              <div className="flex justify-between items-center bg-gradient-to-r from-brand-600 to-brand-700 p-8 rounded-2xl text-white shadow-lg">
                  <div>
                      <h3 className="text-2xl font-bold mb-2">Digital Marketing Kit</h3>
                      <p className="text-brand-100 max-w-xl">
                          Upload high-quality assets for your brokers. Providing professional photos, videos, and brochures increases sales velocity by 40%.
                      </p>
                  </div>
                  <button className="bg-white text-brand-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-gray-50 flex items-center gap-2">
                      <Plus size={18} /> Upload Assets
                  </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {MARKETING_ASSETS.map(asset => (
                      <div key={asset.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all group">
                          <div className="h-32 bg-gray-100 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                              {asset.type === 'Image' && <Image size={32} className="text-gray-400" />}
                              {asset.type === 'Video' && <div className="w-10 h-10 rounded-full bg-gray-900/20 flex items-center justify-center"><div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-gray-700 border-b-[6px] border-b-transparent ml-1"></div></div>}
                              {asset.type === 'Brochure' && <FileText size={32} className="text-gray-400" />}
                              {asset.type === 'Floorplan' && <LayoutGrid size={32} className="text-gray-400" />}
                              
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <button className="p-2 bg-white rounded-full text-gray-900 hover:bg-gray-100"><Download size={16} /></button>
                                  <button className="p-2 bg-white rounded-full text-gray-900 hover:bg-gray-100"><Share2 size={16} /></button>
                              </div>
                          </div>
                          <h4 className="font-bold text-gray-900 text-sm mb-1 truncate">{asset.title}</h4>
                          <div className="flex justify-between items-center text-xs text-gray-500">
                              <span>{asset.type} • {asset.fileSize}</span>
                              <span>{asset.downloads} DLs</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* --- TAB: BROKER PARTNERS (Directory) --- */}
      {activeTab === 'partners' && (
          <div className="space-y-6 animate-slide-up">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex gap-4 items-center flex-1 w-full">
                      <div className="relative flex-1 max-w-md">
                          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                          <input 
                            type="text" 
                            placeholder="Search brokers by name, ID, or location..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                          />
                      </div>
                      <div className="flex gap-2">
                          <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600"><Filter size={18} /></button>
                      </div>
                  </div>
                  <div className="flex gap-2">
                      <button className="px-4 py-2 bg-brand-600 text-white rounded-xl font-bold text-sm hover:bg-brand-700">Invite Broker</button>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {BROKERS_LIST.map((broker) => (
                      <div key={broker.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-6">
                          <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-700 text-lg">
                                      {broker.logo}
                                  </div>
                                  <div>
                                      <h4 className="font-bold text-gray-900 text-lg leading-tight">{broker.name}</h4>
                                      <p className="text-xs text-gray-500">{broker.location} • {broker.type}</p>
                                  </div>
                              </div>
                              <span className={clsx("px-2 py-1 rounded text-xs font-bold uppercase", 
                                  broker.status === 'Platinum' ? "bg-purple-100 text-purple-700" : 
                                  broker.status === 'Gold' ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"
                              )}>
                                  {broker.status}
                              </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-6">
                              <div className="bg-gray-50 p-3 rounded-xl text-center">
                                  <p className="text-xs text-gray-400 uppercase font-bold">Sales Vol</p>
                                  <p className="font-bold text-brand-600 text-sm">{(broker.salesVolume / 1000000).toFixed(1)}M</p>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-xl text-center">
                                  <p className="text-xs text-gray-400 uppercase font-bold">Deals</p>
                                  <p className="font-bold text-gray-900 text-sm">{broker.dealsClosed}</p>
                              </div>
                          </div>

                          <div className="space-y-2 mb-6">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Users size={16} className="text-gray-400" /> {broker.contact.name}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Phone size={16} className="text-gray-400" /> {broker.contact.phone}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Mail size={16} className="text-gray-400" /> {broker.contact.email}
                              </div>
                          </div>

                          <div className="flex gap-2">
                              <button className="flex-1 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50">View Profile</button>
                              <button className="flex-1 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-gray-800">Message</button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* --- TAB: LEAD PROTECTION --- */}
      {activeTab === 'protection' && (
          <div className="space-y-6 animate-slide-up">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-start justify-between gap-6">
                  <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-100 text-green-700 rounded-xl"><ShieldCheck size={24} /></div>
                      <div>
                          <h3 className="font-bold text-lg text-gray-900">Lead Protection System</h3>
                          <p className="text-gray-500 text-sm max-w-md mt-1">
                              Configured to protect broker leads for <strong>60 Days</strong>. Duplicate registrations will be automatically blocked to prevent conflict.
                          </p>
                      </div>
                  </div>
                  <div className="flex gap-3">
                      <button className="px-4 py-2 border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 text-gray-700">Configure Rules</button>
                      <button className="px-4 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800">View Conflict Log</button>
                  </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                      <h3 className="font-bold text-gray-900">Registered Leads Log</h3>
                  </div>
                  <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                          <tr>
                              <th className="px-6 py-4">Client Name</th>
                              <th className="px-6 py-4">Registering Broker</th>
                              <th className="px-6 py-4">Date</th>
                              <th className="px-6 py-4">Protection Expiry</th>
                              <th className="px-6 py-4">Status</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {PROTECTED_LEADS.map(lead => (
                              <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-6 py-4 font-bold text-gray-900">{lead.client}</td>
                                  <td className="px-6 py-4">{lead.broker}</td>
                                  <td className="px-6 py-4">{lead.date}</td>
                                  <td className="px-6 py-4 text-gray-500 flex items-center gap-2">
                                      <Clock size={14} /> {lead.expiry}
                                  </td>
                                  <td className="px-6 py-4">
                                      <span className={clsx("px-2 py-1 rounded-full text-xs font-bold uppercase", lead.status === 'Protected' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                                          {lead.status}
                                      </span>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      )}

      {/* --- TAB: AI INTELLIGENCE --- */}
      {activeTab === 'ai' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Sparkles size={20} className="text-brand-600" /> Smart Pricing Recommendation
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">AI analysis of Sedra Phase 2 suggests adjusting prices for 3-bedroom villas based on recent demand surge.</p>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 mb-4">
                      <div>
                          <p className="text-xs font-bold text-gray-400 uppercase">Current Avg</p>
                          <p className="font-bold text-lg">2.5M SAR</p>
                      </div>
                      <div className="text-center">
                          <ArrowUpRight className="mx-auto text-green-500 mb-1" />
                          <span className="text-xs font-bold text-green-600">+4.2% Potential</span>
                      </div>
                      <div className="text-right">
                          <p className="text-xs font-bold text-gray-400 uppercase">Suggested</p>
                          <p className="font-bold text-lg text-brand-600">2.6M SAR</p>
                      </div>
                  </div>
                  <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm">Apply Strategy</button>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Map size={20} className="text-blue-600" /> Next Best Location
                  </h3>
                  <div className="h-48 bg-blue-50 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                       <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800')] bg-cover bg-center"></div>
                       <div className="relative z-10 text-center">
                           <Target className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                           <p className="font-bold text-blue-900 text-lg">North-East Riyadh (Banban)</p>
                           <p className="text-xs text-blue-700">High growth potential detected</p>
                       </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                      Data indicates a 15% rise in land inquiries in Banban area. Recommended for next mixed-use community project.
                  </p>
                  <button className="w-full py-3 border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50">View Feasibility Report</button>
              </div>
          </div>
      )}

      {/* --- ADD PROJECT MODAL --- */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-900">Add New Project</h3>
                    <button onClick={() => setProjectModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>
                <form onSubmit={handleAddProject} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Project Name</label>
                        <input 
                            type="text" required
                            value={newProject.name}
                            onChange={e => setNewProject({...newProject, name: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="e.g. Sedra Heights"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
                        <input 
                            type="text" required
                            value={newProject.location}
                            onChange={e => setNewProject({...newProject, location: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="e.g. Riyadh, Malqa"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Total Units</label>
                        <input 
                            type="number" required
                            value={newProject.units}
                            onChange={e => setNewProject({...newProject, units: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="e.g. 500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                        <select 
                            value={newProject.status}
                            onChange={e => setNewProject({...newProject, status: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                        >
                            <option value="New Launch">New Launch</option>
                            <option value="Active">Active</option>
                            <option value="Sold Out">Sold Out</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 shadow-lg mt-2">
                        Create Project
                    </button>
                </form>
            </div>
        </div>
      )}

      {/* --- REPORT MODAL --- */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-900">Generate Report</h3>
                    <button onClick={() => setReportModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-600 mb-4">Select the type of report you want to generate. It will be downloaded as a PDF.</p>
                    <div className="space-y-2">
                        {['Sales Performance', 'Inventory Status', 'Broker Analytics', 'Financial Summary'].map((type) => (
                            <label key={type} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                                <input 
                                    type="radio" 
                                    name="reportType"
                                    checked={reportType === type}
                                    onChange={() => setReportType(type)}
                                    className="w-4 h-4 text-brand-600 focus:ring-brand-500"
                                />
                                <span className="text-sm font-medium text-gray-700">{type}</span>
                            </label>
                        ))}
                    </div>
                    <button 
                        onClick={handleGenerateReport}
                        disabled={isGeneratingReport}
                        className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 shadow-lg mt-2 flex items-center justify-center gap-2"
                    >
                        {isGeneratingReport ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                        {isGeneratingReport ? 'Generating...' : 'Download Report'}
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};
