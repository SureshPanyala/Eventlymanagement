/** Server-rendered JSON-LD. `<` is escaped so user text can't close the script tag. */
export default function JsonLd({ data }: { data: Record<string, unknown> }): JSX.Element {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
