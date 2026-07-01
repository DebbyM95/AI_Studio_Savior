import React, { useState, useEffect } from 'react';
import { 
  Bell, Mail, MoveRight, Trash2, Loader2, Sparkles, Plus, Check, Plane, AlertTriangle 
} from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface PriceAlert {
  id: string;
  userId?: string;
  email: string;
  origin: string;
  destination: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  targetPrice?: number | null;
  createdAt?: any;
}

export default function PriceTracker() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [email, setEmail] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [targetPrice, setTargetPrice] = useState<string>('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user?.email) {
        setEmail(user.email);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Sync / Listen to user's active alerts if logged in
  useEffect(() => {
    if (!currentUser) {
      setAlerts([]);
      return;
    }

    setFetching(true);
    const path = 'price_alerts';
    const alertsQuery = query(
      collection(db, path), 
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(alertsQuery, (snapshot) => {
      const activeAlerts: PriceAlert[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        activeAlerts.push({
          id: d.id,
          ...data
        } as PriceAlert);
      });
      setAlerts(activeAlerts);
      setFetching(false);
    }, (error) => {
      setFetching(false);
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (err: any) {
        console.error('Real-time alerts error:', err);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !origin || !destination) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccess(false);

    const path = 'price_alerts';
    const payload = {
      userId: currentUser?.uid || null,
      email: email.trim(),
      origin: origin.trim().toUpperCase(),
      destination: destination.trim().toUpperCase(),
      frequency,
      targetPrice: targetPrice ? Number(targetPrice) : null,
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, path), payload);
      setSuccess(true);
      
      // Clear secondary inputs, keep email
      setOrigin('');
      setDestination('');
      setTargetPrice('');
      
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err: any) {
      setErrorMsg('Failed to establish price connection. Please register/confirm your account parameters.');
      try {
        handleFirestoreError(err, OperationType.CREATE, path);
      } catch (logErr) {
        // Logged locally
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = async (id: string) => {
    const path = `price_alerts`;
    try {
      await deleteDoc(doc(db, path, id));
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.DELETE, `${path}/${id}`);
      } catch (logErr) {
        setErrorMsg('Failed to eliminate alert channel. Relational access denied.');
      }
    }
  };

  return (
    <section id="flight-price-tracker" className="scroll-mt-24 max-w-7xl mx-auto px-8 py-24 relative">
      {/* Visual background atmospheric elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[3rem] border border-white/5 bg-bg-card/30 backdrop-blur-[2px]">
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-brand-teal/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 space-y-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-[9px] uppercase tracking-[0.3em] font-bold text-brand-teal font-heading">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Savior Sentinel Matrix</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-light text-white tracking-tight leading-none">
              Flight Price <span className="text-[#7A8BA8] italic">Defense.</span>
            </h2>
            <p className="text-sm text-[#7A8BA8] max-w-lg leading-relaxed">
              Activate automated surveillance on designated flight corridors. Savior algorithms monitor hundreds of exclusive airline directories around the clock, warning you instantly when prices fall.
            </p>
          </div>

          <form onSubmit={handleCreateAlert} className="space-y-6 bg-bg-card border border-white/5 p-10 rounded-[2.5rem] shadow-xl">
            {errorMsg && (
              <div className="flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-300">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{errorMsg}</p>
              </div>
            )}

            <AnimatePresence>
              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-300"
                >
                  <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                  <p>Surveillance active! Flight price alerts are now routing to your inbox.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[9px] uppercase font-bold tracking-widest text-[#7A8BA8] mb-2.5">Origin Corridor (IATA or City)</label>
                <div className="relative">
                  <Plane className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8BA8] rotate-45" />
                  <input 
                    type="text" 
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="e.g. NYC"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-teal transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] uppercase font-bold tracking-widest text-[#7A8BA8] mb-2.5">Destination (IATA or City)</label>
                <div className="relative">
                  <Plane className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8BA8]" />
                  <input 
                    type="text" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. CDG"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-teal transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[9px] uppercase font-bold tracking-widest text-[#7A8BA8] mb-2.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8BA8]" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Provide notification email"
                    required
                    disabled={!!currentUser}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-teal transition-all disabled:opacity-60"
                  />
                </div>
                {currentUser && (
                  <p className="text-[9px] text-[#7A8BA8] mt-1.5 font-medium tracking-wide">Connected via signed member account. <span className="text-brand-teal">Premium Sync</span> active.</p>
                )}
              </div>

              <div>
                <label className="block text-[9px] uppercase font-bold tracking-widest text-[#7A8BA8] mb-2.5">Alert Frequency</label>
                <div className="grid grid-cols-3 gap-2 bg-white/5 border border-white/10 p-1 rounded-2xl">
                  {(['daily', 'weekly', 'monthly'] as const).map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setFrequency(freq)}
                      className={`py-2 text-[9px] uppercase tracking-wider font-bold rounded-xl transition-all ${
                        frequency === freq 
                          ? 'bg-brand-teal text-[#050B14]' 
                          : 'text-[#7A8BA8] hover:text-white'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold tracking-widest text-[#7A8BA8] mb-2.5">Target Value Cap (Optional Limit)</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#7A8BA8]">$</span>
                <input 
                  type="number" 
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="e.g. 850 (Notify when rate is below this threshold)"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-10 pr-4 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-teal transition-all"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-brand-teal text-[#050B14] py-4 rounded-full text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-teal-300 transition-all font-heading active:scale-98 disabled:opacity-60 shadow-lg shadow-brand-teal/5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Configuring Surveillance Channel...</span>
                </>
              ) : (
                <>
                  <Bell className="w-3.5 h-3.5" />
                  <span>Activate Price Surveillance</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info & Active List Column */}
        <div className="lg:col-span-5 space-y-8 h-full">
          {!currentUser ? (
            <div className="border border-white/5 p-10 rounded-[2.5rem] bg-bg-card/45 backdrop-blur-sm shadow-xl flex flex-col items-center justify-center text-center space-y-6 h-full min-h-[400px]">
              <div className="w-16 h-16 rounded-full bg-brand-teal/5 border border-brand-teal/15 flex items-center justify-center text-brand-teal">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-light text-xl text-white">Active Alert Feed</h3>
                <p className="text-xs text-[#7A8BA8] max-w-xs mx-auto leading-relaxed">
                  Sign in using your Premium account privileges to configure multiple matrix locations, track real-time changes, and delete surveillance triggers.
                </p>
              </div>
            </div>
          ) : (
            <div className="border border-white/5 p-8 rounded-[2.5rem] bg-bg-card/45 backdrop-blur-sm flex flex-col h-full min-h-[400px] shadow-xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div>
                  <h3 className="text-sm uppercase tracking-wider font-bold text-white font-heading">Telemetry Feeds</h3>
                  <p className="text-[9px] text-[#7A8BA8] uppercase tracking-widest font-semibold mt-0.5">Surveillances Active ({alerts.length})</p>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse border border-emerald-500/20" />
              </div>

              {fetching ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-20">
                  <Loader2 className="w-6 h-6 animate-spin text-brand-teal" />
                  <p className="text-[10px] text-[#7A8BA8] uppercase tracking-widest font-bold">Querying Active Sentinels...</p>
                </div>
              ) : alerts.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-20 space-y-3">
                  <p className="text-xs text-[#7A8BA8]">No active monitoring nodes configured.</p>
                  <p className="text-[10px] text-slate-500 max-w-xs mx-auto">Fill out the vector matrix on the left to set up automatic pricing surveillance.</p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-3 max-h-[350px] pr-1">
                  <AnimatePresence initial={false}>
                    {alerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="group flex items-center justify-between p-4 bg-white/5 border border-white/5 hover:border-brand-teal/20 hover:bg-brand-teal/[0.01] rounded-2xl transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 bg-brand-teal/5 rounded-xl text-brand-teal border border-brand-teal/10">
                            <Plane className="w-4 h-4 rotate-45" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-100">
                              <span>{alert.origin}</span>
                              <MoveRight className="w-3.5 h-3.5 text-brand-teal" />
                              <span>{alert.destination}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[8px] uppercase tracking-widest px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[#7A8BA8] font-bold">
                                {alert.frequency}
                              </span>
                              {alert.targetPrice && (
                                <span className="text-[9px] font-bold text-brand-gold">
                                  &lt; ${alert.targetPrice}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteAlert(alert.id)}
                          className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer opacity-40 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
