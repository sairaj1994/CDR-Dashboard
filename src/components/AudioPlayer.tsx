
import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";

interface AudioPlayerProps {
  audioUrl: string;
  title?: string;
}

export const AudioPlayer = ({ audioUrl, title }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // In a real app, we'd load the actual audio file
    // For this demo, we'll simulate loading
    const loadAudio = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsLoading(false);
      
      // Set a fake duration since we don't have a real audio file
      setDuration(180); // 3 minutes
    };
    
    loadAudio();
    
    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [audioUrl]);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const togglePlayPause = () => {
    if (isLoading) return;
    
    // In a real app, this would control the actual audio element
    setIsPlaying(!isPlaying);
    
    // Simulate audio playing by updating currentTime
    if (!isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime((prevTime) => {
          if (prevTime >= duration) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prevTime + 1;
        });
      }, 1000);
      
      // Store interval ID in a ref to clean it up when needed
      return () => clearInterval(interval);
    }
  };

  const handleSkipBack = () => {
    setCurrentTime(Math.max(0, currentTime - 10));
  };

  const handleSkipForward = () => {
    setCurrentTime(Math.min(duration, currentTime + 10));
  };

  const handleProgressChange = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
  };

  if (isLoading) {
    return (
      <Card className="w-full bg-white">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-blue-light/30 rounded w-1/2 mb-4"></div>
            <div className="flex justify-center items-center space-x-4">
              <div className="h-8 w-8 rounded-full bg-blue-light/30"></div>
              <div className="h-10 w-10 rounded-full bg-blue-light/30"></div>
              <div className="h-8 w-8 rounded-full bg-blue-light/30"></div>
            </div>
            <div className="h-2 bg-blue-light/30 rounded w-full mt-4"></div>
            <div className="flex justify-between mt-2">
              <div className="h-3 bg-blue-light/30 rounded w-10"></div>
              <div className="h-3 bg-blue-light/30 rounded w-10"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white">
      <CardContent className="p-4">
        <div>
          {title && <h3 className="font-medium text-lg mb-2">{title}</h3>}
          
          {/* Simulated audio element - would be real in production */}
          <audio ref={audioRef} className="hidden">
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          
          <div className="flex justify-center items-center space-x-4 my-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSkipBack}
              className="rounded-full"
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            
            <Button
              variant="default"
              size="icon"
              onClick={togglePlayPause}
              className="h-12 w-12 rounded-full bg-blue-dark hover:bg-blue-900"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-1" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSkipForward}
              className="rounded-full"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <div ref={progressBarRef} className="w-full">
              <Slider
                value={[currentTime]}
                max={duration}
                step={1}
                onValueChange={handleProgressChange}
                className="cursor-pointer"
              />
            </div>
            
            <div className="flex justify-between text-xs text-gray-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioPlayer;
