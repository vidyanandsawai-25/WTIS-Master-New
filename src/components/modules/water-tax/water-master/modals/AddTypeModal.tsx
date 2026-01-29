import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../../common/water-master/dialog";
import { useMasterData } from "@/hooks/water-master/useMasterData";
import { Button } from "../../../../common/Button";
import { Input } from "../../../../common/Input";
import { ToggleSwitch } from "../../../../common/ToggleSwitch";
import { Edit2, Trash2, Plus } from "lucide-react";
import { default as WTISManagement } from "../WTISManagement";
import { toast } from "react-toastify";

interface AddTypeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  typeSearch: string;
  setTypeSearch: (v: string) => void;
  connectionTypes: any[];
  editingTypeId: string | number | null;
  editingTypeValue: string;
  setEditingTypeValue: (v: string) => void;
  editingTypeDescription: string;
  setEditingTypeDescription: (v: string) => void;
  handleEditType: (type: { id: string | number, name: string, description: string }) => void;
  handleSaveEditType: () => void;
  handleCancelEditType: () => void;
  confirmDeleteToast: (cb: () => void) => void;
  handleDeleteConnectionType: (id: number) => void;
  t: any;
}

const AddTypeModal: React.FC<AddTypeModalProps> = ({
  open,
  onOpenChange,
  typeSearch,
  setTypeSearch,
  connectionTypes,
  editingTypeId,
  editingTypeValue,
  setEditingTypeValue,
  editingTypeDescription,
  setEditingTypeDescription,
  handleEditType,
  handleSaveEditType,
  handleCancelEditType,
  confirmDeleteToast,
  handleDeleteConnectionType,
  t,
}) => {


  // State for new connection type fields
  const [newTypeName, setNewTypeName] = useState<string>("");
  const [newTypeDescriptionEnglish, setNewTypeDescriptionEnglish] = useState<string>("");
  const [newTypeSequenceNo, setNewTypeSequenceNo] = useState<number>(1);
  const [newTypeIsActive, setNewTypeIsActive] = useState<boolean>(true);

  // Edit state for row fields
  const [editDescriptionEnglish, setEditDescriptionEnglish] = useState<string>("");
  const [editSequenceNo, setEditSequenceNo] = useState<number>(1);
  const [editIsActive, setEditIsActive] = useState<boolean>(true);
  const [editId, setEditId] = useState<string | number | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [typeReloadKey, setTypeReloadKey] = useState(0);
  const { addConnectionType, updateConnectionType, deleteConnectionType, refreshAll } = useMasterData();


  // Add new connection type (POST)
  const handleAddType = async () => {
    if (!newTypeName.trim()) {
      toast.error("Please enter type name");
      return;
    }
    const payload = {
      Description: newTypeName.trim(),
      DescriptionEnglish: newTypeDescriptionEnglish.trim(),
      SequenceNo: newTypeSequenceNo,
      IsActive: newTypeIsActive,
      CreatedBy: 1,
    };
    try {
      await addConnectionType(payload);
      setNewTypeName("");
      setNewTypeDescriptionEnglish("");
      setNewTypeSequenceNo(1);
      setNewTypeIsActive(true);
      setTimeout(() => setTypeReloadKey(prev => prev + 1), 300);
      if (typeof refreshAll === 'function') await refreshAll();
      toast.success("Type added successfully");
    } catch (e) {
      toast.error("Failed to add type");
    }
  };

  // Edit (PUT) connection type
  const handleEditTypeRow = (type: any) => {
    setEditId(type.ConnectionTypeID ?? type.id);
    setEditName(type.Description ?? type.name ?? "");
    setEditDescriptionEnglish(type.DescriptionEnglish ?? "");
    setEditSequenceNo(type.SequenceNo ?? 1);
    setEditIsActive(type.IsActive ?? true);
    handleEditType({ id: type.ConnectionTypeID ?? type.id, name: type.Description ?? type.name ?? "", description: type.Description ?? type.name ?? "" });
  };

  const handleSaveEditTypeRow = async () => {
    if (!editName.trim()) {
      toast.error("Please enter type name");
      return;
    }
    const payload = {
      ConnectionTypeID: editId ?? 0,
      Description: editName.trim(),
      DescriptionEnglish: editDescriptionEnglish.trim(),
      SequenceNo: editSequenceNo,
      IsActive: editIsActive,
      UpdatedBy: 1,
    };
    try {
      await updateConnectionType(payload);
      setEditId(null);
      setEditName("");
      setEditDescriptionEnglish("");
      setEditSequenceNo(1);
      setEditIsActive(true);
      setTimeout(() => setTypeReloadKey(prev => prev + 1), 300);
      if (typeof refreshAll === 'function') await refreshAll();
      toast.success("Type updated successfully");
    } catch (e) {
      toast.error("Failed to update type");
    }
  };

  // Cancel edit
  const handleCancelEditTypeRow = () => {
    setEditId(null);
    setEditName("");
    setEditDescriptionEnglish("");
    setEditSequenceNo(1);
    setEditIsActive(true);
    handleCancelEditType();
  };

  // Delete (DELETE) connection type
  const handleDeleteTypeRow = async (id: number) => {
    try {
      await deleteConnectionType(id);
      setTimeout(() => setTypeReloadKey(prev => prev + 1), 300);
      if (typeof refreshAll === 'function') await refreshAll();
      toast.success("Type deleted successfully");
    } catch (e) {
      toast.error("Failed to delete type");
    }
  };

  
  const [currentPage, setCurrentPage] = React.useState(1);
  const entriesPerPage = 4;
const filteredTypes = connectionTypes.filter(t =>
  (t.typeName || t.name || '').toLowerCase().includes((typeSearch || '').toLowerCase())
);
  const totalPages = Math.ceil(filteredTypes.length / entriesPerPage);
  const paginatedTypes = filteredTypes.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [filteredTypes.length, totalPages]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white rounded-2xl shadow-2xl border-0 w-[95vw] sm:w-[90vw] md:max-w-2xl p-0 max-h-[85vh] overflow-hidden flex flex-col">
      <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100 bg-gradient-to-br from-green-50 via-white to-transparent">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-2.5 rounded-xl shadow-lg">
            {/* Icon can be added here if needed */}
          </div>
          <div>
            <DialogTitle className="text-green-700 text-base sm:text-lg mb-0.5">
              Manage Connection Types
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Add, edit or manage connection types
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/30">
        <div className="space-y-2">
          <label className="text-xs text-gray-700 font-semibold">{t.typeName}</label>
          <div className="flex gap-2 flex-wrap">
            <Input
              type="text"
              placeholder={t.enterTypeName}
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              className="h-10 text-sm bg-white border-gray-300 hover:border-green-500 transition-colors flex-1"
            />
            <Input
              type="text"
              placeholder="Description English"
              value={newTypeDescriptionEnglish}
              onChange={(e) => setNewTypeDescriptionEnglish(e.target.value)}
              className="h-10 text-sm bg-white border-gray-300 hover:border-green-500 transition-colors flex-1"
            />
            <Input
              type="number"
              placeholder="Sequence No"
              value={newTypeSequenceNo}
              onChange={(e) => setNewTypeSequenceNo(Number(e.target.value))}
              className="h-10 text-sm bg-white border-gray-300 hover:border-green-500 transition-colors w-32"
              min={1}
            />
            <label className="flex items-center gap-2 text-xs font-semibold">
              <ToggleSwitch
    checked={editIsActive}
    onChange={() => setEditIsActive((prev) => !prev)}
    label={editIsActive ? "Active" : "Inactive"}
  />
              Active
            </label>
            <Button
              onClick={handleAddType}
              size="md"
              className="h-10 px-4 text-sm bg-[#005A9C] shadow-md"
            >
              Add Type
            </Button>
          </div>
        </div>
      </div>

      {/* <div className="px-6 py-4 border-b border-gray-200">
        <Input
          type="text"
          placeholder="Search Type..."
          value={typeSearch}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTypeSearch(e.target.value)}
          className="mb-2 h-8 text-sm border-gray-300"
        />
      </div> */}
      
      {/* List of Existing Types */}
      <div className="px-6 py-4 overflow-y-auto flex-1">
        <div className="space-y-3">
          <label className="text-xs text-gray-600 font-semibold uppercase tracking-wide">
            Existing Connection Types ({connectionTypes.length})
          </label>
          <div className="border border-green-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#005A9C] border-b border-green-200">
                <tr>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-white uppercase tracking-wide w-16 border border-gray-200">Sr. No</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-white uppercase tracking-wide border border-gray-200">Name</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-white uppercase tracking-wide border border-gray-200">Description English</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-white uppercase tracking-wide border border-gray-200">Sequence No</th>
                  <th className="px-3 py-2 text-center text-[10px] font-bold text-white uppercase tracking-wide border border-gray-200">Status</th>
                  <th className="px-3 py-2 text-center text-[10px] font-bold text-white uppercase tracking-wide w-20 border border-gray-200">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-green-100">
                {paginatedTypes.map((type, index) => {
                  const name = type.Description ?? type.description ?? type.name ?? "";
                  const id = typeof type === 'object' && ('ConnectionTypeID' in type ? type.ConnectionTypeID : ('id' in type ? type.id : `type-row-${name}`));
                  const descriptionEnglish = type.DescriptionEnglish ?? type.descriptionEnglish ?? "";
                  const sequenceNo = type.SequenceNo ?? type.sequenceNo ?? "";
                  const isActive = typeof type === 'object' && ('IsActive' in type ? type.IsActive : ('isActive' in type ? type.isActive : true));
                  const isEditing = editId === id;
                  return (
                    <tr key={id} className="hover:bg-green-50 transition-colors group">
                      <td className="px-3 py-2.5 text-xs text-gray-700 font-medium border border-gray-200">{(currentPage - 1) * entriesPerPage + index + 1}</td>
                      {isEditing ? (
                        <>
                          <td className="px-3 py-2.5 text-sm text-gray-800 font-medium border border-gray-200">
                            <Input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="h-8 text-sm border-gray-300 flex-1"
                            />
                          </td>
                          <td className="px-3 py-2.5 text-xs text-gray-500 border border-gray-200">
                            <Input
                              type="text"
                              value={editDescriptionEnglish}
                              onChange={(e) => setEditDescriptionEnglish(e.target.value)}
                              className="h-8 text-sm border-gray-300 flex-1"
                              placeholder="Description English"
                            />
                          </td>
                          <td className="px-3 py-2.5 text-xs text-gray-500 border border-gray-200">
                            <Input
                              type="number"
                              value={editSequenceNo}
                              onChange={(e) => setEditSequenceNo(Number(e.target.value))}
                              className="h-8 text-sm border-gray-300 w-24"
                              placeholder="Sequence No"
                            />
                          </td>
                          <td className="px-3 py-2.5 text-center border border-gray-200">
                            <ToggleSwitch
                              checked={editIsActive}
                              onChange={() => setEditIsActive((prev) => !prev)}
                              label={editIsActive ? "Active" : "Inactive"}
                            />
                          </td>
                          <td className="px-3 py-2.5 text-center flex gap-1 justify-center border border-gray-200">
                            <Button size="sm" className="h-8 px-2 bg-green-500 text-white" onClick={handleSaveEditTypeRow}>Save</Button>
                            <Button size="sm" className="h-8 px-2 bg-gray-300" onClick={handleCancelEditTypeRow}>Cancel</Button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-3 py-2.5 text-sm text-gray-800 font-medium border border-gray-200">{name}</td>
                          <td className="px-3 py-2.5 text-xs text-gray-500 border border-gray-200">{descriptionEnglish || "-"}</td>
                          <td className="px-3 py-2.5 text-xs text-gray-500 border border-gray-200">{sequenceNo}</td>
                          <td className="px-3 py-2.5 text-center border border-gray-200">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${isActive ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`}>
                              {isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-center flex gap-1 justify-center border border-gray-200">
                            <Button
                              onClick={() => handleEditTypeRow(type)}
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-green-600 hover:bg-green-100 hover:text-green-700"
                              title="Edit"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              onClick={() => confirmDeleteToast(() => handleDeleteTypeRow(Number(id)))}
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-red-600 hover:bg-red-100 hover:text-red-700"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
                     
              </tbody>
            </table>
          </div>
           {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <div className="flex justify-between items-center mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-3 text-xs"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </Button>
                          <span className="text-xs text-gray-600">
                            Page {currentPage} of {totalPages}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-3 text-xs"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </Button>
                        </div>
                      )}
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
        <Button
          onClick={() => onOpenChange(false)}
          variant="outline"
          size="md"
          className="h-10 px-6 text-sm border-gray-300 hover:bg-gray-100"
        >
          {t.close}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

}
export default AddTypeModal;
