import { useMemo, useState } from "react";
import { Application, extend } from "@pixi/react";
import {
  Container,
  Graphics,
  Sprite,
  Polygon,
  type StrokeStyle,
  FillGradient,
  type FederatedPointerEvent,
} from "pixi.js";

import {
  defineHex,
  Grid,
  rectangle,
  type AxialCoordinates,
} from "honeycomb-grid";

import { useCallback } from "react";

// extend tells @pixi/react what Pixi.js components are available
extend({
  Container,
  Graphics,
  Sprite,
  Polygon,
  FillGradient,
});

// Docs:
// https://abbekeultjes.nl/honeycomb/guide/rendering.html
// https://react.pixijs.io/components/pixi-components/

const GridContainer = () => {
  // you may want the origin to be the top left corner of a hex's bounding box
  // instead of its center (which is the default)
  const [clickedHex, setClickedHex] = useState<AxialCoordinates | null>(null);

  const Hex = useMemo(
    () => defineHex({ dimensions: 80, origin: "topLeft" }),
    []
  );

  const grid = useMemo(() => {
    return new Grid(Hex, rectangle({ width: 6, height: 5 }));
  }, []);

  const gradient = useMemo(() => {
    const g = new FillGradient(0, 0, 60, 0);
    g.addColorStop(0, 0xff0000);
    g.addColorStop(1, 0x0000ff);

    return g;
  }, []);

  const strokeStyle = useMemo<StrokeStyle>(
    () => ({ width: 1, color: 0x999999, alpha: 1 }),
    []
  );

  const draw = useCallback(
    (g: Graphics) => {
      g.clear();

      grid.forEach((hex) => {
        g.poly(hex.corners).fill(gradient).stroke(strokeStyle);
      });
    },
    [grid, gradient, strokeStyle]
  );

  const drawSelection = useCallback(
    (g: Graphics) => {
      g.clear();
      if (!clickedHex) return;

      const hex = grid.getHex(clickedHex);
      if (!hex) return;

      g.poly(hex.corners)
        .fill(0x00ff00, 0.55)
        .stroke({ width: 2, color: 0x006600, alpha: 1 });
    },
    [grid, clickedHex]
  );

  const onClick = useCallback(
    (event: FederatedPointerEvent) => {
      const coords = event.getLocalPosition(event.currentTarget);
      const gridCoords = grid.pointToHex(coords);
      setClickedHex(gridCoords);
    },
    [grid]
  );

  return (
    <Application width={1000} height={1000}>
      <pixiGraphics draw={draw} eventMode="static" onClick={onClick} />
      <pixiGraphics draw={drawSelection} />
    </Application>
  );
};

export default GridContainer;
