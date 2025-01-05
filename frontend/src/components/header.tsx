'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings, LogOut } from 'lucide-react'
import EditInterestsDialog from '@/components/edit-interests'
import { useRouter } from 'next/navigation'

export default function Header() {
    const [isEditInterestsOpen, setIsEditInterestsOpen] = useState(false)
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    const router = useRouter()

    const handleLogout = () => {
        localStorage.removeItem('token')
        router.push('/')
    }

    return (
        <header className="bg-gray-800 py-4">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-blue-500">FutureNews</h1>
                <div className="flex items-center space-x-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="h-8 w-8 cursor-pointer">
                                <AvatarImage src="/avatars/01.png" alt="@username" />
                                <AvatarFallback className="text-black grid place-items-center">{user?.firstname[0] + user?.lastname[0]}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user?.firstname + " " + user?.lastname}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setIsEditInterestsOpen(true)}>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Edit Interests</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <EditInterestsDialog
                isOpen={isEditInterestsOpen}
                onClose={() => setIsEditInterestsOpen(false)}
            />
        </header>
    )
}
