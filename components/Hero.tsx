import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const Hero: React.FC = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleWatchDemo = () => {
    setShowDemo(true);
  };

  const closeDemo = () => {
    setShowDemo(false);
    setIsVideoPlaying(false);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsVideoLoaded(true);
    }
  };

  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('ended', handleVideoEnd);
      
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('ended', handleVideoEnd);
      };
    }
  }, []);

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center bg-hero-gradient overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-shadow">
              <span className="gradient-text">DeepShield AI</span>
              <br />
              <span className="text-white">Real-Time Deepfake Detection</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Detecting deepfakes in video and audio. Fast, transparent, and trustworthy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/analyze">
                <button className="btn-primary text-lg px-8 py-4">
                  Try DeepShield Now
                </button>
              </Link>
              
              <button 
                onClick={handleWatchDemo}
                className="btn-secondary text-lg px-8 py-4 hover:bg-accent hover:text-background transition-all duration-300"
              >
                Watch Demo
              </button>
            </div>
            
            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Real-time Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>99.9% Accuracy</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Privacy First</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-accent rounded-full flex justify-center">
            <div className="w-1 h-3 bg-accent rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeDemo}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-background-secondary rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold gradient-text">DeepShield AI Demo</h2>
              <button 
                onClick={closeDemo}
                className="text-gray-400 hover:text-white text-2xl font-bold transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Real Video Player */}
              <div className="bg-background rounded-lg p-6 border border-accent">
                <div className="relative">
                  {/* Video Player */}
                  <div className="relative bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg overflow-hidden">
                    <div className="aspect-video bg-black/50 flex items-center justify-center relative">
                      {/* Video Element */}
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover rounded-lg"
                        preload="metadata"
                        poster="/videos/demo-thumbnail.jpg"
                      >
                        {/* Add your video file here */}
                        <source src="/videos/Demo.mp4" type="video/mp4" />
                        <source src="/videos/Demo.webm" type="video/webm" />
                        Your browser does not support the video tag.
                      </video>
                      
                      {/* Video Overlay when not playing */}
                      {!isVideoPlaying && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-6xl mb-4">🎬</div>
                            <h3 className="text-xl font-semibold text-white mb-2">DeepShield AI Demo</h3>
                            <p className="text-gray-300 mb-4 text-sm">
                              Watch how our AI detects deepfakes in real-time
                            </p>
                            
                            {/* Play Button */}
                            <button 
                              onClick={toggleVideo}
                              className="bg-accent hover:bg-accent-dark text-background px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
                            >
                              <span className="text-xl">▶️</span>
                              <span>Play Demo Video</span>
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Video Overlay Controls when playing */}
                      {isVideoPlaying && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <button 
                            onClick={toggleVideo}
                            className="bg-accent/80 hover:bg-accent text-background p-4 rounded-full transition-all duration-300"
                          >
                            <span className="text-2xl">⏸️</span>
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Video Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <div className="flex items-center justify-between text-white text-sm mb-2">
                        <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => {
                              if (videoRef.current) {
                                videoRef.current.currentTime = Math.max(0, currentTime - 10);
                              }
                            }}
                            className="hover:text-accent transition-colors"
                          >
                            ⏮️
                          </button>
                          <button 
                            onClick={toggleVideo}
                            className="hover:text-accent transition-colors"
                          >
                            {isVideoPlaying ? '⏸️' : '▶️'}
                          </button>
                          <button 
                            onClick={() => {
                              if (videoRef.current) {
                                videoRef.current.currentTime = Math.min(duration, currentTime + 10);
                              }
                            }}
                            className="hover:text-accent transition-colors"
                          >
                            ⏭️
                          </button>
                          <button className="hover:text-accent transition-colors">🔊</button>
                          <button 
                            onClick={() => {
                              if (videoRef.current) {
                                if (videoRef.current.requestFullscreen) {
                                  videoRef.current.requestFullscreen();
                                }
                              }
                            }}
                            className="hover:text-accent transition-colors"
                          >
                            ⛶
                          </button>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div 
                        className="w-full bg-gray-600 rounded-full h-2 cursor-pointer"
                        onClick={handleSeek}
                      >
                        <div 
                          className="bg-accent h-2 rounded-full transition-all duration-300"
                          style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Demo Video Features */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
                    <div className="bg-background-secondary rounded p-3">
                      <div className="text-2xl mb-1">⚡</div>
                      <div className="text-xs text-gray-300">Real-time Detection</div>
                    </div>
                    <div className="bg-background-secondary rounded p-3">
                      <div className="text-2xl mb-1">🎯</div>
                      <div className="text-xs text-gray-300">99.9% Accuracy</div>
                    </div>
                    <div className="bg-background-secondary rounded p-3">
                      <div className="text-2xl mb-1">🔒</div>
                      <div className="text-xs text-gray-300">Privacy Safe</div>
                    </div>
                  </div>
                </div>
                
                {/* Demo Actions */}
                <div className="mt-6 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <button className="btn-primary px-6 py-3 flex items-center justify-center space-x-2">
                    <span>📥</span>
                    <span>Download Demo</span>
                  </button>
                  <button className="btn-secondary px-6 py-3 flex items-center justify-center space-x-2">
                    <span>📋</span>
                    <span>View Transcript</span>
                  </button>
                  <button className="bg-background hover:bg-background-secondary text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2">
                    <span>💬</span>
                    <span>Ask Questions</span>
                  </button>
                </div>
              </div>
              
              {/* Demo Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-background rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">⚡</div>
                  <h4 className="font-semibold text-white mb-1">Real-Time Analysis</h4>
                  <p className="text-sm text-gray-300">Instant deepfake detection</p>
                </div>
                <div className="bg-background rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🎯</div>
                  <h4 className="font-semibold text-white mb-1">High Accuracy</h4>
                  <p className="text-sm text-gray-300">99.9% detection rate</p>
                </div>
                <div className="bg-background rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🔒</div>
                  <h4 className="font-semibold text-white mb-1">Privacy Safe</h4>
                  <p className="text-sm text-gray-300">Local processing only</p>
                </div>
              </div>
              
              {/* Demo Steps */}
              <div className="bg-background rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">How It Works</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-background font-bold">1</div>
                    <div>
                      <h4 className="font-semibold text-white">Upload Content</h4>
                      <p className="text-sm text-gray-300">Upload videos, images, or audio files</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-background font-bold">2</div>
                    <div>
                      <h4 className="font-semibold text-white">AI Analysis</h4>
                      <p className="text-sm text-gray-300">Advanced AI models analyze your content</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-background font-bold">3</div>
                    <div>
                      <h4 className="font-semibold text-white">Get Results</h4>
                      <p className="text-sm text-gray-300">Receive detailed analysis with confidence scores</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* CTA */}
              <div className="text-center pt-4">
                <Link href="/analyze">
                  <button className="btn-primary text-lg px-8 py-4 mr-4">
                    Try It Now
                  </button>
                </Link>
                <button 
                  onClick={closeDemo}
                  className="btn-secondary text-lg px-8 py-4"
                >
                  Close Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Hero; 