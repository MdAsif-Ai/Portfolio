// ─── Shared Premium "About Mohammed Asif" Card Component ──────────────────────
import React from 'react';
import { person } from '../../data/person';
import { openPortfolioMail, downloadResume } from '../../utils/router';
import './AboutCard.css';

export function AboutCard() {
  return (
    <div className="about-card-root fade-in">
      {/* ── WINDOW TITLE BAR / HEADER ── */}
      <div className="about-card-window-header">
        <div className="about-card-traffic-lights">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <div className="about-card-window-title">About Mohammed Asif</div>
      </div>

      {/* ── HERO PROFILE SECTION ── */}
      <div className="about-card-hero">
        <div className="about-card-photo-wrapper">
          <img 
            src={person.avatar} 
            alt={person.name} 
            className="about-card-photo" 
          />
        </div>
        <div className="about-card-hero-meta">
          <h1 className="about-card-name">{person.name}</h1>
          <h2 className="about-card-role">{person.title}</h2>
          <div className="about-card-pill-tags">
            <span className="pill-tag">GenAI</span>
            <span className="pill-tag">LLM</span>
            <span className="pill-tag">Cloud</span>
            <span className="pill-tag">RAG</span>
          </div>

          <blockquote className="about-card-quote">
            “Building intelligent systems that solve real-world problems.”
          </blockquote>

          <div className="about-card-badges">
            <span className="badge-item">🎓 B.Tech AI &amp; ML</span>
            <span className="badge-item">💻 AI Engineer / GenAI Developer</span>
          </div>

          {/* Direct Action Buttons */}
          <div className="about-card-hero-actions">
            <button className="about-action-btn about-btn-primary" onClick={downloadResume}>
              📄 Download Resume (PDF)
            </button>
            <button className="about-action-btn about-btn-secondary" onClick={openPortfolioMail}>
              ✉ Send Email / Contact
            </button>
          </div>
        </div>
      </div>

      {/* ── ABOUT SECTION ── */}
      <div className="about-card-section">
        <div className="about-section-header">
          <span className="about-section-icon">💡</span>
          <h3>ABOUT</h3>
        </div>
        <p className="about-section-text">
          I build production-oriented AI systems across LLMs, RAG, backend engineering and cloud infrastructure.
        </p>
      </div>

      {/* ── EXECUTIVE OVERVIEW & ARCHITECTURAL PHILOSOPHY ── */}
      <div className="about-card-section about-exec-overview">
        <div className="about-section-header">
          <span className="about-section-icon">⚙️</span>
          <h3>EXECUTIVE OVERVIEW</h3>
        </div>
        <div className="about-exec-subtitle">
          AI Systems Architect &amp; GenAI Specialist | Autonomous Agent Infrastructure &amp; Distributed Backends
        </div>
        <p className="about-section-text">
          I engineer mission-critical Generative AI architectures, autonomous multi-agent systems, and high-concurrency distributed backends.
        </p>
        <p className="about-section-text">
          Where the broader market often stops at surface-level API wrappers and brittle prompt chains, my focus lies in constructing production-grade, deterministic software out of probabilistic models. I bridge the gap between low-level neural model adaptation—fine-tuning open-source LLMs using parameter-efficient methods—and resilient systems engineering built on asynchronous microservices, distributed in-memory caching, and cyclic state machines.
        </p>
        <p className="about-section-text">
          Having designed, fine-tuned, and containerized architectures across dozens of production codebases, I help forward-thinking teams move beyond AI proof-of-concepts into resilient, secure, and observable production environments.
        </p>
        
        <div className="about-philosophy-box">
          <div className="about-philosophy-title">ARCHITECTURAL PHILOSOPHY</div>
          <blockquote className="about-philosophy-quote">
            “Intelligent models are only as valuable as the runtime systems that constrain, serve, and orchestrate them.”
          </blockquote>
        </div>
      </div>

      {/* ── SYSTEM PROFILE TABLE ── */}
      <div className="about-card-section">
        <div className="about-section-header">
          <span className="about-section-icon">📋</span>
          <h3>SYSTEM PROFILE</h3>
        </div>
        <div className="about-system-profile-grid">
          <div className="profile-row">
            <span className="profile-label">Name</span>
            <span className="profile-value bold">{person.name}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Role</span>
            <span className="profile-value">AI / ML Engineer</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Specialization</span>
            <span className="profile-value">GenAI • LLM • RAG</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Education</span>
            <span className="profile-value">B.Tech Artificial Intelligence &amp; ML</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Focus</span>
            <span className="profile-value">Production AI Systems</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Currently</span>
            <span className="profile-value highlight">Building &amp; learning</span>
          </div>
        </div>
      </div>

      {/* ── CONNECTED ACCOUNTS GRID ── */}
      <div className="about-card-section">
        <div className="about-section-header">
          <span className="about-section-icon">🌐</span>
          <h3>CONNECTED ACCOUNTS</h3>
        </div>
        <div className="about-accounts-grid">

          {/* GitHub Card */}
          <a 
            href={person.github} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="account-card card-github"
          >
            <div className="account-card-header">
              <div className="account-icon-wrapper github-glow">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </div>
              <span className="account-badge">Codebase</span>
            </div>
            <div className="account-card-body">
              <h4 className="account-title">GitHub</h4>
              <p className="account-meta">34+ Repositories</p>
            </div>
            <div className="account-card-footer">
              <span>Open Codebase</span>
              <span className="arrow">→</span>
            </div>
          </a>

          {/* HuggingFace Card */}
          <a 
            href={person.huggingface} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="account-card card-huggingface"
          >
            <div className="account-card-header">
              <div className="account-icon-wrapper hf-glow">
                <span className="hf-emoji">🤗</span>
              </div>
              <span className="account-badge">AI Models</span>
            </div>
            <div className="account-card-body">
              <h4 className="account-title">Hugging Face</h4>
              <p className="account-meta">Models &amp; Datasets</p>
            </div>
            <div className="account-card-footer">
              <span>View Models</span>
              <span className="arrow">→</span>
            </div>
          </a>

          {/* LinkedIn Card */}
          <a 
            href={person.linkedin} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="account-card card-linkedin"
          >
            <div className="account-card-header">
              <div className="account-icon-wrapper linkedin-glow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </div>
              <span className="account-badge">Network</span>
            </div>
            <div className="account-card-body">
              <h4 className="account-title">LinkedIn</h4>
              <p className="account-meta">Professional Profile</p>
            </div>
            <div className="account-card-footer">
              <span>Connect</span>
              <span className="arrow">→</span>
            </div>
          </a>

          {/* LeetCode Card */}
          <a 
            href={person.leetcode} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="account-card card-leetcode"
          >
            <div className="account-card-header">
              <div className="account-icon-wrapper leetcode-glow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.17 5.79a1.374 1.374 0 0 0-.005 1.941l4.894 4.908a1.374 1.374 0 0 0 1.942.005l5.352-5.352a1.374 1.374 0 0 0 0-1.942L14.448.438A1.374 1.374 0 0 0 13.483 0zm-6.26 8.948a1.374 1.374 0 0 0-.96.438L.91 14.739a1.374 1.374 0 0 0 0 1.942l5.353 5.352a1.374 1.374 0 0 0 1.942 0l5.353-5.352a1.374 1.374 0 0 0 0-1.942L8.184 9.386a1.374 1.374 0 0 0-.961-.438z"/>
                </svg>
              </div>
              <span className="account-badge">DSA &amp; Algos</span>
            </div>
            <div className="account-card-body">
              <h4 className="account-title">LeetCode</h4>
              <p className="account-meta">Problem Solving</p>
            </div>
            <div className="account-card-footer">
              <span>View Profile</span>
              <span className="arrow">→</span>
            </div>
          </a>

        </div>
      </div>
    </div>
  );
}
