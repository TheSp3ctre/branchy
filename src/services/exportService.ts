import { supabase } from '@/lib/supabase';
import html2canvas from 'html2canvas';

export const exportService = {
  async logExport(repoId: string, userId: string, type: string, sizeKb?: number) {
    await supabase.from('export_history').insert({
      repoId,
      userId,
      exportType: type,
      fileSizeKb: sizeKb
    });
  },

  async exportToPNG(elementId: string, filename: string) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const canvas = await html2canvas(element, {
      backgroundColor: '#0f1117',
      scale: 2,
      useCORS: true,
    });

    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  },

  downloadMarkdown(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.md`;
    a.click();
    URL.revokeObjectURL(url);
  },

  async requestFullReport(repoId: string) {
    // This would typically trigger an N8n workflow
    const response = await fetch('/api/webhooks/full-report', {
      method: 'POST',
      body: JSON.stringify({ repoId })
    });
    return response.ok;
  }
};
