import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { loginWithPassword, sendPasswordReset } from '../lib/appwrite';
import { Loader2, Lock, ArrowRight, AlertCircle, Eye, EyeOff, Mail, CheckCircle } from 'lucide-react';
import MagneticButton from '../components/MagneticButton';

const ADMIN_EMAIL = 'tejakumarsaragadam@gmail.com';

const Login = () => {
  const [step, setStep] = useState('login'); // 'login' | 'forgot'
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState(ADMIN_EMAIL);
  const [status, setStatus] = useState('idle'); // idle | loading | error | success
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      await loginWithPassword(email, password);
      navigate('/admin');
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message?.includes('Invalid') ? 'Incorrect email or password.' : 'Login failed. Please try again.');
      setStatus('error');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      await sendPasswordReset(forgotEmail);
      setStatus('success');
    } catch (error) {
      console.error(error);
      setErrorMsg('Could not send reset email. Check email address.');
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
          {/* Header */}
          <div className="flex flex-col items-center justify-center mb-10">
            <div className="w-16 h-16 bg-brand-violet/10 rounded-full flex items-center justify-center mb-6 border border-brand-violet/30">
              {step === 'forgot' ? <Mail className="w-8 h-8 text-brand-orange" /> : <Lock className="w-8 h-8 text-brand-violet" />}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {step === 'forgot' ? 'Reset Password' : 'Admin Portal'}
            </h1>
            <p className="text-gray-400 text-sm text-center">
              {step === 'forgot'
                ? "Enter your email to receive a password reset link."
                : "Restricted access. Authorized personnel only."}
            </p>
          </div>

          {/* Alert */}
          <AnimatePresence mode="wait">
            {status === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400 text-sm mb-6"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {errorMsg}
              </motion.div>
            )}
            {status === 'success' && step === 'forgot' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3 text-green-400 text-sm mb-6"
              >
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                Reset link sent! Check your Gmail inbox.
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {step === 'login' ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleLogin}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
                    required
                    autoComplete="email"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-violet transition-colors"
                    placeholder="admin@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setStatus('idle'); }}
                      required
                      autoComplete="current-password"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-brand-violet transition-colors"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors pointer-events-auto"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <MagneticButton className="w-full">
                    <motion.button
                      type="submit"
                      disabled={status === 'loading'}
                      whileHover={{ scale: 1.03, boxShadow: "0px 0px 25px rgba(139,92,246, 0.6)" }}
                      transition={{ type: "spring", stiffness: 500, damping: 10 }}
                      className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold text-lg py-4 rounded-xl disabled:opacity-50 pointer-events-auto group"
                    >
                      {status === 'loading' ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                        <>
                          <span>Log In</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </motion.button>
                  </MagneticButton>
                </div>

                <div className="text-center pt-2 space-y-3">
                  <button
                    type="button"
                    onClick={() => { setStep('forgot'); setStatus('idle'); setErrorMsg(''); }}
                    className="text-sm text-brand-violet hover:text-white transition-colors pointer-events-auto"
                  >
                    Forgot Password?
                  </button>
                  <br />
                  <a href="/" className="text-xs text-gray-500 hover:text-white transition-colors">← Back to Site</a>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleForgotPassword}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Your Email</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => { setForgotEmail(e.target.value); setStatus('idle'); }}
                    required
                    autoComplete="email"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange transition-colors"
                    placeholder="admin@example.com"
                  />
                </div>

                <div className="pt-2">
                  <MagneticButton className="w-full">
                    <motion.button
                      type="submit"
                      disabled={status === 'loading' || status === 'success'}
                      whileHover={{ scale: 1.03, boxShadow: "0px 0px 25px rgba(249,115,22, 0.6)" }}
                      transition={{ type: "spring", stiffness: 500, damping: 10 }}
                      className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold text-lg py-4 rounded-xl disabled:opacity-50 pointer-events-auto group"
                    >
                      {status === 'loading' ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                        <>
                          <span>Send Reset Link</span>
                          <Mail className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>
                  </MagneticButton>
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setStep('login'); setStatus('idle'); setErrorMsg(''); }}
                    className="text-sm text-brand-violet hover:text-white transition-colors pointer-events-auto"
                  >
                    ← Back to Login
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Login;
