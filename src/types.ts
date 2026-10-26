export interface ConfigOptions {
  hideForYou: boolean;
  autoSwitchToFollowing: boolean;
  hideEntireTablist: boolean; // Classic Twitter look (hides both tabs)
  hideGrok: boolean;
  hidePremium: boolean;
  hideSidebarTrends: boolean;
  hideWhoToFollow: boolean;
  hideVerifiedTab: boolean;
  targetLanguages: string[]; // ['tr', 'en', 'es', 'de', 'fr']
}

export interface GeneratedFile {
  name: string;
  filename: string;
  language: string;
  content: string;
  description: string;
  category: 'extension' | 'userscript' | 'braveshields' | 'github';
}
