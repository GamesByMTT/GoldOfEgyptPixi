import {
  AnimatedSprite,
  Container,
  Graphics,
  Resource,
  Sprite,
  Texture,
} from "pixi.js";
import { Globals, ResultData, initData } from "./Globals";
import { config } from "./appConfig";
import { Easing, Tween } from "@tweenjs/tween.js";
import { start } from "repl";
import { log } from "console";

export class Slots extends Container {
  slotMask: Graphics;
  slotSymbols: symbols[][] = [];
  moveSlots: boolean = false;
  resultCallBack: () => void;
  slotFrame!: Sprite;

  constructor(callback: () => void) {
    super();

    this.resultCallBack = callback;

    this.slotMask = new Graphics();
    this.slotMask.beginFill(0xffffff, 1);
    this.slotMask.drawRoundedRect(0, 0, config.logicalWidth / 1.8, 635, 20);
    this.slotMask.endFill();
    this.slotMask.position.set(
      -config.logicalWidth / 4 - 50,
      -config.logicalHeight / 3 + 10
    );
    this.addChild(this.slotMask);

    const startPos = {
      x: this.slotMask.position.x,
      y: -config.logicalHeight / 3 + this.slotMask.height + 21,
    };
    // console.log(initData.gameData.Reel);

    for (let i = 0; i < 5; i++) {
      this.slotSymbols[i] = [];
      for (let j = 0; j < 18; j++) {
          const slot = new symbols(getRandomIntBetween(0, 12),{x : i, y: j});
          slot.symbol.position.set(startPos.x + slot.symbol.width / 2 + slot.symbol.width * i / 1.15, startPos.y - slot.symbol.height / 2 - slot.symbol.height * j / 1.14);
          slot.startY = slot.symbol.position.y;
          slot.symbol.mask = this.slotMask;
          this.slotSymbols[i].push(slot);
          this.addChild(this.slotSymbols[i][j].symbol);
      }
  }


    let sprites: Texture<Resource>[] = [];
    for (let i = 0; i < 23; i++) {
      const texture = Globals.resources[`slots${0}_${i}`]?.texture;
      if (texture) {
        sprites.push(texture);
      } else {
        console.error(`Texture slots${0}_${i} not found`);
      }
    }
  }
 
  moveReel() {
    for (let i = 0; i < this.slotSymbols.length; i++) {
      for (let j = 0; j < this.slotSymbols[i].length; j++) {
        setTimeout(() => {
          this.slotSymbols[i][j].startMoving = true;
          if (j < 3) this.slotSymbols[i][j].stopAnimation();
        }, 100 * i);
      }
    }
    this.moveSlots = true;
    setTimeout(() => { this.stopTween(); }, 3000);
  }

  stopTween() {
    for (let i = 0; i < this.slotSymbols.length; i++) {
      for (let j = 0; j < this.slotSymbols[i].length; j++) {
        setTimeout(() => {
          this.slotSymbols[i][j].endTween();
        }, 200 * i);
      }
      if (i == this.slotSymbols.length - 1)
        setTimeout(() => {
          this.resultCallBack();
          this.moveSlots = false;
          // ResultData.gameData.symbolsToEmit.forEach((rowArray: any) => {
          //   rowArray.forEach((row: any) => {
          //     // console.log('Processing:', row); // Debugging: Log each row being processed
          //     if (typeof row === "string") {
          //       const [x, y]: number[] = row
          //         .split(",")
          //         .map((value) => parseInt(value));
          //       // console.log('Parsed Coordinates:', { x, y }); // Debugging: Log parsed coordinates
          //       // console.log(this.slotSymbols[(x)][2-y]);
          //       this.slotSymbols[x][2 - y].playAnimation();
          //     }
          //   });
          // });
                this.slotSymbols[0][0].playAnimation();
                this.slotSymbols[1][0].playAnimation();
                this.slotSymbols[2][0].playAnimation();
                this.slotSymbols[3][0].playAnimation();
                this.slotSymbols[4][0].playAnimation();
                this.slotSymbols[1][1].playAnimation();
                this.slotSymbols[2][1].playAnimation();
                this.slotSymbols[3][1].playAnimation();
                this.slotSymbols[0][2].playAnimation();
                this.slotSymbols[1][2].playAnimation();
                this.slotSymbols[2][2].playAnimation();
                this.slotSymbols[3][2].playAnimation();
                this.slotSymbols[4][2].playAnimation();

        }, 1000);
    }
    console.log(ResultData);
  }

  update(dt: number) {
    if (this.slotSymbols && this.moveSlots) {
      for (let i = 0; i < this.slotSymbols.length; i++) {
        for (let j = 0; j < this.slotSymbols[i].length; j++) {
          this.slotSymbols[i][j].update(dt);
          if (
            this.slotSymbols[i][j].symbol.position.y +
              this.slotSymbols[i][j].symbol.height * 1.5 >=
            2000
          ) {
            if (j == 0) {
              this.slotSymbols[i][j].symbol.position.y =
                this.slotSymbols[i][this.slotSymbols[i].length - 1].symbol
                  .position.y -
                this.slotSymbols[i][this.slotSymbols[i].length - 1].symbol
                  .height /
                  2;
            } else {
              this.slotSymbols[i][j].symbol.position.y =
                this.slotSymbols[i][j - 1].symbol.position.y -
                this.slotSymbols[i][j].symbol.height;
            }
          }
        }
      }
    }
  }
}

// class slotSymbolSprite extends Sprite {
//     startY: number = 0;
//     startMoving: boolean = false;
//     endMoving: boolean = false;
//     yIndex: number = -1;

//     constructor(elementId: number, yIndex: number) {
//         super(Globals.resources[`slots${elementId}_${0}`]?.texture);
//         this.anchor.set(0.5);
//         this.yIndex = yIndex;
//         // this.animationSpeed = 0.3;
//         // this.symbol.play();
//         // this.shouldAnimationPlay(true);

//     }

//     endTween() {
//         this.startMoving = false;
//         const tween = new Tween(this.position)
//             .to({ y: this.startY }, 400)
//             .easing(Easing.Elastic.Out)
//             .start();
//     }

//     update(dt: number) {
//         if (this.startMoving) {
//             const deltaY = 80 * dt;
//             const newY = this.position.y + deltaY;
//             // Clamp the new Y position to prevent excessive movement
//             this.position.y = Math.max(newY, this.position.y);
//         }
//     }
// }

class symbols {
  symbol: AnimatedSprite;
  startY: number = 0;
  startMoving: boolean = false;
  endMoving: boolean = false;
  Index: { x: number; y: number };

  constructor(elementId: number, Index: { x: number; y: number }) {
    let sprites: Texture<Resource>[] = [];
    for (let i = 0; i < 23; i++) {
      const texture = Globals.resources[`slots${elementId}_${i}`]?.texture;
      if (texture) {
        sprites.push(texture);
      } else {
        console.error(`Texture slots${elementId}_${i} not found`);
      }
    }
    this.symbol = new AnimatedSprite(sprites);
    this.symbol.anchor.set(0.5);
    this.Index = Index;
    this.symbol.animationSpeed = 0.3;
    if (this.Index.y > 3) {
      const textures = [this.symbol.texture, this.symbol.texture];
      this.symbol.textures = textures;
    }
  }

  playAnimation() {
    this.symbol.play();
  }
  stopAnimation() {
    this.symbol.gotoAndStop(0);
  }
  endTween() {
    if (this.Index.y < 3) {
      let sprites: any = [];
      // console.log(ResultData.gameData.ResultReel[0]);

      const elementId =
       getRandomIntBetween(0,12);
      for (let i = 0; i < 23; i++) {
        const texture = Globals.resources[`slots${elementId}_${i}`]?.texture;
        if (texture) {
          sprites.push(texture);
        } else {
          console.error(`Texture slots${elementId}_${i} not found`);
        }
      }
      this.symbol.textures = sprites;
    }
    this.startMoving = false;
    new Tween(this.symbol.position)
      .to({ y: this.startY }, 400)
      .easing(Easing.Elastic.Out)
      .onComplete(() => {})
      .start();
    // if (this.Index.y < 3) this.symbol.play();
  }
  update(dt: number) {
    if (this.startMoving) {
      const deltaY = 80 * dt;
      const newY = this.symbol.position.y + deltaY;
      // Clamp the new Y position to prevent excessive movement
      this.symbol.position.y = Math.max(newY, this.symbol.position.y);
    }
  }
}
export function getRandomIntBetween(minIndex: number, maxIndex: number) {
  return Math.floor(Math.random() * (maxIndex - minIndex + 1)) + minIndex;
}
