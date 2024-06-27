import { io } from "socket.io-client";
import { Globals, ResultData, initData } from "./scripts/Globals";

function getToken() {
  let cookieArr = document.cookie.split("; ");
  for(let i = 0; i < cookieArr.length; i++) {
      let cookiePair = cookieArr[i].split("=");
      if('token' === cookiePair[0]) {
          return decodeURIComponent(cookiePair[1]);
      }
  }
  return null;
}

// Usage example
let token = getToken();
if(token!== null) {
  console.log("Token:", token);
} else {
  console.log("Token not found");
}


const socketUrl = "http://localhost:5000";

export class SocketManager {
  private socket;

  constructor(private onInitDataReceived: () => void) { 
    const token = getToken();
    if(token!== null) {
      console.log("Token:", token);
    } else {
      console.log("Token not found");
    }
   let  authToken = token || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBsYXllcjEiLCJkZXNpZ25hdGlvbiI6InBsYXllciIsImlhdCI6MTcxOTQ3OTM1NywiZXhwIjoxNzIwMDg0MTU3fQ.UzQoyNlT8MfXs7sSuSt8QilV7UJb629VdXCRsnIrDVI";
   
   this.socket = io(socketUrl, {
      auth: {
        token: authToken,
      },
    });
    console.log(socketUrl);

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.socket.on("connect_error", (error: Error) => {
      console.error("Connection Error:", error.message);
    });

    this.socket.on("connect", () => {
      console.log("Connected to the server");

      this.socket.emit(
        "AUTH",
        JSON.stringify({
          id: "AUTH",
          Data: {
            GameID: "SL-GCT",
          },
        })
      );

      this.socket.on("message", (message) => {
        const data = JSON.parse(message);
        console.log(`Message ID : ${data.id} |||||| Message Data : ${JSON.stringify(data.message)}`);
        if(data.id == "InitData")
          {
            this.onInitDataReceived();
            initData.gameData = data.message.GameData;
            initData.playerData = data.message.PlayerData;
            console.log(initData);
          }
          if(data.id == "ResultData")
            {
              ResultData.gameData = data.message.GameData;
              ResultData.playerData = data.message.PlayerData;
              console.log(ResultData);
              Globals.emitter?.Call("ResultData");
            }
            if(data.id == "FREESPIN")
              {
                console.log("CALLED FREESPIN");
                
              }
      });
    });

    this.socket.on("internalError", (errorMessage: string) => {
      console.log(errorMessage);
    });
  }


 // Add this method to the SocketManager class in socket.ts

authenticate(): Promise<void> {
    return new Promise((resolve, reject) => {
        this.socket.on("connect", () => {
            console.log("Connected to the server");

            this.socket.emit(
                "AUTH",
                JSON.stringify({
                    id: "AUTH",
                    Data: {
                        GameID: "SL-GF",
                    },
                })
            );

        });
    });
}
  messages(message: any) {
    console.log(message);
  }
  sendMessage(id : string, message: any) {
    this.socket.emit(
      "message",
      JSON.stringify({ id: id, data: message })
    );
  }

}

