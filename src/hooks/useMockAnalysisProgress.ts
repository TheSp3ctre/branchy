import { useState, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';

export interface AnalysisProgress {
  percentage: number;
  step_label: string;
  step_id: string;
  step_index: number;
  total_steps: number;
}

const MOCK_STEPS = [
  { label: 'Iniciando orquestração...', duration: 1500 },
  { label: 'Sincronizando histórico do GitHub...', duration: 2500 },
  { label: 'Escaneando AST (Abstract Syntax Tree)...', duration: 4000 },
  { label: 'Mapeando grafos de dependências...', duration: 3500 },
  { label: 'Identificando padrões de Código Morto...', duration: 3000 },
  { label: 'Calculando Score de Saúde e Complexidade...', duration: 2500 },
  { label: 'Finalizando relatório e documentação...', duration: 2000 },
];

export function useMockAnalysisProgress() {
  const [progress, setProgress] = useState<AnalysisProgress | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const stop = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsRunning(false);
    setProgress(null);
  }, []);

  const startAnalysis = useCallback(async () => {
    setIsRunning(true);
    let currentStep = 0;
    
    const runStep = (index: number) => {
      if (index >= MOCK_STEPS.length) {
        setProgress({
          percentage: 100,
          step_label: 'Análise concluída com sucesso!',
          step_id: 'done',
          step_index: MOCK_STEPS.length,
          total_steps: MOCK_STEPS.length
        });
        toast.success('Análise completa finalizada com sucesso!');
        setIsRunning(false);
        
        timeoutRef.current = setTimeout(() => {
          setProgress(null);
        }, 5000);
        return;
      }

      const step = MOCK_STEPS[index];
      const basePercentage = Math.floor((index / MOCK_STEPS.length) * 100);
      
      setProgress({
        percentage: basePercentage,
        step_label: step.label,
        step_id: `step-${index}`,
        step_index: index,
        total_steps: MOCK_STEPS.length
      });

      // Sub-progress within step
      let subPercent = 0;
      const subInterval = setInterval(() => {
        subPercent += 5;
        if (subPercent >= 100) {
          clearInterval(subInterval);
        } else {
          setProgress(prev => prev ? {
            ...prev,
            percentage: Math.min(99, basePercentage + Math.floor((subPercent / 100) * (100 / MOCK_STEPS.length)))
          } : null);
        }
      }, step.duration / 20);

      timeoutRef.current = setTimeout(() => {
        clearInterval(subInterval);
        runStep(index + 1);
      }, step.duration);
    };

    runStep(0);
  }, []);

  return { progress, isRunning, startAnalysis, stop };
}
