import React from 'react';
import styles from './Loading.module.less';

const Loading = () => {
    return (
        <div className={styles.loadingWrapper}>
            <div className={styles.circle}></div>
        </div>
    );
};

export default Loading;