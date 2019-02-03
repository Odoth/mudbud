import { EventHook } from "./event";


export class ConnectWin {
    public EvtConnect = new EventHook<{host: string, port: number}>();

    private _elem: HTMLDivElement;
    private _inpHost: HTMLInputElement;
    private _inpPort: HTMLInputElement;
    private _btnConnect: HTMLButtonElement;
    
    open() {
        $(this._elem).dialog('open');
    }

    close() {
        $(this._elem).dialog('close');
    }

    constructor() {
        this._elem = document.createElement("div");
        this._elem.title = "CONNECT";
        this._elem.innerHTML = `
        <table style="margin-left: auto;margin-right: auto;margin-top: auto;margin-bottom: auto">
        <tr>
            <td>Host: </td>
            <td colspan=2><input size=40 class="winConnect-inputHost"></td>
        </tr>
        <tr>
            <td>Port: </td>
            <td><input size=10 class="winConnect-inputPort"></td>
            <td><button class="winConnect-btnConnect" style="height:100%;width:100%">CONNECT</button></td>
        </tr>
        </table>
        `;

        this._inpHost = this._elem.getElementsByClassName("winConnect-inputHost")[0] as HTMLInputElement;
        this._inpPort = this._elem.getElementsByClassName("winConnect-inputPort")[0] as HTMLInputElement;
        this._btnConnect = this._elem.getElementsByClassName("winConnect-btnConnect")[0] as HTMLButtonElement;

        this._btnConnect.addEventListener("click", (ev) => {
            let host: string = this._inpHost.value.trim();
            let port: number = Number(this._inpPort.value.trim());

            this.EvtConnect.fire({host: host, port: port});
        });

        $(this._elem).dialog({
            autoOpen: false,
            draggable: true,
            resizable: true,
            height: 150,
            width: 450
        });
    }
}