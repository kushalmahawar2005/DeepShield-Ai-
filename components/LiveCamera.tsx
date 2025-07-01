import React, { useState, useRef, useEffect, useCallback } from 'react';

interface LiveCameraProps {
  onAnalysisComplete: (result: any) => void;
  isActive?: boolean;
}

const LiveCamera: React.FC<LiveCameraProps> = ({ onAnalysisComplete, isActive = true }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>();
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [detectionResult, setDetectionResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [frameCount, setFrameCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isCameraSupported, setIsCameraSupported] = useState(true);

  const analyzeFrame = useCallback(async (imageBlob: Blob) => {
    if (isAnalyzing) return;

    setIsAnalyzing(true);
    setFrameCount(prev => prev + 1);

    try {
      // Simulate frame analysis (replace with real API call)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockResult = {
        is_deepfake: Math.random() > 0.8,
        confidence: Math.random() * 100,
        score: Math.random(),
        features_analyzed: Math.floor(Math.random() * 10) + 5,
        timestamp: new Date().toISOString(),
        frame_number: frameCount + 1
      };

      setDetectionResult(mockResult);
      onAnalysisComplete(mockResult);
    } catch (error) {
      console.error('Frame analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [isAnalyzing, frameCount, onAnalysisComplete]);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      console.log('Starting camera...');
      
      // Check if camera is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('Camera API not supported');
        setIsCameraSupported(false);
        setError('Camera is not supported in this browser');
        return;
      }

      console.log('Requesting camera permissions...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      console.log('Camera stream obtained:', stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
        setError(null);
        console.log('Camera started successfully');
      }
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      setError(error.message || 'Failed to access camera');
      setIsStreaming(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setDetectionResult(null);
    setFrameCount(0);
    setError(null);
  }, []);

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isStreaming) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Check if video is ready
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob for analysis
    canvas.toBlob(async (blob) => {
      if (blob) {
        await analyzeFrame(blob);
      }
    }, 'image/jpeg', 0.8);
  }, [isStreaming, analyzeFrame]);

  const startAnalysis = useCallback(() => {
    if (!isStreaming) return;

    const analyzeFrameLoop = () => {
      if (isStreaming && isActive) {
        captureFrame();
        animationRef.current = requestAnimationFrame(analyzeFrameLoop);
      }
    };

    analyzeFrameLoop();
  }, [isStreaming, isActive, captureFrame]);

  const stopAnalysis = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  useEffect(() => {
    if (isActive && !isStreaming) {
      startCamera();
    } else if (!isActive && isStreaming) {
      stopCamera();
    }
  }, [isActive, isStreaming, startCamera, stopCamera]);

  useEffect(() => {
    if (isActive && isStreaming) {
      startAnalysis();
    } else {
      stopAnalysis();
    }

    return () => stopAnalysis();
  }, [isActive, isStreaming, startAnalysis, stopAnalysis]);

  useEffect(() => {
    return () => {
      stopCamera();
      stopAnalysis();
    };
  }, [stopCamera, stopAnalysis]);

  // Auto-start camera when component mounts
  useEffect(() => {
    if (isActive && isCameraSupported) {
      startCamera();
    }
  }, [isActive, isCameraSupported, startCamera]);

  return (
    <div className="relative">
      {/* Camera Feed */}
      <div className="relative bg-background-secondary rounded-lg overflow-hidden">
        {!isCameraSupported ? (
          <div className="w-full h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4">📷</div>
              <p className="text-gray-300">Camera not supported</p>
              <p className="text-sm text-gray-400">Please use a modern browser with camera support</p>
            </div>
          </div>
        ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-64 object-cover"
            onLoadedMetadata={() => {
              // Video is ready
            }}
            onError={() => {
              setError('Failed to load camera feed');
            }}
          />
        )}
        
        {/* Error Message */}
        {error && (
          <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
            <div className="text-center bg-background/90 p-4 rounded-lg">
              <div className="text-red-400 mb-2">⚠️</div>
              <p className="text-red-300 text-sm">{error}</p>
              <button 
                onClick={startCamera}
                className="mt-2 px-3 py-1 bg-accent text-background rounded text-xs hover:bg-accent-dark"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        
        {/* Analysis Overlay */}
        {detectionResult && !error && (
          <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg p-3 border border-accent">
            <div className="flex items-center space-x-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${
                detectionResult.is_deepfake ? 'bg-red-500' : 'bg-green-500'
              } animate-pulse`}></div>
              <span className="text-sm font-semibold text-white">
                {detectionResult.is_deepfake ? 'Deepfake Detected' : 'Authentic'}
              </span>
            </div>
            <div className="text-xs text-gray-300">
              Confidence: {detectionResult.confidence.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-300">
              Frame: {detectionResult.frame_number}
            </div>
          </div>
        )}

        {/* Camera Status */}
        <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-1">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              isStreaming ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="text-xs text-white">
              {isStreaming ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Analysis Indicator */}
        {isAnalyzing && !error && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <span className="text-sm text-white">Analyzing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera Controls */}
      <div className="mt-4 flex justify-center space-x-4">
        <button
          onClick={isStreaming ? stopCamera : startCamera}
          disabled={!isCameraSupported}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
            isStreaming 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-accent hover:bg-accent-dark text-background'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isStreaming ? 'Stop Camera' : 'Start Camera'}
        </button>
        
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span>Frame: {frameCount}</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-background-secondary rounded-lg">
        <h4 className="text-sm font-semibold mb-2 text-white">Live Camera Detection</h4>
        <div className="text-xs text-gray-400 space-y-1">
          <p>&bull; Camera will automatically start when you click &quot;Start Live Detection&quot;</p>
          <p>&bull; Analysis runs in real-time on each frame</p>
          <p>&bull; Results show confidence scores and detection status</p>
          <p>&bull; Click &quot;Stop Camera&quot; to end the session</p>
        </div>
      </div>
    </div>
  );
};

export default LiveCamera; 