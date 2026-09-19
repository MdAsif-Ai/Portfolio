import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useBootStore } from '../../../store/bootStore';
import './BootScreen.css';

export function BootScreen() {
  const setPhase = useBootStore(s => s.setPhase);
  const progressRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // 1. Fade in Apple logo with a subtle scale
    tl.fromTo(logoRef.current,
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
    );

    // 2. Animate progress bar
    const progressObj = { val: 0 };
    tl.to(progressObj, {
      val: 30,
      duration: 0.2,
      ease: 'power1.out',
      onUpdate: () => {
        if (progressRef.current)
          progressRef.current.style.width = `${progressObj.val}%`;
      },
    }, '+=0.1');
    tl.to(progressObj, {
      val: 75,
      duration: 0.4,
      ease: 'power1.inOut',
      onUpdate: () => {
        if (progressRef.current)
          progressRef.current.style.width = `${progressObj.val}%`;
      },
    });
    tl.to(progressObj, {
      val: 95,
      duration: 0.3,
      ease: 'power1.in',
      onUpdate: () => {
        if (progressRef.current)
          progressRef.current.style.width = `${progressObj.val}%`;
      },
    });
    tl.to(progressObj, {
      val: 100,
      duration: 0.1,
      ease: 'power2.in',
      onUpdate: () => {
        if (progressRef.current)
          progressRef.current.style.width = `${progressObj.val}%`;
      },
    });

    // 3. Fade out entire boot screen, then switch to 'hello'
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.inOut',
      onComplete: () => setPhase('hello'),
    }, '+=0.2');

    return () => { tl.kill(); };
  }, [setPhase]);

  return (
    <div className="boot-screen" ref={containerRef}>
      {/* Classic black macOS boot */}
      <div className="boot-center">
        {/* Real Apple logo from public assets */}
        <img
          ref={logoRef as any}
          src="/img/icons/apple-logo.svg"
          alt="Apple Logo"
          className="boot-apple-logo"
          style={{ width: '120px', height: '120px', objectFit: 'contain' }}
        />

        {/* Progress bar track */}
        <div className="boot-progress-track">
          <div className="boot-progress-fill" ref={progressRef} />
        </div>
      </div>
    </div>
  );
}
