import React from 'react';

interface SummaryCardProps {
	record: any;
	activeId?: string;
}

function findByHeading(sections: any[] = [], heading: string): any | null {
	for (const s of sections) {
		if (!s) continue;
		if (s.TOCHeading === heading) return s;
		if (Array.isArray(s.Section)) {
			const found = findByHeading(s.Section, heading);
			if (found) return found;
		}
	}
	return null;
}

function extractFirstString(node: any): string | null {
	if (!node) return null;
	if (Array.isArray(node.Information)) {
		for (const info of node.Information) {
			const v = info.Value;
			if (!v) continue;
			if (Array.isArray(v.StringWithMarkup) && v.StringWithMarkup.length > 0) return v.StringWithMarkup.map((s: any) => s.String).join(', ');
			if (Array.isArray(v.String)) return v.String.join(', ');
			if (Array.isArray(v.Number)) return v.Number.join(', ');
			if (typeof v.Unit === 'string') return v.Unit;
		}
	}
	if (Array.isArray(node.Section)) {
		for (const s of node.Section) {
			const r = extractFirstString(s);
			if (r) return r;
		}
	}
	return null;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ record }) => {
	if (!record) return null;
	const title = record.RecordTitle || `Record ${record.RecordNumber}`;
	const number = record.RecordNumber;
	const sections = record.Section || [];

	const molFormNode = findByHeading(sections, 'Molecular Formula');
	const molecularFormula = extractFirstString(molFormNode) || '';

	// Try to get a short synonym or title-like string
	const synonymsNode = findByHeading(sections, 'Synonyms') || findByHeading(sections, 'Depositor-Supplied Synonyms');
	const synonym = extractFirstString(synonymsNode) || '';

	return (
		<div className="w-full bg-white text-black p-4 rounded shadow-sm" style={{ color: 'black' }}>
			<div className="flex items-start gap-4">
				<div className="flex-1 min-w-0">
					<div className="text-black font-bold text-2xl leading-tight truncate">{title}</div>
					<div className="text-black text-sm">CID {number}</div>
					{synonym && <div className="mt-2 text-black text-sm">{synonym}</div>}
				</div>
				<div className="flex-shrink-0 text-black text-sm text-right">
					{molecularFormula && (
						<div className="text-black">
							<div className="text-xs font-semibold">Molecular Formula</div>
							<div className="text-black">{molecularFormula}</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default SummaryCard;
