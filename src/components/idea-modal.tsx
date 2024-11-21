'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface IdeaModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (idea: {
    title: string
    description: string
    impact: number
    effort: number
    tags: string[]
  }) => void
}

export function IdeaModal({ isOpen, onClose, onSubmit }: IdeaModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [impact, setImpact] = useState(50)
  const [effort, setEffort] = useState(50)
  const [tags, setTags] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title,
      description,
      impact,
      effort,
      tags: tags.split(',').map(tag => tag.trim())
    })
    resetForm()
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setImpact(50)
    setEffort(50)
    setTags('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose()
        resetForm()
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Idea</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="impact">Impact</Label>
            <Slider
              id="impact"
              min={0}
              max={100}
              step={1}
              value={[impact]}
              onValueChange={(value) => setImpact(value[0])}
            />
          </div>
          <div>
            <Label htmlFor="effort">Effort</Label>
            <Slider
              id="effort"
              min={0}
              max={100}
              step={1}
              value={[effort]}
              onValueChange={(value) => setEffort(value[0])}
            />
          </div>
          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Add Idea</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

