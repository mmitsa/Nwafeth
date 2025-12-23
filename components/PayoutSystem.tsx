
import React, { useState } from 'react';
import { 
  Wallet, TrendingUp, CheckCircle2, Clock, AlertCircle, 
  Download, ArrowRight, Building, FileCheck, ShieldCheck, 
  Banknote, CreditCard, Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { Transaction, DealTracker } from '../types';
import clsx from 'clsx';

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TRX-901', userId: '1', type: 'COMMISSION', amount: 75000, status: 'CLEARED', date: '2024-06-15', reference: 'Deal #104 - Sedra Villa', description: 'Commission Release' },
  { id: 'TRX-902', userId: '1', type: 'WITHDRAWAL', amount: -25000, status: 'PAID', date: '2024-06-18', reference: 'Bank Transfer', description: 'Payout to IBAN ***453' },
  { id: 'TRX-903', userId: '1', type: 'COMMISSION', amount: 12500, status: 'PENDING', date: '2024-06-20', reference: 'Deal #205 - Malqa Apt', description: 'Pending Verification' },
];

const DEAL_PIPELINE: DealTracker[] = [
  { 
    id: 'D-101', leadName: 'Abdullah Al-Faisal', projectName: 'Sedra Phase 2', 
    dealValue: 2850000, commissionAmount: 71250, stage: 'Commission_Released',
    lastUpdated: '2024-06-15', nextAction: 'Ready for Payout'
  },
  { 
    id: 'D-102', leadName: 'Sara Ahmed', projectName: 'Ajdan Rise', 
    dealValue: 1800000, commissionAmount: 45000, stage: 'SPA_Signed',
    lastUpdated: '2024-06-18', nextAction: 'Developer Verification Pending'
  },
];

const EARNINGS_DATA = [
  { month: 'Jan', amount: 15000 },
  { month: 'Feb', amount: 22000 },
  { month: 'Mar', amount: 18000 },
  { month: 'Apr', amount: 35000 },
  { month: 'May', amount: 42000 },
  { month: 'Jun', amount: 75000 },
];

export const PayoutSystem: React.FC = () => {
  const { t, dir } = useLanguage();
  const [activeTab, setActiveTab] = useState<'tracker' | 'history'>('tracker');

  const totalAvailable = 75000 - 25000; // Cleared - Withdrawn
  const totalPending = 12500;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'CLEARED': return 'bg-green-100 text-green-700';
      case 'PAID': return 'bg-blue-100 text-blue-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'REJECTED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStageProgress = (stage: string) => {
    switch(stage) {
      case 'Lead_Protected': return 25;
      case 'SPA_Signed': return 50;
      case 'Developer_Verified': return 75;
      case 'Commission_Released': return 100;
      default: return 0;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Wallet className="text-brand-600" />
            {t('pay.title')}
          </h2>
          <p className="text-gray-500 mt-1">{t('pay.subtitle')}</p>
        </div>
        <button className="bg-brand-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-700 shadow-lg shadow-brand-200 transition-all flex items-center justify-center gap-2 group">
          <Banknote size={20} />
          {t('pay.btn.withdraw')}
        </button>
      </div>

      {/* Earnings Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Balance Card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
           
           <div className="relative z-10">
               <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">{t('pay.balance.avail')}</p>
               <div className="flex items-baseline gap-2 mb-6">
                   <span className="text-5xl font-bold tracking-tight">{totalAvailable.toLocaleString()}</span>
                   <span className="text-xl font-medium text-gray-400">{t('common.sar')}</span>
               </div>

               <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                   <div>
                       <p className="text-xs text-gray-400 mb-1">{t('pay.balance.pending')}</p>
                       <p className="text-xl font-bold text-yellow-400">{totalPending.toLocaleString()} <span className="text-xs">SAR</span></p>
                   </div>
                   <div>
                       <p className="text-xs text-gray-400 mb-1">{t('pay.balance.total')}</p>
                       <p className="text-xl font-bold text-green-400">{(totalAvailable + 25000).toLocaleString()} <span className="text-xs">SAR</span></p>
                   </div>
               </div>
           </div>
        </div>

        {/* Analytics Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Activity className="text-brand-600" size={20} /> Earnings Growth
            </h3>
            <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={EARNINGS_DATA} margin={{top: 5, right: 5, bottom: 5, left: -20}}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} stroke="#94a3b8" fontSize={12} />
                        <YAxis axisLine={false} tickLine={false} stroke="#94a3b8" fontSize={12} />
                        <Tooltip 
                            cursor={{fill: '#f0fdf4'}}
                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                        />
                        <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div>
          <div className="flex gap-4 border-b border-gray-100 mb-6">
              <button 
                onClick={() => setActiveTab('tracker')}
                className={clsx("pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2", activeTab === 'tracker' ? "border-brand-600 text-brand-600" : "border-transparent text-gray-500 hover:text-gray-700")}
              >
                 <Activity size={16} /> {t('pay.tracker.title')}
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={clsx("pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2", activeTab === 'history' ? "border-brand-600 text-brand-600" : "border-transparent text-gray-500 hover:text-gray-700")}
              >
                 <Clock size={16} /> {t('pay.history.title')}
              </button>
          </div>

          {/* TRACKER VIEW */}
          {activeTab === 'tracker' && (
              <div className="space-y-6 animate-slide-up">
                  {DEAL_PIPELINE.map(deal => {
                      const progress = getStageProgress(deal.stage);
                      return (
                          <div key={deal.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
                              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                                  <div>
                                      <div className="flex items-center gap-2 mb-1">
                                          <span className="bg-brand-50 text-brand-700 px-2 py-0.5 rounded text-xs font-bold uppercase border border-brand-100">{deal.projectName}</span>
                                          <span className="text-xs text-gray-400 font-mono">#{deal.id}</span>
                                      </div>
                                      <h3 className="text-lg font-bold text-gray-900">{deal.leadName}</h3>
                                  </div>
                                  <div className="text-right">
                                      <p className="text-xs text-gray-400 font-bold uppercase">Est. Commission</p>
                                      <p className="text-2xl font-bold text-brand-600">{deal.commissionAmount.toLocaleString()} <span className="text-sm text-gray-400 font-normal">SAR</span></p>
                                  </div>
                              </div>

                              {/* Pipeline Stepper */}
                              <div className="relative mb-6">
                                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-100">
                                      <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-brand-600 transition-all duration-1000"></div>
                                  </div>
                                  <div className="flex justify-between text-xs font-medium text-gray-500">
                                      <div className={clsx("flex flex-col items-center gap-1", progress >= 25 ? "text-brand-600 font-bold" : "")}>
                                          <ShieldCheck size={16} /> {t('pay.tracker.stage1')}
                                      </div>
                                      <div className={clsx("flex flex-col items-center gap-1", progress >= 50 ? "text-brand-600 font-bold" : "")}>
                                          <FileCheck size={16} /> {t('pay.tracker.stage2')}
                                      </div>
                                      <div className={clsx("flex flex-col items-center gap-1", progress >= 75 ? "text-brand-600 font-bold" : "")}>
                                          <Building size={16} /> {t('pay.tracker.stage3')}
                                      </div>
                                      <div className={clsx("flex flex-col items-center gap-1", progress >= 100 ? "text-green-600 font-bold" : "")}>
                                          <CheckCircle2 size={16} /> {t('pay.tracker.stage4')}
                                      </div>
                                  </div>
                              </div>

                              <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-2 text-gray-600">
                                      <Clock size={16} /> Last Update: <span className="font-bold">{deal.lastUpdated}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-blue-600 font-medium">
                                      <Activity size={16} /> Next: {deal.nextAction}
                                  </div>
                              </div>
                          </div>
                      );
                  })}
              </div>
          )}

          {/* HISTORY VIEW */}
          {activeTab === 'history' && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-slide-up">
                  <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
                          <tr>
                              <th className="px-6 py-4 text-start">{t('pay.table.ref')}</th>
                              <th className="px-6 py-4 text-start">{t('pay.table.type')}</th>
                              <th className="px-6 py-4 text-start">{t('pay.table.status')}</th>
                              <th className="px-6 py-4 text-end">{t('pay.table.amount')}</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                          {MOCK_TRANSACTIONS.map(trx => (
                              <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-6 py-4">
                                      <p className="font-bold text-gray-900">{trx.reference}</p>
                                      <p className="text-xs text-gray-500">{trx.date}</p>
                                  </td>
                                  <td className="px-6 py-4">
                                      <span className="flex items-center gap-2 text-gray-600 font-medium">
                                          {trx.type === 'COMMISSION' ? <TrendingUp size={16} className="text-green-500" /> : <ArrowRight size={16} className="text-red-500" />}
                                          {trx.type}
                                      </span>
                                  </td>
                                  <td className="px-6 py-4">
                                      <span className={clsx("px-2 py-1 rounded-full text-xs font-bold uppercase", getStatusColor(trx.status))}>
                                          {t(`pay.status.${trx.status.toLowerCase()}`)}
                                      </span>
                                  </td>
                                  <td className={clsx("px-6 py-4 text-end font-bold", trx.amount > 0 ? "text-green-600" : "text-red-600")}>
                                      {trx.amount > 0 ? '+' : ''}{trx.amount.toLocaleString()} SAR
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          )}
      </div>
    </div>
  );
};
