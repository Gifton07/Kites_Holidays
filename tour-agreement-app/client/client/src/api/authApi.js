import axios from "axios"

const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/auth`
  : "http://localhost:5000/api/auth"

export const login = (email, password) => axios.post(`${BASE}/login`, { email, password })
export const getMe = () => axios.get(`${BASE}/me`)
