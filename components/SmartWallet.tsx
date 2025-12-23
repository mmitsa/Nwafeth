import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Wallet, TrendingUp, Plus, ArrowUpRight, Download } from 'lucide-react';
import { PortfolioItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const portfolioData: PortfolioItem[] = [
  { id: '1', title: 'Al Malqa Villa', location: 'Riyadh', type: 'Residential', purchasePrice: 2500000, currentValue: 2850000, roi: 14 },
  { id: '2', title: 'Jeddah Corniche Apt', location: 'Jeddah', type: 'Residential', purchasePrice: 1200000, currentValue: 1350000, roi: 12.5 },
  { id: '3', title: 'Dammam Warehouse', location: 'Dammam', type: 'Commercial', purchasePrice: 3500000, currentValue: 3600000, roi: 2.8 },
];

const performanceData = [
  { month: 'Jan', value: 7200000 },
  { month: 'Feb', value: 7350000 },
  { month: 'Mar', value: 7300000 },
  { month: 'Apr', value: 7480000 },
  { month: 'May', value: 7650000 },
  { month: 'Jun', value: 7800000 },
];

const COLORS = ['#16a34a', '#2563eb', '#f59e0b', '#ef4444'];

export const SmartWallet: React.FC = () => {
  const { t, dir } = useLanguage();
  
  const totalValue = portfolioData.reduce((acc, item) => acc + item.currentValue, 0);
  const totalInvestment = portfolioData.reduce((acc, item) => acc + item.purchasePrice, 0);
  const totalGain = totalValue - totalInvestment;
  const totalRoi = ((totalGain / totalInvestment) * 100).toFixed(2);

  const pieData = portfolioData.map(item => ({ name: item.type, value: item.currentValue }));

  // Group by type for chart
  const groupedPieData = Object.values(pieData.reduce((acc, item) => {
    if (!acc[item.name]) acc[item.name] = { name: item.name, value: 0 };
    acc[item.name].value += item.value;
    return acc;
  }, {} as Record<string, { name: string, value: number }>));

  const handleExport = () => {
    alert("Exporting portfolio report to PDF...");
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{t('wallet.title')}</h2>
        <div className="flex gap-2">
          <button onClick={handleExport} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <Download size={16} /> {t('wallet.export')}
          </button>
          <button className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 flex items-center gap-2">
            <Plus size={16} /> {t('wallet.add')}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gray-700 rounded-lg">
              <Wallet size={20} className="text-brand-400" />
            </div>
            <span className="text-gray-300 text-sm font-medium">{t('wallet.totalValue')}</span>
          </div>
          <p className="text-3xl font-bold" dir="ltr">{totalValue.toLocaleString()} <span className="text-lg text-gray-400 font-normal">{t('common.sar')}</span></p>
          <div className="mt-4 flex items-center text-green-400 text-sm bg-gray-800/50 w-fit px-3 py-1 rounded-full" dir="ltr">
            <ArrowUpRight size={14} className="mr-1" />
            <span>+{totalRoi}%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">{t('wallet.invested')}</p>
          <p className="text-2xl font-bold text-gray-900" dir="ltr">{totalInvestment.toLocaleString()} {t('common.sar')}</p>
          <div className="h-1 w-full bg-gray-100 mt-4 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-3/4"></div>
          </div>
          <p className="text-xs text-gray-400 mt-2">75% Allocation used</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">{t('wallet.gains')}</p>
          <p className="text-2xl font-bold text-green-600" dir="ltr">+{totalGain.toLocaleString()} {t('common.sar')}</p>
          <p className="text-xs text-gray-400 mt-2">Across {portfolioData.length} assets</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-semibold text-gray-900">{t('wallet.performance')}</h3>
             <select className="text-sm border-gray-200 rounded-md text-gray-500 bg-gray-50 p-1">
               <option>Last 6 Months</option>
               <option>YTD</option>
               <option>All Time</option>
             </select>
          </div>
          <div className="h-[250px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(val) => `${(val/1000000).toFixed(1)}M`} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`${value.toLocaleString()} SAR`, 'Value']}
                />
                <Line type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={3} dot={{ r: 4, fill: '#16a34a' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Allocation Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-6">{t('wallet.allocation')}</h3>
          <div className="flex flex-col sm:flex-row items-center h-[250px]">
            <div className="h-full w-full sm:w-1/2 relative" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={groupedPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {groupedPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="font-bold text-gray-900">{portfolioData.length} Assets</p>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-1/2 mt-4 sm:mt-0 sm:pl-8 space-y-3">
               {groupedPieData.map((entry, index) => (
                 <div key={index} className="flex items-center justify-between text-sm">
                   <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                     <span className="text-gray-600">{entry.name}</span>
                   </div>
                   <span className="font-medium text-gray-900">{Math.round((entry.value / totalValue) * 100)}%</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* Asset List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">{t('wallet.assets')}</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {portfolioData.map((item) => (
            <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                  <TrendingUp size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.location} • {item.type}</p>
                </div>
              </div>
              <div className="text-right flex items-center justify-between sm:block">
                <p className="font-medium text-gray-900" dir="ltr">{item.currentValue.toLocaleString()} {t('common.sar')}</p>
                <p className={`text-sm ${item.roi >= 0 ? 'text-green-600' : 'text-red-600'}`} dir="ltr">
                  {item.roi >= 0 ? '+' : ''}{item.roi}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};