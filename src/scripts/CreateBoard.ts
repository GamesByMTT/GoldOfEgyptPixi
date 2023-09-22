import { Graphics, Sprite } from "pixi.js";
import * as PIXI from 'pixi.js';
import { boardConfig as getBoardConfig, boardConfigVar, getLineinfo, slotCharArr, Globals, moneyInfo } from './Globals';
import { Lines } from "./Lines";
import { Slots } from './Slots';
import { Symbol } from "./Symbol";
import { getwinBalance } from "./ApiPasser";

export class CreateBoard extends PIXI.Container
{
    board !: PIXI.Sprite;
    slotArr : Slots[][] = [];

    lines : Lines [] = [];
    slotChar : Symbol [][] = [];
    charMask !: Graphics;
    winningSlots : Symbol[][] = [];

    constructor()
    {
        super();
        let boardConfig = getBoardConfig();
        boardConfigVar.boardBoxWidth = boardConfig[0];
        boardConfigVar.boardBoxHeight = boardConfig[1];
        
        this.board = new PIXI.Sprite(Globals.resources.frame.texture);
        this.board.anchor.set(0.5);
        this.addChild(this.board);
        
        this.charMask = new Graphics();
        this.charMask.beginFill(0xffffff);
        this.charMask.drawRect(0, 0,this.board.width,this.board.height-20);
        this.charMask.endFill();
        this.board.addChild(this.charMask);

        this.charMask.position.x = - this.board.width/2;
        this.charMask.position.y = - this.board.height/2+20;

        const frame = new Sprite()

        this.addSlots();
        this.addChar();
        this.makeLines();
    }

    addSlots()
    { 
        let positionX = -this.board.width/2 ;
        let positionY = -this.board.height/2 ;

        for(let i = 0 ; i < boardConfigVar.Matrix.y; i++)
        {
           this.slotArr[i] = [];
            for(let j = 0; j <  boardConfigVar.Matrix.x; j++)
            { 
                const slot = new Slots({ x: positionX, y : positionY},i,j);
                this.slotArr[i][j] = slot;
                
                this.slotArr[i][j].position.x = this.slotArr[i][j].position.x + this.slotArr[i][j].width/2 + 10;
                this.slotArr[i][j].position.y = this.slotArr[i][j].position.y + this.slotArr[i][j].height/2+ 30;
                
                positionX  += slot.width + 20 ;
             
                if(j ==  boardConfigVar.Matrix.x-1 )
                {
                    positionX =-this.board.width/2 ;
                    positionY +=  160;
                }
                this.board.addChild(this.slotArr[i][j]);
            }
        }
    }

    addChar()
    {
       let xPos = this.slotArr[0][0].position.x;
       let yPos = this.slotArr[boardConfigVar.Matrix.y-1][0].position.y;

       const shuffledArray: string[][] = this.shuffle2DArray(slotCharArr.charArr);
        for(let i =0 ;  i < shuffledArray.length ; i ++)
        {
            this.slotChar[i] = []; 
            
            for(let j =shuffledArray[0].length-1; j >=0 ; j--)
            {
                let char = new Symbol(0.9,shuffledArray[i][j],{x: xPos, y: yPos});
                yPos -= 150;
                this.slotChar[i][j] = char;
                this.slotChar[i][j].mask = this.charMask;
                this.board.addChild(char);
            }
            xPos += this.slotArr[0][0].width+20;
            yPos = this.slotArr[boardConfigVar.Matrix.y-1][0].position.y;
        }
    }

    makeLines()
    {
        const entries = Object.entries(getLineinfo);
        for(let i = 0; i < entries.length ; i++)
        {
            let lineInfo;

            lineInfo = getLineinfo[i];     
            let line = new Lines(lineInfo.color,lineInfo.xPos,0,lineInfo.yPos,this.getLineLocation(lineInfo.locations,lineInfo.xPos),this.board);
            this.lines.push(line);

            this.board.addChild(line);
            line.makeitVisible(false);
        }
    }

    getLineLocation (lineInfo : number[][], side : boolean)
    {
        let lineArray = [];
        for(let i = 0; i < lineInfo.length; i++)
        {
            let xIndex  = lineInfo[i][0];
            let yIndex = lineInfo[i][1];

            lineArray[i]  = {x : this.slotArr[xIndex][yIndex].position.x , y: this.slotArr[xIndex][yIndex].position.y};
        }
        return lineArray;
    }
 
    update(dt : number)
    {
        for(let i =slotCharArr.charArr.length-1 ;  i >= 0 ; i -- )
        {
            for(let j = slotCharArr.charArr[0].length-1; j >=0 ; j--)
            {
                if(this.slotChar[i][j].shouldMove)
                {
                    this.slotChar[i][j].position.y += 20*dt;
                    if( this.slotChar[i][j].position.y > boardConfigVar.restartPos)
                    {
                        if(j != 8 )
                        this.slotChar[i][j].position.y = this.slotChar[i][j+1].position.y - 150;
                        else
                        {
                            this.slotChar[i][j].position.y = this.slotChar[i][0].position.y -70;
                        }
                    }
                }
            }
        }
    }

    checkSlot()
    {               
      
      for(let j = 0 ; j < this.slotChar.length ; j++)
        {

        setTimeout(()=>{
            for(let i = 0 ; i < this.slotChar[0].length ; i++)
            {
                if( this.slotChar[j][i].position.y > this.slotArr[0][1].position.y - this.slotArr[0][1].height
                    && this.slotChar[j][i].position.y < 0 ) 
                    {
                        this.addOnSlot(i,j)
                    }
            }
        },500*(j+1))
        }
    }
        ///END Position this.slotArr[0][boardConfigVar.Matrix.y].slot.width*2

    addOnSlot(winningIndex : number, rowNumber : number)
    {
        // console.log(this.slotChar);
        
        // console.log("Row Number :  "+ rowNumber + "winningIndex  : "+ winningIndex);
        for(let  j = 0 ; j  <  this.slotArr.length ; j++)
        {
            let index = (winningIndex -( this.slotArr.length-1)+(j+1));
            // console.log("Index  :  "+ index);
            
            if(index > 8  ||  index < 0)
            index = Math.abs(index - 9);

            index = Math.abs(index -1)
            // console.log("row  :  "+ rowNumber);

            // console.log(this.slotChar[rowNumber][index].symbol);
            this.slotArr[j][rowNumber].currentSlotSymbol = this.slotChar[rowNumber][index].symbol;
        }

        let yPos : number;
        yPos = this.slotArr[boardConfigVar.Matrix.y-1][0].position.y - this.slotChar[rowNumber][winningIndex].position.y;
        for(let j = 0; j  < slotCharArr.charArr[0].length ; j++)
        {
            this.slotChar[rowNumber][j].tweenToSlot(yPos,false);
            if(rowNumber == boardConfigVar.Matrix.x-1 && j == slotCharArr.charArr[0].length-1)
            {
                this.checkWinPaylines();
            //    this.getSlotCurrentSymbols(); 
            }
        }
    }

    startSpin()
    {
        for(let i =slotCharArr.charArr.length-1 ;  i >= 0 ; i -- )
        {
            for(let j = slotCharArr.charArr[0].length-1; j >=0 ; j--)
            {
            this.slotChar[i][j].tweenToSlot(200,true);
            }
        }
    }

    checkWinPaylines()
    {
        const entries = Object.entries(getLineinfo);
        let points  = 0;
        for(let i = 0; i < moneyInfo.maxLines+1 ; i++)
        {
            let  lineInfo = getLineinfo[i]; 
            let lastSymbol = undefined; 
          for(let j = 0; j < lineInfo.locations.length ; j ++)
          {
            let xIndex =lineInfo.locations[j][0];
            let yIndex =lineInfo.locations[j][1]; 
            let linePoints = 0;
            
        //    console.log("xIndex  : " + xIndex + "yIndex  : " + yIndex);
        //    console.log("Last Symbol : " + lastSymbol + "Current Symbol : " + this.slotArr[xIndex][yIndex].currentSlotSymbol);
           if(lastSymbol && lastSymbol == this.slotArr[xIndex][yIndex].currentSlotSymbol)
           {
                // console.log( "Last Symbol xIndex  :  " +  xIndex + "  Last Symbol yIndex : " +yIndex); 
                // console.log( "Last Symbol  :  " + lastSymbol + "  new Symbol : " +this.slotArr[xIndex][yIndex].currentSlotSymbol); 
                // console.log("Current Line Points On Connecting  : " +linePoints);
             
               points++;
               linePoints++;
           }
            else if(lastSymbol && linePoints == 0 )
            {
            //  console.log("Current Line Points  : " +linePoints);
            // console.log("-----------------------------------------");
                    lastSymbol = this.slotArr[xIndex][yIndex].currentSlotSymbol;
            }   
            else if(lastSymbol && linePoints >0 )
            {
                // console.log("not same ");
                break;
            }
            
            if(lastSymbol == undefined)
            lastSymbol = this.slotArr[xIndex][yIndex].currentSlotSymbol;
          }
        }
        // console.log("points : " + points);
        if(points > 0)
        {
            const winMusic = Globals.soundResources.onWin;
			winMusic.volume(0.5);
			winMusic.play();
        }
        moneyInfo.score = points*moneyInfo.lineBet;
        Globals.emitter?.Call("WonAmount");
        getwinBalance();
        // this.getSlotCurrentSymbols()
        return;
    }


    getSlotCurrentSymbols()
    {
        for(let i = 0 ; i < boardConfigVar.Matrix.y; i++)
        {
            for(let j = 0; j <  boardConfigVar.Matrix.x ; j++)
            { 
                console.log( "Symbol " + this.slotArr[i][j].currentSlotSymbol );
                console.log(i,j);
            }
        }
    }

    clearCurrentSort()
    {
        for(let i = 0 ; i < boardConfigVar.Matrix.y; i++)
        {
            for(let j = 0; j <  boardConfigVar.Matrix.x; j++)
            { 
                this.slotArr[i][j].currentSlotSymbol = "-1";
                // console.log( "Symbol " + this.slotArr[i][j].currentSlotSymbol );
            }
        }
    }

    shuffle2DArray(array: string[][]): string[][] {
        const rows: number = array.length;
        const cols: number = array[0].length;
      
        for (let i = rows - 1; i > 0; i--) {
          for (let j = cols - 1; j > 0; j--) {
            const i1: number = Math.floor(Math.random() * (i + 1));
            const j1: number = Math.floor(Math.random() * (j + 1));
      
            // Swap elements at (i, j) and (i1, j1)
            [array[i][j], array[i1][j1]] = [array[i1][j1], array[i][j]];
          }
        }
      
        return array;
      }

      makelinesVisibleOnChange()
      {
        // console.log(moneyInfo.maxLines);
        for(let i = 0 ; i  < this.lines.length ; i++)
        {
            if(i <= moneyInfo.maxLines)
            {
                this.lines[i].makeitVisible(true)
            }
            else
            this.lines[i].makeitVisible(false)
        }
      }
      
      makelinesInvisible()
      {
        // console.log(moneyInfo.maxLines);
        for(let i = 0 ; i  < this.lines.length ; i++)
        {
            this.lines[i].makeitVisible(false)
        }
      }
}