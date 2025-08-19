import { motion } from 'framer-motion'
import { Globe2, Lock, Trash2, Shuffle } from 'lucide-react'

const statusText = { 'to-read': 'To read', 'reading': 'Reading', 'done': 'Finished' }

export default function BookCard({ book, onDelete, onToggle, onTogglePublic }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -3, rotate: 0.1 }}
      transition={{ duration: .35, ease: [0.22, 1, 0.36, 1] }}
      className="card flex items-start justify-between gap-4"
    >
      <div className="flex gap-4">
        {book.cover_url ? (
          <img src={book.cover_url} alt="" className="w-16 h-20 object-cover rounded-xl ring-1 ring-white/20" />
        ) : (
          <div className="w-16 h-20 rounded-xl bg-white/5 border border-white/10 grid place-items-center text-xs opacity-70">No cover</div>
        )}
        <div>
          <div className="text-base font-semibold">{book.title}</div>
          <div className="text-sm opacity-85">{book.author || 'Unknown author'}</div>
          <div className="mt-1 text-xs opacity-70">Status: {statusText[book.status] || book.status}</div>
          <div className="mt-1 text-xs opacity-70 flex items-center gap-1">
            {book.is_public ? <Globe2 size={14}/> : <Lock size={14}/>}
            {book.is_public ? 'Public' : 'Private'}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {onToggle && <button onClick={() => onToggle(book)} className="btn bg-white/10 hover:bg-white/15 text-sm flex items-center gap-1"><Shuffle size={16}/> Toggle</button>}
        {onTogglePublic && <button onClick={() => onTogglePublic(book)} className="btn bg-white/10 hover:bg-white/15 text-sm">{book.is_public ? 'Make Private' : 'Make Public'}</button>}
        {onDelete && <button onClick={() => onDelete(book)} className="btn bg-red-500/80 hover:bg-red-600 text-sm flex items-center gap-1"><Trash2 size={16}/> Delete</button>}
      </div>
    </motion.div>
  )
}