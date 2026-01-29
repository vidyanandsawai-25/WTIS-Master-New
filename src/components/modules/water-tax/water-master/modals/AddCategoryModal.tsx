import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../../common/water-master/dialog";
import { Input } from "../../../../common/Input";
import { Button } from "../../../../common/Button";
import { categoryActions } from "@/app/water-master/waterRateActions";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { confirmDeleteToast } from "@/components/common/confirmDeleteToast";
import { ToggleSwitch } from "../../../../common/ToggleSwitch";

interface AddCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newDescription: string;
  setNewDescription: (v: string) => void;
  newDescriptionEnglish: string;
  setNewDescriptionEnglish: (v: string) => void;
  newSequenceNo: string;
  setNewSequenceNo: (v: string) => void;
  newStatus: boolean;
  setNewStatus: (v: boolean) => void;
  addCategory: (desc: string, descEng: string, seqNo: number, isActive: boolean) => Promise<void>;
  updateCategory: (id: number, data: { Description: string; DescriptionEnglish: string; SequenceNo: number; IsActive: boolean; UpdatedBy: number }) => Promise<void>;
  refreshAll?: () => Promise<void>;
  categories: any[];
  handleDeleteCategory: (id: number) => Promise<void>;
  toast: any;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  open,
  onOpenChange,
  newDescription,
  setNewDescription,
  newDescriptionEnglish,
  setNewDescriptionEnglish,
  newSequenceNo,
  setNewSequenceNo,
  newStatus,
  setNewStatus,
  addCategory,
  refreshAll,
  categories,
  handleDeleteCategory,
  toast,
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const entriesPerPage = 4;
  const totalPages = Math.ceil(categories.length / entriesPerPage);
  const paginatedCategories = categories.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingCategoryValue, setEditingCategoryValue] = useState("");
  const [editingCategoryDescEng, setEditingCategoryDescEng] = useState("");
  const [editingCategorySeqNo, setEditingCategorySeqNo] = useState("");
  const [editingCategoryStatus, setEditingCategoryStatus] = useState(true);

  // This function is called when edit button is clicked
  const handleEditCategory = (cat: any) => {
    setEditingCategoryId(cat.ConnectionCategoryID);
    setEditingCategoryValue(cat.Description || "");
    setEditingCategoryDescEng(cat.DescriptionEnglish || "");
    setEditingCategorySeqNo(cat.SequenceNo?.toString() || "");
    setEditingCategoryStatus(typeof cat.IsActive !== 'undefined' ? !!cat.IsActive : true);
  };

  // Save the edited category
  const handleSaveEditCategory = async () => {
    if (!editingCategoryValue.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    if (!editingCategoryDescEng.trim()) {
      toast.error("Description (English) is required");
      return;
    }
    if (!editingCategorySeqNo.trim() || isNaN(Number(editingCategorySeqNo))) {
      toast.error("Valid Sequence No is required");
      return;
    }
    if (editingCategoryId == null) {
      toast.error("No category selected for editing.");
      return;
    }
    try {
      const UpdatedBy = (window as any)?.userId || 1;
      await categoryActions.updateCategory(editingCategoryId, {
        Description: editingCategoryValue,
        DescriptionEnglish: editingCategoryDescEng,
        SequenceNo: Number(editingCategorySeqNo),
        IsActive: editingCategoryStatus,
        UpdatedBy,
      });
      setEditingCategoryId(null);
      setEditingCategoryValue("");
      setEditingCategoryDescEng("");
      setEditingCategorySeqNo("");
      setEditingCategoryStatus(true);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update category.");
    }
  };

  const handleCancelEditCategory = () => {
    setEditingCategoryId(null);
    setEditingCategoryValue("");
    setEditingCategoryDescEng("");
    setEditingCategorySeqNo("");
    setEditingCategoryStatus(true);
  };
  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [categories.length, totalPages]);

  return (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="bg-white rounded-2xl shadow-2xl border-0 w-[95vw] sm:w-[90vw] md:max-w-2xl p-0 max-h-[85vh] overflow-hidden flex flex-col">
      <DialogHeader className="px-6 pt-6 pb-2 border-b border-gray-100 bg-gradient-to-br from-blue-50 via-white to-transparent">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 rounded-xl shadow-lg">
            <Plus className="h-5 w-5 text-white" />
          </div>
          <div>
            <DialogTitle className="text-[#005A9C] text-base sm:text-lg font-semibold">Manage Categories</DialogTitle>
            <DialogDescription className="text-xs text-gray-500">Add, edit or manage categories</DialogDescription>
          </div>
        </div>
      </DialogHeader>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!newDescription.trim()) {
            toast.error("Description is required");
            return;
          }
          if (!newDescriptionEnglish.trim()) {
            toast.error("Description (English) is required");
            return;
          }
          if (!newSequenceNo.trim() || isNaN(Number(newSequenceNo))) {
            toast.error("Valid Sequence No is required");
            return;
          }
          try {
            await addCategory(newDescription.trim(), newDescriptionEnglish.trim(), Number(newSequenceNo), newStatus);
            toast.success(`Category "${newDescription}" added successfully!`);
            setNewDescription("");
            setNewDescriptionEnglish("");
            setNewSequenceNo("");
            if (typeof refreshAll === 'function') await refreshAll();
          } catch (err: any) {
            toast.error(err?.message || "Failed to add category.");
          }
        }}
        className="px-6 pt-4 pb-2 flex flex-col gap-2 border-b border-gray-200 bg-white"
      >
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
            className="w-32 h-10 text-sm border-gray-300"
            placeholder="Sequence No"
            value={newSequenceNo}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSequenceNo(e.target.value)}
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
          type="submit"
          className="w-full mt-2 bg-[#005A9C] hover:bg-[#004080] text-white font-semibold rounded-lg h-10 flex items-center justify-center gap-2 text-sm transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </form>
      <div className="px-6 pt-4 pb-2 flex-1 overflow-y-auto">
        <div className="font-semibold text-xs mb-2">EXISTING CATEGORIES ({categories.length})</div>
        <div className="border border-blue-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#005A9C] text-white">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold border border-gray-200">Sr.</th>
                <th className="px-3 py-2 text-left text-xs font-semibold border border-gray-200">Category Name</th>
                <th className="px-3 py-2 text-left text-xs font-semibold border border-gray-200">Description</th>
                <th className="px-3 py-2 text-left text-xs font-semibold border border-gray-200">Sequence No</th>
                <th className="px-3 py-2 text-center text-xs font-semibold border border-gray-200">Status</th>
                <th className="px-3 py-2 text-center text-xs font-semibold border border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-xs text-gray-400 py-4">No categories found.</td>
                </tr>
              ) : (
                paginatedCategories.map((cat, idx) => (
                  editingCategoryId === cat.ConnectionCategoryID ? (
                    <tr key={cat.ConnectionCategoryID} className="border-b last:border-b-0 bg-yellow-50">
                      <td className="px-3 py-2 text-xs border border-gray-200">{(currentPage - 1) * entriesPerPage + idx + 1}</td>
                      <td className="px-3 py-2 text-xs border border-gray-200">
                        <Input
                          className="h-8 text-xs border-gray-300"
                          value={editingCategoryValue}
                          onChange={e => setEditingCategoryValue(e.target.value)}
                          placeholder="Category Name"
                        />
                      </td>
                      <td className="px-3 py-2 text-xs border border-gray-200">
                        <Input
                          className="h-8 text-xs border-gray-300"
                          value={editingCategoryDescEng}
                          onChange={e => setEditingCategoryDescEng(e.target.value)}
                          placeholder="Description (English)"
                        />
                      </td>
                      <td className="px-3 py-2 text-xs border border-gray-200">
                        <Input
                          className="h-8 text-xs border-gray-300"
                          value={editingCategorySeqNo}
                          onChange={e => setEditingCategorySeqNo(e.target.value)}
                          placeholder="Sequence No"
                        />
                      </td>
                      <td className="px-3 py-2 text-center border border-gray-200">
                        <ToggleSwitch
                          checked={editingCategoryStatus}
                          onChange={() => setEditingCategoryStatus(!editingCategoryStatus)}
                          label={editingCategoryStatus ? 'Active' : 'Inactive'}
                        />
                      </td>
                      <td className="px-3 py-2 text-center border border-gray-200 flex gap-1 justify-center">
                        <Button size="sm" variant="primary" className="h-7 px-2" onClick={handleSaveEditCategory}>Save</Button>
                        <Button size="sm" variant="outline" className="h-7 px-2" onClick={handleCancelEditCategory}>Cancel</Button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={cat.ConnectionCategoryID} className="border-b last:border-b-0 hover:bg-blue-50 transition-colors">
                      <td className="px-3 py-2 text-xs border border-gray-200">{(currentPage - 1) * entriesPerPage + idx + 1}</td>
                      <td className="px-3 py-2 text-xs font-medium text-gray-800 border border-gray-200">{cat.Description}</td>
                      <td className="px-3 py-2 text-xs text-gray-500 border border-gray-200">{cat.DescriptionEnglish}</td>
                      <td className="px-3 py-2 text-xs text-gray-500 border border-gray-200">{cat.SequenceNo}</td>
                      <td className="px-3 py-2 text-center border border-gray-200">
                        <span className={`inline-block w-2 h-2 rounded-full mr-1 align-middle ${cat.IsActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        <span className={`text-xs font-semibold align-middle ${cat.IsActive ? 'text-green-700' : 'text-gray-500'}`}>{cat.IsActive ? 'Active' : 'Inactive'}</span>
                      </td>
                      <td className="px-3 py-2 text-center border border-gray-200">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditCategory(cat)}
                          className="h-7 px-2 text-blue-600 hover:bg-blue-50"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => { confirmDeleteToast(() => handleDeleteCategory(cat.ConnectionCategoryID)); }}
                          className="h-7 px-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  )
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
export default AddCategoryModal;
