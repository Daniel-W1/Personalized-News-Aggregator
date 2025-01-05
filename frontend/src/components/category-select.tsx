import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CategorySelectorProps {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

export default function CategorySelector({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategorySelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category) => (
        <Button
          key={category}
          variant={"ghost"}
          onClick={() => onSelectCategory(category)}
          className={cn("text-sm capitalize hover:bg-blue-500 hover:text-white", selectedCategory === category && "bg-blue-500 text-white")}
        >
          {category}
        </Button>
      ))}
    </div>
  )
}
