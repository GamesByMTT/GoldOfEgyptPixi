import { AnimatedSprite, Container, Sprite } from "pixi.js";
import { Globals, ResultData, currentGameData, initData, style } from "./Globals";
import { TextLabel } from "./TextLabel";
import { config } from "./appConfig";
import { Socket } from "socket.io-client";
import { stringify } from "querystring";

export class UIContainer extends Container
{
	spinBtn!: AnimatedSprite;
	maxbetBtn!: AnimatedSprite;
	autoBetBtn!: AnimatedSprite;
	fireAnimation: AnimatedSprite[] = [];
	CurrentBetText!: TextLabel;
	currentWiningText!: TextLabel;
	currentBalanceText!: TextLabel;
    
    constructor(spinCallBack : ()=>void)
    {
        super();

		
        this.maxBetInit();
        this.autoSpinBtnInit();
        this.spinBtnInit(spinCallBack);
        this.lineBtnInit();
        this.winBtnInit();
	    this.balanceBtnInit();
        this.jackpotPanelInit();
		this.BetBtnInit();
        this.vaseInit();
    }
    lineBtnInit()
    {
		
		const linePanel = new Sprite(Globals.resources.lines.texture);
		linePanel.anchor.set(0.5);
		linePanel.position.set(-config.logicalWidth/2 +  linePanel.width, this.spinBtn.position.y);

		const lineText = new TextLabel(0, -linePanel.height / 1.8, 0.5, "LINES", 25, 0x3C2625);
		lineText.style = style;
		linePanel.addChild(lineText);
		const pBtnSprites: any = [Globals.resources.pBtn.texture, Globals.resources.pBtnH.texture];
		const pBtn = new AnimatedSprite(pBtnSprites);
		pBtn.anchor.set(0.5);
		pBtn.scale.set(0.8);
		pBtn.gotoAndStop(0);
		pBtn.position.set(linePanel.width / 4 + pBtn.width / 2 + linePanel.position.x, linePanel.position.y - 5)
		pBtn.interactive = true;
		pBtn.buttonMode = true;
		pBtn.on("pointerdown", () => { pBtn.gotoAndStop(1);
			if(!currentGameData.isMoving)
				{

					currentGameData.currentLines++;
					if(currentGameData.currentLines >= initData.gameData.LinesCount.length )
						{
							currentGameData.currentLines = 0;
						}
						CurrentLineText.updateLabelText( initData.gameData.LinesCount[currentGameData.currentLines].toString())
					}
		 })
		pBtn.on("pointerup", () => { pBtn.gotoAndStop(0); })
		pBtn.on("pointerout", () => { pBtn.gotoAndStop(0); })

		const mBtnSprites: any = [Globals.resources.mBtn.texture, Globals.resources.mBtnH.texture];
		const mBtn = new AnimatedSprite(mBtnSprites);
		mBtn.anchor.set(0.5);
		mBtn.scale.set(0.8);
		mBtn.gotoAndStop(0);
		mBtn.position.set(-linePanel.width / 4 - pBtn.width / 2 + linePanel.position.x, linePanel.position.y - 5)
		mBtn.interactive = true;
		mBtn.buttonMode = true;
		mBtn.on("pointerdown", () => { mBtn.gotoAndStop(1);
			if(!currentGameData.isMoving)
				{

					currentGameData.currentLines--;
					if(currentGameData.currentLines < 0 )
						{
							currentGameData.currentLines = initData.gameData.LinesCount.length-1;
						}
						
						CurrentLineText.updateLabelText( initData.gameData.LinesCount[currentGameData.currentLines].toString())
					}
					})
					mBtn.on("pointerup", () => { mBtn.gotoAndStop(0); })
					mBtn.on("pointerout", () => { mBtn.gotoAndStop(0); })

		this.addChild(pBtn);
		this.addChild(mBtn);
		this.addChild(linePanel);

		currentGameData.currentLines = initData.gameData.LinesCount.length-1;
		const currentLine : number  = initData.gameData.LinesCount[currentGameData.currentLines];
		const CurrentLineText = new TextLabel(0,-15,0.5,currentLine.toString(),40,0xFFFFFF)
		linePanel.addChild(CurrentLineText)

    }
    winBtnInit()
    {
        const winPanel = new Sprite(Globals.resources.winPanel.texture);
		winPanel.anchor.set(0.5);
		this.addChild(winPanel);
		winPanel.position.set(this.autoBetBtn.position.x + this.autoBetBtn.width / 2 + winPanel.width / 2, this.spinBtn.position.y);

		const winPanelText = new TextLabel(0, -winPanel.height / 1.8, 0.5, "WON", 25, 0x3C2625);
		winPanelText.style = style;
		winPanel.addChild(winPanelText);

		const currentWining : any  = ResultData.playerData.currentWining;
		this.currentWiningText = new TextLabel(0,-15,0.5,currentWining.toString(),40,0xFFFFFF)
		winPanel.addChild(this.currentWiningText)
    }

    balanceBtnInit()
    {
        const balencePanel = new Sprite(Globals.resources.balancePanel.texture);
		balencePanel.anchor.set(0.5);
		this.addChild(balencePanel);
		balencePanel.position.set(config.logicalWidth/4 + balencePanel.width/1.5, this.spinBtn.position.y);
		const balancePanelText = new TextLabel(0, -balencePanel.height / 1.8, 0.5, "BALANCE", 25, 0x3C2625);
		balancePanelText.style = style;
		balencePanel.addChild(balancePanelText);

		currentGameData.currentBalance = initData.playerData.Balance;
		this.currentBalanceText = new TextLabel(0,-15,0.5,currentGameData.currentBalance.toString(),40,0xFFFFFF)
		balencePanel.addChild(this.currentBalanceText)
    }
    jackpotPanelInit()
    {
		const jackpotPanel = new Sprite(Globals.resources.PanelJackpot.texture);
		jackpotPanel.anchor.set(0.5);
		jackpotPanel.position.y = -config.logicalHeight / 4 - jackpotPanel.height / 2 - 20;
		this.addChild(jackpotPanel);
    }
    vaseInit()
    {
        const vase1 = new Sprite(Globals.resources.fireVase.texture);
		vase1.anchor.set(0.5);
		this.addChild(vase1);
		const fire1 = addFire();
		vase1.addChild(fire1);
		vase1.position.set(-config.logicalWidth/3, config.logicalHeight / 6 + vase1.height);

		const vase2 = new Sprite(Globals.resources.fireVase.texture);
		vase2.anchor.set(0.5);
		this.addChild(vase2);
		vase2.position.set(config.logicalWidth/3, config.logicalHeight / 6 + vase1.height);
		this.sortChildren();
		const fire2 = addFire();
		vase2.addChild(fire2);
		this.fireAnimation.push(fire1, fire2);
    }

    maxBetInit()
    {
		const maxBetSprites: any = [Globals.resources.maxBetBtn.texture, Globals.resources.maxBetBtOnPressed.texture];
		this.maxbetBtn = new AnimatedSprite(maxBetSprites);
		this.maxbetBtn.anchor.set(0.5);
		this.maxbetBtn.scale.set(0.8);
		this.maxbetBtn.gotoAndStop(0);
		this.maxbetBtn.interactive = true;
		this.maxbetBtn.buttonMode = true;
		this.maxbetBtn.position.set(-this.maxbetBtn.width/1.7,config.logicalHeight/2 - this.maxbetBtn.height/2);
		this.maxbetBtn.on("pointerdown", () => { this.maxbetBtn.gotoAndStop(1); 
			currentGameData.currentBetIndex = initData.gameData.Bets[initData.gameData.Bets.length-1]
			this.CurrentBetText.updateLabelText(currentGameData.currentBetIndex.toString());
		})
		this.maxbetBtn.on("pointerup", () => { this.maxbetBtn.gotoAndStop(0); })
		this.maxbetBtn.on("pointerout", () => { this.maxbetBtn.gotoAndStop(0); })
        this.addChild(this.maxbetBtn);
    }
    autoSpinBtnInit()
    {
		const autoSprites: any = [Globals.resources.autoSpin.texture, Globals.resources.autoSpinOnPressed.texture];
		this.autoBetBtn = new AnimatedSprite(autoSprites);
		this.autoBetBtn.anchor.set(0.5);
		this.autoBetBtn.scale.set(0.8);
		this.autoBetBtn.gotoAndStop(0);
		this.autoBetBtn.interactive = true;
		this.autoBetBtn.buttonMode = true;
		this.autoBetBtn.position.set(this.autoBetBtn.width/1.7,config.logicalHeight/2 - this.autoBetBtn.height/2);
		this.autoBetBtn.on("pointerdown", () => { this.autoBetBtn.gotoAndStop(1); })
		this.autoBetBtn.on("pointerup", () => { this.autoBetBtn.gotoAndStop(0); })
		this.autoBetBtn.on("pointerout", () => { this.autoBetBtn.gotoAndStop(0); })
		this.addChild(this.autoBetBtn);

    }
    spinBtnInit(spinCallBack : ()=>void)
    {
        const spinSprites: any = [Globals.resources.spinBtn.texture, Globals.resources.spinBtnOnPressed.texture];
		this.spinBtn = new AnimatedSprite(spinSprites);
		this.spinBtn.anchor.set(0.5);
		this.spinBtn.gotoAndStop(0);
		this.spinBtn.scale.set(0.8);
		this.spinBtn.interactive = true;
		this.spinBtn.buttonMode = true;

        this.spinBtn.position.set(0,config.logicalHeight/2 - this.spinBtn.height/2);
		this.spinBtn.on("pointerdown", () => { this.spinBtn.gotoAndStop(1);Globals.Socket?.sendMessage("SPIN",{currentBet : initData.gameData.Bets[currentGameData.currentBetIndex]});
		currentGameData.currentBalance -= initData.gameData.Bets[currentGameData.currentBetIndex];
		this.currentBalanceText.updateLabelText(currentGameData.currentBalance.toString());
		this.onSpin(true);spinCallBack();})
		this.spinBtn.on("pointerup", () => { this.spinBtn.gotoAndStop(0); })
		this.spinBtn.on("pointerout", () => { this.spinBtn.gotoAndStop(0); })
        this.addChild(this.spinBtn);
    }

    BetBtnInit() {
		const betPanel = new Sprite(Globals.resources.BetPanel.texture);
		betPanel.anchor.set(0.5);
		betPanel.position.set(this.maxbetBtn.position.x - betPanel.width * 1.4, this.spinBtn.position.y);

		const betPanelText = new TextLabel(0, -betPanel.height / 1.8, 0.5, "TOTAL BET", 35, 0x3C2625);
		betPanelText.style = style;
		betPanel.addChild(betPanelText);

		const pBtnSprites: any = [Globals.resources.pBtn.texture, Globals.resources.pBtnH.texture];
		const pBtn = new AnimatedSprite(pBtnSprites);
		pBtn.anchor.set(0.5);
		pBtn.scale.set(0.8);
		pBtn.gotoAndStop(0);
		pBtn.position.set(betPanel.width / 4 + pBtn.width / 3 + betPanel.position.x, betPanel.position.y - 5)
		pBtn.interactive = true;
		pBtn.buttonMode = true;
		pBtn.on("pointerdown", () => { pBtn.gotoAndStop(1);
			if(!currentGameData.isMoving)
			{

				currentGameData.currentBetIndex++;
				if(currentGameData.currentBetIndex >= initData.gameData.Bets.length )
					{
						currentGameData.currentBetIndex = 0;
					}
					this.CurrentBetText .updateLabelText( initData.gameData.Bets[currentGameData.currentBetIndex].toString())
				}
		 })
		pBtn.on("pointerup", () => { pBtn.gotoAndStop(0); })
		pBtn.on("pointerout", () => { pBtn.gotoAndStop(0); })

		const mBtnSprites: any = [Globals.resources.mBtn.texture, Globals.resources.mBtnH.texture];
		const mBtn = new AnimatedSprite(mBtnSprites);
		mBtn.anchor.set(0.5);
		mBtn.scale.set(0.8);
		mBtn.gotoAndStop(0);
		mBtn.position.set(-betPanel.width / 4 - pBtn.width / 3 + betPanel.position.x, betPanel.position.y - 5)
		mBtn.interactive = true;
		mBtn.buttonMode = true;
		mBtn.on("pointerdown", () =>  { mBtn.gotoAndStop(1);
			if(!currentGameData.isMoving)
			{

				currentGameData.currentBetIndex--;
				if(currentGameData.currentBetIndex < 0 )
					{
						currentGameData.currentBetIndex = initData.gameData.Bets.length-1;
					}
					
					this.CurrentBetText .updateLabelText( initData.gameData.Bets[currentGameData.currentBetIndex].toString());
				}
				})
		mBtn.on("pointerup", () => { mBtn.gotoAndStop(0); })
		mBtn.on("pointerout", () => { mBtn.gotoAndStop(0); })

		const currentBet : number  = initData.gameData.Bets[currentGameData.currentBetIndex];
		this.CurrentBetText = new TextLabel(0,-15,0.5,currentBet.toString(),40,0xFFFFFF)
		betPanel.addChild(this.CurrentBetText );

		this.addChild(pBtn);
		this.addChild(mBtn);
		this.addChild(betPanel);

	}

    onSpin(interactive: boolean) {

		currentGameData.isMoving = interactive;
		if (interactive) {
			this.spinBtn.interactive = false;
			this.maxbetBtn.interactive = false;
			this.autoBetBtn.interactive = false;
			this.setFire(true);
		}
		else {
			this.spinBtn.gotoAndStop(0);
			this.spinBtn.interactive = true;
			this.maxbetBtn.interactive = true;
			this.autoBetBtn.interactive = true;
		}
	}
    	
	setFire(shouldSet: boolean) {
		this.fireAnimation.forEach(element => {
			if (shouldSet) {
				element.play();
				element.visible = true;
			}
			else
			{
				element.gotoAndStop(0)
				element.visible = false;
			}
		});
	}


}

function addFire() {
    let sprites: any = [];
    for (let i = 1; i <= 23; i++) {
        let char = `fire_${i}`;
        const symbol = Globals.resources[char].texture;
        sprites.push(symbol);
    }
    const fire = new AnimatedSprite(sprites);
    fire.anchor.set(0.5, 1);
    fire.animationSpeed = 0.5;
    fire.visible = false;
    return fire;
}
