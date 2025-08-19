import axios from 'axios'
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' })
api.interceptors.request.use((config)=>{ const t=localStorage.getItem('token'); if(t) config.headers.Authorization=`Bearer ${t}`; return config })
api.interceptors.response.use(res=>res,err=>{ if(err?.response?.status===401){ localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href='/login' } return Promise.reject(err) })
export default api
