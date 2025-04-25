
import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { CDR } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileAudio, ExternalLink } from "lucide-react";

interface CallTableProps {
  cdrs: CDR[];
  isLoading: boolean;
}

export const CallTable = ({ cdrs, isLoading }: CallTableProps) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(cdrs.length / rowsPerPage);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return [
      hours > 0 ? `${hours}h` : null,
      minutes > 0 ? `${minutes}m` : null,
      `${remainingSeconds}s`
    ]
      .filter(Boolean)
      .join(" ");
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy h:mm a");
  };

  const startIdx = (page - 1) * rowsPerPage;
  const endIdx = Math.min(startIdx + rowsPerPage, cdrs.length);
  const displayedCDRs = cdrs.slice(startIdx, endIdx);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-blue-light/30 mb-4" />
          <div className="h-4 w-32 bg-blue-light/30 rounded mb-2" />
          <div className="h-3 w-24 bg-blue-light/30 rounded" />
        </div>
      </div>
    );
  }

  if (cdrs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-500">No call records found</p>
        <p className="text-sm text-gray-400">Try adjusting your search filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-gray-200">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Call ID</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead className="hidden md:table-cell">Start Time</TableHead>
              <TableHead className="hidden md:table-cell">Duration</TableHead>
              <TableHead className="hidden lg:table-cell">Hangup By</TableHead>
              <TableHead className="hidden lg:table-cell">Room</TableHead>
              <TableHead className="text-right">Recording</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedCDRs.map((cdr) => (
              <TableRow key={cdr.call_id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  <Link to={`/call/${cdr.call_id}`} className="text-blue-dark hover:underline flex items-center">
                    {cdr.call_id}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </TableCell>
                <TableCell>{cdr.from_user}</TableCell>
                <TableCell>{cdr.to_user}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(cdr.start_time)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDuration(cdr.duration_seconds)}
                </TableCell>
                <TableCell className="hidden lg:table-cell">{cdr.hangup_by}</TableCell>
                <TableCell className="hidden lg:table-cell">{cdr.room}</TableCell>
                <TableCell className="text-right">
                  <Link to={`/call/${cdr.call_id}`}>
                    <Button variant="ghost" size="sm">
                      <FileAudio className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Play</span>
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-2 bg-white border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing {startIdx + 1} to {endIdx} of {cdrs.length} calls
          </div>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === page ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(pageNum)}
                className={pageNum === page ? "bg-blue-dark" : ""}
              >
                {pageNum}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallTable;
