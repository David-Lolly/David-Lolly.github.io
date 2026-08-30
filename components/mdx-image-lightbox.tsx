"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

export function MdxImageLightbox({
  alt,
  src,
  className,
  style,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [open, setOpen] = React.useState(false)
  const description = alt?.trim() || "博客正文图片"

  if (!src) {
    return null
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          className="group my-6 block w-full cursor-zoom-in rounded-lg border-0 bg-transparent p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
          aria-label={`放大查看图片：${description}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            {...props}
            src={src}
            alt={alt || ""}
            loading={props.loading ?? "lazy"}
            decoding={props.decoding ?? "async"}
            className={cn(
              "block w-full rounded-lg transition duration-200 group-hover:brightness-90 group-focus-visible:brightness-90",
              className
            )}
            style={{
              ...style,
              margin: 0,
              boxShadow: "var(--shadow-md)",
            }}
          />
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed inset-0 z-[51] flex items-center justify-center p-4 outline-none sm:p-8"
          onClick={() => setOpen(false)}
        >
          <DialogPrimitive.Title className="sr-only">
            图片预览
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            {description}
          </DialogPrimitive.Description>

          <div
            className="flex max-h-full max-w-full items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              {...props}
              src={src}
              alt={alt || ""}
              decoding={props.decoding ?? "async"}
              className="max-h-[calc(100dvh-4rem)] max-w-[calc(100vw-2rem)] rounded-sm object-contain shadow-2xl sm:max-h-[calc(100dvh-5rem)] sm:max-w-[calc(100vw-4rem)]"
              style={style}
            />
          </div>

          <DialogPrimitive.Close asChild>
            <button
              type="button"
              className="fixed right-4 top-4 z-[52] flex size-11 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:right-6 sm:top-6"
              aria-label="关闭图片预览"
              onClick={(event) => event.stopPropagation()}
            >
              <X className="size-6" aria-hidden="true" />
            </button>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
