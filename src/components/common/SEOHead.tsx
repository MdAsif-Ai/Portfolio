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
    let title = "Md Asif Mohammed Asif M H | AI/ML Engineer & GenAI Developer";
    let description = "Official portfolio of Md Asif Mohammed Asif M H, an AI/ML engineer focused on Generative AI, LLMs, RAG, cloud and production AI systems.";
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

    // Route-specific customization
    if (route.type === 'about') {
      title = "About Md Asif Mohammed Asif M H | AI/ML Engineer Profile";
      description = "Learn about Md Asif Mohammed Asif M H — AI/ML Engineer specializing in Generative AI, multi-agent frameworks, production RAG pipelines, and high-performance machine learning.";
      
      jsonLd.push({
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "mainEntity": personSchema
      });
    } else if (route.type === 'projects') {
      title = "AI/ML & LLM Projects | Md Asif Mohammed Asif M H";
      description = "Explore AI/ML engineering projects built by Md Asif Mohammed Asif M H including RAG pipelines, autonomous LLM agents, vision classifiers, and sentiment microservices.";
    } else if (route.type === 'project-detail') {
      const proj = projects.find(p => p.id === route.params.id);
      if (proj) {
        title = `${proj.title} | Project by Md Asif Mohammed Asif M H`;
        description = `${proj.title}: ${proj.description} Built by Md Asif Mohammed Asif M H using ${proj.tech.slice(0, 4).join(', ')}.`;
        
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
      title = "AI Engineering Articles & Insights | Md Asif Mohammed Asif M H";
      description = "Technical articles on RAG architectures, LLM serving with vLLM, AWS AI infrastructure, and multi-agent workflows written by Md Asif Mohammed Asif M H.";
    } else if (route.type === 'blog-detail') {
      const post = blogPosts.find(b => b.slug === route.params.id);
      if (post) {
        title = `${post.title} | Md Asif Mohammed Asif M H`;
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
      title = "Contact Md Asif Mohammed Asif M H | AI/ML Engineer";
      description = "Get in touch with Md Asif Mohammed Asif M H for AI/ML engineering, LLM application architecture, and consulting inquiries.";
    } else {
      // Default / Home
      jsonLd.push({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Md Asif Mohammed Asif M H Portfolio",
        "url": person.siteUrl,
        "author": personSchema
      });
      jsonLd.push(personSchema);
    }

    // Update document title
    document.title = title;

    // Helper function to set or create meta tags
    const setMetaTag = (nameAttr: string, keyName: string, value: string) => {
      let el = document.querySelector(`meta[${nameAttr}="${keyName}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(nameAttr, keyName);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    // Helper function to set or create link tags
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
    setMetaTag('property', 'og:image', `${person.siteUrl}${person.avatar}`);
    setMetaTag('property', 'og:site_name', 'Md Asif Mohammed Asif M H Portfolio');

    // Twitter
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', `${person.siteUrl}${person.avatar}`);

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
