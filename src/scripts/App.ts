import * as PIXI from "pixi.js";
import { CalculateScaleFactor, config } from "./appConfig";

// import { onResizeFunction } from "./HtmlHandler";
import { Loader } from "./Loader";
import { MainScene } from "./MainScene";
import { Axios } from 'axios';
import { MyEmitter } from "./MyEmitter";
import { SceneManager } from "./SceneManager";

import { log } from "console";
import { Globals } from "./Globals";
import { SocketManager } from "../socket";
import { start } from "repl";
// import { Loader } from "./Loader";
// import { SceneManager } from "./SceneManager";
// import { MainScene } from "./MainScene";

export class App {
	app: PIXI.Application;
	constructor() {
		// create canvas
		
		PIXI.settings.RESOLUTION = window.devicePixelRatio || 1;

		this.app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight, antialias: true,powerPreference: 'high-performance', });
		this.app = new PIXI.Application({width : window.innerWidth, height : window.innerHeight});
		document.body.appendChild( Globals.fpsStats.dom );
		Globals.fpsStats.dom.style.position = 'absolute';
		Globals.fpsStats.dom.style.left = '40px';
		Globals.fpsStats.dom.style.top = '40px';
		
		// document.body.appendChild( Globals.stats.dom );

		CalculateScaleFactor();

		this.app.renderer.view.style.width = `${window.innerWidth}px`;
		this.app.renderer.view.style.height = `${window.innerHeight}px`;
		this.app.renderer.resize(window.innerWidth, window.innerHeight);

		this.app.view.oncontextmenu = (e) => {
			e.preventDefault();
		};

		//Setting Up Window On Resize Callback
		window.onresize = (e) => {
			
			CalculateScaleFactor();
			this.app.renderer.resize(window.innerWidth, window.innerHeight);
			document.body.removeChild(this.app.view);
			
			this.app.renderer.view.style.width = `${window.innerWidth}px`;
			this.app.renderer.view.style.height = `${window.innerHeight}px`;
			SceneManager.instance!.resize();
			document.body.append(this.app.view);
		};

		//Created Emitter
		Globals.emitter = new MyEmitter();


		//Create Scene Manager
		new SceneManager();

		this.app.stage.addChild(SceneManager.instance.container);
		this.app.ticker.add((dt) => SceneManager.instance!.update(dt));

		// loader for loading data
		const loaderContainer = new PIXI.Container();
		this.app.stage.addChild(loaderContainer);

		const loader = new Loader(this.app.loader, loaderContainer);
		// Globals.Socket = new SocketManager(() => {
			loader.preload().then(() => {
				loader.preloadSounds(() => {
					setTimeout(() => {
						this.startScene(loaderContainer);
					}, 1000);
				});
			});
		//   });
	   

		this.tabChange();
		document.body.appendChild(this.app.view);
	}
	startScene(loaderContainer : PIXI.Container)
	{
		if(loaderContainer)
			{
				loaderContainer.destroy();
				SceneManager.instance!.start(new MainScene());
			}
	}

	tabChange() {
		document.addEventListener("visibilitychange", (event) => {
		if (document.hidden) {
			Globals.emitter?.Call("pause");

		} else {
			Globals.emitter?.Call("resume");
		}
		});
	}

}
