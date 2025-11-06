"use client";

import { useEffect } from 'react';

/**
 * Component to fix hydration mismatches caused by browser extensions
 */
export default function HydrationFix() {
  useEffect(() => {
    // Clean up browser extension attributes that cause hydration mismatches
    const cleanupExtensionAttributes = () => {
      const extensionAttributes = [
        'fdprocessedid', // Various extensions
        'data-lastpass-icon-root', // LastPass
        'data-1p-ignore', // 1Password
        'data-dashlane-rid', // Dashlane
        'data-bitwarden-watching', // Bitwarden
        'data-ms-editor', // Microsoft Editor
        'data-gr-c-s-loaded', // Grammarly
      ];

      extensionAttributes.forEach(attr => {
        const elements = document.querySelectorAll(`[${attr}]`);
        elements.forEach(el => el.removeAttribute(attr));
      });
    };

    // Clean up immediately
    cleanupExtensionAttributes();

    // Set up a mutation observer to clean up attributes added dynamically
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const target = mutation.target as Element;
          const attrName = mutation.attributeName;
          
          if (attrName && (
            attrName.startsWith('fdprocessedid') ||
            attrName.startsWith('data-lastpass') ||
            attrName.startsWith('data-1p-') ||
            attrName.startsWith('data-dashlane') ||
            attrName.startsWith('data-bitwarden') ||
            attrName.startsWith('data-ms-editor') ||
            attrName.startsWith('data-gr-')
          )) {
            target.removeAttribute(attrName);
          }
        }
      });
    });

    // Start observing
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: undefined // Monitor all attributes
    });

    // Cleanup function
    return () => {
      observer.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
}