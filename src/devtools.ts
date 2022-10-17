/**
 * Run when devtools.html is automatically added to the Chrome devtools panels.
 * It creates a new pane using the panes/index.html which includes EmberInspector.
 */

 import { MouseflowEventDetail, MouseflowEventType } from "./types";

 let panelCreated = false;
 
 chrome.runtime.onMessage.addListener(
   function(message: MouseflowEventDetail, sender, sendResponse) {
     if (message.type === MouseflowEventType.RECEIVE_DIAGNOSTICS) {
       if (message.payload.installations.length && !panelCreated) {
         chrome.devtools.panels.create("Mouseflow", "src/assets/images/icon16.png", "panel.html");
         panelCreated = true;
       }
     }
   },
 );
   