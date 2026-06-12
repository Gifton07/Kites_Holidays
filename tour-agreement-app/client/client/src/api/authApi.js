import axios from "axios"

const BASE = "http://localhost:5000/api/auth"

export const login = (email, password) => axios.post(`${BASE}/login`, { email, password })
export const getMe = () => axios.get(`${BASE}/me`)
