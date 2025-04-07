import { NameplatePreview } from "./nameplate-preview"

interface NameplateData {
  name: string
  jobTitle?: string
  notes?: string
  customIcon?: string
}

interface NameplateGridProps {
  nameplates: NameplateData[]
  logoUrl: string
  customization: {
    primaryColor: string
    secondaryColor: string
    headerBackgroundColor: string
    fontFamily: string
    fontSize: number
    jobTitleSize?: number
  }
  itemsPerPage?: number
}

export function NameplateGrid({ nameplates, logoUrl, customization, itemsPerPage = 4 }: NameplateGridProps) {
  // Calculate how many pages we need
  const pageCount = Math.ceil(nameplates.length / itemsPerPage)

  // Create an array of pages
  const pages = Array.from({ length: pageCount }, (_, pageIndex) => {
    // Get the nameplates for this page
    const pageNameplates = nameplates.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)

    return { pageIndex, pageNameplates }
  })

  return (
    <div className="space-y-12 print:space-y-0">
      {pages.map(({ pageIndex, pageNameplates }) => (
        <div key={pageIndex} className="page-break bg-white border rounded-lg p-6 print:p-0 print:border-0">
          <div className="grid grid-cols-1 gap-8 w-full">
            {pageNameplates.map((nameplate, nameplateIndex) => (
              <div key={`${pageIndex}-${nameplateIndex}`} className="print:break-inside-avoid">
                <NameplatePreview
                  name={nameplate.name}
                  jobTitle={nameplate.jobTitle}
                  notes={nameplate.notes}
                  logoUrl={logoUrl}
                  customIcon={nameplate.customIcon}
                  customization={customization}
                  compact={true}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

