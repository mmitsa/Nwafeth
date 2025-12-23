


import React, { useState } from 'react';
import { 
  Megaphone, Wallet, 
  User, FileText, 
  PenTool, Eye, EyeOff, AlertTriangle, Loader2,
  FileSignature, X, DollarSign, Handshake, ShieldCheck, Clock, Users, Briefcase, Phone,
  CreditCard, Banknote, CheckCircle
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Listing, Contract, Lead, CobrokingRequest, ContractType } from '../types';
import { useAuth } from '../contexts/AuthContext';
import clsx from 'clsx';

// --- MOCK DATA ---

const MOCK_LISTINGS: Listing[] = [
  {
    id: 'L101', developerId: 'DEV01', developerName: 'Roshn', 
    title: 'Sedra Phase 2 - Type A Villa', location: 'North Riyadh', 
    commissionRate: 2.5, commissionDisplay: '2.5% (~75,000 SAR)',
    status: 'Active', 
    assets: [{type: 'image', url: ''}, {type: 'pdf', url: ''}],
    thumbnail: 'https://images.unsplash.com/photo-1600596542815-22b845069566?auto=format&fit=crop&w=800'
  },
  {
    id: 'L102', developerId: 'DEV02', developerName: 'Retal', 
    title: 'Ewan Al Maali Apartments', location: 'Khobar', 
    commissionRate: 2.0, commissionDisplay: '2.0% (~30,000 SAR)',
    status: 'Active', 
    assets: [{type: 'image', url: ''}],
    thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800'
  },
  {
    id: 'L103', developerId: 'DEV03', developerName: 'Ajdan', 
    title: 'Infiniti Tower Office', location: 'Khobar Corniche', 
    commissionRate: 3.0, commissionDisplay: '3.0% (~45,000 SAR)',
    status: 'Active', 
    assets: [{type: 'image', url: ''}, {type: 'video', url: ''}],
    thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800'
  },
];

const MOCK_COBROKING: CobrokingRequest[] = [
  {
    id: 'REQ-001', type: 'Have Buyer', title: 'Serious Buyer for North Riyadh Villa', 
    location: 'Al Malqa / Hittin', budget: '3.5M - 4.2M SAR', commissionSplit: '50/50',
    urgency: 'High', date: '2 hours ago', description: 'Pre-qualified buyer looking for modern villa, 400m+, ready to move.',
    postedBy: { id: 'BROKER-A', name: 'Khalid Al-Otaibi', phone: '0501239876', company: 'Elite Homes', verified: true }
  },
  {
    id: 'REQ-002', type: 'Have Property', title: 'Exclusive Commercial Land Plot', 
    location: 'Jeddah, Obhur', budget: '12M SAR', commissionSplit: '40/60',
    urgency: 'Medium', date: '1 day ago', description: 'Direct with owner. Commercial strip on main road, perfect for plaza.',
    postedBy: { id: 'BROKER-B', name: 'Fahad Real Estate', phone: '0559876543', company: 'Fahad Co', verified: true }
  }
];

const INITIAL_CONTRACTS: Contract[] = [];

const INITIAL_LEADS: Lead[] = [
  {
    id: 'LEAD1', brokerId: 'current', listingId: 'L101', 
    clientName: 'Abdullah Al-Faisal', clientPhone: '0501234567', 
    submittedAt: '2024-05-20', expiryDate: '2024-07-19', 
    status: 'Negotiation', potentialCommission: 75000, isProtected: true
  }
];

export const AffiliateNetwork: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'projects' | 'cobroking' | 'leads' | 'wallet'>('projects');
  
  // State
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [coBrokingRequests, setCoBrokingRequests] = useState<CobrokingRequest[]>(MOCK_COBROKING);
  
  // Modals State
  const [isContractModalOpen, setContractModalOpen] = useState(false);
  const [isLeadModalOpen, setLeadModalOpen] = useState(false);
  
  // Context for Actions
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [selectedCobroking, setSelectedCobroking] = useState<CobrokingRequest | null>(null);
  const [currentContractType, setCurrentContractType] = useState<ContractType>('MARKETING');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', phone: '' });
  const [leadError, setLeadError] = useState<string | null>(null);

  // --- CONTRACT LOGIC ---

  const hasSignedContract = (type: ContractType, referenceId: string) => {
    return contracts.some(c => c.type === type && c.referenceId === referenceId && c.status === 'ACTIVE');
  };

  // Type A: Start Marketing (Developer -> Broker)
  const handleStartMarketing = (listing: Listing) => {
    setSelectedListing(listing);
    setCurrentContractType('MARKETING');
    setContractModalOpen(true);
  };

  // Type B: Reveal Contact (Broker -> Broker) - Conditional Disclosure
  const handleRevealContact = (request: CobrokingRequest) => {
    setSelectedCobroking(request);
    setCurrentContractType('CO_BROKING');
    setContractModalOpen(true);
  };

  // Type C: Generate Brokerage Agreement (Broker -> Buyer)
  const handleGenerateBrokerageContract = (lead: Lead) => {
    // In a real app, this would open a form to customize terms
    alert(t('aff.contract.processing'));
  };

  const signContract = () => {
    setIsProcessing(true);
    setTimeout(() => {
      let newContract: Contract;

      if (currentContractType === 'MARKETING' && selectedListing) {
        newContract = {
          id: `C-${Date.now()}`, type: 'MARKETING', status: 'ACTIVE',
          brokerId: currentUser.id, referenceId: selectedListing.id,
          partyA: selectedListing.developerName, partyB: currentUser.name,
          signedAt: new Date().toISOString(), termsVersion: 'v1.0'
        };
      } else if (currentContractType === 'CO_BROKING' && selectedCobroking) {
        newContract = {
          id: `C-${Date.now()}`, type: 'CO_BROKING', status: 'ACTIVE',
          brokerId: currentUser.id, referenceId: selectedCobroking.id,
          partyA: selectedCobroking.postedBy.name, partyB: currentUser.name,
          signedAt: new Date().toISOString(), termsVersion: 'v1.0'
        };
      } else {
        setIsProcessing(false);
        return;
      }

      setContracts([...contracts, newContract]);
      setIsProcessing(false);
      setContractModalOpen(false);
    }, 1500);
  };

  // --- LEAD LOGIC (The Vault) ---
  const handleAddLead = (listing: Listing) => {
    setSelectedListing(listing);
    setLeadForm({ name: '', phone: '' });
    setLeadError(null);
    setLeadModalOpen(true);
  };

  const submitLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListing) return;
    setLeadError(null);
    setIsProcessing(true);

    setTimeout(() => {
      // 1. Sanitize
      const sanitizedPhone = leadForm.phone.replace(/\D/g, '');
      
      // 2. Duplicate Check
      const isDuplicate = leads.some(
        l => l.listingId === selectedListing.id && l.clientPhone === sanitizedPhone
      );

      if (isDuplicate) {
        setLeadError(t('aff.lead.conflict'));
        setIsProcessing(false);
        return;
      }

      // 3. Lock Lead (60 Days)
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 60);

      const newLead: Lead = {
        id: `L-${Date.now()}`, brokerId: currentUser.id, listingId: selectedListing.id,
        clientName: leadForm.name, clientPhone: sanitizedPhone,
        submittedAt: new Date().toISOString(), expiryDate: expiry.toISOString(),
        status: 'New', potentialCommission: selectedListing.commissionRate * 30000,
        isProtected: true
      };

      setLeads([newLead, ...leads]);
      setIsProcessing(false);
      setLeadModalOpen(false);
      setActiveTab('leads');
    }, 1500);
  };

  // --- RENDERING CONTENT ---

  const renderContractContent = () => {
    const date = new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US');

    if (currentContractType === 'MARKETING' && selectedListing) {
      // Type A
      return (
        <div className="space-y-4">
           <h4 className="font-bold text-lg text-gray-900">{t('aff.contract.type.a')}</h4>
           <div className="text-sm text-gray-600 font-mono p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p><strong>Date:</strong> {date}</p>
              <p><strong>Project:</strong> {selectedListing.title}</p>
              <p><strong>Developer:</strong> {selectedListing.developerName}</p>
              <p><strong>Commission:</strong> {selectedListing.commissionRate}% upon successful closing.</p>
              <p className="mt-2">The Broker agrees to market the property ethically. The Developer guarantees lead protection for 60 days from submission in the system.</p>
           </div>
        </div>
      );
    }

    if (currentContractType === 'CO_BROKING' && selectedCobroking) {
      // Type B
      return (
        <div className="space-y-4">
           <h4 className="font-bold text-lg text-gray-900">{t('aff.contract.type.b')}</h4>
           <div className="text-sm text-gray-600 font-mono p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p><strong>Date:</strong> {date}</p>
              <p><strong>Counter-Party:</strong> {selectedCobroking.postedBy.name}</p>
              <p><strong>Deal Reference:</strong> {selectedCobroking.title}</p>
              <p><strong>Agreed Split:</strong> {selectedCobroking.commissionSplit}</p>
              <p className="mt-2 font-bold text-red-600">NON-CIRCUMVENTION CLAUSE:</p>
              <p>The Undersigned agrees NOT to contact the principal owner/buyer directly, bypassing the listing broker. Any attempt to circumvent will result in legal action and platform ban.</p>
           </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 pb-24 animate-fade-in relative">
      
      {/* HERO */}
      <div className="relative bg-[#0f172a] rounded-3xl p-8 md:p-12 text-white overflow-hidden shadow-2xl">
          <div className="absolute top-0 ltr:right-0 rtl:left-0 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                     <Handshake className="text-brand-400" size={24} />
                 </div>
                 <span className="text-brand-400 font-bold tracking-wider uppercase text-xs border border-brand-500/30 px-3 py-1 rounded-full bg-brand-900/50">
                    B2B Alliance
                 </span>
              </div>
              <h2 className="text-4xl font-extrabold mb-4 tracking-tight">{t('aff.title')}</h2>
              <p className="text-gray-400 max-w-2xl text-lg leading-relaxed">{t('aff.subtitle')}</p>
          </div>
      </div>

      {/* TABS */}
      <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex overflow-x-auto no-scrollbar sticky top-20 z-20 gap-1">
          {[
            { id: 'projects', icon: Megaphone, label: t('aff.tab.projects') },
            { id: 'cobroking', icon: Users, label: t('aff.tab.cobroking') },
            { id: 'leads', icon: ShieldCheck, label: t('aff.tab.leads'), count: leads.length },
            { id: 'wallet', icon: Wallet, label: t('aff.tab.wallet') },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={clsx(
                "flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap", 
                activeTab === tab.id ? "bg-gray-900 text-white shadow-lg" : "text-gray-500 hover:bg-gray-50"
              )}
            >
                <tab.icon size={18} /> {tab.label}
                {tab.count !== undefined && <span className="ml-2 bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full text-xs">{tab.count}</span>}
            </button>
          ))}
      </div>

      {/* --- VIEW 1: MARKETPLACE (Type A) --- */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {listings.map((project) => {
             const signed = hasSignedContract('MARKETING', project.id);
             return (
              <div key={project.id} className="bg-white rounded-3xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all group flex flex-col">
                  {/* Image Header */}
                  <div className="h-52 relative overflow-hidden">
                      <img src={project.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1 animate-pulse">
                          <DollarSign size={14} /> {project.commissionDisplay}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                          <p className="text-xs font-bold opacity-80 uppercase tracking-wider mb-1">{project.developerName}</p>
                          <h4 className="text-xl font-bold leading-tight">{project.title}</h4>
                      </div>
                  </div>
                  
                  <div className={clsx("h-1 w-full", signed ? "bg-green-500" : "bg-gray-200")}></div>

                  <div className="p-6 flex-1 flex flex-col">
                      <div className="flex-1">
                          {signed ? (
                             <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-xl mb-4 border border-green-100">
                                <FileSignature size={18} /> <span className="text-xs font-bold">{t('aff.contract.signed')}</span>
                             </div>
                          ) : (
                             <div className="flex items-center gap-2 text-gray-500 bg-gray-50 p-3 rounded-xl mb-4 border border-gray-100">
                                <FileText size={18} /> <span className="text-xs font-medium">Sign contract to start marketing</span>
                             </div>
                          )}
                      </div>

                      {signed ? (
                        <button 
                           onClick={() => handleAddLead(project)}
                           className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
                        >
                           <User size={18} /> {t('aff.btn.addlead')}
                        </button>
                      ) : (
                        <button 
                           onClick={() => handleStartMarketing(project)}
                           className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-200"
                        >
                           <PenTool size={18} /> {t('aff.btn.market')}
                        </button>
                      )}
                  </div>
              </div>
             );
          })}
        </div>
      )}

      {/* --- VIEW 2: CO-BROKING (Type B - Conditional Disclosure) --- */}
      {activeTab === 'cobroking' && (
        <div className="space-y-6 animate-slide-up">
           <div className="flex justify-between items-center">
               <h3 className="font-bold text-xl text-gray-900">{t('aff.cobroking.title')}</h3>
               <button className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold">Post Request</button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {coBrokingRequests.map(req => {
               const isUnlocked = hasSignedContract('CO_BROKING', req.id);
               return (
                 <div key={req.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <span className={clsx("px-3 py-1 rounded-full text-xs font-bold", req.type === 'Have Buyer' ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700")}>
                              {t(req.type === 'Have Buyer' ? 'aff.cobroking.haveBuyer' : 'aff.cobroking.haveProperty')}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">{req.date}</span>
                        </div>
                        <h4 className="font-bold text-lg text-gray-900 mb-2">{req.title}</h4>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{req.description}</p>
                        
                        <div className="flex flex-wrap gap-3 text-xs font-bold text-gray-500 mb-6">
                            <span className="bg-gray-100 px-2 py-1 rounded">{req.location}</span>
                            <span className="bg-gray-100 px-2 py-1 rounded">{req.budget}</span>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded">{t('aff.cobroking.split')}: {req.commissionSplit}</span>
                        </div>

                        {/* CONDITIONAL DISCLOSURE AREA */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 relative overflow-hidden">
                           {!isUnlocked && (
                             <div className="absolute inset-0 backdrop-blur-md bg-white/60 z-10 flex items-center justify-center">
                                <button 
                                  onClick={() => handleRevealContact(req)}
                                  className="bg-brand-600 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg hover:bg-brand-700 flex items-center gap-2 transition-transform hover:scale-105"
                                >
                                   <Eye size={16} /> {t('aff.contract.reveal')}
                                </button>
                             </div>
                           )}
                           
                           <div className={clsx("flex items-center gap-3", !isUnlocked && "blur-sm")}>
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                                 {req.postedBy.name.charAt(0)}
                              </div>
                              <div>
                                 <p className="font-bold text-gray-900">{req.postedBy.name}</p>
                                 <p className="text-xs text-gray-500 flex items-center gap-1">
                                    {req.postedBy.phone} {req.postedBy.verified && <ShieldCheck size={12} className="text-blue-500" />}
                                 </p>
                              </div>
                           </div>
                        </div>
                    </div>
                 </div>
               );
             })}
           </div>
        </div>
      )}

      {/* --- VIEW 3: LEAD VAULT (Protected) --- */}
      {activeTab === 'leads' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden animate-slide-up">
               <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                   <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <ShieldCheck className="text-green-600" /> My Protected Leads
                   </h3>
                   <div className="flex gap-2 text-xs font-bold">
                       <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> {t('aff.protection.active')}</span>
                       <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> {t('aff.protection.expired')}</span>
                   </div>
               </div>
               <div className="overflow-x-auto">
                   <table className="w-full">
                       <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider text-start">
                           <tr>
                               <th className="px-6 py-4 text-start">{t('aff.lead.name')}</th>
                               <th className="px-6 py-4 text-start">Status</th>
                               <th className="px-6 py-4 text-start">Protection (60 Days)</th>
                               <th className="px-6 py-4 text-end">Actions</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100">
                           {leads.map(lead => {
                               const daysLeft = Math.ceil((new Date(lead.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                               const isExpired = daysLeft <= 0;
                               return (
                                   <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                                       <td className="px-6 py-4">
                                           <p className="font-bold text-gray-900">{lead.clientName}</p>
                                           <p className="text-xs text-gray-400 font-mono">{lead.clientPhone.replace(/(\d{4})\d{3}(\d{3})/, '$1***$2')}</p>
                                       </td>
                                       <td className="px-6 py-4">
                                           <span className={clsx("px-2 py-1 rounded-full text-xs font-bold uppercase", lead.status === 'New' ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600")}>
                                               {lead.status}
                                           </span>
                                       </td>
                                       <td className="px-6 py-4 w-1/3">
                                            <div className="flex items-center justify-between text-xs font-bold mb-1">
                                                <span className={isExpired ? "text-red-500" : "text-green-600"}>
                                                    {isExpired ? t('aff.protection.expired') : `${daysLeft} ${t('aff.protection.days')}`}
                                                </span>
                                                <span className="text-gray-400">{lead.expiryDate.split('T')[0]}</span>
                                            </div>
                                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                                <div 
                                                    className={clsx("h-full rounded-full transition-all duration-500", isExpired ? "bg-red-500" : daysLeft < 10 ? "bg-orange-500" : "bg-green-500")} 
                                                    style={{width: `${Math.max(0, Math.min(100, (daysLeft/60)*100))}%`}}
                                                ></div>
                                            </div>
                                       </td>
                                       <td className="px-6 py-4 text-end">
                                           <button 
                                             onClick={() => handleGenerateBrokerageContract(lead)}
                                             className="text-xs font-bold text-brand-600 hover:bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-200 transition-colors"
                                           >
                                               {t('aff.contract.generate')} (Type C)
                                           </button>
                                       </td>
                                   </tr>
                               );
                           })}
                       </tbody>
                   </table>
               </div>
          </div>
      )}

      {/* --- VIEW 4: WALLET / ACCOUNT --- */}
      {activeTab === 'wallet' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
              <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                          <Banknote size={32} />
                      </div>
                      <div>
                          <h3 className="text-2xl font-bold text-gray-900">Affiliate Account Status</h3>
                          <div className="flex items-center gap-2 text-green-600 text-sm font-bold mt-1">
                              <CheckCircle size={16} /> Bank Account Verified
                          </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                          <p className="text-xs font-bold text-gray-500 uppercase mb-1">Bank Name</p>
                          <p className="font-bold text-gray-900">Al Rajhi Bank</p>
                      </div>
                      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                          <p className="text-xs font-bold text-gray-500 uppercase mb-1">IBAN</p>
                          <p className="font-mono font-bold text-gray-900">SA55 8000 0000 1234 5678 9012</p>
                      </div>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                      <button className="text-sm font-bold text-brand-600 hover:underline flex items-center gap-1">
                          <PenTool size={14} /> Edit Account Details
                      </button>
                      <button className="bg-brand-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-700 flex items-center gap-2 shadow-lg shadow-brand-200">
                          <CreditCard size={18} /> Request Payout
                      </button>
                  </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 flex items-start gap-4">
                  <ShieldCheck className="text-blue-600 shrink-0 mt-1" />
                  <div>
                      <h4 className="font-bold text-blue-800 mb-1">Secure Payouts System</h4>
                      <p className="text-sm text-blue-700 leading-relaxed">
                          Your account is linked to the General Authority for Real Estate (REGA) Ejar system. 
                          Commissions are automatically released upon verified closing of deals within the platform.
                      </p>
                  </div>
              </div>
          </div>
      )}

      {/* --- MODAL: CONTRACT ENGINE --- */}
      {isContractModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
                <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <FileSignature className="text-brand-600" />
                        <h3 className="font-bold text-gray-900">{t('aff.contract.title')}</h3>
                    </div>
                    <button onClick={() => setContractModalOpen(false)}><X className="text-gray-400 hover:text-gray-600" /></button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
                    {renderContractContent()}
                    <div className="mt-6 flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
                         <ShieldCheck className="text-yellow-600 shrink-0 mt-0.5" size={18} />
                         <p className="text-xs text-yellow-800 leading-relaxed">
                             By digitally signing this agreement via OTP, you agree to the terms outlined above. 
                             This contract is legally binding under Saudi Law.
                         </p>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-white">
                    <button 
                        onClick={signContract}
                        disabled={isProcessing}
                        className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                        {isProcessing ? <Loader2 className="animate-spin" /> : <PenTool size={20} />}
                        {t('aff.contract.sign')}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- MODAL: ADD LEAD --- */}
      {isLeadModalOpen && selectedListing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
                  <div className="bg-brand-600 p-6 text-white">
                      <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold">{t('aff.lead.submit')}</h3>
                          <button onClick={() => setLeadModalOpen(false)} className="text-brand-200 hover:text-white"><X /></button>
                      </div>
                      <p className="text-brand-100 text-sm opacity-90">
                          Registering this client locks them to you for 60 days for the project: <strong>{selectedListing.title}</strong>
                      </p>
                  </div>
                  
                  <form onSubmit={submitLead} className="p-6 space-y-4">
                      {leadError && (
                          <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-lg flex items-center gap-2 border border-red-100">
                              <AlertTriangle size={16} /> {leadError}
                          </div>
                      )}
                      
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">{t('aff.lead.name')}</label>
                          <input 
                            type="text" required
                            value={leadForm.name}
                            onChange={e => setLeadForm({...leadForm, name: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="Full Name"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">{t('aff.lead.phone')}</label>
                          <input 
                            type="tel" required
                            value={leadForm.phone}
                            onChange={e => setLeadForm({...leadForm, phone: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none font-mono"
                            placeholder="05xxxxxxxx"
                          />
                      </div>

                      <button 
                        type="submit"
                        disabled={isProcessing}
                        className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg mt-4"
                      >
                          {isProcessing ? <Loader2 className="animate-spin" /> : <ShieldCheck size={18} />}
                          {t('aff.lead.submit')}
                      </button>
                  </form>
              </div>
          </div>
      )}

    </div>
  );
};
