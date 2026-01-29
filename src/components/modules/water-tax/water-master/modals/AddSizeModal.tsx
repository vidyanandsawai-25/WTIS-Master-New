import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../../common/water-master/dialog";
import { useEffect } from "react";
import { Button } from "../../../../common/Button";
import { Input } from "../../../../common/Input";
import { ToggleSwitch } from "../../../../common/ToggleSwitch";
import { Edit2, Trash2 } from "lucide-react";

interface Size {
  PipeSizeID: number;
  DiameterMM: number;
  Description: string;
  DescriptionEnglish: string;
  SequenceNo: number;
  IsActive: boolean;
  CreatedBy: number;
  CreatedDate: string;
  UpdatedBy?: number;
  UpdatedDate?: string;
}

interface AddSizeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newSizeName: string;
  setNewSizeName: (v: string) => void;
  newDiameter: string;
  setNewDiameter: (v: string) => void;
  newStatus: boolean;
  setNewStatus: (v: boolean) => void;
  handleAddSize: () => void;
  tapSizes: Size[];
  sizeSearch: string;
  editingSizeId: number | null;
  editingSizeValue: string;
  setEditingSizeValue: (v: string) => void;
  editingDiameter: string;
  setEditingDiameter: (v: string) => void;
  editingStatus: boolean;
  setEditingStatus: (v: boolean) => void;
  handleEditSize: (size: Size) => void;
  handleSaveEditSize: () => void;
  handleCancelEditSize: () => void;
  confirmDeleteToast: (cb: () => void) => void;
  handleDeleteTapSize: (id: number) => void;
  t: any;
}

const AddSizeModal: React.FC<AddSizeModalProps> = ({
  open,
  onOpenChange,
  newSizeName,
  setNewSizeName,
  newDiameter,
  setNewDiameter,
  newStatus,
  setNewStatus,
  handleAddSize,
  tapSizes,
  sizeSearch,
  editingSizeId,
  editingSizeValue,
  setEditingSizeValue,
  editingDiameter,
  setEditingDiameter,
  editingStatus,
  setEditingStatus,
  handleEditSize,
  handleSaveEditSize,
  handleCancelEditSize,
  confirmDeleteToast,
  handleDeleteTapSize,
  t,
}) =>  {
 const [currentPage, setCurrentPage] = React.useState(1);
  const entriesPerPage = 4;
   const filteredSize = tapSizes.filter(size =>
  (size.Description || '').toLowerCase().includes((sizeSearch || '').toLowerCase())
);
  const totalPages = Math.ceil(filteredSize.length / entriesPerPage);
  const paginatedSize = filteredSize.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [filteredSize.length, totalPages]);


    return(
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="bg-white rounded-2xl shadow-2xl border-0 w-[95vw] sm:w-[90vw] md:max-w-2xl p-0 max-h-[85vh] overflow-hidden flex flex-col">
      <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100 bg-gradient-to-br from-purple-50 via-white to-transparent">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2.5 rounded-xl shadow-lg">
            <Edit2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <DialogTitle className="text-purple-700 text-base sm:text-lg mb-0.5">
              Manage Pipe Sizes
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Add, edit or manage pipe sizes
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>
      <div className="px-6 pt-4 pb-2 flex flex-col gap-2 border-b border-gray-200 bg-white">
        <div className="flex flex-col md:flex-row gap-2 w-full">
          <Input
            className="flex-1 h-10 text-sm border-gray-300"
            placeholder="Description"
            value={newSizeName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSizeName(e.target.value)}
            required
          />
          <Input
            className="flex-1 h-10 text-sm border-gray-300"
            placeholder="Diameter (MM)"
            type="number"
            value={newDiameter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDiameter(e.target.value)}
            required
          />
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-700">Status</span>
            <ToggleSwitch
              checked={typeof newStatus === 'undefined' ? true : newStatus}
              onChange={() => setNewStatus(!newStatus)}
              label={typeof newStatus === 'undefined' ? 'Active' : (newStatus ? 'Active' : 'Inactive')}
            />
          </div>
        </div>
        <button
          type="button"
          className="w-full mt-2 bg-[#005A9C] hover:bg-[#6d28d9] text-white font-semibold rounded-lg h-10 flex items-center justify-center gap-2 text-sm transition-colors"
          onClick={handleAddSize}
        >
          <Edit2 className="h-4 w-4" />
          Add Pipe Size
        </button>
      </div>
      <div className="px-6 py-4 overflow-y-auto flex-1">
        <div className="space-y-3">
          <label className="text-xs text-gray-600 font-semibold uppercase tracking-wide">
            EXISTING PIPE SIZES ({tapSizes.length})
          </label>
          <div className="border border-purple-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#005A9C] border-b border-purple-200">
                <tr>
                  <th className="px-2.5 py-2 text-left text-[10px] font-bold text-white uppercase tracking-wide w-16 border border-gray-200">Sr.</th>
                  {/* <th className="px-3 py-2 text-left text-[10px] font-bold text-white uppercase tracking-wide border border-gray-200">PipeSizeID</th> */}
                  <th className="px-2.5 py-2 text-left text-[10px] font-bold text-white uppercase tracking-wide border border-gray-200">Description</th>
                  <th className="px-2.5 py-2 text-left text-[10px] font-bold text-white uppercase tracking-wide border border-gray-200">DescriptionEnglish</th>
                  <th className="px-2.5 py-2 text-left text-[10px] font-bold text-white uppercase tracking-wide border border-gray-200">DiameterMM</th>
                  <th className="px-2.5 py-2 text-left text-[10px] font-bold text-white uppercase tracking-wide border border-gray-200">SequenceNo</th>
                  <th className="px-2.5 py-2 text-center text-[10px] font-bold text-white uppercase tracking-wide border border-gray-200">Status</th>
                  {/* <th className="px-3 py-2 text-left text-[10px] font-bold text-white uppercase tracking-wide border border-gray-200">CreatedBy</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-white uppercase tracking-wide border border-gray-200">CreatedDate</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-white uppercase tracking-wide border border-gray-200">UpdatedBy</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-white uppercase tracking-wide border border-gray-200">UpdatedDate</th> */}
                  <th className="px-2.5 py-2 text-center text-[10px] font-bold text-white uppercase tracking-wide w-20 border border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-purple-100">
                {paginatedSize
                  .map((size, index) => (
                    <tr key={`size-row-${size.PipeSizeID}`} className="hover:bg-purple-50 transition-colors group">
                      <td className="px-3 py-2.5 text-xs text-gray-700 font-medium border border-gray-200">{index + 1}</td>
                      {/* <td className="px-3 py-2.5 text-sm text-gray-800 font-medium border border-gray-200">{size.PipeSizeID}</td> */}
                      <td className="px-2.5 py-2.5 text-sm text-gray-800 font-medium border border-gray-200">{size.Description}</td>
                      <td className="px-2.5 py-2.5 text-sm text-gray-800 font-medium border border-gray-200">{size.DescriptionEnglish}</td>
                      <td className="px-2.5 py-2.5 text-sm text-gray-800 font-medium border border-gray-200">{size.DiameterMM}</td>
                      <td className="px-2.5 py-2.5 text-sm text-gray-800 font-medium border border-gray-200">{size.SequenceNo}</td>
                      <td className="px-2.5 py-2.5 text-center border border-gray-200">{size.IsActive ? 'Active' : 'Inactive'}</td>
                      {/* <td className="px-3 py-2.5 text-sm text-gray-800 font-medium border border-gray-200">{size.CreatedBy}</td>
                      <td className="px-3 py-2.5 text-sm text-gray-800 font-medium border border-gray-200">{size.CreatedDate}</td>
                      <td className="px-3 py-2.5 text-sm text-gray-800 font-medium border border-gray-200">{size.UpdatedBy}</td>
                      <td className="px-3 py-2.5 text-sm text-gray-800 font-medium border border-gray-200">{size.UpdatedDate}</td> */}
                      <td className="px-2.5 py-2.5 text-center flex gap-1 justify-center border border-gray-200">
                        <Button
                          onClick={() => handleEditSize(size)}
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-purple-600 hover:bg-purple-100 hover:text-purple-700"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          onClick={() => confirmDeleteToast(() => handleDeleteTapSize(size.PipeSizeID))}
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-red-600 hover:bg-red-100 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
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
export default AddSizeModal;
