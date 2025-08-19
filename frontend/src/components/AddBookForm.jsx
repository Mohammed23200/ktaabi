import { useState } from 'react'
import api from '../api/axios'
import { Upload, Plus } from 'lucide-react'

export default function AddBookForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [file, setFile] = useState(null)
  const [isPublic, setIsPublic] = useState(false)
  const [busy, setBusy] = useState(false)

  const uploadCover = async () => {
    if (!file) return null
    const form = new FormData()
    form.append('file', file)
    const { data } = await api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
    return data.url
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setBusy(true)
    try {
      const cover_url = await uploadCover()
      await onAdd({ title: title.trim(), author: author.trim() || null, status: 'to-read', cover_url, is_public: isPublic })
      setTitle(''); setAuthor(''); setFile(null); setIsPublic(false)
      e.target.reset()
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="card grid grid-cols-1 md:grid-cols-8 gap-3">
      <input className="input md:col-span-3" placeholder="Book title" value={title} onChange={(e)=>setTitle(e.target.value)} />
      <input className="input md:col-span-3" placeholder="Author (optional)" value={author} onChange={(e)=>setAuthor(e.target.value)} />
      <label className="input md:col-span-1 flex items-center gap-2 cursor-pointer">
        <Upload size={16}/> <input className="hidden" type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0] || null)} /> Cover
      </label>
      <label className="flex items-center gap-2 md:col-span-1">
        <input type="checkbox" checked={isPublic} onChange={e=>setIsPublic(e.target.checked)} />
        <span className="text-sm">Public</span>
      </label>
      <button disabled={busy} className="btn btn-brand md:col-span-8 flex items-center justify-center gap-2">
        <Plus size={16}/>{busy ? 'Uploading…' : 'Add book'}
      </button>
    </form>
  )
}