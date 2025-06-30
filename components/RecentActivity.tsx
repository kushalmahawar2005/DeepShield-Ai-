import React from 'react';

interface ActivityItem {
  id: string;
  type: 'image' | 'video' | 'audio';
  filename: string;
  result: 'authentic' | 'deepfake' | 'suspicious';
  confidence: number;
  timestamp: string;
  status: 'completed' | 'processing' | 'error';
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getResultIcon = (result: string) => {
    switch (result) {
      case 'deepfake':
        return '🚨';
      case 'suspicious':
        return '⚠️';
      case 'authentic':
        return '✅';
      default:
        return '❓';
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'deepfake':
        return 'text-red-400';
      case 'suspicious':
        return 'text-yellow-400';
      case 'authentic':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return '🖼️';
      case 'video':
        return '🎥';
      case 'audio':
        return '🎵';
      default:
        return '📄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'processing':
        return 'text-blue-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        <button className="text-sm text-accent hover:text-accent-light transition-colors">
          View All
        </button>
      </div>
      
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-3 p-3 bg-background-secondary rounded-lg hover:bg-background-secondary/80 transition-colors">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{getTypeIcon(activity.type)}</span>
              <span className="text-xl">{getResultIcon(activity.result)}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{activity.filename}</p>
              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <span className={getResultColor(activity.result)}>
                  {activity.result.charAt(0).toUpperCase() + activity.result.slice(1)}
                </span>
                <span>{activity.confidence.toFixed(1)}% confidence</span>
                <span className={getStatusColor(activity.status)}>
                  {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-xs text-gray-400">
                {new Date(activity.timestamp).toLocaleTimeString()}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(activity.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {activities.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-2">📊</div>
          <p>No recent activity</p>
          <p className="text-sm">Start analyzing files to see activity here</p>
        </div>
      )}
    </div>
  );
};

export default RecentActivity; 