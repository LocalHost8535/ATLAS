
import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Navigation2, Home, Compass, User as UserIcon, 
  Sun, Moon, MessageSquare, Send, X, Clock, AlertCircle,
  ArrowUpDown, LocateFixed, ExternalLink, Map as MapIcon,
  ShieldCheck, Zap, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, BusRoute, Message } from '../types';
import { fetchBusRoutes, getChatResponse, searchNearbyStops } from '../services/geminiService';

interface MainDashboardProps {
  user: UserProfile;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const MainDashboard: React.FC<MainDashboardProps> = ({ user, isDarkMode, toggleDarkMode }) => {
  const [pickup, setPickup] = useState('My Location');
  const [drop, setDrop] = useState('');
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [isLocating, setIsLocating] = useState(false);
  
  const [nearbyInfo, setNearbyInfo] = useState<{text: string, sources: any[]}>({ text: '', sources: [] });
  const [exploreLoading, setExploreLoading] = useState(false);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Namaste ${user.name || 'Traveler'}! I'm Atlas. I'm connected to APSRTC data via AI search to give you the most accurate routes.`, timestamp: new Date() }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setPickup(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        console.error(error);
      }
    );
  };

  const handleSwap = () => {
    const temp = pickup;
    setPickup(drop);
    setDrop(temp);
  };

  const handleSearch = async () => {
    if (!drop || !pickup) return;
    setLoading(true);
    try {
      const results = await fetchBusRoutes(pickup, drop);
      setRoutes(results);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadNearby = async (lat?: number, lng?: number) => {
    setExploreLoading(true);
    try {
      const res = await searchNearbyStops("APSRTC Bus Stands", lat, lng);
      setNearbyInfo(res);
    } catch (e) {
      console.error(e);
    } finally {
      setExploreLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'Explore') loadNearby();
  }, [activeTab]);

  const handleChatSend = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg: Message = { role: 'user', text: chatInput, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);
    try {
      const response = await getChatResponse(chatInput);
      setMessages(prev => [...prev, response]);
    } catch (e) {
      console.error(e);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-full w-full ${isDarkMode ? 'dark bg-[#070707] text-zinc-100' : 'bg-slate-50 text-slate-800'}`}>
      <header className={`px-6 pt-14 pb-6 flex justify-between items-center sticky top-0 z-50 ${isDarkMode ? 'bg-[#070707]/90' : 'bg-white/90'} backdrop-blur-xl border-b ${isDarkMode ? 'border-zinc-800' : 'border-slate-100'}`}>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-0.5">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">APSRTC Direct</span>
          </div>
          <h1 className="text-2xl font-black tracking-tighter">Atlas</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={detectLocation} className={`p-3 rounded-2xl ${isDarkMode ? 'bg-zinc-800' : 'bg-white border border-slate-200'} active:scale-95 transition-all`}>
            <LocateFixed size={18} className={isLocating ? 'animate-spin' : 'text-emerald-500'} />
          </button>
          <button onClick={toggleDarkMode} className={`p-3 rounded-2xl ${isDarkMode ? 'bg-zinc-800' : 'bg-white border border-slate-200'} active:scale-95 transition-all`}>
            {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-500" />}
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-36 custom-scrollbar">
        {activeTab === 'Home' && (
          <div className="space-y-4 mt-6">
            <div className={`p-5 rounded-[2rem] border shadow-lg ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'}`}>
              <div className="space-y-1 relative">
                <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-zinc-500/5 border border-transparent focus-within:border-emerald-500/30 transition-all">
                  <MapPin size={16} className="text-emerald-500 opacity-70" />
                  <input value={pickup} onChange={(e) => setPickup(e.target.value)} className="bg-transparent outline-none w-full font-bold text-sm" placeholder="From..." />
                </div>
                
                <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
                  <button onClick={handleSwap} className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm active:rotate-180 transition-all ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-slate-200'}`}>
                    <ArrowUpDown size={16} className="text-emerald-500" />
                  </button>
                </div>

                <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-zinc-500/5 border border-transparent focus-within:border-emerald-500/30 transition-all">
                  <Navigation2 size={16} className="text-emerald-500 opacity-70" />
                  <input value={drop} onChange={(e) => setDrop(e.target.value)} className="bg-transparent outline-none w-full font-bold text-sm" placeholder="To..." />
                </div>
              </div>
              <button 
                onClick={handleSearch} 
                disabled={loading || !drop || !pickup}
                className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
              >
                {loading ? <Zap size={14} className="animate-spin" /> : 'Search APSRTC'}
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {routes.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center py-20 opacity-30">
                  <Clock size={40} className="mb-3" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">Ready for route</p>
                </div>
              )}
              
              {routes.map(r => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  key={r.id} 
                  className={`group relative p-4 rounded-3xl border transition-all active:scale-[0.98] ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-100 shadow-sm'}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black text-emerald-500 leading-none">{r.busNumber}</span>
                        <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                        <span className="text-[10px] font-bold text-zinc-400 truncate">{r.type}</span>
                        {r.verifiedSources && <ShieldCheck size={10} className="text-emerald-500/60" />}
                      </div>
                      <h4 className="text-base font-black truncate tracking-tight">{r.endDestination}</h4>
                      <p className="text-[10px] text-zinc-500 font-medium truncate mt-0.5 opacity-60">
                        via {r.passingAreas.slice(0, 2).join(', ')}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-end text-right shrink-0">
                      <div className={`text-xl font-black leading-none mb-1 ${r.isLate ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {r.arrivalTime}
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800">
                         <div className={`w-1 h-1 rounded-full ${r.isLate ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`} />
                         <span className="text-[9px] font-black uppercase tracking-tight text-zinc-400">
                           {r.duration} left
                         </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/50 flex justify-between items-center">
                    <span className="text-[10px] font-black text-emerald-500/80 tracking-wide">₹{r.baseFare} Ticket</span>
                    <div className="flex items-center gap-1 text-[9px] font-bold text-zinc-400">
                      Live Track <ChevronRight size={10} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Explore' && (
          <div className="space-y-5 mt-6 pb-20">
            <div className={`rounded-[2.5rem] overflow-hidden border ${isDarkMode ? 'border-zinc-800' : 'border-slate-200'} shadow-lg h-56 relative bg-zinc-200 dark:bg-zinc-900`}>
               <iframe width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen src={`https://www.google.com/maps/embed/v1/search?key=MAP_KEY&q=APSRTC+Stops`} />
            </div>

            <div className={`p-6 rounded-[2rem] border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'}`}>
              <h3 className="text-sm font-black mb-4 flex items-center gap-2 uppercase tracking-widest text-zinc-400">
                <Compass size={14} /> Nearby Activity
              </h3>
              {exploreLoading ? (
                <div className="py-10 flex flex-col items-center gap-3">
                  <div className="w-6 h-6 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">Searching...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs font-bold leading-relaxed text-zinc-500 opacity-80">{nearbyInfo.text}</p>
                  <div className="grid gap-2">
                    {nearbyInfo.sources.map((s, i) => (
                      <a key={i} href={s.uri} target="_blank" rel="noreferrer" className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isDarkMode ? 'bg-zinc-800/30 border-zinc-800 hover:border-emerald-500/40' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center gap-3">
                          <MapPin size={14} className="text-emerald-500" />
                          <span className="font-bold text-xs truncate max-w-[200px]">{s.title}</span>
                        </div>
                        <ExternalLink size={12} className="text-zinc-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Profile' && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-emerald-500/20 mb-4">
                {user.name?.[0]}
              </div>
              <h3 className="text-xl font-black">{user.name}</h3>
              <p className="text-zinc-500 text-xs font-bold">{user.email}</p>
            </div>
            
            <div className="grid gap-2">
              {[
                { label: 'Language', value: user.language },
                { label: 'Verified Phone', value: user.phone },
                { label: 'System Guard', value: 'Active', accent: true }
              ].map((item, i) => (
                <div key={i} className={`flex justify-between p-5 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'}`}>
                  <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">{item.label}</span>
                  <span className={`text-xs font-black ${item.accent ? 'text-emerald-500' : ''}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button onClick={() => setChatOpen(true)} className="fixed bottom-28 right-6 w-15 h-15 bg-emerald-500 rounded-2xl shadow-2xl flex items-center justify-center text-white z-40 active:scale-90 transition-all">
        <MessageSquare size={24} />
      </button>

      <AnimatePresence>
        {chatOpen && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }} className={`fixed inset-0 z-[70] flex flex-col ${isDarkMode ? 'bg-[#070707]' : 'bg-white'}`}>
            <div className="px-6 pt-14 pb-4 flex justify-between items-center border-b border-zinc-800/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-white"><Zap size={18} /></div>
                <div>
                  <h3 className="text-sm font-black leading-none">Atlas AI</h3>
                  <span className="text-[9px] font-black text-emerald-500 uppercase mt-1 block">Live Agent</span>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 active:scale-90 transition-all"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-emerald-500 text-white rounded-tr-none' : (isDarkMode ? 'bg-zinc-900 border border-zinc-800 rounded-tl-none' : 'bg-slate-100 rounded-tl-none')}`}>
                    <p className="text-xs font-bold leading-relaxed">{m.text}</p>
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5 space-y-2">
                        {m.sources.map((s, idx) => (
                          <a key={idx} href={s.uri} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[9px] font-black text-emerald-400 hover:underline">
                            <ExternalLink size={9} /> {s.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                   <div className="p-4 rounded-2xl bg-zinc-500/5"><div className="flex gap-1"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" /><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" /><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" /></div></div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="px-5 py-6 pb-12">
              <div className="flex gap-2">
                <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleChatSend()} placeholder="Ask anything about the route..." className={`flex-1 px-5 py-4 rounded-2xl outline-none font-bold text-xs ${isDarkMode ? 'bg-zinc-900 border border-zinc-800 focus:border-emerald-500' : 'bg-slate-50 border border-slate-100 focus:border-emerald-500'}`} />
                <button onClick={handleChatSend} className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white active:scale-90 transition-all shadow-lg shadow-emerald-500/20"><Send size={20} /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="fixed bottom-0 left-0 right-0 p-6 z-50">
        <div className={`max-w-xs mx-auto flex justify-around items-center p-2.5 rounded-[2.5rem] border backdrop-blur-2xl shadow-2xl ${isDarkMode ? 'bg-zinc-950/90 border-zinc-800' : 'bg-white/90 border-slate-200'}`}>
          {[
            { id: 'Home', icon: Home },
            { id: 'Explore', icon: Compass },
            { id: 'Profile', icon: UserIcon }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl transition-all ${activeTab === tab.id ? 'text-emerald-500 bg-emerald-500/5' : 'text-zinc-400'}`}>
              <tab.icon size={20} strokeWidth={activeTab === tab.id ? 3 : 2} />
              <span className="text-[9px] font-black uppercase tracking-tight">{tab.id}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default MainDashboard;
