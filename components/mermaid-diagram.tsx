"use client"

import * as React from "react"
import { AlertCircle, Maximize2, Minimize2, Minus, Plus } from "lucide-react"
import { useTheme } from "next-themes"

const MIN_SCALE = 0.5
const MAX_SCALE = 3
const SCALE_STEP = 0.2

interface MermaidDiagramProps {
  chart: string
}

interface Position {
  x: number
  y: number
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

const getThemeVariables = (isDark: boolean) =>
  isDark
    ? {
        background: "#09090b",
        primaryColor: "#18181b",
        primaryTextColor: "#f4f6f9",
        primaryBorderColor: "#71717a",
        secondaryColor: "#27272a",
        secondaryTextColor: "#f4f6f9",
        secondaryBorderColor: "#71717a",
        tertiaryColor: "#18181b",
        tertiaryTextColor: "#f4f6f9",
        tertiaryBorderColor: "#52525b",
        lineColor: "#a1a1aa",
        textColor: "#f4f6f9",
        mainBkg: "#18181b",
        nodeBorder: "#71717a",
        clusterBkg: "#27272a",
        clusterBorder: "#52525b",
        edgeLabelBackground: "#18181b",
        fontFamily: "var(--font-sans)",
        fontSize: "14px",
      }
    : {
        background: "#f5f5d5",
        primaryColor: "#fafae4",
        primaryTextColor: "#222222",
        primaryBorderColor: "#9b8b55",
        secondaryColor: "#f0f0d7",
        secondaryTextColor: "#222222",
        secondaryBorderColor: "#b0a16f",
        tertiaryColor: "#f5f5d5",
        tertiaryTextColor: "#222222",
        tertiaryBorderColor: "#c9bd91",
        lineColor: "#5b4b2a",
        textColor: "#222222",
        mainBkg: "#fafae4",
        nodeBorder: "#9b8b55",
        clusterBkg: "#f0f0d7",
        clusterBorder: "#b0a16f",
        edgeLabelBackground: "#f5f5d5",
        fontFamily: "var(--font-sans)",
        fontSize: "14px",
      }

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const { resolvedTheme } = useTheme()
  const viewerRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLDivElement>(null)
  const diagramRef = React.useRef<HTMLDivElement>(null)
  const dragStartRef = React.useRef<Position | null>(null)
  const positionStartRef = React.useRef<Position>({ x: 0, y: 0 })
  const bindFunctionsRef = React.useRef<((element: Element) => void) | null>(null)
  const renderId = React.useId().replace(/[^a-zA-Z0-9_-]/g, "")
  const [svg, setSvg] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [scale, setScale] = React.useState(1)
  const [position, setPosition] = React.useState<Position>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = React.useState(false)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const isDark = resolvedTheme === "dark"

  const constrainPosition = React.useCallback((next: Position, nextScale = scale) => {
    const canvas = canvasRef.current
    if (!canvas || nextScale <= 1) return { x: 0, y: 0 }

    const maxX = (canvas.clientWidth * (nextScale - 1)) / 2
    const maxY = (canvas.clientHeight * (nextScale - 1)) / 2

    return {
      x: clamp(next.x, -maxX, maxX),
      y: clamp(next.y, -maxY, maxY),
    }
  }, [scale])

  const applyScale = React.useCallback((nextScale: number) => {
    const normalizedScale = Math.round(clamp(nextScale, MIN_SCALE, MAX_SCALE) * 10) / 10
    setScale(normalizedScale)
    setPosition((current) => constrainPosition(current, normalizedScale))
  }, [constrainPosition])

  const resetView = React.useCallback(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [])

  React.useEffect(() => {
    let cancelled = false

    const renderDiagram = async () => {
      setError(null)
      setSvg("")
      bindFunctionsRef.current = null

      try {
        const { default: mermaid } = await import("mermaid")
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          suppressErrorRendering: true,
          theme: "base",
          themeVariables: getThemeVariables(isDark),
          flowchart: {
            htmlLabels: true,
            useMaxWidth: true,
            nodeSpacing: 32,
            rankSpacing: 36,
            diagramPadding: 8,
          },
        })

        const result = await mermaid.render(`mermaid-${renderId}`, chart)
        if (cancelled) return

        bindFunctionsRef.current = result.bindFunctions ?? null
        setSvg(result.svg)
      } catch (renderError) {
        if (cancelled) return
        const message = renderError instanceof Error ? renderError.message : "未知渲染错误"
        setError(message)
      }
    }

    void renderDiagram()
    return () => {
      cancelled = true
    }
  }, [chart, isDark, renderId])

  React.useEffect(() => {
    if (!svg || !diagramRef.current) return

    const svgElement = diagramRef.current.querySelector("svg")
    if (svgElement) {
      const intrinsicWidth = svgElement.viewBox.baseVal.width
      svgElement.removeAttribute("height")
      svgElement.style.display = "block"
      svgElement.style.width = intrinsicWidth > 0
        ? `min(100%, ${Math.ceil(intrinsicWidth)}px)`
        : "100%"
      svgElement.style.height = "auto"
      svgElement.style.maxWidth = "100%"
      svgElement.style.margin = "0 auto"
    }

    bindFunctionsRef.current?.(diagramRef.current)
  }, [svg])

  React.useEffect(() => {
    resetView()
  }, [chart, resetView])

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === viewerRef.current)
      requestAnimationFrame(() => {
        setPosition((current) => constrainPosition(current))
      })
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [constrainPosition])

  React.useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return

    const handleWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return
      event.preventDefault()
      applyScale(scale + (event.deltaY < 0 ? SCALE_STEP : -SCALE_STEP))
    }

    viewer.addEventListener("wheel", handleWheel, { passive: false })
    return () => viewer.removeEventListener("wheel", handleWheel)
  }, [applyScale, scale])

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (scale <= 1 || event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragStartRef.current = { x: event.clientX, y: event.clientY }
    positionStartRef.current = position
    setIsDragging(true)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current || !isDragging) return
    const next = {
      x: positionStartRef.current.x + event.clientX - dragStartRef.current.x,
      y: positionStartRef.current.y + event.clientY - dragStartRef.current.y,
    }
    setPosition(constrainPosition(next))
  }

  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    dragStartRef.current = null
    setIsDragging(false)
  }

  const toggleFullscreen = async () => {
    if (!viewerRef.current) return
    if (document.fullscreenElement === viewerRef.current) {
      await document.exitFullscreen()
    } else {
      await viewerRef.current.requestFullscreen()
    }
  }

  return (
    <div ref={viewerRef} className="mermaid-viewer group/mermaid my-6" data-theme={isDark ? "dark" : "light"}>
      <div className="mermaid-toolbar" role="toolbar" aria-label="图表查看工具">
        <button
          type="button"
          className="mermaid-tool-button"
          onClick={() => applyScale(scale - SCALE_STEP)}
          disabled={scale <= MIN_SCALE}
          aria-label="缩小图表"
          title="缩小图表"
        >
          <Minus aria-hidden="true" />
        </button>
        <button
          type="button"
          className="mermaid-scale-button"
          onClick={resetView}
          aria-label={`重置图表缩放，当前 ${Math.round(scale * 100)}%`}
          title="重置为适应容器"
        >
          {Math.round(scale * 100)}%
        </button>
        <button
          type="button"
          className="mermaid-tool-button"
          onClick={() => applyScale(scale + SCALE_STEP)}
          disabled={scale >= MAX_SCALE}
          aria-label="放大图表"
          title="放大图表"
        >
          <Plus aria-hidden="true" />
        </button>
        <button
          type="button"
          className="mermaid-tool-button"
          onClick={() => void toggleFullscreen()}
          aria-label={isFullscreen ? "退出全屏查看" : "全屏查看图表"}
          title={isFullscreen ? "退出全屏查看（Esc）" : "全屏查看图表"}
        >
          {isFullscreen ? <Minimize2 aria-hidden="true" /> : <Maximize2 aria-hidden="true" />}
        </button>
      </div>

      <div
        ref={canvasRef}
        className={`mermaid-canvas${scale > 1 ? " is-zoomed" : ""}${isDragging ? " is-dragging" : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        role="region"
        aria-label="可缩放的 Mermaid 图表"
      >
        {error ? (
          <div className="mermaid-error" role="alert">
            <div className="mermaid-error-title">
              <AlertCircle aria-hidden="true" />
              Mermaid 图表渲染失败
            </div>
            <p>{error}</p>
            <details>
              <summary>查看图表源码</summary>
              <pre>{chart}</pre>
            </details>
          </div>
        ) : svg ? (
          <div
            ref={diagramRef}
            className="mermaid-diagram"
            style={{
              transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
            }}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <div className="mermaid-loading" role="status" aria-live="polite">
            正在渲染图表…
          </div>
        )}
      </div>

    </div>
  )
}
