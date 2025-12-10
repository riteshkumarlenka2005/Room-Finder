import type { ReactNode } from "react"

interface FormSectionCardProps {
  icon: ReactNode
  title: string
  description: string
  children: ReactNode
}

export function FormSectionCard({ icon, title, description, children }: FormSectionCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden transition-shadow duration-200 hover:shadow-md">
      <div className="bg-gradient-to-r from-[#2563EB]/5 to-transparent border-b border-border p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
            {icon}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}
