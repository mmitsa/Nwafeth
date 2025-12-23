import React, { useState } from 'react';
import { 
  BrainCircuit, Target, Wallet, MapPin, TrendingUp, 
  AlertTriangle, CheckCircle2, Search, Loader2, Shield, 
  ChevronRight, ArrowRight, Sparkles, PieChart, DollarSign 
} from 'lucide-react';
import { getAIInvestmentMatches } from '../services/geminiService';
import { InvestmentProfile, InvestmentOpportunity } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import clsx from 'clsx';

export const AIMatching: React.FC = () => {
  const { t, language, dir } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<InvestmentOpportunity[]>([]);
  const [profile, setProfile] = useState<InvestmentProfile>({
    budget: 2500000,
    cities: ['Riyadh'],
    goal: 'Capital Appreciation',
    riskTolerance: 'Medium',
    propertyTypes: ['Residential']
  });

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setMatches([]); // Clear previous matches
    try {
      const results = await getAIInvestmentMatches(profile, language);
      setMatches(results);
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (field: keyof InvestmentProfile, value: string) => {
    setProfile(prev => {
      const current = prev[field] as string[];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BrainCircuit className="text-brand-600" />
            {t('match.title')}
          </h2>
          <p className="text-gray-500 mt-1">{t('match.subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Profile Form */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 sticky top-24">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
              <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-bold text-sm">1</div>
              <h3 className="text-lg font-bold text-gray-900">{t('match.profile')}</h3>
            </div>

            <form onSubmit={handleSearch} className="space-y-6">
              
              {/* Budget */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">{t('match.budget')}</label>
                <div className="relative">
                   <div className="absolute left-4 top-3 text-gray-400"><DollarSign size={16} /></div>
                   <input 
                     type="number" 
                     value={profile.budget}
                     onChange={(e) => setProfile({...profile, budget: Number(e.target.value)})}
                     className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-bold focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                   />
                   <div className="absolute right-4 top-3 text-xs font-bold text-gray-400">SAR</div>
                </div>
                <input 
                  type="range" 
                  min="500000" max="10000000" step="100000" 
                  value={profile.budget}
                  onChange={(e) => setProfile({...profile, budget: Number(e.target.value)})}
                  className="w-full mt-3 accent-brand-600 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Goal */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">{t('match.goal')}</label>
                <div className="grid grid-cols-1 gap-2">
                  {['Capital Appreciation', 'Rental Income', 'Balanced'].map(goal => (
                    <div 
                      key={goal}
                      onClick={() => setProfile({...profile, goal: goal as any})}
                      className={clsx(
                        "p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3",
                        profile.goal === goal ? "bg-brand-50 border-brand-500 text-brand-700 ring-1 ring-brand-500" : "bg-white border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      <div className={clsx("w-4 h-4 rounded-full border flex items-center justify-center", profile.goal === goal ? "border-brand-600" : "border-gray-300")}>
                        {profile.goal === goal && <div className="w-2 h-2 bg-brand-600 rounded-full"></div>}
                      </div>
                      <span className="text-sm font-medium">{goal === 'Capital Appreciation' ? t('match.appreciation') : goal === 'Rental Income' ? t('match.strategy.rent') : t('match.goal')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cities */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">{t('match.cities')}</label>
                <div className="flex flex-wrap gap-2">
                  {['Riyadh', 'Jeddah', 'Dammam', 'Mecca'].map(city => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => toggleSelection('cities', city)}
                      className={clsx(
                        "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
                        profile.cities.includes(city) 
                          ? "bg-brand-600 text-white border-brand-600" 
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                      )}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Risk */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">{t('match.risk')}</label>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  {['Low', 'Medium', 'High'].map(risk => (
                    <button
                      key={risk}
                      type="button"
                      onClick={() => setProfile({...profile, riskTolerance: risk as any})}
                      className={clsx(
                        "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                        profile.riskTolerance === risk ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      {risk}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                {loading ? t('match.finding') : t('match.findBtn')}
              </button>

            </form>
          </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Loading State */}
          {loading && (
             <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mb-6 relative">
                   <div className="absolute inset-0 border-4 border-brand-100 rounded-full animate-ping opacity-30"></div>
                   <Loader2 size={40} className="text-brand-600 animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">AI Agent Scanning Market</h3>
                <p className="text-gray-500 max-w-md">
                   Analyzing over 15,000 active listings against your profile criteria, market trends, and risk factors...
                </p>
             </div>
          )}

          {/* Empty State */}
          {!loading && matches.length === 0 && (
             <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 text-gray-400">
                   <Target size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Define Your Investment Strategy</h3>
                <p className="text-gray-500 max-w-sm mb-8">
                   Set your budget and preferences on the left to let our AI find the highest potential opportunities for you.
                </p>
             </div>
          )}

          {/* Results List */}
          {!loading && matches.map((match) => (
            <div key={match.id} className="bg-white rounded-3xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all group animate-slide-up">
               <div className="grid grid-cols-1 md:grid-cols-3">
                  
                  {/* Match Score Column */}
                  <div className="p-6 bg-gray-900 text-white flex flex-col justify-between relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-6 opacity-10"><Sparkles size={80} /></div>
                     <div>
                        <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/10">
                           AI Match Score
                        </span>
                        <div className="flex items-baseline gap-1">
                           <span className="text-6xl font-extrabold tracking-tighter text-brand-400">{match.matchScore}</span>
                           <span className="text-xl font-medium text-gray-400">/100</span>
                        </div>
                     </div>
                     <div className="mt-6">
                        <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase">
                           <span>Projected ROI</span>
                           <span className="text-green-400">{match.expectedROI}%</span>
                        </div>
                        <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                           <div className="bg-green-500 h-full rounded-full" style={{width: `${Math.min(100, match.expectedROI * 5)}%`}}></div>
                        </div>
                     </div>
                  </div>

                  {/* Details Column */}
                  <div className="md:col-span-2 p-6 md:p-8">
                     <div className="flex justify-between items-start mb-4">
                        <div>
                           <h3 className="text-2xl font-bold text-gray-900 mb-1">{match.title}</h3>
                           <p className="text-gray-500 flex items-center gap-1 text-sm">
                              <MapPin size={14} /> {match.location} • {match.type}
                           </p>
                        </div>
                        <div className="text-right">
                           <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Investment</p>
                           <p className="text-xl font-bold text-gray-900">{match.price.toLocaleString()} SAR</p>
                        </div>
                     </div>

                     {/* AI Insight */}
                     <div className="mt-6 bg-brand-50/50 rounded-xl p-5 border border-brand-100">
                        <div className="flex items-start gap-3">
                           <div className="bg-brand-100 p-1.5 rounded-lg text-brand-600 shrink-0 mt-0.5">
                              <BrainCircuit size={18} />
                           </div>
                           <div>
                              <h4 className="text-sm font-bold text-brand-900 mb-1">{t('match.whyFits')}</h4>
                              <p className="text-sm text-brand-800/80 leading-relaxed">{match.reason}</p>
                           </div>
                        </div>
                     </div>

                     {/* Risk Factors */}
                     {match.riskFactors.length > 0 && (
                        <div className="mt-4 bg-amber-50/50 rounded-xl p-5 border border-amber-100">
                           <div className="flex items-start gap-3">
                              <div className="bg-amber-100 p-1.5 rounded-lg text-amber-600 shrink-0 mt-0.5">
                                 <Shield size={18} />
                              </div>
                              <div>
                                 <h4 className="text-sm font-bold text-amber-900 mb-2">{t('match.riskFactors')}</h4>
                                 <ul className="space-y-2">
                                    {match.riskFactors.map((risk, i) => (
                                       <li key={i} className="flex items-start gap-2 text-sm text-amber-800/80">
                                          <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-600" />
                                          <span className="leading-snug">{risk}</span>
                                       </li>
                                    ))}
                                 </ul>
                              </div>
                           </div>
                        </div>
                     )}

                     {/* Actions */}
                     <div className="mt-8 flex gap-3">
                        <button className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all text-sm shadow-lg shadow-gray-200">
                           Request Details
                        </button>
                        <button className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all text-sm flex items-center justify-center gap-2">
                           <PieChart size={16} /> {t('match.modal.financials')}
                        </button>
                     </div>

                  </div>
               </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};
