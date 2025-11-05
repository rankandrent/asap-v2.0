import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search } from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-lg">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search parts by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button type="submit">Search</Button>
    </form>
  )
}

