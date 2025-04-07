"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Upload, Plus, Trash2, Edit, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { NameplatePreview } from "@/components/nameplate-preview"
import { NameplateCustomizer } from "@/components/nameplate-customizer"
import { useMobile } from "@/hooks/use-mobile"
import { toast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Smile, Search } from "lucide-react"

interface Nameplate {
  name: string
  jobTitle?: string
  notes?: string
  customIcon?: string
}

export default function GeneratorPage() {
  const router = useRouter()
  const isMobile = useMobile()

  // Default logo path
  const defaultLogoPath = "/finstar-favicon.png"

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>(defaultLogoPath)
  const [nameplates, setNameplates] = useState<Nameplate[]>([])
  const [nameInput, setNameInput] = useState("")
  const [jobTitleInput, setJobTitleInput] = useState("")
  const [notesInput, setNotesInput] = useState("")
  const [customIcon, setCustomIcon] = useState("")
  const [customization, setCustomization] = useState({
    primaryColor: "#0f172a",
    secondaryColor: "#ffffff", // Default white to conserve ink
    headerBackgroundColor: "#f1f5f9", // Light gray/blue for header
    fontFamily: "Inter",
    fontSize: 40, // Increased font size
    jobTitleSize: 14,
  })

  // For editing individual nameplates
  const [editingNameplate, setEditingNameplate] = useState<Nameplate | null>(null)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editName, setEditName] = useState("")
  const [editJobTitle, setEditJobTitle] = useState("")
  const [editNotes, setEditNotes] = useState("")
  const [editIcon, setEditIcon] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("Developer")
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  // For real-time preview
  const [previewNameplate, setPreviewNameplate] = useState<Nameplate | null>(null)

  const placeholderText = `John Doe
Jane Smith
Alex Johnson`;

  // Emoji categories
  const emojiCategories = {
    Developer: ["👨‍💻", "👩‍💻", "🧑‍💻", "⌨️", "🖥️", "💻", "🚀", "⚡", "🔥", "🐞", "🐛", "🧠", "🤖", "👾"],
    Tech: ["📱", "🔌", "🔋", "💾", "💿", "📀", "🖨️", "🖱️", "📷", "📹", "🎮", "🎯", "🧩"],
    Work: ["📊", "📈", "📉", "📝", "📌", "📎", "✂️", "📁", "📂", "🗂️", "📅", "🔍", "💡", "⚙️"],
    Fun: ["😄", "😎", "🤓", "🤩", "🥳", "🎉", "🎊", "🎈", "🎸", "🎮", "🎯", "🎲", "🎭", "🎨"],
    Animals: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸"],
    Food: ["☕", "🍵", "🥤", "🍺", "🍜", "🍕", "🍔", "🍟", "🌮", "🍣", "🍙", "🍦", "🍩", "🍪"],
    Symbols: ["✅", "❌", "⭐", "🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "⚫", "⚪", "🟤", "🔺", "🔻"],
  }

  // Update preview when editing inputs change
  useEffect(() => {
    if (editDialogOpen && editingNameplate) {
      // Update preview for editing mode
      setPreviewNameplate({
        name: editName,
        jobTitle: editJobTitle || undefined,
        notes: editNotes || undefined,
        customIcon: editIcon || undefined,
      })
    } else if (!editDialogOpen && nameInput) {
      // Update preview for new nameplate
      setPreviewNameplate({
        name: nameInput.split("\n")[0] || "Preview",
        jobTitle: jobTitleInput || undefined,
        notes: notesInput || undefined,
        customIcon: customIcon || undefined,
      })
    } else if (!editDialogOpen && !nameInput) {
      // Clear preview when no active editing
      setPreviewNameplate(null)
    }
  }, [nameInput,
    jobTitleInput,
    notesInput,
    customIcon,
    editingNameplate,
    editName,
    editJobTitle,
    editNotes,
    editIcon,
    editDialogOpen,])

  // Filter emojis based on search term
  const filteredEmojis = searchTerm
    ? Object.values(emojiCategories)
        .flat()
        .filter((emoji) => emoji.includes(searchTerm))
    : emojiCategories[selectedCategory as keyof typeof emojiCategories] || []

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setLogoFile(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setLogoPreview(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNamesInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNameInput(e.target.value)
  }

  const handleAddNameplates = () => {
    const namesList = nameInput
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name.length > 0)
      .map((name) => ({
        name,
        jobTitle: jobTitleInput,
        notes: notesInput,
        customIcon,
      }))

    if (namesList.length > 0) {
      setNameplates((prev) => [...prev, ...namesList])
      // Clear inputs after adding
      setNameInput("")
      // Clear preview
      setPreviewNameplate(null)
      toast({
        title: "Nameplates Added",
        description: `Added ${namesList.length} new nameplate(s)`,
      })
    }
  }

  const handleJobTitleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJobTitleInput(e.target.value)
  }

  const handleNotesInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotesInput(e.target.value)
  }

  const handleCustomizationChange = (key: string, value: any) => {
    setCustomization((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleDeleteNameplate = (index: number) => {
    setNameplates((prev) => prev.filter((_, i) => i !== index))
  }

  const handleEditNameplate = (nameplate: Nameplate, index: number) => {
    setEditingNameplate(nameplate)
    setEditIndex(index)
    setEditName(nameplate.name)
    setEditJobTitle(nameplate.jobTitle || "")
    setEditNotes(nameplate.notes || "")
    setEditIcon(nameplate.customIcon || "")
    setEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (editIndex !== null) {
      const updatedNameplates = [...nameplates]
      updatedNameplates[editIndex] = {
        name: editName,
        jobTitle: editJobTitle || undefined,
        notes: editNotes || undefined,
        customIcon: editIcon || undefined,
      }
      setNameplates(updatedNameplates)
      setEditingNameplate(null)
      setEditIndex(null)
      setEditDialogOpen(false)
      // Clear preview after saving
      setPreviewNameplate(null)
    }
  }

  const handleEditDialogChange = (open: boolean) => {
    setEditDialogOpen(open)
    if (!open) {
      // Reset when dialog is closed
      setEditingNameplate(null)
      setEditIndex(null)
      setPreviewNameplate(null)
    }
  }

  const handleContinue = () => {
    if (nameplates.length === 0) {
      toast({
        title: "No nameplates to generate",
        description: "Please add at least one name to continue",
        variant: "destructive",
      })
      return
    }

    // Store data in sessionStorage to pass to the preview page
    sessionStorage.setItem(
      "nameplateData",
      JSON.stringify({
        nameplates,
        logoPreview,
        customization,
      }),
    )

    // Navigate to the preview page
    router.push("/preview")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Create Your Nameplates</h1>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column: Tabs and input fields */}
          <div>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="customize">Customize</TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="logo">Company Logo</Label>
                        <div className="mt-2 flex items-center gap-4">
                          <Input id="logo" type="file" accept="image/*" onChange={handleLogoUpload} />
                          <div className="h-12 w-12 overflow-hidden rounded border">
                            <img
                              src={logoPreview || "/placeholder.svg"}
                              alt="Logo preview"
                              className="h-full w-full object-contain"
                            />
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Using custom default logo. Upload a new one to override.
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="names">Names (one per line)</Label>
                        <Textarea
                          id="names"
                          className="min-h-[100px] mt-2"
                          placeholder={placeholderText}
                          value={nameInput}
                          onChange={handleNamesInput}
                        />
                      </div>

                      <div>
                        <Label htmlFor="jobTitle">Job Title (applies to all)</Label>
                        <Input
                          id="jobTitle"
                          className="mt-2"
                          placeholder="Software Developer"
                          value={jobTitleInput}
                          onChange={handleJobTitleInput}
                        />
                      </div>

                      <div>
                        <Label htmlFor="notes">Notes (applies to all)</Label>
                        <Textarea
                          id="notes"
                          className="min-h-[60px] mt-2"
                          placeholder="Bitte so zurück lassen wie vorgefunden"
                          value={notesInput}
                          onChange={handleNotesInput}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Add instructions or notes that will appear on the nameplate
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="customIcon">Icon (applies to all)</Label>
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
                                      onClick={() => setCustomIcon(emoji)}
                                    >
                                      {emoji}
                                    </Button>
                                  ))}
                                </div>

                                <div className="pt-2 border-t">
                                  <Input
                                    placeholder="Custom emoji or text"
                                    value={customIcon}
                                    onChange={(e) => setCustomIcon(e.target.value)}
                                    maxLength={2}
                                    className="text-center"
                                  />
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                          <span className="text-sm text-gray-500">Select an icon or enter your own</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button onClick={handleAddNameplates} className="gap-2">
                          <Plus className="h-4 w-4" /> Add Nameplates
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="customize">
                <Card>
                  <CardContent className="pt-6">
                    <NameplateCustomizer
                      customization={customization}
                      customIcon={customIcon}
                      onIconChange={setCustomIcon}
                      onChange={handleCustomizationChange}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right column: Real-time preview */}
          <div>
            <h2 className="text-lg font-medium mb-4">Live Preview</h2>
            {previewNameplate ? (
              <NameplatePreview
                name={previewNameplate.name}
                jobTitle={previewNameplate.jobTitle}
                notes={previewNameplate.notes}
                logoUrl={logoPreview}
                customIcon={previewNameplate.customIcon}
                customization={customization}
              />
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center h-94 flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Enter a name to see a live preview</p>
              </div>
            )}
          </div>
        </div>

        {/* Nameplate List */}
        {nameplates.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Your Nameplates ({nameplates.length})</h3>
              <div className="space-y-3">
                {nameplates.map((nameplate, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{nameplate.name}</p>
                      {nameplate.jobTitle && <p className="text-sm text-gray-500">{nameplate.jobTitle}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={editDialogOpen && editIndex === index} onOpenChange={handleEditDialogChange}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => handleEditNameplate(nameplate, index)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Nameplate</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <Label htmlFor="editName">Name</Label>
                              <Input
                                id="editName"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="editJobTitle">Job Title</Label>
                              <Input
                                id="editJobTitle"
                                value={editJobTitle}
                                onChange={(e) => setEditJobTitle(e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="editNotes">Notes</Label>
                              <Textarea
                                id="editNotes"
                                value={editNotes}
                                onChange={(e) => setEditNotes(e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="editIcon">Icon</Label>
                              <div className="flex items-center gap-2 mt-1">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-24 h-10 text-xl">
                                      {editIcon || <Smile className="h-5 w-5" />}
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
                                            onClick={() => setEditIcon(emoji)}
                                          >
                                            {emoji}
                                          </Button>
                                        ))}
                                      </div>

                                      <div className="pt-2 border-t">
                                        <Input
                                          placeholder="Custom emoji or text"
                                          value={editIcon}
                                          onChange={(e) => setEditIcon(e.target.value)}
                                          maxLength={2}
                                          className="text-center"
                                        />
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleSaveEdit} className="gap-2">
                              <Check className="h-4 w-4" /> Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteNameplate(index)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end">
          <Button onClick={handleContinue} disabled={nameplates.length === 0} className="gap-2">
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}



// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { ArrowRight, Upload, Plus, Trash2, Edit, Check } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Textarea } from "@/components/ui/textarea"
// import { NameplatePreview } from "@/components/nameplate-preview"
// import { NameplateCustomizer } from "@/components/nameplate-customizer"
// import { useMobile } from "@/hooks/use-mobile"
// import { toast } from "@/hooks/use-toast"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Smile, Search } from "lucide-react"

// interface Nameplate {
//   name: string
//   jobTitle?: string
//   notes?: string
//   customIcon?: string
// }

// export default function GeneratorPage() {
//   const router = useRouter()
//   const isMobile = useMobile()

//   // Default logo path
//   const defaultLogoPath = "/finstar-favicon.png"

//   const [logoFile, setLogoFile] = useState<File | null>(null)
//   const [logoPreview, setLogoPreview] = useState<string>(defaultLogoPath)
//   const [nameplates, setNameplates] = useState<Nameplate[]>([])
//   const [nameInput, setNameInput] = useState("")
//   const [jobTitleInput, setJobTitleInput] = useState("")
//   const [notesInput, setNotesInput] = useState("")
//   const [customIcon, setCustomIcon] = useState("")
//   const [customization, setCustomization] = useState({
//     primaryColor: "#0f172a",
//     secondaryColor: "#ffffff", // Default white to conserve ink
//     headerBackgroundColor: "#f1f5f9", // Light gray/blue for header
//     fontFamily: "Inter",
//     fontSize: 40, // Increased font size
//     jobTitleSize: 14,
//   })

//   // For editing individual nameplates
//   const [editingNameplate, setEditingNameplate] = useState<Nameplate | null>(null)
//   const [editIndex, setEditIndex] = useState<number | null>(null)
//   const [editName, setEditName] = useState("")
//   const [editJobTitle, setEditJobTitle] = useState("")
//   const [editNotes, setEditNotes] = useState("")
//   const [editIcon, setEditIcon] = useState("")
//   const [searchTerm, setSearchTerm] = useState("")
//   const [selectedCategory, setSelectedCategory] = useState<string>("Developer")

//   const placeholderText = `John Doe
// Jane Smith
// Alex Johnson`;

//   // Emoji categories
//   const emojiCategories = {
//     Developer: ["👨‍💻", "👩‍💻", "🧑‍💻", "⌨️", "🖥️", "💻", "🚀", "⚡", "🔥", "🐞", "🐛", "🧠", "🤖", "👾"],
//     Tech: ["📱", "🔌", "🔋", "💾", "💿", "📀", "🖨️", "🖱️", "📷", "📹", "🎮", "🎯", "🧩"],
//     Work: ["📊", "📈", "📉", "📝", "📌", "📎", "✂️", "📁", "📂", "🗂️", "📅", "🔍", "💡", "⚙️"],
//     Fun: ["😄", "😎", "🤓", "🤩", "🥳", "🎉", "🎊", "🎈", "🎸", "🎮", "🎯", "🎲", "🎭", "🎨"],
//     Animals: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸"],
//     Food: ["☕", "🍵", "🥤", "🍺", "🍜", "🍕", "🍔", "🍟", "🌮", "🍣", "🍙", "🍦", "🍩", "🍪"],
//     Symbols: ["✅", "❌", "⭐", "🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "⚫", "⚪", "🟤", "🔺", "🔻"],
//   }

//   // Filter emojis based on search term
//   const filteredEmojis = searchTerm
//     ? Object.values(emojiCategories)
//         .flat()
//         .filter((emoji) => emoji.includes(searchTerm))
//     : emojiCategories[selectedCategory as keyof typeof emojiCategories] || []

//   const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0]
//       setLogoFile(file)

//       const reader = new FileReader()
//       reader.onload = (e) => {
//         if (e.target?.result) {
//           setLogoPreview(e.target.result as string)
//         }
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   const handleNamesInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setNameInput(e.target.value)
//   }

//   const handleAddNameplates = () => {
//     const namesList = nameInput
//       .split("\n")
//       .map((name) => name.trim())
//       .filter((name) => name.length > 0)
//       .map((name) => ({
//         name,
//         jobTitle: jobTitleInput,
//         notes: notesInput,
//         customIcon,
//       }))

//     if (namesList.length > 0) {
//       setNameplates((prev) => [...prev, ...namesList])
//       setNameInput("")
//       toast({
//         title: "Nameplates Added",
//         description: `Added ${namesList.length} new nameplate(s)`,
//       })
//     }
//   }

//   const handleJobTitleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setJobTitleInput(e.target.value)
//   }

//   const handleNotesInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setNotesInput(e.target.value)
//   }

//   const handleCustomizationChange = (key: string, value: any) => {
//     setCustomization((prev) => ({
//       ...prev,
//       [key]: value,
//     }))
//   }

//   const handleDeleteNameplate = (index: number) => {
//     setNameplates((prev) => prev.filter((_, i) => i !== index))
//   }

//   const handleEditNameplate = (nameplate: Nameplate, index: number) => {
//     setEditingNameplate(nameplate)
//     setEditIndex(index)
//     setEditName(nameplate.name)
//     setEditJobTitle(nameplate.jobTitle || "")
//     setEditNotes(nameplate.notes || "")
//     setEditIcon(nameplate.customIcon || "")
//   }

//   const handleSaveEdit = () => {
//     if (editIndex !== null) {
//       const updatedNameplates = [...nameplates]
//       updatedNameplates[editIndex] = {
//         name: editName,
//         jobTitle: editJobTitle || undefined,
//         notes: editNotes || undefined,
//         customIcon: editIcon || undefined,
//       }
//       setNameplates(updatedNameplates)
//       setEditingNameplate(null)
//       setEditIndex(null)
//     }
//   }

//   const handleContinue = () => {
//     if (nameplates.length === 0) {
//       toast({
//         title: "No nameplates to generate",
//         description: "Please add at least one name to continue",
//         variant: "destructive",
//       })
//       return
//     }

//     // Store data in sessionStorage to pass to the preview page
//     sessionStorage.setItem(
//       "nameplateData",
//       JSON.stringify({
//         nameplates,
//         logoPreview,
//         customization,
//       }),
//     )

//     // Navigate to the preview page
//     router.push("/preview")
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold">Create Your Nameplates</h1>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2">
//           <Tabs defaultValue="upload" className="w-full">
//             <TabsList className="grid w-full grid-cols-2">
//               <TabsTrigger value="upload">Upload</TabsTrigger>
//               <TabsTrigger value="customize">Customize</TabsTrigger>
//             </TabsList>

//             <TabsContent value="upload" className="space-y-6">
//               <Card>
//                 <CardContent className="pt-6">
//                   <div className="space-y-4">
//                     <div>
//                       <Label htmlFor="logo">Company Logo</Label>
//                       <div className="mt-2 flex items-center gap-4">
//                         <Input id="logo" type="file" accept="image/*" onChange={handleLogoUpload} />
//                         <div className="h-12 w-12 overflow-hidden rounded border">
//                           <img
//                             src={logoPreview || "/placeholder.svg"}
//                             alt="Logo preview"
//                             className="h-full w-full object-contain"
//                           />
//                         </div>
//                       </div>
//                       <p className="text-xs text-gray-500 mt-1">
//                         Using custom default logo. Upload a new one to override.
//                       </p>
//                     </div>

//                     <div>
//                       <Label htmlFor="names">Names (one per line)</Label>
//                       <Textarea
//                         id="names"
//                         className="min-h-[100px] mt-2"
//                         placeholder={placeholderText}
//                         value={nameInput}
//                         onChange={handleNamesInput}
//                       />
//                     </div>

//                     <div>
//                       <Label htmlFor="jobTitle">Job Title (applies to all)</Label>
//                       <Input
//                         id="jobTitle"
//                         className="mt-2"
//                         placeholder="Software Developer"
//                         value={jobTitleInput}
//                         onChange={handleJobTitleInput}
//                       />
//                     </div>

//                     <div>
//                       <Label htmlFor="notes">Notes (applies to all)</Label>
//                       <Textarea
//                         id="notes"
//                         className="min-h-[60px] mt-2"
//                         placeholder="Bitte so hinterlassen wie vorgefunden"
//                         value={notesInput}
//                         onChange={handleNotesInput}
//                       />
//                       <p className="text-xs text-gray-500 mt-1">
//                         Add instructions or notes that will appear on the nameplate
//                       </p>
//                     </div>

//                     <div>
//                       <Label htmlFor="customIcon">Icon (applies to all)</Label>
//                       <div className="flex items-center gap-2 mt-2">
//                         <Popover>
//                           <PopoverTrigger asChild>
//                             <Button variant="outline" className="w-24 h-10 text-xl">
//                               {customIcon || <Smile className="h-5 w-5" />}
//                             </Button>
//                           </PopoverTrigger>
//                           <PopoverContent className="w-80">
//                             <div className="space-y-4">
//                               <div className="flex gap-2">
//                                 <Input
//                                   placeholder="Search emojis..."
//                                   value={searchTerm}
//                                   onChange={(e) => setSearchTerm(e.target.value)}
//                                   className="flex-1"
//                                   prefix={<Search className="h-4 w-4 text-gray-400" />}
//                                 />
//                               </div>

//                               {!searchTerm && (
//                                 <div className="flex flex-wrap gap-1">
//                                   {Object.keys(emojiCategories).map((category) => (
//                                     <Button
//                                       key={category}
//                                       variant={selectedCategory === category ? "default" : "outline"}
//                                       size="sm"
//                                       onClick={() => setSelectedCategory(category)}
//                                       className="text-xs"
//                                     >
//                                       {category}
//                                     </Button>
//                                   ))}
//                                 </div>
//                               )}

//                               <div className="grid grid-cols-7 gap-2 max-h-48 overflow-y-auto">
//                                 {filteredEmojis.map((emoji) => (
//                                   <Button
//                                     key={emoji}
//                                     variant="ghost"
//                                     className="h-9 w-9 p-0 text-xl"
//                                     onClick={() => setCustomIcon(emoji)}
//                                   >
//                                     {emoji}
//                                   </Button>
//                                 ))}
//                               </div>

//                               <div className="pt-2 border-t">
//                                 <Input
//                                   placeholder="Custom emoji or text"
//                                   value={customIcon}
//                                   onChange={(e) => setCustomIcon(e.target.value)}
//                                   maxLength={2}
//                                   className="text-center"
//                                 />
//                               </div>
//                             </div>
//                           </PopoverContent>
//                         </Popover>
//                         <span className="text-sm text-gray-500">Select an icon or enter your own</span>
//                       </div>
//                     </div>

//                     <div className="pt-2">
//                       <Button onClick={handleAddNameplates} className="gap-2">
//                         <Plus className="h-4 w-4" /> Add Nameplates
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Nameplate List */}
//               {nameplates.length > 0 && (
//                 <Card>
//                   <CardContent className="pt-6">
//                     <h3 className="text-lg font-medium mb-4">Your Nameplates ({nameplates.length})</h3>
//                     <div className="space-y-3">
//                       {nameplates.map((nameplate, index) => (
//                         <div key={index} className="flex items-center justify-between p-3 border rounded-md">
//                           <div>
//                             <p className="font-medium">{nameplate.name}</p>
//                             {nameplate.jobTitle && <p className="text-sm text-gray-500">{nameplate.jobTitle}</p>}
//                           </div>
//                           <div className="flex gap-2">
//                             <Dialog>
//                               <DialogTrigger asChild>
//                                 <Button
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() => handleEditNameplate(nameplate, index)}
//                                 >
//                                   <Edit className="h-4 w-4" />
//                                 </Button>
//                               </DialogTrigger>
//                               <DialogContent>
//                                 <DialogHeader>
//                                   <DialogTitle>Edit Nameplate</DialogTitle>
//                                 </DialogHeader>
//                                 <div className="space-y-4 py-4">
//                                   <div>
//                                     <Label htmlFor="editName">Name</Label>
//                                     <Input
//                                       id="editName"
//                                       value={editName}
//                                       onChange={(e) => setEditName(e.target.value)}
//                                       className="mt-1"
//                                     />
//                                   </div>
//                                   <div>
//                                     <Label htmlFor="editJobTitle">Job Title</Label>
//                                     <Input
//                                       id="editJobTitle"
//                                       value={editJobTitle}
//                                       onChange={(e) => setEditJobTitle(e.target.value)}
//                                       className="mt-1"
//                                     />
//                                   </div>
//                                   <div>
//                                     <Label htmlFor="editNotes">Notes</Label>
//                                     <Textarea
//                                       id="editNotes"
//                                       value={editNotes}
//                                       onChange={(e) => setEditNotes(e.target.value)}
//                                       className="mt-1"
//                                     />
//                                   </div>
//                                   <div>
//                                     <Label htmlFor="editIcon">Icon</Label>
//                                     <div className="flex items-center gap-2 mt-1">
//                                       <Popover>
//                                         <PopoverTrigger asChild>
//                                           <Button variant="outline" className="w-24 h-10 text-xl">
//                                             {editIcon || <Smile className="h-5 w-5" />}
//                                           </Button>
//                                         </PopoverTrigger>
//                                         <PopoverContent className="w-80">
//                                           <div className="space-y-4">
//                                             <div className="flex gap-2">
//                                               <Input
//                                                 placeholder="Search emojis..."
//                                                 value={searchTerm}
//                                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                                 className="flex-1"
//                                                 prefix={<Search className="h-4 w-4 text-gray-400" />}
//                                               />
//                                             </div>

//                                             {!searchTerm && (
//                                               <div className="flex flex-wrap gap-1">
//                                                 {Object.keys(emojiCategories).map((category) => (
//                                                   <Button
//                                                     key={category}
//                                                     variant={selectedCategory === category ? "default" : "outline"}
//                                                     size="sm"
//                                                     onClick={() => setSelectedCategory(category)}
//                                                     className="text-xs"
//                                                   >
//                                                     {category}
//                                                   </Button>
//                                                 ))}
//                                               </div>
//                                             )}

//                                             <div className="grid grid-cols-7 gap-2 max-h-48 overflow-y-auto">
//                                               {filteredEmojis.map((emoji) => (
//                                                 <Button
//                                                   key={emoji}
//                                                   variant="ghost"
//                                                   className="h-9 w-9 p-0 text-xl"
//                                                   onClick={() => setEditIcon(emoji)}
//                                                 >
//                                                   {emoji}
//                                                 </Button>
//                                               ))}
//                                             </div>

//                                             <div className="pt-2 border-t">
//                                               <Input
//                                                 placeholder="Custom emoji or text"
//                                                 value={editIcon}
//                                                 onChange={(e) => setEditIcon(e.target.value)}
//                                                 maxLength={2}
//                                                 className="text-center"
//                                               />
//                                             </div>
//                                           </div>
//                                         </PopoverContent>
//                                       </Popover>
//                                     </div>
//                                   </div>
//                                 </div>
//                                 <DialogFooter>
//                                   <Button onClick={handleSaveEdit} className="gap-2">
//                                     <Check className="h-4 w-4" /> Save Changes
//                                   </Button>
//                                 </DialogFooter>
//                               </DialogContent>
//                             </Dialog>
//                             <Button variant="outline" size="sm" onClick={() => handleDeleteNameplate(index)}>
//                               <Trash2 className="h-4 w-4 text-red-500" />
//                             </Button>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </CardContent>
//                 </Card>
//               )}
//             </TabsContent>

//             <TabsContent value="customize">
//               <Card>
//                 <CardContent className="pt-6">
//                   <NameplateCustomizer
//                     customization={customization}
//                     customIcon={customIcon}
//                     onIconChange={setCustomIcon}
//                     onChange={handleCustomizationChange}
//                   />
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>

//           <div className="mt-6 flex justify-end">
//             <Button onClick={handleContinue} disabled={nameplates.length === 0} className="gap-2">
//               Continue <ArrowRight className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>

//         <div>
//           <div className="sticky top-6">
//             <h2 className="text-lg font-medium mb-4">Preview</h2>
//             {nameplates.length > 0 ? (
//               <div className="space-y-6">
//                 <NameplatePreview
//                   name={nameplates[0].name}
//                   jobTitle={nameplates[0].jobTitle}
//                   notes={nameplates[0].notes}
//                   logoUrl={logoPreview}
//                   customIcon={nameplates[0].customIcon}
//                   customization={customization}
//                 />
//                 {nameplates.length > 1 && (
//                   <p className="text-sm text-gray-500 text-center">+{nameplates.length - 1} more nameplates</p>
//                 )}
//               </div>
//             ) : (
//               <div className="bg-gray-50 rounded-lg p-8 text-center">
//                 <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
//                 <p className="text-gray-500">Add names to see a preview</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

