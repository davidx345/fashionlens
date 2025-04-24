import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'react-feather';

const ResultsPage = () => {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/analysis/${id}`);
        if (response.data && response.data.analysis) {
          setAnalysis(response.data.analysis);
        } else {
          setError('Invalid analysis data received');
        }
      } catch (err) {
        console.error('Error fetching analysis:', err);
        setError('Failed to load analysis results');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="spinner-border text-blue-500" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-4">Analyzing your outfit...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-900 text-white p-4 rounded-lg">
          <p>{error || 'No analysis data available'}</p>
          <Link to="/" className="text-blue-300 mt-4 inline-block">Try again</Link>
        </div>
      </div>
    );
  }

  // Ensure all required properties exist with default values
  const {
    style = { description: 'Not available', score: 0 },
    color = { description: 'Not available', score: 0 },
    occasion = { description: 'Not available', score: 0 },
    overall_score = 0,
    suggestions = ['No suggestions available'],
  } = analysis;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="flex items-center text-blue-500 mb-6">
        <ArrowLeft size={20} className="mr-2" />
        Back to Upload
      </Link>
      
      <h1 className="text-3xl font-bold mb-6">Your Outfit Analysis</h1>
      
      <div className="bg-navy-800 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column - Scores */}
          <div className="md:w-full">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Overall Score</h2>
              <div className="bg-navy-700 rounded-full h-4 mb-2">
                <div 
                  className="bg-blue-500 h-4 rounded-full" 
                  style={{ width: `${overall_score * 10}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <span>0</span>
                <span className="font-bold">{overall_score}/10</span>
                <span>10</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Style Score */}
              <div className="bg-navy-700 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Style</h3>
                <div className="flex justify-between">
                  <span>{style.description}</span>
                  <span className="font-bold">{style.score}/10</span>
                </div>
              </div>
              
              {/* Color Score */}
              <div className="bg-navy-700 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Color</h3>
                <div className="flex justify-between">
                  <span>{color.description}</span>
                  <span className="font-bold">{color.score}/10</span>
                </div>
              </div>
              
              {/* Occasion */}
              <div className="bg-navy-700 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Occasion</h3>
                <div className="flex justify-between">
                  <span>{occasion.description}</span>
                  <span className="font-bold">{occasion.score}/10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Suggestions */}
      <div className="bg-navy-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Suggestions</h2>
        <ul className="list-disc pl-5 space-y-2">
          {suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResultsPage;