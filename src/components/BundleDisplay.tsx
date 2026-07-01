import React from 'react';
import { motion } from 'motion/react';
import { Plane, Hotel, Map, Car, Sparkles, Star, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface Bundle {
  name: string;
  price: number;
  rating: number;
  details: {
    flight: string;
    hotel: string;
    experience: string;
    car: string;
  };
  description: string;
}

export default function BundleDisplay({ bundles, loading }: { bundles: Bundle[], loading: boolean }) {
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-24 space-y-8">
        <div className="h-10 w-64 bg-white/5 rounded-full animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[500px] bg-white/5 rounded-[3rem] animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (bundles.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-8 py-24">
      <div className="flex flex-col items-center mb-16 text-center">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-6 font-bold text-[9px] uppercase tracking-[0.3em] text-brand-gold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quantum Bundles Exclusive</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-display font-light text-[#E8EDF5] tracking-tighter mb-4">The <span className="text-[#7A8BA8] italic">All-In-One</span> Collections.</h2>
        <p className="text-sm text-[#7A8BA8] max-w-xl mx-auto">Meticulously bundled travel portfolios that coordinate every dimension of your journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {bundles.map((bundle, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="group relative flex flex-col h-full bg-bg-card border border-white/5 rounded-[3rem] p-8 hover:border-brand-teal/30 transition-all shadow-2xl overflow-hidden"
          >
            {/* Best Value Badge */}
            {i === 0 && (
              <div className="absolute top-6 right-6">
                <span className="bg-brand-gold text-neutral-950 text-[9px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">Master Selection</span>
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-2xl font-display font-light text-white mb-2 group-hover:text-brand-teal transition-colors uppercase tracking-tight">{bundle.name}</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-4">{bundle.description}</p>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-brand-gold fill-brand-gold" />
                <span className="text-[10px] font-bold text-white">{bundle.rating} / 5.0</span>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-[#7A8BA8] group-hover:text-brand-teal transition-colors">
                  <Plane className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-widest font-bold text-slate-600">Flight</p>
                  <p className="text-xs text-slate-300 font-medium">{bundle.details.flight}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-[#7A8BA8] group-hover:text-brand-teal transition-colors">
                  <Hotel className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-widest font-bold text-slate-600">Abode</p>
                  <p className="text-xs text-slate-300 font-medium">{bundle.details.hotel}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-[#7A8BA8] group-hover:text-brand-teal transition-colors">
                  <Map className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-widest font-bold text-slate-600">Discovery</p>
                  <p className="text-xs text-slate-300 font-medium">{bundle.details.experience}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-[#7A8BA8] group-hover:text-brand-teal transition-colors">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-widest font-bold text-slate-600">Mobility</p>
                  <p className="text-xs text-slate-300 font-medium">{bundle.details.car}</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col gap-4">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A8BA8]">Unified Rate</span>
                <span className="text-3xl font-display font-light text-brand-gold leading-none">${bundle.price.toLocaleString()}</span>
              </div>
              <button className="w-full bg-brand-teal text-neutral-950 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-teal-300 hover:text-neutral-950 transition-all font-heading tracking-[0.2em] group-hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-brand-teal/5">
                Deploy Bundle
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
