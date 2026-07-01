import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  UtensilsCrossed, 
  Plane, 
  Hotel, 
  Clock 
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Message {
  role: string;
  text: string;
  agentsInvolved?: string[];
  agentSteps?: { agent: string; action: string }[];
}

const AGENT_REGISTRY = {
  atlas: {
    id: 'atlas',
    letter: 'S',
    name: 'Savior',
    title: 'Root Orchestrator',
    desc: 'The central intelligence mastermind. Structures master travel layouts, routes tasks across specialized sub-agents, and synthesizes final solutions with premium Savior standards.',
    icon: Bot,
    iconColor: 'text-brand-teal',
    bgAccent: 'bg-[#14E8C8]/10',
    borderStyle: 'border-[#14E8C8]/25',
    badgeColor: 'bg-brand-teal/20 text-[#E8EDF5] border border-brand-teal/30 font-bold',
    glowColor: 'shadow-[0_0_15px_rgba(20,232,200,0.2)]'
  },
  chef: {
    id: 'chef',
    letter: 'C',
    name: 'Chef',
    title: 'Gastronomy Specialist',
    desc: 'Unveils local culinary secrets. Curates Michelin-starred maps, private winery tastings, cooking masterclasses, and hidden under-the-radar local eateries.',
    icon: UtensilsCrossed,
    iconColor: 'text-emerald-400',
    bgAccent: 'bg-emerald-500/10',
    borderStyle: 'border-emerald-500/25',
    badgeColor: 'bg-emerald-600/20 text-emerald-100 border border-emerald-500/30 font-bold',
    glowColor: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]'
  },
  pathfinder: {
    id: 'pathfinder',
    letter: 'P',
    name: 'Pathfinder',
    title: 'Transit Analyst',
    desc: 'Master of air routes and seamless custom transit. Discovers top-tier flight configurations, private chauffeurs, high-speed rails, and local transfers.',
    icon: Plane,
    iconColor: 'text-brand-teal',
    bgAccent: 'bg-brand-teal/10',
    borderStyle: 'border-brand-teal/25',
    badgeColor: 'bg-brand-teal/20 text-[#E8EDF5] border border-brand-teal/30 font-bold',
    glowColor: 'shadow-[0_0_15px_rgba(20,232,200,0.2)]'
  },
  concierge: {
    id: 'concierge',
    letter: 'H',
    name: 'Concierge',
    title: 'Hospitality Specialist',
    desc: 'Elite lodging curations. Sources iconic award-winning design hotels, private villas, historical estates, and unlocks proprietary guest benefits and amenities.',
    icon: Hotel,
    iconColor: 'text-brand-gold',
    bgAccent: 'bg-brand-gold/10',
    borderStyle: 'border-brand-gold/25',
    badgeColor: 'bg-brand-gold/20 text-amber-100 border border-brand-gold/30 font-bold',
    glowColor: 'shadow-[0_0_15px_rgba(251,191,36,0.2)]'
  },
  chronos: {
    id: 'chronos',
    letter: 'T',
    name: 'Chronos',
    title: 'Itinerary Architect',
    desc: 'Bespoke time allocation and chronological pacing. Sequences elegant day-by-day routines and structures logistics so your trip breathes naturally.',
    icon: Clock,
    iconColor: 'text-brand-gold',
    bgAccent: 'bg-brand-gold/10',
    borderStyle: 'border-brand-gold/25',
    badgeColor: 'bg-brand-gold/20 text-amber-100 border border-brand-gold/30 font-bold',
    glowColor: 'shadow-[0_0_15px_rgba(251,191,36,0.2)]'
  }
};

export default function AgentChat() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [activeAgents, setActiveAgents] = React.useState<string[]>(['atlas']);
  const [selectedAgent, setSelectedAgent] = React.useState<string | null>(null);
  
  const [messages, setMessages] = React.useState<Message[]>([
    { 
      role: 'assistant', 
      text: "Hey I am Savior, your multi-purpose travel agent. How can I help you plan your next adventure today?",
      agentsInvolved: ['atlas'],
      agentSteps: [
        { agent: 'atlas', action: 'Savior online support network active.' }
      ]
    }
  ]);
  const [loading, setLoading] = React.useState(false);
  const [loadingText, setLoadingText] = React.useState("Savior is preparing travel pipelines...");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Loading text dynamic rotation
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      const texts = [
        "Savior is mapping central travel vectors...",
        "Chef is searching local gastronomy guides...",
        "Pathfinder is optimizing non-stop high-speed transits...",
        "Concierge is inspecting boutique luxury lodgings...",
        "Chronos is sequencing daylight itinerary safety margins..."
      ];
      let i = 0;
      setLoadingText(texts[0]);
      interval = setInterval(() => {
        i = (i + 1) % texts.length;
        setLoadingText(texts[i]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userMsg = { role: 'user', text: message };
    setMessages(prev => [...prev, userMsg]);
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message, 
          history: messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ 
              text: m.role === 'assistant' 
                ? JSON.stringify({ text: m.text, agentsInvolved: m.agentsInvolved, agentSteps: m.agentSteps }) 
                : m.text 
            }]
          }))
        })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to communicate with Savior agent.");
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: data.text,
        agentsInvolved: data.agentsInvolved || ['atlas'],
        agentSteps: data.agentSteps || []
      }]);
      
      if (data.agentsInvolved) {
        setActiveAgents(data.agentsInvolved);
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: err.message || "I'm sorry, my connection with the core coordination nodes was interrupted. Please try again shortly.",
        agentsInvolved: ['atlas']
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-brand-teal text-neutral-950 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(20,232,200,0.4)] hover:bg-teal-300 transition-all hover:scale-110 active:scale-95"
      >
        <Bot className="w-8 h-8" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 20 }}
            className="fixed bottom-8 right-8 z-50 w-[420px] max-w-[calc(100vw-2rem)] h-[700px] max-h-[calc(100vh-4rem)] bg-bg-card border border-white/5 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-bg-deep">
              <div className="flex items-center gap-4">
                <div className="relative animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-brand-teal flex items-center justify-center shadow-lg shadow-brand-teal/20">
                    <Bot className="w-6 h-6 text-neutral-950" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0A0F1E] rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight text-white uppercase tracking-wider font-heading">SAVIOR INTEL CHAT</h3>
                  <p className="text-[10px] text-[#7A8BA8] uppercase tracking-widest font-bold">Autonomous Support Online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Specialist Bar */}
            <div className="px-6 py-3 bg-bg-hover border-b border-white/5 flex items-center justify-between">
              <span className="text-[9px] text-[#7A8BA8] font-bold tracking-widest uppercase">Specialist Directory</span>
              <div className="flex items-center gap-2">
                {Object.values(AGENT_REGISTRY).map((agent) => {
                  const Icon = agent.icon;
                  const isActive = activeAgents.includes(agent.id);
                  const isSelected = selectedAgent === agent.id;
                  return (
                    <button
                      key={agent.id}
                      onClick={() => setSelectedAgent(isSelected ? null : agent.id)}
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center transition-all border relative",
                        isActive 
                          ? cn("border-brand-teal bg-brand-teal/10 cursor-pointer", agent.glowColor, agent.iconColor)
                          : "border-white/5 text-slate-600 bg-transparent hover:border-white/15 hover:text-slate-400",
                        isSelected && "ring-1 ring-brand-teal ring-offset-2 ring-offset-bg-deep"
                      )}
                      title={`${agent.name} - ${agent.title}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {isActive && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Agent Info Sub-Drawer */}
            <AnimatePresence>
              {selectedAgent && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-bg-deep border-b border-white/5 px-6 py-4 flex flex-col gap-1.5 relative overflow-hidden"
                >
                  <button 
                    onClick={() => setSelectedAgent(null)}
                    className="absolute top-4 right-4 p-1 hover:bg-white/5 rounded text-slate-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="flex items-center gap-2">
                    <span className={cn("px-2 py-0.5 rounded text-[8px] tracking-widest uppercase", AGENT_REGISTRY[selectedAgent as keyof typeof AGENT_REGISTRY].badgeColor)}>
                      {AGENT_REGISTRY[selectedAgent as keyof typeof AGENT_REGISTRY].name}
                    </span>
                    <span className="text-[10px] text-brand-gold font-bold uppercase tracking-widest font-heading">
                      {AGENT_REGISTRY[selectedAgent as keyof typeof AGENT_REGISTRY].title}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7A8BA8] pr-6 mt-1">
                    {AGENT_REGISTRY[selectedAgent as keyof typeof AGENT_REGISTRY].desc}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar"
            >
              {messages.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220, delay: Math.min(0.15, i * 0.05) }}
                  className={cn(
                    "flex flex-col max-w-[85%] transition-all",
                    msg.role === 'user' ? "ml-auto items-end" : "items-start"
                  )}
                >
                  {/* Message Content Bubble */}
                  <div className={cn(
                    "px-5 py-4 text-[13px] leading-relaxed shadow-lg max-w-full overflow-x-hidden",
                    msg.role === 'assistant' 
                      ? "bg-bg-card/95 backdrop-blur-sm text-[#E8EDF5] rounded-3xl rounded-tl-none border border-white/[0.06] border-l-[4px] border-l-brand-teal pl-4.5" 
                      : "bg-brand-teal/10 text-brand-teal rounded-3xl rounded-tr-none border border-brand-teal/20 shadow-[0_0_15px_rgba(20,232,200,0.05)]"
                  )}>
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => <h1 className="text-[15px] font-bold text-white tracking-widest uppercase mt-6 mb-3 border-b border-white/[0.08] pb-1.5 first:mt-0">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-[13.5px] font-extrabold text-brand-teal tracking-wider uppercase mt-5 mb-2 first:mt-0">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-[13px] font-bold text-brand-gold tracking-wide mt-4 mb-2 first:mt-0">{children}</h3>,
                          p: ({ children }) => <p className="text-[13px] text-[#E8EDF5] leading-relaxed mb-3.5 last:mb-0 font-normal">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc pl-5 mb-4 space-y-2 text-slate-350">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-5 mb-4 space-y-2 text-slate-350">{children}</ol>,
                          li: ({ children }) => <li className="text-[13px] leading-relaxed text-[#7A8BA8] marker:text-brand-teal font-normal">{children}</li>,
                          code: ({ children }) => <code className="bg-white/5 px-1.5 py-0.5 rounded text-xs font-mono text-brand-teal border border-white/5">{children}</code>,
                          strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                          em: ({ children }) => <em className="italic text-brand-teal">{children}</em>,
                          blockquote: ({ children }) => <blockquote className="border-l-2 border-brand-teal/45 pl-3.5 italic text-[#7A8BA8] my-3 text-[13px] bg-white/[0.01] py-1 pr-2 rounded-r">{children}</blockquote>,
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    ) : (
                      <p className="text-[13px] text-white font-normal leading-relaxed">{msg.text}</p>
                    )}
                  </div>

                  {/* Message Sender Signoff Tag */}
                  <div className="flex items-center gap-1.5 mt-2 px-1.5">
                    <span className="text-[8px] uppercase tracking-widest font-bold text-[#7A8BA8] hover:text-slate-400 transition-colors">
                      {msg.role === 'assistant' ? 'Coordinated by Savior' : 'You'}
                    </span>
                    {msg.role === 'assistant' && msg.agentsInvolved && (
                      <div className="flex gap-1 items-center">
                        <span className="text-[7px] text-[#7A8BA8] font-bold uppercase tracking-widest">• Signed:</span>
                        {msg.agentsInvolved.map(agentId => {
                          const ag = AGENT_REGISTRY[agentId as keyof typeof AGENT_REGISTRY] || AGENT_REGISTRY.atlas;
                          if (!ag) return null;
                          const BadgeIcon = ag.icon;
                          return (
                            <div 
                              key={agentId} 
                              className={cn("p-0.5 rounded-full flex items-center justify-center transition-transform hover:scale-110", ag.bgAccent)}
                              title={ag.name}
                            >
                              <BadgeIcon className={cn("w-2 h-2", ag.iconColor)} />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {/* Special Loading Sequence */}
              {loading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-start max-w-[85%] w-full"
                >
                  <div className="bg-[#121212]/90 border border-white/[0.06] py-4 px-5 rounded-3xl rounded-tl-none text-xs text-slate-400 shadow-lg flex flex-col gap-2.5 w-full border-l-[3px] border-l-brand-teal">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-ping"></div>
                      <span className="font-bold tracking-widest text-[8px] uppercase text-brand-teal">Collaboration Routing Matrix</span>
                    </div>
                    <p className="italic text-slate-400 text-[11px] animate-pulse">
                      {loadingText}
                    </p>
                    <div className="flex items-center gap-1.5 pt-1">
                      {Object.values(AGENT_REGISTRY).map(ag => {
                        const LoaderIcon = ag.icon;
                        const isCoordinating = activeAgents.includes(ag.id) || ag.id === 'atlas';
                        return (
                          <div 
                            key={ag.id} 
                            className={cn(
                              "w-5 h-5 rounded-full flex items-center justify-center transition-all", 
                              isCoordinating ? "animate-bounce" : "opacity-30",
                              ag.bgAccent,
                              ag.id === 'atlas' && "animation-delay-100",
                              ag.id === 'chef' && "animation-delay-200",
                              ag.id === 'pathfinder' && "animation-delay-350",
                              ag.id === 'concierge' && "animation-delay-500",
                              ag.id === 'chronos' && "animation-delay-700"
                            )}
                          >
                            <LoaderIcon className={cn("w-2.5 h-2.5", ag.iconColor)} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Suggestions */}
            <div className="px-6 py-2 bg-bg-hover border-t border-white/[0.05] flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
              {[
                { label: "🤖 Savior", prompt: "Savior, orchestrate a luxurious, cohesive multi-agent travel plan for 5 days in London." },
                { label: "✈️ Pathfinder", prompt: "Pathfinder, optimize the fastest first-class flights and private VIP transfers to Tokyo." },
                { label: "🛎️ Concierge", prompt: "Concierge, curate the most prestigious boutique five-star hotels and historic estates in Florence." },
                { label: "🍳 Chef", prompt: "Chef, suggest an exclusive under-the-radar culinary journey and premium wine tasting in Tuscany." },
                { label: "⏳ Chronos", prompt: "Chronos, build a perfectly paced, naturally breathing 7-day day-by-day Kyoto and Osaka timeline." }
              ].map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setMessage(s.prompt);
                  }}
                  className="text-[9px] font-bold uppercase tracking-widest text-[#7A8BA8] bg-white/[0.02] border border-white/[0.04] hover:border-brand-teal/40 hover:text-brand-teal hover:bg-brand-teal/[0.03] rounded-full px-3 py-1.5 transition-all shrink-0 cursor-pointer"
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-6 bg-bg-deep border-t border-white/5">
              <div className="relative">
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Savior anything..."
                  className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-6 pr-14 text-xs text-white placeholder:text-slate-700 focus:outline-none focus:border-brand-teal transition-all"
                />
                <button 
                  onClick={handleSend}
                  disabled={!message.trim() || loading}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-brand-teal text-neutral-950 rounded-full disabled:opacity-50 transition-all hover:bg-teal-300 active:scale-90 flex items-center justify-center shadow-lg shadow-brand-teal/20"
                >
                  <Send className="w-3.5 h-3.5 text-neutral-950" />
                </button>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-[8px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
                <span>SAVIOR NEURAL TRAVEL ENGINE V3.5</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
