import React from 'react';
import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background/Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-bg-deep"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/15 via-rose-500/5 to-amber-500/10 opacity-60"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/8 via-transparent to-transparent blur-xl"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.span 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block px-4 py-1.5 bg-[#0F172A] border border-white/5 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold text-brand-teal mb-8 shadow-lg shadow-brand-teal/5"
        >
          Curated Travel Intelligence
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-6xl md:text-8xl lg:text-[7.5rem] font-display font-light text-[#E8EDF5] tracking-tight leading-[0.9] mb-8"
        >
          Explore with <br/> 
          <span className="italic bg-gradient-to-r from-brand-teal via-teal-300 to-brand-gold bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(20,232,200,0.15)]">
            Distinction.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-[#7A8BA8] text-lg md:text-xl max-w-2xl mx-auto tracking-tight leading-relaxed font-light"
        >
          Savior orchestrates the world's most <span className="text-[#E8EDF5] font-normal bg-gradient-to-r from-[#14E8C8] to-[#FBBF24] bg-clip-text text-transparent">exclusive travel opportunities</span> into a single, <span className="text-[#14E8C8] font-normal bg-gradient-to-r from-[#14E8C8] to-[#FBBF24] bg-clip-text text-transparent">seamless masterpiece</span>.
        </motion.p>
      </div>
    </section>
  );
}
