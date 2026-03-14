import { supabase } from '@/lib/supabase';
import { N8N_WEBHOOKS } from '@/config/webhooks';

export interface OnboardingGuide {
  id: string;
  repoId: string;
  persona: 'developer' | 'stakeholder' | 'auditor';
  title: string;
  contentMd: string;
  stackBadges: string[];
  mermaidArch: string | null;
  wordCount: number | null;
  modelUsed: string;
  generationTimeMs: number | null;
  createdAt: string;
}

export const onboardingService = {
  async getLatest(repoId: string, persona: string = 'developer'): Promise<OnboardingGuide | null> {
    const { data, error } = await supabase
      .from('onboarding_guides')
      .select('*')
      .eq('repoId', repoId)
      .eq('persona', persona)
      .order('createdAt', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (error) throw error;
    return data;
  },

  async generate(repoId: string, persona: string): Promise<void> {
    const response = await fetch(N8N_WEBHOOKS.GENERATE_ONBOARDING, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo_id: repoId, persona }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate onboarding: ${response.statusText}`);
    }
  }
};
