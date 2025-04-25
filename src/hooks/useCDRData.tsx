import { useState, useEffect } from "react";
import { CDR, CDRSearchParams, CDRSummary } from "@/types";

// Mock CDR data - in a real application, this would come from a backend API
const generateMockCDRs = (count: number): CDR[] => {
  const users = ["John Smith", "Jane Doe", "Bob Johnson", "Alice Brown", "Charlie Wilson"];
  const rooms = ["Meeting Room 1", "Conference Call", "Sales Demo", "Support Call", "Interview"];
  
  return Array.from({ length: count }).map((_, index) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30));
    startDate.setHours(
      Math.floor(Math.random() * 12) + 8, // Between 8 AM and 8 PM
      Math.floor(Math.random() * 60),
      Math.floor(Math.random() * 60)
    );
    
    const durationSeconds = Math.floor(Math.random() * 3600) + 60; // 1 min to 1 hour
    const endDate = new Date(startDate.getTime() + durationSeconds * 1000);
    
    const fromUser = users[Math.floor(Math.random() * users.length)];
    const toUser = users[Math.floor(Math.random() * users.length)];
    
    // Make sure fromUser and toUser are different
    const actualToUser = fromUser === toUser 
      ? users[(users.indexOf(toUser) + 1) % users.length]
      : toUser;
    
    return {
      call_id: `call-${(index + 1).toString().padStart(4, "0")}`,
      from_user: fromUser,
      to_user: actualToUser,
      start_time: startDate.toISOString(),
      end_time: endDate.toISOString(),
      duration_seconds: durationSeconds,
      hangup_by: Math.random() > 0.5 ? fromUser : actualToUser,
      room: rooms[Math.floor(Math.random() * rooms.length)],
      recording_url: `/recordings/call-${(index + 1).toString().padStart(4, "0")}.mp3`
    };
  });
};

// Generate 100 mock CDR records
const MOCK_CDRS = generateMockCDRs(100);

export const useCDRData = (searchParams: CDRSearchParams = {}) => {
  const [cdrs, setCDRs] = useState<CDR[]>([]);
  const [filteredCDRs, setFilteredCDRs] = useState<CDR[]>([]);
  const [summary, setSummary] = useState<CDRSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch CDR data
  useEffect(() => {
    const fetchCDRs = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setCDRs(MOCK_CDRS);
        setError(null);
      } catch (err) {
        console.error("Error fetching CDR data:", err);
        setError("Failed to fetch call records");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCDRs();
  }, []);

  // Apply search filters
  useEffect(() => {
    if (!cdrs.length) return;

    try {
      let filtered = [...cdrs];
      
      // Apply search filters
      if (searchParams.query) {
        const query = searchParams.query.toLowerCase();
        filtered = filtered.filter(
          cdr =>
            cdr.call_id.toLowerCase().includes(query) ||
            cdr.from_user.toLowerCase().includes(query) ||
            cdr.to_user.toLowerCase().includes(query) ||
            cdr.room.toLowerCase().includes(query) ||
            cdr.hangup_by.toLowerCase().includes(query)
        );
      }
      
      // Filter by date range
      if (searchParams.from_date) {
        const fromDate = new Date(searchParams.from_date);
        filtered = filtered.filter(
          cdr => new Date(cdr.start_time) >= fromDate
        );
      }
      
      if (searchParams.to_date) {
        const toDate = new Date(searchParams.to_date);
        // Set the time to 23:59:59
        toDate.setHours(23, 59, 59, 999);
        filtered = filtered.filter(
          cdr => new Date(cdr.start_time) <= toDate
        );
      }
      
      if (searchParams.from_user) {
        filtered = filtered.filter(
          cdr => cdr.from_user.toLowerCase().includes(searchParams.from_user!.toLowerCase())
        );
      }
      
      if (searchParams.to_user) {
        filtered = filtered.filter(
          cdr => cdr.to_user.toLowerCase().includes(searchParams.to_user!.toLowerCase())
        );
      }
      
      if (searchParams.min_duration !== undefined) {
        filtered = filtered.filter(
          cdr => cdr.duration_seconds >= searchParams.min_duration!
        );
      }
      
      if (searchParams.max_duration !== undefined) {
        filtered = filtered.filter(
          cdr => cdr.duration_seconds <= searchParams.max_duration!
        );
      }
      
      if (searchParams.hangup_by) {
        filtered = filtered.filter(
          cdr => cdr.hangup_by.toLowerCase().includes(searchParams.hangup_by!.toLowerCase())
        );
      }
      
      if (searchParams.room) {
        filtered = filtered.filter(
          cdr => cdr.room.toLowerCase().includes(searchParams.room!.toLowerCase())
        );
      }
      
      // Sort by start_time descending (most recent first)
      filtered.sort((a, b) => 
        new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
      );
      
      setFilteredCDRs(filtered);
      
      // Generate summary data
      if (filtered.length) {
        const totalCalls = filtered.length;
        const totalDuration = filtered.reduce((sum, cdr) => sum + cdr.duration_seconds, 0);
        const avgDuration = Math.round(totalDuration / totalCalls);
        
        // Calculate average handling time (including wrap-up time - mock data)
        const avgHandlingTime = Math.round((totalDuration + (totalCalls * 30)) / totalCalls);

        // Group calls by date for chart data
        const callsByDay = filtered.reduce((acc: {[key: string]: number}, cdr) => {
          const date = new Date(cdr.start_time).toISOString().split('T')[0];
          if (!acc[date]) acc[date] = 0;
          acc[date]++;
          return acc;
        }, {});
        
        // Convert to array format for charting
        const callsByDayArray = Object.entries(callsByDay)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        // Find top users by call count
        const userCounts: {[key: string]: number} = {};
        filtered.forEach(cdr => {
          if (!userCounts[cdr.from_user]) userCounts[cdr.from_user] = 0;
          userCounts[cdr.from_user]++;
        });
        
        const topUsers = Object.entries(userCounts)
          .map(([username, call_count]) => ({ username, call_count }))
          .sort((a, b) => b.call_count - a.call_count)
          .slice(0, 5);
        
        // Create duration distribution
        const durationRanges = [
          { min: 0, max: 60, label: "< 1 min" },
          { min: 60, max: 300, label: "1-5 min" },
          { min: 300, max: 600, label: "5-10 min" },
          { min: 600, max: 1800, label: "10-30 min" },
          { min: 1800, max: 3600, label: "30-60 min" },
          { min: 3600, max: Infinity, label: "> 60 min" }
        ];
        
        const durationDistribution = durationRanges.map(range => {
          const count = filtered.filter(
            cdr => cdr.duration_seconds >= range.min && cdr.duration_seconds < range.max
          ).length;
          return { range: range.label, count };
        });
        
        setSummary({
          total_calls: totalCalls,
          total_duration: totalDuration,
          avg_duration: avgDuration,
          avg_handling_time: avgHandlingTime,
          calls_by_day: callsByDayArray,
          top_users: topUsers,
          call_duration_distribution: durationDistribution
        });
      }
    } catch (err) {
      console.error("Error filtering CDR data:", err);
      setError("Failed to process call records");
    }
  }, [cdrs, searchParams]);

  return {
    cdrs: filteredCDRs,
    summary,
    isLoading,
    error,
  };
};
