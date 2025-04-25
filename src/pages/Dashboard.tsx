import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { CallTable } from "@/components/CallTable";
import { VisualizeData } from "@/components/VisualizeData";
import { useCDRData } from "@/hooks/useCDRData";
import { CDRSearchParams } from "@/types";
import { Button } from "@/components/ui/button";
import { Download, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";

const Dashboard = () => {
  const [searchParams, setSearchParams] = useState<CDRSearchParams>({});
  const { cdrs, summary, isLoading, error } = useCDRData(searchParams);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined
  });

  const handleDateSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from) {
      setSearchParams({
        ...searchParams,
        from_date: range.from.toISOString(),
        to_date: range.to?.toISOString(),
      });
    }
  };

  const handleSearch = (params: CDRSearchParams) => {
    setSearchParams(params);
  };

  const exportToCSV = () => {
    try {
      // Convert CDR data to CSV format
      const headers = ['Call ID', 'From', 'To', 'Start Time', 'End Time', 'Duration (s)', 'Hangup By', 'Room'];
      const rows = cdrs.map(cdr => [
        cdr.call_id,
        cdr.from_user,
        cdr.to_user,
        cdr.start_time,
        cdr.end_time,
        cdr.duration_seconds,
        cdr.hangup_by,
        cdr.room
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `call_records_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Call records exported successfully");
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error("Failed to export call records");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Call Analytics Dashboard</h1>
          <div className="flex gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Select date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={handleDateSelect}
                  numberOfMonths={2}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <Button 
              onClick={exportToCSV} 
              disabled={isLoading || cdrs.length === 0}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export to CSV
            </Button>
          </div>
        </div>
        
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
