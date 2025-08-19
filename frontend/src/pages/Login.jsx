import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { LogIn } from 'lucide-react'
import AOS from "aos";
import "aos/dist/aos.css";



export default function Login() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault(); setError('')
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))
      nav('/app')
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="max-w-md mx-auto pt-20 px-4">
      <div className="glass rounded-3xl p-6">
        <h1 className="text-2xl font-bold mb-2">Welcome To Ktaabi</h1>
        <p className="opacity-80 mb-4">Sign in to manage your library</p>
        {error && <div className="mb-3 text-sm text-red-300">{error}</div>}
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full input" type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input className="w-full input" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          <button className="w-full btn btn-brand flex items-center justify-center gap-2"><LogIn size={16}/> Sign in</button>
        </form>
        <div className="text-sm mt-4">No account? <Link className="text-brand-500" to="/signup">Create one</Link></div>
      </div>
    </div>
  )
}