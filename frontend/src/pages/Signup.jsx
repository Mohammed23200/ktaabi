import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { UserPlus } from 'lucide-react'

export default function Signup() {
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const submit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('')
    try {
      await api.post('/auth/register', { name, email, password })
      setSuccess('Account created!')
      setTimeout(() => nav('/login'), 700)
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="max-w-md mx-auto pt-20 px-4">
      <div className="glass rounded-3xl p-6">
        <h1 className="text-2xl font-bold mb-2">Create an account</h1>
        <p className="opacity-80 mb-4">Start your personal library</p>
        {error && <div className="mb-3 text-sm text-red-300">{error}</div>}
        {success && <div className="mb-3 text-sm text-green-300">{success}</div>}
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full input" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
          <input className="w-full input" type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input className="w-full input" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          <button className="w-full btn btn-brand flex items-center justify-center gap-2"><UserPlus size={16}/> Sign up</button>
        </form>
        <div className="text-sm mt-4">Have an account? <Link className="text-brand-500" to="/login">Sign in</Link></div>
      </div>
    </div>
  )
}