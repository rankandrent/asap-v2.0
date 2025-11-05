import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils"

interface PartImagesProps {
  images?: string[]
  productname: string
}

export default function PartImages({ images, productname }: PartImagesProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No image available</p>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden">
        <img
          src={images[currentImageIndex]}
          alt={`${productname} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-contain"
        />
        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={cn(
                "flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden",
                index === currentImageIndex
                  ? "border-primary"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

