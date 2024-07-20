import { io } from "socket.io-client";
import { Globals, ResultData, initData } from "./scripts/Globals";

function getToken() {
  let cookieArr = document.cookie.split("; ");
  for (let i = 0; i < cookieArr.length; i++) {
    let cookiePair = cookieArr[i].split("=");
    if ('token' === cookiePair[0]) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
}

// Usage example
let token = getToken();
if (token !== null) {
  console.log("Token:", token);
} else {
  console.log("Token not found");
}


const socketUrl = "http://localhost:5000";

export class SocketManager {
  private socket;

  constructor(private onInitDataReceived: () => void) {
    const token = getToken();
    if (token !== null) {
      console.log("Token:", token);
    } else {
      console.log("Token not found");
    }
    let authToken = token || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OGU3ODRkYWNmNmNiYjRmMjAzOTNmMiIsInVzZXJuYW1lIjoicml0aWsiLCJyb2xlIjoicGxheWVyIiwiaWF0IjoxNzIxMDM5NjI5LCJleHAiOjE3MjExMjYwMjl9.jYvep52qoeRJ8mF0QFl0ggEC0oCy3LNuEwttfrDbQfA";
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

    this.socket.on('connect', () => {
      console.log('Connected to the server');
      this.socket.on('socketState', (state: boolean) => {
        if (state) {
          this.socket.emit(
            "AUTH",
            JSON.stringify({
              id: "AUTH",
              Data: {
                GameID: "SL-CRM",
              },
            })
          );
        }

      })


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
  sendMessage(id: string, message: any) {
    this.socket.emit(
      "message",
      JSON.stringify({ id: id, data: message })
    );
  }

}

