"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Smile, Search } from "lucide-react"
import { useState } from "react"

interface NameplateCustomizerProps {
  customization: {
    primaryColor: string
    secondaryColor: string
    headerBackgroundColor: string
    fontFamily: string
    fontSize: number
    jobTitleSize?: number
  }
  customIcon: string
  onIconChange: (icon: string) => void
  onChange: (key: string, value: any) => void
}

// Developer-friendly funny fonts
const developerFonts = [
  { name: "Inter", value: "Inter" },
  { name: "Fira Code", value: "Fira Code, monospace" },
  { name: "JetBrains Mono", value: "JetBrains Mono, monospace" },
  { name: "Comic Neue", value: "Comic Neue, cursive" },
  { name: "Press Start 2P", value: "Press Start 2P, cursive" },
  { name: "Source Code Pro", value: "Source Code Pro, monospace" },
  { name: "Ubuntu Mono", value: "Ubuntu Mono, monospace" },
  { name: "Hack", value: "Hack, monospace" },
]

// Expanded emoji categories
const emojiCategories = {
  Developer: ["👨‍💻", "👩‍💻", "🧑‍💻", "⌨️", "🖥️", "💻", "🚀", "⚡", "🔥", "🐞", "🐛", "🧠", "🤖", "👾"],
  Tech: ["📱", "🔌", "🔋", "💾", "💿", "📀", "🖨️", "🖱️", "📷", "📹", "🎮", "🎯", "🧩"],
  Work: ["📊", "📈", "📉", "📝", "📌", "📎", "✂️", "📁", "📂", "🗂️", "📅", "🔍", "💡", "⚙️"],
  Fun: ["😄", "😎", "🤓", "🤩", "🥳", "🎉", "🎊", "🎈", "🎸", "🎮", "🎯", "🎲", "🎭", "🎨"],
  Animals: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸"],
  Food: ["☕", "🍵", "🥤", "🍺", "🍕", "🍔", "🍟", "🌮", "🌯", "🍣", "🍙", "🍦", "🍩", "🍪"],
  Symbols: ["✅", "❌", "⭐", "🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "⚫", "⚪", "🟤", "🔺", "🔻"],
}

export function NameplateCustomizer({ customization, customIcon, onIconChange, onChange }: NameplateCustomizerProps) {
  const { primaryColor, secondaryColor, headerBackgroundColor, fontFamily, fontSize } = customization
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("Developer")

  // Filter emojis based on search term
  const filteredEmojis = searchTerm
    ? Object.values(emojiCategories)
        .flat()
        .filter(
          (emoji) =>
            emoji.includes(searchTerm) || getEmojiDescription(emoji).toLowerCase().includes(searchTerm.toLowerCase()),
        )
    : emojiCategories[selectedCategory as keyof typeof emojiCategories] || []

  // Helper function to get emoji descriptions (simplified)
  function getEmojiDescription(emoji: string): string {
    const emojiDescriptions: Record<string, string> = {
      "👨‍💻": "man programmer",
      "👩‍💻": "woman programmer",
      "🧑‍💻": "person programmer",
      "⌨️": "keyboard",
      "🖥️": "desktop computer",
      "💻": "laptop",
      "🚀": "rocket",
      "⚡": "lightning",
      "🔥": "fire",
      // Add more as needed
    }
    return emojiDescriptions[emoji] || ""
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="primaryColor">Primary Color (Text)</Label>
        <div className="flex items-center gap-4 mt-2">
          <Input
            id="primaryColor"
            type="color"
            value={primaryColor}
            onChange={(e) => onChange("primaryColor", e.target.value)}
            className="w-12 h-10 p-1"
          />
          <Input
            type="text"
            value={primaryColor}
            onChange={(e) => onChange("primaryColor", e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="secondaryColor">Background Color</Label>
        <div className="flex items-center gap-4 mt-2">
          <Input
            id="secondaryColor"
            type="color"
            value={secondaryColor}
            onChange={(e) => onChange("secondaryColor", e.target.value)}
            className="w-12 h-10 p-1"
          />
          <Input
            type="text"
            value={secondaryColor}
            onChange={(e) => onChange("secondaryColor", e.target.value)}
            className="flex-1"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">White background recommended to conserve printer ink</p>
      </div>

      <div>
        <Label htmlFor="headerBackgroundColor">Header Background Color</Label>
        <div className="flex items-center gap-4 mt-2">
          <Input
            id="headerBackgroundColor"
            type="color"
            value={headerBackgroundColor}
            onChange={(e) => onChange("headerBackgroundColor", e.target.value)}
            className="w-12 h-10 p-1"
          />
          <Input
            type="text"
            value={headerBackgroundColor}
            onChange={(e) => onChange("headerBackgroundColor", e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="fontFamily">Font Family</Label>
        <Select value={fontFamily} onValueChange={(value) => onChange("fontFamily", value)}>
          <SelectTrigger id="fontFamily" className="mt-2">
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent>
            {developerFonts.map((font) => (
              <SelectItem key={font.value} value={font.value}>
                {font.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="flex justify-between">
          <Label htmlFor="fontSize">Font Size: {fontSize}px</Label>
        </div>
        <Slider
          id="fontSize"
          min={12}
          max={48}
          step={1}
          value={[fontSize]}
          onValueChange={(value) => onChange("fontSize", value[0])}
          className="mt-2"
        />
      </div>

      <div>
        <div className="flex justify-between">
          <Label htmlFor="jobTitleSize">Job Title Size: {customization.jobTitleSize || 14}px</Label>
        </div>
        <Slider
          id="jobTitleSize"
          min={10}
          max={24}
          step={1}
          value={[customization.jobTitleSize || 14]}
          onValueChange={(value) => onChange("jobTitleSize", value[0])}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="customIcon">Default Icon</Label>
        <div className="flex items-center gap-2 mt-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-24 h-10 text-xl">
                {customIcon || <Smile className="h-5 w-5" />}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search emojis..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                    prefix={<Search className="h-4 w-4 text-gray-400" />}
                  />
                </div>

                {!searchTerm && (
                  <div className="flex flex-wrap gap-1">
                    {Object.keys(emojiCategories).map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="text-xs"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-7 gap-2 max-h-48 overflow-y-auto">
                  {filteredEmojis.map((emoji) => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      className="h-9 w-9 p-0 text-xl"
                      onClick={() => onIconChange(emoji)}
                      title={getEmojiDescription(emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>

                <div className="pt-2 border-t">
                  <Input
                    placeholder="Custom emoji or text"
                    value={customIcon}
                    onChange={(e) => onIconChange(e.target.value)}
                    maxLength={2}
                    className="text-center"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <span className="text-sm text-gray-500">Select an icon or enter your own</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">This is the default icon. You can customize icons per nameplate.</p>
      </div>
    </div>
  )
}

