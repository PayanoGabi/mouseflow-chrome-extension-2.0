declare global {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Window extends Partial<MouseflowGlobals> {
      [key: string]: any;
    }
  }
  
  export interface MouseflowGlobals {
    [key: string]: any;
    mouseflow: Mouseflow;
    mouseflowPath: string;
    mouseflowAutoStart: boolean;
    mouseflowDisableKeyLogging: boolean;
    mouseflowExcludeSubDomains: boolean;
    mouseflowCrossDomainSupport: boolean;
    mouseflowHref: string;
    mouseflowRegisterSubmitTimeout: number;
    mouseflowDisableDomDeduplicator: boolean;
    mouseflowAutoTagging: boolean;
    mouseflowDisableDomReuse: boolean;
    mouseflowHtmlDelay: number;
    mouseflowForceGdpr: boolean;
    mouseflowSessionId: string;
    mouseflowCompress: boolean;
    mouseflowDebug: boolean;
    mouseflowUseCssPaths: boolean;
    mouseflowDisableCssPaths: boolean;
    mouseflowHtmlFetchMode: "post" | "crawl-with-cookies" | "none";
  }
  
  export enum MouseflowEventType {
    FETCH_DIAGNOSTICS = "FETCH_DIAGNOSTICS",
    RECEIVE_DIAGNOSTICS = "RECEIVE_DIAGNOSTICS",
    START_SESSION = "START_SESSION",
    STOP_SESSION = "STOP_SESSION",
    RESET_SESSION = "RESET_SESSION"
  }
  
  export type MouseflowEvent = CustomEvent<MouseflowEventDetail>;
  
  export type MouseflowEventDetail = {
    type: MouseflowEventType.FETCH_DIAGNOSTICS;
  } | {
    type: MouseflowEventType.RECEIVE_DIAGNOSTICS;
    payload: MouseflowDiagnostics;
  } | {
    type: MouseflowEventType.STOP_SESSION;
  } | {
    type: MouseflowEventType.START_SESSION;
  } | {
    type: MouseflowEventType.RESET_SESSION;
    payload: string;
  };
  
  export interface MouseflowDiagnostics {
    installations: string[];
    isInstantiated: boolean;
    version?: string;
    isRecording?: boolean;
    recordingRate?: number;
    websiteId?: string;
    sessionId?: string;
    cookies: {
      [key: string]: string | undefined;
    };
    globals: Partial<MouseflowGlobals>;
    duplicateIds: string[];
    HTMLErrors: string[];
    shadowRoots: number;
    clickableElements: number;
  }
  
  
  export interface Mouseflow {
    version: string;
    isRecording: () => boolean;
    recordingRate: number;
    websiteId: string;
    getSessionId: () => string;
    getPageviewId: () => string;
    stopSession: () => void;
    start: () => void;
  }
  
  export type WebsiteStats = {
    sessionChart: {
      [key: string]: number;
    };
    sessionCount: number;
    pageViews: number;
    visitTime: number;
    averageFrictionScore: number;
  };
  
  export type WebsiteData = {
    id: string;
    name: string;
    created: string;
    recordingStatus: string;
    installationStatus: string;
    thumb: string;
    readOnly: boolean;
    cdnDomainName: string;
    isDemo: boolean;
    isLocked: boolean;
    missingSignOff: boolean;
    details?: WebsiteDetails;
    stats?: WebsiteStats;
  };
  
  export type WebsiteDetails = {
    id: string;
    name: string;
    created: string;
    recordingStatus: 'Recording' | 'Stopped';
    installationStatus: string;
    recordingStatusChangeAllowed: boolean;
    thumb: string;
    readOnly: boolean;
    domains: string[];
    recordingRate: number;
    pageIdentifiers: string[];
    anonymizeIps: boolean;
    blockEuTraffic: boolean;
    disableKeystrokes: boolean;
    excludedIps: string[];
    cdnDomainName: string;
    isDemo: boolean;
    cssSelectorBlacklist: string[];
    cssSelectorWhitelist: string[];
    honorDoNotTrack: boolean;
    remainingRecordings: number;
    maxRecordingsPerMonth: number;
    pageRules: {
      type: string;
      value: string;
    }[];
    mergeUrls: {
      type: string;
      value: string;
      alias: string;
    }[];
    pageRecordingRules: [];
  };
  
  export interface FeedbackCampaignData {
    campaignId: string;
    name: string;
    enabled: boolean;
    showBranding: boolean;
    triggerType: string;
    screenPosition: string;
    backgroundColor: string;
    foregroundColor: string;
    scope: string;
    startMinimized: boolean;
    canBeDiscarded: boolean;
    pageRules: [];
    segments: [];
    steps: FeedbackCampaignStep[];
    report: FeedbackCampaignReport;
    isLocked: boolean;
    isStarred: boolean;
  }
  
  interface FeedbackCampaignStep {
    stepId: string;
    type: FeedbackCampaignStepType;
    text: string;
    randomize: boolean;
    answers: FeedbackCampaignAnswer[];
  }
  
  interface FeedbackCampaignRadioStep extends FeedbackCampaignStep {
    type: FeedbackCampaignStepType.Radio;
  }
  
  interface FeedbackCampaignCheckboxStep extends FeedbackCampaignStep {
    type: FeedbackCampaignStepType.Checkbox;
    buttonText: string;
  }
  
  interface FeedbackCampaignTextStep extends FeedbackCampaignStep {
    type: FeedbackCampaignStepType.Text | FeedbackCampaignStepType.TextArea;
    buttonText: string;
  }
  
  interface FeedbackCampaignNpsStep extends FeedbackCampaignStep {
    type: FeedbackCampaignStepType.NPS;
    npsLikelyText: string;
    npsNotLikelyText: string;
    npsSmileys: boolean;
  }
  
  interface FeedbackCampaignSuccessStep extends FeedbackCampaignStep {
    type: FeedbackCampaignStepType.Success;
    buttonText: string;
  }
  
  enum FeedbackCampaignStepType {
    Radio = "radio",
    Checkbox = "checkbox",
    Text = "text",
    TextArea = "textarea",
    NPS = "nps",
    Success = "success",
  }
  
  interface FeedbackCampaignAnswer {
    answerId: string;
    value: string;
    skipTo?: string;
  }
  
  interface FeedbackCampaignReport {
    impressions: number;
    responses: number;
    replies: FeedbackCampaignReply[];
    responseChart: {
      [key: string]: number;
    };
    stepCharts: {
      [key: string]: {
        [key: string]: number;
      };
    };
  }
  
  interface FeedbackCampaignReply {
    steps: {
      stepId: string;
      answerValues: string[];
    }[];
    created: string;
    sessionId: string;
    pageId: string;
    websitePage: string;
    country: string;
    region: string;
    city: string;
    isp: string;
    ip: string;
    lang: string;
    visitorId: string;
    url: string;
    tags: string[];
    variables: string[];
    visitorName: null;
  }