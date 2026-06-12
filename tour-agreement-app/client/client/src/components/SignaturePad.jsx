import { useRef, useEffect, forwardRef, useImperativeHandle } from "react"

const SignaturePad = forwardRef(({ label = "Sign here" }, ref) => {
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const lastPos = useRef(null)

  useImperativeHandle(ref, () => ({
    getDataURL: () => {
      const canvas = canvasRef.current
      // Check if any drawing happened
      const ctx = canvas.getContext("2d", { willReadFrequently: true })
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
      const hasContent = Array.from(data).some((v, i) => i % 4 === 3 && v > 0)
      return hasContent ? canvas.toDataURL("image/png") : null
    },
    clear: () => {
      const canvas = canvasRef.current
      canvas.getContext("2d", { willReadFrequently: true }).clearRect(0, 0, canvas.width, canvas.height)
    },
  }))

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect()
      const src = e.touches ? e.touches[0] : e
      return { x: src.clientX - rect.left, y: src.clientY - rect.top }
    }

    const start = (e) => { e.preventDefault(); drawing.current = true; lastPos.current = getPos(e) }
    const move = (e) => {
      e.preventDefault()
      if (!drawing.current) return
      const pos = getPos(e)
      ctx.beginPath()
      ctx.moveTo(lastPos.current.x, lastPos.current.y)
      ctx.lineTo(pos.x, pos.y)
      ctx.strokeStyle = "#1a202c"
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.stroke()
      lastPos.current = pos
    }
    const stop = () => { drawing.current = false }

    canvas.addEventListener("mousedown", start)
    canvas.addEventListener("mousemove", move)
    canvas.addEventListener("mouseup", stop)
    canvas.addEventListener("mouseleave", stop)
    canvas.addEventListener("touchstart", start, { passive: false })
    canvas.addEventListener("touchmove", move, { passive: false })
    canvas.addEventListener("touchend", stop)

    return () => {
      canvas.removeEventListener("mousedown", start)
      canvas.removeEventListener("mousemove", move)
      canvas.removeEventListener("mouseup", stop)
      canvas.removeEventListener("mouseleave", stop)
      canvas.removeEventListener("touchstart", start)
      canvas.removeEventListener("touchmove", move)
      canvas.removeEventListener("touchend", stop)
    }
  }, [])

  return (
    <div>
      <label className="form-label">{label}</label>
      <div className="relative border-2 border-dashed border-emerald-300/70 rounded-xl overflow-hidden bg-gradient-to-b from-emerald-50/90 to-[#f4faf7]" style={{ height: 160 }}>
        <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" style={{ touchAction: "none" }} />
        <span className="absolute bottom-2 right-3 text-xs text-gray-300 pointer-events-none">Sign with mouse or touch</span>
      </div>
    </div>
  )
})

SignaturePad.displayName = "SignaturePad"
export default SignaturePad
