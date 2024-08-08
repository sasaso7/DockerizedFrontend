import { useState, useRef, useEffect } from 'react';
import styles from './NavigationDiv.module.less';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface NavigationDivProps {
    onClick: () => void;
    image: string | LucideIcon;
    hoverText: string;
    width: string;
}

const NavigationDiv = (props: NavigationDivProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateHeight = () => {
            if (divRef.current) {
                const width = divRef.current.offsetWidth;
                divRef.current.style.height = `${width}px`;
            }
        };
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    return (
        <div
            ref={divRef}
            style={{ width: props.width }}
            className={styles.navigationDiv}
            onClick={props.onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {typeof props.image === 'string' ? (
                <img src={props.image} alt="Image" />
            ) : (
                <props.image />
            )}
            <div className={`${styles.hoverText} ${isHovered ? styles.show : ''}`}>
                <div className={styles.arrow}><ArrowRight /></div>
                <div className={styles.text}>{props.hoverText}</div>
            </div>
        </div>
    );
};

export default NavigationDiv;