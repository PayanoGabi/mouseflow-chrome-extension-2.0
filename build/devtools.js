!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=14)}({1:function(e,t,n){"use strict";var o;Object.defineProperty(t,"__esModule",{value:!0}),t.MouseflowEventType=void 0,function(e){e.FETCH_DIAGNOSTICS="FETCH_DIAGNOSTICS",e.RECEIVE_DIAGNOSTICS="RECEIVE_DIAGNOSTICS",e.START_SESSION="START_SESSION",e.STOP_SESSION="STOP_SESSION",e.RESET_SESSION="RESET_SESSION"}(t.MouseflowEventType||(t.MouseflowEventType={})),function(e){e.Radio="radio",e.Checkbox="checkbox",e.Text="text",e.TextArea="textarea",e.NPS="nps",e.Success="success"}(o||(o={}))},14:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const o=n(1);let r=!1;chrome.runtime.onMessage.addListener((function(e,t,n){e.type===o.MouseflowEventType.RECEIVE_DIAGNOSTICS&&e.payload.installations.length&&!r&&(chrome.devtools.panels.create("Mouseflow","assets/images/icon16.png","panel.html"),r=!0)}))}});