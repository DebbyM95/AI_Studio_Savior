import React from 'react';
import { motion } from 'motion/react';
import { Star, ShieldCheck, MapPin, Clock, Tag } from 'lucide-react';
import { cn } from '../lib/utils';

interface Deal {
  provider: string;
  price: number;
  details: string;
  rating: number;
  type?: string;
}

export default function ResultsList({ deals, loading }: { deals: Deal[], loading: boolean }) {
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 bg-zinc-900 rounded-3xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (deals.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className="text-4xl font-display font-light text-[#E8EDF5] tracking-tight">Curated <span className="bg-gradient-to-r from-brand-teal via-brand-teal to-brand-gold bg-clip-text text-transparent italic font-normal">Intelligence.</span></h2>
          <p className="text-sm text-[#7A8BA8] mt-2">Discovering the most efficient routes and stays for your journey.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-widest font-bold text-white hover:bg-brand-teal/10 hover:border-brand-teal/30 hover:text-brand-teal transition-all">Sort: Price</button>
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-widest font-bold text-white hover:bg-brand-teal/10 hover:border-brand-teal/30 hover:text-brand-teal transition-all">Flexible Dates</button>
        </div>
      </div>

      <div className="grid gap-4">
        {deals.map((deal, i) => {
          const isFlight = deal.type === 'flight';
          const isHotel = deal.type === 'hotel';
          
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className={cn(
                "group relative p-6 bg-bg-card border border-white/5 rounded-[2rem] flex flex-col md:flex-row items-center justify-between transition-all duration-300 cursor-pointer shadow-xl",
                isFlight ? "hover:border-brand-teal/40 hover:shadow-[0_0_30px_rgba(20,232,200,0.08)]" :
                isHotel ? "hover:border-brand-teal/40 hover:shadow-[0_0_30px_rgba(20,232,200,0.08)]" :
                "hover:border-brand-gold/40 hover:shadow-[0_0_30px_rgba(251,191,36,0.08)]"
              )}
            >
              <div className="flex items-center space-x-6 w-full md:w-auto">
                <div className={cn(
                  "w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-2xl border border-white/5 transition-colors duration-300",
                  isFlight ? "group-hover:bg-brand-teal/10 group-hover:text-brand-teal group-hover:border-brand-teal/20" :
                  isHotel ? "group-hover:bg-brand-teal/10 group-hover:text-brand-teal group-hover:border-brand-teal/20" :
                  "group-hover:bg-brand-gold/10 group-hover:text-brand-gold group-hover:border-brand-gold/20"
                )}>
                  {isFlight ? '✈️' : isHotel ? '🏨' : '🌟'}
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white flex items-center gap-2">
                    {deal.provider}
                    <span className={cn(
                      "text-[8px] uppercase tracking-[0.2em] font-bold px-3 py-1 rounded-full border backdrop-blur-md transition-colors duration-300",
                      isFlight ? "bg-brand-teal/5 text-brand-teal border-brand-teal/15" :
                      isHotel ? "bg-brand-teal/5 text-brand-teal border-brand-teal/15" :
                      "bg-brand-gold/5 text-brand-gold border-brand-gold/15"
                    )}>
                      Verified
                    </span>
                  </h3>
                  <p className="text-xs text-[#7A8BA8] mt-1.5 flex items-center gap-3">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> Direct</span>
                    <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
                    <span>{deal.details}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-12 w-full md:w-auto mt-6 md:mt-0 justify-between md:justify-end">
                <div className="text-right">
                  <p className="text-3xl font-display font-light text-white leading-none">${deal.price}</p>
                  <p className={cn(
                     "text-[10px] uppercase font-bold tracking-widest mt-2",
                     deal.price < 1500 ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.15)]" : "text-[#7A8BA8]"
                  )}>
                    {deal.price < 1500 ? "Low Market Rate" : "Standard Efficiency"}
                  </p>
                </div>
                <button className={cn(
                  "text-neutral-950 text-[10px] font-bold uppercase tracking-widest px-8 py-3.5 rounded-full transition-all duration-300 group-hover:scale-105",
                  isFlight ? "bg-brand-teal hover:bg-teal-300 shadow-md hover:shadow-brand-teal/20" :
                  isHotel ? "bg-brand-teal hover:bg-teal-300 shadow-md hover:shadow-brand-teal/20" :
                  "bg-brand-gold hover:bg-amber-300 shadow-md hover:shadow-brand-gold/20"
                )}>
                  Select Option
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
