/**
 * Utility functions to handle hydration mismatches
 */

import { useEffect, useState } from 'react';

/**
 * Hook to prevent hydration mismatches by ensuring component only renders after client-side mount
 */
export function useIsClient(): boolean {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

/**
 * Hook for components that need to wait for client-side rendering
 * Returns true only after the component has mounted on the client
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

/**
 * Component wrapper that prevents hydration mismatches
 * Renders children only after client-side mount
 */
interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const mounted = useMounted();

  if (!mounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Utility to clean up browser extension attributes that cause hydration mismatches
 */
export function cleanupBrowserExtensionAttributes() {
  if (typeof window !== 'undefined') {
    // Remove common browser extension attributes that cause hydration issues
    const extensionAttributes = [
      'fdprocessedid', // Various extensions
      'data-lastpass-icon-root', // LastPass
      'data-1p-ignore', // 1Password
      'data-dashlane-rid', // Dashlane
      'data-bitwarden-watching', // Bitwarden
    ];

    extensionAttributes.forEach(attr => {
      const elements = document.querySelectorAll(`[${attr}]`);
      elements.forEach(el => el.removeAttribute(attr));
    });
  }
} 