import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import BookingForm from "./pages/BookingForm"
import BookingConfirmation from "./pages/BookingConfirmation"
import TrackAgreement from "./pages/TrackAgreement"
import AgreementStatus from "./pages/AgreementStatus"
import AdminLogin from "./pages/AdminLogin"
import AdminDashboard from "./pages/AdminDashboard"
import AgreementDetail from "./pages/AgreementDetail"
import ApprovalPage from "./pages/ApprovalPage"
import Analytics from "./pages/Analytics"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<BookingForm />} />
        <Route path="/confirmation/:trackingId" element={<BookingConfirmation />} />
        <Route path="/track" element={<TrackAgreement />} />
        <Route path="/status/:trackingId" element={<AgreementStatus />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/agreement/:id" element={<ProtectedRoute><AgreementDetail /></ProtectedRoute>} />
        <Route path="/admin/agreement/:id/approve" element={<ProtectedRoute><ApprovalPage /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}