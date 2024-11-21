import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

interface ListViewProps {
  ideas: Idea[]
  voteIdea: (id: string, increment: number) => void
}

export function ListView({ ideas, voteIdea }: ListViewProps) {
  return (
    <div className="space-y-4">
      {ideas.map(idea => (
        <Card key={idea.id}>
          <CardHeader>
            <CardTitle>{idea.title}</CardTitle>
            <CardDescription>Impact: {idea.impact}, Effort: {idea.effort}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{idea.description}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {idea.tags.map(tag => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div>Votes: {idea.votes}</div>
            <div className="flex gap-2">
              <Button onClick={() => voteIdea(idea.id, 1)} size="sm" variant="outline">
                <LucideIcons.ThumbsUp className="w-4 h-4 mr-1" />
                Upvote
              </Button>
              <Button onClick={() => voteIdea(idea.id, -1)} size="sm" variant="outline">
                <LucideIcons.ThumbsDown className="w-4 h-4 mr-1" />
                Downvote
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

