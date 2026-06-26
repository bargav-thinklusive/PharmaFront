import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { FiMoreVertical, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useUser } from '../../context/UserContext';
import useDelete from '../../hooks/useDelete';
import DrugService from '../../services/DrugService';
import useDraft from '../../hooks/useDraft';
import { flattenDrug } from '../CompoundForm/helper';
import { toast } from 'react-toastify';
import useRoles from '../../hooks/useRoles';

const ActionMenuCellRenderer: React.FC<any> = (params) => {
  const navigate = useNavigate();
  const { refetchDrugs } = useUser();
  const { deleteData } = useDelete();
  const { saveDraft } = useDraft();
  const { canEditDrugs, canDeleteDrugs } = useRoles();
  const drugService = new DrugService();

  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.right + window.scrollX - 120, // Align right edge of menu with button
      });
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClose = () => setIsOpen(false);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, [isOpen]);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    
    const data = params.data?.drug || params.data;
    if (!data?.cid) {
      toast.error("Invalid drug data for editing");
      return;
    }
    
    try {
      const flatData = flattenDrug(data);
      const newDraftId = saveDraft(flatData, 0);
      navigate(`/drug-form?draftId=${newDraftId}`);
    } catch (err) {
      console.error("Error creating draft:", err);
      toast.error("Failed to edit drug");
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    
    const data = params.data?.drug || params.data;
    const drugId = data?._id;
    
    if (!drugId) {
      toast.error("Invalid drug ID");
      return;
    }

    if (window.confirm("Are you sure you want to delete this drug?")) {
      try {
        await deleteData(drugService.deleteDrug(drugId));
        toast.success("Drug deleted successfully");
        if (refetchDrugs) {
          await refetchDrugs();
        }
      } catch (err) {
        console.error("Error deleting drug:", err);
        toast.error("Failed to delete drug");
      }
    }
  };

  if (!canEditDrugs && !canDeleteDrugs) {
    return null;
  }

  return (
    <div className="flex items-center justify-center w-full h-full relative">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="p-1 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all cursor-pointer flex items-center justify-center h-8 w-8"
        title="Actions"
      >
        <FiMoreVertical className="w-5 h-5" />
      </button>

      {isOpen &&
        ReactDOM.createPortal(
          <div
            className="absolute bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-[9999] w-[120px] text-[13.5px] font-semibold text-gray-700"
            style={{ top: coords.top + 4, left: coords.left }}
            onClick={(e) => e.stopPropagation()}
          >
            {canEditDrugs && (
              <button
                onClick={handleEdit}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-[#2563EB] hover:text-[#1d4ed8] cursor-pointer"
              >
                <FiEdit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}
            {canDeleteDrugs && (
              <button
                onClick={handleDelete}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-red-600 hover:text-red-700 border-t border-gray-100 cursor-pointer"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}
          </div>,
          document.body
        )}
    </div>
  );
};

export default ActionMenuCellRenderer;
