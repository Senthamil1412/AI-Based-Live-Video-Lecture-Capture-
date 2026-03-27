import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const videoFile = formData.get('video') as File;
        const videoTitle = formData.get('title') as string;

        if (!videoFile) {
            return NextResponse.json(
                { error: 'No video file provided' },
                { status: 400 }
            );
        }

        console.log('Processing video with Gemini:', videoFile.name, 'Size:', videoFile.size);

        // Convert file to base64 for Gemini
        const bytes = await videoFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Video = buffer.toString('base64');

        // Use Gemini's multimodal model (can process video directly!)
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

        const prompt = `You are an expert educational content analyzer. Analyze this ${videoTitle ? `"${videoTitle}"` : ''} lecture video and provide a comprehensive educational summary.

Extract and return ONLY valid JSON with this exact structure (no markdown, no code blocks):
{
  "transcript": "A detailed transcript or summary of what was said in the video. If you cannot transcribe word-for-word, provide a comprehensive summary of the content discussed.",
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

Important: Base everything on the ACTUAL content of the video. Be specific and accurate.`;

        console.log('Sending to Gemini API...');

        const result = await model.generateContent([
            {
                inlineData: {
                    mimeType: videoFile.type,
                    data: base64Video
                }
            },
            prompt
        ]);

        const response = await result.response;
        const text = response.text();

        console.log('Gemini response received, parsing JSON...');

        // Parse the JSON response
        let analysisData;
        try {
            // Remove markdown code blocks if present
            const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            analysisData = JSON.parse(cleanText);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.log('Raw response:', text);
            throw new Error('Failed to parse Gemini response as JSON');
        }

        // Validate structure
        if (!analysisData.transcript || !analysisData.summary || !analysisData.keyPoints) {
            throw new Error('Invalid response structure from Gemini');
        }

        console.log('Analysis successful:', {
            transcriptLength: analysisData.transcript.length,
            keyPointsCount: analysisData.keyPoints.length,
            topicsCount: analysisData.topics?.length || 0,
        });

        return NextResponse.json({
            transcript: analysisData.transcript,
            smartNotes: {
                summary: analysisData.summary,
                keyPoints: analysisData.keyPoints,
                topics: analysisData.topics || [],
                qaPairs: analysisData.qaPairs || [],
                actionItems: analysisData.actionItems || []
            }
        });

    } catch (error: any) {
        console.error('Gemini API error:', error);

        if (error.message?.includes('API key')) {
            return NextResponse.json({
                error: 'Invalid Gemini API key. Please check your .env.local file.'
            }, { status: 401 });
        }

        return NextResponse.json({
            error: error.message || 'Video analysis failed',
            details: error.toString()
        }, { status: 500 });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};

export const maxDuration = 300; // 5 minutes
