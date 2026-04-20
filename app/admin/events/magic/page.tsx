'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2, Wand2, ArrowRight, CheckCircle2 } from 'lucide-react';
import DynamicTemplate, { DynamicTheme } from '@/components/templates/DynamicTemplate';

export default function MagicCreatePage() {
  const [step, setStep] = useState<'input' | 'generating' | 'results'>('input');
  
  const [formData, setFormData] = useState({
    couple_names: '',
    event_date: '',
    venue_name: '',
    mood: ''
  });

  const [generatedThemes, setGeneratedThemes] = useState<DynamicTheme[]>([]);
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!formData.couple_names) return alert('Couple names are required');
    
    setStep('generating');
    
    try {
      const res = await fetch('/api/admin/events/generate-themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           couple_names: formData.couple_names,
           event_date: formData.event_date,
           venue_name: formData.venue_name,
           mood: formData.mood
        })
      });
      
      const data = await res.json();
      if (data.success && data.themes) {
        setGeneratedThemes(data.themes);
        setStep('results');
      } else {
        alert('Generation failed: ' + (data.error || 'Unknown error'));
        setStep('input');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during generation.');
      setStep('input');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0C07] text-ivory font-body selection:bg-gold/30 pt-20 px-6 pb-32 overflow-hidden relative">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold/10 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 mt-10">
        
        <AnimatePresence mode="wait">
          
          {/* STEP 1: INPUT */}
          {step === 'input' && (
            <motion.div 
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              transition={{ duration: 0.5 }}
              className="max-w-xl mx-auto"
            >
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 px-4 py-1.5 rounded-full text-gold text-[10px] uppercase tracking-[0.2em] font-bold mb-6 shadow-[0_0_15px_rgba(201,168,76,0.2)]">
                  <Wand2 size={12} /> AI Studio
                </div>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] text-ivory leading-[1.1] mb-4">
                  { }
                  Let's craft something <span className="italic text-gold px-2">magical</span>.
                </h1>
                { }
                <p className="text-ivory/60 text-sm">Tell us a bit about your celebration, and we'll dynamically generate bespoke, print-ready designs just for you.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-[40px] border border-white/10 p-8 rounded-[32px] shadow-2xl flex flex-col gap-6">
                
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-ivory/60 mb-2 font-bold ml-2">Who is getting married?</label>
                  <input 
                    type="text" 
                    placeholder="Rahul & Priya"
                    value={formData.couple_names}
                    onChange={e => setFormData({...formData, couple_names: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 p-4 rounded-xl focus:border-gold outline-none transition font-display text-xl placeholder:text-white/20 text-white" 
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-ivory/60 mb-2 font-bold ml-2">When is the big day?</label>
                  <input 
                    type="text" 
                    placeholder="e.g. December 28th, 2026"
                    value={formData.event_date}
                    onChange={e => setFormData({...formData, event_date: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 p-4 rounded-xl focus:border-gold outline-none transition placeholder:text-white/20 text-white" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-ivory/60 mb-2 font-bold ml-2">Where is the venue?</label>
                  <input 
                    type="text" 
                    placeholder="Taj Malabar Resort, Kochi"
                    value={formData.venue_name}
                    onChange={e => setFormData({...formData, venue_name: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 p-4 rounded-xl focus:border-gold outline-none transition placeholder:text-white/20 text-white" 
                  />
                </div>

                <div>
                  { }
                  <label className="block text-[10px] uppercase tracking-widest text-ivory/60 mb-2 font-bold ml-2">What's the vibe? (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Moody and regal, heavily inspired by Mughal architecture"
                    value={formData.mood}
                    onChange={e => setFormData({...formData, mood: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 p-4 rounded-xl focus:border-gold outline-none transition placeholder:text-white/20 text-white italic" 
                  />
                </div>
                
                <button 
                  onClick={handleGenerate}
                  className="mt-4 w-full bg-gold text-[#0F0C07] font-bold uppercase tracking-widest text-[12px] py-5 rounded-xl hover:shadow-[0_0_30px_rgba(201,168,76,0.4)] hover:scale-[1.02] transition-all flex justify-center items-center gap-2 group"
                >
                  <Sparkles size={16} className="group-hover:animate-pulse" /> Design My Invitations
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: GENERATING (LOADING) */}
          {step === 'generating' && (
            <motion.div 
              key="generating"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              className="flex flex-col items-center justify-center min-h-[50vh]"
            >
              <div className="relative mb-12">
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 border-2 border-gold/10 border-t-gold rounded-full"
                />
                <motion.div 
                  animate={{ rotate: -360 }} 
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 border border-white/10 border-b-ivory/50 rounded-full"
                />
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gold animate-pulse" size={24} />
              </div>
              
              <div className="h-8 relative overflow-hidden flex justify-center items-center w-full max-w-sm">
                <motion.div 
                  animate={{ y: ["0%", "-33%", "-66%"] }}
                  transition={{ duration: 6, times: [0, 0.5, 1], ease: "easeInOut" }}
                  className="font-display text-2xl italic text-gold absolute top-0 flex flex-col gap-8 items-center"
                >
                  <span>Analyzing venue aesthetics...</span>
                  <span>Curating typography pairings...</span>
                  <span>Finalizing bespoke palettes...</span>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: RESULTS */}
          {step === 'results' && (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full"
            >
               <div className="text-center mb-16">
                 <motion.h2 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.2 }}
                   className="font-display text-4xl sm:text-5xl text-ivory mb-4"
                 >
                   { }
                   We've prepared <span className="italic text-gold">3 variations</span>.
                 </motion.h2>
                 <motion.p 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 0.4 }}
                   className="text-ivory/60 text-sm uppercase tracking-widest font-bold"
                 >
                   Select the design that speaks to your celebration
                 </motion.p>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                 {generatedThemes.map((theme, idx) => (
                   <motion.div
                     key={theme.theme_id || idx}
                     initial={{ opacity: 0, y: 40 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.8, delay: 0.2 + (idx * 0.2) }}
                     onClick={() => setSelectedThemeId(theme.theme_id)}
                     className={`cursor-pointer transition-all duration-500 rounded-2xl p-2 ${
                       selectedThemeId === theme.theme_id 
                         ? 'bg-gold/20 shadow-[0_0_40px_rgba(201,168,76,0.3)] scale-[1.02] border border-gold/50' 
                         : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-gold/30 hover:scale-[1.01]'
                     }`}
                   >
                      <div className="flex justify-between items-center px-4 pt-2 pb-4">
                        <div>
                          <div className="text-[10px] text-gold uppercase tracking-[0.2em] font-bold">{theme.mood}</div>
                          <div className="font-display text-xl text-ivory mt-1">{theme.theme_name}</div>
                        </div>
                        {selectedThemeId === theme.theme_id && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-gold text-ink rounded-full p-1 shadow-sm">
                            <CheckCircle2 size={16} />
                          </motion.div>
                        )}
                      </div>
                      
                      {/* The Actual Magical Component */}
                      <DynamicTemplate 
                        theme={theme} 
                        data={{
                          coupleNames: formData.couple_names,
                          date: formData.event_date,
                          venue: formData.venue_name,
                          ceremonyType: 'Wedding'
                        }} 
                      />
                   </motion.div>
                 ))}
               </div>

               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 1 }}
                 className="mt-16 flex justify-center"
               >
                 <button 
                   disabled={!selectedThemeId}
                   onClick={() => {
                      const selectedTheme = generatedThemes.find(t => t.theme_id === selectedThemeId);
                      if (selectedTheme) {
                        sessionStorage.setItem('weddwise_magic_theme', JSON.stringify(selectedTheme));
                        sessionStorage.setItem('weddwise_magic_data', JSON.stringify(formData));
                        window.location.href = '/admin/events/new?mode=magic';
                      }
                   }}
                   className="bg-ivory text-[#0F0C07] disabled:opacity-30 disabled:cursor-not-allowed font-bold uppercase tracking-widest text-[12px] px-10 py-5 rounded-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.02] transition-all flex justify-center items-center gap-2 group"
                 >
                   Continue with Selected Design <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                 </button>
               </motion.div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
}
