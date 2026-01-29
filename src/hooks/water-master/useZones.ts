import { useEffect, useState } from "react";

export interface Zone {
  ZoneID: number;
  Description: string;
  DescriptionEnglish: string;
  SequenceNo: number;
  IsActive: boolean;
}

export function useZones(reload?: any) {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5268/api/wtis/zone-master")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch zones");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data.items)) setZones(data.items);
        else setZones([]);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [reload]);

  return { zones, loading, error };
}
