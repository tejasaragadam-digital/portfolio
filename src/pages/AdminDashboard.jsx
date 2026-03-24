import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { logoutAdmin, fetchCollection, createDoc, updateDoc, deleteDoc, uploadFile, createReplyDoc } from '../lib/appwrite';
import { LogOut, Settings, PenTool, Code, Target, Plus, Trash2, Edit2, Briefcase, Clock, MessageSquare, Save, X, FileUp, Loader2, Mail, Archive, Inbox, MailOpen, User, Megaphone, RefreshCw, ChevronUp, ChevronDown, Send, Download } from 'lucide-react';
import MagneticButton from '../components/MagneticButton';
import LiveAnalytics from '../components/LiveAnalytics';

const SCHEMAS = {
  services: [
    { key: 'title', label: 'Service Title', type: 'text' },
    { key: 'price', label: 'Pricing text', type: 'text' },
    { key: 'desc', label: 'Description', type: 'textarea' }
  ],
  experience: [
    { key: 'role', label: 'Role / Position', type: 'text' },
    { key: 'company', label: 'Company Name', type: 'text' },
    { key: 'period', label: 'Time Period (ex: 2023 - Present)', type: 'text' },
    { key: 'description', label: 'Job Description', type: 'textarea' }
  ],
  reviews: [
    { key: 'name', label: 'Client Name', type: 'text' },
    { key: 'role', label: 'Client Role/Company', type: 'text' },
    { key: 'content', label: 'Testimonial Review', type: 'textarea' }
  ],
  blogs: [
    { key: 'title', label: 'Blog Title', type: 'text' },
    { key: 'excerpt', label: 'Short Excerpt', type: 'textarea' },
    { key: 'content', label: 'Full Markdown Content', type: 'textarea' },
    { key: 'readTime', label: 'Read Time (ex: 5 min)', type: 'text' }
  ],
  web: [
    { key: 'title', label: 'Project Name', type: 'text' },
    { key: 'category', label: 'Category (ex: Fullstack)', type: 'text' },
    { key: 'link', label: 'Live Link', type: 'text' },
    { key: 'imageId', label: 'Cover Image', type: 'file', accept: 'image/*' }
  ],
  marketing: [
    { key: 'title', label: 'Campaign Title', type: 'text' },
    { key: 'metric', label: 'Core Metric Highlight', type: 'text' },
    { key: 'desc', label: 'Description', type: 'textarea' },
    { key: 'link', label: 'External Link (Optional)', type: 'text' },
    { key: 'pdf_id', label: 'Attach PDF Case Study', type: 'file', accept: '.pdf' }
  ],
  announcements: [
    { key: 'message', label: 'Announcement Text', type: 'textarea' },
    { key: 'expires_at', label: 'Expiry Date & Time', type: 'datetime' },
    { key: 'bg_color', label: 'Bar Color Theme', type: 'select', options: [
      { value: 'default', label: '🌈 Violet → Orange (Default)' },
      { value: 'violet', label: '💜 Violet' },
      { value: 'orange', label: '🟠 Orange' },
      { value: 'blue', label: '🔵 Blue' },
      { value: 'green', label: '🟢 Green' },
    ]},
    { key: 'link', label: 'Link (optional)', type: 'link-select' },
    { key: 'link_text', label: 'Link Button Label (e.g. "View Now →")', type: 'text' },
  ],
  general: [
    { key: 'name', label: 'Display Name (optional)', type: 'text' },
    { key: 'avatar_id', label: 'Profile Avatar Image', type: 'file', accept: 'image/*' },
    { key: 'resume_id', label: 'Resume / CV (PDF)', type: 'file', accept: '.pdf' },
    { key: 'linkedin', label: 'LinkedIn Profile URL', type: 'text' },
    { key: 'instagram', label: 'Instagram Profile URL', type: 'text' }
  ]
};

const getCollectionId = (tab) => {
    const envMap = {
       leads: import.meta.env.VITE_APPWRITE_LEADS_COLLECTION_ID,
       announcements: import.meta.env.VITE_APPWRITE_ANNOUNCEMENTS_COLLECTION_ID,
       services: import.meta.env.VITE_APPWRITE_SERVICES_COLLECTION_ID,
       experience: import.meta.env.VITE_APPWRITE_EXPERIENCE_COLLECTION_ID,
       reviews: import.meta.env.VITE_APPWRITE_REVIEWS_COLLECTION_ID,
       blogs: import.meta.env.VITE_APPWRITE_BLOGS_COLLECTION_ID,
       web: import.meta.env.VITE_APPWRITE_WEB_PROJECTS_COLLECTION_ID,
       marketing: import.meta.env.VITE_APPWRITE_MARKETING_PROJECTS_COLLECTION_ID,
       general: import.meta.env.VITE_APPWRITE_PROFILE_COLLECTION_ID
    };
    return envMap[tab];
 };

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('leads');
  
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [formData, setFormData] = useState({});
  const [fileData, setFileData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [archivedIds, setArchivedIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('archived_leads') || '[]')); } 
    catch { return new Set(); }
  });
  const [inboxFilter, setInboxFilter] = useState('all');

  // Profile-specific state for General Settings
  const [profileRecord, setProfileRecord] = useState(null);
  const [profileSaving, setProfileSaving] = useState({});
  const [profileEditing, setProfileEditing] = useState({});
  const [profileFile, setProfileFile] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null); // lead record being replied to
  const [replyMsg, setReplyMsg] = useState('');
  const [replySending, setReplySending] = useState(false);

  const loadProfile = async () => {
    const colId = import.meta.env.VITE_APPWRITE_PROFILE_COLLECTION_ID;
    if (!colId) return;
    const data = await fetchCollection(colId);
    setProfileRecord(data && data.length > 0 ? data[0] : null);
  };

  const handleProfileSaveField = async (fieldKey) => {
    setProfileSaving(p => ({ ...p, [fieldKey]: true }));
    try {
      const colId = import.meta.env.VITE_APPWRITE_PROFILE_COLLECTION_ID;
      let value = profileEditing[fieldKey] ?? (profileRecord ? profileRecord[fieldKey] : '');
      
      if (fieldKey === 'avatar_id' && profileFile?.key === 'avatar_id' && profileFile.file) {
        const uploaded = await uploadFile(import.meta.env.VITE_APPWRITE_GENERAL_BUCKET_ID, profileFile.file);
        value = uploaded.$id;
        setProfileFile(null);
      } else if (fieldKey === 'resume_id' && profileFile?.key === 'resume_id' && profileFile.file) {
        const uploaded = await uploadFile(import.meta.env.VITE_APPWRITE_PDF_BUCKET_ID, profileFile.file);
        value = uploaded.$id;
        setProfileFile(null);
      }

      const payload = { [fieldKey]: value };
      if (profileRecord) {
        await updateDoc(colId, profileRecord.$id, payload);
      } else {
        await createDoc(colId, payload);
      }
      await loadProfile();
      setProfileEditing(p => { const n = { ...p }; delete n[fieldKey]; return n; });
    } catch (e) {
      console.error('Profile save failed:', e);
      alert('Failed to save.');
    } finally {
      setProfileSaving(p => ({ ...p, [fieldKey]: false }));
    }
  };

  const handleProfileClearField = async (fieldKey) => {
    if (!profileRecord) return;
    if (!window.confirm(`Clear the ${fieldKey} field?`)) return;
    setProfileSaving(p => ({ ...p, [fieldKey]: true }));
    try {
      await updateDoc(import.meta.env.VITE_APPWRITE_PROFILE_COLLECTION_ID, profileRecord.$id, { [fieldKey]: null });
      await loadProfile();
    } catch (e) { console.error(e); }
    finally { setProfileSaving(p => ({ ...p, [fieldKey]: false })); }
  };

  useEffect(() => {
    if (activeTab === 'general') {
      loadProfile();
    } else {
      loadData();
    }
    setIsEditing(false);
    setEditingRecordId(null);
    setFormData({});
    setFileData(null);
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    const colId = getCollectionId(activeTab);
    if (!colId || colId.includes('PENDING')) {
        setRecords([]);
        setLoading(false);
        return;
    }
    const data = await fetchCollection(colId);
    setRecords(data || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/login');
  };

  const handleRefresh = () => {
    if (activeTab === 'general') loadProfile();
    else loadData();
  };

  const handleReorder = async (idx, direction) => {
    const colId = getCollectionId(activeTab);
    if (!colId) return;
    const newRecords = [...records];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= newRecords.length) return;
    // Swap display_order values
    const aOrder = newRecords[idx].display_order ?? idx;
    const bOrder = newRecords[targetIdx].display_order ?? targetIdx;
    try {
      await updateDoc(colId, newRecords[idx].$id, { display_order: bOrder });
      await updateDoc(colId, newRecords[targetIdx].$id, { display_order: aOrder });
      // Swap in local state
      [newRecords[idx], newRecords[targetIdx]] = [newRecords[targetIdx], newRecords[idx]];
      setRecords([...newRecords]);
    } catch (e) { console.error('Reorder failed:', e); }
  };

  const handleSendReply = async () => {
    if (!replyingTo || !replyMsg.trim()) return;
    setReplySending(true);
    try {
      // Save reply to database for history/tracking
      await createReplyDoc(replyingTo.email, replyMsg);
      
      alert(`Reply saved to database for ${replyingTo.email} ✅`);
      setReplyingTo(null);
      setReplyMsg('');
    } catch (e) {
      console.error(e);
      alert('Failed to save reply: ' + (e.text || e.message));
    } finally {
      setReplySending(false);
    }
  };

  const tabs = [
    { id: 'leads', label: 'Leads Inbox', icon: Inbox },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'marketing', label: 'Marketing Projects', icon: Target },
    { id: 'blogs', label: 'Blog Posts', icon: PenTool },
    { id: 'services', label: 'Services & Pricing', icon: Briefcase },
    { id: 'experience', label: 'Experience & Timeline', icon: Clock },
    { id: 'reviews', label: 'Client Testimonials', icon: MessageSquare },
    { id: 'web', label: 'Web Projects', icon: Code },
    { id: 'general', label: 'General Settings', icon: Settings }
  ];

  const handleArchive = (id) => {
    setArchivedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      localStorage.setItem('archived_leads', JSON.stringify([...next]));
      return next;
    });
  };

  const handleInputChange = (e, field) => {
      if (field.type === 'file') {
          setFileData({ key: field.key, file: e.target.files[0] });
      } else {
          setFormData({ ...formData, [field.key]: e.target.value });
      }
  };

  const handleSave = async (e) => {
      e.preventDefault();
      setSaving(true);
      try {
          let finalData = { ...formData };
          
          // Execute Storage Upload sequentially safely before Database creation mapping limits
          if (fileData && fileData.file) {
              const bucketId = activeTab === 'marketing' 
                  ? import.meta.env.VITE_APPWRITE_PDF_BUCKET_ID 
                  : import.meta.env.VITE_APPWRITE_GENERAL_BUCKET_ID;
              
              const uploadedFile = await uploadFile(bucketId, fileData.file);
              finalData[fileData.key] = uploadedFile.$id;
          }

          if (editingRecordId) {
              await updateDoc(getCollectionId(activeTab), editingRecordId, finalData);
          } else {
              await createDoc(getCollectionId(activeTab), finalData);
          }

          await loadData();
          setIsEditing(false);
          setEditingRecordId(null);
          setFormData({});
          setFileData(null);
      } catch (error) {
          console.error("Save failed:", error);
          alert("Failed to save record.");
      } finally {
          setSaving(false);
      }
  };

  const handleDelete = async (docId) => {
      if (!window.confirm("Are you sure you want to delete this record entirely?")) return;
      try {
          await deleteDoc(getCollectionId(activeTab), docId);
          await loadData();
      } catch (error) {
          console.error("Delete failed:", error);
          alert("Failed to delete.");
      }
  };

  const handleEdit = (rec) => {
      const dataToEdit = { ...rec };
      delete dataToEdit.$id;
      delete dataToEdit.$createdAt;
      delete dataToEdit.$updatedAt;
      delete dataToEdit.$permissions;
      delete dataToEdit.$databaseId;
      delete dataToEdit.$collectionId;
      
      setFormData(dataToEdit);
      setEditingRecordId(rec.$id);
      setIsEditing(true);
  };

  const currentSchema = SCHEMAS[activeTab];

  return (
    <section className="min-h-screen pt-32 px-6 w-full max-w-7xl mx-auto z-10 relative pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-violet to-brand-orange inline-block">
            Command Center
          </h1>
          <p className="text-gray-400 mt-2">Manage your entire portfolio universe natively securely.</p>
        </div>
        <MagneticButton>
          <motion.button 
            onClick={handleLogout}
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(239,68,68, 0.4)", backgroundColor: "rgba(239,68,68, 0.2)" }}
            transition={{ type: "spring", stiffness: 500, damping: 10 }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-red-500/30 text-red-400 font-semibold transition-colors pointer-events-auto cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </motion.button>
        </MagneticButton>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 space-y-2 pointer-events-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => !isEditing && setActiveTab(tab.id)}
                whileHover={!isEditing ? { x: 5 } : {}}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-brand-violet/20 border border-brand-violet/50 text-brand-violet font-bold' 
                    : isEditing ? 'opacity-30 cursor-not-allowed pointer-events-none' : 'glass hover:bg-white/5 text-gray-400 border border-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-brand-orange' : ''}`} />
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        {/* Console / Editing Window */}
        <div className="flex-1 glass border border-white/10 rounded-3xl p-6 md:p-10 min-h-[600px] pointer-events-auto relative overflow-hidden">
          
          <AnimatePresence mode="wait">
              {/* ---- GENERAL SETTINGS VIEW ---- */}
              {activeTab === 'general' ? (
                  <motion.div key="general" initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20}}>
                      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10 mt-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                          <span className="w-3 h-3 rounded-full bg-brand-orange animate-pulse"></span>
                          General Settings
                        </h2>
                        {!profileRecord && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full border border-yellow-500/30">No profile record yet — enter any field to create one</span>}
                      </div>

                      <div className="space-y-5">
                        {[
                          { key: 'name', label: 'Display Name', icon: User, type: 'text', placeholder: 'e.g. Teja Kumar' },
                          { key: 'linkedin', label: 'LinkedIn URL', icon: () => <span className="text-sm font-bold">in</span>, type: 'text', placeholder: 'https://linkedin.com/in/...' },
                          { key: 'instagram', label: 'Instagram URL', icon: () => <span className="text-sm font-bold">ig</span>, type: 'text', placeholder: 'https://instagram.com/...' },
                          { key: 'avatar_id', label: 'Profile Avatar Image', icon: MailOpen, type: 'file', accept: 'image/*' },
                          { key: 'resume_id', label: 'Resume / CV (PDF)', icon: Download, type: 'file', accept: '.pdf' },
                        ].map(({ key, label, icon: Icon, type, placeholder, accept }) => {
                          const currentVal = profileRecord?.[key];
                          const draftVal = profileEditing[key];
                          const isSaving = !!profileSaving[key];
                          const isDirty = key in profileEditing || (profileFile?.key === key);

                          return (
                            <div key={key} className="p-5 rounded-2xl bg-black/40 border border-white/8 hover:border-white/15 transition-colors">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-brand-violet/20 flex items-center justify-center text-brand-violet">
                                  <Icon className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-sm text-gray-300">{label}</span>
                              </div>

                              {/* Current value display */}
                              {currentVal && key !== 'avatar_id' && key !== 'resume_id' && (
                                <p className="text-xs text-gray-500 mb-2 pl-1 truncate">Current: <span className="text-gray-400">{currentVal}</span></p>
                              )}
                              {currentVal && key === 'avatar_id' && (
                                <div className="mb-3">
                                  <img src={`${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${import.meta.env.VITE_APPWRITE_GENERAL_BUCKET_ID}/files/${currentVal}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`}
                                    alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-brand-violet/30" />
                                </div>
                              )}

                              {/* Edit area */}
                              <div className="flex gap-2 items-center">
                                {type === 'file' ? (
                                  <label className="flex-1 cursor-pointer bg-brand-violet/10 border border-brand-violet/30 rounded-xl px-4 py-3 flex items-center gap-2 hover:bg-brand-violet/20 transition-all">
                                    <FileUp className="w-4 h-4 text-brand-violet" />
                                    <span className="text-sm text-brand-violet truncate">
                                      {profileFile?.key === key ? profileFile.name : (currentVal ? `Replace ${accept?.includes('pdf') ? 'PDF' : 'image'}...` : `Upload ${accept?.includes('pdf') ? 'PDF' : 'image'}...`)}
                                    </span>
                                    <input type="file" accept={accept || 'image/*'} className="hidden" onChange={e => setProfileFile({ key, file: e.target.files[0], name: e.target.files[0]?.name })} />
                                  </label>
                                ) : (
                                  <input
                                    type="text"
                                    autoComplete="new-password"
                                    placeholder={currentVal || placeholder}
                                    value={draftVal ?? ''}
                                    onChange={e => setProfileEditing(p => ({ ...p, [key]: e.target.value }))}
                                    className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand-violet transition-all pointer-events-auto"
                                  />
                                )}

                                <motion.button
                                  onClick={() => handleProfileSaveField(key)}
                                  disabled={isSaving || (!isDirty)}
                                  whileHover={{ scale: 1.05 }}
                                  className="px-4 py-3 rounded-xl bg-brand-orange text-white text-sm font-bold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                                >
                                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                  Save
                                </motion.button>

                                {currentVal && (
                                  <motion.button
                                    onClick={() => handleProfileClearField(key)}
                                    disabled={isSaving}
                                    whileHover={{ scale: 1.05 }}
                                    title="Clear this field"
                                    className="p-3 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-500 transition-colors cursor-pointer"
                                  >
                                    <X className="w-4 h-4" />
                                  </motion.button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                  </motion.div>
              ) : null}

              {/* ---- LEADS INBOX VIEW ---- */}
              {activeTab === 'leads' && !isEditing ? (
                  <motion.div key="inbox" initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20}}>

                      {/* Inbox Header */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-white/10 gap-4 mt-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                          <span className="w-3 h-3 rounded-full bg-brand-orange animate-pulse"></span>
                          Leads Inbox
                          {records.length > 0 && <span className="text-sm font-normal bg-brand-violet/20 text-brand-violet px-3 py-1 rounded-full border border-brand-violet/30">{records.filter(r => !archivedIds.has(r.$id)).length} active</span>}
                        </h2>
                        {/* Filter Pills */}
                        <div className="flex gap-2 pointer-events-auto">
                          {['all','active','archived'].map(f => (
                            <button key={f} onClick={() => setInboxFilter(f)}
                              className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all cursor-pointer ${inboxFilter === f ? 'bg-brand-violet text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Lead Cards */}
                      <div className="space-y-4">
                        {loading ? (
                          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-violet" /></div>
                        ) : records.length === 0 ? (
                          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
                            <Inbox className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-500">No leads yet. Once visitors fill the contact form, they'll appear here.</p>
                          </div>
                        ) : (
                          records
                            .filter(rec => {
                              if (inboxFilter === 'active') return !archivedIds.has(rec.$id);
                              if (inboxFilter === 'archived') return archivedIds.has(rec.$id);
                              return true;
                            })
                            .map((rec, idx) => {
                              const isArchived = archivedIds.has(rec.$id);
                              const date = new Date(rec.$createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                              return (
                                <motion.div
                                  key={rec.$id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.04 }}
                                  className={`p-6 rounded-2xl border transition-colors ${isArchived ? 'bg-black/20 border-white/5 opacity-60' : 'bg-black/40 border-white/10 hover:border-brand-violet/30'}`}
                                >
                                  <div className="flex flex-col md:flex-row justify-between gap-4">
                                    {/* Lead Info */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-brand-violet/20 border border-brand-violet/30 flex items-center justify-center shrink-0">
                                          <User className="w-5 h-5 text-brand-violet" />
                                        </div>
                                        <div>
                                          <p className="font-bold text-white">{rec.name || 'Anonymous'}</p>
                                          <a href={`mailto:${rec.email}`} className="text-brand-orange text-sm hover:underline flex items-center gap-1">
                                            <Mail className="w-3 h-3" />{rec.email}
                                          </a>
                                        </div>
                                        {isArchived && <span className="ml-auto text-xs bg-gray-700/50 text-gray-400 px-2 py-0.5 rounded-full">Archived</span>}
                                      </div>
                                      <p className="text-gray-300 text-sm leading-relaxed bg-white/5 rounded-xl px-4 py-3 border border-white/5">{rec.message}</p>
                                      <p className="text-xs text-gray-600 mt-2 ml-1">{date}</p>
                                    </div>
                                    {/* Actions */}
                                    <div className="flex md:flex-col gap-2 items-center md:items-end shrink-0">
                                    <motion.button
                                        onClick={() => { setReplyingTo(rec); setReplyMsg(''); }}
                                        whileHover={{ scale: 1.1 }}
                                        title="Reply via Email"
                                        className="p-3 rounded-xl bg-white/5 hover:bg-brand-violet/20 hover:text-brand-violet text-gray-400 transition-colors cursor-pointer"
                                      >
                                        <Send className="w-5 h-5" />
                                      </motion.button>
                                      <motion.button
                                        onClick={() => handleArchive(rec.$id)}
                                        whileHover={{ scale: 1.1 }}
                                        title={isArchived ? 'Unarchive' : 'Archive'}
                                        className={`p-3 rounded-xl transition-colors cursor-pointer ${isArchived ? 'bg-brand-violet/20 text-brand-violet' : 'bg-white/5 hover:bg-brand-violet/20 hover:text-brand-violet text-gray-400'}`}
                                      >
                                        <Archive className="w-5 h-5" />
                                      </motion.button>
                                      <motion.button
                                        onClick={() => handleDelete(rec.$id)}
                                        whileHover={{ scale: 1.1 }}
                                        title="Delete permanently"
                                        className="p-3 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-500 text-gray-400 transition-colors cursor-pointer"
                                      >
                                        <Trash2 className="w-5 h-5" />
                                      </motion.button>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })
                        )}
                      </div>
                  </motion.div>
              ) : !isEditing ? (
                  <motion.div key="list" initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20}}>
                      {!loading && records.length === 0 && <LiveAnalytics />}
                      
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-white/10 gap-4 mt-4">
                        <h2 className="text-2xl font-bold capitalize text-white flex items-center gap-3">
                          <span className="w-3 h-3 rounded-full bg-brand-orange animate-pulse"></span>
                          Manage {activeTab.replace('-', ' ')}
                        </h2>
                        <MagneticButton>
                          <motion.button 
                            onClick={() => setIsEditing(true)}
                            whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(139,92,246, 0.6)" }}
                            transition={{ type: "spring", stiffness: 500, damping: 10 }}
                            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-violet text-white font-bold cursor-pointer"
                          >
                            <Plus className="w-5 h-5" />
                            Add New Record
                          </motion.button>
                        </MagneticButton>
                      </div>

                      <div className="space-y-4">
                        {loading ? (
                            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-violet" /></div>
                        ) : records.length === 0 ? (
                            <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
                                <p className="text-gray-500 mb-2">No records found for {activeTab}.</p>
                                <p className="text-sm text-gray-600">Click Add New Record to execute the first deployment.</p>
                            </div>
                        ) : (
                            records.map((rec, idx) => (
                            <motion.div 
                                key={rec.$id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 rounded-2xl bg-black/40 border border-white/5 hover:border-brand-violet/30 transition-colors gap-4"
                            >
                                <div>
                                <h3 className="font-bold text-lg mb-1">{rec.title || rec.name || rec.role || rec.key || 'Untitled Record'}</h3>
                                <p className="text-sm text-gray-500">ID: {rec.$id} • Created natively tracking cloud bounds</p>
                                </div>
                                <div className="flex items-center gap-2">
                                {activeTab === 'experience' && (
                                  <>
                                    <motion.button onClick={() => handleReorder(idx, 'up')} disabled={idx === 0} whileHover={{ scale: 1.1 }}
                                      className="p-2 rounded-xl bg-white/5 hover:bg-brand-violet/20 hover:text-brand-violet text-gray-400 transition-colors cursor-pointer disabled:opacity-20">
                                      <ChevronUp className="w-4 h-4" />
                                    </motion.button>
                                    <motion.button onClick={() => handleReorder(idx, 'down')} disabled={idx === records.length - 1} whileHover={{ scale: 1.1 }}
                                      className="p-2 rounded-xl bg-white/5 hover:bg-brand-violet/20 hover:text-brand-violet text-gray-400 transition-colors cursor-pointer disabled:opacity-20">
                                      <ChevronDown className="w-4 h-4" />
                                    </motion.button>
                                  </>
                                )}
                                <motion.button 
                                    onClick={() => handleEdit(rec)}
                                    whileHover={{ scale: 1.1 }} 
                                    className="p-3 rounded-xl bg-white/5 hover:bg-brand-orange/20 hover:text-brand-orange transition-colors cursor-pointer"
                                >
                                    <Edit2 className="w-5 h-5" />
                                </motion.button>
                                <motion.button 
                                    onClick={() => handleDelete(rec.$id)}
                                    whileHover={{ scale: 1.1 }} 
                                    className="p-3 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-500 transition-colors cursor-pointer"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </motion.button>
                                </div>
                            </motion.div>
                            ))
                        )}
                      </div>
                  </motion.div>
              ) : (
                  <motion.div key="form" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}}>
                      <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/10">
                        <h2 className="text-2xl font-bold capitalize text-white flex items-center gap-2">
                          <Edit2 className="w-6 h-6 text-brand-orange" />
                          {editingRecordId ? 'Editing Record' : `Creating New ${activeTab.replace('-', ' ')}`}
                        </h2>
                        <button 
                            onClick={() => { setIsEditing(false); setEditingRecordId(null); }}
                            className="text-gray-400 hover:text-white transition-colors cursor-pointer p-2 bg-white/5 rounded-full"
                        >
                            <X className="w-6 h-6" />
                        </button>
                      </div>

                      <form onSubmit={handleSave} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {currentSchema.map((field, idx) => (
                                  <div key={idx} className={`space-y-2 ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}>
                                    <label className="text-sm font-bold text-gray-300 ml-1">{field.label}</label>
                                    
                                    {field.type === 'textarea' ? (
                                        <textarea 
                                            required
                                            rows={5}
                                            name={`admin_txt_${Math.random()}`}
                                            autoComplete="new-password"
                                            value={formData[field.key] || ''}
                                            onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                                            className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet transition-all resize-none pointer-events-auto"
                                            placeholder={`Input dynamic ${field.label}...`}
                                        />
                                    ) : field.type === 'file' ? (
                                        <div className="relative pointer-events-auto">
                                            <input 
                                                type="file"
                                                accept={field.accept}
                                                onChange={(e) => handleInputChange(e, field)}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <div className="w-full bg-brand-violet/10 border border-brand-violet/30 rounded-2xl px-5 py-6 flex flex-col items-center justify-center text-brand-violet hover:bg-brand-violet/20 transition-all cursor-pointer">
                                                <FileUp className="w-8 h-8 mb-2" />
                                                <span className="font-bold">
                                                    {fileData && fileData.key === field.key && fileData.file ? fileData.file.name : `Select or Drag & Drop ${field.accept} here`}
                                                </span>
                                            </div>
                                        </div>
                                    ) : field.type === 'datetime' ? (
                                        <input
                                            type="datetime-local"
                                            value={formData[field.key] || ''}
                                            onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                                            className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet transition-all pointer-events-auto [color-scheme:dark]"
                                        />
                                    ) : field.type === 'select' ? (
                                        <select
                                            value={formData[field.key] || ''}
                                            onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                                            className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet transition-all pointer-events-auto cursor-pointer"
                                        >
                                            <option value="">Select...</option>
                                            {field.options?.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    ) : field.type === 'link-select' ? (
                                        <div className="space-y-2 md:col-span-2">
                                          <select
                                            value={formData[field.key]?.startsWith('http') ? '__custom__' : (formData[field.key] || '')}
                                            onChange={(e) => {
                                              if (e.target.value === '__custom__') {
                                                setFormData({...formData, [field.key]: 'https://'});
                                              } else {
                                                setFormData({...formData, [field.key]: e.target.value});
                                              }
                                            }}
                                            className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet transition-all pointer-events-auto cursor-pointer"
                                          >
                                            <option value="">No link</option>
                                            <optgroup label="Homepage Sections">
                                              <option value="/#contact">Contact Form</option>
                                              <option value="/#home">Hero / Top</option>
                                            </optgroup>
                                            <optgroup label="Pages">
                                              <option value="/blog">Blog</option>
                                              <option value="/services">Services</option>
                                              <option value="/web-projects">Web Projects</option>
                                              <option value="/marketing-projects">Marketing Projects</option>
                                            </optgroup>
                                            <option value="__custom__">Custom URL...</option>
                                          </select>
                                          {(formData[field.key]?.startsWith('http') || formData[field.key]?.startsWith('__custom__')) && (
                                            <input
                                              type="text"
                                              autoComplete="new-password"
                                              value={formData[field.key] === '__custom__' ? '' : (formData[field.key] || '')}
                                              onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                                              placeholder="https://..."
                                              className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all pointer-events-auto"
                                            />
                                          )}
                                        </div>
                                    ) : (
                                        <input 
                                            type="text"
                                            required
                                            name={`admin_inp_${Math.random()}`}
                                            autoComplete="new-password"
                                            value={formData[field.key] || ''}
                                            onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                                            className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet transition-all pointer-events-auto"
                                            placeholder={`Input dynamic ${field.label}...`}
                                        />
                                    )}
                                  </div>
                              ))}
                          </div>

                          <div className="pt-6 border-t border-white/10 flex justify-end gap-4 pointer-events-auto">
                              <button 
                                type="button" 
                                onClick={() => { setIsEditing(false); setEditingRecordId(null); }}
                                className="px-6 py-4 rounded-xl font-bold text-gray-400 hover:text-white transition-colors"
                              >
                                  Cancel
                              </button>
                              <MagneticButton>
                                  <motion.button
                                      type="submit"
                                      disabled={saving}
                                      whileHover={{ scale: 1.05, boxShadow: "0px 0px 25px rgba(249,115,22, 0.6)" }}
                                      className="flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-orange text-white font-bold cursor-pointer disabled:opacity-50"
                                  >
                                      {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                      {saving ? 'Processing Matrix...' : 'Deploy Content'}
                                  </motion.button>
                              </MagneticButton>
                          </div>
                      </form>
                  </motion.div>
              )}
          </AnimatePresence>

        </div>
      </div>

      {/* Reply Modal */}
      <AnimatePresence>
        {replyingTo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4"
            onClick={(e) => e.target === e.currentTarget && setReplyingTo(null)}
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              className="glass rounded-3xl p-8 border border-brand-violet/30 w-full max-w-lg"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Send className="w-5 h-5 text-brand-violet" />
                  Reply to {replyingTo.name}
                </h3>
                <button onClick={() => setReplyingTo(null)} className="text-gray-400 hover:text-white p-1 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-400 mb-1">To: <span className="text-brand-orange">{replyingTo.email}</span></p>
              <p className="text-xs text-gray-600 mb-4 italic">Their message: "{replyingTo.message?.slice(0, 80)}{replyingTo.message?.length > 80 ? '...' : ''}"</p>
              <textarea
                value={replyMsg}
                onChange={e => setReplyMsg(e.target.value)}
                rows={5}
                placeholder="Type your reply here..."
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet transition-all resize-none pointer-events-auto mb-4"
              />
              <div className="flex gap-3 justify-end">
                <button onClick={() => setReplyingTo(null)} className="px-5 py-3 rounded-xl text-gray-400 hover:text-white transition-colors cursor-pointer">Cancel</button>
                <motion.button
                  onClick={handleSendReply}
                  disabled={replySending || !replyMsg.trim()}
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-violet text-white font-bold cursor-pointer disabled:opacity-40"
                >
                  {replySending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {replySending ? 'Sending...' : 'Send Reply'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Refresh Button */}
      <div className="flex justify-center mt-8 pb-8">
        <motion.button
          onClick={handleRefresh}
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(139,92,246,0.5)" }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 rounded-full glass border border-white/10 text-gray-400 hover:text-white hover:border-brand-violet/50 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Data
        </motion.button>
      </div>
    </section>
  );
};

export default AdminDashboard;
