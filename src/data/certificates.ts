// ─── Certificates Data ───────────────────────────────────────────────────────

/// <reference types="vite/client" />

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  url?: string;
  color: string;
  file?: string;
}

// Dynamically import all certificates from the public folder
const certFiles = import.meta.glob('/public/certificates/*.{png,jpg,jpeg,pdf,webp}', { eager: true });

export const certificates: Certificate[] = Object.keys(certFiles).map((filePath, index) => {
  const fileName = filePath.split('/').pop() || '';
  // Extract title by removing the extension
  let title = fileName.replace(/\.[^/.]+$/, "");
  
  // Optional: Clean up title if it contains dashes or underscores
  title = title.replace(/[-_]/g, " ");

  // We can assign random or cycled colors, or a default iOS blue
  const colors = ["#007AFF", "#34C759", "#FF9500", "#5856D6", "#FF2D55", "#AF52DE"];
  const color = colors[index % colors.length];

  return {
    id: `dynamic-cert-${index}`,
    title: title,
    issuer: "Verified Credential", 
    date: new Date().getFullYear().toString(),
    color: color,
    file: `/certificates/${fileName}`
  };
});
