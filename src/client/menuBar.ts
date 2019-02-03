import { EventHook } from "./event";

export class MenuBar {
    public EvtConnect = new EventHook<void>();

    private _root: HTMLDivElement;
    
    constructor() {
        this._root = document.getElementsByClassName("menu-container")[0] as HTMLDivElement;

        (<HTMLAnchorElement>this._root.getElementsByClassName("btn-menu-connect")[0]).addEventListener("click", (ev) => {
            this.EvtConnect.fire();
        });
    }
}