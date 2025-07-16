import Link from "next/link"
import Image from "next/image"

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center space-x-4 ${className}`}>
      <div className="relative" style={{ width: 64, height: 64, clipPath: 'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)', overflow: 'hidden' }}>
        <Image
          src="/logo.jpg"
          alt="FROZEN THREAD Logo"
          width={64}
          height={64}
          style={{ objectFit: 'contain', display: 'block', margin: '0 auto', width: '100%', height: '100%' }}
          priority
        />
        {/* Glow effect */}
        <div className="absolute inset-0 w-16 h-16 bg-white/20 blur-md opacity-50 -z-10" style={{ clipPath: 'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)' }}></div>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-white leading-none">FROZEN</span>
        <span className="text-lg text-gray-400 leading-none">THREAD</span>
      </div>
    </Link>
  )
}
