import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        // Get the audio file from form data
        const formData = await request.formData();
        const audioFile = formData.get('audio') as File;

        if (!audioFile) {
            return NextResponse.json(
                { error: 'No audio file provided' },
                { status: 400 }
            );
        }

        console.log('Transcribing audio file:', audioFile.name, 'Size:', audioFile.size);

        // Call OpenAI Whisper API for transcription
        const transcription = await openai.audio.transcriptions.create({
            file: audioFile,
            model: 'whisper-1',
            response_format: 'verbose_json',
            timestamp_granularities: ['segment'],
        });

        console.log('Transcription completed, length:', transcription.text.length);

        return NextResponse.json({
            transcript: transcription.text,
            segments: transcription.segments || [],
            duration: transcription.duration || 0,
        });

    } catch (error: any) {
        console.error('Transcription error:', error);

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
            error: error.message || 'Transcription failed',
            details: error.toString()
        }, { status: 500 });
    }
}

// Increase max duration for video processing
export const maxDuration = 300; // 5 minutes
