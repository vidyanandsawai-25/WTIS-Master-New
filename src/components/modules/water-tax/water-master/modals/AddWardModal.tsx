import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../../common/water-master/dialog";
import { Button } from "../../../../common/Button";
import { Input } from "../../../../common/Input";
import { ToggleSwitch } from "../../../../common/ToggleSwitch";
import { Plus, Edit2, Trash2 } from "lucide-react";

// Types for props
interface Zone {
  zoneID: number;
  zoneName: string;
}
interface Ward {
  wardID: number;
  description: string;
  descriptionEnglish: string;
  zoneID: number;
  sequenceNo: number;
  isActive: boolean;
  createdBy: number;
  createdDate: string;
  updatedBy?: number;
  updatedDate?: string;
}

interface AddWardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedZoneID: string;
  setSelectedZoneID: (id: string) => void;
  newDescription: string;
  setNewDescription: (desc: string) => void;
  newDescriptionEnglish: string;
  setNewDescriptionEnglish: (desc: string) => void;
  newSequenceNo: string;
  setNewSequenceNo: (seq: string) => void;
  newWardActive: boolean;
  setNewWardActive: (active: boolean) => void;
  handleAddWard: () => void;
  zones: Zone[];
  wards: Ward[];
  wardSearch: string;
  editingWardId: number | null;
  setEditingWardId: (id: number | null) => void;
  editingWardValue: string;
  setEditingWardValue: (value: string) => void;
  editingWardDescriptionEnglish: string;
  setEditingWardDescriptionEnglish: (value: string) => void;
  editingWardSequenceNo: string;
  setEditingWardSequenceNo: (value: string) => void;
  editingWardActive: boolean;
  setEditingWardActive: (value: boolean) => void;
  handleEditWard: (ward: Ward,isActive: boolean) => void;
  handleSaveEditWard: () => void;
  handleCancelEditWard: () => void;
  refreshAll?: () => Promise<void>;
  toast: any;
  confirmDeleteToast: (cb: () => void) => void;
  deleteWard: (id: number) => void;
  setShowAddWardModal: (open: boolean) => void;
  t: any;
}

const AddWardModal: React.FC<AddWardModalProps> = ({
  open,
  onOpenChange,
  selectedZoneID,
  setSelectedZoneID,
  newDescription,
  setNewDescription,
  newDescriptionEnglish,
  setNewDescriptionEnglish,
  newSequenceNo,
  setNewSequenceNo,
  newWardActive,
  setNewWardActive,
  handleAddWard,
  zones,
  wards,
  wardSearch,
  editingWardId,
  setEditingWardId,
  editingWardValue,
  setEditingWardValue,
  editingWardDescriptionEnglish,
  setEditingWardDescriptionEnglish,
  editingWardSequenceNo,
  setEditingWardSequenceNo,
  editingWardActive,
  setEditingWardActive,
  handleEditWard,
  handleSaveEditWard,
  handleCancelEditWard,
  refreshAll,
  toast,
  confirmDeleteToast,
  deleteWard,
  setShowAddWardModal,
  t,
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const entriesPerPage = 4;
  // Normalize backend fields to frontend expected fields for display
  const normalizedWards = wards.map(w => ({
    ...w,
    description: w.description ?? w.description ?? '',
    descriptionEnglish: w.descriptionEnglish ?? w.descriptionEnglish ?? '',
    sequenceNo: w.sequenceNo ?? w.sequenceNo ?? '',
    isActive: typeof w.isActive === 'boolean' ? w.isActive : (w.isActive ?? true),
  }));

  const filteredWards = normalizedWards.filter(w =>
    (w.description || '').toLowerCase().includes((wardSearch || '').toLowerCase())
  );
  const totalPages = Math.ceil(filteredWards.length / entriesPerPage);
  const paginatedWards = filteredWards.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [filteredWards.length, totalPages]);

  return (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="bg-white rounded-2xl shadow-2xl border-0 w-[95vw] sm:w-[90vw] md:max-w-2xl p-0 max-h-[85vh] overflow-hidden flex flex-col">
      <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100 bg-gradient-to-br from-teal-50 via-white to-transparent">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-2.5 rounded-xl shadow-lg">
            <Plus className="h-5 w-5 text-white" />
          </div>
          <div>
            <DialogTitle className="text-teal-700 text-base sm:text-lg mb-0.5">
              Add New Ward
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Enter new ward name
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>
      {/* Add New Ward Input */}
      <div className="px-6 pt-4 pb-2 flex flex-col gap-2 border-b border-gray-200 bg-white">
        <div className="flex flex-col md:flex-row gap-2 w-full">
          <select
            value={selectedZoneID}
            onChange={e => setSelectedZoneID(e.target.value)}
            className="h-10 text-sm bg-white border border-gray-300 rounded px-2 flex-1"
          >
            <option value="">Select zone</option>
            {zones.map((zone: Zone) => (
              <option key={zone.zoneID} value={zone.zoneID.toString()}>
                {zone.zoneName}
              </option>
            ))}
          </select>
          <Input
            className="flex-1 h-10 text-sm border-gray-300"
            placeholder="Description"
            value={newDescription}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDescription(e.target.value)}
            required
          />
          <Input
            className="flex-1 h-10 text-sm border-gray-300"
            placeholder="Description (English)"
            value={newDescriptionEnglish}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDescriptionEnglish(e.target.value)}
            required
          />
          <Input
            className="flex-1 h-10 text-sm border-gray-300"
            placeholder="Sequence No"
             type="number"
            value={newSequenceNo}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSequenceNo(e.target.value)}
            required
          />
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-700">Status</span>
            <ToggleSwitch
              checked={typeof newWardActive === 'undefined' ? true : newWardActive}
              onChange={() => setNewWardActive(!newWardActive)}
              label={typeof newWardActive === 'undefined' ? 'Active' : (newWardActive ? 'Active' : 'Inactive')}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddWard}
          className="w-full mt-2 bg-[#005A9C] hover:bg-[#004080] text-white font-semibold rounded-lg h-10 flex items-center justify-center gap-2 text-sm transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Ward
        </button>
      </div>
      {/* List of Existing Wards */}
      <div className="px-6 py-4 overflow-y-auto flex-1">
        <div className="space-y-3">
          <label className="text-xs text-gray-600 font-semibold uppercase tracking-wide">
            Existing Wards ({wards.length})
          </label>
          <div className="border border-teal-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#005A9C] text-white border-b border-teal-200">
                <tr>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-white uppercase tracking-wide border border-gray-200  w-16">Sr. No</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-white uppercase tracking-wide border border-gray-200">Description</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-white uppercase tracking-wide border border-gray-200">Description (English)</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-white uppercase tracking-wide border border-gray-200">Sequence No</th>
                  <th className="px-3 py-2 text-center text-[10px] font-bold text-white uppercase tracking-wide border border-gray-200">Status</th>
                  <th className="px-3 py-2 text-center text-[10px] font-bold text-white uppercase tracking-wide border border-gray-200 w-20">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-teal-100">
                {paginatedWards.map((ward: Ward, index: number) => (
                  <tr key={ward.wardID} className="hover:bg-teal-50 transition-colors group">
                    <td className="px-3 py-2.5 text-xs text-gray-700 font-medium border border-gray-200">{(currentPage - 1) * entriesPerPage + index + 1}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-800 font-medium border border-gray-200">
                      {editingWardId === ward.wardID ? (
                        <Input
                          type="text"
                          value={editingWardValue}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingWardValue(e.target.value)}
                          className="h-8 text-sm border-gray-300 flex-1"
                        />
                      ) : (
                        ward.description
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-xs text-gray-800 border border-gray-200">
                      {editingWardId === ward.wardID ? (
                        <Input
                          type="text"
                          value={editingWardDescriptionEnglish}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingWardDescriptionEnglish(e.target.value)}
                          className="h-8 text-sm border-gray-300 flex-1"
                        />
                      ) : (
                        ward.descriptionEnglish
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-xs text-gray-800 border border-gray-200">
                      {editingWardId === ward.wardID ? (
                        <Input
                          type="number"
                          value={editingWardSequenceNo}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingWardSequenceNo(e.target.value)}
                          className="h-8 text-sm border-gray-300 flex-1"
                        />
                      ) : (
                        ward.sequenceNo
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-center border border-gray-200">
                      {editingWardId === ward.wardID ? (
                        <ToggleSwitch
                          checked={editingWardActive}
                          onChange={() => setEditingWardActive(!editingWardActive)}
                          label={editingWardActive ? 'Active' : 'Inactive'}
                        />
                      ) : (
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${ward.isActive ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`}>
                          {ward.isActive ? 'Active' : 'Inactive'}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-center flex gap-1 justify-center border border-gray-200">
                      {editingWardId === ward.wardID ? (
                        <>
                          <Button size="sm" className="h-8 px-2 bg-green-500 text-white" onClick={() => handleSaveEditWard()}>Save</Button>
                          <Button size="sm" className="h-8 px-2 bg-gray-300" onClick={handleCancelEditWard}>Cancel</Button>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={() => {
                              setEditingWardId(ward.wardID);
                              setEditingWardValue(ward.description);
                              setEditingWardDescriptionEnglish(ward.descriptionEnglish);
                              setEditingWardSequenceNo(String(ward.sequenceNo));
                              setEditingWardActive(ward.isActive);
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            onClick={async () => {
                              try {
                                confirmDeleteToast(() => deleteWard(ward.wardID));
                                toast.success(`Ward "${ward.description}" deleted successfully.`);
                                if (typeof refreshAll === 'function') await refreshAll();
                              } catch (error) {
                                toast.error(`Failed to delete ward "${ward.description}".`);
                              }
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-red-600 hover:bg-red-100 hover:text-red-700"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                        
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
          onClick={() => setShowAddWardModal(false)}
          variant="outline"
          size="md"
          className="h-10 px-6 text-sm border-gray-300 hover:bg-gray-100"
        >
          Close
        </Button>
      </div>
    </DialogContent>
  </Dialog>
  );
}
export default AddWardModal;
