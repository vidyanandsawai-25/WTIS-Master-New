
import { useEffect, useState } from "react";
import apiService from "@/lib/api/apiService";

export interface Ward {
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

export function useWards(reload?: any) {
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  setLoading(true);
  apiService.getWards({ pageNumber: 1, pageSize: 1000 }) // <--- add pageSize
    .then((data) => {
      const items = Array.isArray(data?.items) ? data.items : [];
      setWards(items.map((w: any) => ({
        wardID: w.wardID,
        description: w.description || w.wardName || "",
        descriptionEnglish: w.descriptionEnglish || w.wardCode || "",
        zoneID: w.zoneID,
        sequenceNo: w.sequenceNo || w.SequenceNo || 0,
        isActive: typeof w.isActive === 'boolean' ? w.isActive : (w.isActive ?? true),
        createdBy: w.createdBy,
        createdDate: w.createdDate,
        updatedBy: w.updatedBy,
        updatedDate: w.updatedDate,
      })));
    })
    .catch((err) => setError(err.message))
    .finally(() => setLoading(false));
}, [reload]);

  return { wards, loading, error };
}
