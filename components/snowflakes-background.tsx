"use client"

import { useEffect, useState } from "react"

interface Snowflake {
  id: number
  x: number
  y: number
  size: number
  speed: number
  opacity: number
}

export default function SnowflakesBackground() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([])

  useEffect(() => {
    // Create initial snowflakes
    const initialSnowflakes: Snowflake[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 1,
      opacity: Math.random() * 0.6 + 0.4,
    }))

    setSnowflakes(initialSnowflakes)

    const animateSnowflakes = () => {
      setSnowflakes((prev) =>
        prev.map((flake) => ({
          ...flake,
          y: flake.y > window.innerHeight ? -10 : flake.y + flake.speed,
          x: flake.x + Math.sin(flake.y * 0.01) * 0.5,
        })),
      )
    }

    const interval = setInterval(animateSnowflakes, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute text-white/60 select-none"
          style={{
            left: `${flake.x}px`,
            top: `${flake.y}px`,
            fontSize: `${flake.size}px`,
            opacity: flake.opacity,
            transform: "translateZ(0)", // Hardware acceleration
          }}
        >
          ❄
        </div>
      ))}
    </div>
  )
}
