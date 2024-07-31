import React, { useState, useEffect } from 'react';
import Loading from './Loading';
import styles from "./PollinationImageGen.module.less"

interface PollinationImageGenrProps {
    quote: string;
}

const PollinationImageGen: React.FC<PollinationImageGenrProps> = ({ quote }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        const generateImage = async () => {
            setIsLoading(true);
            setProgress(0);
            setError(null);
            setImageUrl(null);

            try {
                // Simulating image details
                const width = 500;
                const height = 500;
                const seed = 42;

                // Constructing the image URL (replace with your actual API endpoint)
                const apiUrl = `https://pollinations.ai/p/${encodeURIComponent(quote)}&width=${width}&height=${height}&seed=${seed}`;

                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error('Failed to generate image');
                }

                const reader = response.body?.getReader();
                const contentLength = +(response.headers.get('Content-Length') ?? '0');
                let receivedLength = 0;
                const chunks: Uint8Array[] = [];

                while (true) {
                    const { done, value } = await reader!.read();

                    if (done) {
                        break;
                    }

                    chunks.push(value);
                    receivedLength += value.length;
                    setProgress(Math.round((receivedLength / contentLength) * 100));
                }

                const blob = new Blob(chunks);
                const generatedImageUrl = URL.createObjectURL(blob);

                setImageUrl(generatedImageUrl);
                setIsLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
                setIsLoading(false);
            }
        };

        if (quote) {
            generateImage();
        }
    }, [quote]);

    return (
        <div className={styles.flexContainer}>
            {isLoading && (
                <div>
                    <p>Generating image...</p>
                    <Loading />
                </div>
            )}
            {error && <p>Error: {error}</p>}
            {imageUrl && (
                <>
                    <div className={styles.quote}>{quote}</div>
                    <img className={styles.image} src={imageUrl} alt="Generated from quote" style={{ maxWidth: '100%' }} />
                </>
            )}
        </div>
    );
};

export default PollinationImageGen;