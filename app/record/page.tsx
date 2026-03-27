'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FiVideo, FiSquare, FiPause, FiPlay, FiMonitor, FiUser, FiMic, FiDownload, FiHome } from 'react-icons/fi';
import styles from './record.module.css';

type RecordingMode = 'webcam' | 'screen' | 'both';
type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped';

interface TranscriptSegment {
    id: number;
    speaker: string;
    text: string;
    timestamp: string;
    confidence: number;
}

export default function RecordPage() {
    const [recordingMode, setRecordingMode] = useState<RecordingMode>('both');
    const [recordingState, setRecordingState] = useState<RecordingState>('idle');
    const [duration, setDuration] = useState(0);
    const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const screenVideoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const screenStreamRef = useRef<MediaStream | null>(null);
    const recognitionRef = useRef<any>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize speech recognition
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'en-US';

                recognition.onresult = (event: any) => {
                    const last = event.results.length - 1;
                    const text = event.results[last][0].transcript;
                    const confidence = event.results[last][0].confidence;
                    const isFinal = event.results[last].isFinal;

                    if (isFinal) {
                        const now = new Date();
                        const timestamp = now.toLocaleTimeString();
                        const newSegment: TranscriptSegment = {
                            id: Date.now(),
                            speaker: 'Speaker',
                            text: text,
                            timestamp: timestamp,
                            confidence: confidence || 0.95,
                        };
                        setTranscript(prev => [...prev, newSegment]);
                    }
                };

                recognitionRef.current = recognition;
            }
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720 },
                audio: true,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Could not access camera. Please check permissions.');
        }
    };

    const startScreenCapture = async () => {
        try {
            const screenStream = await (navigator.mediaDevices as any).getDisplayMedia({
                video: { width: 1920, height: 1080 },
                audio: true,
            });
            screenStreamRef.current = screenStream;
            if (screenVideoRef.current) {
                screenVideoRef.current.srcObject = screenStream;
            }
        } catch (error) {
            console.error('Error accessing screen:', error);
            alert('Could not access screen. Please check permissions.');
        }
    };

    const startRecording = async () => {
        try {
            // Start appropriate streams based on mode
            if (recordingMode === 'webcam' || recordingMode === 'both') {
                await startCamera();
            }
            if (recordingMode === 'screen' || recordingMode === 'both') {
                await startScreenCapture();
            }

            // Combine streams for recording
            let combinedStream: MediaStream;
            if (recordingMode === 'both' && streamRef.current && screenStreamRef.current) {
                combinedStream = new MediaStream([
                    ...screenStreamRef.current.getVideoTracks(),
                    ...streamRef.current.getAudioTracks(),
                ]);
            } else if (recordingMode === 'screen' && screenStreamRef.current) {
                combinedStream = screenStreamRef.current;
            } else if (streamRef.current) {
                combinedStream = streamRef.current;
            } else {
                throw new Error('No stream available');
            }

            const mediaRecorder = new MediaRecorder(combinedStream, {
                mimeType: 'video/webm;codecs=vp9',
            });

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.start(1000); // Collect data every second
            mediaRecorderRef.current = mediaRecorder;
            setRecordingState('recording');

            // Start speech recognition
            if (recognitionRef.current) {
                recognitionRef.current.start();
            }

            // Start timer
            timerRef.current = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);

        } catch (error) {
            console.error('Error starting recording:', error);
            alert('Could not start recording. Please check permissions.');
        }
    };

    const pauseRecording = () => {
        if (mediaRecorderRef.current && recordingState === 'recording') {
            mediaRecorderRef.current.pause();
            setRecordingState('paused');
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    };

    const resumeRecording = () => {
        if (mediaRecorderRef.current && recordingState === 'paused') {
            mediaRecorderRef.current.resume();
            setRecordingState('recording');
            if (recognitionRef.current) {
                recognitionRef.current.start();
            }
            timerRef.current = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setRecordingState('stopped');

            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }

            if (timerRef.current) {
                clearInterval(timerRef.current);
            }

            // Stop all streams
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (screenStreamRef.current) {
                screenStreamRef.current.getTracks().forEach(track => track.stop());
            }
        }
    };

    const downloadRecording = () => {
        if (chunksRef.current.length > 0) {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `lecture-${Date.now()}.webm`;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    const downloadTranscript = () => {
        const text = transcript.map(t => `[${t.timestamp}] ${t.speaker}: ${t.text}`).join('\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transcript-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={styles.page}>
            {/* Header */}
            <header className={styles.header}>
                <div className="container">
                    <div className={styles.headerContent}>
                        <Link href="/" className={styles.backButton}>
                            <FiHome /> Back to Home
                        </Link>
                        <h1>Record Lecture</h1>
                    </div>
                </div>
            </header>

            <div className="container">
                <div className={styles.layout}>
                    {/* Video Preview Section */}
                    <div className={styles.mainSection}>
                        {/* Recording Mode Selection */}
                        {recordingState === 'idle' && (
                            <div className={`glass-card ${styles.modeSelection}`}>
                                <h2>Select Recording Mode</h2>
                                <div className={styles.modeButtons}>
                                    <button
                                        className={`${styles.modeButton} ${recordingMode === 'webcam' ? styles.active : ''}`}
                                        onClick={() => setRecordingMode('webcam')}
                                    >
                                        <FiUser />
                                        <span>Webcam Only</span>
                                    </button>
                                    <button
                                        className={`${styles.modeButton} ${recordingMode === 'screen' ? styles.active : ''}`}
                                        onClick={() => setRecordingMode('screen')}
                                    >
                                        <FiMonitor />
                                        <span>Screen Only</span>
                                    </button>
                                    <button
                                        className={`${styles.modeButton} ${recordingMode === 'both' ? styles.active : ''}`}
                                        onClick={() => setRecordingMode('both')}
                                    >
                                        <FiVideo />
                                        <span>Both (PIP)</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Video Preview */}
                        <div className={`glass-card ${styles.videoContainer}`}>
                            {recordingState === 'idle' ? (
                                <div className={styles.placeholder}>
                                    <FiVideo />
                                    <p>Click "Start Recording" to begin</p>
                                </div>
                            ) : (
                                <div className={styles.videoWrapper}>
                                    {(recordingMode === 'screen' || recordingMode === 'both') && (
                                        <video
                                            ref={screenVideoRef}
                                            autoPlay
                                            muted
                                            className={styles.mainVideo}
                                        />
                                    )}
                                    {(recordingMode === 'webcam' || recordingMode === 'both') && (
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            muted
                                            className={recordingMode === 'both' ? styles.pipVideo : styles.mainVideo}
                                        />
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Controls */}
                        <div className={`glass-card ${styles.controls}`}>
                            <div className={styles.timer}>
                                <div className={`${styles.recordingIndicator} ${recordingState === 'recording' ? styles.recording : ''}`} />
                                <span className={styles.time}>{formatTime(duration)}</span>
                            </div>

                            <div className={styles.controlButtons}>
                                {recordingState === 'idle' && (
                                    <button className="btn btn-primary btn-lg" onClick={startRecording}>
                                        <FiVideo /> Start Recording
                                    </button>
                                )}

                                {recordingState === 'recording' && (
                                    <>
                                        <button className="btn btn-secondary" onClick={pauseRecording}>
                                            <FiPause /> Pause
                                        </button>
                                        <button className="btn btn-error" onClick={stopRecording}>
                                            <FiSquare /> Stop
                                        </button>
                                    </>
                                )}

                                {recordingState === 'paused' && (
                                    <>
                                        <button className="btn btn-primary" onClick={resumeRecording}>
                                            <FiPlay /> Resume
                                        </button>
                                        <button className="btn btn-error" onClick={stopRecording}>
                                            <FiSquare /> Stop
                                        </button>
                                    </>
                                )}

                                {recordingState === 'stopped' && (
                                    <button className="btn btn-primary btn-lg" onClick={downloadRecording}>
                                        <FiDownload /> Download Recording
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Transcript Panel */}
                    <div className={styles.sidePanel}>
                        <div className={`glass-card ${styles.transcriptCard}`}>
                            <div className={styles.transcriptHeader}>
                                <div>
                                    <h3>Live Transcript</h3>
                                    <p className={styles.transcriptCount}>{transcript.length} segments</p>
                                </div>
                                {transcript.length > 0 && (
                                    <button className="btn btn-sm btn-secondary" onClick={downloadTranscript}>
                                        <FiDownload /> Export
                                    </button>
                                )}
                            </div>

                            <div className={styles.transcriptList}>
                                {transcript.length === 0 ? (
                                    <div className={styles.emptyState}>
                                        <FiMic />
                                        <p>Transcript will appear here as you speak</p>
                                    </div>
                                ) : (
                                    transcript.map((segment) => (
                                        <div key={segment.id} className={styles.transcriptItem}>
                                            <div className={styles.transcriptMeta}>
                                                <span className={styles.speaker}>{segment.speaker}</span>
                                                <span className={styles.timestamp}>{segment.timestamp}</span>
                                            </div>
                                            <p className={styles.transcriptText}>{segment.text}</p>
                                            <div className={styles.confidence}>
                                                <div
                                                    className={styles.confidenceBar}
                                                    style={{ width: `${segment.confidence * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
