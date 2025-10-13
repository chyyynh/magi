import type React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react"

interface MetricCardProps {
  title: string
  score: number
  icon: React.ReactNode
  status: "healthy" | "moderate" | "critical"
  metrics: { label: string; value: string }[]
}

export function MetricCard({ title, score, icon, status, metrics }: MetricCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-success border-success/30 bg-success/5"
      case "moderate":
        return "text-warning border-warning/30 bg-warning/5"
      case "critical":
        return "text-danger border-danger/30 bg-danger/5"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle2 className="h-3 w-3" />
      case "moderate":
        return <AlertTriangle className="h-3 w-3" />
      case "critical":
        return <XCircle className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <Card className="group relative overflow-hidden border-primary/20 bg-card/50 p-4 backdrop-blur transition-all hover:border-primary/40">
      <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-primary">{icon}</div>
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">{title}</h4>
        </div>
        <Badge
          variant="outline"
          className={`flex items-center gap-1 border font-mono text-xs ${getStatusColor(status)}`}
        >
          {getStatusIcon(status)}
          {score}
        </Badge>
      </div>

      <div className="space-y-2">
        {metrics.map((metric, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="font-mono text-xs text-muted-foreground">{metric.label}</span>
            <span className="font-mono text-xs font-semibold text-foreground">{metric.value}</span>
          </div>
        ))}
      </div>

      {/* Scan line effect */}
      <div className="absolute inset-0 -translate-y-full animate-scan bg-gradient-to-b from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100" />
    </Card>
  )
}
