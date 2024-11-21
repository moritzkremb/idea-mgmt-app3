'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Idea {
  id: string
  title: string
  description: string
  impact: number
  effort: number
  votes: number
  tags: string[]
}

interface QuadrantViewProps {
  ideas: Idea[]
  updateIdea: (idea: Idea) => void
}

const colors = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
]

export function QuadrantView({ ideas, updateIdea }: QuadrantViewProps) {
  const [draggingIdea, setDraggingIdea] = useState<Idea | null>(null)
  const [hoveredIdea, setHoveredIdea] = useState<Idea | null>(null)
  const quadrantRef = useRef<HTMLDivElement>(null)

  const ideaColors = useMemo(() => {
    return ideas.reduce((acc, idea, index) => {
      acc[idea.id] = colors[index % colors.length]
      return acc
    }, {} as Record<string, string>)
  }, [ideas])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggingIdea && quadrantRef.current) {
        const rect = quadrantRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width
        const y = (e.clientY - rect.top) / rect.height
        updateIdea({
          ...draggingIdea,
          impact: Math.min(Math.max(Math.round((1 - y) * 100), 0), 100),
          effort: Math.min(Math.max(Math.round(x * 100), 0), 100)
        })
      }
    }

    const handleMouseUp = () => {
      setDraggingIdea(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [draggingIdea, updateIdea])

  const getQuadrantStyle = (top: boolean, left: boolean) => {
    return cn(
      "absolute w-1/2 h-1/2 flex items-center justify-center text-sm font-medium text-gray-500 transition-colors",
      top ? "top-0" : "bottom-0",
      left ? "left-0" : "right-0",
      top && left && "hover:bg-green-50",
      top && !left && "hover:bg-blue-50",
      !top && left && "hover:bg-yellow-50",
      !top && !left && "hover:bg-red-50"
    )
  }

  return (
    <div className="relative w-full h-[calc(100vh-200px)] min-h-[600px] border-2 border-gray-200 rounded-xl overflow-hidden bg-white shadow-md">
      <div ref={quadrantRef} className="absolute inset-0">
        <div className={getQuadrantStyle(true, true)}>
          <span>High Impact, High Effort</span>
        </div>
        <div className={getQuadrantStyle(true, false)}>
          <span>High Impact, Low Effort</span>
        </div>
        <div className={getQuadrantStyle(false, true)}>
          <span>Low Impact, High Effort</span>
        </div>
        <div className={getQuadrantStyle(false, false)}>
          <span>Low Impact, Low Effort</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-full border-l border-gray-300"></div>
        </div>
        {ideas.map(idea => (
          <div
            key={idea.id}
            className="absolute flex items-center cursor-move transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
            style={{
              left: `${idea.effort}%`,
              top: `${100 - idea.impact}%`,
            }}
            onMouseDown={() => setDraggingIdea(idea)}
            onMouseEnter={() => setHoveredIdea(idea)}
            onMouseLeave={() => setHoveredIdea(null)}
          >
            <div 
              className={cn(
                "w-4 h-4 rounded-full mr-2 border-2 border-white shadow-md",
                ideaColors[idea.id]
              )}
            ></div>
            <span className="text-xs font-medium bg-white bg-opacity-75 px-1 py-0.5 rounded shadow-sm max-w-[120px] truncate">
              {idea.title}
            </span>
          </div>
        ))}
        {hoveredIdea && (
          <Card
            className="absolute p-2 w-48 pointer-events-none shadow-lg z-10"
            style={{
              left: `${hoveredIdea.effort}%`,
              top: `${100 - hoveredIdea.impact}%`,
              transform: 'translate(-50%, -100%) translateY(-10px)'
            }}
          >
            <CardContent className="p-2">
              <h3 className="font-semibold truncate">{hoveredIdea.title}</h3>
              <p className="text-sm text-gray-600 truncate">{hoveredIdea.description}</p>
              <p className="text-xs text-gray-500 mt-1">Votes: {hoveredIdea.votes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

