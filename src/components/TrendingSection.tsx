import React from 'react';
import { motion } from 'motion/react';
import { Play, Calendar, ArrowRight, Compass, Sparkles, BookOpen, User } from 'lucide-react';
import { cn } from '../lib/utils';

const VIDEOS = [
  {
    title: 'Autumn in Kyoto',
    location: 'Japan',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-japanese-temple-at-sunset-4158-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=2070'
  },
  {
    title: 'The Amalfi Coast',
    location: 'Italy',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-cliff-and-sea-shore-with-houses-on-top-4159-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1974'
  }
];

const BLOGS = [
  {
    category: 'Epicurean',
    title: 'The Rise of Hyper-Local Dining in Southeast Asia',
    date: 'Oct 14, 2026',
    author: 'Elena Rossi',
    img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2070',
    description: 'Exploring the hidden kitchens of Vietnam where tradition meets avant-garde refinement.'
  },
  {
    category: 'Analysis',
    title: 'Autonomous Travel: The New Gold Standard',
    date: 'Oct 10, 2026',
    author: 'Marcus Vane',
    img: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&q=80&w=2070',
    description: 'How AI-driven coordination is reclaiming the lost art of spontaneous luxury.'
  },
  {
    category: 'Nature',
    title: 'Sustainable Sanctuaries of the Nordic North',
    date: 'Oct 08, 2026',
    author: 'Soren Berg',
    img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=2070',
    description: 'A deep dive into zero-impact architecture across the Icelandic wilderness.'
  }
];

const DESTINATIONS = [
  { 
    title: 'The Amalfi Coast', 
    img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1974',
    tag: 'Azure Waters & Yachting',
    glow: 'group-hover:border-teal-500/30 group-hover:shadow-[0_0_45px_rgba(20,184,166,0.3)]',
    accent: 'text-teal-400' 
  },
  { 
    title: 'Kyoto Temples', 
    img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=2070',
    tag: 'Autumn Foliage & Tea',
    glow: 'group-hover:border-amber-500/30 group-hover:shadow-[0_0_45px_rgba(245,158,11,0.3)]',
    accent: 'text-amber-400' 
  },
  { 
    title: 'Swiss Alps', 
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=2070',
    tag: 'Sovereign Peaks',
    glow: 'group-hover:border-indigo-500/30 group-hover:shadow-[0_0_45px_rgba(99,102,241,0.3)]',
    accent: 'text-indigo-400' 
  },
];

function VideoCard({ video, isActive, onToggle }: { video: typeof VIDEOS[0], isActive: boolean, onToggle: () => void }) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(err => console.error("Playback failed:", err));
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive]);

  return (
    <motion.div
      className="relative min-w-[320px] md:min-w-[600px] h-[400px] rounded-[2.5rem] overflow-hidden group cursor-pointer border border-white/5 shadow-2xl"
      onClick={onToggle}
    >
      <video 
        ref={videoRef}
        src={video.url} 
        poster={video.thumbnail}
        loop 
        muted 
        playsInline
        className={cn(
          "w-full h-full object-cover transition-opacity duration-500",
          isActive ? "opacity-100" : "opacity-0"
        )}
      />
      
      <div className={cn(
        "absolute inset-0 transition-opacity duration-500",
        isActive ? "opacity-0 pointer-events-none" : "opacity-100"
      )}>
        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
          <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-all duration-500">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
        <div className="relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{video.location}</p>
          <h4 className="text-2xl font-light text-white tracking-tight">{video.title}</h4>
        </div>
        <div className="relative z-10 text-[10px] uppercase font-bold text-white px-3 py-1 border border-white/20 rounded-full bg-black/50">
          4K Ultra
        </div>
      </div>
    </motion.div>
  );
}

export default function TrendingSection() {
  const [activeVideo, setActiveVideo] = React.useState<number | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-8 py-32 space-y-48">
      {/* Featured Destinations (The rework of existing grid) */}
      <section>
        <div className="flex flex-col items-center mb-20 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 font-bold text-[9px] uppercase tracking-[0.3em] text-[#7A8BA8]">
            <Compass className="w-3.5 h-3.5 text-[#14E8C8]" />
            <span>Sector Analysis 2026</span>
          </div>
          <h2 className="text-4xl md:text-7xl font-display font-light text-[#E8EDF5] tracking-tighter mb-4">
            Featured <span className="bg-gradient-to-r from-[#14E8C8] via-teal-300 to-[#FBBF24] bg-clip-text text-transparent italic">Refinement.</span>
          </h2>
          <p className="text-sm text-[#7A8BA8] max-w-xl mx-auto">Selected coordinates representing the pinnacle of this season's travel intelligence.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {DESTINATIONS.map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -12 }}
              className={cn("group relative h-[700px] rounded-[3rem] overflow-hidden cursor-pointer shadow-2xl border border-white/5 transition-all duration-500", item.glow)}
            >
              <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0 shadow-inner" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              
              <div className="absolute top-8 left-8">
                <span className="bg-black/50 backdrop-blur-md text-[8px] font-bold uppercase tracking-[0.2em] text-white px-4 py-2 rounded-full border border-white/10">
                  0{i + 1}
                </span>
              </div>
 
              <div className="absolute bottom-12 left-12 right-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <p className={cn("text-[10px] font-bold uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-all duration-500", item.accent === 'text-indigo-400' ? 'text-[#14E8C8]' : item.accent)}>{item.tag}</p>
                  <div className="flex items-end justify-between">
                    <h3 className="text-5xl font-display font-light text-[#E8EDF5] tracking-tighter leading-none group-hover:italic transition-all duration-500">{item.title}</h3>
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-500">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Cinematic Journeys (Video Section) */}
      <section className="relative overflow-hidden py-24 rounded-[4rem] bg-bg-card border border-white/10">
        <div className="max-w-4xl mx-auto text-center px-8 mb-20 relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#14E8C8]/10 border border-[#14E8C8]/20 mb-6 font-bold text-[9px] uppercase tracking-[0.3em] text-[#14E8C8]">
            <Play className="w-3.5 h-3.5 fill-[#14E8C8]" />
            <span>Cinematic Motion</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-light text-[#E8EDF5] tracking-tighter mb-8 font-serif">Atmosphere in <span className="italic bg-gradient-to-r from-[#14E8C8] via-teal-300 to-[#FBBF24] bg-clip-text text-transparent">High Definition.</span></h2>
        </div>

        <div className="flex gap-8 px-8 overflow-x-auto no-scrollbar pb-12 relative z-10">
          {VIDEOS.map((video, i) => (
            <VideoCard 
              key={i} 
              video={video} 
              isActive={activeVideo === i} 
              onToggle={() => setActiveVideo(activeVideo === i ? null : i)} 
            />
          ))}
        </div>

        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-teal-500/10 via-purple-500/10 to-rose-500/5 blur-[130px] rounded-full pointer-events-none"></div>
      </section>

      {/* Traveller's Journal (Blog Section) */}
      <section>
        <div className="flex items-end justify-between mb-20">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-2 font-bold text-[9px] uppercase tracking-[0.3em] text-[#7A8BA8]">
              <BookOpen className="w-3.5 h-3.5 text-brand-teal" />
              <span>The Journal</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-light text-[#E8EDF5] tracking-tighter">Deep <span className="text-[#7A8BA8] italic">Exploration.</span></h2>
          </div>
          <button className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-white border-b border-brand-teal pb-2 hover:text-[#14E8C8] hover:border-[#14E8C8] transition-all group">
            Browse Archive
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {BLOGS.map((blog, i) => {
            const categoryStyles: Record<string, string> = {
              Epicurean: "bg-brand-gold/10 text-brand-gold border border-brand-gold/20 shadow-[0_0_12px_rgba(245,158,11,0.1)]",
              Analysis: "bg-brand-teal/10 text-brand-teal border border-brand-teal/20 shadow-[0_0_12px_rgba(20,232,200,0.1)]",
              Nature: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.1)]",
            };
            return (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[16/10] rounded-[2rem] overflow-hidden mb-8 border border-white/5">
                  <img src={blog.img} alt={blog.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" referrerPolicy="no-referrer" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={cn("text-[8px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border", categoryStyles[blog.category] || "text-brand-teal bg-white/5 border-white/10")}>
                      {blog.category}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-[#7A8BA8]">
                      <Calendar className="w-3 h-3" />
                      <span>{blog.date}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-display font-light text-[#E8EDF5] tracking-tight leading-snug group-hover:text-brand-teal transition-colors uppercase italic underline decoration-white/0 group-hover:decoration-brand-teal/50 underline-offset-8">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-[#7A8BA8] leading-relaxed font-light">{blog.description}</p>
                  <div className="pt-4 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-brand-teal/10 flex items-center justify-center">
                      <User className="w-3 h-3 text-brand-teal" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A8BA8]">By {blog.author}</span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* Interactive CTA Section */}
      <section className="py-32 rounded-[4rem] bg-gradient-to-tr from-bg-card via-brand-teal/20 to-brand-gold/10 border border-white/5 relative overflow-hidden group shadow-[0_30px_100px_rgba(20,232,200,0.15)]">
        <div className="absolute inset-0 opacity-15 group-hover:opacity-35 transition-opacity">
          <img 
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2073" 
            alt="Beach" 
            className="w-full h-full object-cover scale-150 group-hover:scale-100 transition-transform duration-[2000ms]"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center px-8 space-y-8">
          <Sparkles className="w-12 h-12 text-brand-gold animate-pulse drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]" />
          <h2 className="text-5xl md:text-8xl font-display font-light text-[#E8EDF5] tracking-tighter uppercase italic">Ready to <span className="not-italic font-bold">Transcend?</span></h2>
          <p className="text-slate-300 text-lg md:text-xl font-light max-w-2xl mx-auto italic">Your journey doesn't start with a reservation. It starts with an aspiration. Let us curate yours.</p>
          <button className="bg-brand-teal text-neutral-950 px-12 py-6 rounded-full font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#14E8C8] hover:shadow-[0_0_30px_rgba(20,232,200,0.4)] transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2x">
            Commence Planning
          </button>
        </div>
      </section>
    </div>
  );
}
