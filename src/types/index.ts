export interface Module {
  id: string;
  name: string;
  type: 'core' | 'service' | 'util' | 'flagged' | 'component';
  filePath: string;
  loc: number;
  dependsOn: string[];
  usedBy: string[];
  summary: string;
}

export interface Insight {
  type: 'warning' | 'info' | 'success' | 'error';
  text: string;
  fileName?: string;
}

export interface FileComplexity {
  fileName: string;
  filePath: string;
  complexity: number; // 0-100
  level: 'low' | 'medium' | 'high';
}

export interface CircularDep {
  id: string;
  chain: string[];
}

export interface DeadCodeItem {
  id: string;
  moduleName: string;
  type: 'module' | 'function' | 'variable';
  lastModified: string;
  linesCount: number;
  filePath: string;
}

export interface OnboardingSection {
  title: string;
  type: 'overview' | 'techStack' | 'structure' | 'modules' | 'gettingStarted' | 'patterns' | 'runLocally';
  content: any;
}

export interface OnboardingGuide {
  sections: OnboardingSection[];
  generatedAt: string;
}

export interface HealthIssue {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  fileName: string;
  filePath: string;
  title: string;
  description: string;
  suggestedFix: string;
  resolved: boolean;
}

export interface HealthReport {
  overallScore: number;
  maintainability: number;
  testCoverage: number;
  documentation: number;
  issues: HealthIssue[];
}

export interface Changelog {
  id: string;
  commitHash: string;
  author: string;
  message: string;
  date: string;
  filesChanged: number;
  aiSummary?: string;
}

export interface AnalysisResult {
  repoId: string;
  repoName: string;
  owner: string;
  language: string;
  filesCount: number;
  healthScore: number;
  modules: Module[];
  insights: Insight[];
  complexityByFile: FileComplexity[];
  circularDeps: CircularDep[];
  deadCode: DeadCodeItem[];
  onboardingGuide: OnboardingGuide;
  healthReport: HealthReport;
  changelogs: Changelog[];
  analyzedAt: string;
}

export interface RecentRepo {
  repoId: string;
  repoUrl: string;
  repoName: string;
  owner: string;
  status: 'analyzed' | 'outdated';
  analyzedAt: string;
}
