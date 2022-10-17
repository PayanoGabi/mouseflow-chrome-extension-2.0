import React from 'react';
import ReactDOM from 'react-dom';

/* eslint-disable no-case-declarations */
import { MouseflowEvent, MouseflowEventDetail } from "./types";


// Add Support Admin menu to Mouseflow app
if (window.location.host === "us.mouseflow.com" || 
    window.location.host === "eu.mouseflow.com") {
  const menuHead = document.querySelector('.menu-head');
  const menuHeadItem = document.createElement('li');
  menuHeadItem.className = 'menu-pod__item menu-head__item';

  const SupportMenu: React.FC = function() {
    return (
      <>
        <a id="support-menu" className="menu-pod__link menu-head__link" href="/support">
          <i className="menu-head__label-icon icon-earth" role="presentation"></i>
          <span className="menu-head__label">Support Admin</span>
          <i className="menu-pod__arrow icon-arrow-down" role="presentation"></i>
        </a>
        <div className="menu-pod__dropdown menu-pod__dropdown--narrow menu-pod__dropdown--right">
          <ul id="support-items" className="menu-inpod">
            <li className="menu-inpod__item">
              <a id="download-website-list" className="menu-inpod__link" href="#">Download Website List</a>
            </li>
            <li className="menu-inpod__item">
              <a id="download-usage-report" className="menu-inpod__link" href="#">Download Usage Report</a>
            </li>
            {window.location.pathname.match(/\/feedback\/.{22}/) ? ( // Show menu item only on Feedback Report View
              <li className="menu-inpod__item">
                <a id="download-feedback-responses" className="menu-inpod__link" href="#">Download Feedback Responses</a>
              </li>
            ) : (
              null
            )}
          </ul>
        </div>
      </>
    );
  };

  if (menuHead) {
    menuHead.prepend(menuHeadItem);
    ReactDOM.render(<SupportMenu />, menuHeadItem);
  }
}

// Attach and run page script to access Window properties
const mfPageScript = document.createElement('script');
mfPageScript.src = chrome.runtime.getURL('/build/pageScript.js');
document.head.appendChild(mfPageScript);

// Proxy events from Page Script to Background
document.addEventListener('mouseflow', function (event: MouseflowEvent) {
  chrome.runtime.sendMessage(event.detail);
} as EventListener);

// Proxy events from Background to Page Script
chrome.runtime.onMessage.addListener((message: MouseflowEventDetail, sender) => {
  const event = new CustomEvent<MouseflowEventDetail>('mouseflow', {
    detail: message,
  });
  document.dispatchEvent(event);
});

