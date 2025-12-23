
import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, MapPin, Plus, Minus, Navigation, Loader2, 
  Sparkles, X, ArrowRight, Share2, TrendingUp, 
  Locate, Layers, Maximize2, Home, Briefcase, 
  Building2, LandPlot, Compass, Zap, Flame,
  PenTool, Settings, Check, Calculator, Info, Layout, Globe,
  Box, LocateFixed, User
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import clsx from 'clsx';

// --- Types & Mock Data ---

interface MapMarker {
  id: string;
  x: number; // coordinate percentage
  y: number; // coordinate percentage
  title: string;
  price: number;
  type: 'Residential' | 'Commercial' | 'Land';
  status: 'Opportunity' | 'New' | 'Regular';
  image: string;
  roi: number;
  area: number;
  district: string;
}

const NEIGHBORHOODS = [
    { name: 'Al Malqa', x: 40, y: 35, size: 'large', price: 8500, growth: 12 },
    { name: 'Al Narjis', x: 70, y: 25, size: 'large', price: 6200, growth: 8.5 },
    { name: 'Al Olaya', x: 50, y: 60, size: 'medium', price: 7200, growth: 5 },
    { name: 'Hittin', x: 30, y: 50, size: 'medium', price: 9100, growth: 15 },
    { name: 'KAFD', x: 55, y: 45, size: 'small', price: 18000, growth: 22 },
];

const INITIAL_MARKERS: MapMarker[] = [
  {
    id: 'm1', x: 42, y: 38, title: 'Sedra Villa Ph2', price: 2850000, type: 'Residential', status: 'Opportunity',
    image: 'https://images.unsplash.com/photo-1600596542815-22b845069566?auto=format&fit=crop&w=600', roi: 12.5, area: 350, district: 'Al Malqa'
  },
  {
    id: 'm2', x: 65, y: 55, title: 'KAFD Office Floor', price: 12500000, type: 'Commercial', status: 'New',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600', roi: 8.2, area: 1200, district: 'KAFD'
  },
  {
    id: 'm3', x: 28, y: 65, title: 'Malqa Land Plot', price: 4200000, type: 'Land', status: 'Opportunity',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600', roi: 15.0, area: 800, district: 'Hittin'
  },
  {
    id: 'm4', x: 75, y: 25, title: 'Narjis Apt Complex', price: 1850000, type: 'Residential', status: 'Regular',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600', roi: 6.5, area: 180, district: 'Al Narjis'
  },
  {
    id: 'm5', x: 52, y: 20, title: 'Logistics Hub', price: 8500000, type: 'Commercial', status: 'Opportunity',
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=600', roi: 9.8, area: 2500, district: 'Al Narjis'
  },
  {
    id: 'm6', x: 15, y: 45, title: 'Luxury Compound', price: 5200000, type: 'Residential', status: 'Regular',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600', roi: 7.1, area: 450, district: 'Hittin'
  },
];

// Mock Price History Data
const PRICE_HISTORY = [
    { month: 'Jan', value: 4500 },
    { month: 'Feb', value: 4600 },
    { month: 'Mar', value: 4550 },
    { month: 'Apr', value: 4800 },
    { month: 'May', value: 4950 },
    { month: 'Jun', value: 5100 },
];

// Map Features
const FEATURES = [
    { type: 'park', top: '15%', left: '10%', width: '15%', height: '15%', rotate: '0deg' },
    { type: 'water', top: '60%', left: '65%', width: '25%', height: '20%', rotate: '-5deg' },
    { type: 'block', top: '30%', left: '40%', width: '10%', height: '8%', rotate: '10deg' }, // KAFD Block
    { type: 'block', top: '45%', left: '35%', width: '8%', height: '12%', rotate: '0deg' },
    { type: 'park', top: '70%', left: '20%', width: '12%', height: '12%', rotate: '15deg' },
];

const getMarkerIcon = (type: string) => {
  switch (type) {
    case 'Residential': return <Home size={14} strokeWidth={2.5} />;
    case 'Commercial': return <Building2 size={14} strokeWidth={2.5} />;
    case 'Land': return <LandPlot size={14} strokeWidth={2.5} />;
    default: return <Home size={14} strokeWidth={2.5} />;
  }
};

export const InteractiveMap: React.FC = () => {
  const { t, dir } = useLanguage();
  
  // Map View State
  const [scale, setScale] = useState(1.4);
  const [position, setPosition] = useState({ x: -150, y: -100 });
  const [rotation, setRotation] = useState(0);
  const [mapMode, setMapMode] = useState<'standard' | 'satellite' | 'heatmap'>('standard');
  const [is3D, setIs3D] = useState(false);
  
  // Interaction State
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isLayersOpen, setIsLayersOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{x: number, y: number} | null>(null);
  
  // Data State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [filter, setFilter] = useState<'All' | 'Residential' | 'Commercial' | 'Land'>('All');
  const [drawerTab, setDrawerTab] = useState<'overview' | 'analytics' | 'calculator'>('overview');

  // Mortgage Calculator State
  const [downPayment, setDownPayment] = useState(20);
  const [loanTerm, setLoanTerm] = useState(20);
  const [interestRate, setInterestRate] = useState(4.5);

  const mapRef = useRef<HTMLDivElement>(null);

  // --- Map Logic ---

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
        const delta = e.deltaY * -0.001;
        setScale(prev => Math.min(Math.max(0.8, prev + delta), 5));
    }
  };

  const zoomIn = () => setScale(prev => Math.min(prev + 0.3, 5));
  const zoomOut = () => setScale(prev => Math.max(0.8, prev - 0.3));

  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      setIsSearching(true);
      setTimeout(() => {
          setIsSearching(false);
          setPosition({ x: 0, y: 0 });
          setScale(2.5);
          setMapMode('heatmap'); // Auto switch to heatmap on search for "insight" effect
      }, 1200);
  };

  const handleLocate = () => {
      setUserLocation({ x: 50, y: 50 });
      setPosition({ x: 0, y: 0 });
      setScale(2.2);
      // Remove location after animation
      setTimeout(() => setUserLocation(null), 5000);
  };

  // --- Helper Functions ---

  const formatPrice = (price: number) => {
    if (price >= 1000000) return (price / 1000000).toFixed(1) + 'M';
    if (price >= 1000) return (price / 1000).toFixed(0) + 'K';
    return price.toString();
  };

  const calculateMortgage = (price: number) => {
      const principal = price * (1 - downPayment / 100);
      const monthlyRate = interestRate / 100 / 12;
      const numberOfPayments = loanTerm * 12;
      const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      return Math.round(monthlyPayment).toLocaleString();
  };

  const filteredMarkers = INITIAL_MARKERS.filter(m => filter === 'All' || m.type === filter);

  return (
    <div className="relative w-full h-[calc(100vh-5rem)] overflow-hidden bg-[#e5e7eb] font-sans select-none group">
      
      {/* --- TOP BAR CONTROLS --- */}
      <div className="absolute top-6 left-6 right-6 z-30 flex flex-col md:flex-row justify-between gap-4 pointer-events-none">
        
        {/* Search & Filters (Left) */}
        <div className="flex flex-col gap-3 w-full max-w-md pointer-events-auto">
            <form onSubmit={handleSearch} className="relative group/search">
                <div className="absolute inset-0 bg-white/80 rounded-2xl blur-md group-focus-within/search:bg-brand-400/20 transition-all"></div>
                <div className="relative bg-white/90 backdrop-blur-md border border-white/20 rounded-2xl flex items-center shadow-xl">
                    <div className="pl-4 text-gray-400"><Search size={20} /></div>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('map.search.placeholder')}
                        className="flex-1 bg-transparent border-none outline-none h-12 px-3 text-sm font-medium text-gray-800 placeholder:text-gray-500"
                    />
                    {isSearching ? (
                        <div className="pr-4"><Loader2 className="animate-spin text-brand-600" size={20} /></div>
                    ) : (
                        <div className="pr-2 flex gap-1">
                            <button type="button" className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors">
                                <Zap size={18} />
                            </button>
                            <button type="submit" className="bg-gray-900 text-white p-2 rounded-xl hover:bg-gray-800 transition-all shadow-lg">
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </form>

            {/* Quick Filters */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {['All', 'Residential', 'Commercial', 'Land'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={clsx(
                            "px-4 py-2 rounded-full text-xs font-bold shadow-lg transition-all border backdrop-blur-md whitespace-nowrap",
                            filter === f 
                                ? "bg-gray-900 text-white border-gray-900 transform scale-105" 
                                : "bg-white/90 text-gray-600 border-white hover:bg-white"
                        )}
                    >
                        {t(`map.filter.${f === 'All' ? 'all' : f === 'Residential' ? 'res' : f === 'Commercial' ? 'com' : 'land'}`)}
                    </button>
                ))}
            </div>
        </div>

        {/* Tools (Right) */}
        <div className="flex flex-col gap-3 pointer-events-auto items-end">
            
            {/* Layer Switcher */}
            <div className="relative">
                <button 
                    onClick={() => setIsLayersOpen(!isLayersOpen)}
                    className="w-12 h-12 bg-white rounded-2xl shadow-xl border border-white/50 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-all"
                    title="Layers"
                >
                    <Layers size={22} />
                </button>
                
                {isLayersOpen && (
                    <div className="absolute top-14 right-0 bg-white p-2 rounded-2xl shadow-2xl border border-gray-100 w-48 animate-in slide-in-from-top-2 fade-in duration-200">
                        <div className="space-y-1">
                            <button 
                                onClick={() => { setMapMode('standard'); setIsLayersOpen(false); }}
                                className={clsx("w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors", mapMode === 'standard' ? "bg-brand-50 text-brand-700" : "hover:bg-gray-50")}
                            >
                                <Layout size={16} /> {t('map.mode.standard')}
                            </button>
                            <button 
                                onClick={() => { setMapMode('satellite'); setIsLayersOpen(false); }}
                                className={clsx("w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors", mapMode === 'satellite' ? "bg-brand-50 text-brand-700" : "hover:bg-gray-50")}
                            >
                                <Globe size={16} /> {t('map.mode.satellite')}
                            </button>
                            <button 
                                onClick={() => { setMapMode('heatmap'); setIsLayersOpen(false); }}
                                className={clsx("w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors", mapMode === 'heatmap' ? "bg-brand-50 text-brand-700" : "hover:bg-gray-50")}
                            >
                                <Flame size={16} /> {t('map.mode.heatmap')}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <button 
                onClick={() => setIs3D(!is3D)}
                className={clsx(
                    "w-12 h-12 rounded-2xl shadow-xl border border-white/50 flex items-center justify-center transition-all",
                    is3D ? "bg-brand-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                )}
                title="Toggle 3D View"
            >
                <Box size={20} />
            </button>

            <button 
                onClick={handleLocate}
                className="w-12 h-12 bg-white rounded-2xl shadow-xl border border-white/50 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-all" 
                title="Locate Me"
            >
                <LocateFixed size={20} />
            </button>
        </div>
      </div>

      {/* --- BOTTOM CONTROLS --- */}
      <div className="absolute bottom-8 right-6 z-30 flex flex-col gap-4 pointer-events-auto">
            <button 
                onClick={() => { setPosition({x:0, y:0}); setScale(1.4); setRotation(0); setIs3D(false); }}
                className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-brand-600 hover:bg-brand-50 transition-all"
            >
                <Compass size={24} style={{ transform: `rotate(${-rotation}deg)`, transition: 'transform 0.5s' }} />
            </button>

            <div className="bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden border border-gray-100">
                <button className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 border-b border-gray-100 active:bg-gray-100" onClick={zoomIn}>
                    <Plus size={24} />
                </button>
                <button className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:bg-gray-100" onClick={zoomOut}>
                    <Minus size={24} />
                </button>
            </div>
      </div>

      {/* --- MAP CANVAS --- */}
      <div 
        ref={mapRef}
        className={clsx(
            "w-full h-full cursor-grab active:cursor-grabbing relative transition-colors duration-700 overflow-hidden perspective-[1000px]",
            mapMode === 'satellite' ? "bg-[#0f172a]" : "bg-[#f1f5f9]"
        )}
        style={{ perspective: '1200px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div 
          className="w-full h-full origin-center will-change-transform transition-transform duration-300 ease-out"
          style={{ 
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg) ${is3D ? 'rotateX(60deg)' : 'rotateX(0deg)'}`,
              transformStyle: 'preserve-3d',
              transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
        >
             {/* === LAYERS === */}
             <div className="absolute -inset-[100%] w-[300%] h-[300%] pointer-events-none" style={{ backfaceVisibility: 'hidden' }}>
                
                {/* 1. BASE LAYER (Grid/Satellite) */}
                {mapMode === 'standard' || mapMode === 'heatmap' ? (
                    <>
                        {/* City Block Grid */}
                        <div className="w-full h-full opacity-100" style={{
                            backgroundColor: '#f1f5f9',
                            backgroundImage: `
                                linear-gradient(white 4px, transparent 4px),
                                linear-gradient(90deg, white 4px, transparent 4px)
                            `,
                            backgroundSize: '120px 120px'
                        }}></div>
                        {/* Small Streets */}
                        <div className="absolute inset-0 opacity-40" style={{
                            backgroundImage: `
                                linear-gradient(#cbd5e1 1px, transparent 1px),
                                linear-gradient(90deg, #cbd5e1 1px, transparent 1px)
                            `,
                            backgroundSize: '30px 30px'
                        }}></div>
                    </>
                ) : (
                    /* Satellite Layer */
                    <div className="w-full h-full bg-[#0f172a] relative">
                        {/* Texture Noise */}
                        <div className="absolute inset-0 opacity-30" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                        }}></div>
                        {/* Roads Overlay (Hybrid Mode) */}
                        <div className="absolute inset-0 opacity-20" style={{
                             backgroundImage: `
                                linear-gradient(rgba(255,255,255,0.5) 2px, transparent 2px),
                                linear-gradient(90deg, rgba(255,255,255,0.5) 2px, transparent 2px)
                            `,
                            backgroundSize: '120px 120px'
                        }}></div>
                    </div>
                )}

                {/* 2. HEATMAP LAYER */}
                {mapMode === 'heatmap' && (
                    <div className="absolute inset-0 opacity-60 mix-blend-multiply transition-opacity duration-1000">
                        <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-red-400 rounded-full blur-[150px]"></div>
                        <div className="absolute top-[40%] left-[50%] w-[30%] h-[30%] bg-green-400 rounded-full blur-[120px]"></div>
                        <div className="absolute top-[60%] left-[20%] w-[35%] h-[35%] bg-yellow-400 rounded-full blur-[130px]"></div>
                    </div>
                )}

                {/* 3. FEATURES LAYER (Parks, Water, Buildings) */}
                {mapMode !== 'satellite' && FEATURES.map((block, idx) => (
                    <div 
                        key={idx}
                        className={clsx(
                            "absolute rounded-3xl shadow-sm transition-transform duration-500",
                            block.type === 'park' ? "bg-[#dcfce7] border-2 border-[#bbf7d0]" : 
                            block.type === 'water' ? "bg-[#dbeafe] border-2 border-[#bfdbfe]" : 
                            "bg-[#e2e8f0] border-2 border-[#cbd5e1]"
                        )}
                        style={{
                            top: block.top,
                            left: block.left,
                            width: block.width,
                            height: block.height,
                            transform: `rotate(${block.rotate}) ${is3D ? 'translateZ(10px)' : 'translateZ(0)'}`,
                            boxShadow: is3D ? '5px 5px 15px rgba(0,0,0,0.2)' : 'none'
                        }}
                    >
                        {block.type === 'block' && <div className="absolute inset-0 bg-gray-300/20" style={{backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>}
                    </div>
                ))}

                {/* 4. NEIGHBORHOOD LABELS (Scale Logic) */}
                <div className="absolute inset-0 pointer-events-none" style={{ transform: is3D ? 'translateZ(30px)' : 'translateZ(0)' }}>
                    {NEIGHBORHOODS.map((n, i) => (
                        <div 
                            key={i}
                            className={clsx(
                                "absolute transform -translate-x-1/2 -translate-y-1/2 font-bold text-gray-400 uppercase tracking-[0.2em] transition-all duration-300 text-center leading-none group cursor-help pointer-events-auto",
                                mapMode === 'satellite' ? "text-white/50 mix-blend-overlay" : ""
                            )}
                            style={{ 
                                left: `${n.x}%`, 
                                top: `${n.y}%`,
                                fontSize: `${n.size === 'large' ? 3 : n.size === 'medium' ? 2 : 1.5}rem`,
                                opacity: scale < 2 ? 1 : 0.3 // Fade out when zoomed in close
                            }}
                        >
                            {n.name}
                            {/* Stats Popover on Hover */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-xl border border-white/50 text-gray-800 text-xs font-medium min-w-[140px] pointer-events-none z-50 transform scale-0 group-hover:scale-100 origin-bottom">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-gray-500">{t('partners.avgPrice')}</span>
                                    <span className="font-bold">{n.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">{t('map.growth')}</span>
                                    <span className="text-green-600 font-bold">+{n.growth}%</span>
                                </div>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-white rotate-45 border-r border-b border-white/50"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 5. USER LOCATION MARKER */}
                {userLocation && (
                    <div 
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                        style={{ left: `${userLocation.x}%`, top: `${userLocation.y}%`, transform: is3D ? 'translateZ(2px)' : 'translateZ(0)' }}
                    >
                        <div className="relative">
                            <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg animate-pulse relative z-10"></div>
                            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75 scale-150"></div>
                            {/* User Icon */}
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap shadow-md">
                                You are here
                            </div>
                        </div>
                    </div>
                )}

                {/* 6. MARKERS LAYER */}
                <div className="absolute inset-0 pointer-events-auto">
                    {filteredMarkers.map((marker) => (
                        <div
                            key={marker.id}
                            className={clsx(
                                "absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10 transition-all duration-500",
                            )}
                            style={{ 
                                left: `${marker.x}%`, 
                                top: `${marker.y}%`,
                                transform: is3D ? 'translateZ(50px) rotateX(-60deg)' : 'translateZ(0)', // Counter-rotate icons in 3D mode so they stand up
                                transformOrigin: 'bottom center'
                            }}
                            onClick={(e) => { e.stopPropagation(); setSelectedMarker(marker); }}
                        >
                            {/* Opportunity Ring - Enhanced (Red for Opportunity) */}
                            {marker.status === 'Opportunity' && (
                                <>
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-red-500/30 rounded-full animate-ping pointer-events-none"></div>
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-red-500/10 rounded-full animate-pulse pointer-events-none"></div>
                                </>
                            )}

                            {/* Marker Body */}
                            <div className={clsx(
                                "relative flex flex-col items-center transition-all duration-300 hover:z-50 hover:scale-110",
                                selectedMarker?.id === marker.id ? "z-40 scale-110" : "z-10"
                            )}>
                                {/* The Tag - Enhanced with Icon */}
                                <div className={clsx(
                                    "flex items-center gap-2 px-3 py-2 rounded-xl shadow-[0_8px_16px_rgb(0,0,0,0.2)] font-bold text-xs border backdrop-blur-md min-w-[max-content] justify-center transition-colors",
                                    selectedMarker?.id === marker.id 
                                        ? "bg-gray-900 text-white border-gray-900" 
                                        : marker.status === 'Opportunity' 
                                            ? "bg-red-600 text-white border-red-600" 
                                            : "bg-white/95 text-gray-800 border-white hover:bg-gray-50"
                                )}>
                                    {/* Property Type Icon */}
                                    <span className={clsx(
                                        "p-1 rounded-md",
                                        selectedMarker?.id === marker.id ? "bg-white/20" : marker.status === 'Opportunity' ? "bg-red-500" : "bg-black/5"
                                    )}>
                                        {getMarkerIcon(marker.type)}
                                    </span>
                                    
                                    <span className="tracking-tight text-sm">{formatPrice(marker.price)}</span>

                                    {marker.status === 'Opportunity' && <Flame size={12} className="fill-white animate-pulse" />}
                                </div>
                                
                                {/* The Stem */}
                                <div className={clsx(
                                    "w-0.5 h-3",
                                    selectedMarker?.id === marker.id ? "bg-gray-900" : marker.status === 'Opportunity' ? "bg-red-600" : "bg-white shadow-sm"
                                )}></div>
                                
                                {/* The Dot */}
                                <div className={clsx(
                                    "w-3 h-3 rounded-full border-2 shadow-sm bg-white",
                                    selectedMarker?.id === marker.id ? "border-gray-900 scale-125" : marker.status === 'Opportunity' ? "border-red-600" : "border-gray-400"
                                )}></div>
                            </div>
                        </div>
                    ))}
                </div>

             </div>
        </div>
      </div>

      {/* --- DETAILS DRAWER --- */}
      <div className={clsx(
          "absolute top-6 bottom-6 left-6 w-[420px] bg-white rounded-[2rem] shadow-2xl shadow-black/20 transform transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) z-40 flex flex-col overflow-hidden border border-gray-100",
          dir === 'rtl' 
            ? (selectedMarker ? "translate-x-0" : "-translate-x-[120%]") 
            : (selectedMarker ? "translate-x-0" : "-translate-x-[120%]")
      )}>
          {selectedMarker && (
              <>
                  {/* Image Header */}
                  <div className="h-60 relative shrink-0 group cursor-pointer" onClick={() => {/* Open full gallery */}}>
                      <img src={selectedMarker.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent"></div>
                      
                      {/* Close & Actions */}
                      <div className="absolute top-4 right-4 z-20 flex gap-2">
                          <button className="p-2.5 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-md transition-colors border border-white/10">
                              <Share2 size={18} />
                          </button>
                          <button 
                            onClick={() => setSelectedMarker(null)}
                            className="p-2.5 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors border border-white/10"
                          >
                              <X size={18} />
                          </button>
                      </div>

                      {/* Title Block */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                           <div className="flex gap-2 mb-2">
                                <span className={clsx(
                                    "px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border",
                                    selectedMarker.status === 'Opportunity' ? "bg-brand-500 border-brand-500 text-white" : "bg-white/20 border-white/20 backdrop-blur-md"
                                )}>
                                    {selectedMarker.status === 'Opportunity' ? t('map.hot') : selectedMarker.type}
                                </span>
                                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-black/30 backdrop-blur-md border border-white/10 flex items-center gap-1">
                                    <MapPin size={10} /> {selectedMarker.district}
                                </span>
                           </div>
                           <h2 className="text-2xl font-bold leading-tight mb-1 shadow-sm">{selectedMarker.title}</h2>
                           <p className="text-brand-200 font-mono text-lg font-medium">
                               {selectedMarker.price.toLocaleString()} {t('common.sar')}
                           </p>
                      </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-gray-100 px-6 pt-2">
                      <button 
                        onClick={() => setDrawerTab('overview')}
                        className={clsx("pb-3 px-2 text-sm font-bold border-b-2 transition-colors flex-1", drawerTab === 'overview' ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600")}
                      >
                          Overview
                      </button>
                      <button 
                        onClick={() => setDrawerTab('analytics')}
                        className={clsx("pb-3 px-2 text-sm font-bold border-b-2 transition-colors flex-1", drawerTab === 'analytics' ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600")}
                      >
                          Analysis
                      </button>
                      <button 
                        onClick={() => setDrawerTab('calculator')}
                        className={clsx("pb-3 px-2 text-sm font-bold border-b-2 transition-colors flex-1", drawerTab === 'calculator' ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600")}
                      >
                          Finance
                      </button>
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                      
                      {/* TAB: OVERVIEW */}
                      {drawerTab === 'overview' && (
                          <div className="space-y-6 animate-fade-in">
                              <div className="grid grid-cols-3 gap-3">
                                  <div className="bg-white p-3 rounded-2xl border border-gray-100 text-center shadow-sm">
                                      <LandPlot size={20} className="mx-auto mb-1 text-brand-600" />
                                      <p className="text-sm font-bold text-gray-900">{selectedMarker.area}</p>
                                      <p className="text-[10px] text-gray-400 uppercase font-bold">{t('val.area')}</p>
                                  </div>
                                  <div className="bg-white p-3 rounded-2xl border border-gray-100 text-center shadow-sm">
                                      <TrendingUp size={20} className="mx-auto mb-1 text-green-600" />
                                      <p className="text-sm font-bold text-gray-900">{selectedMarker.roi}%</p>
                                      <p className="text-[10px] text-gray-400 uppercase font-bold">{t('map.details.roi')}</p>
                                  </div>
                                  <div className="bg-white p-3 rounded-2xl border border-gray-100 text-center shadow-sm">
                                      <Building2 size={20} className="mx-auto mb-1 text-blue-600" />
                                      <p className="text-sm font-bold text-gray-900">Ready</p>
                                      <p className="text-[10px] text-gray-400 uppercase font-bold">{t('dev.table.status')}</p>
                                  </div>
                              </div>

                              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                  <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                                      <Sparkles size={14} className="text-brand-500 fill-brand-500" /> {t('map.insight')}
                                  </h3>
                                  <p className="text-sm text-gray-600 leading-relaxed">
                                      This property is priced <strong>8% below the district average</strong> of {selectedMarker.district}.
                                      High potential for capital appreciation due to the upcoming Metro station nearby (800m).
                                  </p>
                              </div>

                              <div>
                                  <h3 className="font-bold text-gray-900 mb-3 text-sm">{t('val.rating.serv')}</h3>
                                  <div className="flex flex-wrap gap-2">
                                      {['Parking', 'Security', 'Gym', 'Pool', 'Smart Home'].map(a => (
                                          <span key={a} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600">
                                              {a}
                                          </span>
                                      ))}
                                  </div>
                              </div>
                          </div>
                      )}

                      {/* TAB: ANALYTICS */}
                      {drawerTab === 'analytics' && (
                           <div className="space-y-6 animate-fade-in">
                               <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                   <h3 className="font-bold text-gray-900 mb-4 text-sm">{t('map.history')}</h3>
                                   <div className="h-40 w-full">
                                       <ResponsiveContainer width="100%" height="100%">
                                           <AreaChart data={PRICE_HISTORY}>
                                                <defs>
                                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <RechartsTooltip 
                                                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                                                    itemStyle={{fontSize: '12px', fontWeight: 'bold'}}
                                                />
                                                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fill="url(#colorPrice)" />
                                           </AreaChart>
                                       </ResponsiveContainer>
                                   </div>
                               </div>
                               
                               <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                                        <p className="text-xs text-green-800 font-bold uppercase mb-1">{t('map.growth')}</p>
                                        <p className="text-2xl font-bold text-green-700">+12.4%</p>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                                        <p className="text-xs text-blue-800 font-bold uppercase mb-1">{t('map.yield')}</p>
                                        <p className="text-2xl font-bold text-blue-700">6.8%</p>
                                    </div>
                               </div>
                           </div>
                      )}

                      {/* TAB: CALCULATOR */}
                      {drawerTab === 'calculator' && (
                          <div className="space-y-6 animate-fade-in">
                              <div className="bg-gray-900 p-6 rounded-2xl text-white shadow-lg">
                                  <p className="text-gray-400 text-xs font-bold uppercase mb-1">{t('map.mortgage')}</p>
                                  <p className="text-3xl font-bold">{calculateMortgage(selectedMarker.price)} <span className="text-base font-normal text-gray-400">{t('common.sar')}</span></p>
                              </div>

                              <div className="space-y-4">
                                  <div>
                                      <div className="flex justify-between text-sm font-medium mb-2">
                                          <span className="text-gray-700">{t('map.downPayment')}</span>
                                          <span className="text-brand-600">{downPayment}%</span>
                                      </div>
                                      <input 
                                        type="range" min="0" max="80" step="5" 
                                        value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                                      />
                                  </div>
                                  <div>
                                      <div className="flex justify-between text-sm font-medium mb-2">
                                          <span className="text-gray-700">Loan Term</span>
                                          <span className="text-brand-600">{loanTerm} Years</span>
                                      </div>
                                      <input 
                                        type="range" min="5" max="30" step="1" 
                                        value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                                      />
                                  </div>
                                  <div>
                                      <div className="flex justify-between text-sm font-medium mb-2">
                                          <span className="text-gray-700">Interest Rate</span>
                                          <span className="text-brand-600">{interestRate}%</span>
                                      </div>
                                      <input 
                                        type="range" min="1" max="10" step="0.1" 
                                        value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                                      />
                                  </div>
                              </div>
                          </div>
                      )}

                  </div>

                  {/* Footer Action */}
                  <div className="p-6 pt-0 bg-gray-50/50">
                      <button className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-200 group">
                          {t('map.offer')} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                  </div>
              </>
          )}
      </div>

    </div>
  );
};
