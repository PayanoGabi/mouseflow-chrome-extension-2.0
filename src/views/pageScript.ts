/* eslint-disable no-console */
/* eslint-disable no-case-declarations */

import Cookies from 'js-cookie';
import { MouseflowEventDetail, MouseflowEvent, MouseflowEventType, MouseflowDiagnostics, MouseflowGlobals, WebsiteData, FeedbackCampaignData } from "./types";

(function() {
  const startSession = function() { // Start a Mouseflow session
    window.mouseflow?.start();
  };

  const stopSession = function() { // Stop the current Mouseflow session
    window.mouseflow?.stopSession();
  };

  const resetSession = function(websiteId: string) { // Stop session, Clear all Mouseflow related cookies and reload the page
    stopSession();
    Cookies.remove(`mf_${websiteId}`);
    // mf_user cookie must have domain specified in order to be cleared. 
    // Domain in this case is by default set to the root domain
    // e.g. on subdomain.example.com the cookie will be set to .example.com
    Cookies.remove('mf_user', { domain: "." + location.hostname.split('.').reverse()[1] + "." + location.hostname.split('.').reverse()[0]});
    window.location.reload();
  };

  const getDiagnostics = function(): MouseflowDiagnostics {
    return {
      installations: getInstallations(),
      isInstantiated: !!window.mouseflow,
      version: window.mouseflow?.version,
      isRecording: window.mouseflow?.isRecording(),
      recordingRate: window.mouseflow?.recordingRate,
      websiteId: window.mouseflow?.websiteId,
      sessionId: window.mouseflow?.getSessionId(),
      cookies: getMouseflowCookies(),
      globals: getMouseflowGlobals(),
      duplicateIds: getDuplicateIds(),
      HTMLErrors: validateHTML(),
      shadowRoots: getShadowRoots(),
      clickableElements: getClickableElements(),
    };
  };

  const getMouseflowGlobals = function(): Partial<MouseflowGlobals> {
    return {
      mouseflowPath: window.mouseflowPath,
      mouseflowAutoStart: window.mouseflowAutoStart,
      mouseflowDisableKeyLogging: window.mouseflowDisableKeyLogging,
      mouseflowExcludeSubDomains: window.mouseflowExcludeSubDomains,
      mouseflowCrossDomainSupport: window.mouseflowCrossDomainSupport,
      mouseflowHref: window.mouseflowHref,
      mouseflowRegisterSubmitTimeout: window.mouseflowRegisterSubmitTimeout,
      mouseflowDisableDomDeduplicator: window.mouseflowDisableDomDeduplicator,
      mouseflowAutoTagging: window.mouseflowAutoTagging,
      mouseflowDisableDomReuse: window.mouseflowDisableDomReuse,
      mouseflowHtmlDelay: window.mouseflowHtmlDelay,
      mouseflowForceGdpr: window.mouseflowForceGdpr,
      mouseflowSessionId: window.mouseflowSessionId,
      mouseflowCompress: window.mouseflowCompress,
      mouseflowDebug: window.mouseflowDebug,
      mouseflowUseCssPaths: window.mouseflowUseCssPaths,
      mouseflowDisableCssPaths: window.mouseflowDisableCssPaths,
      mouseflowHtmlFetchMode: window.mouseflowHtmlFetchMode,
    };
  };
  
  const getMouseflowCookies = function() {
    const mfUser = Cookies.get('mf_user');
    const mfSession = Cookies.get(`mf_${window.mouseflow?.websiteId}`);
    
    return {
      mfUser,
      mfSession,
    };
  };

  const getInstallations = function() {
    const res: string[] = [];
    const regex = /^https:\/\/cdn\.mouseflow\.com\/projects\/(.*).js$/;
    const scripts = document.querySelectorAll('script');

    scripts.forEach((script) => {
      const result = regex.exec(script.src);
      
      if (result === null) {
        return;
      }
      res.push(result[1]);
    });
    return res;
  };

  const getDuplicateIds = function() {
    const findDuplicates = (arr: any[]) => arr.filter((item, index) => arr.indexOf(item) != index);
    const elements = document.querySelectorAll('[id]');
    const ids = Array.from(elements).map((element) => element.id);
    
    const res = new Set(findDuplicates(ids));
    return [...res];
  };

  const validateHTML = function() {
    const res = [];
    const nestedClickableElements = document.querySelectorAll('a a');

    if (nestedClickableElements.length) {
      res.push('Nested clickable elements detected.');
    }
    return res;
  };

  const getShadowRoots = function(node?: HTMLElement) {
    const root = node || document.body;
    const res: Element[] = [];
    
    const elements = root.querySelectorAll('*');
    elements.forEach((element) => { // Traverse entire DOM
      if (element.shadowRoot?.children) { // Check for shadowRoot on every element
        for (const child of Array.from(element.shadowRoot.children)) { // Loop through shadow DOM
          res.push(child);
        }
      }
    });

    return res.length;
  };

  const getClickableElements = function() { // Search DOM for clickable elements that Mouseflow wouldn't normally detect
    const res: Element[] = [];
    const selector = '[class~="btn"], [data-target]';
    const elements = document.querySelectorAll(selector);
    const clickableTags = ['A', 'BUTTON', 'INPUT'];
    
    // Check if clickable elements will have link analytics by default
    // If not, push to result array
    elements.forEach((element) => {
      if (!clickableTags.includes(element.tagName)) {
        res.push(element);
      }
    });
    
    return res.length;
  };

  const downloadFeedbackResponseList = function(e: MouseEvent) {
    e.preventDefault();

    const result: {[key: string]: any }[] = [];
    const match = window.location.pathname.match(/\/websites\/(.{36})\/feedback\/(.{22})/);
    const urlParams = new URLSearchParams(window.location.search);
    const fromdate = urlParams.get('fromdate');
    const todate = urlParams.get('todate');
    const search = new URLSearchParams();
    
    if (fromdate) search.append('fromdate', fromdate);
    if (todate) search.append('todate', todate);

    if (!match) {
      throw new Error('Unable to download Feedback Responses. No Feedback ID found');
    }

    const [, websiteId, feedbackId] = match;

    $.ajax(`https://${window.location.host}/api/websites/${websiteId}/feedback/${feedbackId}?limit=50`)
      .then((feedbackCampaign: FeedbackCampaignData) => {
        const steps = feedbackCampaign.steps;
        const numberOfResponses = feedbackCampaign.report.responses;
        const batchSize = 1000;
        const asyncRequests = [];
        let offset = 0;

        for (let i = 0; i < numberOfResponses / batchSize; i++) {
          asyncRequests.push(
            $.ajax(`https://${window.location.host}/api/websites/${websiteId}/feedback/${feedbackId}?limit=${batchSize}&offset=${offset}`)
              .then((data: FeedbackCampaignData) => {
                const replies = data.report.replies;
                
                replies.forEach((reply) => {
                  const replyData: { [key: string]: string } = {
                    "Recording ID": reply.sessionId,
                    "Submitted": reply.created,
                    "Country": reply.country,
                    "Region": reply.region,
                    "City": reply.city,
                    "Language": reply.lang,
                    "IP": reply.ip,
                    "ISP": reply.isp,
                    "Page": reply.websitePage,
                    "URL": reply.url,
                    "Tags": reply.tags.join(','),
                    "Variables": reply.variables.join(','),
                    "Playback URL": `https://${window.location.host}/websites/${websiteId}/recordings/${reply.sessionId}/pageviews/${reply.pageId}/play`,
                  };

                  steps.forEach((step) => {
                    const replyStep = reply.steps.find((replyStep) => replyStep.stepId === step.stepId);
                    const stepText = `"${step.text}"`;

                    if (typeof replyStep === 'undefined') {
                      return Object.assign(replyData, {
                        [stepText]: '',
                      });
                    }

                    switch (step.type) {
                      case "radio":
                        Object.assign(replyData, {
                          [stepText]: replyStep.answerValues.map((id) => {
                            const answer = step.answers.find((answer) => answer.answerId === id);
                            if (typeof answer === 'undefined') {
                              throw new Error('Unable to find answer with id ' + id);
                            }
                            return answer.value;
                          }).join(','),
                        });
                        break;
                      case "checkbox":
                        Object.assign(replyData, {
                          [stepText]: replyStep.answerValues.map((id) => {
                            const answer = step.answers.find((answer) => answer.answerId === id);
                            if (typeof answer === 'undefined') {
                              throw new Error('Unable to find answer with id ' + id);
                            }
                            return answer.value;
                          }).join(','),
                        });
                        break;
                      case "text":
                        Object.assign(replyData, {
                          [stepText]: replyStep.answerValues.join(','),
                        });
                        break;
                      case "textarea":
                        Object.assign(replyData, {
                          [stepText]: replyStep.answerValues.join(','),
                        });
                        break;
                      case "nps":
                        Object.assign(replyData, {
                          [stepText]: replyStep.answerValues.join(','),
                        });
                        break;
                      default:
                        break;
                    }
                  });
                  
                  result.push(replyData);
                });
              }),
          );
          offset += batchSize;
        }

        $.when(...asyncRequests)
          .then(() => {
            downloadCSV(result, 'feedbackReport.csv');
          });
      });
  };

  const downloadWebsiteList = function() {
    const data: {[key: string]: any }[] = [];
    $.ajax(`https://${window.location.host}/api/websites`).then((websites: WebsiteData[]) => {
      websites.forEach((website) => {
        data.push({
          "Website Name": website.name,
          "Website ID": website.id,
          "Recording Status": website.recordingStatus,
          "Installation Status": website.installationStatus,
          "Created At": website.created,
        });
      });
      downloadCSV(data, 'websiteList.csv');
    });
  };

  const downloadUsageReport = function() {
    const data: {[key: string]: any }[] = [];
    const urlParams = new URLSearchParams(window.location.search);
    const fromdate = urlParams.get('fromdate');
    const todate = urlParams.get('todate');
    const search = new URLSearchParams();
    
    if (fromdate) search.append('fromdate', fromdate);
    if (todate) search.append('todate', todate);

    $.ajax(`https://${window.location.host}/api/websites`)
      .then((websites: WebsiteData[]) => {
        // async get website stats
        $.when(...websites.map((website) => {
          return $.ajax(`https://${window.location.host}/api/websites/${website.id}/stats?${search.toString()}`).then((stats) => {
            website.stats = stats;
          });
        })).then(() => {
          for (let i = 0; i < websites.length; i++) {
            const website = websites[i];
            if (!website.stats)
              return;
            const dates = Object.keys(website.stats.sessionChart);
            for (let j = 0; j < dates.length; j++) {
              const date = new Date(dates[j]);
              data.push({
                Website: website.name,
                'Website ID': website.id,
                Date: `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`,
                'Number of Sessions': website.stats.sessionChart[dates[j]],
              });
            }
          }
          downloadCSV(data, 'usageReport.csv');
        });
      });
  };

  const downloadCSV = function(data: {[key: string]: any }[], filename = 'report.csv') {
    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    let csv = '';
    let ctr = 0;

    const keys = Object.keys(data[0]).map(item => item);

    csv += keys.join(columnDelimiter);
    csv += lineDelimiter;

    data.forEach((item) => {
      ctr = 0;
      keys.forEach((key) => {
        if (ctr > 0) csv += columnDelimiter;

        csv += `"${encodeURIComponent(item[key])}"`;
        ctr += 1;
      });
      csv += lineDelimiter;
    });
    

    csv = `data:text/csv;charset=utf-8,${csv}`;
    const link = document.createElement('a');
    link.setAttribute('href', csv);
    link.setAttribute('download', filename);
    link.click();
  };

  // Enable debugging mode
  window.mouseflowDebug = true;
  console.log("%cMouseflow Support Extension: Enabled Mouseflow debugging mode", "color: #47b475");

  // Attach event listeners for Support Admin menu
  document.getElementById('download-website-list')?.addEventListener('click', downloadWebsiteList);
  document.getElementById('download-usage-report')?.addEventListener('click', downloadUsageReport);
  document.getElementById('download-feedback-responses')?.addEventListener('click', downloadFeedbackResponseList);

  // Attach event listeners for Extension
  document.addEventListener('mouseflow', function (requestEvent: MouseflowEvent) {
    const responseEvent = new CustomEvent<MouseflowEventDetail | unknown >('mouseflow', { detail: {} });
    switch (requestEvent.detail.type) {
      case MouseflowEventType.FETCH_DIAGNOSTICS:
        Object.assign(responseEvent.detail, {
          type: MouseflowEventType.RECEIVE_DIAGNOSTICS,
          payload: getDiagnostics(),
        }),
        document.dispatchEvent(responseEvent);
        break;
      case MouseflowEventType.STOP_SESSION:
        stopSession();
        Object.assign(responseEvent.detail, {
          type: MouseflowEventType.RECEIVE_DIAGNOSTICS,
          payload: getDiagnostics(),
        }),
        document.dispatchEvent(responseEvent);
        break;
      case MouseflowEventType.START_SESSION:
        startSession();
        Object.assign(responseEvent.detail, {
          type: MouseflowEventType.RECEIVE_DIAGNOSTICS,
          payload: getDiagnostics(),
        }),
        document.dispatchEvent(responseEvent);
        break;
      case MouseflowEventType.RESET_SESSION:
        resetSession(requestEvent.detail.payload);
        Object.assign(responseEvent.detail, {
          type: MouseflowEventType.RECEIVE_DIAGNOSTICS,
          payload: getDiagnostics(),
        }),
        document.dispatchEvent(responseEvent);
        break;
      default:
        break;
    }
  } as EventListener);



  
})();
