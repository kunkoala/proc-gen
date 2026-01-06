import "./Canvas.css";
import useCanvas from "./hooks/useCanvas";
import type { CanvasOptions } from "./types/canvas";

interface CanvasProps {
  draw: (ctx: CanvasRenderingContext2D, frameCount: number) => void;
  options: CanvasOptions;
  preDraw: (
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => void;
  postDraw: (index: number, context: CanvasRenderingContext2D) => number | null;
}

export default function Canvas({
  draw,
  options,
  preDraw,
  postDraw,
}: CanvasProps) {
  const canvasRef = useCanvas({ draw, options, preDraw, postDraw });

  return <canvas ref={canvasRef} id="canvas" className="canvas" />;
}
