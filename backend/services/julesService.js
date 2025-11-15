import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const JULES_API_KEY = process.env.JULES_API_KEY || process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;
// Use OpenRouter endpoint (OpenAI-compatible, works with many AI models)
// You can override this with JULES_API_URL in .env if needed
const JULES_API_URL = process.env.JULES_API_URL || process.env.OPENAI_API_URL || 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Call Jules API with a prompt
 */
async function callJulesAPI(prompt, systemPrompt = null) {
  try {
    const messages = [];
    
    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt
      });
    }
    
    messages.push({
      role: 'user',
      content: prompt
    });

    const apiKey = JULES_API_KEY;
    if (!apiKey) {
      throw new Error('API key is not set. Please set JULES_API_KEY or OPENAI_API_KEY in .env file');
    }

    console.log(`Calling API: ${JULES_API_URL}`);
    console.log(`Using API key: ${apiKey.substring(0, 10)}...`);
    
    const response = await fetch(JULES_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3001', // OpenRouter requires this
        'X-Title': 'LinkedIn Insight Agent' // Optional: identifies your app
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo', // Using cheaper model (gpt-3.5-turbo instead of gpt-4)
        messages: messages,
        temperature: 0.7,
        max_tokens: 300 // Reduced tokens for cost efficiency
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Jules API error: ${response.status}`;
      
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error) {
          errorMessage = errorData.error.message || errorText;
          
          // Provide helpful message for credit errors
          if (response.status === 402 || errorMessage.includes('credits')) {
            errorMessage = 'Insufficient API credits. Please add credits to your OpenRouter account at https://openrouter.ai/settings/credits or use a different API key with credits.';
          }
        }
      } catch (e) {
        errorMessage = errorText;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error calling Jules API:', error);
    throw error;
  }
}

/**
 * Generate summary of LinkedIn post
 */
export async function generateSummary(postText) {
  const prompt = `Please provide a concise summary (2-3 sentences) of the following LinkedIn post:\n\n${postText}`;
  const systemPrompt = 'You are a helpful assistant that summarizes LinkedIn posts clearly and concisely.';
  return await callJulesAPI(prompt, systemPrompt);
}

/**
 * Extract main idea from LinkedIn post
 */
export async function extractMainIdea(postText) {
  const prompt = `What is the main idea or key message of this LinkedIn post? Provide a single, clear sentence:\n\n${postText}`;
  const systemPrompt = 'You are an expert at identifying core messages and main ideas from social media posts.';
  return await callJulesAPI(prompt, systemPrompt);
}

/**
 * Generate actionable steps
 */
export async function generateActionableSteps(postText) {
  const prompt = `Based on this LinkedIn post, provide 3 prioritized actionable steps that someone could take. Format as a numbered list:\n\n${postText}`;
  const systemPrompt = 'You are a productivity expert that extracts actionable insights from content. Provide clear, specific, prioritized steps.';
  const response = await callJulesAPI(prompt, systemPrompt);
  
  // Parse the response into an array of steps
  const steps = response
    .split('\n')
    .filter(line => line.trim().match(/^\d+[\.\)]/))
    .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
    .filter(step => step.length > 0)
    .slice(0, 3);
  
  return steps.length > 0 ? steps : ['Review the post content', 'Identify key takeaways', 'Plan next steps'];
}

/**
 * Generate project ideas (optional)
 */
export async function generateProjectIdeas(postText) {
  const prompt = `Based on this LinkedIn post, suggest 2-3 project ideas that could be inspired by or related to this content. Be creative and practical:\n\n${postText}`;
  const systemPrompt = 'You are a creative project advisor that generates practical and inspiring project ideas.';
  const response = await callJulesAPI(prompt, systemPrompt);
  
  // Parse project ideas
  const ideas = response
    .split('\n')
    .filter(line => line.trim().match(/^[-*•]\s|\d+[\.\)]/))
    .map(line => line.replace(/^[-*•]\s*|\d+[\.\)]\s*/, '').trim())
    .filter(idea => idea.length > 0)
    .slice(0, 3);
  
  return ideas.length > 0 ? ideas : [];
}

/**
 * Analyze sentiment of the post
 */
export async function analyzeSentiment(postText) {
  const prompt = `Analyze the sentiment of this LinkedIn post. Respond with ONLY a JSON object in this exact format: {"sentiment": "positive/negative/neutral", "confidence": 0.0-1.0, "emotions": ["emotion1", "emotion2"], "tone": "professional/casual/inspirational/etc"}\n\n${postText}`;
  const systemPrompt = 'You are a sentiment analysis expert. Always respond with valid JSON only.';
  const response = await callJulesAPI(prompt, systemPrompt);
  
  try {
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Error parsing sentiment JSON:', e);
  }
  
  // Fallback
  return {
    sentiment: 'neutral',
    confidence: 0.5,
    emotions: ['professional'],
    tone: 'professional'
  };
}

/**
 * Extract key topics and tags
 */
export async function extractKeyTopics(postText) {
  const prompt = `Extract the main topics and keywords from this LinkedIn post. Provide 3-5 key topics as a comma-separated list:\n\n${postText}`;
  const systemPrompt = 'You are an expert at identifying key topics and themes in content. Provide concise, relevant topics.';
  const response = await callJulesAPI(prompt, systemPrompt);
  
  // Parse topics
  const topics = response
    .split(/[,;]/)
    .map(t => t.trim())
    .filter(t => t.length > 0)
    .slice(0, 5);
  
  return topics.length > 0 ? topics : ['General', 'Professional'];
}

/**
 * Identify target audience
 */
export async function identifyTargetAudience(postText) {
  const prompt = `Who is the target audience for this LinkedIn post? Describe the primary audience in 1-2 sentences:\n\n${postText}`;
  const systemPrompt = 'You are a marketing expert that identifies target audiences for content.';
  return await callJulesAPI(prompt, systemPrompt);
}

/**
 * Calculate post quality score and provide improvement suggestions
 */
export async function analyzePostQuality(postText) {
  const prompt = `Analyze this LinkedIn post and provide: 1) A quality score from 1-10, 2) 2-3 specific suggestions for improvement. Respond in JSON format: {"score": 8, "suggestions": ["suggestion1", "suggestion2"], "strengths": ["strength1"], "weaknesses": ["weakness1"]}\n\n${postText}`;
  const systemPrompt = 'You are a content quality expert. Always respond with valid JSON only.';
  const response = await callJulesAPI(prompt, systemPrompt);
  
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Error parsing quality JSON:', e);
  }
  
  // Fallback
  return {
    score: 7,
    suggestions: ['Add more specific examples', 'Include a clear call-to-action'],
    strengths: ['Clear message'],
    weaknesses: ['Could be more engaging']
  };
}

/**
 * Process LinkedIn post and generate all insights
 */
export async function processLinkedInPost(postText) {
  try {
    // Try to use API first, fallback to local processing if credits unavailable
    try {
      // Run core AI tasks first (most important) - these are essential
      const [summary, mainIdea, actionableSteps] = await Promise.all([
        generateSummary(postText),
        extractMainIdea(postText),
        generateActionableSteps(postText)
      ]);

      // Try to get additional insights, but use defaults if they fail (to save credits)
      let projectIdeas = [];
      let sentiment = { sentiment: 'neutral', confidence: 0.5, emotions: ['professional'], tone: 'professional' };
      let keyTopics = [];
      let targetAudience = 'General professional audience';
      let qualityAnalysis = { score: 7, suggestions: ['Add more specific examples'], strengths: ['Clear message'], weaknesses: ['Could be more engaging'] };

      try {
        // Run additional features - if they fail, we'll use defaults
        const additionalResults = await Promise.allSettled([
          generateProjectIdeas(postText),
          analyzeSentiment(postText),
          extractKeyTopics(postText),
          identifyTargetAudience(postText),
          analyzePostQuality(postText)
        ]);

        // Extract results, using defaults if any failed
        projectIdeas = additionalResults[0].status === 'fulfilled' ? additionalResults[0].value : [];
        sentiment = additionalResults[1].status === 'fulfilled' ? additionalResults[1].value : sentiment;
        keyTopics = additionalResults[2].status === 'fulfilled' ? additionalResults[2].value : [];
        targetAudience = additionalResults[3].status === 'fulfilled' ? additionalResults[3].value.trim() : targetAudience;
        qualityAnalysis = additionalResults[4].status === 'fulfilled' ? additionalResults[4].value : qualityAnalysis;
      } catch (additionalError) {
        console.warn('Some additional features failed, using defaults:', additionalError.message);
        // Continue with defaults - core features already succeeded
      }

      return {
        summary: summary.trim(),
        mainIdea: mainIdea.trim(),
        actionableSteps: actionableSteps,
        projectIdeas: projectIdeas,
        sentiment: sentiment,
        keyTopics: keyTopics,
        targetAudience: targetAudience,
        qualityScore: qualityAnalysis.score,
        qualitySuggestions: qualityAnalysis.suggestions || [],
        qualityStrengths: qualityAnalysis.strengths || [],
        qualityWeaknesses: qualityAnalysis.weaknesses || []
      };
    } catch (apiError) {
      // If API fails due to credits, use fallback
      if (apiError.message.includes('credits') || apiError.message.includes('402') || apiError.message.includes('Insufficient')) {
        console.log('⚠️  API credits unavailable, using fallback mode (no API calls needed)...');
        const { processLinkedInPostFallback } = await import('./fallbackService.js');
        return processLinkedInPostFallback(postText);
      } else {
        // Other errors, throw them
        console.error('Error processing LinkedIn post:', apiError);
        throw new Error(`Failed to process post: ${apiError.message}`);
      }
    }
  } catch (error) {
    console.error('Error processing LinkedIn post:', error);
    throw new Error(`Failed to process post: ${error.message}`);
  }
}

