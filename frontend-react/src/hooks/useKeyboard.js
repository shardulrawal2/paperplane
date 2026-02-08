import { useEffect } from 'react';

export const useKeyboard = (callback) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Cmd+K or Ctrl+K
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                event.preventDefault();
                callback('command-palette');
            }

            // Escape
            if (event.key === 'Escape') {
                callback('escape');
            }

            // Enter (only if not in input/textarea)
            if (event.key === 'Enter' && !['INPUT', 'TEXTAREA'].includes(event.target.tagName)) {
                callback('enter');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [callback]);
};
