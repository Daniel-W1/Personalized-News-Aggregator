import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Plus, X } from 'lucide-react'
import axios from 'axios'
import { API_URL } from '@/lib/utils'

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
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchUserInterests = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`${API_URL}/users/me/interests`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (response.data.success) {
                    const userInterests = response.data.data.map((interest: { name: string }) => interest.name)
                    setSelectedInterests(userInterests)
                }
            } catch (err) {
                setError('Failed to load interests')
                console.error('Error fetching interests:', err)
            } finally {
                setIsLoading(false)
            }
        }

        if (isOpen) {
            fetchUserInterests()
        }
    }, [isOpen])

    const handleInterestChange = (interest: string) => {
        setSelectedInterests(prev =>
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest]
        )
    }

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token')
            const interestIds = selectedInterests.map(interest => interests.indexOf(interest) + 1)

            const response = await axios.put(`${API_URL}/users/me/interests`,
                { interest_ids: interestIds },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            if (response.data.success) {
                onClose()
            }
        } catch (err) {
            setError('Failed to save interests')
            console.error('Error saving interests:', err)
        }
    }

    if (isLoading) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-screen-sm">
                    <DialogHeader>
                        <DialogTitle>Edit Your Interests</DialogTitle>
                    </DialogHeader>
                    <div className="text-center">Loading...</div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-screen-sm">
                <DialogHeader>
                    <DialogTitle>Edit Your Interests</DialogTitle>
                </DialogHeader>
                {error && (
                    <div className="text-destructive text-sm mb-4">
                        {error}
                    </div>
                )}
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {selectedInterests.map((interest) => (
                            <Badge
                                key={interest}
                                variant="secondary"
                                className="cursor-pointer flex items-center gap-1"
                                onClick={() => handleInterestChange(interest)}
                            >
                                {interest.charAt(0).toUpperCase() + interest.slice(1)}
                                <X size={14} />
                            </Badge>
                        ))}
                    </div>
                    <Card className="p-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {interests
                                .filter(interest => !selectedInterests.includes(interest))
                                .map((interest) => (
                                    <Button
                                        key={interest}
                                        variant="ghost"
                                        className="justify-center"
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
                    <Button onClick={handleSave}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
