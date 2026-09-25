// ─── Crawlable Semantic Content Component ─────────────────────────────────────
// Ensures search engines (Googlebot) and assistive tools crawl clean semantic HTML
// with full text content, proper H1/H2 headings, internal links, and profile metadata.

import { person } from '../../data/person';
import { projects } from '../../data/projects';
import { blogPosts } from '../../data/blog';
import { skills } from '../../data/skills';
import { experience } from '../../data/experience';
import { certificates } from '../../data/certificates';
import { RouteState, navigateTo } from '../../utils/router';

interface CrawlableContentProps {
  route: RouteState;
}

export function CrawlableContent({ route }: CrawlableContentProps) {
  const handleLinkClick = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigateTo(path);
  };

  return (
    <div 
      id="seo-crawlable-root" 
      className="sr-only-seo"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: '0',
      }}
    >
      <header>
        <h1>Mohammed Asif M H | AI/ML Engineer | GenAI &amp; LLM Specialist</h1>
        <p>
          Engineering high-order cognitive architectures and autonomous intelligence systems designed to solve foundational complexity at mission-critical scale
        </p>

        <nav aria-label="Main Navigation">
          <ul>
            <li><a href="/" onClick={handleLinkClick('/')}>Home</a></li>
            <li><a href="/about" onClick={handleLinkClick('/about')}>About Mohammed Asif M H</a></li>
            <li><a href="/projects" onClick={handleLinkClick('/projects')}>AI Projects by Mohammed Asif M H</a></li>
            <li><a href="/skills" onClick={handleLinkClick('/skills')}>Technical Skills & Stack</a></li>
            <li><a href="/experience" onClick={handleLinkClick('/experience')}>Work Experience</a></li>
            <li><a href="/certificates" onClick={handleLinkClick('/certificates')}>Verified Certificates</a></li>
            <li><a href="/blog" onClick={handleLinkClick('/blog')}>AI Engineering Blog</a></li>
            <li><a href="/contact" onClick={handleLinkClick('/contact')}>Contact Mohammed Asif M H</a></li>
            <li><a href="/gallery" onClick={handleLinkClick('/gallery')}>Media & Photos Gallery</a></li>
            <li><a href="/gallery/my-photos" onClick={handleLinkClick('/gallery/my-photos')}>Personal Photos</a></li>
            <li><a href="/gallery/certificates" onClick={handleLinkClick('/gallery/certificates')}>Certificates Gallery</a></li>
            <li><a href="/gallery/videos" onClick={handleLinkClick('/gallery/videos')}>Video Demos</a></li>
            <li><a href="/apps/finder" onClick={handleLinkClick('/apps/finder')}>macOS Finder App</a></li>
            <li><a href="/apps/photos" onClick={handleLinkClick('/apps/photos')}>macOS Photos App</a></li>
            <li><a href="/apps/terminal" onClick={handleLinkClick('/apps/terminal')}>macOS Terminal App</a></li>
            <li><a href="/apps/safari" onClick={handleLinkClick('/apps/safari')}>macOS Safari App</a></li>
            <li><a href="/apps/mail" onClick={handleLinkClick('/apps/mail')}>macOS Mail App</a></li>
            <li><a href="/apps/music" onClick={handleLinkClick('/apps/music')}>macOS Music App</a></li>
            <li><a href="/apps/activitymonitor" onClick={handleLinkClick('/apps/activitymonitor')}>macOS Activity Monitor App</a></li>
            <li><a href="/apps/calendar" onClick={handleLinkClick('/apps/calendar')}>macOS Calendar App</a></li>
            <li><a href="/apps/settings" onClick={handleLinkClick('/apps/settings')}>macOS Settings App</a></li>
          </ul>
        </nav>
      </header>

      <main>
        {/* About Section */}
        <section id="about">
          <h2>About Mohammed Asif M H — AI/ML Engineer &amp; GenAI Specialist</h2>
          <p>Mohammed Asif, or Mohammed Asif M H, is an AI/ML Engineer and Generative AI Developer based in Bengaluru, India.</p>
          <p>Engineering high-order cognitive architectures and autonomous intelligence systems designed to solve foundational complexity at mission-critical scale</p>
          <p>{person.bio}</p>
          
          <h3>Alternate Professional Names & Identity</h3>
          <p>
            This website (mdasif.tech) is the official personal portfolio of Mohammed Asif M H.
            He is indexed and known professionally under the following name variations:
          </p>
          <ul>
            <li>Mohammed Asif M H</li>
            <li>Mohammed Asif</li>
            <li>Md Asif</li>
          </ul>

          <h3>Education & Specialization</h3>
          <p>BTech Student in Artificial Intelligence & Machine Learning (AI & ML).</p>

          <h3>Public Profiles & Professional Links</h3>
          <ul>
            <li><a href={person.github} target="_blank" rel="noopener noreferrer">GitHub: {person.github}</a></li>
            <li><a href={person.huggingface} target="_blank" rel="noopener noreferrer">Hugging Face: {person.huggingface}</a></li>
            <li><a href={person.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn: {person.linkedin}</a></li>
            <li><a href={person.leetcode} target="_blank" rel="noopener noreferrer">LeetCode: {person.leetcode}</a></li>
            <li><a href="https://x.com/__md__asif__" target="_blank" rel="noopener noreferrer">X (Twitter): https://x.com/__md__asif__</a></li>
            <li><a href={`mailto:${person.email}`}>Email: {person.email}</a></li>
          </ul>
        </section>

        {/* Skills Section */}
        <section id="skills">
          <h2>Technical Skills & Tech Stack — Mohammed Asif M H</h2>
          <ul>
            {skills.map(skill => (
              <li key={skill.name}>{skill.name} ({skill.category}) — {skill.level}% proficiency</li>
            ))}
          </ul>
        </section>

        {/* Experience Section */}
        <section id="experience">
          <h2>Experience & Background — Mohammed Asif M H</h2>
          <ul>
            {experience.map(exp => (
              <li key={exp.id}>
                <strong>{exp.role}</strong> at {exp.company} ({exp.period}) — {exp.description}
              </li>
            ))}
          </ul>
        </section>

        {/* Certificates Section */}
        <section id="certificates">
          <h2>Certifications & Awards — Mohammed Asif M H</h2>
          <ul>
            {certificates.map(cert => (
              <li key={cert.id}>{cert.title} — Issued by {cert.issuer} ({cert.date})</li>
            ))}
          </ul>
        </section>

        {/* Projects Section */}
        <section id="projects">
          <h2>AI & Engineering Projects by Mohammed Asif M H</h2>
          {projects.map(proj => (
            <article key={proj.id} id={`project-${proj.id}`}>
              <h3>
                <a href={`/projects/${proj.id}`} onClick={handleLinkClick(`/projects/${proj.id}`)}>
                  {proj.title}
                </a>
              </h3>
              <p>{proj.description}</p>
              <p>{proj.longDescription}</p>
              <p>Technologies used by Mohammed Asif M H: {proj.tech.join(', ')}</p>
              {proj.github && <p><a href={proj.github} target="_blank" rel="noopener noreferrer">GitHub Repository: {proj.github}</a></p>}
              {proj.live && <p><a href={proj.live} target="_blank" rel="noopener noreferrer">Live Demo: {proj.live}</a></p>}
            </article>
          ))}
        </section>

        {/* Media & Photos Gallery Section */}
        <section id="gallery">
          <h2>Photos & Media Gallery — Mohammed Asif M H</h2>
          <p>Explore official personal photos, verified certificates, and project video demonstrations in the interactive Photos Gallery app.</p>

          <section id="official-photos">
            <h3>Official Photographs of Mohammed Asif M H</h3>
            <figure>
              <img 
                src="https://mdasif.tech/mohammed-asif-m-h.jpg" 
                alt="Mohammed Asif M H — AI/ML Engineer Official Headshot Photo" 
                title="Mohammed Asif M H — Headshot"
                width="896"
                height="1600"
                loading="eager"
              />
              <figcaption>Official headshot photo of Mohammed Asif M H, AI/ML Engineer and GenAI Specialist based in Bengaluru, India.</figcaption>
            </figure>

            <figure>
              <img 
                src="https://mdasif.tech/mohammed-asif-m-h-formal-suit-portrait-1.jpg" 
                alt="Mohammed Asif M H — Professional Formal Suit Blazer Portrait Photo" 
                title="Mohammed Asif M H — Formal Suit Portrait"
                width="576"
                height="1024"
                loading="eager"
              />
              <figcaption>Official formal suit blazer portrait photograph of Mohammed Asif M H, AI Systems Engineer.</figcaption>
            </figure>

            <figure>
              <img 
                src="https://mdasif.tech/mohammed-asif-m-h-formal-suit-portrait-2.jpg" 
                alt="Mohammed Asif M H — Formal Suit Headshot Photo" 
                title="Mohammed Asif M H — Suit Headshot"
                width="576"
                height="1024"
                loading="eager"
              />
              <figcaption>Professional formal suit portrait of Mohammed Asif M H.</figcaption>
            </figure>

            <figure>
              <img 
                src="https://mdasif.tech/mohammed-asif-m-h-formal-suit-phone-outdoor.jpg" 
                alt="Mohammed Asif M H — Outdoor Formal Suit Photo with Smartphone" 
                title="Mohammed Asif M H — Outdoor Suit Photo"
                width="576"
                height="1024"
                loading="eager"
              />
              <figcaption>Mohammed Asif M H standing outdoors in formal suit blazer holding smartphone.</figcaption>
            </figure>

            <figure>
              <img 
                src="https://mdasif.tech/mohammed-asif-m-h-formal-suit-side-profile-1.jpg" 
                alt="Mohammed Asif M H — Standing Outdoor Formal Suit Photo" 
                title="Mohammed Asif M H — Outdoor Formal Suit"
                width="768"
                height="1024"
                loading="eager"
              />
              <figcaption>Mohammed Asif M H in dark blazer suit standing outdoors.</figcaption>
            </figure>

            <figure>
              <img 
                src="https://mdasif.tech/mohammed-asif-m-h-formal-suit-side-profile-2.jpg" 
                alt="Mohammed Asif M H — Professional Formal Suit Profile Photo" 
                title="Mohammed Asif M H — Suit Side Profile"
                width="768"
                height="1024"
                loading="eager"
              />
              <figcaption>Professional formal suit side profile photograph of Mohammed Asif M H.</figcaption>
            </figure>

            <figure>
              <img 
                src="https://mdasif.tech/mohammed-asif-m-h-portrait-ai-engineer.jpg" 
                alt="Mohammed Asif M H — AI/ML Engineer Portrait Photo in Black Hoodie" 
                title="Mohammed Asif M H — Portrait"
                width="743"
                height="1024"
                loading="eager"
              />
              <figcaption>Portrait photograph of Mohammed Asif M H in black hoodie.</figcaption>
            </figure>

            <figure>
              <img 
                src="https://mdasif.tech/mohammed-asif-m-h-formal-suit-engineering-team.jpg" 
                alt="Mohammed Asif M H with AI Engineering Colleagues in Formal Suits" 
                title="Mohammed Asif M H — Formal Suit Engineering Team"
                width="1024"
                height="768"
                loading="eager"
              />
              <figcaption>Mohammed Asif M H in formal blazer suit with fellow AI engineering student colleagues.</figcaption>
            </figure>

            <figure>
              <img 
                src="https://mdasif.tech/mohammed-asif-m-h-ai-research-mentorship.jpg" 
                alt="Mohammed Asif M H in AI Research & Development Mentorship Meeting with Professor" 
                title="Mohammed Asif M H — AI Research & Development Mentorship"
                width="1024"
                height="459"
                loading="eager"
              />
              <figcaption>Mohammed Asif M H during an AI research and development mentorship session with professor and laptops.</figcaption>
            </figure>

            <figure>
              <img 
                src="https://mdasif.tech/mohammed-asif-m-h-school-green-initiative.jpg" 
                alt="Mohammed Asif M H at School Green Initiative Ceremony presenting Rose Plants with Principal" 
                title="Mohammed Asif M H — Green Initiative Ceremony"
                width="1024"
                height="768"
                loading="eager"
              />
              <figcaption>Mohammed Asif M H participating in school green initiative rose plant presentation event with principal and teacher.</figcaption>
            </figure>

            <figure>
              <img 
                src="https://mdasif.tech/mohammed-asif-m-h-traditional-college-cultural-event.jpg" 
                alt="Mohammed Asif M H in Traditional Veshti Dhoti Outfit at College Festival" 
                title="Mohammed Asif M H — Traditional College Cultural Festival"
                width="1024"
                height="768"
                loading="eager"
              />
              <figcaption>Mohammed Asif M H celebrating college traditional day festival with classmates in traditional dhoti/veshti.</figcaption>
            </figure>
          </section>

          <ul>
            <li><a href="/gallery/my-photos" onClick={handleLinkClick('/gallery/my-photos')}>Personal Photos Collection (53 photos)</a></li>
            <li><a href="/gallery/certificates" onClick={handleLinkClick('/gallery/certificates')}>Certificates Collection (7 certificates)</a></li>
            <li><a href="/gallery/videos" onClick={handleLinkClick('/gallery/videos')}>Video Demonstrations (1 video)</a></li>
          </ul>
        </section>

        {/* Terminal Section */}
        <section id="terminal-app">
          <h2>macOS Terminal CLI App — Mohammed Asif M H</h2>
          <p>Interactive command-line interface simulating zsh terminal with commands: help, clear, about, skills, projects, experience, contact, sudo, cat cv.</p>
          <a href="/apps/terminal" onClick={handleLinkClick('/apps/terminal')}>Open macOS Terminal App</a>
        </section>

        {/* Safari Section */}
        <section id="safari-app">
          <h2>macOS Safari Browser App — Mohammed Asif M H</h2>
          <p>Simulated web browser rendering portfolio tabs, GitHub pinned repositories, and AI engineering blog posts.</p>
          <a href="/apps/safari" onClick={handleLinkClick('/apps/safari')}>Open macOS Safari App</a>
        </section>

        {/* Mail Section */}
        <section id="mail-app">
          <h2>macOS Mail & Contact App — Mohammed Asif M H</h2>
          <p>Direct contact and email interface for reaching Mohammed Asif M H.</p>
          <a href="/apps/mail" onClick={handleLinkClick('/apps/mail')}>Open macOS Mail App</a>
        </section>

        {/* Music Section */}
        <section id="music-app">
          <h2>macOS Music Player App — Mohammed Asif M H</h2>
          <p>Interactive audio player with curated soundscapes, Siri clips, and music audio files.</p>
          <a href="/apps/music" onClick={handleLinkClick('/apps/music')}>Open macOS Music App</a>
        </section>

        {/* Activity Monitor Section */}
        <section id="activitymonitor-app">
          <h2>macOS Activity Monitor App — Mohammed Asif M H</h2>
          <p>System process monitor visualizing live CPU and memory utilization across Python, PyTorch, LangChain, RAG, and FastAPI processes.</p>
          <a href="/apps/activitymonitor" onClick={handleLinkClick('/apps/activitymonitor')}>Open macOS Activity Monitor App</a>
        </section>

        {/* Calendar Section */}
        <section id="calendar-app">
          <h2>macOS Calendar App — Mohammed Asif M H</h2>
          <p>Schedule and milestone calendar visualizing education, project releases, and engineering achievements.</p>
          <a href="/apps/calendar" onClick={handleLinkClick('/apps/calendar')}>Open macOS Calendar App</a>
        </section>

        {/* Settings Section */}
        <section id="settings-app">
          <h2>macOS System Settings App — Mohammed Asif M H</h2>
          <p>Customization panel for dynamic wallpaper selection (Tahoe Day/Night, Ventura) and UI theme controls.</p>
          <a href="/apps/settings" onClick={handleLinkClick('/apps/settings')}>Open macOS System Settings App</a>
        </section>

        {/* Technical Blog / Articles Section */}
        <section id="blog">
          <h2>Technical Articles & AI Engineering Notes by Mohammed Asif M H</h2>
          {blogPosts.map(post => (
            <article key={post.id} id={`blog-${post.id}`}>
              <h3>
                <a href={`/blog/${post.slug}`} onClick={handleLinkClick(`/blog/${post.slug}`)}>
                  {post.title}
                </a>
              </h3>
              <p>Published on {post.publishDate} by {post.author}</p>
              <p>{post.description}</p>
              <div>{post.content}</div>
            </article>
          ))}
        </section>

        {/* Contact Section */}
        <section id="contact">
          <h2>Contact Mohammed Asif M H</h2>
          <p>Email: <a href={`mailto:${person.email}`}>{person.email}</a></p>
          <p>Location: {person.location}</p>
          <p>Website: <a href={person.siteUrl}>{person.siteUrl}</a></p>
        </section>
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} Mohammed Asif M H. All rights reserved. Official Website: https://mdasif.tech</p>
      </footer>
    </div>
  );
}
