import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../api/axios'
import catalog from '../catalog/catalog.json'
import { PlusCircle, BookOpen, Languages } from 'lucide-react'

const grid = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
}
const item = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: .35, ease: [0.22,1,0.36,1] } }
}

const placeholderFor = (title) => `https://picsum.photos/seed/${encodeURIComponent(title)}/200/280`

export default function Explore() {
  const [busyId, setBusyId] = useState(null)
  const [addedIds, setAddedIds] = useState({})

  const addToMy = async (book) => {
    setBusyId(book.id)
    try {
      const payload = {
        title: book.title,
        author: book.author,
        status: 'to-read',
        cover_url: book.cover_url || placeholderFor(book.title),
        is_public: true // make it public so it shows under Public books
      }
      const { data } = await api.post('/books', payload)
      setAddedIds((p) => ({ ...p, [book.id]: true }))
      const el = document.createElement('div');
      el.textContent = 'Added to your library (Public)';
      el.style.cssText='position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.7);color:#fff;padding:10px 14px;border-radius:12px;z-index:9999;backdrop-filter:blur(6px)';
      document.body.appendChild(el);
      setTimeout(()=>el.remove(), 1200)
    } catch (err) {
      console.error('Add error:', err)
      alert(err?.response?.data?.message || 'Failed to add. Check API URL/CORS & login.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16">
      <div className="mb-4 flex items-center gap-2 text-lg font-semibold"><BookOpen size={18}/> Explore catalog</div>
      <motion.div variants={grid} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {catalog.map((b) => (
          <motion.div key={b.id} variants={item} className="glass rounded-2xl overflow-hidden">
            <div className="relative">
              <img src={(b.cover_url || placeholderFor(b.title))} alt={b.title} className="w-full h-[220px] object-cover" loading="lazy" />
              <div className="absolute top-2 left-2 text-[10px] px-2 py-1 rounded-full bg-black/40 backdrop-blur text-white flex items-center gap-1">
                <Languages size={12}/> {b.lang.toUpperCase()}
              </div>
            </div>
            <div className="p-3">
              <div className="text-sm font-semibold line-clamp-2 min-h-[2.5rem]">{b.title}</div>
              <div className="text-xs opacity-80 line-clamp-1">{b.author}</div>
              <button disabled={busyId===b.id || addedIds[b.id]} onClick={() => addToMy(b)}
                className="mt-3 w-full btn btn-brand flex items-center justify-center gap-2 disabled:opacity-60">
                <PlusCircle size={16}/> {addedIds[b.id] ? 'Added' : busyId===b.id ? 'Adding…' : 'Add to my library'}
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
