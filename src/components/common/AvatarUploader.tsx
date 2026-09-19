import React, { useEffect, useState } from 'react';

/**
 * AvatarUploader – a tiny UI that shows the current avatar, allows the user to drop
 * a new picture (via a file selector) and pick an alignment for the image.
 *
 * The uploaded image is stored in `localStorage` under the key
 * `profileAvatarDataUrl` so it survives page reloads without any backend.
 * If no custom image is found we fall back to the `defaultSrc` passed by the
 * caller (which is the static avatar shipped with the repo).
 *
 * This component is deliberately UI‑only – it does **not** write to the source
 * code (`person.ts`). Changing the avatar for the whole project would require a
 * server‑side upload flow which is outside the scope of a static React demo.
 */
interface AvatarUploaderProps {
  /** URL of the default avatar shipped with the repository. */
  defaultSrc: string;
  /** Alt text for the image. */
  alt: string;
  /** Desired size in pixels (width & height). */
  size?: number;
  /** If true, hides the upload and position controls */
  readonly?: boolean;
  /** Class name applied to the inner circle container */
  className?: string;
}

const STORAGE_KEY = 'profileAvatarDataUrl';
const POSITION_KEY = 'profileAvatarPosition';
const SCALE_KEY = 'profileAvatarScale';

const positions = [
  'center top',
  'center center',
  'center bottom',
  'left top',
  'left center',
  'left bottom',
  'right top',
  'right center',
  'right bottom',
];

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({ defaultSrc, alt, size = 100, readonly = false, className }) => {
  const [src, setSrc] = useState<string>(defaultSrc);
  const [position, setPosition] = useState<string>('center center');
  const [scale, setScale] = useState<number>(1); // Default scale 1 for natural fit

  // Load persisted values on mount and listen to storage events
  useEffect(() => {
    const updateFromStorage = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      const storedPos = localStorage.getItem(POSITION_KEY);
      const storedScale = localStorage.getItem(SCALE_KEY);
      if (stored) setSrc(stored);
      
      if (storedPos) {
        if (storedPos === 'center top' && !storedScale) {
          localStorage.removeItem(POSITION_KEY);
          setPosition('center center');
        } else {
          setPosition(storedPos);
        }
      }
      
      if (storedScale) {
        const scaleVal = parseFloat(storedScale);
        if (scaleVal === 2.2) {
          // Reset if it's the old buggy default
          localStorage.removeItem(SCALE_KEY);
          setScale(1);
        } else {
          setScale(scaleVal);
        }
      }
    };
    updateFromStorage();
    window.addEventListener('storage', updateFromStorage);
    return () => window.removeEventListener('storage', updateFromStorage);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setSrc(dataUrl);
      localStorage.setItem(STORAGE_KEY, dataUrl);
      window.dispatchEvent(new Event('storage'));
    };
    reader.readAsDataURL(file);
  };

  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pos = e.target.value;
    setPosition(pos);
    localStorage.setItem(POSITION_KEY, pos);
    window.dispatchEvent(new Event('storage'));
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScale = parseFloat(e.target.value);
    setScale(newScale);
    localStorage.setItem(SCALE_KEY, newScale.toString());
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        className={className}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          overflow: 'hidden',
          background: 'var(--card-bg, rgba(255,255,255,0.2))',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
        }}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: position,
            transform: `scale(${scale})`,
          }}
        />
      </div>
      {!readonly && (
        <div onClick={(e) => e.stopPropagation()}>
          <div style={{ marginTop: 8, fontSize: 12, color: '#fff' }}>Change avatar (e.g. MdAsif.jpg)</div>
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginBottom: 4 }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <div>
              <label htmlFor="avatar-pos-select" style={{ color: '#fff', marginRight: 4, fontSize: 12 }}>
                Align:
              </label>
              <select id="avatar-pos-select" value={position} onChange={handlePositionChange} style={{ fontSize: 12 }}>
                {positions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <label htmlFor="avatar-scale-range" style={{ color: '#fff', fontSize: 12 }}>Zoom:</label>
              <input
                id="avatar-scale-range"
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={scale}
                onChange={handleScaleChange}
                style={{ width: 100 }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
