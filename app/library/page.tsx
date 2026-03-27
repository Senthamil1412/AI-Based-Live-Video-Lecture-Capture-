'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiHome, FiVideo, FiSearch, FiFilter, FiPlay, FiTrash2, FiDownload, FiFileText, FiUpload } from 'react-icons/fi';
import styles from './library.module.css';

interface Lecture {
    id: string;
    title: string;
    description: string;
    duration: number;
    date: string;
    thumbnail: string;
    tags: string[];
    status: 'processed' | 'processing' | 'failed';
}

// Mock data for demonstration
const mockLectures: Lecture[] = [
    {
        id: '1',
        title: 'Introduction to Machine Learning',
        description: 'Comprehensive overview of ML fundamentals and algorithms',
        duration: 3600,
        date: '2026-02-01',
        thumbnail: '/placeholder.jpg',
        tags: ['AI', 'Machine Learning', 'Introduction'],
        status: 'processed',
    },
    {
        id: '2',
        title: 'Advanced React Patterns',
        description: 'Deep dive into React hooks, context, and performance optimization',
        duration: 2700,
        date: '2026-01-30',
        thumbnail: '/placeholder.jpg',
        tags: ['React', 'JavaScript', 'Frontend'],
        status: 'processed',
    },
    {
        id: '3',
        title: 'Database Design Principles',
        description: 'Learn about normalization, indexing, and query optimization',
        duration: 4200,
        date: '2026-01-28',
        thumbnail: '/placeholder.jpg',
        tags: ['Database', 'SQL', 'Backend'],
        status: 'processed',
    },
];

export default function LibraryPage() {
    const [lectures, setLectures] = useState<Lecture[]>(mockLectures);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    // Load uploaded lectures from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedLectures = JSON.parse(localStorage.getItem('lectures') || '[]');
            const allLectures = [...mockLectures, ...storedLectures];
            setLectures(allLectures);
        }
    }, []);

    const allTags = Array.from(new Set(lectures.flatMap(l => l.tags)));

    const filteredLectures = lectures.filter(lecture => {
        const matchesSearch = lecture.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lecture.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = !selectedTag || lecture.tags.includes(selectedTag);
        return matchesSearch && matchesTag;
    });

    const formatDuration = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        if (hrs > 0) {
            return `${hrs}h ${mins}m`;
        }
        return `${mins}m`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className={styles.page}>
            {/* Header */}
            <header className={styles.header}>
                <div className="container">
                    <div className={styles.headerContent}>
                        <div>
                            <Link href="/" className={styles.backButton}>
                                <FiHome /> Back to Home
                            </Link>
                            <h1>Lecture Library</h1>
                            <p className={styles.subtitle}>{lectures.length} recorded lectures</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <Link href="/upload" className="btn btn-secondary">
                                Upload Video
                            </Link>
                            <Link href="/record" className="btn btn-primary">
                                <FiVideo /> New Recording
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container">
                {/* Search and Filters */}
                <div className={styles.toolbar}>
                    <div className={`glass-card ${styles.searchBar}`}>
                        <FiSearch />
                        <input
                            type="text"
                            placeholder="Search lectures..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className={styles.filterSection}>
                        <div className={styles.filterLabel}>
                            <FiFilter /> Filter by tag:
                        </div>
                        <div className={styles.tags}>
                            <button
                                className={`badge ${!selectedTag ? 'badge-primary' : ''}`}
                                onClick={() => setSelectedTag(null)}
                            >
                                All
                            </button>
                            {allTags.map(tag => (
                                <button
                                    key={tag}
                                    className={`badge ${selectedTag === tag ? 'badge-primary' : ''}`}
                                    onClick={() => setSelectedTag(tag)}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Lecture Grid */}
                {filteredLectures.length === 0 ? (
                    <div className={`glass-card ${styles.emptyState}`}>
                        <FiFileText />
                        <h3>No lectures found</h3>
                        <p>Try adjusting your search or filters, or create a new recording</p>
                        <Link href="/record" className="btn btn-primary">
                            <FiVideo /> Start Recording
                        </Link>
                    </div>
                ) : (
                    <div className={`grid grid-3 ${styles.lectureGrid}`}>
                        {filteredLectures.map(lecture => (
                            <div key={lecture.id} className={`card ${styles.lectureCard}`}>
                                <div className={styles.thumbnail}>
                                    <div className={styles.placeholderThumbnail}>
                                        <FiVideo />
                                    </div>
                                    <div className={styles.duration}>{formatDuration(lecture.duration)}</div>
                                    {lecture.status === 'processing' && (
                                        <div className={styles.statusBadge}>
                                            <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                                            Processing...
                                        </div>
                                    )}
                                </div>

                                <div className={styles.cardContent}>
                                    <h3 className={styles.lectureTitle}>{lecture.title}</h3>
                                    <p className={styles.lectureDescription}>{lecture.description}</p>

                                    <div className={styles.lectureTags}>
                                        {lecture.tags.slice(0, 2).map(tag => (
                                            <span key={tag} className="badge">{tag}</span>
                                        ))}
                                        {lecture.tags.length > 2 && (
                                            <span className="badge">+{lecture.tags.length - 2}</span>
                                        )}
                                    </div>

                                    <div className={styles.lectureFooter}>
                                        <span className={styles.lectureDate}>{formatDate(lecture.date)}</span>
                                        <div className={styles.cardActions}>
                                            <Link
                                                href={`/lecture/${lecture.id}`}
                                                className="btn btn-sm btn-primary"
                                            >
                                                <FiPlay /> View
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
