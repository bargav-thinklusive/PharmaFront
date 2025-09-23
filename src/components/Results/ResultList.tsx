import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SearchBar from '../SearchBar';
import { useState, useEffect } from 'react';
import { maindata } from '../../sampleData/data';


const ResultList: React.FC = () => {
  const { ccategory, searchtext, cid } = useParams();
  // Helper to get section by heading
   const navigate = useNavigate();

  function getSection(sections: any, heading: string): any {
    return Array.isArray(sections) ? sections.find((s: any) => s.TOCHeading === heading) : undefined;
  }


  function getSynonyms(item: any): string {
    const namesSec = getSection(item.Record.Section, 'Names and Identifiers');
    const synSec = getSection(namesSec?.Section, 'Synonyms');
    const depos = Array.isArray(synSec?.Section) ? synSec.Section.find((s2: any) => s2.TOCHeading === 'Depositor-Supplied Synonyms') : undefined;
    return (depos?.Information?.flatMap((i: any) => i.Value?.StringWithMarkup?.map((sm: any) => sm.String) || []) || []).join(' ');
  }


  // Get the correct category array from maindata

  type MainDataType = {
    Compound?: any[];
    Taxonomy?: any[];
    Genre?: any[];
  };
  const main: MainDataType = maindata[0] || {};
  let categoryArr: any[] = [];
  if (ccategory === 'compound') categoryArr = main.Compound || [];
  else if (ccategory === 'taxonomy') categoryArr = main.Taxonomy || [];
  else if (ccategory === 'genre') categoryArr = main.Genre || [];


  // Remove duplicates by RecordNumber (CID)
  const uniqueCategoryArr = Array.isArray(categoryArr)
    ? categoryArr.filter((item, idx, arr) =>
        arr.findIndex((i) => i.Record.RecordNumber === item.Record.RecordNumber) === idx
      )
    : [];

  // Helper to extract all searchable fields from a record
  function getAllSearchableStrings(item: any): string[] {
    const arr: string[] = [];
    // Title
    if (item.Record.RecordTitle) arr.push(item.Record.RecordTitle);
    // Synonyms
    const syns = getSynonyms(item);
    if (syns) arr.push(syns);
    // IUPAC Name
    const namesSec = getSection(item.Record.Section, 'Names and Identifiers');
    const compDesc = getSection(namesSec?.Section, 'Computed Descriptors');
    const iupacSec = getSection(compDesc?.Section, 'IUPAC Name');
    if (iupacSec?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String) {
      arr.push(iupacSec.Information[0].Value.StringWithMarkup[0].String);
    }
    // CAS
    const otherIds = getSection(namesSec?.Section, 'Other Identifiers');
    const casSec = getSection(otherIds?.Section, 'CAS');
    if (casSec?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String) {
      arr.push(casSec.Information[0].Value.StringWithMarkup[0].String);
    }
    return arr;
  }

  // Robust filter: match searchtext against any searchable field
  const results = uniqueCategoryArr.filter((item: any) => {
    const search = (searchtext || '').toLowerCase();
    return getAllSearchableStrings(item).some(str => str.toLowerCase().includes(search));
  });

  // Keep the search text in the search bar
  const [searchValue, setSearchValue] = useState(searchtext || '');
  useEffect(() => {
    setSearchValue(searchtext || '');
  }, [searchtext]);

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center bg-white/80 py-8">
      <div className="w-full max-w-5xl ">
        {/* SearchBar with value controlled by searchValue */}
          {searchtext && !cid && (
            <SearchBar value={searchValue} setValue={setSearchValue} initialCategory={ccategory} />
          )}
        {/* Filters, sort, etc. can be added here */}
        <div className="flex items-center gap-8 border-b pb-2 mb-4">
          <span className="font-bold text-blue-900 text-lg">{results.length} results</span>
          <button className="ml-auto px-4 py-1 rounded bg-gray-100 border text-gray-700">Filters</button>
          <select className="px-2 py-1 border rounded bg-white text-gray-700">
            <option>Sort by Relevance</option>
            <option>Sort by Date</option>
          </select>
        </div>
        <div className="space-y-6 w-full md:w-2/3">
          {results.map((compound: any) => {
            const sections = compound.Record.Section || [];
            const cid = compound.Record.RecordNumber;
            // Recursive helper to get section data from any depth
            function getSectionData(sections: any[], tocHeading: string, field: string): string {
              if (!Array.isArray(sections)) return '';
              for (const section of sections) {
                if (section?.TOCHeading === tocHeading) {
                  if (field === 'StringWithMarkup' && section.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String) {
                    return section.Information[0].Value.StringWithMarkup[0].String;
                  }
                  if (field === 'DateISO8601' && section.Information?.[0]?.Value?.DateISO8601?.[0]) {
                    return section.Information[0].Value.DateISO8601[0];
                  }
                }
                if (Array.isArray(section.Section)) {
                  const found = getSectionData(section.Section, tocHeading, field);
                  if (found) return found;
                }
              }
              return '';
            }
            // Helper to get synonyms
            function getSynonyms(sections: any[]) {
              const namesSec = sections.find((s: any) => s.TOCHeading === 'Names and Identifiers');
              const synSec = namesSec?.Section?.find((s: any) => s.TOCHeading === 'Synonyms');
              const depos = synSec?.Section?.find((s2: any) => s2.TOCHeading === 'Depositor-Supplied Synonyms');
              return (
                depos?.Information?.flatMap((i: any) => i.Value?.StringWithMarkup?.map((sm: any) => sm.String) || []) || []
              );
            }
            const handleNaviageToParticularItem = (cid: number) => {
              if (ccategory && cid) {
                navigate(`/${ccategory}/${searchtext}/${cid}`);
              }
            }
            const molecularFormula = getSectionData(sections, 'Molecular Formula', 'StringWithMarkup');
            const molecularWeight = getSectionData(sections, 'Molecular Weight', 'StringWithMarkup');
            const iupacName = getSectionData(sections, 'IUPAC Name', 'StringWithMarkup');
            const smiles = getSectionData(sections, 'SMILES', 'StringWithMarkup');
            const inchi = getSectionData(sections, 'InChI', 'StringWithMarkup');
            const inchiKey = getSectionData(sections, 'InChIKey', 'StringWithMarkup');
            const createDate = getSectionData(sections, 'Create Date', 'DateISO8601');
            const synonyms = getSynonyms(sections);
            const synonymsText = synonyms.join('; ');

            return (
              <div
                key={cid}
                className="flex flex-col md:flex-row border p-4 rounded shadow mb-4 bg-white w-[1000px] overflow-x-auto"
                
              >
                <div className="mr-6 flex flex-col items-start min-w-[220px] max-w-[400px]">
                  <img
                    src={`https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?t=s&cid=${cid}`}
                    alt={`2D Structure of ${compound.Record.RecordTitle}`}
                    className="h-48 w-full max-w-[380px] object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/150?text=No+Image";
                    }}
                  />
                </div>
                <div className="flex flex-col space-y-2 text-left min-w-0 break-words w-full justify-start">
                  {synonymsText && (
                    <p
                      className="text-md text-blue-600 font-semibold cursor-pointer hover:underline"
                      onClick={() => handleNaviageToParticularItem(cid)}
                    >
                      {synonymsText}
                    </p>
                  )}
                  <p className="text-gray-800"><strong>Compound CID:</strong> <span className="text-black">{cid}</span></p>
                  <p className="text-gray-800"><strong>Molecular Formula:</strong> <span className="text-black">{molecularFormula}</span></p>
                  <p className="text-gray-800"><strong>Molecular Weight:</strong> <span className="text-black">{molecularWeight} g/mol</span></p>
                  <p className="text-gray-800"><strong>IUPAC Name:</strong> <span className="text-black">{iupacName}</span></p>
                  <p className="text-gray-800"><strong>SMILES:</strong> <span className="text-black">{smiles}</span></p>
                  <p className="text-gray-800"><strong>InChI:</strong> <span className="text-black">{inchi}</span></p>
                  <p className="text-gray-800"><strong>InChIKey:</strong> <span className="text-black">{inchiKey}</span></p>
                  <p className="text-gray-800"><strong>Create Date:</strong> <span className="text-black">{createDate}</span></p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResultList;
