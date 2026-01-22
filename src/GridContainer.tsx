import { useMemo, useState, useEffect, use } from "react";
import { Application, extend } from "@pixi/react";
import {
  Container,
  Graphics,
  Sprite,
  Polygon,
  Assets,
  Texture,
  type StrokeStyle,
  FillGradient,
  Matrix,
  type FederatedPointerEvent,
} from "pixi.js";

import {
  defineHex,
  Grid,
  rectangle,
  type AxialCoordinates,
} from "honeycomb-grid";

import tileUrl from "./assets/isometric_buildings/PNG/buildingTiles_002.png";

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
  const [hoveredHex, setHoveredHex] = useState<AxialCoordinates | null>(null);
  const [texture, setTexture] = useState<Texture>(Texture.EMPTY);

  const Hex = useMemo(
    () => defineHex({ dimensions: 70, origin: "topLeft" }),
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

  const fillTexture = useMemo(() => {
    return {
      texture: texture,
      textureSpace: "local",
    };
  }, []);

  const strokeStyle = useMemo<StrokeStyle>(
    () => ({ width: 1, color: 0x999999, alpha: 0.5 }),
    []
  );

  const draw = useCallback(
    (g: Graphics) => {
      g.clear();

      grid.forEach((hex) => {
        g.poly(hex.corners).fill(fillTexture).stroke(strokeStyle);
      });
    },
    [grid, gradient, strokeStyle]
  );

  const drawSelection = useCallback(
    (g: Graphics) => {
      g.clear();

      if (clickedHex) {
        const hex = grid.getHex(clickedHex);
        if (!hex) return;
        g.poly(hex.corners)
          .fill(0x00ff00, 0.55)
          .stroke({ width: 2, color: 0x006600, alpha: 1 });
      }

      // highlight hovered hex
      if (hoveredHex) {
        const hex = grid.getHex(hoveredHex);
        if (!hex) return;
        g.poly(hex.corners)
          .fill(0xffff00, 0.35)
          .stroke({ width: 2, color: 0x666600, alpha: 1 });
      }
    },
    [grid, clickedHex, hoveredHex]
  );

  const onClick = useCallback(
    (event: FederatedPointerEvent) => {
      const coords = event.getLocalPosition(event.currentTarget);
      const gridCoords = grid.pointToHex(coords);
      setClickedHex(gridCoords);
    },
    [grid]
  );

  const onHover = useCallback(
    (event: FederatedPointerEvent) => {
      const coords = event.getLocalPosition(event.currentTarget);
      const gridCoords = grid.pointToHex(coords);

      console.log("Hovered Hex:", gridCoords);
      setHoveredHex(gridCoords);
    },
    [grid]
  );

  // Compute placement for an asset sprite (use hex.x/hex.y)
  const clickedWorldPos = useMemo(() => {
    if (!clickedHex) return null;
    const hex = grid.getHex(clickedHex);
    if (!hex) return null;
    return { x: hex.x, y: hex.y };
  }, [grid, clickedHex]);

  useEffect(() => {
    const loadTexture = async () => {
      const tex = await Assets.load(tileUrl);
      setTexture(tex);
    };

    loadTexture();
  }, [texture]);

  return (
    <div>
      <Application width={1000} height={600}>
        <pixiGraphics
          draw={draw}
          eventMode="static"
          onClick={onClick}
          onPointerMove={onHover}
        />
        <pixiGraphics draw={drawSelection} />
        {clickedWorldPos && (
          <pixiSprite
            texture={texture}
            x={clickedWorldPos.x}
            y={clickedWorldPos.y}
            onPointerOver={onHover}
            anchor={0.5}
            width={140}
            height={140}
          />
        )}
      </Application>
    </div>
  );
};

export default GridContainer;
