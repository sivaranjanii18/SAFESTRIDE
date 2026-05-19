"use client"

import { useState } from "react"
import { Search, MapPin, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface SearchResult {
  id: string
  name: string
  address: string
  type: 'location' | 'contact' | 'report'
}

const mockResults: SearchResult[] = [
  { id: '1', name: 'Central Park', address: 'New York, NY', type: 'location' },
  { id: '2', name: 'Safe Zone - Office', address: '123 Business Ave', type: 'location' },
  { id: '3', name: 'Sarah Johnson', address: 'Emergency Contact', type: 'contact' },
  { id: '4', name: 'Incident #1234', address: 'Yesterday at 3:45 PM', type: 'report' },
]

interface SearchBarProps {
  onSearch?: (query: string) => void
  onResultSelect?: (result: SearchResult) => void
}

export function SearchBar({ onSearch, onResultSelect }: SearchBarProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  const filteredResults = mockResults.filter(
    result =>
      result.name.toLowerCase().includes(query.toLowerCase()) ||
      result.address.toLowerCase().includes(query.toLowerCase())
  )

  const handleSelect = (result: SearchResult) => {
    onResultSelect?.(result)
    setOpen(false)
    setQuery("")
  }

  return (
    <div className="px-4 py-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search locations, contacts, reports..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                onSearch?.(e.target.value)
                if (e.target.value) setOpen(true)
              }}
              onFocus={() => query && setOpen(true)}
              className="h-11 rounded-xl bg-card pl-10 pr-10 shadow-sm"
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                onClick={() => {
                  setQuery("")
                  setOpen(false)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[calc(100vw-2rem)] max-w-md p-0" align="start">
          <Command>
            <CommandInput placeholder="Search..." className="sr-only" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Results">
                {filteredResults.map((result) => (
                  <CommandItem
                    key={result.id}
                    onSelect={() => handleSelect(result)}
                    className="flex items-center gap-3 px-3 py-2"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{result.name}</p>
                      <p className="text-xs text-muted-foreground">{result.address}</p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
