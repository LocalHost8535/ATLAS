
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppStep, UserProfile } from './types';
import SplashScreen from './components/SplashScreen';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import MainDashboard from './components/MainDashboard';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.SPLASH);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: '',
    gender: '',
    email: '',
    phone: '',
    language: 'English',
    favorites: [],
    history: [
      { date: '2023-10-24', route: 'Delhi to Gurgaon', busNumber: 'HR-22C' },
      { date: '2023-10-22', route: 'Jaipur to Delhi', busNumber: 'RJ-14X' }
    ]
  });

  useEffect(() => {
    if (step === AppStep.SPLASH) {
      const timer = setTimeout(() => setStep(AppStep.LOGIN), 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleLogin = (data: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...data }));
    setStep(AppStep.PROFILE);
  };

  const handleProfileComplete = (data: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...data }));
    setStep(AppStep.MAIN);
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={`relative h-screen w-full overflow-hidden transition-colors duration-500 ${isDarkMode ? 'dark bg-[#0a0a0a]' : 'bg-slate-50'}`}>
      <AnimatePresence mode="wait">
        {step === AppStep.SPLASH && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ y: -1000, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="absolute inset-0 z-50"
          >
            <SplashScreen />
          </motion.div>
        )}

        {step === AppStep.LOGIN && (
          <motion.div
            key="login"
            initial={{ y: 1000 }}
            animate={{ y: 0 }}
            exit={{ x: -1000 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="absolute inset-0"
          >
            <LoginPage onNext={handleLogin} />
          </motion.div>
        )}

        {step === AppStep.PROFILE && (
          <motion.div
            key="profile"
            initial={{ x: 1000 }}
            animate={{ x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="absolute inset-0"
          >
            <ProfilePage onNext={handleProfileComplete} />
          </motion.div>
        )}

        {step === AppStep.MAIN && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0"
          >
            <MainDashboard user={profile} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
