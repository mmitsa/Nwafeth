
import React, { useState, useEffect } from 'react';
import { User, Mail, Bell, Shield, Globe, LogOut, Save, Check, Plus, Trash2, X, Pencil, Briefcase, Building2, CreditCard, FileText, MapPin, Building, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { UserRole } from '../types';
import clsx from 'clsx';

export const Settings: React.FC = () => {
  const { currentUser, users, switchUser, updateProfile, addUser, editUser, deleteUser } = useAuth();
  const { t, language, setLanguage, dir } = useLanguage();
  const [isSaved, setIsSaved] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  
  // Profile Form State
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    notifications: currentUser.preferences.notifications,
    newsletter: currentUser.preferences.newsletter
  });

  // Broker Details Form State
  const [brokerForm, setBrokerForm] = useState({
    falNumber: '',
    crNumber: '',
    agencyName: '',
    iban: '',
    locations: '',
    profileImage: ''
  });

  // Developer Details Form State
  const [devForm, setDevForm] = useState({
    companyName: '',
    crNumber: '',
    taxNumber: '',
    headquarters: '',
    website: ''
  });

  // New/Edit User Form State
  const [userForm, setUserForm] = useState<{name: string, email: string, role: UserRole}>({
    name: '',
    email: '',
    role: 'investor'
  });

  // Sync local state with currentUser changes
  useEffect(() => {
    setFormData({
      name: currentUser.name,
      email: currentUser.email,
      notifications: currentUser.preferences.notifications,
      newsletter: currentUser.preferences.newsletter
    });

    if (currentUser.role === 'agent' && currentUser.brokerDetails) {
      setBrokerForm({
        falNumber: currentUser.brokerDetails.falNumber || '',
        crNumber: currentUser.brokerDetails.crNumber || '',
        agencyName: currentUser.brokerDetails.agencyName || '',
        iban: currentUser.brokerDetails.iban || '',
        locations: currentUser.brokerDetails.locations.join(', ') || '',
        profileImage: currentUser.brokerDetails.profileImage || ''
      });
    }

    if (currentUser.role === 'developer' && currentUser.developerDetails) {
        setDevForm({
            companyName: currentUser.developerDetails.companyName || '',
            crNumber: currentUser.developerDetails.crNumber || '',
            taxNumber: currentUser.developerDetails.taxNumber || '',
            headquarters: currentUser.developerDetails.headquarters || '',
            website: currentUser.developerDetails.website || ''
        });
    }
  }, [currentUser]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBrokerForm(prev => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updateData: any = {
      name: formData.name,
      email: formData.email,
      preferences: {
        notifications: formData.notifications,
        newsletter: formData.newsletter
      }
    };

    if (currentUser.role === 'agent') {
      updateData.brokerDetails = {
        falNumber: brokerForm.falNumber,
        crNumber: brokerForm.crNumber,
        agencyName: brokerForm.agencyName,
        iban: brokerForm.iban,
        locations: brokerForm.locations.split(',').map(l => l.trim()).filter(l => l),
        profileImage: brokerForm.profileImage
      };
    }

    if (currentUser.role === 'developer') {
        updateData.developerDetails = {
            companyName: devForm.companyName,
            crNumber: devForm.crNumber,
            taxNumber: devForm.taxNumber,
            headquarters: devForm.headquarters,
            website: devForm.website,
            logo: currentUser.developerDetails?.logo || 'BLDG' // Keep existing logo or default
        };
    }

    updateProfile(updateData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleOpenAddUser = () => {
    setUserForm({ name: '', email: '', role: 'investor' });
    setEditingUserId(null);
    setIsAddUserOpen(true);
  };

  const handleOpenEditUser = (user: any) => {
    setUserForm({ name: user.name, email: user.email, role: user.role });
    setEditingUserId(user.id);
    setIsAddUserOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
    }
  };

  const handleUserFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!userForm.name || !userForm.email) return;
    
    if (editingUserId) {
      editUser(editingUserId, userForm);
    } else {
      addUser(userForm.name, userForm.email, userForm.role);
    }
    setIsAddUserOpen(false);
    setUserForm({ name: '', email: '', role: 'investor' });
    setEditingUserId(null);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto animate-in fade-in duration-500 relative">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{t('settings.title')}</h2>
        <p className="text-gray-500 mt-1">{t('settings.account')} - <span className="capitalize text-brand-600 font-medium">{currentUser.role}</span></p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: General Settings */}
        <div className="lg:col-span-2 space-y-6">
          
          <form onSubmit={handleSave} className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <User size={18} /> {t('settings.general')}
                </h3>
                <span className={clsx(
                  "px-2 py-1 rounded text-xs font-bold uppercase tracking-wider",
                  currentUser.role === 'admin' ? "bg-purple-100 text-purple-700" :
                  currentUser.role === 'agent' ? "bg-blue-100 text-blue-700" :
                  currentUser.role === 'developer' ? "bg-amber-100 text-amber-700" :
                  "bg-green-100 text-green-700"
                )}>
                  {currentUser.role}
                </span>
              </div>
              <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.name')}</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.email')}</label>
                      <div className="relative">
                        <Mail size={16} className="absolute top-3 left-3 text-gray-400" />
                        <input 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">{t('settings.notifications')}</h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input 
                          type="checkbox" 
                          checked={formData.notifications}
                          onChange={(e) => setFormData({...formData, notifications: e.target.checked})}
                          className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{t('settings.pushNotif')}</p>
                          <p className="text-xs text-gray-500">Get alerts about market changes and new opportunities.</p>
                        </div>
                        <Bell size={18} className="text-gray-400" />
                      </label>

                      <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input 
                          type="checkbox" 
                          checked={formData.newsletter}
                          onChange={(e) => setFormData({...formData, newsletter: e.target.checked})}
                          className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{t('settings.newsletter')}</p>
                          <p className="text-xs text-gray-500">Receive our weekly AI-generated market report.</p>
                        </div>
                        <Mail size={18} className="text-gray-400" />
                      </label>
                    </div>
                  </div>
              </div>
            </div>

            {/* Broker Specific Settings */}
            {currentUser.role === 'agent' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-slide-up">
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Briefcase size={18} /> Broker Professional Profile
                  </h3>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold uppercase">Verified</span>
                </div>
                <div className="p-6 space-y-6">
                  
                  {/* Profile Picture Upload */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden group">
                      {brokerForm.profileImage ? (
                        <img src={brokerForm.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User size={32} className="text-gray-400" />
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera className="text-white" size={20} />
                      </div>
                      <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Profile Picture</p>
                      <p className="text-xs text-gray-500">Upload a professional photo to build trust.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">FAL License Number</label>
                      <div className="relative">
                          <FileText size={16} className="absolute top-3 left-3 text-gray-400" />
                          <input 
                            type="text" 
                            value={brokerForm.falNumber}
                            onChange={(e) => setBrokerForm({...brokerForm, falNumber: e.target.value})}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" 
                            placeholder="1100xxxxxx" 
                          />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Commercial Registration (CR)</label>
                      <div className="relative">
                          <Building2 size={16} className="absolute top-3 left-3 text-gray-400" />
                          <input 
                            type="text" 
                            value={brokerForm.crNumber}
                            onChange={(e) => setBrokerForm({...brokerForm, crNumber: e.target.value})}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" 
                            placeholder="1010xxxxxx" 
                          />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Organization / Agency Name</label>
                        <div className="relative">
                            <Briefcase size={16} className="absolute top-3 left-3 text-gray-400" />
                            <input 
                                type="text" 
                                value={brokerForm.agencyName}
                                onChange={(e) => setBrokerForm({...brokerForm, agencyName: e.target.value})}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" 
                                placeholder="Agency Name" 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Primary Locations</label>
                        <div className="relative">
                            <MapPin size={16} className="absolute top-3 left-3 text-gray-400" />
                            <input 
                                type="text" 
                                value={brokerForm.locations}
                                onChange={(e) => setBrokerForm({...brokerForm, locations: e.target.value})}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" 
                                placeholder="Riyadh, Jeddah, Dammam..." 
                            />
                        </div>
                    </div>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payout IBAN (SA)</label>
                      <div className="relative">
                          <CreditCard size={16} className="absolute top-3 left-3 text-gray-400" />
                          <input 
                            type="text" 
                            value={brokerForm.iban}
                            onChange={(e) => setBrokerForm({...brokerForm, iban: e.target.value})}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none font-mono" 
                            placeholder="SA..." 
                          />
                      </div>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Shield size={10} /> Payouts are processed via Ejar verified channels only.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Developer Specific Settings */}
            {currentUser.role === 'developer' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-slide-up">
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Building size={18} /> Developer Corporate Profile
                  </h3>
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-bold uppercase">Wafi Certified</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                      <div className="relative">
                          <Building2 size={16} className="absolute top-3 left-3 text-gray-400" />
                          <input 
                            type="text" 
                            value={devForm.companyName}
                            onChange={(e) => setDevForm({...devForm, companyName: e.target.value})}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" 
                            placeholder="Roshn Real Estate..." 
                          />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Commercial Registration (CR)</label>
                      <div className="relative">
                          <FileText size={16} className="absolute top-3 left-3 text-gray-400" />
                          <input 
                            type="text" 
                            value={devForm.crNumber}
                            onChange={(e) => setDevForm({...devForm, crNumber: e.target.value})}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" 
                            placeholder="1010xxxxxx" 
                          />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tax Number (VAT)</label>
                        <div className="relative">
                            <CreditCard size={16} className="absolute top-3 left-3 text-gray-400" />
                            <input 
                                type="text" 
                                value={devForm.taxNumber}
                                onChange={(e) => setDevForm({...devForm, taxNumber: e.target.value})}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" 
                                placeholder="300xxxxxxxxx" 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Headquarters Location</label>
                        <div className="relative">
                            <MapPin size={16} className="absolute top-3 left-3 text-gray-400" />
                            <input 
                                type="text" 
                                value={devForm.headquarters}
                                onChange={(e) => setDevForm({...devForm, headquarters: e.target.value})}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" 
                                placeholder="Riyadh, Olaya St..." 
                            />
                        </div>
                    </div>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Official Website</label>
                      <div className="relative">
                          <Globe size={16} className="absolute top-3 left-3 text-gray-400" />
                          <input 
                            type="text" 
                            value={devForm.website}
                            onChange={(e) => setDevForm({...devForm, website: e.target.value})}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" 
                            placeholder="https://..." 
                          />
                      </div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <button 
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-lg shadow-gray-200"
              >
                {isSaved ? <Check size={18} /> : <Save size={18} />}
                {isSaved ? t('common.saved') : t('common.save')}
              </button>
            </div>
          </form>

           {/* Language Card */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Globe size={18} /> {t('settings.language')}
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setLanguage('en')}
                  className={clsx(
                    "p-4 rounded-lg border text-center transition-all",
                    language === 'en' 
                      ? "border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-500" 
                      : "border-gray-200 hover:bg-gray-50 text-gray-600"
                  )}
                >
                  <span className="text-lg block mb-1">🇺🇸</span>
                  <span className="font-medium">English</span>
                </button>
                <button 
                  onClick={() => setLanguage('ar')}
                  className={clsx(
                    "p-4 rounded-lg border text-center transition-all",
                    language === 'ar' 
                      ? "border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-500" 
                      : "border-gray-200 hover:bg-gray-50 text-gray-600"
                  )}
                >
                  <span className="text-lg block mb-1">🇸🇦</span>
                  <span className="font-medium">العربية</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: User Management */}
        <div className="space-y-6">
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full max-h-[600px]">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Shield size={18} /> {t('settings.users')}
              </h3>
              <button 
                onClick={handleOpenAddUser}
                className="p-2 bg-brand-100 text-brand-700 rounded-full hover:bg-brand-200 transition-colors"
                title={t('settings.addUser')}
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <p className="text-sm text-gray-500 mb-4">
                {t('settings.switchUser')}
              </p>
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className={clsx(
                      "w-full flex items-center gap-3 p-3 rounded-lg transition-all border group relative",
                      currentUser.id === user.id 
                        ? "bg-brand-50 border-brand-200 ring-1 ring-brand-200" 
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    <button 
                       onClick={() => switchUser(user.id)}
                       className="flex items-center gap-3 flex-1 text-start"
                    >
                        {user.brokerDetails?.profileImage ? (
                            <img src={user.brokerDetails.profileImage} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                        ) : (
                            <div className={clsx(
                            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0",
                            currentUser.id === user.id ? "bg-brand-200 text-brand-800" : "bg-gray-100 text-gray-500"
                            )}>
                            {user.avatar}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                        <p className={clsx(
                            "text-sm font-medium truncate",
                            currentUser.id === user.id ? "text-brand-900" : "text-gray-900"
                        )}>{user.name}</p>
                        <p className="text-xs text-gray-500 capitalize truncate">{user.role}</p>
                        </div>
                    </button>
                    
                    {currentUser.id === user.id && (
                       <span className="px-2 py-1 bg-white rounded text-[10px] font-bold text-brand-600 shadow-sm border border-brand-100">
                         {t('settings.active')}
                       </span>
                    )}
                    {currentUser.id !== user.id && (
                       <div className="flex items-center gap-1">
                           <button 
                            onClick={() => switchUser(user.id)}
                            className="text-gray-400 hover:text-brand-600 p-1.5"
                            title={t('settings.switch')}
                           >
                             <LogOut size={16} className="rtl:rotate-180" />
                           </button>
                           <button 
                            onClick={() => handleOpenEditUser(user)}
                            className="text-gray-300 hover:text-brand-600 p-1.5"
                            title={t('common.edit')}
                           >
                             <Pencil size={16} />
                           </button>
                           <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-gray-300 hover:text-red-500 p-1.5"
                            title={t('common.delete')}
                           >
                             <Trash2 size={16} />
                           </button>
                       </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 bg-blue-50 border-t border-blue-100 text-xs text-blue-800 leading-relaxed">
                {t('settings.role.investor')}<br/>
                {t('settings.role.agent')}<br/>
                {t('settings.role.developer')}<br/>
                {t('settings.role.admin')}
            </div>
          </div>
        </div>
      </div>

      {/* User Modal (Add/Edit) */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-900">{editingUserId ? 'Edit User' : t('settings.addUser')}</h3>
                    <button onClick={() => setIsAddUserOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    <form onSubmit={handleUserFormSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.name')}</label>
                            <input 
                                type="text" 
                                required
                                value={userForm.name}
                                onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.email')}</label>
                            <input 
                                type="email" 
                                required
                                value={userForm.email}
                                onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.role')}</label>
                            <select
                                value={userForm.role}
                                onChange={(e) => setUserForm({...userForm, role: e.target.value as UserRole})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white"
                            >
                                <option value="investor">Investor</option>
                                <option value="agent">Agent</option>
                                <option value="developer">Developer</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="pt-4 flex gap-3">
                            <button 
                                type="button"
                                onClick={() => setIsAddUserOpen(false)}
                                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                            >
                                {t('common.cancel')}
                            </button>
                            <button 
                                type="submit"
                                className="flex-1 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium"
                            >
                                {editingUserId ? t('common.save') : t('common.add')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};
