
import React, { useState, useEffect } from 'react';
import { 
  Users, Megaphone, ShieldCheck, UserPlus, QrCode, 
  Download, Share2, Link, Sparkles, Send, FileText,
  CheckCircle, Copy, LayoutDashboard, ExternalLink, Plus,
  Building2, Handshake, Wallet, BadgeCheck, FileSignature,
  Briefcase, MapPin, Award, ChevronRight, CreditCard,
  ArrowRight, Settings, Save, Camera, User, FormInput
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import clsx from 'clsx';

export const BrokerCenter: React.FC = () => {
  const { t, dir } = useLanguage();
  const { currentUser, updateProfile } = useAuth();
  
  // Registration State (derived from user profile)
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [regForm, setRegForm] = useState({ falNumber: '', crNumber: '', iban: '', agencyName: '', locations: '' });
  
  // State for Main Dashboard
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'marketing' | 'profile'>('dashboard');
  
  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
      falNumber: '',
      crNumber: '',
      agencyName: '',
      locations: '',
      iban: '',
      profileImage: ''
  });
  
  // Content States
  const [clientForm, setClientForm] = useState({ name: '', phone: '', project: 'Sedra Phase 2', notes: '' });
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Check if user has broker details or is Developer/Admin (auto-registered)
  useEffect(() => {
    if (currentUser.brokerDetails || currentUser.role === 'developer' || currentUser.role === 'admin') {
      setIsRegistered(true);
      // Init profile form with current details if agent, or mock/empty for dev
      if (currentUser.brokerDetails) {
        setProfileForm({
            falNumber: currentUser.brokerDetails.falNumber || '',
            crNumber: currentUser.brokerDetails.crNumber || '',
            agencyName: currentUser.brokerDetails.agencyName || '',
            locations: currentUser.brokerDetails.locations.join(', ') || '',
            iban: currentUser.brokerDetails.iban || '',
            profileImage: currentUser.brokerDetails.profileImage || ''
        });
      }
    } else {
      setIsRegistered(false);
    }
  }, [currentUser]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Save registration data to profile
    updateProfile({
      brokerDetails: {
        falNumber: regForm.falNumber,
        crNumber: regForm.crNumber,
        agencyName: regForm.agencyName,
        iban: regForm.iban,
        locations: regForm.locations.split(',').map(s => s.trim()).filter(s => s)
      }
    });
    setIsRegistered(true);
  };

  const handleProfileSave = (e: React.FormEvent) => {
      e.preventDefault();
      updateProfile({
          brokerDetails: {
              falNumber: profileForm.falNumber,
              crNumber: profileForm.crNumber,
              agencyName: profileForm.agencyName,
              iban: profileForm.iban,
              locations: profileForm.locations.split(',').map(s => s.trim()).filter(s => s),
              profileImage: profileForm.profileImage
          }
      });
      setIsEditingProfile(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileForm(prev => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Client ${clientForm.name} secured for project ${clientForm.project}! Protection valid for 60 days.`);
    setClientForm({ name: '', phone: '', project: 'Sedra Phase 2', notes: '' });
  };

  const generateAIContent = () => {
    setIsLoadingAI(true);
    setTimeout(() => {
      setGeneratedContent("✨ Exclusive Opportunity in North Riyadh! 🏡\n\nOwn your dream villa in Sedra Phase 2 today. Direct developer prices, premium finishing, and smart home features.\n\n📞 Contact me for a private tour: " + currentUser.email + "\n#RiyadhRealEstate #Sedra #LuxuryLiving");
      setIsLoadingAI(false);
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
  };

  // Derived brokerInfo for display - Handle Developer Fallback
  const brokerInfo = currentUser.brokerDetails || (currentUser.role === 'developer' && currentUser.developerDetails ? {
      falNumber: 'DEV-' + currentUser.developerDetails.crNumber.substr(0,5), 
      crNumber: currentUser.developerDetails.crNumber,
      agencyName: currentUser.developerDetails.companyName + " Sales Team",
      locations: [currentUser.developerDetails.headquarters],
      iban: 'Direct Sales',
      profileImage: currentUser.developerDetails.logo
  } : { 
      falNumber: 'N/A', crNumber: 'N/A', agencyName: 'Independent', locations: [], iban: '', profileImage: '' 
  });

  // --- VIEW: REGISTRATION FLOW (Only for unregistered Agents) ---
  if (!isRegistered) {
    return (
      <div className="max-w-3xl mx-auto py-12 animate-fade-in">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-brand-50 rounded-3xl flex items-center justify-center mx-auto mb-4 text-brand-600 shadow-lg shadow-brand-100">
            <BadgeCheck size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('broker.join')}</h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            {t('broker.joinDesc')}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100 bg-gray-50/50">
            <div className={clsx("flex-1 p-4 text-center text-sm font-bold border-b-2 transition-colors", registrationStep === 1 ? "border-brand-600 text-brand-600" : "border-transparent text-gray-400")}>1. {t('broker.step1')}</div>
            <div className={clsx("flex-1 p-4 text-center text-sm font-bold border-b-2 transition-colors", registrationStep === 2 ? "border-brand-600 text-brand-600" : "border-transparent text-gray-400")}>2. {t('broker.step2')}</div>
            <div className={clsx("flex-1 p-4 text-center text-sm font-bold border-b-2 transition-colors", registrationStep === 3 ? "border-brand-600 text-brand-600" : "border-transparent text-gray-400")}>3. {t('broker.step3')}</div>
          </div>

          <div className="p-8">
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Real Estate General Authority License # (FAL)</label>
                  <div className="relative">
                    <BadgeCheck className="absolute top-3 left-3 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      required
                      placeholder="1100xxxxxx" 
                      value={regForm.falNumber}
                      onChange={e => setRegForm({...regForm, falNumber: e.target.value})}
                      className="w-full pl-10 p-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-brand-500 transition-all outline-none" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Commercial Reg (CR)</label>
                      <input 
                        type="text" 
                        placeholder="10xxxxxxxx" 
                        value={regForm.crNumber}
                        onChange={e => setRegForm({...regForm, crNumber: e.target.value})}
                        className="w-full p-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-brand-500 transition-all outline-none" 
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Agency Name</label>
                      <input 
                        type="text" 
                        placeholder="Agency Name" 
                        value={regForm.agencyName}
                        onChange={e => setRegForm({...regForm, agencyName: e.target.value})}
                        className="w-full p-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-brand-500 transition-all outline-none" 
                      />
                   </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Locations</label>
                    <input 
                      type="text" 
                      placeholder="Riyadh, Jeddah..." 
                      value={regForm.locations}
                      onChange={e => setRegForm({...regForm, locations: e.target.value})}
                      className="w-full p-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-brand-500 transition-all outline-none" 
                    />
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><Wallet size={16} /> {t('broker.banking')}</h4>
                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">IBAN</label>
                      <input 
                        type="text" 
                        required
                        placeholder="SAxxxxxxxxxxxxxxxxxxxxxx" 
                        value={regForm.iban}
                        onChange={e => setRegForm({...regForm, iban: e.target.value})}
                        className="w-full p-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-brand-500 transition-all outline-none font-mono" 
                      />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold text-lg hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 flex items-center justify-center gap-2">
                {t('broker.complete')} <ArrowRight size={20} className="rtl:rotate-180" />
              </button>
              
              <p className="text-center text-xs text-gray-400">
                By registering, you agree to the Nawafiz Broker Terms of Service and Affiliate Marketing Agreement.
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: MAIN DASHBOARD ---
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
          {brokerInfo.profileImage ? (
              <img src={brokerInfo.profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-gray-100" />
          ) : (
              <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center text-2xl font-bold text-white border-4 border-gray-100">
                {currentUser.avatar}
              </div>
          )}
          <div className="absolute bottom-0 right-0 bg-green-500 text-white p-1.5 rounded-full border-2 border-white" title="Verified">
            <CheckCircle size={14} />
          </div>
        </div>
        
        <div className="flex-1 text-center md:text-start">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
             <h2 className="text-2xl font-bold text-gray-900">{currentUser.name}</h2>
             <span className={clsx("px-2 py-0.5 text-xs font-bold uppercase rounded-full border", currentUser.role === 'developer' ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-brand-50 text-brand-700 border-brand-100")}>
                {currentUser.role === 'developer' ? 'Direct Sales' : `FAL: ${brokerInfo.falNumber}`}
             </span>
          </div>
          <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2 text-sm mb-4">
             <MapPin size={14} /> {brokerInfo.locations.join(', ') || 'Saudi Arabia'} • {brokerInfo.agencyName}
          </p>
          <div className="flex gap-4 justify-center md:justify-start">
             <div className="text-center px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-400 font-bold uppercase">{t('broker.trust')}</p>
                <p className="font-bold text-brand-600 text-lg">92/100</p>
             </div>
             <div className="text-center px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-400 font-bold uppercase">Deals Closed</p>
                <p className="font-bold text-gray-900 text-lg">14</p>
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 min-w-[200px]">
           <div className="p-3 bg-gray-900 text-white rounded-xl flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2">
                 <Wallet size={18} className="text-brand-400" />
                 <span className="text-sm font-bold">Wallet</span>
              </div>
              <span className="font-mono font-bold">12,450 {t('common.sar')}</span>
           </div>
           {currentUser.role === 'agent' && (
             <button onClick={() => setActiveTab('profile')} className="p-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Settings size={16} /> Edit Profile
             </button>
           )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-4 border-b border-gray-200 pb-1">
         {[
           { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
           { id: 'leads', icon: Users, label: t('broker.leads.active') },
           { id: 'marketing', icon: Megaphone, label: t('broker.marketing') },
           { id: 'profile', icon: FileSignature, label: t('broker.contracts') },
         ].map(tab => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={clsx(
               "flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap",
               activeTab === tab.id 
                 ? "border-brand-600 text-brand-600" 
                 : "border-transparent text-gray-500 hover:text-gray-800"
             )}
           >
             <tab.icon size={18} /> {tab.label}
           </button>
         ))}
      </div>

      {/* --- TAB: DASHBOARD (THE HUB) --- */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
           {/* Quick Actions */}
           <div className="lg:col-span-3">
              <h3 className="font-bold text-gray-900 mb-4">
                  {t('broker.ecosystem')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-brand-600 to-brand-700 p-6 rounded-2xl text-white shadow-lg shadow-brand-200 relative overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all">
                      <div className="absolute top-0 right-0 p-4 opacity-20"><Handshake size={80} /></div>
                      <div className="relative z-10">
                         <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                            <Building2 className="text-white" />
                         </div>
                         <h4 className="font-bold text-lg mb-1">{t('broker.affiliate')}</h4>
                         <p className="text-brand-100 text-sm mb-4">Connect with Developers & Sign Contracts.</p>
                         <button className="text-xs font-bold bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-1.5 rounded-lg transition-colors">Browse Projects</button>
                      </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm group cursor-pointer hover:border-brand-200 hover:shadow-md transition-all">
                      <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                         <Users />
                      </div>
                      <h4 className="font-bold text-lg text-gray-900 mb-1">{t('broker.cobroking')}</h4>
                      <p className="text-gray-500 text-sm mb-4">Share deals and split commission with other agents.</p>
                      <div className="flex items-center gap-2 text-xs font-bold text-purple-600">
                         <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span> 12 Active Requests
                      </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm group cursor-pointer hover:border-brand-200 hover:shadow-md transition-all">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                         <Briefcase />
                      </div>
                      <h4 className="font-bold text-lg text-gray-900 mb-1">{t('broker.portfolio')}</h4>
                      <p className="text-gray-500 text-sm mb-4">Manage your personal inventory and listings.</p>
                      <p className="text-xs font-bold text-gray-900">4 Active Listings</p>
                  </div>
              </div>
           </div>

           {/* Recent Activity / Pipeline */}
           <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-gray-900">{t('broker.pipeline')}</h3>
                 <button className="text-sm font-bold text-brand-600">View All</button>
              </div>
              <div className="space-y-4">
                 {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-xs">
                             {['MA', 'FK', 'SA'][i-1]}
                          </div>
                          <div>
                             <p className="font-bold text-sm text-gray-900">Client Name #{i}</p>
                             <p className="text-xs text-gray-500">Interested in Sedra Phase 2</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-full">Protected</span>
                          <p className="text-[10px] text-gray-400 mt-1">Expires in 45 days</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Stats */}
           <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
               <h3 className="font-bold text-gray-900 mb-6">{t('broker.performance')}</h3>
               <div className="space-y-6">
                  <div>
                     <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">{t('broker.conversion')}</span>
                        <span className="font-bold text-gray-900">24%</span>
                     </div>
                     <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-brand-500 w-[24%] h-full rounded-full"></div>
                     </div>
                  </div>
                  <div>
                     <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">{t('broker.commYTD')}</span>
                        <span className="font-bold text-gray-900">145k SAR</span>
                     </div>
                     <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-green-500 w-[65%] h-full rounded-full"></div>
                     </div>
                  </div>
               </div>
               
               <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 mb-2 font-bold uppercase">{t('broker.nextPayout')}</p>
                  <div className="flex justify-between items-center">
                     <span className="font-bold text-gray-900 text-lg">12,500 SAR</span>
                     <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg font-bold">Pending</span>
                  </div>
               </div>
           </div>
        </div>
      )}

      {/* --- TAB: LEADS --- */}
      {activeTab === 'leads' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up">
             <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-6">
                      <UserPlus className="text-brand-600" size={20} />
                      <h3 className="font-bold text-gray-900">{t('broker.register')}</h3>
                  </div>
                  <form onSubmit={handleClientSubmit} className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('broker.form.clientName')}</label>
                          <input 
                            required
                            type="text" 
                            value={clientForm.name}
                            onChange={e => setClientForm({...clientForm, name: e.target.value})}
                            className="w-full p-3 bg-gray-50 border-transparent focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 rounded-xl text-sm transition-all outline-none"
                            placeholder="Full Name"
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('broker.form.clientPhone')}</label>
                          <input 
                            required
                            type="tel" 
                            value={clientForm.phone}
                            onChange={e => setClientForm({...clientForm, phone: e.target.value})}
                            className="w-full p-3 bg-gray-50 border-transparent focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 rounded-xl text-sm transition-all outline-none"
                            placeholder="05xxxxxxxx"
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('broker.form.interest')}</label>
                          <select 
                            className="w-full p-3 bg-gray-50 border-transparent focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 rounded-xl text-sm transition-all outline-none"
                            value={clientForm.project}
                            onChange={e => setClientForm({...clientForm, project: e.target.value})}
                          >
                              <option>Sedra Phase 2</option>
                              <option>Al-Arous Jeddah</option>
                              <option>KAFD Office Tower</option>
                          </select>
                      </div>
                      <button type="submit" className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 shadow-lg shadow-brand-200 flex items-center justify-center gap-2 transition-all">
                          <ShieldCheck size={18} /> {t('broker.form.submit')}
                      </button>
                  </form>
             </div>
             
             <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                 <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">Managed Clients (Vault)</h3>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                       <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                          <tr>
                             <th className="px-6 py-3">Client</th>
                             <th className="px-6 py-3">Project</th>
                             <th className="px-6 py-3">Status</th>
                             <th className="px-6 py-3">Protection</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100">
                          {[1, 2, 3, 4].map(i => (
                             <tr key={i} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">Mohamed Ali</td>
                                <td className="px-6 py-4 text-gray-500">Sedra Villa A1</td>
                                <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">Negotiating</span></td>
                                <td className="px-6 py-4 text-green-600 font-bold text-xs">42 Days Left</td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
             </div>
          </div>
      )}

      {/* --- TAB: MARKETING --- */}
      {activeTab === 'marketing' && (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up">
              <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <h3 className="font-bold text-gray-900 mb-6">{t('broker.campaign')}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Lead Gen Form Tool (New) */}
                          <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all cursor-pointer group">
                              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                  <FormInput size={20} />
                              </div>
                              <h4 className="font-bold text-gray-900 mb-1">{t('broker.leadGen')}</h4>
                              <p className="text-xs text-gray-500 mb-3">{t('broker.leadGenDesc')}</p>
                              <button className="text-xs font-bold text-green-600 flex items-center gap-1">{t('broker.buildForm')} <Plus size={12} /></button>
                          </div>

                          <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all cursor-pointer group">
                              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                  <Share2 size={20} />
                              </div>
                              <h4 className="font-bold text-gray-900 mb-1">{t('broker.marketing.social')}</h4>
                              <p className="text-xs text-gray-500 mb-3">Download ready-to-post images & videos.</p>
                              <button className="text-xs font-bold text-blue-600 flex items-center gap-1">Access Library <ExternalLink size={12} /></button>
                          </div>
                          <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all cursor-pointer group">
                              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                  <FileText size={20} />
                              </div>
                              <h4 className="font-bold text-gray-900 mb-1">{t('broker.marketing.brochure')}</h4>
                              <p className="text-xs text-gray-500 mb-3">White-label PDFs with your contact info.</p>
                              <button className="text-xs font-bold text-purple-600 flex items-center gap-1">Browse Files <Download size={12} /></button>
                          </div>
                          <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all cursor-pointer group">
                              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                  <QrCode size={20} />
                              </div>
                              <h4 className="font-bold text-gray-900 mb-1">{t('broker.marketing.qr')}</h4>
                              <p className="text-xs text-gray-500 mb-3">Create trackable QR codes for print ads.</p>
                              <button className="text-xs font-bold text-orange-600 flex items-center gap-1">Create New <Plus size={12} /></button>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={100} /></div>
                  <div className="relative z-10">
                      <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                          <Sparkles className="text-brand-400" size={20} /> {t('broker.tools.ai')}
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">{t('broker.tools.desc')}</p>
                      
                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 mb-4">
                          {generatedContent ? (
                              <p className="text-sm whitespace-pre-line leading-relaxed">{generatedContent}</p>
                          ) : (
                              <p className="text-sm text-gray-400 italic text-center py-4">AI generated content will appear here...</p>
                          )}
                      </div>

                      <div className="flex gap-3">
                          <button 
                            onClick={generateAIContent}
                            disabled={isLoadingAI}
                            className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2"
                          >
                              {isLoadingAI ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div> : <Sparkles size={16} />}
                              {t('broker.tools.generate')}
                          </button>
                          {generatedContent && (
                              <button 
                                onClick={() => copyToClipboard(generatedContent)}
                                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all"
                              >
                                  <Copy size={16} />
                              </button>
                          )}
                      </div>
                  </div>
              </div>
         </div>
      )}

      {/* --- TAB: PROFILE & CONTRACTS --- */}
      {activeTab === 'profile' && (
          <div className="animate-slide-up">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                      {/* Contracts */}
                      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                              <h3 className="font-bold text-gray-900">{t('broker.contracts')}</h3>
                              <button className="text-brand-600 text-sm font-bold">{t('broker.archive')}</button>
                          </div>
                          <div className="divide-y divide-gray-100">
                              {[1, 2].map(i => (
                                  <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"><Building2 className="text-gray-500" size={20} /></div>
                                        <div>
                                          <p className="font-bold text-sm text-gray-900">{i === 1 ? 'Roshn Real Estate' : 'Retal Development'}</p>
                                          <p className="text-xs text-gray-500">Marketing Agreement • Active</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">2.5% Comm</span>
                                        <button className="text-gray-400 hover:text-gray-600"><ChevronRight size={16} /></button>
                                    </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
                  
                  <div className="space-y-6">
                      {/* License Details / Profile Form */}
                      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                          <div className="flex justify-between items-center mb-4">
                              <h3 className="font-bold text-gray-900 flex items-center gap-2"><BadgeCheck size={20} className="text-brand-600" /> {t('broker.profileDetails')}</h3>
                              {currentUser.role === 'agent' && (
                                <button 
                                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                                    className="text-xs font-bold text-brand-600 hover:underline"
                                >
                                    {isEditingProfile ? 'Cancel' : 'Edit'}
                                </button>
                              )}
                          </div>
                          
                          {isEditingProfile && currentUser.role === 'agent' ? (
                              <form onSubmit={handleProfileSave} className="space-y-4">
                                  {/* Profile Picture Input */}
                                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                      <div className="relative w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
                                          {profileForm.profileImage ? (
                                              <img src={profileForm.profileImage} alt="Prev" className="w-full h-full object-cover" />
                                          ) : (
                                              <User className="text-gray-400" />
                                          )}
                                          <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                                      </div>
                                      <div className="flex-1">
                                          <p className="text-sm font-bold text-gray-700">{t('broker.changePhoto')}</p>
                                          <p className="text-xs text-gray-500">Click to upload new image</p>
                                      </div>
                                  </div>

                                  <div>
                                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Agency Name</label>
                                      <input 
                                        type="text" 
                                        value={profileForm.agencyName}
                                        onChange={(e) => setProfileForm({...profileForm, agencyName: e.target.value})}
                                        className="w-full p-2 bg-gray-50 rounded-lg border-transparent focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                                      />
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                      <div>
                                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">FAL License</label>
                                          <input 
                                            type="text" 
                                            value={profileForm.falNumber}
                                            onChange={(e) => setProfileForm({...profileForm, falNumber: e.target.value})}
                                            className="w-full p-2 bg-gray-50 rounded-lg border-transparent focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CR Number</label>
                                          <input 
                                            type="text" 
                                            value={profileForm.crNumber}
                                            onChange={(e) => setProfileForm({...profileForm, crNumber: e.target.value})}
                                            className="w-full p-2 bg-gray-50 rounded-lg border-transparent focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                                          />
                                      </div>
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Locations</label>
                                      <input 
                                        type="text" 
                                        value={profileForm.locations}
                                        onChange={(e) => setProfileForm({...profileForm, locations: e.target.value})}
                                        className="w-full p-2 bg-gray-50 rounded-lg border-transparent focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">IBAN</label>
                                      <input 
                                        type="text" 
                                        value={profileForm.iban}
                                        onChange={(e) => setProfileForm({...profileForm, iban: e.target.value})}
                                        className="w-full p-2 bg-gray-50 rounded-lg border-transparent focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none text-sm font-mono"
                                      />
                                  </div>
                                  <button type="submit" className="w-full py-2 bg-brand-600 text-white rounded-lg font-bold text-sm hover:bg-brand-700 flex items-center justify-center gap-2">
                                      <Save size={14} /> Save Changes
                                  </button>
                              </form>
                          ) : (
                              <div className="space-y-4">
                                  <div>
                                      <p className="text-xs text-gray-400 uppercase font-bold">FAL License Number</p>
                                      <p className="font-mono font-bold text-gray-900">{brokerInfo.falNumber || 'Not Provided'}</p>
                                      {brokerInfo.falNumber !== 'N/A' && <div className="flex items-center gap-1 text-xs text-green-600 mt-1"><CheckCircle size={10} /> Valid Verified</div>}
                                  </div>
                                  <div>
                                      <p className="text-xs text-gray-400 uppercase font-bold">Commercial Reg (CR)</p>
                                      <p className="font-mono font-bold text-gray-900">{brokerInfo.crNumber || 'Not Provided'}</p> 
                                  </div>
                                  <div>
                                      <p className="text-xs text-gray-400 uppercase font-bold">Nawafiz Verification</p>
                                      <p className="font-bold text-gray-900">Level 3 - Verified Partner</p>
                                  </div>
                              </div>
                          )}
                      </div>
                      
                      {/* Bank Details */}
                      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><CreditCard size={20} className="text-brand-600" /> {t('broker.banking')}</h3>
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 mb-4">
                              <p className="text-xs text-gray-500 uppercase mb-1">{t('broker.linkedAccount')}</p>
                              <div className="flex items-center gap-2 mb-2">
                                  <div className="w-8 h-8 bg-blue-900 rounded flex items-center justify-center text-white text-[10px] font-bold">ARB</div>
                                  <span className="font-bold text-sm">Al Rajhi Bank</span>
                              </div>
                              <p className="font-mono text-xs text-gray-600">{brokerInfo.iban || 'No IBAN Linked'}</p>
                          </div>
                          <button className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-gray-800">{t('broker.managePayouts')}</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};
