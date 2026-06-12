import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"

export default function NotFound() {
  return (
    <div className="page-shell">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <div className="text-8xl mb-6 drop-shadow-lg">🗺️</div>
        <h1 className="text-7xl font-extrabold bg-gradient-to-br from-emerald-300 via-indigo-400 to-violet-500 bg-clip-text text-transparent mb-2">
          404
        </h1>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Page Not Found</h2>
        <p className="theme-page-sub mb-8 max-w-sm font-medium">
          Looks like this destination doesn&apos;t exist on our map. Let&apos;s get you back on track.
        </p>
        <div className="flex gap-4">
          <Link to="/"><button className="btn-primary">🏠 Go Home</button></Link>
          <Link to="/track"><button className="btn-secondary">🔍 Track Agreement</button></Link>
        </div>
      </div>
    </div>
  )
}
