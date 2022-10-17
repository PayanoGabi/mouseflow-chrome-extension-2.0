import React from 'react';
import clsx from 'clsx';
import { MouseflowEventDetail, MouseflowEventType } from '../../types';

interface SessionControlsProps {
  isRecording?: boolean;
  websiteId?: string;
  sessionId?: string;
}

const SessionControls: React.FC<SessionControlsProps> = function({ isRecording, websiteId, sessionId }) {

  const handleStopSession: React.MouseEventHandler = function(event) {
    event.preventDefault();
    const message: MouseflowEventDetail = {
      type: MouseflowEventType.STOP_SESSION,
    };
    chrome.tabs.query({ currentWindow: true, active: true}, function(tabs) {
      const activeTab = tabs[0];
      if (activeTab && activeTab.id) {
        chrome.tabs.sendMessage(activeTab.id, message);
      }
    });
  };

  const handleStartSession: React.MouseEventHandler = function(event) {
    event.preventDefault();
    const message: MouseflowEventDetail = {
      type: MouseflowEventType.START_SESSION,
    };
    chrome.tabs.query({ currentWindow: true, active: true}, function(tabs) {
      const activeTab = tabs[0];
      if (activeTab && activeTab.id) {
        chrome.tabs.sendMessage(activeTab.id, message);
      }
    });
  };

  const handleResetSession: React.MouseEventHandler = function(event) {
    event.preventDefault();
    if (typeof websiteId === "undefined") {
      return;
    }

    const message: MouseflowEventDetail = {
      type: MouseflowEventType.RESET_SESSION,
      payload: websiteId,
    };

    chrome.tabs.query({ currentWindow: true, active: true}, function(tabs) {
      const activeTab = tabs[0];
      if (activeTab && activeTab.id) {
        chrome.tabs.sendMessage(activeTab.id, message);
      }
    });
  };

  return (
    <>
      <div>
        <div className="btn-group btn-group-toggle" data-toggle="buttons">
          <label className={clsx("btn btn-secondary", { active: isRecording })}>
            <input type="radio" name="options" id="start-session" checked={isRecording} onClick={handleStartSession} />
            <img style={{ height: '1em' }} src={isRecording ? "/src/assets/images/circle-solid-red.svg" : "/src/assets/images/circle-solid.svg"} />
          </label>
          <label className={clsx("btn btn-secondary", { active: !isRecording })}>
            <input type="radio" name="options" id="stop-session" checked={!isRecording} onClick={handleStopSession} />
            <img style={{ height: '1em' }} src="/src/assets/images/square-solid.svg" />
          </label>
        </div>
        <div className={clsx("badge ml-2", isRecording ? 'badge-danger' : 'badge-secondary')}>
          {isRecording ? 'Recording' : 'Stopped' }
        </div>
      </div>
      <div className="d-flex">
        <button 
          className="btn btn-secondary d-flex align-items-center mr-2"
          onClick={handleResetSession}
        >
          {`Reset`}<img className="ml-2" style={{ width: '1em' }} src="/src/assets/images/redo-light.svg" />
        </button>
        <a 
          className="btn btn-info d-flex"
          href={`https://app.mouseflow.com/websites/${websiteId}/recordings/${sessionId}/play`} 
          target="_blank"
        >
          {`View session`}<img className="ml-2" style={{ width: '1em' }} src="/src/assets/images/external-link-light.svg" />
        </a>
      </div>
    </>
  );
};

export default SessionControls;
