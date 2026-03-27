'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    FiArrowLeft,
    FiDownload,
    FiFileText,
    FiClock,
    FiUser,
    FiSearch,
    FiZap,
    FiCheckCircle,
    FiHelpCircle,
} from 'react-icons/fi';
import styles from './lecture.module.css';

interface TranscriptSegment {
    id: number;
    speaker: string;
    text: string;
    start: string;
    end: string;
}

interface SmartNotes {
    summary: string;
    keyPoints: string[];
    topics: { name: string; timestamp: string }[];
    qaPairs: { question: string; answer: string; timestamp: string }[];
    actionItems: string[];
}

// Mock data
const mockLecture = {
    id: '1',
    title: 'Introduction to Machine Learning',
    description: 'Comprehensive overview of ML fundamentals and algorithms',
    date: '2026-02-01',
    duration: 3600,
};

const mockTranscript: TranscriptSegment[] = [
    {
        id: 1,
        speaker: 'Professor Smith',
        text: 'Welcome to Introduction to Machine Learning. Today we will cover the fundamental concepts of supervised and unsupervised learning.',
        start: '00:00:05',
        end: '00:00:15',
    },
    {
        id: 2,
        speaker: 'Professor Smith',
        text: 'Machine Learning is a subset of artificial intelligence that allows computers to learn from data without being explicitly programmed.',
        start: '00:00:16',
        end: '00:00:28',
    },
    {
        id: 3,
        speaker: 'Professor Smith',
        text: 'There are three main types of machine learning: supervised learning, unsupervised learning, and reinforcement learning.',
        start: '00:00:29',
        end: '00:00:40',
    },
];

const mockSmartNotes: SmartNotes = {
    summary:
        'This lecture introduces the fundamental concepts of Machine Learning, covering supervised learning, unsupervised learning, and reinforcement learning. The professor explains how ML is a subset of AI that enables computers to learn from data. Key algorithms and practical applications are discussed.',
    keyPoints: [
        'Machine Learning is a subset of Artificial Intelligence',
        'ML enables computers to learn from data without explicit programming',
        'Three main types: Supervised, Unsupervised, and Reinforcement Learning',
        'Supervised learning uses labeled data for training',
        'Unsupervised learning finds patterns in unlabeled data',
        'Real-world applications include image recognition, recommendation systems, and prediction models',
    ],
    topics: [
        { name: 'Introduction to ML', timestamp: '00:00:05' },
        { name: 'Types of Machine Learning', timestamp: '00:05:30' },
        { name: 'Supervised Learning', timestamp: '00:15:20' },
        { name: 'Unsupervised Learning', timestamp: '00:30:45' },
        { name: 'Practical Applications', timestamp: '00:45:10' },
    ],
    qaPairs: [
        {
            question: 'What is the difference between supervised and unsupervised learning?',
            answer: 'Supervised learning uses labeled data where the model learns from examples with known outputs, while unsupervised learning works with unlabeled data to find hidden patterns.',
            timestamp: '00:20:15',
        },
        {
            question: 'What are some real-world applications of machine learning?',
            answer: 'Common applications include image and speech recognition, recommendation systems (like Netflix), autonomous vehicles, fraud detection, and medical diagnosis.',
            timestamp: '00:48:30',
        },
    ],
    actionItems: [
        'Read Chapter 1-3 of the textbook on ML fundamentals',
        'Complete Lab Assignment 1 on supervised learning',
        'Watch supplementary videos on linear regression',
    ],
};

export default function LecturePage() {
    const params = useParams();
    const [activeTab, setActiveTab] = useState<'summary' | 'keyPoints' | 'topics' | 'qa'>('summary');
    const [searchQuery, setSearchQuery] = useState('');
    const [lecture, setLecture] = useState<any>(null);
    const [transcript, setTranscript] = useState<TranscriptSegment[]>(mockTranscript);
    const [smartNotes, setSmartNotes] = useState<SmartNotes>(mockSmartNotes);

    // Load lecture data from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined' && params.id) {
            // Try to load from localStorage first (uploaded videos)
            const storedLectures = JSON.parse(localStorage.getItem('lectures') || '[]');
            const uploadedLecture = storedLectures.find((l: any) => l.id === params.id);

            if (uploadedLecture) {
                // Use uploaded lecture data
                setLecture(uploadedLecture);

                // Convert transcript to proper format
                const transcriptText = uploadedLecture.transcript || '';
                const sentences = transcriptText.split(/[.!?]+/).filter((s: string) => s.trim().length > 0);
                const formattedTranscript = sentences.map((sentence: string, index: number) => ({
                    id: index + 1,
                    speaker: 'Speaker',
                    text: sentence.trim(),
                    start: `00:${String(index * 2).padStart(2, '0')}:00`,
                    end: `00:${String(index * 2 + 1).padStart(2, '0')}:59`,
                }));
                setTranscript(formattedTranscript);

                // Use uploaded smart notes
                if (uploadedLecture.smartNotes) {
                    const notes = uploadedLecture.smartNotes;
                    setSmartNotes({
                        summary: notes.summary || '',
                        keyPoints: notes.keyPoints || [],
                        topics: notes.topics?.map((t: string, i: number) => ({
                            name: t,
                            timestamp: `00:${String(i * 5).padStart(2, '0')}:00`
                        })) || [],
                        qaPairs: notes.qaPairs?.map((qa: any) => ({
                            ...qa,
                            timestamp: qa.timestamp || '00:00:00'
                        })) || [],
                        actionItems: notes.actionItems || [],
                    });
                }
            } else {
                // Fallback to mock data for demo lectures
                setLecture(mockLecture);
                setTranscript(mockTranscript);
                setSmartNotes(mockSmartNotes);
            }
        }
    }, [params.id]);

    if (!lecture) {
        return (
            <div className={styles.page}>
                <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                    <div className="spinner" style={{ margin: '0 auto' }} />
                    <p style={{ marginTop: '1rem' }}>Loading lecture...</p>
                </div>
            </div>
        );
    }

    const filteredTranscript = transcript.filter(segment =>
        segment.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        segment.speaker.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const downloadPDF = () => {
        alert('PDF export functionality would generate a downloadable PDF with all notes and transcript');
    };

    const downloadTranscript = () => {
        const text = transcript.map(t => `[${t.start} - ${t.end}] ${t.speaker}: ${t.text}`).join('\n\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transcript-${params.id}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className={styles.page}>
            {/* Header */}
            <header className={styles.header}>
                <div className="container">
                    <Link href="/library" className={styles.backButton}>
                        <FiArrowLeft /> Back to Library
                    </Link>

                    <div className={styles.headerContent}>
                        <div>
                            <h1>{lecture.title}</h1>
                            <p className={styles.description}>{lecture.description}</p>
                            <div className={styles.meta}>
                                <span>
                                    <FiClock /> 1h 0m
                                </span>
                                <span>
                                    <FiUser /> {new Date(lecture.date).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <div className={styles.headerActions}>
                            <button className="btn btn-secondary" onClick={downloadTranscript}>
                                <FiFileText /> Export Transcript
                            </button>
                            <button className="btn btn-primary" onClick={downloadPDF}>
                                <FiDownload /> Export PDF
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container">
                <div className={styles.layout}>
                    {/* Main Content - Smart Notes */}
                    <div className={styles.mainSection}>
                        <div className={`glass-card ${styles.notesCard}`}>
                            <div className={styles.notesHeader}>
                                <div className={styles.notesTitle}>
                                    <FiZap className={styles.aiIcon} />
                                    <h2>AI Smart Notes</h2>
                                </div>

                                <div className={styles.tabs}>
                                    <button
                                        className={activeTab === 'summary' ? styles.activeTab : ''}
                                        onClick={() => setActiveTab('summary')}
                                    >
                                        Summary
                                    </button>
                                    <button
                                        className={activeTab === 'keyPoints' ? styles.activeTab : ''}
                                        onClick={() => setActiveTab('keyPoints')}
                                    >
                                        Key Points
                                    </button>
                                    <button
                                        className={activeTab === 'topics' ? styles.activeTab : ''}
                                        onClick={() => setActiveTab('topics')}
                                    >
                                        Topics
                                    </button>
                                    <button
                                        className={activeTab === 'qa' ? styles.activeTab : ''}
                                        onClick={() => setActiveTab('qa')}
                                    >
                                        Q&A
                                    </button>
                                </div>
                            </div>

                            <div className={styles.notesContent}>
                                {activeTab === 'summary' && (
                                    <div className={styles.summarySection}>
                                        <h3>Lecture Summary</h3>
                                        <p>{smartNotes.summary}</p>

                                        {smartNotes.actionItems.length > 0 && (
                                            <div className={styles.actionItems}>
                                                <h4>
                                                    <FiCheckCircle /> Action Items
                                                </h4>
                                                <ul>
                                                    {smartNotes.actionItems.map((item, index) => (
                                                        <li key={index}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'keyPoints' && (
                                    <div className={styles.keyPointsSection}>
                                        <h3>Key Points</h3>
                                        <div className={styles.keyPointsList}>
                                            {smartNotes.keyPoints.map((point, index) => (
                                                <div key={index} className={styles.keyPoint}>
                                                    <div className={styles.keyPointNumber}>{index + 1}</div>
                                                    <p>{point}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'topics' && (
                                    <div className={styles.topicsSection}>
                                        <h3>Topics Covered</h3>
                                        <div className={styles.topicsList}>
                                            {smartNotes.topics.map((topic, index) => (
                                                <div key={index} className={styles.topicItem}>
                                                    <div className={styles.topicInfo}>
                                                        <h4>{topic.name}</h4>
                                                        <span className={styles.timestamp}>
                                                            <FiClock /> {topic.timestamp}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'qa' && (
                                    <div className={styles.qaSection}>
                                        <h3>Questions & Answers</h3>
                                        <div className={styles.qaList}>
                                            {smartNotes.qaPairs.map((qa, index) => (
                                                <div key={index} className={styles.qaItem}>
                                                    <div className={styles.question}>
                                                        <FiHelpCircle />
                                                        <h4>{qa.question}</h4>
                                                    </div>
                                                    <div className={styles.answer}>
                                                        <p>{qa.answer}</p>
                                                        <span className={styles.timestamp}>
                                                            <FiClock /> {qa.timestamp}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Side Panel - Transcript */}
                    <div className={styles.sidePanel}>
                        <div className={`glass-card ${styles.transcriptCard}`}>
                            <div className={styles.transcriptHeader}>
                                <h3>
                                    <FiFileText /> Transcript
                                </h3>
                                <span className={styles.segmentCount}>{transcript.length} segments</span>
                            </div>

                            <div className={styles.searchBar}>
                                <FiSearch />
                                <input
                                    type="text"
                                    placeholder="Search transcript..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className={styles.transcriptList}>
                                {filteredTranscript.map(segment => (
                                    <div key={segment.id} className={styles.transcriptItem}>
                                        <div className={styles.transcriptMeta}>
                                            <span className={styles.speaker}>{segment.speaker}</span>
                                            <span className={styles.time}>{segment.start}</span>
                                        </div>
                                        <p className={styles.transcriptText}>
                                            {searchQuery && segment.text.toLowerCase().includes(searchQuery.toLowerCase())
                                                ? segment.text.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) =>
                                                    part.toLowerCase() === searchQuery.toLowerCase() ? (
                                                        <mark key={i} className={styles.highlight}>{part}</mark>
                                                    ) : (
                                                        part
                                                    )
                                                )
                                                : segment.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
