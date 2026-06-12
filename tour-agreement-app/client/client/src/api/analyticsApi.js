import axios from "axios"

const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/analytics`
  : "http://localhost:5000/api/analytics"

export const getSummary = () => axios.get(`${BASE}/summary`)
export const getCharts = () => axios.get(`${BASE}/charts`)
