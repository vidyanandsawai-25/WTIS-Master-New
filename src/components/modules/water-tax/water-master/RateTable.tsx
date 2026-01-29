/**
 * Water Rate Table Component
 * Clean, reusable table component with proper separation of concerns
 */

import { Checkbox } from "@/components/common/water-master/checkbox";
import { Badge } from "@/components/common/water-master/badge";
import { Button } from "@/components/common/water-master/button";
import { WaterRate } from "@/lib/constants/waterRates";
import { CheckCircle2, X } from "lucide-react";
import { EditButton, DeleteButton } from "@/components/common/ActionButtons";
import { ToggleSwitch } from "@/components/common/ToggleSwitch";

interface RateTableProps {
  rates: WaterRate[];
  selectedRows: number[];
  startIndex: number;
  onSelectAll: () => void;
  onSelectRow: (id: number) => void;
  onEdit: (rate: WaterRate) => void;
  onToggleStatus: (id: number) => void;
  translations: {
    srNo: string;
    zoneNo: string;
    wardNo: string;
    tableCategory: string;
    tableConnectionType: string;
    tableTapSize: string;
    tableRatePerKL: string;
    tableAnnualRate: string;
    tableMinCharge: string;
    tableMeterPenalty: string;
    tableStatus: string;
    tableActions: string;
    active: string;
    inactive: string;
    edit: string;
    disable: string;
    enable: string;
  };
  translateCategory: (category: string) => string;
  translateConnectionType: (type: string) => string;
}

export function RateTable({
  rates,
  selectedRows,
  startIndex,
  onSelectAll,
  onSelectRow,
  onEdit,
  onToggleStatus,
  translations: t,
  translateCategory,
  translateConnectionType,
}: RateTableProps) {
  const allSelected = rates.length > 0 && selectedRows.length === rates.length;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-primary to-primary-light text-white">
          <tr>
            <th className="px-3 py-2.5 text-center text-xs w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onSelectAll}
                className="border-white"
              />
            </th>
            <th className="px-2 py-2 text-center text-xs">{t.srNo}</th>
            <th className="px-2 py-2 text-center text-xs">{t.zoneNo}</th>
            <th className="px-2 py-2 text-center text-xs">{t.wardNo}</th>
            <th className="px-2 py-2 text-center text-xs">{t.tableCategory}</th>
            <th className="px-2 py-2 text-center text-xs">{t.tableConnectionType}</th>
            <th className="px-2 py-2 text-center text-xs">{t.tableTapSize}</th>
            <th className="px-2 py-2 text-center text-xs">{t.tableRatePerKL}</th>
            <th className="px-2 py-2 text-center text-xs">{t.tableAnnualRate}</th>
            <th className="px-2 py-2 text-center text-xs">{t.tableMinCharge}</th>
            <th className="px-2 py-2 text-center text-xs">{t.tableMeterPenalty}</th>
            <th className="px-2 py-2 text-center text-xs">{t.tableStatus}</th>
            <th className="px-2 py-2 text-center text-xs">{t.tableActions}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rates.map((rate, index) => (
            <RateTableRow
              key={rate.id}
              rate={rate}
              index={startIndex + index}
              isSelected={selectedRows.includes(rate.id)}
              isEven={index % 2 === 0}
              onSelect={() => onSelectRow(rate.id)}
              onEdit={() => onEdit(rate)}
              onToggleStatus={() => onToggleStatus(rate.id)}
              translations={t}
              translateCategory={translateCategory}
              translateConnectionType={translateConnectionType}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface RateTableRowProps {
  rate: WaterRate;
  index: number;
  isSelected: boolean;
  isEven: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onToggleStatus: () => void;
  translations: RateTableProps["translations"];
  translateCategory: (category: string) => string;
  translateConnectionType: (type: string) => string;
}

function RateTableRow({
  rate,
  index,
  isSelected,
  isEven,
  onSelect,
  onEdit,
  onToggleStatus,
  translations: t,
  translateCategory,
  translateConnectionType,
}: RateTableRowProps) {
  const bgClass = isSelected
    ? "bg-blue-50"
    : isEven
    ? "bg-white"
    : "bg-gray-50/50";

  return (
    <tr className={`${bgClass} hover:bg-blue-50 transition-colors`}>
      <td className="px-2 py-2 text-center">
        <Checkbox checked={isSelected} onCheckedChange={onSelect} />
      </td>
      <td className="px-2 py-2 text-xs text-gray-700 text-center">{index + 1}</td>
      <td className="px-2 py-2 text-xs text-gray-700 text-center font-medium">{rate.zoneNo}</td>
      <td className="px-2 py-2 text-xs text-gray-700 text-center font-medium">{rate.wardNo}</td>
      <td className="px-2 py-2 text-xs text-gray-900 text-center">{translateCategory(rate.category)}</td>
      <td className="px-2 py-2 text-xs text-gray-700 text-center">{translateConnectionType(rate.connectionType)}</td>
      <td className="px-2 py-2 text-xs text-gray-700 text-center">{rate.tapSize}</td>
      <td className="px-2 py-2 text-center text-xs text-gray-900">
        {rate.ratePerKL > 0 ? `₹${rate.ratePerKL}` : "-"}
      </td>
      <td className="px-2 py-2 text-center text-xs text-gray-900">
        {rate.annualFlatRate > 0 ? `₹${rate.annualFlatRate}` : "-"}
      </td>
      <td className="px-2 py-2 text-center text-xs text-gray-900">₹{rate.minimumCharge}</td>
      <td className="px-2 py-2 text-center text-xs text-gray-900">
        {rate.meterOffPenalty > 0 ? `₹${rate.meterOffPenalty}` : "-"}
      </td>
      <td className="px-2 py-2 text-center">
        {rate.status === "Active" ? (
          <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 hover:from-green-600 hover:to-green-700 shadow-sm text-[10px]">
            <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
            {t.active}
          </Badge>
        ) : (
          <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 hover:from-red-600 hover:to-red-700 shadow-sm text-[10px]">
            <X className="h-2.5 w-2.5 mr-1" />
            {t.inactive}
          </Badge>
        )}
      </td>
      <td className="px-2 py-2">
        <div className="flex items-center justify-center gap-1">
          <EditButton onClick={onEdit} title={t.edit} />
          <ToggleSwitch checked={rate.status === "Active"} onChange={onToggleStatus} label={rate.status === "Active" ? t.active : t.inactive} />
        </div>
      </td>
    </tr>
  );
}
