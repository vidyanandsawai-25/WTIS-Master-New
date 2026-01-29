"use client";

import { Header } from "../../components/layout/Header";
import { default as WTISManagement } from "@/components/modules/water-tax/water-master/WTISManagement";
// import BillingCycleMaster from "@/components/modules/water-tax/water-master/BillingCycleMaster";
import type { BackendRate } from "@/lib/api/apiService";
import type { Language } from "./page";
import React, { useState } from "react";


interface WaterMasterClientPageProps {
  language: Language;
  waterRates: BackendRate[];
}

export default function WaterMasterClientPage({ language, waterRates }: WaterMasterClientPageProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(language);

  // Map BackendRate to table row format expected by WTISManagement, with guards
  const mappedRates = (waterRates ?? [])
    .filter(rate => !!rate)
    .map((rate, idx) => ({
      id: rate?.rateID ?? idx,
      zoneNo: rate?.zoneName || rate?.zoneCode || "",
      wardNo: rate?.wardName || rate?.wardCode || "",
      category: rate?.categoryName || "",
      connectionType: rate?.connectionTypeName || "",
      tapSize: rate?.tapSize || "",
      ratePerKL: rate?.rate ?? rate?.perLiter ?? "",
      annualFlatRate: rate?.rate ?? "",
      minimumCharge: rate?.minimumCharge ?? "",
      meterOffPenalty: rate?.meterOffPenalty ?? "",
      status: rate?.isActive ? "Active" : "Inactive",
      // ...add more fields if needed
    }));

  // Dummy user info, replace with real data as needed
  const userName = "Suresh Patil";
  const userRole = "Water Department Engineer";

  const handleLogout = () => {
    // Implement logout logic here
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col">
      <Header
        language={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        waterRates={mappedRates}
        username={userName}
      />
      <WTISManagement language={language} waterRates={mappedRates} />
      
    </div>
  );
}
