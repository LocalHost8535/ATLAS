
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

const SplashScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#f8fafc] text-slate-800">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mb-6"
      >
        <div className="bg-white p-8 rounded-full shadow-lg border border-slate-100 flex items-center justify-center">
          <ShieldAlert size={64} className="text-emerald-500" strokeWidth={1.5} />
        </div>
      </motion.div>
      <motion.h1
        initial={{ letterSpacing: '0px', opacity: 0 }}
        animate={{ letterSpacing: '8px', opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="text-5xl font-extrabold tracking-[0.2em] uppercase"
      >
        ATLAS
      </motion.h1>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="h-1 w-32 bg-emerald-500 mt-4"
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1 }}
        className="mt-6 text-sm font-medium uppercase tracking-widest text-slate-400"
      >
        Transit Reimagined
      </motion.p>
    </div>
  );
};

export default SplashScreen;
