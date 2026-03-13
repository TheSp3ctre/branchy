import { createContext, useContext, useState, ReactNode } from 'react';

export interface AnalysisResult {
  repoId: string;
  repoName: string;
  ownerLogin: string;
  files: number;
  healthScore: number;
  issues: number;
}

interface AnalysisContextType {
  analysisResult: AnalysisResult | null;
  setAnalysisResult: (result: AnalysisResult | null) => void;
}

const AnalysisContext = createContext<AnalysisContextType>({
  analysisResult: null,
  setAnalysisResult: () => {},
});

export const useAnalysis = () => useContext(AnalysisContext);

export const AnalysisProvider = ({ children }: { children: ReactNode }) => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  return (
    <AnalysisContext.Provider value={{ analysisResult, setAnalysisResult }}>
      {children}
    </AnalysisContext.Provider>
  );
};
