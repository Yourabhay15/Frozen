import Link from "next/link"
import Image from "next/image"

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center space-x-3 ${className}`}>
      <div className="relative w-12 h-12 overflow-hidden rounded-full border border-white/20 bg-black/40">
        <Image
          src="/assets/Picsart_25-07-19_16-25-41-646_crsh8v.png"
          alt="FROZEN THREAD Logo"
          fill
          sizes="48px"
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-widest text-white leading-none stage-wander">FROZEN</span>
        <span className="text-sm tracking-widest text-gray-400 leading-none mt-1 stage-wander">THREAD</span>
      </div>
    </Link>
  )
}
