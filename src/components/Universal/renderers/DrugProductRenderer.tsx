import AppendixLink from '../../Compound/AppendixLink';
import { formatKey, hasContent, STYLES } from '../utils';

export const renderDrugProduct = (drugProduct: any) => {
  const information = drugProduct?.information || {};

  // Get all valid entries and sort them for proper numbering
  const validEntries = Object.entries(information).filter(([k, v]) => hasContent(v) && !/^\d+$/.test(k));

  if (validEntries.length === 0) {
    return <p className={`${STYLES.noData} ml-6`}>No data available</p>;
  }

  return (
    <div className="space-y-4">
      {validEntries.map(([key, value], index) => {
        const subsectionNumber = index + 1;
        const subsectionId = `section-4-${subsectionNumber}`;

        // Special handling for strengths table
        if (key === 'strengths' && Array.isArray(value)) {
          return (
            <div key={key} className="mb-6 ml-6">
              <h2 id={subsectionId} className={STYLES.subsubsectionTitle}>
                4.{subsectionNumber} Strengths
              </h2>
              <table className="table-auto border-collapse border-b border-blue-400 mb-4">
                <thead>
                  <tr>
                    <th className="border border-gray-400 px-2">Strength</th>
                    <th className="border border-gray-400 px-2">Type</th>
                    <th className="border border-gray-400 px-2">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {value.map((strength: any, i: number) => (
                    <tr key={i}>
                      <td className="border border-gray-400 px-2">{strength.strength}</td>
                      <td className="border border-gray-400 px-2">{strength.type}</td>
                      <td className="border border-gray-400 px-2">{strength.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // Special handling for packaging and storage conditions
        if (key === 'packagingAndStorageConditions' && typeof value === 'object') {
          const { storageTemperature, ...rest } = value as any;
          return (
            <div key={key} className="mb-6 ml-6">
              <h2 id={subsectionId} className={STYLES.subsubsectionTitle}>
                4.{subsectionNumber} Packaging And Storage Conditions
              </h2>
              <table className="table-auto border-collapse border border-gray-400 mb-4">
                <thead>
                  <tr>
                    <th className="border border-gray-400 px-2">Strength</th>
                    <th className="border border-gray-400 px-2">Description</th>
                    <th className="border border-gray-400 px-2">Packaging</th>
                    <th className="border border-gray-400 px-2">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(rest).map(([strengthKey, obj]: any, i) => (
                    <tr key={i}>
                      <td className="border border-gray-400 px-2">{strengthKey}</td>
                      <td className="border border-gray-400 px-2">{obj.description}</td>
                      <td className="border border-gray-400 px-2">{obj.packaging}</td>
                      <td className="border border-gray-400 px-2">{obj.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {storageTemperature && (
                <p>
                  <strong>Storage Temperature:</strong> {storageTemperature}
                </p>
              )}
            </div>
          );
        }

        // Handle sub-subsections for complex objects
        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
          const subEntries = Object.entries(value).filter(([k, v]) => hasContent(v) && !/^\d+$/.test(k));

          if (subEntries.length > 0) {
            return (
              <div key={key} className="mb-6 ml-6">
                <h2 id={subsectionId} className={STYLES.subsubsectionTitle}>
                  4.{subsectionNumber} {formatKey(key)}
                </h2>
                <div className="ml-4 space-y-2">
                  {subEntries.map(([subKey, subValue], subIndex) => {
                    const subSubsectionId = `${subsectionId}-${subIndex + 1}`;
                    return (
                      <div key={subKey} className="mb-2">
                        <h3 id={subSubsectionId} className={STYLES.smallTitle}>
                          4.{subsectionNumber}.{subIndex + 1} {formatKey(subKey)}
                        </h3>
                        {hasContent(subValue) ? (
                          Array.isArray(subValue) ? (
                            <ul className="list-disc list-inside ml-4">
                              {subValue.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  <AppendixLink text={String(item)} />
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="ml-4">
                              <AppendixLink text={String(subValue)} />
                            </p>
                          )
                        ) : (
                          <p className={`ml-4 ${STYLES.noData}`}>No data available</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }
        }

        // Default subsection rendering
        return (
          <div key={key} className="mb-4 ml-6">
            <h2 id={subsectionId} className={STYLES.subsubsectionTitle}>
              4.{subsectionNumber} {formatKey(key)}
            </h2>
            {Array.isArray(value) ? (
              <ul className="list-disc list-inside ml-4">
                {value.map((v: any, i) => (
                  <li key={i}>
                    <AppendixLink text={String(v)} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="ml-4">
                <AppendixLink text={String(value)} />
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};