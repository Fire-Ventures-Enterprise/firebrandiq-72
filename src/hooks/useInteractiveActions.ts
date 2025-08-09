import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function useInteractiveActions() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleReply = (mentionId: string) => {
    toast({
      title: "Reply to Mention",
      description: "Opening reply composer...",
    });
    // Could open a modal or navigate to compose page
  };

  const handleSave = (mentionId: string) => {
    toast({
      title: "Mention Saved",
      description: "Added to your saved mentions",
    });
    // Implement save functionality
  };

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank');
    toast({
      title: "Opening External Link",
      description: "Redirecting to original source...",
    });
  };

  const handleFilters = () => {
    toast({
      title: "Filter Options",
      description: "Opening advanced filter settings...",
    });
  };

  const handleAcceptRecommendation = (id: string) => {
    setLoading(true);
    setTimeout(() => {
      toast({
        title: "Recommendation Accepted",
        description: "Added to your action items and calendar",
      });
      setLoading(false);
    }, 1000);
  };

  const handleViewDetails = (id: string) => {
    toast({
      title: "View Details",
      description: "Opening detailed recommendation analysis...",
    });
  };

  const handleDismissRecommendation = (id: string) => {
    toast({
      title: "Recommendation Dismissed",
      description: "This recommendation won't be shown again",
    });
  };

  return {
    loading,
    handleReply,
    handleSave,
    handleExternalLink,
    handleFilters,
    handleAcceptRecommendation,
    handleViewDetails,
    handleDismissRecommendation
  };
}