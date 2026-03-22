import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { sendOTP, verifyOTP } from '../lib/appwrite';
import { Loader2, Lock, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';
import MagneticButton from '../components/MagneticButton';

const ADMIN_EMAIL = 'tejakumarsaragadam@gmail.com';

const Login = () => {
  const [email, setEmail] = useState('');
  const [secret, setSecret] = useState('');
  const [userId, setUserId] = useState(null);
  const [otpRequested, setOtpRequested] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, loading, error, invalid_email
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      setStatus('invalid_email');
      return;
    }
    
    setStatus('loading');
    try {
      const token = await sendOTP(email);
      setUserId(token.userId);
      setOtpRequested(true);
      setStatus('idle');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      if (!userId) throw new Error("Missing User ID");
      await verifyOTP(userId, secret);
      navigate('/admin');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <section className="min-h-screen w-full bg-brand-black flex items-center justify-center relative overflow-hidden px-6">
      {/* Background Decorators */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-violet/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-orange/20 rounded-full blur-[150px] pointer-events-none" />

      <motion.div 
        animate={{ y: [-15, 15, -15] }} 
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="w-full max-w-md relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-10 border border-white/10"
        >
          <div className="flex flex-col items-center justify-center mb-10">
            <div className="w-16 h-16 bg-brand-violet/10 rounded-full flex items-center justify-center mb-6">
              {otpRequested ? <KeyRound className="w-8 h-8 text-brand-orange" /> : <Lock className="w-8 h-8 text-brand-violet" />}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-gray-400 text-sm text-center">
              {otpRequested ? "Check your email for the 6-digit access code." : "Highly restricted OTP access. Only authorized admins."}
            </p>
          </div>

          <form onSubmit={otpRequested ? handleVerifyOTP : handleRequestOTP} className="space-y-6">
            <AnimatePresence mode="wait">
              {status === 'error' && (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-500 text-sm"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {otpRequested ? "Invalid OTP or code expired." : "Failed to send OTP. Database may be offline."}
                </motion.div>
              )}
              {status === 'invalid_email' && (
                <motion.div 
                  key="invalid"
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-500 text-sm"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  Unauthorized Identity. Access Denied.
                </motion.div>
              )}
            </AnimatePresence>

            {!otpRequested ? (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <label className="block text-sm font-medium text-gray-400 mb-2">Authorized Email</label>
                <input
                  type="text"
                  name={`auth_email_${Math.random()}`}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
                  required
                  autoComplete="new-password"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-violet transition-colors pointer-events-auto"
                  placeholder="admin@tejakumar.com"
                />
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <label className="block text-sm font-medium text-gray-400 mb-2">6-Digit Secret Token</label>
                <input
                  type="text"
                  name={`auth_secret_${Math.random()}`}
                  value={secret}
                  onChange={(e) => { setSecret(e.target.value); setStatus('idle'); }}
                  required
                  maxLength={6}
                  autoComplete="new-password"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-center text-3xl tracking-[1em] text-white placeholder-gray-700 focus:outline-none focus:border-brand-orange transition-colors pointer-events-auto font-mono"
                  placeholder="000000"
                />
              </motion.div>
            )}

            <div className="pt-4">
              <MagneticButton className="w-full">
                <motion.button
                  type="submit"
                  disabled={status === 'loading'}
                  whileHover={{ scale: 1.05, boxShadow: otpRequested ? "0px 0px 25px rgba(249,115,22, 0.6)" : "0px 0px 25px rgba(139,92,246, 0.6)" }}
                  transition={{ type: "spring", stiffness: 500, damping: 10 }}
                  className={`w-full flex items-center justify-center space-x-2 bg-white text-black font-bold text-lg py-4 rounded-xl disabled:opacity-50 pointer-events-auto group ${otpRequested ? 'hover:bg-brand-orange hover:text-white border-transparent' : ''}`}
                >
                  {status === 'loading' ? (
                    <Loader2 className="w-6 h-6 animate-spin text-black" />
                  ) : (
                    <>
                      <span>{otpRequested ? 'Verify Terminal Access' : 'Send OTP Key'}</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </MagneticButton>
            </div>
            
            <div className="text-center mt-4">
               <a href="/" className="text-xs text-gray-500 hover:text-white transition-colors">← Abort Login Sequence</a>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Login;
