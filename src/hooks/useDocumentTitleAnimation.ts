import { useEffect } from 'react';

export function useDocumentTitleAnimation(titles: string[], typeSpeed = 80, deleteSpeed = 50, delayBeforeDelete = 2000, delayBeforeType = 500) {
  useEffect(() => {
    let currentTitleIndex = 0;
    let currentText = '';
    let isDeleting = false;
    let timeoutId: number;

    const tick = () => {
      const fullTitle = titles[currentTitleIndex];

      if (isDeleting) {
        currentText = fullTitle.substring(0, currentText.length - 1);
      } else {
        currentText = fullTitle.substring(0, currentText.length + 1);
      }

      document.title = currentText || '\u200B'; // Use zero-width space if empty to keep title bar present

      let nextTickSpeed = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && currentText === fullTitle) {
        // Wait before deleting
        nextTickSpeed = delayBeforeDelete;
        isDeleting = true;
      } else if (isDeleting && currentText === '') {
        isDeleting = false;
        currentTitleIndex = (currentTitleIndex + 1) % titles.length;
        nextTickSpeed = delayBeforeType;
      }

      timeoutId = window.setTimeout(tick, nextTickSpeed);
    };

    tick();

    return () => {
      window.clearTimeout(timeoutId);
      document.title = 'Mohammed Asif M H — AI Engineer Portfolio';
    };
  }, [titles, typeSpeed, deleteSpeed, delayBeforeDelete, delayBeforeType]);
}
