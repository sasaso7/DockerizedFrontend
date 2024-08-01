// src/components/Layout.tsx
import React from 'react';
import Header from './Header';
import styles from './Layout.module.less';
import { AuthProvider } from '@/contexts/AuthContext';
import AnimatedBackground from '@/components/AnimatedBackground';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className={styles.layout}>
            <Header />
            <main className={styles.main}>{children}</main>
            {/* <AnimatedBackground /> */}
        </div>
    );
};

export default Layout;