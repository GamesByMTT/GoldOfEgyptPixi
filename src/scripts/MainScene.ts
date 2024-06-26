import { AnimatedSprite, Graphics, LineStyle, Sprite, TextStyle, Texture } from "pixi.js";
import { Scene } from "./Scene";
import { Globals, ResultData, currentGameData, style } from "./Globals";
import { config } from "./appConfig";
import { TextLabel } from "./TextLabel";
import { Slots } from "./Slots";

import { UiPopups } from "./UiPopups";
import { LineGenerator } from "./Lines";
import { UIContainer } from "./UIContainer";


export class MainScene extends Scene {

	slot: Slots;
	slotFrame: Sprite;
	lineGenerator: LineGenerator;
	uiContainer: UIContainer;
	uiPopups: UiPopups;
	constructor() {
		super();

		this.slotFrame = new Sprite(Globals.resources.frame.texture);
		this.slotFrame.anchor.set(0.5);
		this.slotFrame.position.set(config.logicalWidth / 2, config.logicalHeight / 2);
		this.mainContainer.addChild(this.slotFrame);

		this.uiContainer = new UIContainer(()=>this.onSpinCallBack());
		this.slotFrame.addChild(this.uiContainer);
		this.slot = new Slots(() => this.onResultCallBack());
		this.lineGenerator = new LineGenerator(this.slot.slotSymbols[0][0].symbol.height, this.slot.slotSymbols[0][0].symbol.width);
		this.slotFrame.addChild(this.lineGenerator);
		this.slotFrame.addChild(this.slot);

		this.uiPopups  = new UiPopups();
		this.mainContainer.addChild(this.uiPopups);

	}

	onResultCallBack() {
		this.uiContainer.onSpin(false);
		this.uiContainer.setFire(false);
		this.lineGenerator.showLines([1,2,3]);

	}

	onSpinCallBack()
	{
		this.slot.moveReel();
		this.lineGenerator.hideLines();
	}

	resize(): void {
		super.resize();
	}

	update(dt: number): void {
		this.slot.update(dt);
	}

	recievedMessage(msgType: string, msgParams: any): void {
		if (msgType == "ResultData") {
			setTimeout(()=>{
				this.uiContainer.currentWiningText.updateLabelText(ResultData.playerData.currentWining.toString());
				currentGameData.currentBalance =  ResultData.playerData.Balance;
				this.uiContainer.currentBalanceText.updateLabelText(currentGameData.currentBalance.toString())
				this.slot.stopTween()},1000);
					
		}
	}
}
