import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { flattenDrug } from '../CompoundForm/helper';
import useRoles from '../../hooks/useRoles';

const ActionCellRenderer: React.FC<any> = (params) => {
    const navigate = useNavigate();
    const { canEditDrug } = useRoles();

    const handleEdit = () => {
        const data = params.data;
        const drugId = data?._id || data?.id;
        if (!drugId) return;
        const flatData = flattenDrug(data);
        flatData._id = drugId;
        flatData.original_id = drugId;
        flatData.originalVersion = flatData.version || data.version || "1.0";
        if (!flatData.version) {
            flatData.version = "1.0";
        }
        navigate(`/drug-form?drugId=${drugId}`, { state: { initialData: flatData } });
    };

    if (!canEditDrug(params.data)) {
        return null;
    }

    return (
        <button
            onClick={handleEdit}
            className="inline-flex items-center justify-center p-2 text-primary hover:text-primary-hover hover:bg-primary-light rounded transition-colors h-full"
            title="Edit Drug"
        >
            <FaEdit size={16} /> <span className="ml-2 font-semibold">Edit</span>
        </button>
    );
};

export default ActionCellRenderer;
