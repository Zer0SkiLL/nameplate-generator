import { Circle } from "lucide-react"

interface NameplatePreviewProps {
  name: string
  jobTitle?: string
  notes?: string
  status?: "free" | "reserved" | "occupied"
  logoUrl: string
  customIcon?: string
  customization: {
    primaryColor: string
    secondaryColor: string
    headerBackgroundColor: string
    fontFamily: string
    fontSize: number
    jobTitleSize?: number
  }
  compact?: boolean
}

export function NameplatePreview({
  name,
  jobTitle,
  notes,
  status = "free",
  logoUrl,
  customIcon,
  customization,
  compact = false,
}: NameplatePreviewProps) {
  const { primaryColor, secondaryColor, headerBackgroundColor, fontFamily, fontSize, jobTitleSize = 14 } = customization

  // Status indicator colors
  const statusColors = {
    free: "bg-green-500",
    reserved: "bg-yellow-500",
    occupied: "bg-red-500",
  }

  // Status text
  const statusText = {
    free: "Free",
    reserved: `Reserved for ${name}`,
    occupied: "Occupied by Guest",
  }

  // Default logo path
  const defaultLogoPath = "/finstar-favicon.png"
  const defaultLogoAlt = "Default Logo"

  return (
    <div
      className={`border rounded-lg overflow-hidden shadow-sm print:shadow-none ${compact ? "max-w-full" : ""}`}
      style={{
        fontFamily: fontFamily || "Inter",
        backgroundColor: secondaryColor,
        color: primaryColor,
      }}
    >
      {/* Header with logo and name */}
      <div
        className={`flex items-center ${compact ? "p-3" : "p-4"} border-b`}
        style={{ backgroundColor: headerBackgroundColor }}
      >
        <div className={`${compact ? "w-12 h-12" : "w-16 h-16"} flex-shrink-0 overflow-hidden`}>
        <img src={logoUrl || defaultLogoPath} alt= {defaultLogoAlt} className="w-full h-full object-contain" />
        </div>
        <div className="ml-3 flex-1">
          <h3
            className="font-bold truncate my-1"
            style={{ fontSize: compact ? `${Math.max(fontSize - 4, 16)}px` : `${fontSize}px` }}
          >
            {name}
          </h3>
          {jobTitle && (
            <p
              className="truncate text-opacity-80"
              style={{ fontSize: compact ? `${Math.max(jobTitleSize - 2, 12)}px` : `${jobTitleSize}px` }}
            >
              {jobTitle}
            </p>
          )}
        </div>
        {customIcon && <div className={`ml-3 ${compact ? "text-xl" : "text-2xl"}`}>{customIcon}</div>}
      </div>

      {/* Attendance tracking section */}
      <div className={`${compact ? "p-3" : "p-4"} border-b`}>
        <div className="grid grid-cols-5 gap-1">
          <div className={`text-center ${compact ? "text-xs" : "text-sm"} font-medium`}>Mon</div>
          <div className={`text-center ${compact ? "text-xs" : "text-sm"} font-medium`}>Tue</div>
          <div className={`text-center ${compact ? "text-xs" : "text-sm"} font-medium`}>Wed</div>
          <div className={`text-center ${compact ? "text-xs" : "text-sm"} font-medium`}>Thu</div>
          <div className={`text-center ${compact ? "text-xs" : "text-sm"} font-medium`}>Fri</div>

          <div className="text-center">
            <Circle className={`mx-auto ${compact ? "h-5 w-5" : "h-6 w-6"} stroke-1`} />
          </div>
          <div className="text-center">
            <Circle className={`mx-auto ${compact ? "h-5 w-5" : "h-6 w-6"} stroke-1`} />
          </div>
          <div className="text-center">
            <Circle className={`mx-auto ${compact ? "h-5 w-5" : "h-6 w-6"} stroke-1`} />
          </div>
          <div className="text-center">
            <Circle className={`mx-auto ${compact ? "h-5 w-5" : "h-6 w-6"} stroke-1`} />
          </div>
          <div className="text-center">
            <Circle className={`mx-auto ${compact ? "h-5 w-5" : "h-6 w-6"} stroke-1`} />
          </div>
        </div>

        <div className={`mt-1 text-right ${compact ? "text-[10px]" : "text-xs"} text-gray-500`}>(Velcro Strip)</div>
      </div>

      {/* Notes section (if provided) */}
      {notes && (
        <div
          className={`${compact ? "px-3 py-2" : "px-4 py-3"} border-b bg-gray-50 italic text-gray-700 ${compact ? "text-xs" : "text-sm"}`}
        >
          {notes}
        </div>
      )}

      {/* Status indicators */}
      <div
        className={`${compact ? "p-3" : "p-4"} flex items-center justify-between ${compact ? "text-xs" : "text-sm"}`}
      >
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
            <span className="inline-block w-2 h-2 rounded-full mr-2 bg-green-500"></span>
            <span>Free</span>
          </div>
          <div className="flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
            <span className="inline-block w-2 h-2 rounded-full mr-2 bg-yellow-500"></span>
            <span>Reserved for {name}</span>
          </div>
          <div className="flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800">
            <span className="inline-block w-2 h-2 rounded-full mr-2 bg-red-500"></span>
            <span>Occupied by Guest</span>
          </div>
        </div>
      </div>
    </div>
  )
}

