import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import RecentActivity from '../components/RecentActivity';

interface DashboardData {
  totalAnalyses: number;
  deepfakesDetected: number;
  accuracyRate: number;
  averageResponseTime: number;
  dailyAnalyses: number;
  weeklyGrowth: number;
  monthlyGrowth: number;
  recentDetections: any[];
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    fill?: boolean;
  }[];
}

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalAnalyses: 0,
    deepfakesDetected: 0,
    accuracyRate: 0,
    averageResponseTime: 0,
    dailyAnalyses: 0,
    weeklyGrowth: 0,
    monthlyGrowth: 0,
    recentDetections: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [isExporting, setIsExporting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [liveUpdates, setLiveUpdates] = useState(true);
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: []
  });
  const [notifications, setNotifications] = useState<string[]>([]);

  // Add notification function
  const addNotification = (message: string) => {
    setNotifications(prev => [message, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n !== message));
    }, 5000);
  };

  // Generate mock activities with real-time updates
  const generateMockActivities = useCallback(() => {
    const activities = [];
    const types = ['image', 'video', 'audio'] as const;
    const results = ['authentic', 'deepfake', 'suspicious'] as const;
    const statuses = ['completed', 'processing', 'error'] as const;
    
    for (let i = 0; i < 10; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const result = results[Math.floor(Math.random() * results.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      activities.push({
        id: `activity-${Date.now()}-${i}`,
        type,
        filename: `${type}_file_${i + 1}.${type === 'image' ? 'jpg' : type === 'video' ? 'mp4' : 'wav'}`,
        result,
        confidence: Math.random() * 100,
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        status
      });
    }
    
    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, []);

  // Generate chart data based on time range
  const generateChartData = useCallback((range: '7d' | '30d' | '90d') => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const labels = [];
    const analysisData = [];
    const deepfakeData = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      
      // Generate realistic data with some randomness
      const baseAnalyses = range === '7d' ? 150 : range === '30d' ? 120 : 100;
      const baseDeepfakes = range === '7d' ? 15 : range === '30d' ? 12 : 10;
      
      analysisData.push(Math.floor(baseAnalyses + Math.random() * 50));
      deepfakeData.push(Math.floor(baseDeepfakes + Math.random() * 8));
    }
    
    return {
      labels,
      datasets: [
        {
          label: 'Total Analyses',
          data: analysisData,
          borderColor: '#CBBBF6',
          backgroundColor: ['rgba(203, 187, 246, 0.1)'],
          fill: true
        },
        {
          label: 'Deepfakes Detected',
          data: deepfakeData,
          borderColor: '#EF4444',
          backgroundColor: ['rgba(239, 68, 68, 0.1)'],
          fill: true
        }
      ]
    };
  }, []);

  // Real-time data updates
  useEffect(() => {
    const updateData = () => {
      setDashboardData(prev => {
        const newTotal = prev.totalAnalyses + Math.floor(Math.random() * 5);
        const newDeepfakes = prev.deepfakesDetected + Math.floor(Math.random() * 2);
        
        // Add notifications for significant events
        if (newTotal % 100 === 0) {
          addNotification(`🎉 Milestone: ${newTotal.toLocaleString()} total analyses completed!`);
        }
        if (newDeepfakes % 50 === 0) {
          addNotification(`🚨 Alert: ${newDeepfakes.toLocaleString()} deepfakes detected!`);
        }
        
        return {
          totalAnalyses: newTotal,
          deepfakesDetected: newDeepfakes,
          accuracyRate: Math.min(99.9, prev.accuracyRate + (Math.random() - 0.5) * 0.5),
          averageResponseTime: Math.max(0.5, prev.averageResponseTime + (Math.random() - 0.5) * 0.1),
          dailyAnalyses: prev.dailyAnalyses + Math.floor(Math.random() * 3),
          weeklyGrowth: prev.weeklyGrowth + (Math.random() - 0.5) * 0.5,
          monthlyGrowth: prev.monthlyGrowth + (Math.random() - 0.5) * 0.3,
          recentDetections: generateMockActivities()
        };
      });
    };

    if (liveUpdates) {
      const interval = setInterval(updateData, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [liveUpdates, generateMockActivities]);

  // Load initial data
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDashboardData({
        totalAnalyses: 12547,
        deepfakesDetected: 892,
        accuracyRate: 94.2,
        averageResponseTime: 1.8,
        dailyAnalyses: 156,
        weeklyGrowth: 12.5,
        monthlyGrowth: 8.3,
        recentDetections: generateMockActivities()
      });
      
      setChartData(generateChartData(timeRange));
      setIsLoading(false);
    };

    loadDashboardData();
  }, [timeRange, generateMockActivities, generateChartData]);

  // Update chart data when time range changes
  useEffect(() => {
    setChartData(generateChartData(timeRange));
  }, [timeRange, generateChartData]);

  // Render interactive chart
  const renderChart = (type: 'line' | 'bar' | 'pie') => {
    if (type === 'line' || type === 'bar') {
      return (
        <div className="w-full h-full p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-white font-semibold">Data Trends</h4>
            <div className="flex space-x-2">
              {chartData.datasets.map((dataset, index) => (
                <div key={index} className="flex items-center space-x-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: dataset.borderColor }}
                  ></div>
                  <span className="text-xs text-gray-400">{dataset.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative h-48">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              {/* Grid lines */}
              {Array.from({ length: 5 }).map((_, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={40 + i * 40}
                  x2="400"
                  y2={40 + i * 40}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                />
              ))}
              
              {/* Chart lines */}
              {chartData.datasets.map((dataset, datasetIndex) => {
                const points = dataset.data.map((value, index) => {
                  const x = (index / (dataset.data.length - 1)) * 350 + 25;
                  const y = 200 - (value / Math.max(...dataset.data)) * 160 - 20;
                  return `${x},${y}`;
                }).join(' ');
                
                return (
                  <g key={datasetIndex}>
                    <polyline
                      fill="none"
                      stroke={dataset.borderColor}
                      strokeWidth="2"
                      points={points}
                    />
                    {dataset.data.map((value, index) => {
                      const x = (index / (dataset.data.length - 1)) * 350 + 25;
                      const y = 200 - (value / Math.max(...dataset.data)) * 160 - 20;
                      return (
                        <circle
                          key={index}
                          cx={x}
                          cy={y}
                          r="3"
                          fill={dataset.borderColor}
                          className="hover:r-4 transition-all cursor-pointer"
                        />
                      );
                    })}
                  </g>
                );
              })}
            </svg>
          </div>
          
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            {chartData.labels.filter((_, i) => i % Math.ceil(chartData.labels.length / 5) === 0).map((label, index) => (
              <span key={index}>{label}</span>
            ))}
          </div>
        </div>
      );
    }
    
    // Pie chart
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#CBBBF6"
              strokeWidth="8"
              strokeDasharray="251.2"
              strokeDashoffset="75.36"
              transform="rotate(-90 50 50)"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#EF4444"
              strokeWidth="8"
              strokeDasharray="251.2"
              strokeDashoffset="175.84"
              transform="rotate(-90 50 50)"
              strokeLinecap="round"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#10B981"
              strokeWidth="8"
              strokeDasharray="251.2"
              strokeDashoffset="226.08"
              transform="rotate(-90 50 50)"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{dashboardData.totalAnalyses}</div>
              <div className="text-xs text-gray-400">Total</div>
            </div>
          </div>
        </div>
        <div className="ml-6 space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span className="text-sm text-gray-300">Authentic</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-300">Deepfake</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-300">Suspicious</span>
          </div>
        </div>
      </div>
    );
  };

  // Export functionality
  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create and download CSV
      const csvContent = [
        'Date,Total Analyses,Deepfakes Detected,Accuracy Rate,Response Time',
        `${new Date().toISOString()},${dashboardData.totalAnalyses},${dashboardData.deepfakesDetected},${dashboardData.accuracyRate}%,${dashboardData.averageResponseTime}s`
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `deepshield-analytics-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Quick action handlers
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'new-analysis':
        addNotification('🚀 Redirecting to analysis page...');
        setTimeout(() => window.location.href = '/analyze', 1000);
        break;
      case 'view-reports':
        addNotification('📊 Reports page coming soon!');
        break;
      case 'download-analytics':
        handleExport();
        break;
      case 'settings':
        addNotification('⚙️ Settings panel coming soon!');
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - DeepShield AI</title>
        <meta name="description" content="Analytics dashboard for DeepShield AI" />
      </Head>

      <div className="min-h-screen bg-background py-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              <span className="gradient-text">Analytics Dashboard</span>
            </h1>
            <p className="text-gray-300">
              Real-time insights and performance metrics for DeepShield AI
            </p>
          </div>

          {/* Notifications */}
          {notifications.length > 0 && (
            <div className="mb-6 space-y-2">
              {notifications.map((notification, index) => (
                <div 
                  key={index}
                  className="bg-accent/20 border border-accent/30 text-accent-light px-4 py-3 rounded-lg animate-pulse"
                >
                  {notification}
                </div>
              ))}
            </div>
          )}

          {/* Time Range Selector */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex space-x-2">
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  timeRange === '7d'
                    ? 'bg-accent text-background'
                    : 'bg-background-secondary text-gray-300 hover:text-white'
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  timeRange === '30d'
                    ? 'bg-accent text-background'
                    : 'bg-background-secondary text-gray-300 hover:text-white'
                }`}
              >
                Last 30 Days
              </button>
              <button
                onClick={() => setTimeRange('90d')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  timeRange === '90d'
                    ? 'bg-accent text-background'
                    : 'bg-background-secondary text-gray-300 hover:text-white'
                }`}
              >
                Last 90 Days
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className={`w-2 h-2 rounded-full animate-pulse ${liveUpdates ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                <span>{liveUpdates ? 'Live Data' : 'Static Data'}</span>
              </div>
              <button
                onClick={() => setLiveUpdates(!liveUpdates)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  liveUpdates 
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                }`}
              >
                {liveUpdates ? 'Pause' : 'Resume'}
              </button>
              <button 
                onClick={handleExport}
                disabled={isExporting}
                className="btn-secondary text-sm px-4 py-2 disabled:opacity-50"
              >
                {isExporting ? 'Exporting...' : 'Export Report'}
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Analyses"
              value={dashboardData.totalAnalyses.toLocaleString()}
              change={dashboardData.weeklyGrowth}
              changeType="increase"
              icon="📊"
              color="blue"
              description="Files analyzed this period"
            />
            <StatCard
              title="Deepfakes Detected"
              value={dashboardData.deepfakesDetected.toLocaleString()}
              change={5.2}
              changeType="increase"
              icon="🚨"
              color="red"
              description="Suspicious content identified"
            />
            <StatCard
              title="Accuracy Rate"
              value={`${dashboardData.accuracyRate.toFixed(1)}%`}
              change={2.1}
              changeType="increase"
              icon="🎯"
              color="green"
              description="Detection accuracy"
            />
            <StatCard
              title="Avg Response Time"
              value={`${dashboardData.averageResponseTime.toFixed(1)}s`}
              change={-0.3}
              changeType="decrease"
              icon="⚡"
              color="orange"
              description="Average analysis time"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard title="Analysis Trends">
              {renderChart('line')}
            </ChartCard>
            <ChartCard title="Detection Distribution">
              {renderChart('pie')}
            </ChartCard>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Daily Analyses</span>
                  <span className="text-white font-semibold">{dashboardData.dailyAnalyses}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Weekly Growth</span>
                  <span className="text-green-400 font-semibold">+{dashboardData.weeklyGrowth.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Monthly Growth</span>
                  <span className="text-green-400 font-semibold">+{dashboardData.monthlyGrowth.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">System Uptime</span>
                  <span className="text-green-400 font-semibold">99.9%</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">File Type Analysis</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Images</span>
                  <span className="text-white font-semibold">45%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Videos</span>
                  <span className="text-white font-semibold">38%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Audio</span>
                  <span className="text-white font-semibold">17%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div className="bg-accent h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Detection Confidence</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">High (90%+)</span>
                  <span className="text-green-400 font-semibold">67%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Medium (70-90%)</span>
                  <span className="text-yellow-400 font-semibold">23%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Low (&lt;70%)</span>
                  <span className="text-red-400 font-semibold">10%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentActivity activities={dashboardData.recentDetections} />
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => handleQuickAction('new-analysis')}
                  className="w-full btn-primary text-sm py-3"
                >
                  Start New Analysis
                </button>
                <button 
                  onClick={() => handleQuickAction('view-reports')}
                  className="w-full btn-secondary text-sm py-3"
                >
                  View All Reports
                </button>
                <button 
                  onClick={() => handleQuickAction('download-analytics')}
                  disabled={isExporting}
                  className="w-full bg-background-secondary hover:bg-background-secondary/80 text-white text-sm py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isExporting ? 'Exporting...' : 'Download Analytics'}
                </button>
                <button 
                  onClick={() => handleQuickAction('settings')}
                  className="w-full bg-background-secondary hover:bg-background-secondary/80 text-white text-sm py-3 rounded-lg transition-colors"
                >
                  System Settings
                </button>
              </div>
            </div>
          </div>

          {/* Settings Modal */}
          {showSettings && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-background-secondary rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-semibold text-white mb-4">Dashboard Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Live Updates</span>
                    <button
                      onClick={() => setLiveUpdates(!liveUpdates)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        liveUpdates ? 'bg-accent' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        liveUpdates ? 'transform translate-x-6' : 'transform translate-x-1'
                      }`}></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Auto Refresh</span>
                    <span className="text-sm text-gray-400">5s</span>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard; 