import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Explore from './pages/Explore.jsx'
import AnimatedBg from './components/AnimatedBg.jsx'

const page = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -24, scale: 0.98 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <div className="bg-animated relative">
      <AnimatedBg />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Navigate to="/app" replace />} />
          <Route path="/login" element={<motion.div {...page}><Login /></motion.div>} />
          <Route path="/signup" element={<motion.div {...page}><Signup /></motion.div>} />
          <Route path="/app" element={<ProtectedRoute><motion.div {...page}><Dashboard /></motion.div></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><motion.div {...page}><Explore /></motion.div></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/app" />} />
        </Routes>
      </AnimatePresence>
      <div className="overlay-dots"></div>
    </div>
  )
}