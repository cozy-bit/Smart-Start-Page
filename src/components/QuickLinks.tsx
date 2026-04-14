import { useState } from 'react';
import { useLinkStore } from '../store/useLinkStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { useUIStore } from '../store/useUIStore';

export default function QuickLinks() {
  const { links, addLink, removeLink, incrementClick } = useLinkStore();
  const isModalOpen = useUIStore((s) => s.isAddLinkOpen);
  const setIsModalOpen = useUIStore((s) => s.setAddLinkOpen);
  const [newLink, setNewLink] = useState({ title: '', url: '', group: 'General' });

  // Sort links by clicks descending
  const sortedLinks = [...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));

  const groupedLinks = sortedLinks.reduce((acc, link) => {
    if (!acc[link.group]) acc[link.group] = [];
    acc[link.group].push(link);
    return acc;
  }, {} as Record<string, typeof links>);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLink.title && newLink.url) {
      let url = newLink.url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      addLink({ ...newLink, url });
      toast.success(`Added link: ${newLink.title}`);
      setNewLink({ title: '', url: '', group: 'General' });
      setIsModalOpen(false);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeLink(id);
    toast.error(`Removed link: ${title}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 pb-12">
      <div className="flex justify-between items-center mb-8 px-2">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white/90 tracking-wide transition-colors">Quick Links</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 text-gray-800 dark:text-white px-5 py-2.5 rounded-full transition-colors border border-black/10 dark:border-white/10 font-medium shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Link</span>
        </button>
      </div>

      <div className="space-y-10">
        {Object.entries(groupedLinks).map(([group, groupLinks]) => (
          <div key={group} className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest pl-2 transition-colors">{group}</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 md:gap-8">
              {groupLinks.map((link) => (
                <motion.div
                  key={link.id}
                  layoutId={link.id}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-[1.2rem] shadow-lg group relative overflow-hidden hover:shadow-2xl hover:shadow-primary/20 dark:hover:shadow-primary/10 transition-all duration-300"
                >
                  <a
                    href={link.url}
                    onClick={() => incrementClick(link.id)}
                    className="flex flex-col items-center justify-center p-4 md:p-6 h-full text-center space-y-3"
                  >
                    <div className="w-11 h-11 md:w-12 md:h-12 bg-black/5 dark:bg-white/5 rounded-[1.1rem] flex items-center justify-center p-2.5 transition-transform duration-300 group-hover:bg-black/10 dark:group-hover:bg-white/10">
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
                  <button
                    onClick={(e) => handleDelete(e, link.id, link.title)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
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
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 transition-colors">New Quick Link</h3>
              
              <form onSubmit={handleAdd} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-white/60 mb-2 transition-colors">Title</label>
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
                  <label className="block text-sm font-medium text-gray-600 dark:text-white/60 mb-2 transition-colors">URL</label>
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
                  <label className="block text-sm font-medium text-gray-600 dark:text-white/60 mb-2 transition-colors">Group</label>
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
                  Add Link
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
