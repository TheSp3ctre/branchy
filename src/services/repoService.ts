import { supabase } from '@/lib/supabase';
import type { AnalysisResult } from '@/types';

export const repoService = {
  async getAllAnalyses(): Promise<AnalysisResult[]> {
    try {
      const { data, error } = await supabase
        .from('Job')
        .select('analysis_result')
        .eq('status', 'COMPLETED')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching analyses from Supabase:', error);
        return [];
      }

      return data
        .map((row) => {
          try {
            const result = typeof row.analysis_result === 'string' 
              ? JSON.parse(row.analysis_result) 
              : row.analysis_result;
            return result as AnalysisResult;
          } catch (e) {
            console.error('Error parsing analysis result:', e);
            return null;
          }
        })
        .filter((r): r is AnalysisResult => r !== null);
    } catch (err) {
      console.error('Failed to fetch from Supabase:', err);
      return [];
    }
  },
};
