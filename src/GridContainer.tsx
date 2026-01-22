import { Application, extend } from "@pixi/react";
import { Container, Graphics, Sprite } from "pixi.js";

import { BunnySprite } from "./BunnySprite";

// extend tells @pixi/react what Pixi.js components are available
extend({
  Container,
  Graphics,
  Sprite,
});

const GridContainer = () => {
  return (
    <Application>
      <BunnySprite />
    </Application>
  );
};

export default GridContainer;
