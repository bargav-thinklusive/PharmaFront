interface Reference {
  title: string;
  url: string;
}

export const renderReferencesList = (references: Reference[], sectionId?: string) => (
  <div>
    {references.map((ref: Reference, refIndex: number) => (
      <div key={refIndex} className="mb-2">
        <h2 id={`${sectionId}-${refIndex + 1}`} className="font-semibold">
          {refIndex + 1}. {ref.title}
        </h2>
        <a
          href={ref.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800 break-words"
        >
          {ref.url}
        </a>
      </div>
    ))}
  </div>
);