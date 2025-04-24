import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload } from 'react-feather';
import axios from 'axios';

const AnalyzePage = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleTakePhoto = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check your device settings.');
    }
  };

  const handleCapture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
      setImage(file);
      setPreview(URL.createObjectURL(blob));
    });

    // Stop the camera stream
    const stream = video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    setIsCameraOpen(false);
  };

  const handleSubmit = async () => {
    if (!image) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await axios.post('http://localhost:5000/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Navigate to results page with the analysis ID
      navigate(`/results/${response.data.id}`);
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Failed to analyze image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-2">FashionLens</h1>

      <h2 className="text-3xl font-bold mb-2">Analyze Your Outfit</h2>
      <p className="text-gray-400 mb-8">Take a photo of your outfit to get ratings and suggestions</p>

      <div className="bg-navy-800 rounded-lg p-4 mb-8">
        <div className="flex justify-between mb-4">
          <button
            onClick={handleTakePhoto}
            className={`flex items-center justify-center w-1/2 py-3 ${
              !preview ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'
            }`}
          >
            <Camera className="mr-2" size={20} />
            Take Photo
          </button>

          <button
            onClick={handleUploadClick}
            className={`flex items-center justify-center w-1/2 py-3 ${
              preview ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'
            }`}
          >
            <Upload className="mr-2" size={20} />
            Upload Photo
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg"
            className="hidden"
          />
        </div>

        {isCameraOpen && (
          <div className="border border-dashed border-gray-600 rounded-lg h-96 flex items-center justify-center bg-navy-700">
            <video ref={videoRef} className="w-full h-full object-cover"></video>
            <button
              onClick={handleCapture}
              className="absolute bottom-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Capture
            </button>
          </div>
        )}

        {!isCameraOpen && (
          <div className="border border-dashed border-gray-600 rounded-lg h-96 flex items-center justify-center bg-navy-700">
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain" />
            ) : (
              <div className="text-center p-8">
                <div className="flex justify-center mb-4">
                  <Upload size={48} className="text-gray-500" />
                </div>
                <p className="text-gray-400 mb-2">Click to upload or drag and drop</p>
                <p className="text-gray-500 text-sm">PNG, JPG up to 10MB</p>
              </div>
            )}
          </div>
        )}

        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!image || isLoading}
        className={`w-full py-4 rounded-lg text-white font-medium ${
          image && !isLoading ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-600 cursor-not-allowed'
        }`}
      >
        {isLoading ? 'Analyzing...' : preview ? 'Analyze Outfit' : 'Select File'}
      </button>
    </div>
  );
};

export default AnalyzePage;