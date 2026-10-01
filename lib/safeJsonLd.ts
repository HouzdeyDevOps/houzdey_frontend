/**
 * JSON.stringify a JSON-LD object for embedding in a <script type="application/ld+json">
 * tag. Escapes '<' so a value containing the literal substring "</script>" cannot break
 * out of the script tag — < is valid JSON and round-trips through JSON.parse (which
 * is how search engines' structured-data parsers read this content) back to '<'.
 */
export function safeJsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
