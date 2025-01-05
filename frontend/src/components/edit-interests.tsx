import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Plus, X } from 'lucide-react'

interface EditInterestsDialogProps {
  isOpen: boolean
  onClose: () => void
}

const interests = [
  "general",
  "business",
  "entertainment",
  "health",
  "science",
  "technology",
  "sports"
]

export default function EditInterestsDialog({ isOpen, onClose }: EditInterestsDialogProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  const handleInterestChange = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const handleSave = () => {
    // Here you would typically save the selected interests to your backend
    console.log('Saving interests:', selectedInterests)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-screen-sm bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Edit Your Interests</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {selectedInterests.map((interest) => (
              <Badge 
                key={interest}
                variant="secondary"
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer flex items-center gap-1"
                onClick={() => handleInterestChange(interest)}
              >
                {interest.charAt(0).toUpperCase() + interest.slice(1)}
                <X size={14} />
              </Badge>
            ))}
          </div>
          <Card className="p-4 bg-gray-800 border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {interests
                .filter(interest => !selectedInterests.includes(interest))
                .map((interest) => (
                  <Button
                    key={interest}
                    variant="ghost"
                    className="justify-center text-gray-300 hover:text-white hover:bg-gray-700"
                    onClick={() => handleInterestChange(interest)}
                  >
                    <Plus size={16} className="mr-1" />
                    {interest.charAt(0).toUpperCase() + interest.slice(1)}
                  </Button>
                ))}
            </div>
          </Card>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
