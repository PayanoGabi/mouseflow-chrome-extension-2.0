import { MouseflowEventDetail, MouseflowEventType } from "./types";

chrome.runtime.onMessage.addListener(
  function(message: MouseflowEventDetail, sender, sendResponse) {
    if (message.type === MouseflowEventType.RECEIVE_DIAGNOSTICS) {
      const hasErrors = (message.payload.HTMLErrors.length || message.payload.duplicateIds.length);
      
      // Determine which icon to show in browser toolbar
      
      if (message.payload.isRecording) { // Recording
        if (hasErrors) {
          chrome.browserAction.setIcon({ path: '/assets/images/mf_recording_warning.png' });
        } else {
          chrome.browserAction.setIcon({ path: '/assets/images/mf_recording.png' });
        }
  
      } else { // Not recording
        
        if (message.payload.installations.length) {
          if (hasErrors) {
            chrome.browserAction.setIcon({ path: '/assets/images/mf_warning.png' });
          } else {
            chrome.browserAction.setIcon({ path: '/assets/images/mf_active.png' });
          }
    
        } else {
          chrome.browserAction.setIcon({ path: '/assets/images/mf_inactive.png' });
        }
      }
    }
  },
);

setInterval(function() { 
  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab && activeTab.id) {
      chrome.tabs.sendMessage(activeTab.id, { type: MouseflowEventType.FETCH_DIAGNOSTICS });
    }
  });
}, 500);
