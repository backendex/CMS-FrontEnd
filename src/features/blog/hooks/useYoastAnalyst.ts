import { useState, useEffect } from 'react';
import { SeoMetadata } from '@/features/blog/types/types';

export interface SeoCheck {
  id: string;
  label: string;
  description: string;
  status: 'good' | 'ok' | 'problem' | 'info';
}

export interface YoastScore {
  color: string;
  message: string;
  points: number;
  checks: SeoCheck[];
}

export const useYoastAnalysis = (content: string, title: string, seoData: SeoMetadata) => {
  const [score, setScore] = useState<YoastScore>({
    color: 'gray',
    message: 'Waiting for content...',
    points: 0,
    checks: []
  });

  useEffect(() => {
    const { focusKeyword, seoTitle, metaDescription } = seoData;
    const checks: SeoCheck[] = [];

    // 1. Focus keyword
    if (!focusKeyword || focusKeyword.length < 3) {
      setScore({ 
        color: '#d3d3d3', 
        message: 'Enter a focus keyword to analyze', 
        points: 0,
        checks: [{
          id: 'keyword-missing',
          label: 'Focus keyword',
          description: 'No focus keyword has been set for this post.',
          status: 'problem'
        }]
      });
      return;
    }

    let currentPoints = 0;
    const keywordLower = focusKeyword.toLowerCase();
    const contentLower = content.toLowerCase();
    const titleToAnalyze = (seoTitle || title).toLowerCase();

    // --- TITLE ANALYSIS ---
    if (titleToAnalyze.includes(keywordLower)) {
      currentPoints += 30;
      checks.push({
        id: 'title-keyword',
        label: 'Focus keyword in title',
        description: 'Good job! The focus keyword appears in the SEO title.',
        status: 'good'
      });
    } else {
      checks.push({
        id: 'title-keyword',
        label: 'Focus keyword in title',
        description: 'The focus keyword does not appear in the SEO title.',
        status: 'problem'
      });
    }

    // --- META DESCRIPTION ANALYSIS ---
    if (metaDescription) {
      if (metaDescription.toLowerCase().includes(keywordLower)) {
        currentPoints += 30;
        checks.push({
          id: 'meta-keyword',
          label: 'Focus keyword in meta description',
          description: 'The focus keyword or its synonyms appear in the meta description.',
          status: 'good'
        });
      } else {
        checks.push({
          id: 'meta-keyword',
          label: 'Focus keyword in meta description',
          description: 'A meta description has been specified, but it does not contain the focus keyword.',
          status: 'problem'
        });
      }

      if (metaDescription.length >= 120 && metaDescription.length <= 160) {
        currentPoints += 10;
        checks.push({
          id: 'meta-length',
          label: 'Meta description length',
          description: 'Well done! The meta description has an optimal length.',
          status: 'good'
        });
      } else {
        checks.push({
          id: 'meta-length',
          label: 'Meta description length',
          description: `The meta description is too ${metaDescription.length < 120 ? 'short' : 'long'} (${metaDescription.length} characters). The maximum is 160.`,
          status: 'ok'
        });
      }
    } else {
      checks.push({
        id: 'meta-missing',
        label: 'Meta description',
        description: 'No meta description has been specified. Search engines will display text from the content instead.',
        status: 'problem'
      });
    }

    // --- CONTENT ANALYSIS ---
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
    if (wordCount >= 300) {
      currentPoints += 10;
      checks.push({
        id: 'word-count',
        label: 'Text length',
        description: `The text contains ${wordCount} words. This is more than or equal to the recommended minimum of 300 words.`,
        status: 'good'
      });
    } else {
      checks.push({
        id: 'word-count',
        label: 'Text length',
        description: `The text contains ${wordCount} words. This is very little, try to reach at least 300.`,
        status: 'problem'
      });
    }

    if (contentLower.includes(keywordLower)) {
      currentPoints += 20;
      const count = (contentLower.match(new RegExp(keywordLower, 'g')) || []).length;
      checks.push({
        id: 'content-keyword',
        label: 'Focus keyword density',
        description: `The focus keyword was found ${count} times. Excellent!`,
        status: 'good'
      });
    } else {
      checks.push({
        id: 'content-keyword',
        label: 'Focus keyword density',
        description: 'The focus keyword was not found in the content.',
        status: 'problem'
      });
    }

    // 5. Determine final color (Traffic light)
    let color = '#ff4d4d';
    let message = 'Poor SEO';

    if (currentPoints >= 70) {
      color = '#4caf50';
      message = 'Excellent SEO!';
    } else if (currentPoints >= 40) {
      color = '#ffa500';
      message = 'Acceptable SEO';
    }

    setScore({ color, message, points: currentPoints, checks });

  }, [content, title, seoData]);

  return score;
};