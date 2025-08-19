import { BookPlus, LogOut, Library } from 'lucide-react'
import { Link } from 'react-router-dom'
export default function Navbar({ user, onLogout }) {
  return (
    <div className="glass sticky top-0 z-10 mb-6">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-semibold"><Library size={20}/> Ktaabi</div>
        <div className="flex items-center gap-3">
          <Link to="/explore" className="btn bg-white/10 hover:bg-white/15 text-sm">Explore</Link>
          <span className="text-sm opacity-85">{user?.name}</span>
          <button onClick={onLogout} className="btn btn-brand flex items-center gap-2"><LogOut size={16}/> Logout</button>
        </div>
      </div>
    </div>  
  )
}