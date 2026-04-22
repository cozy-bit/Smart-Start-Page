import { useState, useEffect, useRef } from 'react';
import { useLinkStore, LinkItem } from '../store/useLinkStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, MoreHorizontal, Edit2, Star, Trash2, BarChart2, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { useUIStore } from '../store/useUIStore';
import { useHistoryStore } from '../store/useHistoryStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useTranslation } from '../i18n';

export default function QuickLinks() {
  const { links, addLink, removeLink, incrementClick, togglePin, restoreLink, editLink } = useLinkStore();
  const isModalOpen = useUIStore((s) => s.isAddLinkOpen);
  const setIsModalOpen = useUIStore((s) => s.setAddLinkOpen);
  const [newLink, setNewLink] = useState({ title: '', url: '', group: 'General' });
  const [editLinkId, setEditLinkId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const { addHistory } = useHistoryStore();
  const enableHistory = useSettingsStore((s) => s.enableHistory);
  const enableEcoMode = useSettingsStore((s) => s.enableEcoMode);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const t = useTranslation();
  
  const toggleGroup = (group: string) => {
    setCollapsedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Don't close if clicking right on the trigger
      if ((e.target as Element).closest('[data-context-trigger="true"]')) return;
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };
    if (activeMenuId) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeMenuId]);

  // Split links into pinned and unpinned, and sort by clicks
  const pinnedLinks = [...links].filter(l => l.isPinned).sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
  const unpinnedLinks = [...links].filter(l => !l.isPinned).sort((a, b) => (b.clicks || 0) - (a.clicks || 0));

  const maxClicks = Math.max(1, ...links.map(l => l.clicks || 0));

  const groupedLinks = unpinnedLinks.reduce((acc, link) => {
    if (!acc[link.group]) acc[link.group] = [];
    acc[link.group].push(link);
    return acc;
  }, {} as Record<string, LinkItem[]>);

  const handleAddOrEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLink.title && newLink.url) {
      let url = newLink.url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      if (editLinkId) {
        editLink(editLinkId, { ...newLink, url });
        toast.success(`Updated link: ${newLink.title}`);
      } else {
        addLink({ ...newLink, url });
        toast.success(`Added link: ${newLink.title}`);
      }

      setNewLink({ title: '', url: '', group: 'General' });
      setEditLinkId(null);
      setIsModalOpen(false);
    }
  };

  const handleOpenEdit = (e: React.MouseEvent, link: LinkItem) => {
    e.preventDefault();
    e.stopPropagation();
    setNewLink({ title: link.title, url: link.url, group: link.group });
    setEditLinkId(link.id);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDelete = (e: React.MouseEvent, link: LinkItem) => {
    e.preventDefault();
    e.stopPropagation();
    removeLink(link.id);
    setActiveMenuId(null);
    toast.error(`Removed: ${link.title}`, {
      action: {
        label: 'Undo',
        onClick: () => {
          restoreLink(link);
          toast.success(`Restored: ${link.title}`);
        }
      }
    });
  };

  const handleTogglePin = (e: React.MouseEvent, link: LinkItem) => {
    e.preventDefault();
    e.stopPropagation();
    togglePin(link.id);
    setActiveMenuId(null);
  };

  const handleContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveMenuId(id === activeMenuId ? null : id);
  };

  const renderLinkCard = (link: LinkItem) => {
    const isMenuOpen = activeMenuId === link.id;
    const clickRatio = maxClicks > 0 ? (link.clicks || 0) / maxClicks : 0;
    const baseScale = 1 + (clickRatio * 0.04); // scale up to 1.04 based on popularity

    return (
      <motion.div
        key={link.id}
        layoutId={link.id}
        initial={{ scale: baseScale }}
        animate={{ scale: baseScale }}
        whileHover={{ scale: baseScale + 0.05, y: -4 }}
        style={{
          boxShadow: clickRatio > 0 && !enableEcoMode ? `0 4px ${10 + (clickRatio * 10)}px rgba(99, 102, 241, ${clickRatio * 0.15})` : undefined
        }}
        className={`transform-gpu border border-black/5 dark:border-white/10 rounded-[1.2rem] shadow-lg group relative transition-all duration-300 ${
          enableEcoMode 
            ? 'bg-gray-100/90 dark:bg-[#20222e]/90 hover:bg-gray-200 dark:hover:bg-[#282a36]'
            : 'bg-white/40 dark:bg-white/5 backdrop-blur-xl hover:shadow-2xl hover:shadow-primary/20 dark:hover:shadow-primary/10'
        }`}
        onContextMenu={(e) => handleContextMenu(e, link.id)}
      >
        <a
          href={link.url}
          onClick={(e) => {
            if (isMenuOpen) {
              e.preventDefault();
              setActiveMenuId(null);
            } else {
              incrementClick(link.id);
              if (enableHistory) {
                addHistory({
                  type: 'link',
                  title: link.title,
                  payload: link.url
                });
              }
            }
          }}
          className="flex flex-col items-center justify-center p-4 md:p-6 h-full text-center space-y-3"
        >
          <div 
            className="w-11 h-11 md:w-12 md:h-12 bg-black/5 dark:bg-white/5 rounded-[1.1rem] flex items-center justify-center p-2.5 transition-transform duration-300 group-hover:bg-black/10 dark:group-hover:bg-white/10"
            style={{
              backgroundColor: clickRatio > 0 ? `rgba(99, 102, 241, ${0.05 + clickRatio * 0.1})` : undefined
            }}
          >
            <img 
              src={`https://www.google.com/s2/favicons?domain=${link.url}&sz=64`} 
              alt="" 
              className="w-full h-full object-contain drop-shadow-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <span className="font-medium text-gray-700 dark:text-white/80 group-hover:text-gray-900 dark:group-hover:text-white truncate w-full px-1 text-xs md:text-sm tracking-wide transition-colors">
            {link.title}
          </span>
        </a>
        
        {/* Quick Action Button */}
        <button
          data-context-trigger="true"
          onClick={(e) => handleContextMenu(e, link.id)}
          className={`absolute top-2 right-2 p-1.5 rounded-full transition-opacity shadow-sm bg-black/10 dark:bg-white/10 text-gray-700 dark:text-white hover:bg-black/20 dark:hover:bg-white/20
            ${isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          <MoreHorizontal className="w-4 h-4 pointer-events-none" />
        </button>

        {/* Desktop Context Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              key="desktop-menu"
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.15 } }}
              className="hidden sm:block absolute top-10 right-2 z-[60] min-w-[150px] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden text-sm"
            >
              <div className="flex flex-col py-1 pointer-events-auto">
                <button 
                  onClick={(e) => handleOpenEdit(e, link)}
                  className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 transition-colors w-full text-left"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>{t('Edit')}</span>
                </button>
                <button 
                  onClick={(e) => handleTogglePin(e, link)}
                  className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 transition-colors w-full text-left"
                >
                  <Star className={`w-4 h-4 ${link.isPinned ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                  <span>{link.isPinned ? t('Unpin') : t('Pin')}</span>
                </button>
                <div className="flex items-center space-x-2 px-3 py-2 text-gray-400 dark:text-gray-500 w-full text-left cursor-default">
                  <BarChart2 className="w-4 h-4" />
                  <span>{link.clicks || 0} clicks</span>
                </div>
                <div className="h-px bg-gray-100 dark:bg-gray-700 my-1 mx-2" />
                <button 
                  onClick={(e) => handleDelete(e, link)}
                  className="flex items-center space-x-2 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 transition-colors w-full text-left"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{t('Delete')}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 pb-12">
      <div className="flex justify-between items-center mb-8 px-2">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white/90 tracking-wide transition-colors">{t('Quick Links')}</h2>
        <button
          onClick={() => {
            setNewLink({ title: '', url: '', group: 'General' });
            setEditLinkId(null);
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 text-gray-800 dark:text-white px-5 py-2.5 rounded-full transition-colors border border-black/10 dark:border-white/10 font-medium shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>{t('Add Link')}</span>
        </button>
      </div>

      <div className="space-y-10">
        {/* Favorites section */}
        {pinnedLinks.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest pl-2 flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span>{t('Favorites')}</span>
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 md:gap-8">
              {pinnedLinks.map(renderLinkCard)}
            </div>
          </div>
        )}

        {/* Regular groups */}
        {Object.entries(groupedLinks).map(([group, groupLinks]) => {
          const isCollapsed = collapsedGroups[group];
          return (
            <div key={group} className="space-y-4">
              <button 
                onClick={() => toggleGroup(group)}
                className="flex items-center space-x-2 w-full text-left group/folder focus:outline-none"
              >
                <h3 className="text-sm font-semibold text-gray-500 dark:text-white/40 group-hover/folder:text-gray-700 dark:group-hover/folder:text-white/70 uppercase tracking-widest pl-2 transition-colors">
                  {group}
                </h3>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isCollapsed ? '-rotate-90' : ''}`} />
              </button>
              
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1, transitionEnd: { overflow: 'visible' } }}
                    exit={{ height: 0, opacity: 0, transitionEnd: { overflow: 'hidden' } }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden -mx-8 px-8 -mb-10 pb-10 -mt-2 pt-2"
                  >
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 md:gap-8 pt-4">
                      {groupLinks.map(renderLinkCard)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Mobile Bottom Sheet Action Menu */}
      <AnimatePresence>
        {activeMenuId && (
          <motion.div 
            key="mobile-bottom-sheet"
            className="sm:hidden fixed inset-0 z-[200] flex items-end justify-center p-4"
          >
             <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
                onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); }} 
             />
             <motion.div
               initial={{ opacity: 0, y: 50, scale: 0.95 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: 50, scale: 0.95, transition: { duration: 0.2 } }}
               className="relative z-10 w-full max-w-sm bg-white dark:bg-[#1c1d25] rounded-[2rem] shadow-2xl p-2 pb-6 border border-black/5 dark:border-white/10"
             >
               <div className="w-12 h-1.5 bg-gray-200 dark:bg-white/20 rounded-full mx-auto my-3" />
               <div className="text-center font-bold text-gray-500 text-sm mb-4">
                 {links.find(l => l.id === activeMenuId)?.title}
               </div>
                <div className="flex flex-col space-y-2 px-4">
                  <button 
                    onClick={(e) => { const l = links.find(ln=>ln.id===activeMenuId); if(l) handleOpenEdit(e, l); }}
                    className="flex items-center justify-center space-x-3 px-4 py-4 rounded-xl bg-gray-100 dark:bg-white/5 active:bg-gray-200 dark:active:bg-white/10 text-gray-800 dark:text-gray-100 transition-colors w-full text-lg font-medium"
                  >
                    <Edit2 className="w-5 h-5 opacity-70" />
                    <span>{t('Edit')}</span>
                  </button>
                  <button 
                    onClick={(e) => { const l = links.find(ln=>ln.id===activeMenuId); if(l) handleTogglePin(e, l); }}
                    className="flex items-center justify-center space-x-3 px-4 py-4 rounded-xl bg-gray-100 dark:bg-white/5 active:bg-gray-200 dark:active:bg-white/10 text-gray-800 dark:text-gray-100 transition-colors w-full text-lg font-medium"
                  >
                    <Star className={`w-5 h-5 ${links.find(l=>l.id===activeMenuId)?.isPinned ? 'fill-yellow-400 text-yellow-400' : 'opacity-70'}`} />
                    <span>{links.find(l=>l.id===activeMenuId)?.isPinned ? t('Unpin') : t('Pin')}</span>
                  </button>
                  <button 
                    onClick={(e) => { const l = links.find(ln=>ln.id===activeMenuId); if(l) handleDelete(e, l); }}
                    className="flex items-center justify-center space-x-3 px-4 py-4 rounded-xl bg-red-100 dark:bg-red-500/20 active:bg-red-200 text-red-600 dark:text-red-400 transition-colors w-full text-lg font-medium mt-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>{t('Delete')}</span>
                  </button>
               </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            key="add-link-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-[#111218] border border-black/10 dark:border-white/10 p-8 rounded-[2rem] w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 transition-colors">
                {editLinkId ? 'Edit Quick Link' : 'New Quick Link'}
              </h3>
              
              <form onSubmit={handleAddOrEdit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-white/60 mb-2 transition-colors">{t('Title')}</label>
                  <input
                    type="text"
                    required
                    value={newLink.title}
                    onChange={e => setNewLink({...newLink, title: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/60 transition-all"
                    placeholder="e.g. GitHub"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-white/60 mb-2 transition-colors">{t('URL')}</label>
                  <input
                    type="text"
                    required
                    value={newLink.url}
                    onChange={e => setNewLink({...newLink, url: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/60 transition-all"
                    placeholder="github.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-white/60 mb-2 transition-colors">{t('Group')}</label>
                  <input
                    type="text"
                    value={newLink.group}
                    onChange={e => setNewLink({...newLink, group: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/60 transition-all"
                    placeholder="Work, Study, Fun..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-indigo-500 text-white font-semibold py-4 rounded-2xl transition-colors mt-4 text-lg"
                >
                  {editLinkId ? t('Save Changes') : t('Add Link')}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
