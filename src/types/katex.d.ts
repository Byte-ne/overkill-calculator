declare global {
  interface Window {
    katex?: {
      renderToString: (tex: string, options?: { throwOnError?: boolean; displayMode?: boolean }) => string;
    };
  }
}

export {};
