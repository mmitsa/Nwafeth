import React, { useState, useEffect } from 'react';
import { 
  Search, Loader2, AlertCircle, CheckCircle2, TrendingUp, DollarSign, 
  ShieldAlert, FileText, MapPin, Ruler, Compass, PaintBucket, 
  ArrowUpRight, Star, ChevronRight, Building, Home, Layers, 
  Share2, Download, Printer, Building2, LandPlot, Hotel, Sparkles
} from 'lucide-react';
import { getAIValuation } from '../services/geminiService';
import { ValuationResponse, ValuationRequest } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, Area, AreaChart 
} from 'recharts';
import clsx from 'clsx';

const CITY_DISTRICTS: Record<string, string[]> = {
  'Riyadh': ['Al Malqa', 'Al Narjis', 'Al Olaya', 'Al Nakheel', 'Al Yasmin', 'Qurtubah', 'Al Aqiq', 'Hittin', 'Al Sahafa', 'Al Rabie'],
  'Jeddah': ['Al Shati', 'Obhur Al Shamaliyah', 'Al Rawdah', 'Al Hamra', 'Al Basateen', 'Al Salam', 'Al Zahra', 'Al Mohammadiyyah'],
  'Dammam': ['Al Faisaliyah', 'Al Shati', 'Al Jalawiyah', 'Al Mubarakiyah', 'Al Mazruiyah'],
  'Mecca': ['Al Awali', 'Al Shoqiyah', 'Al Aziziyah', 'Al Nuseem', 'Al Hindawiyah']
};

const LOADING_STEPS = [
  "Connecting to Real Estate Registry...",
  "Fetching District Transaction History...",
  "Analyzing Comparable Listings...",
  "Applying AI Valuation Models...",
  "Generating Market Intelligence Report..."
];

const TOP_VALUATIONS = [
  { id: 1, district: 'Al Malqa', city: 'Riyadh', price: 8500, growth: 12.4, rating: 94, type: 'Residential' },
  { id: 2, district: 'Al Shati', city: 'Jeddah', price: 6800, growth: 9.0, rating: 91, type: 'Residential' },
  { id: 3, district: 'Hittin', city: 'Riyadh', price: 9200, growth: 11.5, rating: 96, type: 'Luxury Villa' },
  { id: 4, district: 'Al Nakheel', city: 'Riyadh', price: 7800, growth: 8.2, rating: 89, type: 'Residential' },
];

// Helper Component for Property Type Selection
interface PropertyTypeIconProps {
  type: string;
  selected: boolean;
  onClick: () => void;
}

const PropertyTypeIcon: React.FC<PropertyTypeIconProps> = ({ type, selected, onClick }) => {
  const icons = {
    'Villa': Home,
    'Apartment': Building,
    'Land': LandPlot,
    'Building': Building2
  };
  const Icon = icons[type as keyof typeof icons] || Home;
  
  return (
    <button 
      type="button"
      onClick={onClick}
      className={clsx(
        "flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 h-24",
        selected 
          ? "bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-200 scale-105" 
          : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
      )}
    >
      <Icon size={24} className="mb-2" />
      <span className="text-xs font-bold">{type}</span>
    </button>
  );
};

export const ValuationTool: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [result, setResult] = useState<ValuationResponse | null>(null);
  const { t, language, dir } = useLanguage();
  
  const [formData, setFormData] = useState<ValuationRequest>({
    city: 'Riyadh',
    district: 'Al Malqa',
    area: 350,
    type: 'Villa',
    bedrooms: 4,
    age: 0,
    streetWidth: '> 15m',
    direction: 'North',
    finishing: 'Deluxe'
  });

  // Mock trend data generator based on result
  const [trendData, setTrendData] = useState<any[]>([]);

  useEffect(() => {
    if (result) {
      const basePrice = result.pricePerMeter;
      const data = [
        { month: 'Jan', price: basePrice * 0.92 },
        { month: 'Feb', price: basePrice * 0.94 },
        { month: 'Mar', price: basePrice * 0.93 },
        { month: 'Apr', price: basePrice * 0.96 },
        { month: 'May', price: basePrice * 0.98 },
        { month: 'Jun', price: basePrice * 1.0 },
      ];
      setTrendData(data);
    }
  }, [result]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.district || !formData.area) return;

    setLoading(true);
    setResult(null);
    setLoadingStepIndex(0);

    // Simulate steps
    const stepInterval = setInterval(() => {
      setLoadingStepIndex(prev => (prev + 1) % LOADING_STEPS.length);
    }, 800);

    try {
      const data = await getAIValuation(formData, language);
      setResult(data);
    } catch (error) {
      alert("Failed to get valuation. Please try again later.");
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'city') {
      setFormData(prev => ({
        ...prev,
        city: value,
        district: CITY_DISTRICTS[value]?.[0] || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'area' || name === 'bedrooms' || name === 'age' ? Number(value) : value
      }));
    }
  };

  // Prepare data for Radar Chart
  const radarData = result ? [
    { subject: t('val.rating.loc'), A: result.propertyRating.location, fullMark: 100 },
    { subject: t('val.rating.serv'), A: result.propertyRating.services, fullMark: 100 },
    { subject: t('val.rating.price'), A: result.propertyRating.price, fullMark: 100 },
    { subject: t('val.rating.fut'), A: result.propertyRating.future, fullMark: 100 },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto pb-12 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="text-brand-600" />
            {t('val.title')}
          </h2>
          <p className="text-gray-500 mt-1">{t('val.subtitle')}</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 flex items-center gap-2">
              <Printer size={16} /> Print
           </button>
           <button className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 flex items-center gap-2 shadow-lg">
              <Share2 size={16} /> Share
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: INPUT FORM */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 sticky top-24">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
              <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-bold text-sm">1</div>
              <h3 className="text-lg font-bold text-gray-900">{t('val.details')}</h3>
            </div>
            
            <form onSubmit={handleAnalyze} className="space-y-6">
              
              {/* Property Type */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">{t('val.type')}</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Villa', 'Apartment', 'Land', 'Building'].map(type => (
                    <PropertyTypeIcon 
                      key={type} 
                      type={type} 
                      selected={formData.type === type} 
                      onClick={() => setFormData(prev => ({...prev, type}))}
                    />
                  ))}
                </div>
              </div>

              {/* Location Group */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-4">
                 <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                    <MapPin size={16} className="text-brand-600" /> Location
                 </div>
                 <div className="grid grid-cols-1 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">{t('val.city')}</label>
                        <select 
                            name="city" 
                            value={formData.city} 
                            onChange={handleInputChange}
                            className="w-full bg-white rounded-xl border-gray-200 border p-3 text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                        >
                            {Object.keys(CITY_DISTRICTS).map(city => (
                            <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">{t('val.district')}</label>
                        <select 
                            name="district" 
                            value={formData.district}
                            onChange={handleInputChange}
                            className="w-full bg-white rounded-xl border-gray-200 border p-3 text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                        >
                            {CITY_DISTRICTS[formData.city]?.map((dist) => (
                            <option key={dist} value={dist}>{dist}</option>
                            ))}
                        </select>
                    </div>
                 </div>
              </div>

              {/* Specifications */}
              <div className="space-y-4">
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Specifications</label>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 mb-1">{t('val.area')}</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                name="area" 
                                value={formData.area || ''}
                                onChange={handleInputChange}
                                className="w-full bg-gray-50 rounded-xl border-transparent p-3 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                            />
                            <span className="absolute right-4 top-3 text-xs font-bold text-gray-400">m²</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">{t('val.bedrooms')}</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                name="bedrooms" 
                                value={formData.bedrooms}
                                onChange={handleInputChange}
                                className="w-full bg-gray-50 rounded-xl border-transparent p-3 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">{t('val.age')}</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                name="age" 
                                value={formData.age}
                                onChange={handleInputChange}
                                className="w-full bg-gray-50 rounded-xl border-transparent p-3 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                            />
                            <span className="absolute right-4 top-3 text-xs font-bold text-gray-400">Yrs</span>
                        </div>
                    </div>
                 </div>
              </div>

              {/* Advanced Toggle */}
              <div className="pt-2 border-t border-gray-100">
                 <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer text-sm font-bold text-gray-500 hover:text-brand-600 transition-colors py-2">
                        <span>Advanced Features</span>
                        <ChevronRight size={16} className="group-open:rotate-90 transition-transform" />
                    </summary>
                    <div className="mt-3 grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-top-2">
                        <select name="streetWidth" value={formData.streetWidth} onChange={handleInputChange} className="w-full text-xs bg-gray-50 rounded-lg p-2.5 outline-none">
                           <option value="< 10m">&lt; 10m Street</option>
                           <option value="10m - 15m">10m - 15m Street</option>
                           <option value="> 15m">&gt; 15m Street</option>
                        </select>
                        <select name="direction" value={formData.direction} onChange={handleInputChange} className="w-full text-xs bg-gray-50 rounded-lg p-2.5 outline-none">
                           <option value="North">{t('val.dir.north')}</option>
                           <option value="South">{t('val.dir.south')}</option>
                           <option value="East">{t('val.dir.east')}</option>
                           <option value="West">{t('val.dir.west')}</option>
                        </select>
                        <select name="finishing" value={formData.finishing} onChange={handleInputChange} className="w-full text-xs bg-gray-50 rounded-lg p-2.5 outline-none">
                           <option value="Core & Shell">{t('val.fin.core')}</option>
                           <option value="Finished">{t('val.fin.finished')}</option>
                           <option value="Deluxe">{t('val.fin.deluxe')}</option>
                           <option value="VIP">{t('val.fin.vip')}</option>
                        </select>
                    </div>
                 </details>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/10 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} className="text-yellow-400 fill-yellow-400" />}
                {loading ? t('val.analyzing') : t('val.estimateBtn')}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: RESULTS / LOADING / EMPTY */}
        <div className="lg:col-span-8">
          
          {/* LOADING STATE */}
          {loading && (
             <div className="h-[600px] bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-grid-slate-50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]"></div>
                 <div className="relative z-10">
                     <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                         <div className="absolute inset-0 border-4 border-brand-100 rounded-full animate-ping opacity-20"></div>
                         <Loader2 size={48} className="text-brand-600 animate-spin" />
                     </div>
                     <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Valuation in Progress</h3>
                     <p className="text-gray-500 h-6 font-mono transition-all duration-300 text-sm">
                        {LOADING_STEPS[loadingStepIndex]}
                     </p>
                     
                     <div className="mt-8 flex gap-2 justify-center">
                        {LOADING_STEPS.map((_, i) => (
                            <div key={i} className={clsx("w-2 h-2 rounded-full transition-colors duration-300", i === loadingStepIndex ? "bg-brand-600" : "bg-gray-200")}></div>
                        ))}
                     </div>
                 </div>
             </div>
          )}

          {/* RESULT STATE */}
          {!loading && result && (
            <div className="space-y-6 animate-slide-up">
              
              {/* Hero Valuation Card */}
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-200 overflow-hidden">
                 <div className="bg-gradient-to-r from-brand-900 to-gray-900 text-white p-8 relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-wider text-brand-200">
                                    AI Confidence: {result.estimatedPrice.confidence}%
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm uppercase tracking-widest font-bold mb-1">{t('val.estValue')}</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl md:text-6xl font-extrabold tracking-tight">
                                    {(result.estimatedPrice.min / 1000000).toFixed(2)} - {(result.estimatedPrice.max / 1000000).toFixed(2)}
                                </span>
                                <span className="text-2xl font-medium text-gray-400">M SAR</span>
                            </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-1">
                            <div className="text-right">
                                <p className="text-xs text-gray-400 uppercase font-bold">Price / m²</p>
                                <p className="text-2xl font-bold">{result.pricePerMeter.toLocaleString()} SAR</p>
                            </div>
                        </div>
                    </div>
                 </div>

                 <div className="p-8">
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                         <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                             <p className="text-xs font-bold text-gray-400 uppercase mb-1">{t('val.locScore')}</p>
                             <div className="flex items-end gap-1">
                                <span className="text-2xl font-bold text-gray-900">{result.locationScore}</span>
                                <span className="text-sm text-gray-400 font-medium mb-1">/ 10</span>
                             </div>
                             <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
                                <div className="bg-brand-500 h-full rounded-full" style={{width: `${result.locationScore * 10}%`}}></div>
                             </div>
                         </div>
                         
                         <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                             <p className="text-xs font-bold text-gray-400 uppercase mb-1">{t('val.growth')}</p>
                             <div className="flex items-center gap-2 text-green-600">
                                <TrendingUp size={24} />
                                <span className="text-2xl font-bold">+{result.futureGrowth}%</span>
                             </div>
                             <p className="text-[10px] text-gray-400 mt-2">Projected 12-mo</p>
                         </div>

                         <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                             <p className="text-xs font-bold text-gray-400 uppercase mb-1">{t('val.risk')}</p>
                             <div className="flex items-center gap-2">
                                <ShieldAlert size={24} className={result.riskLevel === 'Low' ? "text-green-500" : "text-yellow-500"} />
                                <span className={clsx("text-2xl font-bold", result.riskLevel === 'Low' ? "text-green-600" : "text-yellow-600")}>{result.riskLevel}</span>
                             </div>
                             <p className="text-[10px] text-gray-400 mt-2">Investment Risk</p>
                         </div>

                         <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                             <p className="text-xs font-bold text-gray-400 uppercase mb-1">Demand</p>
                             <div className="flex items-center gap-2 text-blue-600">
                                <ArrowUpRight size={24} />
                                <span className="text-2xl font-bold">High</span>
                             </div>
                             <p className="text-[10px] text-gray-400 mt-2">Market Volume</p>
                         </div>
                     </div>
                 </div>
              </div>

              {/* Charts & Analysis Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Radar Chart */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Layers size={18} className="text-brand-600" /> Property Rating
                      </h3>
                      <div className="flex-1 min-h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                <PolarGrid stroke="#e5e7eb" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 600 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Rating"
                                    dataKey="A"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    fill="#10b981"
                                    fillOpacity={0.2}
                                />
                                </RadarChart>
                            </ResponsiveContainer>
                      </div>
                  </div>

                  {/* Price Trend Chart */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <TrendingUp size={18} className="text-blue-600" /> District Price Trend (6 Mo)
                      </h3>
                      <div className="flex-1 min-h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={trendData}>
                                  <defs>
                                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                      </linearGradient>
                                  </defs>
                                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12}} stroke="#9ca3af" />
                                  <YAxis hide domain={['auto', 'auto']} />
                                  <RechartsTooltip 
                                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                                      formatter={(value: number) => `${Math.round(value).toLocaleString()} SAR`}
                                  />
                                  <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} fill="url(#colorPrice)" />
                              </AreaChart>
                          </ResponsiveContainer>
                      </div>
                  </div>
              </div>

              {/* AI Analysis Text */}
              <div className="bg-brand-50 p-8 rounded-3xl border border-brand-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10"><FileText size={120} className="text-brand-600" /></div>
                  <h3 className="font-bold text-brand-900 mb-4 flex items-center gap-2 relative z-10">
                      <Star size={18} className="text-yellow-500 fill-yellow-500" /> AI Market Intelligence
                  </h3>
                  <p className="text-brand-800 leading-relaxed relative z-10 text-lg">
                      {result.marketAnalysis}
                  </p>
              </div>

              {/* Comparables */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-green-600" /> Comparable Transactions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.comparables.map((comp, idx) => (
                          <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-brand-200 transition-colors cursor-default">
                              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 text-gray-400">
                                  <Home size={18} />
                              </div>
                              <div>
                                  <p className="font-medium text-gray-900 text-sm">{comp}</p>
                                  <p className="text-xs text-gray-500 mt-1">Sold within last 3 months</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && !result && (
            <div className="h-full flex flex-col gap-8">
                <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-sm text-center flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
                    <div className="absolute inset-0 bg-grid-slate-50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
                    <div className="relative z-10 max-w-md mx-auto">
                        <div className="bg-brand-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-brand-600 shadow-inner">
                            <Search size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('val.prompt')}</h3>
                        <p className="text-gray-500 mb-8">
                            Our AI engine analyzes over 50,000 monthly transactions, infrastructure projects, and district trends to provide the most accurate valuation in the Kingdom.
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">Vision 2030 Aligned</span>
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">RERIS Data</span>
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">Geospatial Analysis</span>
                        </div>
                    </div>
                </div>

                {/* Market Pulse / Top Valuations */}
                <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-gray-900">Current Market Hotspots</h3>
                        <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">Live Data</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {TOP_VALUATIONS.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-bold text-brand-600 shadow-sm border border-gray-100">
                                        {item.rating}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{item.district}</p>
                                        <p className="text-xs text-gray-500">{item.city}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900 text-sm">{item.price.toLocaleString()} SAR/m²</p>
                                    <p className="text-xs text-green-600 font-bold flex items-center justify-end gap-1">
                                        <TrendingUp size={10} /> +{item.growth}%
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};