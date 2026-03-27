'use client';

import Link from 'next/link';
import { FiVideo, FiMic, FiFileText, FiSearch, FiDownload, FiZap, FiClock, FiStar, FiUpload } from 'react-icons/fi';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className="container">
          <div className={styles.navContent}>
            <div className={styles.logo}>
              <FiZap className={styles.logoIcon} />
              <span className="gradient-text">AI Lecture Capture</span>
            </div>
            <div className={styles.navLinks}>
              <Link href="/library" className="btn btn-secondary btn-sm">
                Library
              </Link>
              <Link href="/record" className="btn btn-primary btn-sm">
                Start Recording
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={`${styles.heroTitle} animate-fade-in`}>
              Transform Your{' '}
              <span className="gradient-text">Video Lectures</span>
              {' '}into Smart Notes
            </h1>
            <p className={`${styles.heroDescription} animate-fade-in`}>
              Capture live video lectures, get real-time transcriptions, and generate AI-powered smart notes automatically. Never miss important information again.
            </p>
            <div className={`${styles.heroButtons} animate-fade-in`}>
              <Link href="/record" className="btn btn-primary btn-lg">
                <FiVideo /> Start Recording
              </Link>
              <Link href="/upload" className="btn btn-secondary btn-lg">
                <FiUpload /> Upload Video
              </Link>
              <Link href="/library" className="btn btn-outline btn-lg">
                View Library
              </Link>
            </div>

            {/* Stats */}
            <div className={`${styles.stats} animate-fade-in`}>
              <div className={styles.stat}>
                <FiClock className={styles.statIcon} />
                <div>
                  <div className={styles.statValue}>Real-time</div>
                  <div className={styles.statLabel}>Transcription</div>
                </div>
              </div>
              <div className={styles.stat}>
                <FiZap className={styles.statIcon} />
                <div>
                  <div className={styles.statValue}>AI-Powered</div>
                  <div className={styles.statLabel}>Smart Notes</div>
                </div>
              </div>
              <div className={styles.stat}>
                <FiStar className={styles.statIcon} />
                <div>
                  <div className={styles.statValue}>100%</div>
                  <div className={styles.statLabel}>Searchable</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className="gradient-text">Powerful Features</h2>
            <p>Everything you need to capture and organize your lectures</p>
          </div>

          <div className="grid grid-3">
            <div className="glass-card animate-fade-in">
              <div className={styles.featureIcon}>
                <FiVideo />
              </div>
              <h3>Multi-Source Recording</h3>
              <p>Record webcam, screen, or both simultaneously. Perfect for capturing presentations and demonstrations.</p>
            </div>

            <div className="glass-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className={styles.featureIcon}>
                <FiMic />
              </div>
              <h3>Real-Time Transcription</h3>
              <p>Get accurate speech-to-text transcription as you record, with speaker identification and timestamps.</p>
            </div>

            <div className="glass-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className={styles.featureIcon}>
                <FiFileText />
              </div>
              <h3>AI Smart Notes</h3>
              <p>Automatically generate summaries, key points, topics, and Q&A from your lecture content.</p>
            </div>

            <div className="glass-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className={styles.featureIcon}>
                <FiSearch />
              </div>
              <h3>Advanced Search</h3>
              <p>Search through transcripts instantly. Find specific topics, speakers, or moments with ease.</p>
            </div>

            <div className="glass-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className={styles.featureIcon}>
                <FiDownload />
              </div>
              <h3>Multiple Export Formats</h3>
              <p>Export your notes and transcripts in PDF, Markdown, or DOCX format for easy sharing.</p>
            </div>

            <div className="glass-card animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className={styles.featureIcon}>
                <FiZap />
              </div>
              <h3>Lightning Fast</h3>
              <p>Process and organize hours of content in seconds with our optimized AI pipeline.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={`glass-card ${styles.ctaCard}`}>
            <h2 className="gradient-text">Ready to Get Started?</h2>
            <p>Start capturing your lectures and generating smart notes today.</p>
            <Link href="/record" className="btn btn-primary btn-lg">
              <FiVideo /> Start Your First Recording
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <p>&copy; 2026 AI Lecture Capture. Built with Next.js & AI.</p>
        </div>
      </footer>
    </main>
  );
}
