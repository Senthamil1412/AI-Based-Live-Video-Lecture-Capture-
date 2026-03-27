import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const { transcript, videoTitle } = await request.json();

        if (!transcript) {
            return NextResponse.json(
                { error: 'No transcript provided' },
                { status: 400 }
            );
        }

        console.log('Analyzing transcript, length:', transcript.length);

        // Call GPT-4 for content analysis
        const completion = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: [
                {
                    role: 'system',
                    content: `You are an expert educational content analyzer. Your task is to analyze lecture transcripts and extract key educational insights in a structured format. Be accurate and specific to the actual content discussed.`
                },
                {
                    role: 'user',
                    content: `Analyze this ${videoTitle ? `"${videoTitle}"` : ''} lecture transcript and provide a comprehensive educational summary.

Transcript:
${transcript}

Extract and return ONLY valid JSON with this exact structure:
{
  "summary": "A comprehensive 2-3 sentence summary of what was actually covered in the lecture",
  "keyPoints": ["5-8 specific key points or concepts that were discussed", "Make each point specific and actionable"],
  "topics": ["3-5 main topics or sections covered in the lecture"],
  "qaPairs": [
    {
      "question": "A relevant question about the content", 
      "answer": "A clear answer based on what was taught"
    }
  ],
  "actionItems": ["3-5 specific action items, assignments, or takeaways mentioned"]
}

Important: Base everything on the ACTUAL content of the transcript. Be specific and accurate.`
                }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.5, // Lower temperature for more focused, accurate analysis
            max_tokens: 2000,
        });

        const analysisText = completion.choices[0].message.content || '{}';
        console.log('Analysis completed, parsing JSON...');

        const analysis = JSON.parse(analysisText);

        // Validate the response structure
        if (!analysis.summary || !analysis.keyPoints || !analysis.topics) {
            throw new Error('Invalid analysis structure returned from GPT-4');
        }

        console.log('Analysis successful:', {
            summaryLength: analysis.summary.length,
            keyPointsCount: analysis.keyPoints.length,
            topicsCount: analysis.topics.length,
        });

        return NextResponse.json(analysis);

    } catch (error: any) {
        console.error('Analysis error:', error);

        // Handle specific API errors
        if (error.code === 'invalid_api_key') {
            return NextResponse.json({
                error: 'Invalid OpenAI API key. Please check your .env.local file.'
            }, { status: 401 });
        }

        if (error.code === 'insufficient_quota') {
            return NextResponse.json({
                error: 'OpenAI API quota exceeded. Please add credits to your account.'
            }, { status: 402 });
        }

        return NextResponse.json({
            error: error.message || 'Content analysis failed',
            details: error.toString()
        }, { status: 500 });
    }
}

// Increase max duration for AI processing
export const maxDuration = 300; // 5 minutes
