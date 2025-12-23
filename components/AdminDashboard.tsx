
import React, { useState } from 'react';
import { 
  Users, Shield, Activity, Server, Search, Filter, 
  Edit, Trash2, CheckCircle, XCircle, AlertTriangle,
  BarChart3, Database, Lock, Settings, FileSearch, 
  FileText, Gavel, Ban, DollarSign, Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { User, UserRole } from '../types';
import clsx from 'clsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// Mock Data for Admin
const KYC_REQUESTS = [
  { id: 1, name: "Roshn Development", type: "Developer", docId: "CR-1010998877", status: "Pending", date: "2024-06-20" },
  { id: 2, name: "Khalid Agent", type: "Broker", docId: "FAL-1100239481", status: "Pending", date: "2024-06-21" },
  { id: 3, name: "Elite Homes", type: "Broker", docId: "FAL-1100556677", status: "Rejected", date: "2024-06-19" },
];

const AUDIT_LOGS = [
  { id: 101, time: "10:00 AM", actor: "Broker A", action: "Registered Client", details: "Client: 050xxxx123 (Sedra)" },
  { id: 102, time: "10:05 AM", actor: "Broker B", action: "Attempted Registration", details: "Blocked: Duplicate Lead 050xxxx123" },
  { id: 103, time: "11:30 AM", actor: "System", action: "Payout Released", details: "To Broker A (Deal #901)" },
  { id: 104, time: "01:15 PM", actor: "Dev Admin", action: "Updated Inventory", details: "Unit V-102 status: Sold" },
];

const FINANCIAL_STATS = [
  { name: 'Jan', revenue: 120000 },
  { name: 'Feb', revenue: 150000 },
  { name: 'Mar', revenue: 180000 },
  { name: 'Apr', revenue: 220000 },
  { name: 'May', revenue: 250000 },
  { name: 'Jun', revenue: 310000 },
];

export const AdminDashboard: React.FC = () => {
  const { users, editUser, deleteUser } = useAuth();
  const { t, dir } = useLanguage();
  const [activeTab, setActiveTab] = useState<'kyc' | 'users' | 'finance' | 'audit'>('kyc');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | UserRole>('All');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [kycList, setKycList] = useState(KYC_REQUESTS);

  // Filter Users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Stats
  const totalUsers = users.length;
  const activeContractsToday = 14;
  const totalCommission = "1.2M";

  const handleKycAction = (id: number, action: 'Approve' | 'Reject') => {
      setKycList(prev => prev.filter(item => item.id !== id));
      alert(`Request ${action}d successfully.`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to ban this user?')) {
      deleteUser(id);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Admin Header (Control Tower) */}
      <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                        <Shield size={24} className="text-brand-400" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-400 border border-brand-500/30 px-3 py-1 rounded-full bg-brand-900/50">
                        Super Admin
                    </span>
                </div>
                <h2 className="text-4xl font-extrabold tracking-tight">{t('admin.title')}</h2>
                <p className="text-gray-400 mt-2 max-w-xl">{t('admin.subtitle')}</p>
            </div>
            
            {/* Live Counters */}
            <div className="flex gap-4">
                 <div className="text-center bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 min-w-[120px]">
                    <p className="text-3xl font-bold text-white mb-1">{activeContractsToday}</p>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">{t('admin.stats.health')}</p>
                 </div>
                 <div className="text-center bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 min-w-[120px]">
                    <p className="text-3xl font-bold text-brand-400 mb-1">{totalCommission}</p>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">{t('admin.stats.revenue')}</p>
                 </div>
            </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-4 border-b border-gray-200 pb-1">
         {[
           { id: 'kyc', icon: FileSearch, label: t('admin.tabs.kyc') },
           { id: 'users', icon: Users, label: t('admin.tabs.users') },
           { id: 'finance', icon: DollarSign, label: t('admin.tabs.finance') },
           { id: 'audit', icon: Gavel, label: t('admin.tabs.audit') },
         ].map(tab => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={clsx(
               "flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap",
               activeTab === tab.id 
                 ? "border-gray-900 text-gray-900" 
                 : "border-transparent text-gray-500 hover:text-gray-800"
             )}
           >
             <tab.icon size={18} /> {tab.label}
             {tab.id === 'kyc' && kycList.length > 0 && (
                 <span className="ml-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{kycList.length}</span>
             )}
           </button>
         ))}
      </div>

      {/* --- TAB: KYC HUB --- */}
      {activeTab === 'kyc' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
              <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-orange-50/50">
                          <h3 className="font-bold text-gray-900 flex items-center gap-2">
                              <AlertTriangle size={20} className="text-orange-500" />
                              {t('admin.kyc.pending')}
                          </h3>
                      </div>
                      <div className="divide-y divide-gray-100">
                          {kycList.length === 0 ? (
                              <div className="p-8 text-center text-gray-500">
                                  <CheckCircle size={48} className="mx-auto mb-4 text-green-500/20" />
                                  <p>All requests processed.</p>
                              </div>
                          ) : (
                              kycList.map(req => (
                                  <div key={req.id} className="p-6 hover:bg-gray-50 transition-colors">
                                      <div className="flex justify-between items-start mb-4">
                                          <div>
                                              <h4 className="font-bold text-lg text-gray-900">{req.name}</h4>
                                              <p className="text-sm text-gray-500">{req.type} • Registered: {req.date}</p>
                                          </div>
                                          <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded uppercase">Pending Review</span>
                                      </div>
                                      
                                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex items-center justify-between mb-6">
                                          <div className="flex items-center gap-3">
                                              <div className="p-2 bg-white rounded-lg border border-gray-200"><FileText size={16} className="text-gray-500" /></div>
                                              <div>
                                                  <p className="text-xs font-bold text-gray-500 uppercase">{t('admin.kyc.doc')}</p>
                                                  <p className="font-mono font-bold text-gray-900">{req.docId}</p>
                                              </div>
                                          </div>
                                          <button className="text-xs text-blue-600 font-bold hover:underline">View Document</button>
                                      </div>

                                      <div className="flex gap-3">
                                          <button 
                                            onClick={() => handleKycAction(req.id, 'Approve')}
                                            className="flex-1 py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 shadow-sm flex items-center justify-center gap-2"
                                          >
                                              <CheckCircle size={16} /> {t('common.approve')}
                                          </button>
                                          <button 
                                            onClick={() => handleKycAction(req.id, 'Reject')}
                                            className="flex-1 py-2 bg-white border border-red-200 text-red-600 rounded-lg font-bold text-sm hover:bg-red-50 flex items-center justify-center gap-2"
                                          >
                                              <XCircle size={16} /> {t('common.reject')}
                                          </button>
                                      </div>
                                  </div>
                              ))
                          )}
                      </div>
                  </div>
              </div>

              <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <h3 className="font-bold text-gray-900 mb-4">Verification Rules</h3>
                      <ul className="space-y-3 text-sm text-gray-600">
                          <li className="flex items-start gap-2">
                              <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
                              <span>Brokers must have a valid FAL License number (1100...).</span>
                          </li>
                          <li className="flex items-start gap-2">
                              <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
                              <span>Developers must provide valid Commercial Registration (CR).</span>
                          </li>
                          <li className="flex items-start gap-2">
                              <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
                              <span>IBAN must match the legal entity name.</span>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>
      )}

      {/* --- TAB: USERS --- */}
      {activeTab === 'users' && (
         <div className="space-y-6 animate-slide-up">
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                   <Search className="absolute top-3 left-3 text-gray-400" size={18} />
                   <input 
                     type="text" 
                     placeholder="Search users..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                   />
                </div>
                <div className="flex gap-2">
                   <select 
                     value={roleFilter} 
                     onChange={(e) => setRoleFilter(e.target.value as any)}
                     className="px-4 py-2 border border-gray-200 rounded-xl outline-none bg-gray-50 font-medium text-sm"
                   >
                      <option value="All">{t('admin.filter.all')}</option>
                      <option value="investor">Investor</option>
                      <option value="agent">Broker</option>
                      <option value="developer">Developer</option>
                      <option value="admin">Admin</option>
                   </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                   <thead className="bg-gray-50 text-gray-500 font-bold uppercase">
                      <tr>
                         <th className="px-6 py-4">{t('admin.table.user')}</th>
                         <th className="px-6 py-4">{t('admin.table.role')}</th>
                         <th className="px-6 py-4">{t('admin.table.status')}</th>
                         <th className="px-6 py-4 text-right">{t('admin.table.actions')}</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {filteredUsers.map(user => (
                         <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                                     {user.avatar}
                                  </div>
                                  <div>
                                     <p className="font-bold text-gray-900">{user.name}</p>
                                     <p className="text-xs text-gray-500">{user.email}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <span className={clsx(
                                   "px-3 py-1 rounded-full text-xs font-bold border uppercase",
                                   user.role === 'admin' ? "bg-purple-100 text-purple-700 border-purple-200" :
                                   user.role === 'developer' ? "bg-amber-100 text-amber-700 border-amber-200" :
                                   user.role === 'agent' ? "bg-blue-100 text-blue-700 border-blue-200" :
                                   "bg-green-100 text-green-700 border-green-200"
                               )}>
                                  {user.role}
                               </span>
                            </td>
                            <td className="px-6 py-4">
                               <span className="flex items-center gap-1 text-green-600 font-bold text-xs">
                                  <CheckCircle size={14} /> Active
                               </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                               <div className="flex justify-end gap-2">
                                  <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-blue-600 transition-colors" title={t('admin.editUser')}><Edit size={16} /></button>
                                  <button onClick={() => handleDelete(user.id)} className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors" title={t('common.ban')}><Ban size={16} /></button>
                               </div>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
            </div>
         </div>
      )}

      {/* --- TAB: FINANCE --- */}
      {activeTab === 'finance' && (
          <div className="space-y-6 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-2">Total Commission (YTD)</p>
                      <p className="text-3xl font-bold text-gray-900">1,250,400 SAR</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-2">{t('admin.finance.subs')}</p>
                      <p className="text-3xl font-bold text-brand-600">45 Active</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-2">{t('admin.finance.pending')}</p>
                      <p className="text-3xl font-bold text-yellow-600">125,000 SAR</p>
                  </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-6">Platform Revenue Trend</h3>
                  <div className="h-72 w-full" dir="ltr">
                      <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={FINANCIAL_STATS}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#94a3b8" />
                              <YAxis axisLine={false} tickLine={false} stroke="#94a3b8" />
                              <Tooltip />
                              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981'}} />
                          </LineChart>
                      </ResponsiveContainer>
                  </div>
              </div>
          </div>
      )}

      {/* --- TAB: AUDIT (DISPUTE RESOLUTION) --- */}
      {activeTab === 'audit' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                          <FileSearch size={20} className="text-blue-600" /> {t('admin.audit.log')}
                      </h3>
                      <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Search log..." 
                            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none"
                          />
                      </div>
                  </div>
                  <div className="divide-y divide-gray-100">
                      {AUDIT_LOGS.map(log => (
                          <div key={log.id} className="p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                              <div className="min-w-[80px] text-xs font-bold text-gray-400 flex items-center gap-1">
                                  <Clock size={12} /> {log.time}
                              </div>
                              <div className="flex-1">
                                  <p className="text-sm font-bold text-gray-900">
                                      <span className="text-blue-600">{log.actor}</span> : {log.action}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1 bg-gray-100 inline-block px-2 py-1 rounded border border-gray-200">
                                      {log.details}
                                  </p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-fit">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Gavel size={20} className="text-red-600" /> Dispute Resolver
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                      Use the timeline to determine which broker has priority over a specific lead.
                  </p>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Lead Phone / ID</label>
                          <input type="text" className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="05xxxxxxxx" />
                      </div>
                      <button className="w-full py-2 bg-gray-900 text-white rounded-lg font-bold text-sm">
                          Trace History
                      </button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};
