import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import LiveCamera from '../components/LiveCamera';
import BatchUpload from '../components/BatchUpload';

interface AnalysisResult {
  is_deepfake: boolean;
  confidence: number;
  score: number;
  features_analyzed: number;
  analysis_summary?: string[];
  timestamp?: string;
  frame_number?: number;
  risk_level?: 'low' | 'medium' | 'high';
  ai_generation_indicators?: string[];
  explainability?: string;
}

interface UploadJob {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  result?: any;
  error?: string;
}

type AnalysisMode = 'upload' | 'url' | 'camera' | 'batch' | 'telegram';

// --- Utility Functions for Scoring, Indicators, and Classification ---

// Normalize model score (0-1 or 0-255) to 0-100
function normalizeScore(rawScore: number, min: number = 0, max: number = 1): number {
  // Clamp and scale
  const clamped = Math.max(min, Math.min(rawScore, max));
  return ((clamped - min) / (max - min)) * 100;
}

// Classify confidence into label and color
function classifyConfidence(confidence: number) {
  if (confidence < 40) {
    return { label: 'Deepfake', color: 'text-red-500', icon: '🚨' };
  } else if (confidence < 70) {
    return { label: 'Suspicious', color: 'text-yellow-500', icon: '⚠️' };
  } else {
    return { label: 'Likely Authentic', color: 'text-green-500', icon: '✅' };
  }
}

// Generate dynamic AI indicators based on detection results
function getDynamicIndicators(detections: {
  symmetryScore?: number;
  lightingInconsistency?: boolean;
  textureArtifacts?: boolean;
  [key: string]: any;
}, confidence?: number): string[] {
  // If confidence is high (authentic), show only the clean message
  if (confidence !== undefined && confidence >= 70) {
    return ['No obvious artifact detected.'];
  }
  const indicators: string[] = [];
  if (detections.symmetryScore !== undefined && detections.symmetryScore < 0.85) {
    indicators.push('Unnatural facial symmetry detected');
  }
  if (detections.lightingInconsistency) {
    indicators.push('Inconsistent lighting patterns');
  }
  if (detections.textureArtifacts) {
    indicators.push('Suspicious texture artifacts');
  }
  if (indicators.length === 0) {
    indicators.push('No obvious artifact detected.');
  }
  return indicators;
}

// Generate explainability text
function getExplainability(confidence: number, indicators: string[]): string {
  if (confidence < 40) {
    return 'The model detected strong signs of manipulation, such as facial asymmetry or texture artifacts.';
  } else if (confidence < 70) {
    return 'Some suspicious patterns were found, but not enough to confirm a deepfake.';
  } else {
    return 'No significant signs of manipulation were detected. Content is likely authentic.';
  }
}

const AnalyzePage: React.FC = () => {
  const [activeMode, setActiveMode] = useState<AnalysisMode>('upload');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [liveResults, setLiveResults] = useState<AnalysisResult[]>([]);
  const [batchResults, setBatchResults] = useState<UploadJob[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setUploadedFile(files[0]);
      setError(null);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadedFile(files[0]);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (activeMode === 'upload' && !uploadedFile) {
      setError('Please upload a file');
      return;
    }
    if (activeMode === 'url' && !urlInput.trim()) {
      setError('Please enter a URL');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate model output (replace with real model output in production)
      const rawModelScore = Math.random(); // 0-1
      const detections = {
        symmetryScore: Math.random(), // 0-1
        lightingInconsistency: Math.random() > 0.7,
        textureArtifacts: Math.random() > 0.6,
      };

      // Normalize score
      const confidence = normalizeScore(rawModelScore);

      // Classify
      const { label, color, icon } = classifyConfidence(confidence);

      // Dynamic indicators
      const aiIndicators = getDynamicIndicators(detections, confidence);

      // Explainability
      const explainability = getExplainability(confidence, aiIndicators);

      const mockResult: AnalysisResult = {
        is_deepfake: confidence < 40,
        confidence,
        score: rawModelScore,
        features_analyzed: 15,
        risk_level: confidence < 40 ? 'high' : confidence < 70 ? 'medium' : 'low',
        ai_generation_indicators: aiIndicators,
        analysis_summary: [
          `Model Score: ${(rawModelScore * 100).toFixed(1)}%`,
          `Symmetry Score: ${(detections.symmetryScore * 100).toFixed(1)}%`,
          `Lighting Inconsistency: ${detections.lightingInconsistency ? 'Yes' : 'No'}`,
          `Texture Artifacts: ${detections.textureArtifacts ? 'Yes' : 'No'}`
        ],
        explainability,
        timestamp: new Date().toISOString()
      };

      setResult(mockResult);
    } catch (err) {
      setError('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLiveAnalysisComplete = (rawResult: AnalysisResult) => {
    // Assume rawResult.score is the raw model output (0-1)
    const confidence = normalizeScore(rawResult.score);
    const aiIndicators = getDynamicIndicators({}, confidence);
    const explainability = getExplainability(confidence, aiIndicators);
    const result: AnalysisResult = {
      ...rawResult,
      confidence,
      is_deepfake: confidence < 40,
      risk_level: confidence < 40 ? 'high' : confidence < 70 ? 'medium' : 'low',
      ai_generation_indicators: aiIndicators,
      explainability,
    };
    setLiveResults(prev => [...prev.slice(-9), result]);
    setResult(result);
  };

  const handleBatchAnalysisComplete = (results: UploadJob[]) => {
    setBatchResults(results);
    const deepfakesDetected = results.filter(job => job.result?.is_deepfake).length;
    const totalFiles = results.length;
    const avgRawScore = results.reduce((sum, job) => sum + (job.result?.score || 0), 0) / totalFiles;
    const confidence = normalizeScore(avgRawScore);
    const aiIndicators = getDynamicIndicators({}, confidence);
    const explainability = getExplainability(confidence, aiIndicators);

    setResult({
      is_deepfake: confidence < 40,
      confidence,
      score: avgRawScore,
      features_analyzed: results.reduce((sum, job) => sum + (job.result?.features_analyzed || 0), 0),
      risk_level: confidence < 40 ? 'high' : confidence < 70 ? 'medium' : 'low',
      ai_generation_indicators: aiIndicators,
      analysis_summary: [
        `📊 Batch Analysis Complete`,
        `• Files Processed: ${totalFiles}`,
        `• Deepfakes Detected: ${deepfakesDetected}`,
        `• Success Rate: ${((totalFiles - results.filter(job => job.status === 'error').length) / totalFiles * 100).toFixed(1)}%`,
        `• Risk Level: ${confidence < 40 ? 'High' : confidence < 70 ? 'Medium' : 'Low'}`
      ],
      explainability,
      timestamp: new Date().toISOString()
    });
  };

  const handleCameraToggle = () => {
    setIsCameraActive(!isCameraActive);
    if (isCameraActive) {
      setLiveResults([]);
      setResult(null);
    }
  };

  // Download the current result as a .txt file
  const handleDownloadReport = () => {
    if (!result) return;
    const lines = [
      `Deepfake Detection Report`,
      `========================`,
      `Result: ${classifyConfidence(result.confidence).label}`,
      `Confidence: ${result.confidence.toFixed(1)}%`,
      `Risk Level: ${result.risk_level?.toUpperCase()}`,
      `Timestamp: ${result.timestamp ? new Date(result.timestamp).toLocaleString() : ''}`,
      ``,
      `AI Generation Indicators:`,
      ...(result.ai_generation_indicators || []),
      ``,
      `Explainability:`,
      result.explainability || '',
      ``,
      `Analysis Details:`,
      ...(result.analysis_summary || []),
      ``,
      `Features Analyzed: ${result.features_analyzed}`,
      `Detection Score: ${(result.score * 100).toFixed(1)}%`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deepfake_report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Share the result using the Web Share API or copy to clipboard
  const handleShareResults = async () => {
    if (!result) return;
    const shareText = [
      `Deepfake Detection Result: ${classifyConfidence(result.confidence).label}`,
      `Confidence: ${result.confidence.toFixed(1)}%`,
      `Risk Level: ${result.risk_level?.toUpperCase()}`,
      ...(result.ai_generation_indicators || []),
      result.explainability ? `\n${result.explainability}` : '',
      `\nTry it yourself at: https://your-app-url.com`
    ].join('\n');

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Deepfake Detection Result',
          text: shareText,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareText);
      alert('Result copied to clipboard!');
    }
  };

  const renderUploadMode = () => (
    <div className="space-y-6">
      {/* File Upload */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4 text-white">Upload File</h3>
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
            isDragOver 
              ? 'border-accent bg-accent/10' 
              : 'border-gray-600 hover:border-accent'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-4xl mb-4">📁</div>
          <p className="text-gray-300 mb-4">
            Drag and drop your file here, or click to browse
          </p>
          <input
            type="file"
            accept="image/*,video/*,audio/*"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="btn-secondary cursor-pointer">
            Choose File
          </label>
          
          {uploadedFile && (
            <div className="mt-4 p-3 bg-background-secondary rounded-lg">
              <p className="text-sm text-gray-300">
                Selected: {uploadedFile.name}
              </p>
            </div>
          )}
        </div>

        {/* Supported Formats */}
        <div className="mt-4 p-4 bg-background-secondary rounded-lg">
          <h4 className="text-sm font-semibold mb-2 text-white">Supported Formats</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-400">
            <div>🖼️ Images: JPG, PNG, JPEG</div>
            <div>🎥 Videos: MP4, AVI, MOV</div>
            <div>🎵 Audio: WAV, MP3, M4A</div>
          </div>
        </div>
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing || !uploadedFile}
        className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAnalyzing ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Analyzing...
          </div>
        ) : (
          'Analyze File'
        )}
      </button>
    </div>
  );

  const renderUrlMode = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-xl font-semibold mb-4 text-white">Analyze from URL</h3>
        <div className="space-y-4">
          <input
            type="url"
            placeholder="Enter image, video, or audio URL"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-accent focus:outline-none"
          />
      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing || !urlInput.trim()}
        className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
            {isAnalyzing ? 'Analyzing...' : 'Analyze URL'}
          </button>
        </div>
          </div>
    </div>
  );

  const renderCameraMode = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-xl font-semibold mb-4 text-white">Live Camera Detection</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 mb-2">
          Real-time deepfake detection using your webcam
        </p>
              <p className="text-sm text-gray-400">
                Camera will automatically start when you click the button below
              </p>
      </div>
      <button
        onClick={handleCameraToggle}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
          isCameraActive 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
            : 'btn-primary'
        }`}
      >
              {isCameraActive ? 'Stop Camera' : 'Start Live Detection'}
      </button>
          </div>
          
          {isCameraActive && (
            <LiveCamera onAnalysisComplete={handleLiveAnalysisComplete} />
          )}

          {!isCameraActive && (
            <div className="text-center py-8 bg-background-secondary rounded-lg">
              <div className="text-4xl mb-4">📹</div>
              <p className="text-gray-300 mb-2">Camera Detection Ready</p>
              <p className="text-sm text-gray-400">
                Click &quot;Start Live Detection&quot; to begin real-time analysis
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderBatchMode = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-xl font-semibold mb-4 text-white">Batch Upload</h3>
        <BatchUpload onAnalysisComplete={handleBatchAnalysisComplete} />
      </div>
    </div>
  );

  const renderTelegramMode = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-xl font-semibold mb-4 text-white">🤖 Telegram Bot</h3>
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🤖</div>
            <h4 className="text-2xl font-bold mb-4 text-white">Access DeepShield AI via Telegram</h4>
            <p className="text-gray-300 mb-6">
              Get instant deepfake detection results by sending media files to our Telegram bot
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-background-secondary p-6 rounded-lg">
              <h5 className="text-lg font-semibold mb-4 text-white">How to Use</h5>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start space-x-2">
                  <span className="text-primary">1.</span>
                  <span>Search for <code className="bg-primary/20 px-1 rounded">@deepshield_ai_bot</code></span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-primary">2.</span>
                  <span>Send <code className="bg-primary/20 px-1 rounded">/start</code></span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-primary">3.</span>
                  <span>Upload any media file</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-primary">4.</span>
                  <span>Get instant analysis results</span>
                </div>
              </div>
            </div>

            <div className="bg-background-secondary p-6 rounded-lg">
              <h5 className="text-lg font-semibold mb-4 text-white">Bot Features</h5>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✅</span>
                  <span>Real-time detection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✅</span>
                  <span>Detailed reports</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✅</span>
                  <span>Confidence scores</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✅</span>
                  <span>Risk assessment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✅</span>
                  <span>24/7 availability</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a 
              href="https://t.me/deepshield_ai_bot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-primary text-white font-bold px-8 py-4 rounded-lg hover:bg-primary-dark transition-colors text-lg"
            >
              Open Telegram Bot
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Analyze - DeepShield AI</title>
        <meta name="description" content="Analyze images, videos, and audio for deepfakes" />
      </Head>

      <div className="min-h-screen bg-background py-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Deepfake Analysis</span>
            </h1>
            <p className="text-xl text-gray-300">
              Upload files, paste URLs, use live camera, batch process, or try our Telegram bot
            </p>
          </div>

          {/* Analysis Mode Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-background-secondary rounded-lg p-1 flex flex-wrap justify-center">
              {[
                { id: 'upload', label: '📁 Upload', icon: '📁' },
                { id: 'url', label: '🔗 URL', icon: '🔗' },
                { id: 'camera', label: '📹 Live Camera', icon: '📹' },
                { id: 'batch', label: '📦 Batch Upload', icon: '📦' },
                { id: 'telegram', label: '🤖 Telegram Bot', icon: '🤖' }
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id as AnalysisMode)}
                  className={`px-4 py-3 rounded-md text-sm font-semibold transition-all duration-300 ${
                    activeMode === mode.id
                      ? 'bg-accent text-background shadow-lg'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              {activeMode === 'upload' && renderUploadMode()}
              {activeMode === 'url' && renderUrlMode()}
              {activeMode === 'camera' && renderCameraMode()}
              {activeMode === 'batch' && renderBatchMode()}
              {activeMode === 'telegram' && renderTelegramMode()}

              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
                  {error}
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 text-white">Analysis Results</h3>
              
              {!result && !isAnalyzing && activeMode !== 'camera' && activeMode !== 'batch' && activeMode !== 'telegram' && (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-6xl mb-4">🔍</div>
                  <p>Upload a file or paste a URL to start analysis</p>
                </div>
              )}

              {!result && !isAnalyzing && activeMode === 'camera' && (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-6xl mb-4">📹</div>
                  <p>Start live camera detection to see real-time results</p>
                </div>
              )}

              {!result && !isAnalyzing && activeMode === 'batch' && (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-6xl mb-4">📦</div>
                  <p>Upload multiple files to start batch analysis</p>
                </div>
              )}

              {!result && !isAnalyzing && activeMode === 'telegram' && (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-6xl mb-4">🤖</div>
                  <p>Click the button above to access our Telegram bot</p>
                </div>
              )}

              {isAnalyzing && activeMode !== 'camera' && activeMode !== 'batch' && activeMode !== 'telegram' && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-300">Analyzing your content...</p>
                  <p className="text-sm text-gray-400 mt-2">This may take a few seconds</p>
                </div>
              )}

              {/* Live Results for Camera Mode */}
              {activeMode === 'camera' && liveResults.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 text-white">Live Detection History</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {liveResults.slice(-5).map((liveResult, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-background-secondary rounded">
                        <span className="text-sm text-gray-300">
                          Frame {liveResult.frame_number}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-semibold ${classifyConfidence(liveResult.confidence).color}`}>{classifyConfidence(liveResult.confidence).icon}</span>
                          <span className={`text-xs ${classifyConfidence(liveResult.confidence).color}`}>{liveResult.confidence.toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Batch Results for Batch Mode */}
              {activeMode === 'batch' && batchResults.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 text-white">Batch Results Summary</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {batchResults.slice(-5).map((job, index) => (
                      <div key={job.id} className="flex items-center justify-between p-2 bg-background-secondary rounded">
                        <span className="text-sm text-gray-300 truncate flex-1">
                          {job.file.name}
                        </span>
                        <div className="flex items-center space-x-2 ml-2">
                          <span className={`text-sm font-semibold ${classifyConfidence(job.result?.score || 0).color}`}>
                            {classifyConfidence(job.result?.score || 0).icon}
                          </span>
                          <span className={`text-xs ${classifyConfidence(job.result?.score || 0).color}`}>
                            {(job.result?.score || 0).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result && (
                <div className="space-y-6">
                  {/* Trust Score */}
                  <div className="text-center p-6 bg-background-secondary rounded-lg">
                    <div className="text-6xl mb-4">{classifyConfidence(result.confidence).icon}</div>
                    <h4 className={`text-2xl font-bold mb-2 ${classifyConfidence(result.confidence).color}`}>
                      {classifyConfidence(result.confidence).label}
                    </h4>
                    <div className={`text-3xl font-bold ${classifyConfidence(result.confidence).color}`}>
                      {result.confidence.toFixed(1)}%
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      Confidence Score
                    </p>
                    <div className={`text-sm font-semibold ${result.risk_level === 'high' ? 'text-red-400' : result.risk_level === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                      Risk Level: {result.risk_level?.toUpperCase()}
                    </div>
                    {result.frame_number && (
                      <p className="text-xs text-gray-500 mt-1">
                        Frame: {result.frame_number}
                      </p>
                    )}
                  </div>

                  {/* AI Generation Indicators */}
                  {result.ai_generation_indicators && (
                    <div className="space-y-2">
                      <h5 className="font-semibold text-white">🚨 AI Generation Indicators</h5>
                      <div className="space-y-1">
                        {result.ai_generation_indicators.map((indicator, index) => (
                          <div key={index} className={`text-sm ${indicator === 'No obvious manipulations found.' ? 'text-green-300 bg-green-500/10' : 'text-red-300 bg-red-500/10'} p-2 rounded`}>
                            • {indicator}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Explainability */}
                  {result.explainability && (
                    <div className="text-sm text-blue-300 bg-blue-500/10 p-2 rounded">
                      {result.explainability}
                    </div>
                  )}

                  {/* Analysis Details */}
                  <div className="space-y-4">
                    <h5 className="font-semibold text-white">Analysis Details</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Features Analyzed:</span>
                        <span className="text-white">{result.features_analyzed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Detection Score:</span>
                        <span className="text-white">{(result.score * 100).toFixed(1)}%</span>
                      </div>
                      {result.timestamp && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Timestamp:</span>
                          <span className="text-white text-xs">
                            {new Date(result.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Analysis Summary */}
                  {result.analysis_summary && (
                    <div className="space-y-2">
                      <h5 className="font-semibold text-white">Technical Analysis</h5>
                      <div className="space-y-1">
                        {result.analysis_summary.map((item, index) => (
                          <div key={index} className="text-sm text-gray-300">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <button className="flex-1 btn-secondary text-sm py-2" onClick={handleDownloadReport}>
                      Download Report
                    </button>
                    <button className="flex-1 btn-primary text-sm py-2" onClick={handleShareResults}>
                      Share Results
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyzePage; 