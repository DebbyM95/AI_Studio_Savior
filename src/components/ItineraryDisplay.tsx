import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Clock, Calendar, ChevronRight, DollarSign } from 'lucide-react';

interface Activity {
  time: string;
  description: string;
  location: string;
}

interface Day {
  day: number;
  activities: Activity[];
}

interface Itinerary {
  destination: string;
  days: Day[];
  estimatedTotalCost: number;
}

export default function ItineraryDisplay({ itinerary }: { itinerary: Itinerary | null }) {
  if (!itinerary) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-32">
      <div className="bg-bg-card border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-12 border-b border-white/5 bg-gradient-to-br from-brand-teal/10 via-bg-deep to-transparent">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-teal mb-4">Orchestrated Itinerary</p>
              <h2 className="text-5xl md:text-7xl font-display font-light text-[#E8EDF5] tracking-tighter leading-none">{itinerary.destination}</h2>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A8BA8] mb-2">Total Value Estimate</span>
              <div className="text-3xl font-display font-light text-brand-gold">
                ${itinerary.estimatedTotalCost.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="p-12 space-y-16">
          {itinerary.days.map((day, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative pl-16"
            >
              <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-medium text-white z-10">
                {day.day}
              </div>
              
              {i !== itinerary.days.length - 1 && (
                <div className="absolute left-[23px] top-12 bottom-[-64px] w-px bg-white/5"></div>
              )}

              <div className="space-y-6">
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-[#7A8BA8]">Global Strategy — Day {day.day}</h3>
                <div className="grid gap-4">
                  {day.activities.map((activity, j) => (
                    <div key={j} className="group bg-bg-hover/20 border border-white/5 p-8 rounded-3xl hover:bg-bg-hover/40 transition-all">
                      <div className="flex items-start gap-6">
                        <div className="p-3 rounded-2xl bg-brand-teal/10 text-brand-teal border border-brand-teal/10">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-white/90">{activity.time}</span>
                              <span className="w-1 h-1 bg-brand-teal rounded-full"></span>
                              <div className="flex items-center gap-1.5 text-xs text-[#7A8BA8]">
                                <MapPin className="w-3.5 h-3.5" />
                                {activity.location}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-[#7A8BA8] leading-relaxed max-w-2xl group-hover:text-[#E8EDF5] transition-colors">{activity.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-12 bg-bg-card border-t border-white/5 flex justify-center">
            <button className="flex items-center gap-4 bg-brand-teal text-neutral-950 px-10 py-5 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-teal-300 transition-all shadow-xl shadow-brand-teal/10 active:scale-95 group">
              Confirm & Book with Savior
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
      </div>
    </div>
  );
}
