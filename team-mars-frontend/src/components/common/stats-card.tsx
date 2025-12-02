import {
  Card,
  CardContent,
} from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

// StatsCard Component Props
interface StatsCardProps {
  icon: LucideIcon
  value?: string | number | null
  label: string
  isLoading?: boolean
}

export const StatsCard = ({ 
  icon: Icon,        // Display icon
  value,             // Stat value or default
  label,             // Stat description
  isLoading = false  // Loading state
}: StatsCardProps) => {
  return (
    <Card className="w-full border border-border shadow-md">
      <CardContent>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Icon Container */}
          <div className="w-[40px] h-[40px] bg-primary rounded-[2px] flex items-center justify-center">
            <Icon className="w-[20px] h-[20px] text-secondary" />
          </div>
          {/* Stats Text */}
          <div className="flex items-center text-left gap-[12px]">
            <span className="h4 font-bold text-foreground">
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-foreground border-t-transparent rounded-full animate-spin"></div>
              ) : (
                value ?? "-" // Show if value is null/undefined
              )}
            </span>
            <span className="paragraph-n-regular text-gray-600">{label}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}