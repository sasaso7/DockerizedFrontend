import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getKanyeQuoteAndCreateActivity } from '@/services/api/api';
import PollinationImageGen from '@/components/PollinationImageGen';
import styles from "./ActionPages.module.less";

const KanyeQuotePage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [quote, setQuote] = useState<string | null>(null);
    const { activeAccount } = useAuth();
    const effectRan = useRef(false);


    const fetchQuote = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getKanyeQuoteAndCreateActivity({ accountId: activeAccount!.id });
            setQuote(result);
        } catch (err) {
            setError('Failed to fetch quote and create activity. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (effectRan.current === false) {
            console.log("I RUN");
            fetchQuote();
            effectRan.current = true;
        }
    }, []);

    return (
        <div className="kanye-quote-page">
            <button className={styles.button} onClick={fetchQuote} disabled={loading}>
                {loading ? 'Loading...' : 'Get New Quote'}
            </button>

            {error && <p className="error">{error}</p>}

            {quote && (
                <div className={styles.flexAndCenter}>
                    <div className={styles.quote}>{quote}</div>
                    <PollinationImageGen quote={"Kanye West says: " + quote} />
                </div>
            )}
        </div>
    );
};

export default KanyeQuotePage;