import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Calendar, Users, ArrowRight, Hotel as HotelIcon, Compass, Boxes, X } from 'lucide-react';
import { cn } from '../lib/utils';

const CITIES = [
  'San Francisco (SFO)',
  'New York (JFK)',
  'London (LHR)',
  'Tokyo (NRT)',
  'Tokyo (HND)',
  'Paris (CDG)',
  'Paris (ORY)',
  'Dubai (DXB)',
  'Singapore (SIN)',
  'Sydney (SYD)',
  'Rome (FCO)',
  'Berlin (BER)',
  'Mumbai (BOM)',
  'Hong Kong (HKG)',
  'Los Angeles (LAX)',
  'Chicago (ORD)',
  'Toronto (YYZ)',
  'Vancouver (YVR)',
  'Melbourne (MEL)',
  'Madrid (MAD)',
  'Barcelona (BCN)',
  'Amsterdam (AMS)',
  'Frankfurt (FRA)',
  'Munich (MUC)',
  'Istanbul (IST)',
  'Seoul (ICN)',
  'Beijing (PEK)',
  'Shanghai (PVG)',
  'Bangkok (BKK)',
  'Delhi (DEL)',
  'Istanbul (IST)',
  'Cape Town (CPT)',
  'Cairo (CAI)',
  'Maldives (MLE)',
  'Kyoto, Japan',
  'Amalfi Coast, Italy',
  'Santorini, Greece',
  'Bali, Indonesia',
  'Reykjavik, Iceland'
];

export default function SearchSection({ onSearch }: { onSearch: (params: any) => void }) {
  const [activeTab, setActiveTab] = React.useState('flights');
  const [origin, setOrigin] = React.useState('');
  const [destination, setDestination] = React.useState('');
  const [date, setDate] = React.useState('');
  
  const [originSuggestions, setOriginSuggestions] = React.useState<string[]>([]);
  const [destSuggestions, setDestSuggestions] = React.useState<string[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = React.useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = React.useState(false);
  const [isSearchingOrigin, setIsSearchingOrigin] = React.useState(false);
  const [isSearchingDest, setIsSearchingDest] = React.useState(false);

  // Local cache to avoid repeated AI calls
  const searchCache = React.useRef<Record<string, string[]>>({});

  // Search cities logic
  const searchCities = async (query: string, setResults: (vals: string[]) => void, setLoading: (l: boolean) => void) => {
    const trimmedQuery = query.trim().toLowerCase();
    if (trimmedQuery.length < 2) {
      setResults([]);
      return;
    }

    // Check local common list first for instant results
    const localMatches = CITIES.filter(city => 
      city.toLowerCase().includes(trimmedQuery)
    ).slice(0, 5);

    if (localMatches.length > 0) {
      setResults(localMatches);
      // We still might want to search AI for better results, but let's show these first
    }

    // Check cache
    if (searchCache.current[trimmedQuery]) {
      setResults(searchCache.current[trimmedQuery]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/travel/cities/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmedQuery })
      });
      const data = await res.json();
      searchCache.current[trimmedQuery] = data;
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Faster debounce (300ms instead of 500ms)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (showOriginSuggestions && origin.length >= 2) {
        searchCities(origin, setOriginSuggestions, setIsSearchingOrigin);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [origin, showOriginSuggestions]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (showDestSuggestions && destination.length >= 2) {
        searchCities(destination, setDestSuggestions, setIsSearchingDest);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [destination, showDestSuggestions]);

  
  const TAB_COLORS: Record<string, {
    text: string;
    subBar: string;
    focusBorder: string;
    buttonBg: string;
    buttonHover: string;
    buttonShadow: string;
    iconColor: string;
  }> = {
    flights: {
      text: 'text-brand-teal',
      subBar: 'bg-brand-teal shadow-[0_0_15px_rgba(20,232,200,0.65)]',
      focusBorder: 'focus-within:border-brand-teal/40 focus-within:shadow-[0_0_12px_rgba(20,232,200,0.1)]',
      buttonBg: 'bg-brand-teal text-neutral-950',
      buttonHover: 'hover:bg-teal-300 hover:shadow-[0_0_20px_rgba(20,232,200,0.25)] text-neutral-950',
      buttonShadow: 'shadow-lg shadow-brand-teal/10',
      iconColor: 'text-brand-teal',
    },
    hotels: {
      text: 'text-teal-400',
      subBar: 'bg-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.65)]',
      focusBorder: 'focus-within:border-teal-500/40 focus-within:shadow-[0_0_12px_rgba(20,184,166,0.1)]',
      buttonBg: 'bg-teal-600 text-white',
      buttonHover: 'hover:bg-teal-500 hover:shadow-[0_0_20px_rgba(20,184,166,0.25)]',
      buttonShadow: 'shadow-lg shadow-teal-600/10',
      iconColor: 'text-teal-400',
    },
    experiences: {
      text: 'text-brand-gold',
      subBar: 'bg-brand-gold shadow-[0_0_15px_rgba(251,191,36,0.65)]',
      focusBorder: 'focus-within:border-brand-gold/40 focus-within:shadow-[0_0_12px_rgba(251,191,36,0.1)]',
      buttonBg: 'bg-brand-gold text-neutral-950',
      buttonHover: 'hover:bg-amber-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.25)] text-neutral-950',
      buttonShadow: 'shadow-lg shadow-brand-gold/10',
      iconColor: 'text-brand-gold',
    },
    cars: {
      text: 'text-cyan-400',
      subBar: 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.65)]',
      focusBorder: 'focus-within:border-cyan-500/40 focus-within:shadow-[0_0_12px_rgba(6,182,212,0.1)]',
      buttonBg: 'bg-cyan-600 text-white',
      buttonHover: 'hover:bg-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]',
      buttonShadow: 'shadow-lg shadow-cyan-600/10',
      iconColor: 'text-cyan-400',
    },
    bundles: {
      text: 'text-brand-gold',
      subBar: 'bg-brand-gold shadow-[0_0_15px_rgba(251,191,36,0.65)]',
      focusBorder: 'focus-within:border-brand-gold/40 focus-within:shadow-[0_0_12px_rgba(251,191,36,0.1)]',
      buttonBg: 'bg-brand-gold text-neutral-950',
      buttonHover: 'hover:bg-amber-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.25)] text-neutral-950',
      buttonShadow: 'shadow-lg shadow-brand-gold/10',
      iconColor: 'text-brand-gold',
    },
  };

  const currentTheme = TAB_COLORS[activeTab] || TAB_COLORS.flights;
  
  const tabs = [
    { id: 'flights', label: 'Flights', icon: Search },
    { id: 'hotels', label: 'Hotels', icon: HotelIcon },
    { id: 'experiences', label: 'Experiences', icon: Compass },
    { id: 'cars', label: 'Cars', icon: Calendar },
    { id: 'bundles', label: 'Bundles', icon: Boxes },
  ];

  const handleAction = () => {
    if (!destination) return;
    onSearch({ 
      type: activeTab,
      origin,
      destination,
      date
    });
  };

  return (
    <div className="relative z-10 -mt-24 max-w-5xl mx-auto px-4">
      <div className="bg-bg-card/90 border border-white/10 rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] p-8 backdrop-blur-xl transition-all duration-500">
        <div className="flex gap-8 mb-10 border-b border-white/5 pb-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isTabActive = activeTab === tab.id;
            const tabTheme = TAB_COLORS[tab.id];
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-2 py-3 text-[10px] uppercase tracking-[0.2em] font-bold whitespace-nowrap transition-all duration-300 relative",
                  isTabActive ? tabTheme.text : 'text-slate-500 hover:text-slate-300'
                )}
              >
                {isTabActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className={cn("absolute bottom-0 left-0 right-0 h-0.5 rounded-full", tabTheme.subBar)}
                  />
                )}
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Origin */}
          <div className="space-y-2 relative">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">Origin</label>
            <div className={cn("flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl px-5 py-3.5 transition-all duration-300", currentTheme.focusBorder)}>
              <MapPin className={cn("w-4 h-4 transition-colors duration-300", currentTheme.iconColor)} />
              <input 
                type="text" 
                value={origin}
                onChange={(e) => {
                  setOrigin(e.target.value);
                  setShowOriginSuggestions(true);
                }}
                onFocus={() => setShowOriginSuggestions(true)}
                placeholder="SFO (San Francisco)" 
                className="bg-transparent border-none outline-none text-xs text-white w-full placeholder:text-slate-700 font-normal" 
              />
            </div>
            
            <AnimatePresence>
              {showOriginSuggestions && (originSuggestions.length > 0 || isSearchingOrigin) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute z-50 top-full left-0 right-0 mt-2 bg-bg-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-h-60 overflow-y-auto no-scrollbar"
                >
                  {isSearchingOrigin ? (
                    <div className="px-5 py-3 text-[10px] text-slate-500 uppercase tracking-widest animate-pulse">Searching...</div>
                  ) : (
                    originSuggestions.map((city, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setOrigin(city);
                          setShowOriginSuggestions(false);
                        }}
                        className="w-full text-left px-5 py-3 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        {city}
                      </button>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Destination */}
          <div className="space-y-2 relative">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">Destination</label>
            <div className={cn("flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl px-5 py-3.5 transition-all duration-300", currentTheme.focusBorder)}>
              <MapPin className={cn("w-4 h-4 transition-colors duration-300", currentTheme.iconColor)} />
              <input 
                type="text" 
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  setShowDestSuggestions(true);
                }}
                onFocus={() => setShowDestSuggestions(true)}
                placeholder="NRT (Tokyo)" 
                className="bg-transparent border-none outline-none text-xs text-white w-full placeholder:text-slate-700 font-normal" 
              />
            </div>

            <AnimatePresence>
              {showDestSuggestions && (destSuggestions.length > 0 || isSearchingDest) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute z-50 top-full left-0 right-0 mt-2 bg-bg-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-h-60 overflow-y-auto no-scrollbar"
                >
                  {isSearchingDest ? (
                    <div className="px-5 py-3 text-[10px] text-slate-500 uppercase tracking-widest animate-pulse">Searching...</div>
                  ) : (
                    destSuggestions.map((city, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setDestination(city);
                          setShowDestSuggestions(false);
                        }}
                        className="w-full text-left px-5 py-3 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        {city}
                      </button>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Departure */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">Departure</label>
            <div className={cn("flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl px-5 py-3.5 transition-all duration-300", currentTheme.focusBorder)}>
              <Calendar className={cn("w-4 h-4 transition-colors duration-300", currentTheme.iconColor)} />
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-white w-full [color-scheme:dark]" 
              />
            </div>
          </div>

          <div className="flex items-end">
            <button 
              onClick={handleAction}
              className={cn(
                "w-full text-white rounded-2xl py-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 flex items-center justify-center gap-3 group",
                currentTheme.buttonBg,
                currentTheme.buttonHover,
                currentTheme.buttonShadow
              )}
            >
              Analyze Deals
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Click away layer */}
      {(showOriginSuggestions || showDestSuggestions) && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => {
            setShowOriginSuggestions(false);
            setShowDestSuggestions(false);
          }}
        />
      )}
    </div>
  );
}
