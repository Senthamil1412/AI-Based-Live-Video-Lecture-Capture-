import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
    try {
        const { transcript, videoTitle } = await request.json();

        if (!transcript) {
            return NextResponse.json(
                { error: 'No transcript provided' },
                { status: 400 }
            );
        }

        console.log('Analyzing transcript with Gemini:', transcript.substring(0, 100));

        // Use Gemini text model (FREE!)
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are an expert educational content analyzer. Analyze this ${videoTitle ? `"${videoTitle}"` : ''} lecture transcript and provide a comprehensive educational summary.

Transcript:
${transcript}

Extract and return ONLY valid JSON with this exact structure (no markdown, no code blocks):
{
  "summary": "A comprehensive 2-3 sentence summary of the lecture content",
  "keyPoints": ["5-8 specific key points or concepts discussed", "Make each point specific and actionable"],
  "topics": ["3-5 main topics covered in the lecture"],
  "qaPairs": [
    {
      "question": "A relevant question about the content", 
      "answer": "A clear answer based on what was taught"
    }
  ],
  "actionItems": ["3-5 specific takeaways, assignments, or next steps mentioned"]
}

Important: Base everything on the ACTUAL content of the transcript. Be specific and accurate.`;

        console.log('Sending to Gemini Pro...');

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('Gemini response received, parsing JSON...');

        // Parse the JSON response
        let smartNotes;
        try {
            const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            smartNotes = JSON.parse(cleanText);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.log('Raw response:', text);
            throw new Error('Failed to parse Gemini response as JSON');
        }

        // Validate structure
        if (!smartNotes.summary || !smartNotes.keyPoints) {
            throw new Error('Invalid response structure from Gemini');
        }

        console.log('Analysis successful:', {
            keyPointsCount: smartNotes.keyPoints.length,
            topicsCount: smartNotes.topics?.length || 0,
        });

        return NextResponse.json({
            summary: smartNotes.summary,
            keyPoints: smartNotes.keyPoints,
            topics: smartNotes.topics || [],
            qaPairs: smartNotes.qaPairs || [],
            actionItems: smartNotes.actionItems || []
        });

    } catch (error: any) {
        console.error('Gemini analysis error:', error);

        if (error.message?.includes('API key')) {
            return NextResponse.json({
                error: 'Invalid Gemini API key. Please check your .env.local file.'
            }, { status: 401 });
        }

        return NextResponse.json({
            error: error.message || 'Analysis failed',
            details: error.toString()
        }, { status: 500 });
    }
}

export const maxDuration = 60;
