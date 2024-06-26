import { Container, Graphics } from "pixi.js";
import {initData, testLines}from "./Globals"
import { start } from "repl";

let xOffset = -1;
let yOffset = -1;

export class LineGenerator extends Container
{
    lineArr : Lines[] = []
    constructor(yOf : number, xOf : number)
    {
        super(); 
        xOffset = xOf; 
        yOffset = yOf; 
        // console.log(testLines);
        
        for(let i = 0; i < testLines.length ; i++)
        {
            let line  = new Lines(i);
            line.position.y = -yOffset;
            this.addChild(line)
            this.lineArr.push(line);
        }
        
}

showLines(lines : number[]){ 
    for(let i = 0; i < lines.length ; i++){
        // console.log(this.lineArr[lines[i]]);
        
     this.lineArr[lines[i]].showLine();}}
    hideLines(){this.lineArr.forEach(element => { element.hideLine();});}

}


export class Lines extends Graphics
{
    constructor(index : number)
    {
        super();
        let lastPosX = xOffset;
        let lastPosY = yOffset*testLines[index][0];
     
        this.visible = false;
        const yLineOffset = 50;
        this.position.set(-xOffset*3,yOffset*testLines[index][0] - yLineOffset);
        
        this.lineStyle(10, 0xFFEA31)
        this.moveTo(lastPosX, lastPosY- yLineOffset)
        for(let i = 1 ; i < testLines[index].length ; i++ )
        {
            this.lineTo(lastPosX + xOffset*i,  yOffset*testLines[index][i]- yLineOffset);
            lastPosY = yOffset*testLines[index][i];
        }
    }

    showLine(){this.visible = true; }
    hideLine(){this.visible = false;}
    }


   