import React, { useState } from 'react';
import { ChevronDown, Sparkles, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "What is Savior and how does it orchestrate travel?",
    answer: "Savior is an autonomous travel intelligence platform. By utilizing dynamic multi-agent coordination (Atlas, Chronos, Transit, and Concierge), Savior constructs highly optimized, top-tier travel portfolios, itineraries, and bundles in real-time. It analyzes hundreds of private booking routes to deliver complete, premium travel strategies in seconds."
  },
  {
    question: "How does the Flight Price Tracker protect my budget?",
    answer: "The Flight Price Sentinel conducts continuous, automated surveillance on your chosen flight corridors. Our background servers monitor live airline price matrix pools. The moment rates experience a downward trend or dip below your custom target cap, Savior routes an immediate communication to your registered inbox, securing low market rates before they bounce back."
  },
  {
    question: "Can I customize the dynamic bundles and itineraries?",
    answer: "Absolutely. The pre-orchestrated collections are designed to present maximum unified value, but every program is adaptive. You can converse directly with Savior's help chat to ask for distinct first-class cabin upgrades, alternate luxury resort villas, or personalized cultural excursions, and Savior will recalibrate the entire timeline immediately."
  },
  {
    question: "What class of service is available through Savior?",
    answer: "Savior is built exclusively for high-standard luxury and corporate executive transit. We coordinate first-class suites, business-executive cabins, private jet charters, 5-star boutique hotels, beachside overwater resorts, and select Michelin-starred dining experiences to ensure your journey is seamless and refined."
  },
  {
    question: "Is there 24/7 human support to complement Savior's artificial intelligence?",
    answer: "Yes. Every confirmed or booked Savior itinerary unlocks premier guest benefits and assigns a physical lifestyle concierge team. If any unexpected delays, route disruptions, or villa re-allocations occur during your journey, our human logistics captains act immediately to resolve them on your behalf."
  }
];

function FAQAccordionItem({ item, isOpen, onClick }: { item: FAQItem, isOpen: boolean, onClick: () => void }) {
  return (
    <div className="border border-white/5 bg-bg-card/45 backdrop-blur-sm rounded-[2rem] overflow-hidden transition-all duration-300 hover:border-brand-teal/20">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-8 text-left focus:outline-none group"
      >
        <span className="text-sm font-display font-medium text-white group-hover:text-brand-teal transition-colors pr-6">
          {item.question}
        </span>
        <div className={`p-2 rounded-xl bg-white/5 text-[#7A8BA8] group-hover:text-brand-teal transition-all duration-300 ${isOpen ? 'rotate-180 bg-brand-teal/10' : ''}`}>
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-8 pb-8 text-xs text-[#7A8BA8] leading-relaxed max-w-3xl border-t border-white/5 pt-4">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq-section" className="max-w-4xl mx-auto px-8 py-24 relative select-none">
      <div className="flex flex-col items-center text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-[9px] uppercase tracking-[0.3em] font-bold text-brand-gold font-heading">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Intellicenter Support</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-light text-white tracking-tight leading-none">
          Frequently Asked <span className="text-[#7A8BA8] italic">Queries.</span>
        </h2>
        <p className="text-sm text-[#7A8BA8] max-w-lg leading-relaxed">
          Unlock details regarding our autonomous algorithms, price sentinel monitoring systems, and unified guest benefits.
        </p>
      </div>

      <div className="space-y-4">
        {FAQ_DATA.map((item, idx) => (
          <FAQAccordionItem
            key={idx}
            item={item}
            isOpen={openIndex === idx}
            onClick={() => handleToggle(idx)}
          />
        ))}
      </div>
    </section>
  );
}
