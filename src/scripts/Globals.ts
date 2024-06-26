  
import { Howl } from 'howler';
import * as PIXI from 'pixi.js';
import { App } from './App';
import { MyEmitter } from './MyEmitter';
import { TextStyle } from 'pixi.js';
import Stats from 'stats.js';
import { SocketManager } from '../socket';

type globalDataType = {
  resources: PIXI.utils.Dict<PIXI.LoaderResource>;
  emitter: MyEmitter | undefined;
  isMobile: boolean;
  fpsStats : Stats ,
  soundResources: { [key: string]: Howl };

  App: App | undefined,
  Socket : SocketManager | undefined,
}

export const Globals: globalDataType = {
  resources: {},
  emitter: undefined,
  get isMobile() {
    //  return true;
    return PIXI.utils.isMobile.any;
  },
  fpsStats: new Stats(),
  App: undefined,
  Socket: undefined,
  soundResources: {},
};


export const currentGameData = {
  currentBetIndex : 0,
  won : 0,
  AutoPlay: 0,
  currentLines : 0,
  currentBalance : 50,
  isMoving : false,
}

export const initData = {
  gameData : {
    Reel : [[]],
    BonusData : [],
    Bets : [1,2,3,4,5],
    LinesCount : [1, 5, 15, 20],
    autoSpin : [],
    Lines : [[]],

  },
  playerData : {
    Balance : 1000,
    haveWon : 0,
    currentWining : 0,
    currentBet : 0,
  },
};

export const ResultData = {
  gameData : {
    BonusResult: [],
    BonusStopIndex:  -1,
    ResultReel: [[]],
    WinAmout: 0,
    freeSpins:  0,
    isBonus:  false,
    jackpot:  0,
    linesToEmit:[1,2,5],
    symbolsToEmit: ["0,1","1,1","0,2"],
  },
  playerData : {
    Balance : 0,
    haveWon : 0,
    currentWining : 0,
    currentBet : 0,
  },
};
export const style = new TextStyle({
  dropShadow: true,
  dropShadowAngle: 1.8,
  dropShadowColor: "#ffffff",
  dropShadowDistance: 1,
  fill: "#4f3130",
  fillGradientStops: [
    0.4
  ],
  fontWeight: "bolder",
  lineJoin: "round",
  miterLimit: 0,
  stroke: "#4f3130",
  strokeThickness: 1.5
});

export const testLines = [[1, 1, 1, 1, 1], [0, 0, 0, 0, 0], [2, 2, 2, 2, 2], [0, 1, 2, 1, 0], [2, 1, 0, 1, 2],
[2,2, 1, 2, 2], [0, 0, 1, 0, 0], [1, 2, 2, 2, 1], [1, 0, 0, 0, 1], [2, 2, 1, 0, 0], [1, 2, 1, 0, 1],
[1,0, 1, 2, 1]];