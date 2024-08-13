import React, { useState, useRef, useEffect } from 'react';
import styles from './NavigationDiv.module.less';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface NavigationDivProps {
    onClick: () => void;
    image: string | LucideIcon;
    hoverText: string;
}

const NavigationDiv = (props: NavigationDivProps) => {
    const [isActive, setIsActive] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateSizeAndOrientation = () => {
            if (divRef.current) {
                const width = divRef.current.offsetWidth;
                divRef.current.style.height = `${width}px`;
            }
            setIsDesktop(window.innerWidth > 768); // Adjust this breakpoint as needed
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (divRef.current && !divRef.current.contains(event.target as Node)) {
                setIsActive(false);
            }
        };

        updateSizeAndOrientation();
        window.addEventListener('resize', updateSizeAndOrientation);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('resize', updateSizeAndOrientation);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isDesktop) {
            setIsActive(!isActive);
        } else {
            props.onClick();
        }
    };

    const handleHoverElementClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        props.onClick();
        if (!isDesktop) {
            setIsActive(false);
        }
    };

    return (
        <div
            ref={divRef}
            className={styles.navigationDiv}
            onClick={handleClick}
            onMouseEnter={() => isDesktop && setIsActive(true)}
            onMouseLeave={() => isDesktop && setIsActive(false)}
        >
            {typeof props.image === 'string' ? (
                <img src={props.image} alt="Navigation" />
            ) : (
                <props.image />
            )}
            <div
                className={`${styles.hoverText} ${isActive ? styles.show : ''}`}
                onClick={handleHoverElementClick}
            >
                <div className={styles.arrow}><ArrowRight /></div>
                <div className={styles.text}>{props.hoverText}</div>
            </div>
        </div>
    );
};

export default NavigationDiv;