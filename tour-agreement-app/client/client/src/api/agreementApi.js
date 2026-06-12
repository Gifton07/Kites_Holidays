import axios from "axios"

export const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/agreements`
  : "http://localhost:5000/api/agreements"

export const createAgreement = (data) => axios.post(BASE, data)
export const trackAgreement = (trackingId) => axios.get(`${BASE}/track/${trackingId}`)
export const getAllAgreements = (status) => axios.get(BASE, { params: status ? { status } : {} })
export const getAgreementById = (id) => axios.get(`${BASE}/${id}`)
export const approveAgreement = (id, data) => axios.patch(`${BASE}/${id}/approve`, data)
export const rejectAgreement = (id, data) => axios.patch(`${BASE}/${id}/reject`, data)
export const deleteAgreement = (id) => axios.delete(`${BASE}/${id}`)
/** Retry PDF generation + MEGA upload (approved agreements only). */
export const regeneratePdf = (id) => axios.post(`${BASE}/${id}/regenerate-pdf`)
/** Admin: update cash in / cash out / pending balance */
export const patchAgreementFinances = (id, data) => axios.patch(`${BASE}/${id}/finances`, data)
