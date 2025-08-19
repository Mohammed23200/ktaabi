/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter','system-ui','Segoe UI','Tahoma'] },
      colors: {
        coffee: {
          50:'#f6efe9', 100:'#eadfd5', 200:'#d6c1ae', 300:'#c4a489',
          400:'#a88361', 500:'#8a6546', 600:'#6e5038', 700:'#5a463f',
          800:'#3b2e2a', 900:'#2c211e'
        },
        brand: { 500:'#a88361', 600:'#8a6546' }
      },
      boxShadow: { soft: '0 10px 30px rgba(0,0,0,0.25)' },
      backgroundImage: {
        'coffee-grad': 'radial-gradient(1200px 600px at 10% 10%, rgba(168,131,97,0.25), transparent), radial-gradient(800px 400px at 90% 30%, rgba(94,67,57,0.25), transparent), radial-gradient(900px 500px at 30% 90%, rgba(46,33,30,0.35), transparent)'
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1deg)' }
        },
        pan: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' }
        }
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        pan: 'pan 20s linear infinite alternate'
      }
    }
  },
  plugins: [],
}