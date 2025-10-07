import { STYLES } from '../utils';

interface ManufacturingSite {
  vendor: string;
  location: string;
}

export const renderManufacturingSitesTable = (sites: ManufacturingSite[]) => (
  <div className={STYLES.table}>
    <table className="w-full text-sm text-black">
      <thead>
        <tr className="border-b border-blue-100">
          <th className={STYLES.tableHeader}>vendor</th>
          <th className={STYLES.tableHeader}>location</th>
        </tr>
      </thead>
      <tbody>
        {sites.map((site, index) => (
          <tr key={index} className="border-b border-blue-100">
            <td className={STYLES.tableCell}>{site.vendor || 'N/A'}</td>
            <td className={STYLES.tableCell}>{site.location || 'N/A'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);