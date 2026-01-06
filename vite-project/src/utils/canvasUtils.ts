export const resizeCanvas = (canvas: HTMLCanvasElement) => {
  const { width, height } = canvas.getBoundingClientRect();

  if (width !== canvas.width || height !== canvas.height) {
    const { devicePixelRatio: ratio = 1 } = window;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    canvas.width = width * ratio;
    canvas.height = height * ratio;

    context.scale(ratio, ratio);
  }
};
