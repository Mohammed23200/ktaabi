import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import api from '../api/axios'
import Navbar from '../components/Navbar.jsx'
import AddBookForm from '../components/AddBookForm.jsx'
import BookCard from '../components/BookCard.jsx'

const listVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } }
}

export default function Dashboard() {
  const [books, setBooks] = useState([])
  const [publicBooks, setPublicBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const user = useMemo(() => { try { return JSON.parse(localStorage.getItem('user') || '{}') } catch { return {} } }, [])

  const load = async () => {
    setError('')
    try {
      const [{ data: my }, { data: pub }] = await Promise.all([api.get('/books'), api.get('/books/public')])
      setBooks(my); setPublicBooks(pub)
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const onLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href='/login' }

  const addBook = async (payload) => {
    const { data } = await api.post('/books', payload)
    setBooks((prev) => [data, ...prev])
    if (data.is_public) setPublicBooks((prev)=>[data, ...prev.filter(b=>b.id!==data.id)])
  }

  const deleteBook = async (book) => {
    await api.delete(`/books/${book.id}`)
    setBooks((prev) => prev.filter(b => b.id !== book.id))
    setPublicBooks((prev) => prev.filter(b => b.id !== book.id))
  }

  const toggleStatus = async (book) => {
    const order = ['to-read', 'reading', 'done']
    const next = order[(order.indexOf(book.status) + 1) % order.length]
    const { data } = await api.put(`/books/${book.id}`, { status: next })
    setBooks((prev) => prev.map(b => b.id === book.id ? data : b))
    setPublicBooks((prev) => prev.map(b => b.id === book.id ? data : b))
  }

  const togglePublic = async (book) => {
    const { data } = await api.put(`/books/${book.id}`, { is_public: !book.is_public })
    setBooks((prev) => prev.map(b => b.id === book.id ? data : b))
    if (data.is_public) setPublicBooks((prev)=>[data, ...prev.filter(b=>b.id!==data.id)])
    else setPublicBooks((prev)=>prev.filter(b=>b.id!==data.id))
  }

  const addFromPublic = async (book) => {
    const exists = books.some(b => b.title === book.title && b.author === book.author)
    if (exists) return
    const { data } = await api.post(`/books/import/${book.id}`)
    setBooks((prev) => [data, ...prev])
  }

  return (
    <div className="pb-10">
      <Navbar user={user} onLogout={onLogout} />
      <div className="mx-auto max-w-5xl px-4">
        <AddBookForm onAdd={addBook} />
        {loading && <div className="mt-6 opacity-85">Loading…</div>}
        {error && <div className="mt-6 text-red-300">{error}</div>}

        <h2 className="mt-8 mb-2 text-lg font-semibold">My books</h2>
        <motion.div variants={listVariants} initial="hidden" animate="show" className="grid grid-cols-1 gap-3">
          {books.map((b) => (
            <BookCard key={b.id} book={b} onDelete={deleteBook} onToggle={toggleStatus} onTogglePublic={togglePublic} />
          ))}
          {!loading && books.length===0 && <div className="card text-center opacity-80">Add your first book ✨</div>}
        </motion.div>

        <h2 className="mt-8 mb-2 text-lg font-semibold">Public books</h2>
        <motion.div variants={listVariants} initial="hidden" animate="show" className="grid grid-cols-1 gap-3">
          {publicBooks.map((b) => (
            <div key={'pub-'+b.id} className="card flex items-start justify-between gap-4">
              <div className="flex gap-4">
                {b.cover_url ? (
                  <img src={b.cover_url} alt="" className="w-16 h-20 object-cover rounded-xl ring-1 ring-white/20" />
                ) : (
                  <div className="w-16 h-20 rounded-xl bg-white/5 border border-white/10 grid place-items-center text-xs opacity-70">No cover</div>
                )}
                <div>
                  <div className="text-base font-semibold">{b.title}</div>
                  <div className="text-sm opacity-85">{b.author || 'Unknown author'}</div>
                </div>
              </div>
              <button onClick={() => addFromPublic(b)} className="btn btn-brand text-sm">Add to my library</button>
            </div>
          ))}
          {!loading && publicBooks.length===0 && <div className="card text-center opacity-80">No public books yet</div>}
        </motion.div>
      </div>
    </div>
  )
}