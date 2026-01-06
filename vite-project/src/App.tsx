import { useCallback } from "react";

import "./App.css";
import Canvas from "./Canvas";
import type { CanvasOptions } from "./types/canvas";
import { resizeCanvas } from "./utils/canvasUtils";

function App() {
  const options: CanvasOptions = {
    width: 1000,
    height: 1000,
    context: "2d",
  };

  const preDraw = useCallback(
    (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      context.save();
      resizeCanvas(canvas);
      const { width, height } = context.canvas;
      context.clearRect(0, 0, width, height);
    },
    []
  );

  const postDraw = useCallback(
    (index: number, context: CanvasRenderingContext2D): number | null => {
      context.restore();
      // Stop once we have a full circle (see draw()).
      const speed = 0.08; // radians per frame
      const endAngle = index * speed;
      if (endAngle >= Math.PI * 2) return null;

      return index + 1;
    },
    []
  );

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, frameCount: number) => {
      const { width, height } = ctx.canvas;
      ctx.font = "24px serif";
      ctx.fillStyle = "#000000";
      ctx.fillText(`frame count : ${frameCount}`, 10, 50);

      // Draw an arc that grows until it reaches 2π (a full circle).
      const speed = 0.08; // radians per frame
      const endAngle = Math.min(Math.PI * 2, frameCount * speed);
      const cx = width / 2;
      const cy = height / 2;
      const r = 120;

      ctx.lineWidth = 6;
      ctx.strokeStyle = "#111111";
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, endAngle);
      ctx.stroke();
    },
    []
  );

  return (
    <main className="main-container">
      <div className="titleContainer">
        <h1>Helloasad World</h1>
      </div>
      <div className="canvasContainer">
        <Canvas
          draw={draw}
          options={options}
          preDraw={preDraw}
          postDraw={postDraw}
        />
      </div>
    </main>
  );
}

export default App;
