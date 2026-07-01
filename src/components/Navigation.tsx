import React from 'react';
import { Plane, Hotel, Map, Car, Search, User, LogIn, Compass, ChevronDown } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const labelColors: Record<string, { hoverText: string, activeIndicator: string, dropBg: string, subHover: string }> = {
  "Flights": { hoverText: "hover:text-[#14E8C8] text-[#7A8BA8]", activeIndicator: "bg-[#14E8C8] shadow-[0_0_10px_rgba(20,232,200,0.5)]", dropBg: "border-[#14E8C8]/20 shadow-teal-950/40", subHover: "hover:text-[#14E8C8] hover:bg-[#14E8C8]/10 hover:border-[#14E8C8]/30" },
  "Stays": { hoverText: "hover:text-[#14E8C8] text-[#7A8BA8]", activeIndicator: "bg-[#14E8C8] shadow-[0_0_10px_rgba(20,232,200,0.5)]", dropBg: "border-[#14E8C8]/20 shadow-teal-950/40", subHover: "hover:text-[#14E8C8] hover:bg-[#14E8C8]/10 hover:border-[#14E8C8]/30" },
  "Transit": { hoverText: "hover:text-[#14E8C8] text-[#7A8BA8]", activeIndicator: "bg-[#14E8C8] shadow-[0_0_10px_rgba(20,232,200,0.5)]", dropBg: "border-[#14E8C8]/20 shadow-neutral-950/40", subHover: "hover:text-[#14E8C8] hover:bg-[#14E8C8]/10 hover:border-[#14E8C8]/30" },
  "Experiences": { hoverText: "hover:text-brand-gold text-[#7A8BA8]", activeIndicator: "bg-brand-gold shadow-[0_0_10px_rgba(251,191,36,0.5)]", dropBg: "border-brand-gold/20 shadow-amber-950/40", subHover: "hover:text-brand-gold hover:bg-brand-gold/10 hover:border-brand-gold/30" },
  "Curations": { hoverText: "hover:text-brand-gold text-[#7A8BA8]", activeIndicator: "bg-brand-gold shadow-[0_0_10px_rgba(251,191,36,0.5)]", dropBg: "border-brand-gold/20 shadow-amber-950/40", subHover: "hover:text-brand-gold hover:bg-brand-gold/10 hover:border-brand-gold/30" },
};

function NavItem({ label, subItems }: { label: string, subItems: string[] }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const style = labelColors[label] || { hoverText: "hover:text-white text-slate-500", activeIndicator: "bg-white", dropBg: "border-white/10", subHover: "hover:text-white hover:bg-white/5" };
  
  return (
    <div 
      className="relative h-full flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className={cn("flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-bold transition-all h-full px-2 relative", style.hoverText)}>
        {label}
        <ChevronDown className={cn("w-3 h-3 transition-transform duration-300", isOpen && "rotate-180")} />
        {isOpen && (
          <motion.div 
            layoutId={`nav-indicator-${label}`}
            className={cn("absolute bottom-0 left-2 right-2 h-[2px] rounded-full", style.activeIndicator)}
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn("absolute top-full left-1/2 -translate-x-1/2 mt-0 w-56 bg-bg-card/95 border rounded-2xl overflow-hidden shadow-2xl py-2 backdrop-blur-xl", style.dropBg)}
          >
            {subItems.map((item, idx) => (
              <a
                key={idx}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className={cn("block px-6 py-2.5 text-[10px] uppercase tracking-widest font-bold transition-all border-l-2 border-transparent hover:pl-7 pl-6 duration-200", style.subHover)}
              >
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navigation() {
  const [user, setUser] = React.useState<FirebaseUser | null>(null);

  React.useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-bg-card/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <div className="flex items-center">
            <span className="text-2xl font-display font-light tracking-[0.3em] text-[#E8EDF5] uppercase select-none">
              SAVIOR
              <span className="bg-gradient-to-r from-[#14E8C8] via-brand-gold to-[#14E8C8] bg-clip-text text-transparent font-extrabold drop-shadow-[0_0_8px_rgba(20,232,200,0.4)]">
                .
              </span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 h-full">
            <NavItem 
              label="Flights" 
              subItems={[
                "First Class Suites",
                "Business Executive",
                "Private Jet Charters",
                "Multi-City Flight Deals",
                "Flight Price Tracker"
              ]}
            />
            <NavItem 
              label="Stays" 
              subItems={[
                "5-Star Boutique Hotels",
                "Beach & Overwater Resorts",
                "Historic Palaces & Villas",
                "Luxury Wilderness Lodges"
              ]}
            />
            <NavItem 
              label="Transit" 
              subItems={[
                "High-Speed Luxury Trains",
                "Executive Private Chauffeur",
                "Elite Sports Car Rental",
                "Superyacht & Boat Charters"
              ]}
            />
            <NavItem 
              label="Experiences" 
              subItems={[
                "Michelin-Starred Dining",
                "Exclusive Wine Tastings",
                "VIP Cultural Expeditions",
                "Wellness & Healing Retreats"
              ]}
            />
            <NavItem 
              label="Curations" 
              subItems={[
                "Flight + Stay Bundles",
                "Multi-Agent Bespoke Itineraries",
                "Elite Solo Journeys",
                "Honeymoon & Romantic Escapes"
              ]}
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:block px-3 py-1 bg-brand-teal/5 border border-brand-teal/10 rounded-full text-[10px] uppercase tracking-[0.15em] text-brand-teal font-bold animate-pulse">Premium Member</div>
              <button 
                onClick={() => signOut(auth)}
                className="w-9 h-9 rounded-full overflow-hidden border border-brand-teal/20 bg-gradient-to-tr from-brand-teal to-brand-gold animate-glow"
              >
                <img src={user.photoURL || ''} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold bg-brand-teal text-neutral-950 px-5 py-2 rounded-full hover:bg-teal-300 transition-all duration-300 shadow-lg shadow-brand-teal/10"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
