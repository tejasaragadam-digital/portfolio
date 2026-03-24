import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { confirmPasswordReset } from '../lib/appwrite';
import { Loader2, Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const secret = searchParams.get('secret');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setErrorMsg("Passwords don't match.");
      setStatus('error');
      return;
    }
    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      setStatus('error');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    try {
      await confirmPasswordReset(userId, secret, password);
      setStatus('success');
      setTimeout(() => navigate('/login'), 2500);
    } catch (error) {
      console.error(error);
      setErrorMsg('Reset link expired or invalid. Request a new one.');
      setStatus('error');
    }
  };

  if (!userId || !secret) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center text-white px-6">
        <div className="glass rounded-3xl p-10 border border-red-500/30 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Invalid Reset Link</h2>
          <p className="text-gray-400 mb-6">This link is expired or invalid. Request a new password reset.</p>
          <a href="/login" className="text-brand-violet hover:text-white transition-colors">← Back to Login</a>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen w-full bg-brand-black flex items-center justify-center relative overflow-hidden px-6">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-violet/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-orange/20 rounded-full blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10 glass rounded-3xl p-10 border border-white/10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-brand-violet/10 rounded-full flex items-center justify-center mb-6 border border-brand-violet/30">
            {status === 'success' ? <CheckCircle className="w-8 h-8 text-green-400" /> : <Lock className="w-8 h-8 text-brand-violet" />}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Set New Password</h1>
          <p className="text-gray-400 text-sm text-center">
            {status === 'success' ? 'Password updated! Redirecting to login...' : 'Choose a strong password for your admin account.'}
          </p>
        </div>

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400 text-sm mb-6"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {errorMsg}
          </motion.div>
        )}

        {status !== 'success' && (
          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setStatus('idle'); }}
                  required
                  minLength={8}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-brand-violet transition-colors"
                  placeholder="Min 8 characters"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white pointer-events-auto">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Confirm Password</label>
              <input
                type={showPw ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setStatus('idle'); }}
                required
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange transition-colors"
                placeholder="Repeat password"
              />
            </div>

            <motion.button
              type="submit"
              disabled={status === 'loading'}
              whileHover={{ scale: 1.03, boxShadow: "0px 0px 25px rgba(139,92,246, 0.6)" }}
              className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold text-lg py-4 rounded-xl disabled:opacity-50 pointer-events-auto mt-4"
            >
              {status === 'loading' ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Update Password'}
            </motion.button>

            <div className="text-center">
              <a href="/login" className="text-sm text-gray-500 hover:text-white transition-colors">← Back to Login</a>
            </div>
          </form>
        )}
      </motion.div>
    </section>
  );
};

export default ResetPassword;
