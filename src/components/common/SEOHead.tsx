// ─── Dynamic SEO & JSON-LD Head Manager ──────────────────────────────────────

import { useEffect } from 'react';
import { RouteState } from '../../utils/router';
import { person } from '../../data/person';
import { projects } from '../../data/projects';
import { blogPosts } from '../../data/blog';

interface SEOHeadProps {
  route: RouteState;
}

export function SEOHead({ route }: SEOHeadProps) {
  useEffect(() => {
    let title = "Mohammed Asif M H | AI/ML Engineer | GenAI & LLM Specialist";
    let description = "Engineering high-order cognitive architectures and autonomous intelligence systems designed to solve foundational complexity at mission-critical scale";
    let canonicalUrl = `${person.siteUrl}${route.path === '/' ? '' : route.path}`;
    let ogType = "website";
    let jsonLd: object[] = [];

    // Base Person Schema
    const personSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${person.siteUrl}/#person`,
      "name": person.canonicalName,
      "alternateName": person.alternateNames,
      "url": `${person.siteUrl}/about`,
      "image": `${person.siteUrl}${person.avatar}`,
      "jobTitle": person.title,
      "description": person.bio,
      "sameAs": [
        person.github,
        person.huggingface,
        person.linkedin,
        person.leetcode,
      ]
    };

    // Route-specific metadata & structured data
    if (route.type === 'about') {
      title = "About Mohammed Asif M H | AI/ML Engineer Profile";
      description = "Learn about Mohammed Asif M H — AI/ML Engineer specializing in Generative AI, multi-agent frameworks, production RAG pipelines, and high-performance machine learning.";
      jsonLd.push({
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "mainEntity": personSchema
      });
    } else if (route.type === 'skills') {
      title = "Technical Skills & Tech Stack | Mohammed Asif M H";
      description = "Complete technical skills, frameworks, languages, and tools mastered by Mohammed Asif M H in AI/ML, Python, PyTorch, RAG, FastAPI, and Cloud.";
    } else if (route.type === 'experience') {
      title = "Work Experience & Background | Mohammed Asif M H";
      description = "Professional background, AI/ML engineering experience, and technical leadership of Mohammed Asif M H.";
    } else if (route.type === 'certificates') {
      title = "Certificates & Achievements | Mohammed Asif M H";
      description = "Verified certifications in AI, Machine Learning, Deep Learning, Digital Marketing, and Cloud Engineering earned by Mohammed Asif M H.";
    } else if (route.type === 'projects') {
      title = "AI/ML & LLM Projects | Mohammed Asif M H";
      description = "Explore AI/ML engineering projects built by Mohammed Asif M H including RAG pipelines, autonomous LLM agents, vision classifiers, and sentiment microservices.";
    } else if (route.type === 'project-detail') {
      const proj = projects.find(p => p.id === route.params.id);
      if (proj) {
        title = `${proj.title} | Project by Mohammed Asif M H`;
        description = `${proj.title}: ${proj.description} Built by Mohammed Asif M H using ${proj.tech.slice(0, 4).join(', ')}.`;
        jsonLd.push({
          "@context": "https://schema.org",
          "@type": "SoftwareSourceCode",
          "name": proj.title,
          "description": proj.longDescription,
          "programmingLanguage": proj.tech,
          "codeRepository": proj.github || person.github,
          "author": personSchema
        });
      }
    } else if (route.type === 'blog') {
      title = "AI Engineering Articles & Insights | Mohammed Asif M H";
      description = "Technical articles on RAG architectures, LLM serving with vLLM, AWS AI infrastructure, and multi-agent workflows written by Mohammed Asif M H.";
    } else if (route.type === 'blog-detail') {
      const post = blogPosts.find(b => b.slug === route.params.id);
      if (post) {
        title = `${post.title} | Mohammed Asif M H`;
        description = post.description;
        ogType = "article";
        jsonLd.push({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.description,
          "datePublished": post.publishDate,
          "dateModified": post.modifiedDate,
          "author": personSchema,
          "publisher": personSchema,
          "mainEntityOfPage": canonicalUrl
        });
      }
    } else if (route.type === 'contact') {
      title = "Contact Mohammed Asif M H | Mail & Inquiries";
      description = "Get in touch with Mohammed Asif M H for AI/ML engineering, LLM application architecture, and consulting inquiries.";
      jsonLd.push({
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact Mohammed Asif M H",
        "description": "Contact channels and email for AI/ML Engineer Mohammed Asif M H",
        "mainEntity": personSchema
      });
    } else if (route.type === 'gallery' || route.params.appId === 'photos') {
      const sectionName = route.params.section ? ` — ${route.params.section.replace('-', ' ')}` : '';
      title = `Photos & Media Gallery${sectionName} | Mohammed Asif M H`;
      description = "Browse personal photos, verified certificates, and project video demos in the interactive Photos Gallery app by Mohammed Asif M H.";
      jsonLd.push({
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        "name": "Mohammed Asif M H Media Gallery",
        "description": "Collection of personal photos, certificates, and video demonstrations.",
        "author": personSchema
      });
    } else if (route.type === 'app') {
      const appId = route.params.appId;
      const appNames: Record<string, string> = {
        finder: "Finder (Files & About)",
        terminal: "Terminal (Interactive CLI)",
        safari: "Safari (Web Browser & Portfolio)",
        mail: "Mail (Contact & Messages)",
        music: "Music (Audio Experience)",
        photos: "Photos (Gallery)",
        activitymonitor: "Activity Monitor (AI Systems & Skills)",
        calendar: "Calendar (Timeline & Schedule)",
        settings: "System Settings (Wallpapers & Customize)",
      };
      const appName = appNames[appId] || appId;
      title = `${appName} | Mohammed Asif M H`;
      description = `Experience the macOS ${appName} simulation in the interactive portfolio of Mohammed Asif M H, AI/ML Engineer & GenAI Developer.`;
      jsonLd.push({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": `macOS ${appName} App`,
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web",
        "author": personSchema
      });
    } else {
      // Default Home
      jsonLd.push({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Mohammed Asif M H Portfolio",
        "url": person.siteUrl,
        "author": personSchema
      });
      jsonLd.push(personSchema);
    }

    // Update document title
    document.title = title;

    // Helper functions
    const setMetaTag = (nameAttr: string, keyName: string, value: string) => {
      let el = document.querySelector(`meta[${nameAttr}="${keyName}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(nameAttr, keyName);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    const setLinkTag = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // Standard Meta
    setMetaTag('name', 'description', description);
    setLinkTag('canonical', canonicalUrl);

    // Open Graph
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', `${person.siteUrl}/mohammed-asif-m-h-formal-suit-portrait-1.jpg`);
    setMetaTag('property', 'og:image:width', '576');
    setMetaTag('property', 'og:image:height', '1024');
    setMetaTag('property', 'og:image:alt', 'Mohammed Asif M H — AI/ML Engineer & GenAI Specialist');
    setMetaTag('property', 'og:site_name', 'Mohammed Asif M H | Portfolio');

    // Twitter
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', `${person.siteUrl}/mohammed-asif-m-h-formal-suit-portrait-1.jpg`);
    setMetaTag('name', 'twitter:image:alt', 'Mohammed Asif M H — AI/ML Engineer & GenAI Specialist');
    setMetaTag('name', 'twitter:site', '@__md__asif__');
    setMetaTag('name', 'twitter:creator', '@__md__asif__');

    // Inject JSON-LD
    let scriptEl = document.getElementById('json-ld-seo-schema') as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'json-ld-seo-schema';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(jsonLd, null, 2);

  }, [route]);

  return null;
}
