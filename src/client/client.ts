import { Terminal, ITheme } from "xterm";
import * as io from "socket.io-client";

import { IoEvent } from "../shared/ioevent";

import { TelnetClient } from "./telnetClient";

import { utf8encode, utf8decode, getUrlParameter } from "./util";

import { MenuBar } from "./menuBar";
import { ConnectWin } from "./connectWin";

declare let configClient: any;

let theme: ITheme = {
    background: "rgb(0,0,0)",
    foreground: "rgb(0,187,0)",

    black: "rgb(0,0,0)",
    red: "rgb(187,0,0)",
    green: "rgb(0,187,0)",
    yellow: "rgb(187,187,0)",
    blue: "rgb(0,0,187)",
    magenta: "rgb(187,0,187)",
    cyan: "rgb(0,187,187)",
    white: "rgb(192,192,192)",

    brightBlack: "rgb(128,128,128)",
    brightRed: "rgb(256,0,0)",
    brightGreen: "rgb(0,256,0)",
    brightYellow: "rgb(256,256,0)",
    brightBlue: "rgb(0,0,256)",
    brightMagenta: "rgb(256,0,256)",
    brightCyan: "rgb(0,256,256)",
    brightWhite: "rgb(256,256,256)"
};

export class Client {
    public term: Terminal;
    public ioConn: SocketIOClient.Socket;
    public ioEvt: IoEvent;

    private partialUtf8: Uint8Array | null = null;

    private enableUtf8 = true;

    private sendCmd(cmd: string) {
        cmd += "\r\n";

        let arr: Uint8Array;
        if (this.enableUtf8 === true) {
            arr = utf8encode(cmd);
        } else {
            arr = new Uint8Array(cmd.length);
            for (let i = 0; i < cmd.length; i++) {
                arr[i] = cmd.charCodeAt(i);
            }
        }

        this.ioEvt.clReqTelnetWrite.fire(arr.buffer);
    }

    constructor() {
        let menuBar = new MenuBar();
        let connectWin = new ConnectWin();

        menuBar.EvtConnect.handle(() => {
            connectWin.open();
        });

        connectWin.EvtConnect.handle((data) => {
            this.ioEvt.clReqTelnetOpen.fire([data.host, data.port]);
            connectWin.close();
        });

        let cmdInput = document.getElementById("cmdInput") as HTMLInputElement;
        cmdInput.addEventListener("keydown", (ev: KeyboardEvent) => {
            if (ev.key === "Enter") {
                this.term.writeln("\x1b[1;33m" + cmdInput.value + "\x1b[0m");
                this.sendCmd(cmdInput.value);
                cmdInput.select();
                return false;
            }

            return true;
        });

        this.term = new Terminal({
            scrollback: 5000,
            theme: theme,
            fontFamily: "\"Courier\", monospace",
            fontSize: 13,
            enableBold: false,
            disableStdin: true
            // rows: 120
        });

        this.term.registerLinkMatcher(/\x1f<taco>/, (event) => {

        });
        let div = document.getElementById("mainWin");
        if (div !== null) {
            this.term.open(div);
        } else {
            throw "Couldn't get mainWin";
        }
        
        this.ioConn = io.connect(
            location.protocol + "//" +
            (configClient.socketIoHost || document.domain) +
            ":" +
            (configClient.socketIoPort || location.port) +
            "/telnet");

        let telnet = new TelnetClient((data) => {
            this.ioEvt.clReqTelnetWrite.fire(data);
        });

        telnet.EvtData.handle((data) => {
            if (this.enableUtf8) {
                let utf8Data: Uint8Array;
                if (this.partialUtf8 !== null) {
                    utf8Data = new Uint8Array(data.byteLength + this.partialUtf8.length);
                    utf8Data.set(this.partialUtf8, 0);
                    utf8Data.set(new Uint8Array(data), this.partialUtf8.length);
                    this.partialUtf8 = null;
                } else {
                    utf8Data = new Uint8Array(data);
                }

                let result = utf8decode(utf8Data);
                this.partialUtf8 = result.partial;
                this.term.write(result.result);
            } else {
                let arr = [].slice.call(new Uint8Array(data));
                this.term.write(String.fromCharCode.apply(String, arr));
            }

        });

        this.ioEvt = new IoEvent(this.ioConn);

        this.ioEvt.srvTelnetData.handle((data: ArrayBuffer) => {
            telnet.handleData(data);
        });

        let hostParam: string | undefined = getUrlParameter("host");
        let portParam: string | undefined = getUrlParameter("port");

        if (hostParam !== undefined && portParam !== undefined)
        {
            let host = hostParam.trim();
            let port = Number(portParam);
            this.ioEvt.clReqTelnetOpen.fire([host, port]);
        } else {
            connectWin.open();
        }
    }

    // private resizeTerm() {
    //     // this.term.getOption()
    // }
}