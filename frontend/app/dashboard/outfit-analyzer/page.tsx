"use client";

import { useState, useEffect } from 'react';
import { FileUploader } from '@/components/ui/file-uploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Palette, Ruler, Lightbulb, CheckCircle, AlertTriangle } from 'lucide-react';
import { analyzeOutfit, AnalysisResult } from '@/app/api/services/analysis-service';

export default function OutfitAnalyzerPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    // Clean up object URL when component unmounts or previewUrl changes
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    // Clear previous results immediately when starting new analysis
    setAnalysisResult(null);
    setError(null);
    setIsLoading(true);

    // Clean up previous preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(newPreviewUrl);

    try {
      const result = await analyzeOutfit(file);
      // Map the backend response to the expected frontend interface
      setAnalysisResult({ 
        ...result, 
        fileName: file.name, 
        imageUrl: newPreviewUrl 
      });
    } catch (err: any) {
      console.error("Outfit analysis failed:", err);
      setError(err.message || "Failed to analyze outfit. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setUploadedFile(null);
    setAnalysisResult(null);
    setError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };  // Helper to render score sections
  const renderScoreSection = (title: string, Icon: React.ElementType, scoreData: string | number | undefined, displayFormat: 'outOf10' | 'outOf100' | 'percentage' | 'string' = 'string') => {
    let displayValue: string;

    if (typeof scoreData === 'number') {
      if (displayFormat === 'outOf10') {
        displayValue = `${Math.round(scoreData)}/10`;
      } else if (displayFormat === 'outOf100') {
        displayValue = `${Math.round(scoreData)}/100`;
      } else if (displayFormat === 'percentage') {
        displayValue = `${Math.round(scoreData)}%`;
      } else {
        displayValue = scoreData.toString();
      }
    } else if (typeof scoreData === 'string') {
      displayValue = scoreData;
    } else {
      displayValue = "N/A"; // Handle undefined or unexpected types
    }
    
    return (
      <Card className="bg-card/50">
        <CardHeader className="flex flex-row items-center space-x-3 pb-2">
          <Icon className="w-6 h-6 text-secondary" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold text-foreground">{displayValue}</p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold md:text-3xl">Outfit Analyzer</h1>
        <p className="text-muted-foreground mt-2">
          Upload your outfit photos here to get AI-powered analysis and feedback.
        </p>
      </div>

      {!analysisResult && !isLoading && !error && (
        <FileUploader 
          onFileUpload={handleFileUpload} 
          accept="image/jpeg, image/png, image/webp"
          maxSize={10 * 1024 * 1024} // 10MB
          currentFile={uploadedFile}
          previewUrl={previewUrl}
          onClear={previewUrl ? handleClear : undefined} // Show clear on fileUploader if preview exists
        />
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center text-center p-12 min-h-[300px]">
          <Sparkles className="w-16 h-16 text-primary animate-pulse mb-4" />
          <p className="text-xl font-semibold text-foreground">Analyzing {uploadedFile?.name || "your outfit"}...</p>
          <p className="text-muted-foreground">Please wait a moment.</p>
          {previewUrl && (
             <div className="mt-4 rounded-lg overflow-hidden border border-muted aspect-square max-w-[200px] mx-auto bg-muted/30">
               <img 
                 src={previewUrl} 
                 alt="Uploading outfit" 
                 className="w-full h-full object-contain"
               />
             </div>
          )}
        </div>
      )}

      {error && !isLoading && (
        <Card className="w-full max-w-3xl mx-auto shadow-xl border-destructive/50 bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-xl flex items-center text-destructive">
              <AlertTriangle className="w-6 h-6 mr-3" /> Analysis Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive-foreground">{error}</p>
            {previewUrl && (
              <div className="my-4 rounded-lg overflow-hidden border border-muted aspect-square max-w-xs mx-auto bg-muted/30">
                <img 
                  src={previewUrl} 
                  alt="Failed upload attempt" 
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={handleClear} className="w-full sm:w-auto">
              Try Another File
            </Button>
          </CardFooter>
        </Card>
      )}

      {analysisResult && !isLoading && !error && (
        <Card className="w-full max-w-3xl mx-auto shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Sparkles className="w-7 h-7 mr-3 text-primary" /> Your Outfit Analysis
            </CardTitle>
            <CardDescription>
              Detailed breakdown of your uploaded outfit: {analysisResult.fileName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {analysisResult.imageUrl && (
              <div className="my-4 rounded-lg overflow-hidden border border-muted aspect-square max-w-sm mx-auto bg-muted/30">
                <img 
                  src={analysisResult.imageUrl} 
                  alt={analysisResult.fileName || "Uploaded outfit"} 
                  className="w-full h-full object-contain"
                />
              </div>
            )}
              <div className="text-center p-6 rounded-lg bg-gradient-to-br from-primary/10 to-transparent border border-primary/30">
              <p className="text-sm font-medium text-muted-foreground">Overall Score</p>
              <p className="text-5xl font-extrabold text-primary">{analysisResult.results.overallScore !== undefined ? `${analysisResult.results.overallScore}/10` : 'N/A'}</p>
            </div>            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderScoreSection("Color Harmony", Palette, analysisResult.results.colorHarmony, 'percentage')}
              {renderScoreSection("Fit Rating", Ruler, analysisResult.results.fit, 'percentage')} 
              {renderScoreSection("Style", Lightbulb, analysisResult.results.style, 'string')}
              {analysisResult.results.sustainability && renderScoreSection("Sustainability", CheckCircle, analysisResult.results.sustainability.score, 'percentage')}
              {renderScoreSection("Body Shape", Lightbulb, analysisResult.results.bodyShape, 'string')}
            </div>

            {analysisResult.results.occasion && analysisResult.results.occasion.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center">
                  Suitable Occasions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.results.occasion.map((occ, index) => (
                    <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {occ}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {analysisResult.results.brands && analysisResult.results.brands.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center">
                  Detected Brands
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.results.brands.map((brand, index) => (
                    <span key={index} className="bg-accent/20 text-accent-foreground px-3 py-1 rounded-full text-sm">
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {analysisResult.results.fabrics && analysisResult.results.fabrics.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center">
                  Detected Fabrics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.results.fabrics.map((fabric, index) => (
                    <span key={index} className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm">
                      {fabric}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {analysisResult.results.recommendations && analysisResult.results.recommendations.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" /> Recommendations
                </h3>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground pl-2">
                  {analysisResult.results.recommendations.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button variant="outline" onClick={handleClear} className="w-full sm:w-auto">
              Analyze Another Outfit
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}