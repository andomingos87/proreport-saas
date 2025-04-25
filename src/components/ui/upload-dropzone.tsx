import { UploadDropzone as UploadthingDropzone } from '@uploadthing/react'
import type { OurFileRouter } from '@/app/api/uploadthing/core'

interface UploadDropzoneProps {
  endpoint: keyof OurFileRouter
  onClientUploadComplete?: (res: { url: string }[]) => void
  onUploadError?: (error: Error) => void
}

export function UploadDropzone({
  endpoint,
  onClientUploadComplete,
  onUploadError
}: UploadDropzoneProps) {
  return (
    <UploadthingDropzone<OurFileRouter, typeof endpoint>
      endpoint={endpoint}
      onClientUploadComplete={onClientUploadComplete}
      onUploadError={onUploadError}
      className="ut-label:text-text-primary ut-allowed-content:text-text-secondary border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-primary transition-colors"
    />
  )
} 