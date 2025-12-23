"use client"

import { ChevronRight, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface BreadcrumbItem {
  id: string
  name: string
}

interface FolderBreadcrumbsProps {
  breadcrumbs: BreadcrumbItem[]
}

export function FolderBreadcrumbs({ breadcrumbs }: FolderBreadcrumbsProps) {
  const router = useRouter()

  const handleNavigate = (folderId: string | null) => {
    if (folderId === null) {
      router.push("/folder")
    } else {
      router.push(`/folder?id=${folderId}`)
    }
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home link */}
        <BreadcrumbItem>
          <BreadcrumbLink
            href="#"
            onClick={(e) => {
              e.preventDefault()
              handleNavigate(null)
            }}
            className="hover:text-[#2563EB] focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded flex items-center gap-1"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1

          return (
            <div key={crumb.id} className="flex items-center">
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="font-semibold">{crumb.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      handleNavigate(crumb.id)
                    }}
                    className="hover:text-[#2563EB] focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded"
                  >
                    {crumb.name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export { FolderBreadcrumbs as Breadcrumbs }
