"use client";

import { useState, useEffect, useRef } from 'react';
import { MultiFileUploader } from '@/components/ui/multi-file-uploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Palette, Ruler, Lightbulb, CheckCircle, AlertTriangle, Images, BarChart3 } from 'lucide-react';
import { analyzeOutfit, AnalysisResult } from '@/app/api/services/analysis-service';

interface FileWithPreview extends File {
  id: string;
  preview: string;
}

interface AnalysisWithFile extends AnalysisResult {
  fileId: string;
  fileName: string;
  imageUrl: string;
}

export default function OutfitAnalyzerPage() {
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisWithFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);  const [error, setError] = useState<string | null>(null);
  const [currentAnalyzing, setCurrentAnalyzing] = useState<string | null>(null);
  const uploadedFilesRef = useRef<FileWithPreview[]>([]);
  
  // Update ref when uploadedFiles changes
  useEffect(() => {
    uploadedFilesRef.current = uploadedFiles;
  }, [uploadedFiles]);
    // Clean up object URLs only when component unmounts
  useEffect(() => {    return () => {
      uploadedFilesRef.current.forEach(file => {
        // Only revoke blob URLs (not backend URLs)
        if (file.preview && file.preview.startsWith('blob:')) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, []); // Empty dependency array - only runs on unmount

  const handleFilesUpload = async (newFiles: File[]) => {
    // Store original files separately and create preview objects
    const filesWithPreview: FileWithPreview[] = newFiles.map(file => {
      const fileWithPreview = Object.assign(file, {
        id: Math.random().toString(36).substr(2, 9),
        preview: URL.createObjectURL(file)
      });
      return fileWithPreview;
    });    setUploadedFiles(prev => [...prev, ...filesWithPreview]);
    setError(null);
  };

  const handleAnalyzeSelected = async () => {
    if (uploadedFiles.length === 0) {
      setError("Please upload at least one image to analyze.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Analyze each file sequentially to avoid overwhelming the server
      const newResults: AnalysisWithFile[] = [];
      
      for (const fileWithPreview of uploadedFiles) {
        // Only analyze files that haven't been analyzed yet
        const alreadyAnalyzed = analysisResults.some(result => result.fileId === fileWithPreview.id);
        if (alreadyAnalyzed) continue;

        setCurrentAnalyzing(fileWithPreview.id);
        try {
          // Create a clean File object to ensure proper FormData handling
          const cleanFile = new File([fileWithPreview], fileWithPreview.name, {
            type: fileWithPreview.type,
            lastModified: fileWithPreview.lastModified,
          });
            const result = await analyzeOutfit(cleanFile);
          newResults.push({
            ...result,
            fileId: fileWithPreview.id,
            fileName: fileWithPreview.name,
            // Use the backend's image URL if available, otherwise fallback to preview
            imageUrl: result.images && result.images.length > 0 ? result.images[0] : fileWithPreview.preview
          });
        } catch (err: any) {
          console.error(`Analysis failed for ${fileWithPreview.name}:`, err);
          // Continue with other files even if one fails
          setError(prev => prev ? `${prev}\nFailed to analyze ${fileWithPreview.name}: ${err.message}` : `Failed to analyze ${fileWithPreview.name}: ${err.message}`);
        }
      }

      setAnalysisResults(prev => [...prev, ...newResults]);
    } catch (err: any) {
      console.error("Batch outfit analysis failed:", err);
      setError(err.message || "Failed to analyze some outfits. Please try again.");
    } finally {
      setIsLoading(false);
      setCurrentAnalyzing(null);
    }
  };
  const handleRemoveFile = (fileId: string) => {
    const fileToRemove = uploadedFiles.find(f => f.id === fileId);
    const analysisToRemove = analysisResults.find(r => r.fileId === fileId);
    
    // Only revoke blob URL if it's not a backend URL (starts with blob:)
    if (fileToRemove && fileToRemove.preview && fileToRemove.preview.startsWith('blob:')) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    setAnalysisResults(prev => prev.filter(r => r.fileId !== fileId));
  };
  const handleClear = () => {
    uploadedFiles.forEach(file => {
      // Only revoke blob URLs (not backend URLs)
      if (file.preview && file.preview.startsWith('blob:')) {
        URL.revokeObjectURL(file.preview);
      }
    });
    
    setUploadedFiles([]);
    setAnalysisResults([]);
    setError(null);
    setCurrentAnalyzing(null);
  };// Helper to render individual analysis result
  const renderAnalysisResult = (analysis: AnalysisWithFile, index: number) => (
    <Card key={analysis.fileId} className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Sparkles className="w-6 h-6 mr-3 text-primary" /> 
          Outfit Analysis #{index + 1}
        </CardTitle>
        <CardDescription>
          Analysis for: {analysis.fileName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {analysis.imageUrl && (
          <div className="my-4 rounded-lg overflow-hidden border border-muted aspect-square max-w-sm mx-auto bg-muted/30">
            <img 
              src={analysis.imageUrl} 
              alt={analysis.fileName || "Uploaded outfit"} 
              className="w-full h-full object-contain"
            />
          </div>
        )}
        
        <div className="text-center p-6 rounded-lg bg-gradient-to-br from-primary/10 to-transparent border border-primary/30">
          <p className="text-sm font-medium text-muted-foreground">Overall Score</p>
          <p className="text-4xl font-extrabold text-primary">
            {analysis.results.overallScore !== undefined ? `${analysis.results.overallScore}/10` : 'N/A'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderScoreSection("Color Harmony", Palette, analysis.results.colorHarmony, 'percentage')}
          {renderScoreSection("Fit Rating", Ruler, analysis.results.fit, 'percentage')} 
          {renderScoreSection("Style", Lightbulb, analysis.results.style, 'string')}
          {analysis.results.sustainability && renderScoreSection("Sustainability", CheckCircle, analysis.results.sustainability.score, 'percentage')}
          {renderScoreSection("Body Shape", Lightbulb, analysis.results.bodyShape, 'string')}
        </div>

        {analysis.results.occasion && analysis.results.occasion.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-3">Suitable Occasions</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.results.occasion.map((occ, idx) => (
                <Badge key={idx} variant="secondary">{occ}</Badge>
              ))}
            </div>
          </div>
        )}

        {analysis.results.brands && analysis.results.brands.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-3">Detected Brands</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.results.brands.map((brand, idx) => (
                <Badge key={idx} variant="outline">{brand}</Badge>
              ))}
            </div>
          </div>
        )}

        {analysis.results.fabrics && analysis.results.fabrics.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-3">Detected Fabrics</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.results.fabrics.map((fabric, idx) => (
                <Badge key={idx} variant="secondary">{fabric}</Badge>
              ))}
            </div>
          </div>
        )}

        {analysis.results.recommendations && analysis.results.recommendations.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" /> Recommendations
            </h4>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground pl-2">
              {analysis.results.recommendations.map((recommendation, idx) => (
                <li key={idx}>{recommendation}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-6">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleRemoveFile(analysis.fileId)}
        >
          Remove This Analysis
        </Button>
      </CardFooter>
    </Card>
  );

  // Helper to render comparison summary
  const renderComparisonSummary = () => {
    if (analysisResults.length < 2) return null;

    const averageScore = analysisResults.reduce((sum, result) => 
      sum + (result.results.overallScore || 0), 0
    ) / analysisResults.length;

    const bestOutfit = analysisResults.reduce((best, current) => 
      (current.results.overallScore || 0) > (best.results.overallScore || 0) ? current : best
    );

    return (
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-6 h-6 mr-3 text-blue-600" />
            Comparison Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white/50 dark:bg-black/20 rounded-lg">
              <p className="text-sm text-muted-foreground">Average Score</p>
              <p className="text-2xl font-bold text-blue-600">{averageScore.toFixed(1)}/10</p>
            </div>
            <div className="text-center p-4 bg-white/50 dark:bg-black/20 rounded-lg">
              <p className="text-sm text-muted-foreground">Best Outfit</p>
              <p className="text-lg font-semibold truncate" title={bestOutfit.fileName}>
                {bestOutfit.fileName}
              </p>
              <p className="text-xl font-bold text-green-600">
                {bestOutfit.results.overallScore}/10
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
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
        <h1 className="text-2xl font-semibold md:text-3xl">Multi-Outfit Analyzer</h1>
        <p className="text-muted-foreground mt-2">
          Upload multiple outfit photos to get AI-powered analysis and compare your looks.
        </p>
      </div>      {/* File Upload Section */}
      {(!isLoading || uploadedFiles.length === 0) && (
        <MultiFileUploader
          onFilesUpload={handleFilesUpload}
          accept="image/jpeg, image/png, image/webp"
          maxSize={10 * 1024 * 1024} // 10MB
          maxFiles={5}
          currentFiles={uploadedFiles}
          onRemoveFile={handleRemoveFile}
          onClear={handleClear}
        />
      )}

      {/* Analyze Button Section */}
      {uploadedFiles.length > 0 && !isLoading && (
        <div className="flex justify-center">
          <Button 
            onClick={handleAnalyzeSelected}
            disabled={isLoading}
            size="lg"
            className="w-full sm:w-auto"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Analyze {uploadedFiles.length} {uploadedFiles.length === 1 ? 'Outfit' : 'Outfits'}
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
          <CardContent className="flex flex-col items-center justify-center text-center p-12">
            <Sparkles className="w-16 h-16 text-primary animate-pulse mb-4" />
            <p className="text-xl font-semibold text-foreground">
              Analyzing your outfits...
            </p>
            <p className="text-muted-foreground">
              {currentAnalyzing ? 
                `Processing ${uploadedFiles.find(f => f.id === currentAnalyzing)?.name || 'image'}...` :
                "Please wait while we analyze your images."
              }
            </p>
            <div className="mt-4 w-full max-w-md bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(analysisResults.length / uploadedFiles.length) * 100}%` 
                }}
              ></div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {analysisResults.length} of {uploadedFiles.length} completed
            </p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-xl flex items-center text-destructive">
              <AlertTriangle className="w-6 h-6 mr-3" /> Analysis Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive-foreground">{error}</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => setError(null)}>
              Dismiss
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Results Section */}
      {analysisResults.length > 0 && (
        <div className="space-y-6">
          {/* Comparison Summary */}
          {renderComparisonSummary()}

          {/* Results Tabs */}
          <Tabs defaultValue="grid" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grid" className="flex items-center gap-2">
                <Images className="w-4 h-4" />
                Grid View
              </TabsTrigger>
              <TabsTrigger value="comparison" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Detailed Comparison
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="grid" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {analysisResults.map((analysis, index) => renderAnalysisResult(analysis, index))}
              </div>
            </TabsContent>
            
            <TabsContent value="comparison" className="space-y-6">
              <div className="space-y-6">
                {analysisResults.map((analysis, index) => renderAnalysisResult(analysis, index))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={handleClear}>
              Clear All Results
            </Button>
            <Button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              variant="secondary"
            >
              Analyze More Outfits
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}