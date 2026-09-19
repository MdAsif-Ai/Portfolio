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
        <h1>Md Asif Mohammed Asif M H</h1>
        <p>Md Asif Mohammed Asif M H — AI/ML Engineer & GenAI Developer</p>
        <p>{person.subtitle}</p>
        <nav aria-label="Main Navigation">
          <ul>
            <li><a href="/" onClick={handleLinkClick('/')}>Home</a></li>
            <li><a href="/about" onClick={handleLinkClick('/about')}>About Md Asif Mohammed Asif M H</a></li>
            <li><a href="/projects" onClick={handleLinkClick('/projects')}>AI Projects by Md Asif</a></li>
            <li><a href="/blog" onClick={handleLinkClick('/blog')}>AI Engineering Blog</a></li>
            <li><a href="/contact" onClick={handleLinkClick('/contact')}>Contact Md Asif</a></li>
          </ul>
        </nav>
      </header>

      <main>
        {/* About Section */}
        <section id="about">
          <h2>About Md Asif Mohammed Asif M H</h2>
          <p>
            Md Asif Mohammed Asif M H, also known professionally as Md Asif, Mohammed Asif, or Mohammed Asif M H,
            is an AI/ML Engineer and Generative AI Developer based in Bengaluru, India.
          </p>
          <p>{person.bio}</p>
          
          <h3>Alternate Professional Names & Identity</h3>
          <p>
            This website (mdasif.tech) is the official personal portfolio of Md Asif Mohammed Asif M H.
            He is indexed and known professionally under the following name variations:
          </p>
          <ul>
            <li>Md Asif Mohammed Asif M H</li>
            <li>Md Asif</li>
            <li>Mohammed Asif</li>
            <li>Mohammed Asif M H</li>
          </ul>

          <h3>Education & Specialization</h3>
          <p>BTech Student in Artificial Intelligence & Machine Learning (AI & ML).</p>

          <h3>Public Profiles & Professional Links</h3>
          <ul>
            <li><a href={person.github} target="_blank" rel="noopener noreferrer">GitHub: {person.github}</a></li>
            <li><a href={person.huggingface} target="_blank" rel="noopener noreferrer">Hugging Face: {person.huggingface}</a></li>
            <li><a href={person.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn: {person.linkedin}</a></li>
            <li><a href={person.leetcode} target="_blank" rel="noopener noreferrer">LeetCode: {person.leetcode}</a></li>
            <li><a href={`mailto:${person.email}`}>Email: {person.email}</a></li>
          </ul>

          <h3>Technical Skills</h3>
          <ul>
            {skills.map(skill => (
              <li key={skill.name}>{skill.name} ({skill.category}) — {skill.level}% proficiency</li>
            ))}
          </ul>

          <h3>Experience & Background</h3>
          <ul>
            {experience.map(exp => (
              <li key={exp.id}>
                <strong>{exp.role}</strong> at {exp.company} ({exp.period}) — {exp.description}
              </li>
            ))}
          </ul>

          <h3>Certifications</h3>
          <ul>
            {certificates.map(cert => (
              <li key={cert.id}>{cert.title} — Issued by {cert.issuer} ({cert.date})</li>
            ))}
          </ul>
        </section>

        {/* Projects Section */}
        <section id="projects">
          <h2>AI & Engineering Projects by Md Asif Mohammed Asif M H</h2>
          {projects.map(proj => (
            <article key={proj.id} id={`project-${proj.id}`}>
              <h3>
                <a href={`/projects/${proj.id}`} onClick={handleLinkClick(`/projects/${proj.id}`)}>
                  {proj.title}
                </a>
              </h3>
              <p>{proj.description}</p>
              <p>{proj.longDescription}</p>
              <p>Technologies used by Md Asif: {proj.tech.join(', ')}</p>
              {proj.github && <p><a href={proj.github} target="_blank" rel="noopener noreferrer">GitHub Repository: {proj.github}</a></p>}
              {proj.live && <p><a href={proj.live} target="_blank" rel="noopener noreferrer">Live Demo: {proj.live}</a></p>}
            </article>
          ))}
        </section>

        {/* Technical Blog / Articles Section */}
        <section id="blog">
          <h2>Technical Articles & AI Engineering Notes by Md Asif Mohammed Asif M H</h2>
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
          <h2>Contact Md Asif Mohammed Asif M H</h2>
          <p>Email: <a href={`mailto:${person.email}`}>{person.email}</a></p>
          <p>Location: {person.location}</p>
          <p>Website: <a href={person.siteUrl}>{person.siteUrl}</a></p>
        </section>
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} Md Asif Mohammed Asif M H. All rights reserved. Official Website: https://mdasif.tech</p>
      </footer>
    </div>
  );
}
