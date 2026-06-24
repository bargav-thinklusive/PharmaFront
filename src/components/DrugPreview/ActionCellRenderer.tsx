import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { flattenDrug } from '../CompoundForm/helper';
import useDraft from '../../hooks/useDraft';
import useRoles from '../../hooks/useRoles';

const ActionCellRenderer: React.FC<any> = (params) => {
    const navigate = useNavigate();
    const { saveDraft } = useDraft();
    const { canEditDrugs } = useRoles();

    const handleEdit = () => {
        const data = params.data;
        if (!data?.cid) return;
        const flatData = flattenDrug(data);
        const newDraftId = saveDraft(flatData, 0);
        navigate(`/drug-form?draftId=${newDraftId}`);
    };

    if (!canEditDrugs) {
        return null;
    }

    return (
        <button
            onClick={handleEdit}
            className="inline-flex items-center justify-center p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors h-full"
            title="Edit Drug"
        >
            <FaEdit size={16} /> <span className="ml-2 font-semibold">Edit</span>
        </button>
    );
};

export default ActionCellRenderer;
