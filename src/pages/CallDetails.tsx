
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCDRData } from "@/hooks/useCDRData";
import { CDR } from "@/types";
import { Navbar } from "@/components/Navbar";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Clock, Calendar, User, Users, Home } from "lucide-react";
import { format } from "date-fns";

const CallDetails = () => {
  const { call_id } = useParams<{ call_id: string }>();
  const [callDetails, setCallDetails] = useState<CDR | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { cdrs } = useCDRData();

  useEffect(() => {
    const fetchCallDetails = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call to fetch a specific CDR
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        const call = cdrs.find((c) => c.call_id === call_id);
        if (call) {
          setCallDetails(call);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    if (call_id && cdrs.length > 0) {
      fetchCallDetails();
    }
  }, [call_id, cdrs]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return [
      hours > 0 ? `${hours} hours` : null,
      minutes > 0 ? `${minutes} minutes` : null,
      `${remainingSeconds} seconds`
    ]
      .filter(Boolean)
      .join(" ");
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM d, yyyy");
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "h:mm a");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-80 bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!callDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Call Not Found</h1>
            <p className="mb-6">
              The call record you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-2">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Call Details</h1>
          <p className="text-gray-500">Call ID: {callDetails.call_id}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <AudioPlayer 
              audioUrl={callDetails.recording_url || ""} 
              title="Call Recording" 
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Call Information</CardTitle>
              <CardDescription>Detailed information about this call</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-3 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">From</p>
                  <p className="font-medium">{callDetails.from_user}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-3 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">To</p>
                  <p className="font-medium">{callDetails.to_user}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-3 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Date & Time</p>
                  <p className="font-medium">
                    {formatDate(callDetails.start_time)}, {formatTime(callDetails.start_time)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-3 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Duration</p>
                  <p className="font-medium">{formatDuration(callDetails.duration_seconds)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Home className="h-5 w-5 mr-3 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Room</p>
                  <p className="font-medium">{callDetails.room}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Call Ended By</p>
                <div className="bg-gray-100 px-3 py-2 rounded-md">
                  {callDetails.hangup_by}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CallDetails;
