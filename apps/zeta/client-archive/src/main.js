"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("react-dom/client");
var App_1 = require("./App");
console.log("Starting Fantasma Firewall...");
var rootElement = document.getElementById("root");
if (rootElement) {
    console.log("Root element found, rendering app...");
    (0, client_1.createRoot)(rootElement).render(<App_1.default />);
}
else {
    console.error("Root element not found!");
}
