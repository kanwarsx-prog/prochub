export interface ProcessLink {
  label: string;
  url: string;
}

export interface ProcessStep {
  order: number;
  title: string;
  summary: string;
}

export interface Process {
  id: string;
  title: string;
  block: 'Planning' | 'Execution' | 'Risk & Gov' | 'Enablers' | string;
  section: string;
  domain: string;
  summary: string;
  status: 'Published' | 'Draft';
  articlePageUrl?: string;   // Link to SharePoint Site Page
  links: ProcessLink[];
  related: string[];         // IDs of related processes
  lastModified?: string;
}

export interface ProcessDetail extends Process {
  steps: ProcessStep[];
  articleBody?: string;      // Rendered HTML from SharePoint Page
}

export interface SearchResult {
  id: string;
  title: string;
  summary: string;
  url: string;
  type: 'process' | 'article';
}

export interface Favorite {
  id: string;
  processId: string;
  title: string;
  block: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string; url: string }[];
}

/**
 * A tool/app/report tile managed by content admins in the
 * 'Procurement Hub Tools' SharePoint List.
 */
export interface HubTool {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;           // Emoji or short text icon
  color: string;          // Hex accent colour e.g. #2563eb
  bg: string;             // Hex background colour e.g. #eff6ff
  category: string;       // e.g. P2P, Sourcing, Analytics
  group: string;          // e.g. Apps, Reports, Support — controls section grouping
  sortOrder: number;
  openInNewTab: boolean;
}

export interface FrameworkBlock {
  id: string;
  title: string;
  summary: string;
  icon: string;
  links: { id: string; label: string }[];
}
