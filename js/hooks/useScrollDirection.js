/**
 * GF — useScrollDirection Hook
 * Detects scroll direction for hiding/showing mobile filter bars
 */
const useScrollDirection = (scrollRef) => {
    const [scrollDirection, setScrollDirection] = React.useState("up");
    const prevOffsetRef = React.useRef(0);
    const rafRef = React.useRef(null);
    const lockRef = React.useRef(false);

    React.useEffect(() => {
        const handleScroll = () => {
            if (window.innerWidth >= 768) return;
            if (lockRef.current) return;
            if (rafRef.current) return;

            rafRef.current = requestAnimationFrame(() => {
                rafRef.current = null;
                if (!scrollRef.current) return;
                const currentOffset = scrollRef.current.scrollTop;
                const diff = currentOffset - prevOffsetRef.current;
                if (Math.abs(diff) > 30) {
                    const newDir = (diff > 0 && currentOffset > 80) ? "down" : (diff < 0 ? "up" : null);
                    if (newDir) {
                        setScrollDirection(prev => {
                            if (prev !== newDir) {
                                lockRef.current = true;
                                setTimeout(() => { lockRef.current = false; }, 400);
                                return newDir;
                            }
                            return prev;
                        });
                    }
                    prevOffsetRef.current = currentOffset;
                }
            });
        };

        const el = scrollRef.current;
        if (el) el.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            if (el) el.removeEventListener("scroll", handleScroll);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [scrollRef]);

    return scrollDirection;
};

window.GF.useScrollDirection = useScrollDirection;
