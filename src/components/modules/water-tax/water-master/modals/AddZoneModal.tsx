import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../../common/water-master/dialog";
import { Input } from "../../../../common/Input";
import { Button } from "../../../../common/Button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { ToggleSwitch } from "../../../../common/ToggleSwitch";

interface Zone {
  ZoneID: number;
  Description: string;
  DescriptionEnglish: string;
  SequenceNo: number;
  IsActive: boolean;
}

interface AddZoneModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newDescription: string;
  setNewDescription: (v: string) => void;
  newDescriptionEnglish: string;
  setNewDescriptionEnglish: (v: string) => void;
  newSequenceNo: string;
  setNewSequenceNo: (v: string) => void;
  newZoneActive: boolean;
  setNewZoneActive: (v: boolean) => void;
  handleAddZone: () => void;
  zones: Zone[];
  editingZoneId: number | null;
  setEditingZoneId: (id: number | null) => void;
  editingDescription: string;
  setEditingDescription: (v: string) => void;
  editingDescriptionEnglish: string;
  setEditingDescriptionEnglish: (v: string) => void;
  editingSequenceNo: string;
  setEditingSequenceNo: (v: string) => void;
  editingZoneActive: boolean;
  setEditingZoneActive: (v: boolean) => void;
  handleEditZone: (zone: Zone) => void;
  handleSaveEditZone: () => void;
  handleCancelEditZone: () => void;
  deleteZone: (id: number) => void;
  toast: any;
  confirmDeleteToast: (cb: () => void) => void;
  refreshAll?: () => Promise<void>;
}

const AddZoneModal: React.FC<AddZoneModalProps> = ({
  open,
  onOpenChange,
  newDescription,
  setNewDescription,
  newDescriptionEnglish,
  setNewDescriptionEnglish,
  newSequenceNo,
  setNewSequenceNo,
  newZoneActive,
  setNewZoneActive,
  handleAddZone,
  zones,
  editingZoneId,
  setEditingZoneId,
  editingDescription,
  setEditingDescription,
  editingDescriptionEnglish,
  setEditingDescriptionEnglish,
  editingSequenceNo,
  setEditingSequenceNo,
  editingZoneActive,
  setEditingZoneActive,
  handleEditZone,
  handleSaveEditZone,
  handleCancelEditZone,
  deleteZone,
  toast,
  confirmDeleteToast,
  refreshAll,
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const entriesPerPage = 4;
  const totalPages = Math.ceil(zones.length / entriesPerPage);
  const paginatedZones = zones.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  React.useEffect(() => {
    // Reset to first page if zones change and current page is out of range
    if (currentPage > totalPages) setCurrentPage(1);
  }, [zones.length, totalPages]);

  return (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="bg-white rounded-2xl shadow-2xl border-0 w-[95vw] sm:w-[90vw] md:max-w-2xl p-0 max-h-[85vh] overflow-hidden flex flex-col">
      <DialogHeader className="px-6 pt-6 pb-2 border-b border-gray-100 bg-gradient-to-br from-blue-50 via-white to-transparent">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 rounded-xl shadow-lg">
            <Plus className="h-5 w-5 text-white" />
          </div>
          <div>
            <DialogTitle className="text-[#005A9C] text-base sm:text-lg font-semibold">Manage Zones</DialogTitle>
            <DialogDescription className="text-xs text-gray-500">Add, edit or manage zones</DialogDescription>
          </div>
        </div>
      </DialogHeader>
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/30">
        <div className="space-y-2">
          <div className="flex flex-col md:flex-row gap-2 w-full">
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
                checked={typeof newZoneActive === 'undefined' ? true : newZoneActive}
                onChange={() => setNewZoneActive(!newZoneActive)}
                label={typeof newZoneActive === 'undefined' ? 'Active' : (newZoneActive ? 'Active' : 'Inactive')}
              />
            </div>
          </div>
          <button
            onClick={handleAddZone}
            type="button"
            className="w-full mt-2 bg-[#005A9C] hover:bg-[#004080] text-white font-semibold rounded-lg h-10 flex items-center justify-center gap-2 text-sm transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Zone
          </button>
        </div>
      </div>
      <div className="px-6 pt-4 pb-2 flex-1 overflow-y-auto">
        <div className="font-semibold text-xs mb-2">EXISTING ZONES ({zones.length})</div>
        <div className="border border-blue-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#005A9C] text-white">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold border border-gray-200">Sr.</th>
                <th className="px-3 py-2 text-left text-xs font-semibold border border-gray-200">Description</th>
                <th className="px-3 py-2 text-left text-xs font-semibold border border-gray-200">Description (English)</th>
                <th className="px-3 py-2 text-left text-xs font-semibold border border-gray-200">Sequence No</th>
                <th className="px-3 py-2 text-center text-xs font-semibold border border-gray-200">Status</th>
                <th className="px-3 py-2 text-center text-xs font-semibold border border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {zones.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-xs text-gray-400 py-4">No zones found.</td>
                </tr>
              ) : (
                paginatedZones.map((zone, idx) => (
                  <tr key={zone.ZoneID} className="border-b last:border-b-0 hover:bg-blue-50 transition-colors">
                    <td className="px-3 py-2 text-xs border border-gray-200">{(currentPage - 1) * entriesPerPage + idx + 1}</td>
                    <td className="px-3 py-2 text-xs font-medium text-gray-800 border border-gray-200">
                      {editingZoneId === zone.ZoneID ? (
                        <Input
                          type="text"
                          value={editingDescription}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingDescription(e.target.value)}
                          className="h-8 text-sm border-gray-300 flex-1"
                        />
                      ) : (
                        zone.Description
                      )}
                    </td>
                    <td className="px-3 py-2 text-xs font-medium text-gray-800 border border-gray-200">
                      {editingZoneId === zone.ZoneID ? (
                        <Input
                          type="text"
                          value={editingDescriptionEnglish}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingDescriptionEnglish(e.target.value)}
                          className="h-8 text-sm border-gray-300 flex-1"
                        />
                      ) : (
                        zone.DescriptionEnglish
                      )}
                    </td>
                    <td className="px-3 py-2 text-xs font-medium text-gray-800 border border-gray-200">
                      {editingZoneId === zone.ZoneID ? (
                        <Input
                          type="number"
                          value={editingSequenceNo}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingSequenceNo(e.target.value)}
                          className="h-8 text-sm border-gray-300 flex-1"
                        />
                      ) : (
                        zone.SequenceNo
                      )}
                    </td>
                    <td className="px-3 py-2 text-center border border-gray-200">
                      {editingZoneId === zone.ZoneID ? (
                        <ToggleSwitch
                          checked={editingZoneActive}
                          onChange={() => setEditingZoneActive(!editingZoneActive)}
                          label={editingZoneActive ? 'Active' : 'Inactive'}
                        />
                      ) : (
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${zone.IsActive ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`}>
                          {zone.IsActive ? 'Active' : 'Inactive'}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-center border border-gray-200">
                      {editingZoneId === zone.ZoneID ? (
                        <>
                          <Button size="sm" className="h-8 px-2 bg-green-500 text-white" onClick={handleSaveEditZone}>Save</Button>
                          <Button size="sm" className="h-8 px-2 bg-gray-300" onClick={handleCancelEditZone}>Cancel</Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditZone(zone)}
                            className="h-7 px-2 text-blue-600 hover:bg-blue-50"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => confirmDeleteToast(() => deleteZone(zone.ZoneID))}
                            className="h-7 px-2 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
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
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
        <Button
          onClick={() => onOpenChange(false)}
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
export default AddZoneModal;
