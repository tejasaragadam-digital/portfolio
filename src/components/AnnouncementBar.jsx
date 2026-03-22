import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { X, Megaphone } from 'lucide-react';
import { fetchCollection } from '../lib/appwrite';

const AnnouncementBar = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const colId = import.meta.env.VITE_APPWRITE_ANNOUNCEMENTS_COLLECTION_ID;
      if (!colId) return;
      try {
        const docs = await fetchCollection(colId);
        if (!docs || docs.length === 0) return;

        const now = new Date();
        // Find the most recent announcement that hasn't expired
        const active = docs.find(doc => {
          if (!doc.message) return false;
          if (!doc.expires_at) return true; // no expiry = always show
          return new Date(doc.expires_at) > now;
        });
        setAnnouncement(active || null);
      } catch (e) {
        console.warn('Could not load announcements');
      }
    };
    load();
  }, []);

  const handleLinkClick = (e, link) => {
    if (!link) return;
    // Handle internal anchor links like /#contact
    if (link.startsWith('/#')) {
      e.preventDefault();
      navigate('/');
      setTimeout(() => {
        const id = link.replace('/#', '');
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
    // External and normal route links are handled natively by the <a> tag
  };

  const colorMap = {
    violet: 'from-brand-violet/90 to-purple-700/90',
    orange: 'from-brand-orange/90 to-red-600/90',
    blue: 'from-blue-600/90 to-cyan-600/90',
    green: 'from-emerald-600/90 to-teal-600/90',
    default: 'from-brand-violet/90 to-brand-orange/90',
  };

  if (!announcement || dismissed) return null;

  const gradient = colorMap[announcement.bg_color] || colorMap.default;
  const isExternal = announcement.link?.startsWith('http');
  const isAnchor = announcement.link?.startsWith('/#');
  const isInternal = announcement.link && !isExternal && !isAnchor;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`relative z-[60] w-full bg-gradient-to-r ${gradient} backdrop-blur-md overflow-hidden`}
      >
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-center gap-3 text-white text-sm">
          <Megaphone className="w-4 h-4 shrink-0 opacity-80" />
          <p className="text-center font-medium">{announcement.message}</p>

          {/* CTA Link */}
          {announcement.link && (
            isExternal ? (
              <a
                href={announcement.link}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 font-bold text-xs transition-colors border border-white/30"
              >
                {announcement.link_text || 'Learn More →'}
              </a>
            ) : isAnchor ? (
              <button
                onClick={(e) => handleLinkClick(e, announcement.link)}
                className="shrink-0 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 font-bold text-xs transition-colors border border-white/30 cursor-pointer"
              >
                {announcement.link_text || 'View →'}
              </button>
            ) : (
              <Link
                to={announcement.link}
                className="shrink-0 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 font-bold text-xs transition-colors border border-white/30"
              >
                {announcement.link_text || 'View →'}
              </Link>
            )
          )}

          {/* Dismiss */}
          <button
            onClick={() => setDismissed(true)}
            className="absolute right-4 text-white/60 hover:text-white transition-colors cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnnouncementBar;
