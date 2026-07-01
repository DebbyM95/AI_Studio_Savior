/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import SearchSection from './components/SearchSection';
import ResultsList from './components/ResultsList';
import AgentChat from './components/AgentChat';
import ItineraryDisplay from './components/ItineraryDisplay';
import BundleDisplay from './components/BundleDisplay';
import TrendingSection from './components/TrendingSection';
import PriceTracker from './components/PriceTracker';
import FAQSection from './components/FAQSection';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Sparkles, Boxes } from 'lucide-react';

export default function App() {
  const [deals, setDeals] = React.useState<any[]>([]);
  const [bundles, setBundles] = React.useState<any[]>([]);
  const [itinerary, setItinerary] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [view, setView] = React.useState<'trending' | 'search' | 'itinerary' | 'bundles'>('trending');

  // Coordinated hash change listener to support sub-category scrolling in header
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#flight-price-tracker' || hash === '#faq-section') {
        setView('trending');
        setTimeout(() => {
          const el = document.getElementById(hash.substring(1));
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    if (window.location.hash) {
      handleHashChange();
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSearch = async (params: any) => {
    if (params.type === 'bundles') {
      setLoading(true);
      setView('bundles');
      try {
        const res = await fetch('/api/travel/bundles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params)
        });
        const data = await res.json();
        setBundles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    setView('search');
    try {
      const res = await fetch('/api/travel/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      const data = await res.json();
      setDeals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchBundles = async () => {
    setLoading(true);
    setView('bundles');
    try {
      const res = await fetch('/api/travel/bundles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: 'Tokyo & Kyoto',
          origin: 'Global Hubs'
        })
      });
      const data = await res.json();
      setBundles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateItinerary = async () => {
    setLoading(true);
    setView('itinerary');
    try {
      const res = await fetch('/api/itinerary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: 'Kyoto, Japan',
          duration: 5,
          budget: 'luxury',
          preferences: 'Traditional culture and fine dining'
        })
      });
      const data = await res.json();
      setItinerary(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-deep text-[#E8EDF5] selection:bg-brand-indigo/30 relative overflow-x-hidden">
      {/* Immersive Atmospheric Travel Glow Fields */}
      <div className="pointer-events-none select-none absolute top-[-10vh] left-[-30vw] w-[80vw] h-[80vw] bg-gradient-to-tr from-brand-teal/20 via-blue-950/15 to-transparent rounded-full blur-[180px] opacity-80" />
      <div className="pointer-events-none select-none absolute top-[35vh] right-[-30vw] w-[70vw] h-[70vw] bg-gradient-to-tr from-brand-gold/10 via-blue-950/10 to-transparent rounded-full blur-[160px] opacity-70" />
      <div className="pointer-events-none select-none absolute top-[90vh] left-[-10vw] w-[60vw] h-[60vw] bg-gradient-to-tr from-brand-teal/15 via-blue-950/10 to-brand-gold/5 rounded-full blur-[180px] opacity-75" />
      <div className="pointer-events-none select-none absolute top-[180vh] right-[-10vw] w-[75vw] h-[75vw] bg-gradient-to-tr from-brand-teal/15 to-brand-gold/5 rounded-full blur-[170px] opacity-70" />
      <div className="pointer-events-none select-none absolute bottom-[-10vh] left-[-20vw] w-[65vw] h-[65vw] bg-gradient-to-tr from-brand-gold/10 to-[#14E8C8]/15 rounded-full blur-[150px] opacity-70" />

      <Navigation />
      
      <main>
        <Hero />
        <SearchSection onSearch={handleSearch} />
        
        <div className="flex flex-wrap justify-center gap-4 mt-12 px-4">
          <button 
            onClick={handleGenerateItinerary}
            className="group flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-4 rounded-full hover:bg-brand-teal/10 hover:border-brand-teal/50 transition-all text-[10px] uppercase tracking-[0.2em] font-bold text-white shadow-xl shadow-brand-teal/5"
          >
            <Sparkles className="w-4 h-4 text-brand-teal group-hover:rotate-12 transition-transform" />
            <span>Generate Itinerary</span>
          </button>

          <button 
            onClick={handleFetchBundles}
            className="group flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-4 rounded-full hover:bg-brand-teal/10 hover:border-brand-teal/50 transition-all text-[10px] uppercase tracking-[0.2em] font-bold text-white shadow-xl shadow-brand-teal/5"
          >
            <Boxes className="w-4 h-4 text-brand-teal group-hover:scale-110 transition-transform" />
            <span>View All-In-One Deals</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {view === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
            >
              <ResultsList deals={deals} loading={loading} />
            </motion.div>
          )}

          {view === 'bundles' && (
            <motion.div
              key="bundles"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
            >
              <BundleDisplay bundles={bundles} loading={loading} />
            </motion.div>
          )}

          {view === 'itinerary' && (
            <motion.div
              key="itinerary"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
            >
              {loading && !itinerary ? (
                <div className="flex flex-col items-center justify-center py-48 gap-6 text-center">
                  <div className="relative">
                    <div className="w-16 h-16 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-indigo-600/20 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-light text-white tracking-tight">Coordinating Global Routes</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Savior is analyzing 422 deal variations</p>
                  </div>
                </div>
              ) : (
                <ItineraryDisplay itinerary={itinerary} />
              )}
            </motion.div>
          )}

          {view === 'trending' && (
            <motion.div 
               key="trending"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
            >
              <TrendingSection />
              <PriceTracker />
              <FAQSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-24 bg-bg-card mt-32 relative z-10">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div className="flex flex-col gap-4">
            <span className="text-2xl font-light tracking-[0.3em] text-white uppercase select-none">
              SAVIOR
              <span className="bg-gradient-to-r from-teal-400 via-amber-400 to-rose-400 bg-clip-text text-transparent font-extrabold">
                .
              </span>
            </span>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold max-w-xs">The standard in autonomous travel coordination.</p>
          </div>
          <div className="flex gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Safety</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Compliance</a>
            <a href="#" className="hover:text-white transition-colors">Concierge</a>
          </div>
          <div className="text-[10px] text-slate-600 font-medium uppercase tracking-widest">
            © 2026 Savior.
          </div>
        </div>
      </footer>

      <AgentChat />
    </div>
  );
}
