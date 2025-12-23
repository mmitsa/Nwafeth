
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Building, Activity, Map, Layers, ChevronRight, X, TrendingUp, TrendingDown, Users, Zap } from 'lucide-react';
import clsx from 'clsx';
import { useLanguage } from '../contexts/LanguageContext';

const data = [
  { name: 'Jan', Riyadh: 4000, Jeddah: 3800, Dammam: 2900 },
  { name: 'Feb', Riyadh: 4200, Jeddah: 3700, Dammam: 2950 },
  { name: 'Mar', Riyadh: 4500, Jeddah: 3900, Dammam: 3000 },
  { name: 'Apr', Riyadh: 4780, Jeddah: 3950, Dammam: 3100 },
  { name: 'May', Riyadh: 4900, Jeddah: 4100, Dammam: 3050 },
  { name: 'Jun', Riyadh: 5100, Jeddah: 4200, Dammam: 3200 },
];

const districts = [
  { name: 'Al Malqa (Riyadh)', price: 8500, change: '+12%' },
  { name: 'Al Olaya (Riyadh)', price: 7200, change: '+5%' },
  { name: 'Al Shati (Jeddah)', price: 6800, change: '+8%' },
  { name: 'Al Khobar North', price: 4500, change: '+3%' },
];

const heatmapData = [
  { id: 1, name: 'Al Malqa', city: 'Riyadh', change: 12.5, price: 8500, listings: 156, demand: 'Very High' },
  { id: 2, name: 'Al Narjis', city: 'Riyadh', change: 8.2, price: 6200, listings: 243, demand: 'High' },
  { id: 3, name: 'Al Olaya', city: 'Riyadh', change: 5.1, price: 7200, listings: 89, demand: 'Stable' },
  { id: 4, name: 'Al Yasmin', city: 'Riyadh', change: 4.5, price: 5800, listings: 112, demand: 'Moderate' },
  { id: 5, name: 'Qurtubah', city: 'Riyadh', change: -1.2, price: 4900, listings: 178, demand: 'Low' },
  { id: 6, name: 'Al Shati', city: 'Jeddah', change: 9.0, price: 6800, listings: 94, demand: 'High' },
  { id: 7, name: 'Al Rawdah', city: 'Jeddah', change: 3.5, price: 5500, listings: 67, demand: 'Moderate' },
  { id: 8, name: 'Al Hamra', city: 'Dammam', change: 2.1, price: 3200, listings: 45, demand: 'Stable' },
  { id: 9, name: 'Al Faisaliyah', city: 'Dammam', change: -2.5, price: 2800, listings: 120, demand: 'Low' },
  { id: 10, name: 'Al Hada', city: 'Mecca', change: 1.8, price: 4100, listings: 34, demand: 'Stable' },
  { id: 11, name: 'Al Aqiq', city: 'Riyadh', change: 15.2, price: 9100, listings: 76, demand: 'Explosive' },
  { id: 12, name: 'Obhur', city: 'Jeddah', change: 6.7, price: 5200, listings: 210, demand: 'High' },
];

export const Dashboard: React.FC = () => {
  const { t, dir } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState<typeof heatmapData[0] | null>(null);

  // Dynamic data for modal chart based on selection
  const districtTrendData = selectedDistrict ? [
    { month: 'Jan', price: selectedDistrict.price * 0.9 },
    { month: 'Feb', price: selectedDistrict.price * 0.92 },
    { month: 'Mar', price: selectedDistrict.price * 0.91 },
    { month: 'Apr', price: selectedDistrict.price * 0.95 },
    { month: 'May', price: selectedDistrict.price * 0.98 },
    { month: 'Jun', price: selectedDistrict.price },
  ] : [];

  const StatCard = ({ title, value, icon: Icon, change, changeType, subText, colorClass, iconBg }: any) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className={clsx("p-3 rounded-xl transition-colors group-hover:scale-110 duration-300", iconBg, colorClass)}>
          <Icon size={22} />
        </div>
        <div className={clsx(
          "flex items-center text-xs font-bold px-2 py-1 rounded-full",
          changeType === 'positive' ? "bg-green-50 text-green-600" : 
          changeType === 'negative' ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-600"
        )}>
          {changeType === 'positive' && <ArrowUpRight size={14} className="ltr:mr-1 rtl:ml-1" />}
          {changeType === 'negative' && <ArrowDownRight size={14} className="ltr:mr-1 rtl:ml-1" />}
          {change}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h3>
        <p className="text-xs text-gray-400 mt-1">{subText}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{t('dash.title')}</h2>
          <p className="text-gray-500 mt-1">{t('dash.updated')}</p>
        </div>
        <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 shadow-sm transition-all">
                Export Report
            </button>
            <button className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 shadow-lg shadow-brand-200 transition-all">
                Market Insights
            </button>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          title={t('dash.avgPrice')}
          value={`5,100 ${t('common.sar')}`}
          icon={Building}
          change="4.2%"
          changeType="positive"
          subText="vs last month"
          colorClass="text-brand-600"
          iconBg="bg-brand-50"
        />
        <StatCard 
          title={t('dash.volume')}
          value={`2.4B ${t('common.sar')}`}
          icon={Activity}
          change="12%"
          changeType="positive"
          subText="Total transaction volume"
          colorClass="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard 
          title={t('dash.listings')}
          value="14,230"
          icon={Map}
          change="-1.5%"
          changeType="negative"
          subText="Supply shortage alert"
          colorClass="text-purple-600"
          iconBg="bg-purple-50"
        />
        <StatCard 
          title={t('dash.mortgage')}
          value="4.85%"
          icon={Layers}
          change="Stable"
          changeType="neutral"
          subText="30-year fixed rate"
          colorClass="text-accent-600"
          iconBg="bg-accent-50"
        />
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Price Trends Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">{t('dash.trends')}</h3>
            <select className="bg-gray-50 border-none text-xs font-medium text-gray-600 rounded-lg px-3 py-1.5 outline-none hover:bg-gray-100 cursor-pointer">
                <option>Last 6 Months</option>
                <option>Last Year</option>
            </select>
          </div>
          <div className="h-[320px] w-full" dir="ltr"> 
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRiyadh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorJeddah" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" tick={{fontSize: 12}} tickLine={false} axisLine={false} dx={-10} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }} 
                  itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="Riyadh" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRiyadh)" activeDot={{r: 6, strokeWidth: 0}} />
                <Area type="monotone" dataKey="Jeddah" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorJeddah)" activeDot={{r: 6, strokeWidth: 0}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performing Districts */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{t('dash.hotDistricts')}</h3>
          <div className="flex-1 space-y-4">
            {districts.map((d, i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100 cursor-pointer group">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                        {i + 1}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 text-sm">{d.name}</p>
                        <p className="text-xs text-gray-500">{d.price} {t('common.sar')}/m²</p>
                    </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-600">
                  {d.change}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 text-sm font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors flex items-center justify-center gap-2">
            {t('common.viewDetails')} <ChevronRight size={16} className="ltr:ml-1 rtl:mr-1" />
          </button>
        </div>
      </div>

      {/* Market Heatmap */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Layers size={20} className="text-brand-600" />
            {t('dash.heatmap')}
          </h3>
          <div className="flex items-center gap-3 text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span>{t('dash.highGrowth')}</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-300"></span>{t('dash.moderate')}</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400"></span>{t('dash.decline')}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {heatmapData.map((item) => (
            <div 
              key={item.id}
              onClick={() => setSelectedDistrict(item)}
              className={clsx(
                "p-4 rounded-xl border transition-all duration-300 hover:scale-105 cursor-pointer flex flex-col justify-between h-28 shadow-sm",
                item.change >= 10 ? "bg-green-50 border-green-200 text-green-900 hover:shadow-green-100" :
                item.change >= 5 ? "bg-teal-50 border-teal-100 text-teal-900 hover:shadow-teal-100" :
                item.change >= 0 ? "bg-blue-50 border-blue-100 text-blue-900 hover:shadow-blue-100" :
                "bg-red-50 border-red-100 text-red-900 hover:shadow-red-100"
              )}
            >
              <div className="flex justify-between items-start">
                <span className="font-bold text-sm truncate w-full leading-tight" title={item.name}>{item.name}</span>
              </div>
              <div>
                <div className="text-[10px] opacity-70 font-medium uppercase tracking-wider">{item.city}</div>
                <div className="flex justify-between items-end mt-1">
                  <span className="font-bold text-sm">{item.price}</span>
                  <span className={clsx(
                      "text-xs font-bold px-1.5 py-0.5 rounded",
                      item.change > 0 ? "bg-white/50" : "bg-white/50"
                  )} dir="ltr">
                      {item.change > 0 ? '+' : ''}{item.change}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected District Modal */}
      {selectedDistrict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedDistrict(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-start">
              <div>
                 <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white border border-gray-200 text-gray-500">{selectedDistrict.city}</span>
                    <span className={clsx("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white", selectedDistrict.change >= 0 ? "bg-green-500" : "bg-red-500")}>
                        {selectedDistrict.change >= 0 ? 'Trending Up' : 'Correction'}
                    </span>
                 </div>
                 <h3 className="text-3xl font-bold text-gray-900">{selectedDistrict.name}</h3>
              </div>
              <button onClick={() => setSelectedDistrict(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                 <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
                {/* Price & Key Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-brand-50/50 border border-brand-100">
                        <p className="text-xs font-bold text-brand-400 uppercase mb-1">Avg Price</p>
                        <p className="text-xl font-bold text-brand-900">{selectedDistrict.price.toLocaleString()}</p>
                        <p className="text-[10px] text-brand-700/60">SAR / m²</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">24h Change</p>
                        <p className={clsx("text-xl font-bold flex items-center gap-1", selectedDistrict.change >= 0 ? "text-green-600" : "text-red-600")}>
                            {selectedDistrict.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                            {Math.abs(selectedDistrict.change)}%
                        </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Demand</p>
                        <p className="text-xl font-bold text-gray-900">{selectedDistrict.demand}</p>
                        <p className="text-[10px] text-gray-400">Market Volume</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Listings</p>
                        <p className="text-xl font-bold text-gray-900">{selectedDistrict.listings}</p>
                        <p className="text-[10px] text-gray-400">Active Offers</p>
                    </div>
                </div>

                {/* Mini Chart */}
                <div className="h-48 w-full bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                    <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Activity size={16} className="text-brand-600" />
                        Price History (6 Months)
                    </h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={districtTrendData}>
                            <defs>
                                <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={selectedDistrict.change >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor={selectedDistrict.change >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="month" stroke="#94a3b8" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                            <YAxis hide domain={['auto', 'auto']} />
                            <Tooltip 
                                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                                itemStyle={{fontSize: '12px', fontWeight: 'bold', color: '#1f2937'}}
                                formatter={(val: number) => `${val.toLocaleString()} SAR`} 
                            />
                            <Area 
                                type="monotone" 
                                dataKey="price" 
                                stroke={selectedDistrict.change >= 0 ? "#10b981" : "#ef4444"} 
                                strokeWidth={3}
                                fill="url(#colorTrend)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* District Attributes */}
                <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-3">District Highlights</h4>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-600 flex items-center gap-1">
                            <Building size={14} /> High Density
                        </span>
                         <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-600 flex items-center gap-1">
                            <Zap size={14} /> High Liquidity
                        </span>
                         <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-600 flex items-center gap-1">
                            <Users size={14} /> Family Friendly
                        </span>
                    </div>
                </div>

                {/* CTA */}
                <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                    Explore {selectedDistrict.name} Listings <ChevronRight size={16} className="ltr:ml-1 rtl:mr-1" />
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
