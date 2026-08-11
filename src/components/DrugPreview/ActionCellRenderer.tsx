import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { flattenDrug } from '../CompoundForm/helper';
import { findExistingDraft, getNextVersion } from '../../utils/utils';
import useDraft from '../../hooks/useDraft';
import useRoles from '../../hooks/useRoles';
import { useUser } from '../../context/UserContext';

const ActionCellRenderer: React.FC<any> = (params) => {
    const navigate = useNavigate();
    const { saveDraft } = useDraft();
    const { drafts } = useUser();
    const { canEditDrug } = useRoles();

    const handleEdit = async () => {
        const data = params.data;
        if (!data?.cid && !data?._id) return;
        const flatData = flattenDrug(data);
        if (!flatData.version || flatData.version === "1.0" || flatData.version === 1) {
            flatData.version = getNextVersion(flatData.version || "1.0");
        }
        const existingDraft = findExistingDraft(drafts, flatData);
        const targetDraftId = existingDraft ? (existingDraft.id || existingDraft._id) : null;
        const newDraftId = await saveDraft(flatData, 0, targetDraftId);
        navigate(`/drug-form?draftId=${newDraftId}`, { state: { initialData: flatData } });
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
