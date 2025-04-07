"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Printer } from "lucide-react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

import { Button } from "@/components/ui/button"
import { NameplateGrid } from "@/components/nameplate-grid"
import { toast } from "@/hooks/use-toast"

// Update the Nameplate interface to remove status
interface Nameplate {
  name: string
  jobTitle?: string
  notes?: string
  customIcon?: string
}

export default function PreviewPage() {
  const gridRef = useRef<HTMLDivElement>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [nameplateData, setNameplateData] = useState<{
    nameplates: Nameplate[]
    logoPreview: string
    customization: {
      primaryColor: string
      secondaryColor: string
      headerBackgroundColor: string
      fontFamily: string
      fontSize: number
      jobTitleSize?: number
    }
  } | null>(null)

  useEffect(() => {
    // Get data from sessionStorage
    const storedData = sessionStorage.getItem("nameplateData")
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        setNameplateData(parsedData)
      } catch (error) {
        console.error("Error parsing nameplate data:", error)
        toast({
          title: "Error loading data",
          description: "There was a problem loading your nameplate data.",
          variant: "destructive",
        })
      }
    }
  }, [])

  const handlePrint = () => {
    window.print()
  }

  const handleGeneratePDF = async () => {
    if (!gridRef.current || !nameplateData) return

    setIsGeneratingPDF(true)

    try {
      // Create a PDF document (portrait A4)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // A4 portrait dimensions
      const pageWidth = 210
      const pageHeight = 297

      // Calculate nameplate dimensions (full width, 1/5 height with margins)
      const margin = 5 // 10mm margin
      const nameplateWidth = pageWidth - margin * 2
      const nameplateHeight = (pageHeight - margin * 2) / 4 - 5 // 4 per page with small gap

      // Create each nameplate directly in the PDF
      const { nameplates, logoPreview, customization } = nameplateData
      const {
        primaryColor,
        secondaryColor,
        headerBackgroundColor,
        fontFamily,
        fontSize,
        jobTitleSize = 14,
      } = customization

      // Calculate how many pages we need
      const itemsPerPage = 4
      const pageCount = Math.ceil(nameplates.length / itemsPerPage)

      // Generate each page
      for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
        // Add a new page for each page (except the first one)
        if (pageIndex > 0) {
          pdf.addPage()
        }

        // Get nameplates for this page
        const pageNameplates = nameplates.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)

        // Create a temporary div for rendering nameplates
        const tempDiv = document.createElement("div")
        tempDiv.style.position = "absolute"
        tempDiv.style.left = "-9999px"
        tempDiv.style.width = `${nameplateWidth}mm`
        tempDiv.style.backgroundColor = "white"
        document.body.appendChild(tempDiv)

        // Generate each nameplate on the page
        for (let i = 0; i < pageNameplates.length; i++) {
          const nameplate = pageNameplates[i]
          const yPosition = margin + i * (nameplateHeight + 5)

          // Status indicator colors and text
          const statusColors = {
            free: "#22c55e", // green
            reserved: "#eab308", // yellow
            occupied: "#ef4444", // red
          }

          const statusText = {
            free: "Free",
            reserved: `Reserved for ${nameplate.name}`,
            occupied: "Occupied by Guest",
          }

          const status = "free"

          // Create nameplate HTML
          tempDiv.innerHTML = `
          <div style="
            width: 100%;
            height: ${nameplateHeight}mm;
            border: 1px solid #000;
            border-radius: 4px;
            overflow: hidden;
            background-color: ${secondaryColor};
            color: ${primaryColor};
            font-family: ${fontFamily || "Arial"};
          ">
            <!-- Header with logo and name -->
            <div style="
              display: flex;
              align-items: center;
              padding: 10px;
              border-bottom: 1px solid #000;
              height: 40%;
              background-color: ${headerBackgroundColor};
            ">
              <div style="
                width: 40px;
                height: 40px;
                flex-shrink: 0;
                overflow: hidden;
              ">
                <img 
                  src="${logoPreview}" 
                  alt="Company logo" 
                  style="width: 100%; height: 100%; object-fit: contain;"
                />
              </div>
              <div style="margin-left: 10px; flex: 1;">
                <h3 style="
                  font-size: ${Math.max(fontSize, 24)}px;
                  font-weight: bold;
                  margin: 5px 0;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                ">${nameplate.name}</h3>
                ${
                  nameplate.jobTitle
                    ? `
                  <p style="
                    font-size: ${jobTitleSize}px;
                    margin: 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  ">${nameplate.jobTitle}</p>
                `
                    : ""
                }
              </div>
              ${
                nameplate.customIcon
                  ? `
                <div style="margin-left: 10px; font-size: 24px;">
                  ${nameplate.customIcon}
                </div>
              `
                  : ""
              }
            </div>
            
            <!-- Attendance tracking section -->
            <div style="
              padding: 10px;
              border-bottom: 1px solid #000;
              height: 25%;
            ">
              <div style="
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 5px;
              ">
                <div style="text-align: center; font-size: 12px; font-weight: bold;">Mon</div>
                <div style="text-align: center; font-size: 12px; font-weight: bold;">Tue</div>
                <div style="text-align: center; font-size: 12px; font-weight: bold;">Wed</div>
                <div style="text-align: center; font-size: 12px; font-weight: bold;">Thu</div>
                <div style="text-align: center; font-size: 12px; font-weight: bold;">Fri</div>
                
                <div style="text-align: center;">
                  <div style="
                    width: 20px;
                    height: 20px;
                    border: 1px solid #000;
                    border-radius: 50%;
                    margin: 0 auto;
                  "></div>
                </div>
                <div style="text-align: center;">
                  <div style="
                    width: 20px;
                    height: 20px;
                    border: 1px solid #000;
                    border-radius: 50%;
                    margin: 0 auto;
                  "></div>
                </div>
                <div style="text-align: center;">
                  <div style="
                    width: 20px;
                    height: 20px;
                    border: 1px solid #000;
                    border-radius: 50%;
                    margin: 0 auto;
                  "></div>
                </div>
                <div style="text-align: center;">
                  <div style="
                    width: 20px;
                    height: 20px;
                    border: 1px solid #000;
                    border-radius: 50%;
                    margin: 0 auto;
                  "></div>
                </div>
                <div style="text-align: center;">
                  <div style="
                    width: 20px;
                    height: 20px;
                    border: 1px solid #000;
                    border-radius: 50%;
                    margin: 0 auto;
                  "></div>
                </div>
              </div>
              
              <div style="
                text-align: right;
                font-size: 10px;
                color: #666;
                margin-top: 5px;
              ">
                (Velcro Strip)
              </div>
            </div>
            
            ${
              nameplate.notes
                ? `
            <!-- Notes section -->
            <div style="
              padding: 10px;
              border-bottom: 1px solid #000;
              background-color: #f9fafb;
              font-style: italic;
              color: #4b5563;
              font-size: 12px;
            ">
              ${nameplate.notes}
            </div>
            `
                : ""
            }
            
            <!-- Status indicators -->
            <div style="
              padding: 10px;
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              font-size: 12px;
            ">
              <div style="
                display: flex;
                align-items: center;
                padding: 4px 12px;
                border-radius: 9999px;
                background-color: #dcfce7;
                color: #166534;
              ">
                <span style="
                  display: inline-block;
                  width: 8px;
                  height: 8px;
                  border-radius: 50%;
                  background-color: #22c55e;
                  margin-right: 8px;
                "></span>
                <span>Free</span>
              </div>
              
              <div style="
                display: flex;
                align-items: center;
                padding: 4px 12px;
                border-radius: 9999px;
                background-color: #fef9c3;
                color: #854d0e;
              ">
                <span style="
                  display: inline-block;
                  width: 8px;
                  height: 8px;
                  border-radius: 50%;
                  background-color: #eab308;
                  margin-right: 8px;
                "></span>
                <span>Reserved for ${nameplate.name}</span>
              </div>
              
              <div style="
                display: flex;
                align-items: center;
                padding: 4px 12px;
                border-radius: 9999px;
                background-color: #fee2e2;
                color: #991b1b;
              ">
                <span style="
                  display: inline-block;
                  width: 8px;
                  height: 8px;
                  border-radius: 50%;
                  background-color: #ef4444;
                  margin-right: 8px;
                "></span>
                <span>Occupied by Guest</span>
              </div>
            </div>
          </div>
        `

          // Convert to canvas
          const canvas = await html2canvas(tempDiv, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            logging: false,
            backgroundColor: "white",
          })

          // Add to PDF
          const imgData = canvas.toDataURL("image/png")
          pdf.addImage(imgData, "PNG", 0, 0, pageWidth, canvas.height * (pageWidth / canvas.width))

          // pdf.addImage(imgData, "PNG", margin, yPosition, nameplateWidth, nameplateHeight)
        }

        // Clean up
        document.body.removeChild(tempDiv)
      }

      // Save the PDF
      pdf.save("nameplates.pdf")

      toast({
        title: "PDF Generated",
        description: `Successfully created PDF with ${nameplateData.nameplates.length} nameplate${nameplateData.nameplates.length > 1 ? "s" : ""}`,
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "Error generating PDF",
        description: "There was a problem creating your PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  if (!nameplateData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">No nameplate data found</h1>
        <p className="text-gray-600 mb-6">Please go back to the generator page to create your nameplates.</p>
        <Link href="/generator">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Generator
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 print:py-0">
      <div className="print:hidden">
        <div className="flex items-center justify-between mb-6">
          <Link href="/generator">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Editor
            </Button>
          </Link>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" /> Print
            </Button>

            <Button onClick={handleGeneratePDF} disabled={isGeneratingPDF} className="gap-2">
              <Download className="h-4 w-4" />
              {isGeneratingPDF ? "Generating PDF..." : "Download PDF"}
            </Button>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6 mb-6">
          <h1 className="text-xl font-bold mb-4">Your Nameplates</h1>
          <p className="text-gray-600 mb-6">
            {nameplateData.nameplates.length} nameplates ready for printing. Each page contains up to 4 nameplates.
          </p>

          <div ref={gridRef} className="nameplate-grid">
            <NameplateGrid
              nameplates={nameplateData.nameplates}
              logoUrl={nameplateData.logoPreview}
              customization={nameplateData.customization}
            />
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-medium mb-2">Printing Instructions</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Print on A4 paper in portrait orientation</li>
            <li>Use high-quality paper (recommended: 250gsm)</li>
            <li>Cut along the outer edges of each nameplate</li>
            <li>For best results, laminate after cutting</li>
            <li>Attach velcro strips to the back for the attendance tracking section</li>
          </ul>
        </div>
      </div>

      {/* Print-only view */}
      <div className="hidden print:block">
        <NameplateGrid
          nameplates={nameplateData.nameplates}
          logoUrl={nameplateData.logoPreview}
          customization={nameplateData.customization}
        />
      </div>
    </div>
  )
}

