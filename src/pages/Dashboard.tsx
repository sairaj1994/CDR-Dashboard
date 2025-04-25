
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { CallTable } from "@/components/CallTable";
import { VisualizeData } from "@/components/VisualizeData";
import { useCDRData } from "@/hooks/useCDRData";
import { CDRSearchParams } from "@/types";

const Dashboard = () => {
  const [searchParams, setSearchParams] = useState<CDRSearchParams>({});
  const { cdrs, summary, isLoading, error } = useCDRData(searchParams);

  const handleSearch = (params: CDRSearchParams) => {
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Call Analytics Dashboard</h1>
        
        {/* Visualizations */}
        <div className="mb-8">
          <VisualizeData summary={summary} isLoading={isLoading} />
        </div>
        
        {/* Search */}
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        {/* Table */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Call Records</h2>
          {error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : (
            <CallTable cdrs={cdrs} isLoading={isLoading} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
