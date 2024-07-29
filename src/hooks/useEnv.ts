// useEnv.js
import { useMemo } from 'react';

export function useEnv() {
  return useMemo(() => ({
    API_LINK: import.meta.env.VITE_API_LINK,
    API_LINK_KANYE: import.meta.env.VITE_API_LINK_KANYE,
    API_LINK_COLORSCHEME: import.meta.env.VITE_API_LINK_COLORSCHEME
  }), []);
}