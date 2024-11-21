'use client'

import { useState } from 'react'
import { QuadrantView } from '@/components/quadrant-view'
import { ListView } from '@/components/list-view'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { IdeaModal } from '@/components/idea-modal'
import * as LucideIcons from 'lucide-react'

interface Idea {
  id: string
  title: string
  description: string
  impact: number
  effort: number
  votes: number
  tags: string[]
}

export default function Home() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const addIdea = (idea: Omit<Idea, 'id' | 'votes'>) => {
    setIdeas([...ideas, { ...idea, id: Date.now().toString(), votes: 0 }])
    setIsModalOpen(false)
  }

  const updateIdea = (updatedIdea: Idea) => {
    setIdeas(ideas.map(idea => idea.id === updatedIdea.id ? updatedIdea : idea))
  }

  const voteIdea = (id: string, increment: number) => {
    setIdeas(ideas.map(idea => 
      idea.id === id ? { ...idea, votes: idea.votes + increment } : idea
    ))
  }

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Title,Description,Impact,Effort,Votes,Tags\n"
      + ideas.map(idea => 
          `${idea.id},"${idea.title}","${idea.description}",${idea.impact},${idea.effort},${idea.votes},"${idea.tags.join(', ')}"`
        ).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "ideas.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Idea Management App</h1>
      <Tabs defaultValue="quadrant" className="mt-6">
        <TabsList>
          <TabsTrigger value="quadrant">Quadrant View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        <TabsContent value="quadrant" className="relative">
          <QuadrantView ideas={ideas} updateIdea={updateIdea} />
          <Button 
            className="absolute bottom-4 right-4 rounded-full w-12 h-12"
            onClick={() => setIsModalOpen(true)}
          >
            <LucideIcons.Plus className="w-6 h-6" />
            <span className="sr-only">Add new idea</span>
          </Button>
        </TabsContent>
        <TabsContent value="list">
          <ListView ideas={ideas} voteIdea={voteIdea} />
        </TabsContent>
      </Tabs>
      <Button onClick={exportToCSV} className="mt-4">Export to CSV</Button>
      <IdeaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={addIdea} />
    </main>
  )
}

