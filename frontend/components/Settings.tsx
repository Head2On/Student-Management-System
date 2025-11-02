'use client';
import React, { useState, ChangeEvent, useEffect } from 'react';
import { motion,AnimatePresence, Variants } from 'framer-motion';
import { 
  Settings, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Moon,
  Save, 
  Sun, 
  Bell, 
  BellOff,
  Check
} from 'lucide-react';
import { useTheme } from 'next-themes';

// Props for ToggleSwitch
interface ToggleSwitchProps {
    enabled: boolean;
    onToggle: () => void;
    label: string;
    icon: React.ElementType;
    delay?: number;
}

// Toggle Switch Component
const ToggleSwitch = ({ enabled, onToggle, label, icon: Icon, delay = 0 }: ToggleSwitchProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="flex items-center justify-between p-4 bg-white rounded-xl border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${enabled ? 'bg-blue-500/20 text-blue-500' : 'bg-gray-500/20 text-gray-400'} transition-all duration-300`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="font-medium text-gray-800 dark:text-gray-200">{label}</span>
      </div>
      
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
          enabled ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gray-400 dark:bg-gray-700'
        }`}
      >
        <motion.div
          initial={false}
          animate={{ x: enabled ? 24 : 2 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
        />
      </motion.button>
    </motion.div>
  );
};

// ... Your InputField component can remain the same ...
interface InputFieldProps {
    label: string;
    type: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    icon: React.ElementType;
    delay?: number;
    showPasswordToggle?: boolean;
    onTogglePassword?: () => void;
}
const InputField = ({ label, type, value, onChange, placeholder, icon: Icon, delay = 0, showPasswordToggle = false, onTogglePassword }: InputFieldProps) => {
    return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="space-y-2"
    >
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-12 py-3 bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
          >
            {type === 'password' ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
          </button>
        )}
      </div>
    </motion.div>
  );
};


// Main Settings Component
const SettingsPage = () => {
  const { theme, setTheme } = useTheme(); 
  const [isMounted, setIsMounted] = useState(false);
  const [accountSettings, setAccountSettings] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    password: '••••••••'
  });
  const [showPassword, setShowPassword] = useState(false);
  const userIds: (1|2)[] = [1, 2];
  const [currentUser, setCurrentUser] = useState<1 | 2>(1);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Dark mode is now fully handled by useTheme, so it's removed from local state.
  const [preferences, setPreferences] = useState({
    1: { notifications: false }, // User 1
    2: { notifications: true }   // User 2
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const currentPrefs = preferences[currentUser];

  const handleInputChange = (field:'fullName'| 'email' |'password',value:string) => {
    setAccountSettings(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceToggle = (setting: 'notifications') => {
    setPreferences(prev => ({
      ...prev,
      [currentUser]: { ...prev[currentUser], [setting]: !prev[currentUser][setting] }
    }));
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  if (!isMounted) {
    return null;
  }

  const containerVariants: Variants = { /* ... No changes needed ... */ };
  const sectionVariants: Variants = { /* ... No changes needed ... */ };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-900/40 dark:to-gray-900 p-6 lg:p-12 transition-colors duration-500">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Manage your account and preferences
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex justify-center gap-4 mb-8">
          {userIds.map(userNum => (
            <button
              key={userNum}
              onClick={() => setCurrentUser(userNum)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                currentUser === userNum
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white/30 dark:bg-black/20 text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-black/30'
              }`}
            >
              User {userNum} Demo
            </button>
          ))}
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <motion.div variants={sectionVariants} exit="exit" className="backdrop-blur-md bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Account Settings</h2>
            </div>
            <div className="space-y-6">
              <InputField label="Full Name" type="text" value={accountSettings.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} placeholder="Enter your full name" icon={User} delay={0.3} />
              <InputField label="Email Address" type="email" value={accountSettings.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="Enter your email" icon={Mail} delay={0.4}/>
              <InputField label="Password" type={showPassword ? 'text' : 'password'} value={accountSettings.password} onChange={(e) => handleInputChange('password', e.target.value)} placeholder="Enter your password" icon={Lock} delay={0.5} showPasswordToggle={true} onTogglePassword={() => setShowPassword(!showPassword)} />
              <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                    isSaving 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : saveSuccess
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl'
                  }`}
                >
              <AnimatePresence mode="wait">
                {isSaving ? (
                  <motion.div
                    key="saving"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </motion.div>
                ) : saveSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Saved Successfully!
                  </motion.div>
                ) : (
                  <motion.div
                    key="save"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            </div>
          </motion.div>

          <motion.div variants={sectionVariants} className="backdrop-blur-md bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Settings className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Preferences</h2>
            </div>
            <div className="space-y-4">
              <ToggleSwitch
                enabled={theme === 'dark'}
                onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                label="Dark Mode"
                icon={theme === 'dark' ? Moon : Sun}
                delay={0.3}
              />
              <ToggleSwitch enabled={currentPrefs.notifications} onToggle={() => handlePreferenceToggle('notifications')} label="Email Notifications" icon={currentPrefs.notifications ? Bell : BellOff} delay={0.4} />
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }} className="mt-8 p-4 bg-white/10 dark:bg-black/10 rounded-xl border border-white/20 dark:border-white/10">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Current User Settings</h3>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-400">
                <div className="flex items-center justify-between"><span>User Profile:</span><span className="font-medium">User {currentUser}</span></div>
                <div className="flex items-center justify-between">
                  <span>Dark Mode:</span>
                  <span className={`font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-gray-500'}`}>
                    {theme === 'dark' ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Notifications:</span>
                  <span className={`font-medium ${currentPrefs.notifications ? 'text-emerald-500' : 'text-gray-500'}`}>
                    {currentPrefs.notifications ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
        {/* ... Additional sections can be styled similarly ... */}
      </div>
    </div>
  );
};

export default SettingsPage;