import React, { useState, useCallback } from 'react';

interface UploadJob {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  result?: any;
  error?: string;
}

interface BatchUploadProps {
  onAnalysisComplete: (results: UploadJob[]) => void;
}

const BatchUpload: React.FC<BatchUploadProps> = ({ onAnalysisComplete }) => {
  const [uploadJobs, setUploadJobs] = useState<UploadJob[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

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
    addFiles(files);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      addFiles(Array.from(files));
    }
  };

  const addFiles = (files: File[]) => {
    const newJobs: UploadJob[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'pending',
      progress: 0
    }));

    setUploadJobs(prev => [...prev, ...newJobs]);
  };

  const removeJob = (jobId: string) => {
    setUploadJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const clearAll = () => {
    setUploadJobs([]);
  };

  const startBatchAnalysis = async () => {
    if (uploadJobs.length === 0) return;

    setIsProcessing(true);
    const updatedJobs = [...uploadJobs];

    // Process each job sequentially
    for (let i = 0; i < updatedJobs.length; i++) {
      const job = updatedJobs[i];
      
      // Update status to processing
      updatedJobs[i] = { ...job, status: 'processing', progress: 0 };
      setUploadJobs([...updatedJobs]);

      try {
        // Simulate processing with progress updates
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 200));
          updatedJobs[i] = { ...updatedJobs[i], progress };
          setUploadJobs([...updatedJobs]);
        }

        // Simulate analysis result
        const mockResult = {
          is_deepfake: Math.random() > 0.7,
          confidence: Math.random() * 100,
          score: Math.random(),
          features_analyzed: Math.floor(Math.random() * 20) + 10,
          analysis_summary: [
            "✅ Face Detection: Detected",
            "• Facial Landmarks: 468",
            "• Image Sharpness: Good",
            "• Compression Analysis: Normal"
          ]
        };

        updatedJobs[i] = {
          ...updatedJobs[i],
          status: 'completed',
          progress: 100,
          result: mockResult
        };
      } catch (error) {
        updatedJobs[i] = {
          ...updatedJobs[i],
          status: 'error',
          error: 'Analysis failed'
        };
      }

      setUploadJobs([...updatedJobs]);
    }

    setIsProcessing(false);
    onAnalysisComplete(updatedJobs.filter(job => job.status === 'completed'));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-gray-400';
      case 'processing': return 'text-blue-400';
      case 'completed': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'processing': return '🔄';
      case 'completed': return '✅';
      case 'error': return '❌';
      default: return '⏳';
    }
  };

  const completedJobs = uploadJobs.filter(job => job.status === 'completed');
  const pendingJobs = uploadJobs.filter(job => job.status === 'pending');
  const processingJobs = uploadJobs.filter(job => job.status === 'processing');

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4 text-white">Batch Upload</h3>
        
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
          <div className="text-4xl mb-4">📦</div>
          <p className="text-gray-300 mb-4">
            Drag and drop multiple files here, or click to browse
          </p>
          <input
            type="file"
            accept="image/*,video/*,audio/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="batch-file-upload"
          />
          <label htmlFor="batch-file-upload" className="btn-secondary cursor-pointer">
            Choose Files
          </label>
        </div>
      </div>

      {/* File List */}
      {uploadJobs.length > 0 && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-white">
              Files ({uploadJobs.length})
            </h4>
            <div className="flex space-x-2">
              <button
                onClick={clearAll}
                className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {uploadJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-3 bg-background-secondary rounded-lg">
                <div className="flex items-center space-x-3 flex-1">
                  <span className="text-lg">{getStatusIcon(job.status)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{job.file.name}</p>
                    <p className="text-xs text-gray-400">
                      {(job.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Progress Bar */}
                  {job.status === 'processing' && (
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-accent h-2 rounded-full transition-all duration-300"
                        style={{ width: `${job.progress}%` }}
                      ></div>
                    </div>
                  )}

                  {/* Status */}
                  <span className={`text-sm font-medium ${getStatusColor(job.status)}`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>

                  {/* Remove Button */}
                  {job.status === 'pending' && (
                    <button
                      onClick={() => removeJob(job.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Batch Summary */}
      {uploadJobs.length > 0 && (
        <div className="card">
          <h4 className="text-lg font-semibold mb-4 text-white">Batch Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-background-secondary rounded-lg">
              <div className="text-2xl font-bold text-gray-300">{uploadJobs.length}</div>
              <div className="text-xs text-gray-400">Total Files</div>
            </div>
            <div className="p-3 bg-background-secondary rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{pendingJobs.length}</div>
              <div className="text-xs text-gray-400">Pending</div>
            </div>
            <div className="p-3 bg-background-secondary rounded-lg">
              <div className="text-2xl font-bold text-green-400">{completedJobs.length}</div>
              <div className="text-xs text-gray-400">Completed</div>
            </div>
            <div className="p-3 bg-background-secondary rounded-lg">
              <div className="text-2xl font-bold text-red-400">
                {uploadJobs.filter(job => job.status === 'error').length}
              </div>
              <div className="text-xs text-gray-400">Errors</div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={startBatchAnalysis}
          disabled={isProcessing || uploadJobs.length === 0 || pendingJobs.length === 0}
          className="flex-1 btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
              <span>Processing Batch...</span>
            </div>
          ) : (
            `Start Batch Analysis (${pendingJobs.length} files)`
          )}
        </button>
      </div>
    </div>
  );
};

export default BatchUpload; 