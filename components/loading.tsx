export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="glass p-8 rounded-lg">
        <div className="hexagon-loader">
          <div className="hexagon-loader__hexagon"></div>
          <div className="hexagon-loader__hexagon"></div>
          <div className="hexagon-loader__hexagon"></div>
          <div className="hexagon-loader__hexagon"></div>
          <div className="hexagon-loader__hexagon"></div>
          <div className="hexagon-loader__hexagon"></div>
        </div>
        <div className="text-white text-lg mt-4">Loading...</div>
      </div>
    </div>
  )
}
