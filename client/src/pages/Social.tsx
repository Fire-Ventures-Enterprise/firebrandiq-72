import { SocialMediaDashboard } from "@/components/social/SocialMediaDashboard";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export default function Social() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    // Handle OAuth callback
    const connected = searchParams.get('connected');
    const username = searchParams.get('username');
    const error = searchParams.get('error');

    if (connected) {
      toast({
        title: "Connection Successful!",
        description: `${connected.charAt(0).toUpperCase() + connected.slice(1)} account @${username} connected successfully.`,
      });
      // Clear the query params
      setSearchParams({});
    } else if (error) {
      toast({
        title: "Connection Failed",
        description: `Failed to connect account: ${error}`,
        variant: "destructive",
      });
      // Clear the query params
      setSearchParams({});
    }
  }, [searchParams, setSearchParams, toast]);

  return <SocialMediaDashboard />;
}