import KeyValueTable from '../../Compound/KeyValueTable';
import ManufacturingSites from '../../Compound/ManufacturingSites';
import AppendixLink from '../../Compound/AppendixLink';
import { formatKey, hasContent, DRUG_SUBSTANCE_SUBSECTIONS, STYLES } from '../utils';

export const renderDrugSubstance = (drugSubstance: any) => {
  return (
    <div className="space-y-6">
      {DRUG_SUBSTANCE_SUBSECTIONS.map((subsection) => {
        const subsectionData = drugSubstance?.[subsection.key];
        const subsectionId = `section-${subsection.id}`;

        if (!hasContent(subsectionData)) {
          return (
            <div key={subsection.key} className="mb-6 ml-6">
              <h2 id={subsectionId} className={STYLES.subsectionTitle}>
                {subsection.id.replace('-', '.')} {subsection.title}
              </h2>
              <p className={STYLES.noData}>No data available</p>
            </div>
          );
        }

        // Special handling for process development with manufacturing sites
        if (subsection.key === 'processDevelopment') {
          const filteredData = Object.fromEntries(
            Object.entries(subsectionData).filter(([key, value]) =>
              key !== 'manufacturingSites' && (typeof value !== 'object' || Array.isArray(value))
            )
          );

          return (
            <div key={subsection.key} className="mb-6 ml-6">
              <h2 id={subsectionId} className={STYLES.subsectionTitle}>
                {subsection.id.replace('-', '.')} {subsection.title}
              </h2>
              <KeyValueTable data={filteredData} />
              {subsectionData.manufacturingSites && (
                <ManufacturingSites manufacturingSites={subsectionData.manufacturingSites} />
              )}
            </div>
          );
        }

        // Special handling for analytical development
        if (subsection.key === 'analyticalDevelopment') {
          const subEntries = Object.entries(subsectionData || {}).filter(([key]) => !/^\d+$/.test(key));

          return (
            <div key={subsection.key} className="mb-6 ml-6">
              <h2 id={subsectionId} className={STYLES.subsectionTitle}>
                {subsection.id.replace('-', '.')} {subsection.title}
              </h2>
              {subEntries.length > 0 ? (
                subEntries.map(([key, value], idx) => (
                  <div key={key} className="mb-4 ml-10">
                    <h3 id={`${subsectionId}-${idx + 1}`} className={STYLES.smallTitle}>
                      {subsection.id.replace('-', '.')}.{idx + 1} {formatKey(key)}
                    </h3>
                    {hasContent(value) ? (
                      <p><AppendixLink text={String(value)} /></p>
                    ) : (
                      <p className={STYLES.noData}>No data available</p>
                    )}
                  </div>
                ))
              ) : (
                <p className={`${STYLES.noData} ml-4`}>No data available</p>
              )}
            </div>
          );
        }

        // Default handling for physical and chemical properties
        return (
          <div key={subsection.key} className="mb-6 ml-6">
            <h2 id={subsectionId} className={STYLES.subsectionTitle}>
              {subsection.id.replace('-', '.')} {subsection.title}
            </h2>
            <KeyValueTable data={subsectionData} />
          </div>
        );
      })}
    </div>
  );
};