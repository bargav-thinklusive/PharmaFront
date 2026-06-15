import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ModuleRegistry,
  NumberFilterModule,
  PaginationModule,
  RowAutoHeightModule,
  RowSelectionModule,
  TextFilterModule,
  ValidationModule,
} from 'ag-grid-community';
import { columns } from './columns';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import '../DrugTable/DrugsTable.css';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  RowAutoHeightModule,
  CellStyleModule,
  PaginationModule,
  RowSelectionModule
]);

const DrugPreview: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // The drug passed via router state
    const drug = location.state?.drug;

    const handleBack = () => {
        navigate(-1);
    };

    if (!drug) {
        return (
            <div className="p-8 text-center">
                <p>No drug data found. Please go back and select a drug.</p>
                <button onClick={() => navigate('/home')} className="mt-4 text-blue-600 underline">
                    Return Home
                </button>
            </div>
        );
    }

    return (
        <div className="w-full min-h-[60vh] flex flex-col items-center bg-gray-50/50 py-8">
            <div className="w-full max-w-7xl px-4">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Drug Preview</h1>
                        <p className="text-gray-500 text-sm mt-1">Review the drug details before editing.</p>
                    </div>
                    <button
                        onClick={handleBack}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                    >
                        ← Back
                    </button>
                </div>

                <div className="ag-theme-quartz w-full shadow-lg rounded-lg overflow-hidden border border-gray-200" style={{ height: "calc(100vh - 200px)" }}>
                    <AgGridReact
                        rowData={[drug]}
                        columnDefs={columns}
                        rowSelection="single"
                        headerHeight={56}
                    />
                </div>
            </div>
        </div>
    );
};

export default DrugPreview;
