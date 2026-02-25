/**
 * GF — useBackHandler Hook
 * Handles browser back button for closing modals/panels
 */
const useBackHandler = (isActive, onClose) => {
    React.useEffect(() => {
        if (isActive) {
            window.history.pushState({ modalOpen: true }, '', '#open');
            const handlePopState = () => onClose();
            window.addEventListener('popstate', handlePopState);
            return () => window.removeEventListener('popstate', handlePopState);
        }
    }, [isActive, onClose]);
};

window.GF.useBackHandler = useBackHandler;
