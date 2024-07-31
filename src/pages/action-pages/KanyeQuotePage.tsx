import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getKanyeQuoteAndCreateActivity } from '@/services/api/api';
import PollinationImageGen from '@/components/PollinationImageGen';
import styles from "../dashboard/Dashboard.module.less";

const KanyeQuotePage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [quote, setQuote] = useState<string | null>(null);
    const { activeAccount } = useAuth();

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

    return (
        <div className="kanye-quote-page">
            <button className={styles.button} onClick={fetchQuote} disabled={loading}>
                {loading ? 'Loading...' : 'Get New Quote'}
            </button>

            {error && <p className="error">{error}</p>}

            {quote && (
                <div className="quote-container">
                    <PollinationImageGen quote={quote} />
                </div>
            )}
        </div>
    );
};

export default KanyeQuotePage;