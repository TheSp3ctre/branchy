import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-toastify';
import { repoSettingsService } from '@/services/repoSettings';

export interface AnalysisStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed';
}

export interface AnalysisProgress {
  percentage: number;
  step_label: string;
  step_id: string;
  step_index: number;
  total_steps: number;
}

export function useAnalysisProgress(repoId: string) {
  const [progress, setProgress] = useState<AnalysisProgress | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const startAnalysis = useCallback(async () => {
    setIsRunning(true);
    setProgress({ 
      percentage: 0, 
      step_label: 'Iniciando orquestração...', 
      step_id: 'pending',
      step_index: 0,
      total_steps: 5
    });

    const channelName = `analysis-progress-${repoId}`;
    const channel = supabase.channel(channelName)
      .on('broadcast', { event: 'progress' }, ({ payload }) => {
        setProgress(payload as AnalysisProgress);
      })
      .on('broadcast', { event: 'completed' }, () => {
        setIsRunning(false);
        setProgress({ 
             percentage: 100, 
             step_label: 'Análise concluída!', 
             step_id: 'done',
             step_index: 5,
             total_steps: 5
        });
        toast.success('Análise completa finalizada com sucesso!');
        setTimeout(() => setProgress(null), 3000);
      })
      .subscribe();

    try {
      await repoSettingsService.triggerFullAnalysis(repoId);
    } catch (err) {
      console.error('Failed to trigger analysis:', err);
      toast.error('Ocorreu um erro ao iniciar a análise.');
      setIsRunning(false);
      setProgress(null);
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, [repoId]);

  return { progress, isRunning, startAnalysis };
}
