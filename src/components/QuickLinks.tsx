import { useState } from 'react';
import { useLinkStore } from '../store/useLinkStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';

export default function QuickLinks() {
  const { links, addLink, removeLink } = useLinkStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLink, setNewLink] = useState({ title: '', url: '', group: 'General' });

  const groupedLinks = links.reduce((acc, link) => {
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
      setNewLink({ title: '', url: '', group: 'General' });
      setIsModalOpen(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 pb-12">
      <div className="flex justify-between items-center mb-8 px-2">
        <h2 className="text-2xl font-semibold text-white/90 tracking-wide">Quick Links</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full transition-colors border border-white/10 font-medium shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Link</span>
        </button>
      </div>

      <div className="space-y-10">
        {Object.entries(groupedLinks).map(([group, groupLinks]) => (
          <div key={group} className="space-y-4">
            <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest pl-2">{group}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {groupLinks.map((link) => (
                <motion.div
                  key={link.id}
                  layoutId={link.id}
                  className="glass-panel group relative overflow-hidden"
                >
                  <a
                    href={link.url}
                    className="flex flex-col items-center justify-center p-6 h-full text-center space-y-4"
                  >
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center p-3 group-hover:scale-110 transition-transform duration-300">
                      <img 
                        src={`https://www.google.com/s2/favicons?domain=${link.url}&sz=64`} 
                        alt="" 
                        className="w-full h-full object-contain drop-shadow-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <span className="font-medium text-white/90 group-hover:text-white truncate w-full px-1 text-sm tracking-wide">
                      {link.title}
                    </span>
                  </a>
                  <button
                    onClick={(e) => { e.preventDefault(); removeLink(link.id); }}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#111218] border border-white/10 p-8 rounded-[2rem] w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-2xl font-semibold text-white mb-8">New Quick Link</h3>
              
              <form onSubmit={handleAdd} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={newLink.title}
                    onChange={e => setNewLink({...newLink, title: e.target.value})}
                    className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/60 transition-shadow"
                    placeholder="e.g. GitHub"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">URL</label>
                  <input
                    type="text"
                    required
                    value={newLink.url}
                    onChange={e => setNewLink({...newLink, url: e.target.value})}
                    className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/60 transition-shadow"
                    placeholder="github.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Group</label>
                  <input
                    type="text"
                    value={newLink.group}
                    onChange={e => setNewLink({...newLink, group: e.target.value})}
                    className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/60 transition-shadow"
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
