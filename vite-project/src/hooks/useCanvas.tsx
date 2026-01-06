import { useRef, useEffect } from "react";
import type { CanvasOptions } from "../types/canvas";

interface useCanvasProps {
  draw: (ctx: CanvasRenderingContext2D, frameCount: number) => void;
  options: CanvasOptions;
  preDraw: (
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => void;
  /**
   * Return the next frameCount to continue animation, or `null` to stop.
   */
  postDraw: (index: number, context: CanvasRenderingContext2D) => number | null;
}

const useCanvas = ({ draw, options, preDraw, postDraw }: useCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext(
      options.context
    ) as CanvasRenderingContext2D;

    if (!context) return;

    let frameCount: number = 0;
    let animationFrameId: number;

    const render = () => {
      preDraw(context, canvas);
      draw(context, frameCount);
      const nextFrameCount = postDraw(frameCount, context);
      if (nextFrameCount == null) return;

      frameCount = nextFrameCount;
      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw, preDraw, postDraw, options]);

  return canvasRef;
};

export default useCanvas;
