import React from 'react';
import { motion } from 'framer-motion';
import { 
  IconBuildingBank, 
  IconCode, 
  IconUsers, 
  IconCheck, 
  IconTrendingUp, 
  IconZap, 
  IconScale, 
  IconSettings 
} from '../constants';

interface LandingHeroProps {
  onGetStarted: () => void;
}

const LandingHero: React.FC<LandingHeroProps> = ({ onGetStarted }) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#050214] overflow-hidden px-6 py-24">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/30 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[140px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} 
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl w-full text-center mb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-7xl md:text-[120px] font-black text-white tracking-tighter leading-[0.85] mb-10 uppercase italic">
            Stop wasting your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-purple-400 to-primary bg-[length:200%_auto] animate-gradient-x">
              Snowflake budget
            </span>
          </h1>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-xl md:text-3xl text-white/60 max-w-4xl mx-auto font-medium leading-tight tracking-tight"
        >
          Your human-in-the-loop AI partner, collaboratively turns expensive queries into 
          <span className="text-white font-bold"> cost-optimized performance queries</span> in seconds.
        </motion.p>
      </div>

      {/* Workflow Diagram */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="relative z-10 w-full max-w-5xl bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[64px] p-12 md:p-24 shadow-2xl"
      >
        {/* Inner Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none rounded-[64px]" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-20">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-white/20" />
            <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em]">
              Collaboration Workflow
            </h2>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-white/20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-center w-full">
            {/* FinOps Team */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex flex-col items-center md:items-end text-center md:text-right space-y-8"
            >
              <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center shadow-2xl group hover:border-primary/50 transition-colors">
                <IconBuildingBank className="w-12 h-12 text-white group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white mb-6 italic tracking-tight">FinOps team</h3>
                <ul className="space-y-4">
                  {[
                    { text: 'Cost visibility', icon: IconTrendingUp },
                    { text: 'Budget control', icon: IconCheck },
                    { text: 'Credit forecasts', icon: IconZap }
                  ].map((item, i) => (
                    <motion.li 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + (i * 0.1) }}
                      className="flex items-center md:justify-end gap-4 text-white/50 text-sm font-bold group cursor-default"
                    >
                      <span className="group-hover:text-white transition-colors">{item.text}</span>
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                        <IconCheck className="w-3.5 h-3.5 text-primary" />
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Center Icon */}
            <div className="flex justify-center relative py-12 md:py-0">
              {/* Animated Beams */}
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -translate-y-1/2 hidden md:block overflow-hidden">
                <motion.div 
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-1/3 h-full bg-gradient-to-r from-transparent via-primary to-transparent"
                />
              </div>
              
              <motion.div 
                animate={{ 
                  y: [0, -15, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="w-40 h-40 rounded-[48px] bg-white flex items-center justify-center shadow-[0_0_80px_rgba(105,50,213,0.3)] relative z-10 group"
              >
                <IconUsers className="w-20 h-20 text-primary group-hover:scale-110 transition-transform" />
                {/* Orbital Rings */}
                <div className="absolute inset-[-20px] border border-white/10 rounded-[60px] animate-spin-slow" />
                <div className="absolute inset-[-40px] border border-white/5 rounded-[80px] animate-reverse-spin-slow" />
              </motion.div>
            </div>

            {/* Data Engineers */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex flex-col items-center md:items-start text-center md:text-left space-y-8"
            >
              <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center shadow-2xl group hover:border-emerald-500/50 transition-colors cursor-pointer">
                <IconCode className="w-12 h-12 text-white group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white mb-6 italic tracking-tight">Data engineers</h3>
                <ul className="space-y-4">
                  {[
                    { text: 'Query speed', icon: IconZap },
                    { text: 'Auto-scaling', icon: IconScale },
                    { text: 'Warehouse tuning', icon: IconSettings }
                  ].map((item, i) => (
                    <motion.li 
                      key={i} 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + (i * 0.1) }}
                      className="flex items-center gap-4 text-white/50 text-sm font-bold group cursor-default hover:text-white transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/30 group-hover:border-emerald-500/50 transition-all">
                        <IconCheck className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <span>{item.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Bottom Button */}
          <motion.button 
            onClick={onGetStarted}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="mt-24 px-12 py-5 bg-white rounded-full text-primary text-sm font-black uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(105,50,213,0.4)] transition-all relative overflow-hidden group"
          >
            <span className="relative z-10">Cost + Performance</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </motion.button>
        </div>
      </motion.div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#FDFCFE] to-transparent z-20" />
    </div>
  );
};

export default LandingHero;
