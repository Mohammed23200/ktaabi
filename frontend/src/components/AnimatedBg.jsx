import { motion } from 'framer-motion'

export default function AnimatedBg() {
  // Floating soft blobs for depth
  const blobs = [
    { size: 220, top: '10%', left: '5%', opacity: .18 },
    { size: 320, top: '60%', left: '70%', opacity: .14 },
    { size: 260, top: '75%', left: '20%', opacity: .12 },
  ]
  return (
    <div aria-hidden className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-coffee-grad pointer-events-none" />
      {blobs.map((b, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{ width: b.size, height: b.size, top: b.top, left: b.left, background: 'rgba(168,131,97,0.5)', opacity: b.opacity }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 8 + i*1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}