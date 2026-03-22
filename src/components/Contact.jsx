import { useState } from 'react';
import { motion } from 'framer-motion';
import { submitContactForm } from '../lib/appwrite';
import { Send, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import MagneticButton from './MagneticButton';
import GlitchText from './GlitchText';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      await submitContactForm(formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 relative w-full bg-brand-black text-white z-10">
      <div className="max-w-4xl mx-auto">
        <motion.div animate={{ y: [15, -15, 15] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass rounded-[2.5rem] p-8 md:p-14 border border-brand-violet/20"
          >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <GlitchText text="Start a" /> <span className="text-brand-orange"><GlitchText text="Project" /></span>
            </h2>
            <p className="text-gray-400">
              Let's craft something amazing together. Reach out and I'll get back to you within 24 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Your Name</label>
                <input 
                  type="text" 
                  name={`rnd_name_${Math.random()}`}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  autoComplete="new-password"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                <input 
                  type="text" 
                  name={`rnd_email_${Math.random()}`}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  autoComplete="new-password"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Message</label>
              <textarea 
                name={`rnd_msg_${Math.random()}`}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
                rows={5}
                autoComplete="new-password"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet transition-all resize-none"
                placeholder="Tell me about your project..."
              />
            </div>

            <MagneticButton className="w-full">
              <motion.button
                type="submit"
                disabled={status === 'loading'}
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 25px rgba(249,115,22, 0.8)", backgroundColor: "#f97316", color: "#ffffff" }}
                transition={{ type: "spring", stiffness: 500, damping: 10 }}
                className="w-full flex items-center justify-center space-x-2 bg-white text-black font-bold text-lg py-5 rounded-2xl disabled:opacity-50 transition-colors pointer-events-auto group"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : status === 'success' ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span>Message Sent</span>
                  </>
                ) : status === 'error' ? (
                  <>
                    <XCircle className="w-6 h-6 text-red-500" />
                    <span>Error Sending</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </MagneticButton>
          </form>
        </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
