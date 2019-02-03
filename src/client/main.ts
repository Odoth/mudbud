import { Client } from "./client";


export let myClient: Client;

$(document).ready(() => {
    myClient = new Client();
});