import { Graphics } from "pixi.js";
import { Scene } from "./Scene";
import { TextLabel } from "./TextLabel";
import { Globals } from "./Globals";


export class MainScene extends Scene {

    constructor() {
        super();
        ////__
        // export const betMultiplier = [0.1,0.5,0.7,1] These Are the Multpliers SEE ITT
        ////__

        const spin = new Graphics()
        spin.beginFill(0xFFFFFF)
        spin.drawRoundedRect(0,0,200,100,20)
        spin.endFill();
        this.mainContainer.addChild(spin);
        spin.position.set(window.innerWidth/2,window.innerHeight/2);

        spin.interactive = true;
        spin.buttonMode = true;

        const Data = {
            currentBet : 0, //SEND THE INDEX OF Multiplier 0,1,2,3
            // lines : 20,
            spins : 100000
        }

        // const Data={
        //     collect: false
        // }

        spin.on("pointerdown",()=>{Globals.Socket?.sendMessage("SPIN",Data)})


        const genRTP = new Graphics()
        genRTP.beginFill(0xFFFFFF)
        genRTP.drawRoundedRect(0,0,200,100,20)
        genRTP.endFill();
        this.mainContainer.addChild(genRTP);
        genRTP.addChild(new TextLabel(0,0,0.5,"RTP",20,0x000000))
        genRTP.position.set(window.innerWidth/2,window.innerHeight/1.5);

        genRTP.interactive = true;
        genRTP.buttonMode = true;


        // const Data={
        //     collect: false
        // }

        genRTP.on("pointerdown",()=>{Globals.Socket?.sendMessage("GENRTP",Data)})
        // spin.on("pointerdown",()=>{sendMessage("gamble",Data)})
    }

    resize(): void {
    super.resize();

    }
    update(dt: number): void { 

    }

    recievedMessage(msgType: string, msgParams: any): void {

    }
}