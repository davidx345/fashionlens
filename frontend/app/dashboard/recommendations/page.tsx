"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Loader2, AlertTriangle, Shirt } from "lucide-react";
import { getOutfitRecommendations, submitRecommendationFeedback, OutfitRecommendation, RecommendedItem } from "@/app/api/services/recommendation-service";

const RecommendationCard = ({
  recommendation,
  onFeedback,
  isLoadingFeedback,
}: {
  recommendation: OutfitRecommendation;
  onFeedback: (recommendationId: string, liked: boolean) => void;
  isLoadingFeedback: boolean;
}) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const fullImageUrl = recommendation.image_url?.startsWith("http") 
    ? recommendation.image_url 
    : recommendation.image_url ? `${API_URL}${recommendation.image_url}` : undefined;

  return (
    <Card className="w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader className="p-0 relative aspect-[3/4]">
        {fullImageUrl ? (
          <Image 
            src={fullImageUrl} 
            alt={recommendation.name} 
            layout="fill" 
            objectFit="cover" 
            className="bg-muted"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
              // You might want to show a placeholder div or icon here if the parent doesn't handle it
              const placeholder = e.currentTarget.parentElement?.querySelector(".image-placeholder");
              if (placeholder) (placeholder as HTMLElement).style.display = "flex";
            }}
          />
        ) : null} 
        {/* Fallback visible if fullImageUrl is undefined or if onError hides the Image component */}
        {(!fullImageUrl) && (
          <div className="image-placeholder w-full h-full bg-muted flex items-center justify-center">
            <Shirt className="w-24 h-24 text-muted-foreground" />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl font-semibold truncate" title={recommendation.name}>
          {recommendation.name}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground mt-1 h-10 overflow-hidden text-ellipsis">
          {recommendation.description || "No description available."}
        </CardDescription>
        <div className="mt-3">
          <h4 className="text-xs font-semibold text-muted-foreground mb-1">ITEMS:</h4>
          {recommendation.items && recommendation.items.length > 0 ? (
            <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
              {recommendation.items.map((item: RecommendedItem, index: number) => (
                <li key={index} className="truncate">{item.name} ({item.category})</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground">No specific items listed.</p>
          )}
        </div>
        {recommendation.score !== undefined && (
           <p className="text-sm font-semibold text-primary mt-3">Score: {recommendation.score.toFixed(1)} / 10</p>
        )}
      </CardContent>
      <CardFooter className="p-4 flex justify-end space-x-2 border-t pt-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onFeedback(recommendation.id, true)} 
          disabled={isLoadingFeedback}
          className="text-green-600 border-green-600 hover:bg-green-50"
        >
          <ThumbsUp className="w-4 h-4 mr-1.5" /> Like
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onFeedback(recommendation.id, false)} 
          disabled={isLoadingFeedback}
          className="text-red-600 border-red-600 hover:bg-red-50"
        >
          <ThumbsDown className="w-4 h-4 mr-1.5" /> Dislike
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<OutfitRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<{ [key: string]: boolean }>({});
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchRecommendations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedRecommendations = await getOutfitRecommendations();
      setRecommendations(fetchedRecommendations);    } catch (err: unknown) {
      setError((err as Error).message || "Failed to fetch recommendations.");
      console.error("Failed to fetch recommendations:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const handleFeedback = async (recommendationId: string, liked: boolean) => {
    setFeedbackStatus(prev => ({ ...prev, [recommendationId]: true }));
    setFeedbackMessage(null);
    try {
      await submitRecommendationFeedback(recommendationId, liked);
      setRecommendations(prev => prev.filter(rec => rec.id !== recommendationId)); 
      setFeedbackMessage({ type: "success", message: `Feedback submitted for ${liked ? "liked" : "disliked"} item!` });    } catch (err: unknown) {
      console.error("Failed to submit feedback:", err);
      setFeedbackMessage({ type: "error", message: `Failed to submit feedback. ${(err as Error).message}` });
    } finally {
      setFeedbackStatus(prev => ({ ...prev, [recommendationId]: false }));
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold md:text-3xl">Outfit Recommendations</h1>
          <p className="text-muted-foreground mt-2">
            Discover new outfit ideas tailored for you. Like or dislike to improve future suggestions.
          </p>
        </div>
      </div>

      {feedbackMessage && (
        <div className={`p-3 rounded-md text-sm mb-4 ${feedbackMessage.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
          {feedbackMessage.message}
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center text-center p-12 min-h-[300px]">
          <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
          <p className="text-xl font-semibold text-foreground">Loading recommendations...</p>
          <p className="text-muted-foreground">Please wait a moment.</p>
        </div>
      )}

      {error && !isLoading && (
        <Card className="w-full max-w-3xl mx-auto shadow-xl border-destructive/50 bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-xl flex items-center text-destructive">
              <AlertTriangle className="w-6 h-6 mr-3" /> Error Loading Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive-foreground">{error}</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={fetchRecommendations}>
              Try Again
            </Button>
          </CardFooter>
        </Card>
      )}

      {!isLoading && !error && recommendations.length === 0 && (
        <div className="text-center py-12">
          <Shirt className="w-24 h-24 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground">No recommendations available right now.</h3>
          <p className="text-muted-foreground mt-2">
            Check back later or try analyzing more outfits to get personalized suggestions.
          </p>
        </div>
      )}

      {!isLoading && !error && recommendations.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recommendations.map(rec => (
            <RecommendationCard 
              key={rec.id} 
              recommendation={rec} 
              onFeedback={handleFeedback} 
              isLoadingFeedback={feedbackStatus[rec.id] || false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
