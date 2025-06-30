import React, { useState } from 'react';

interface ScoreData {
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeTaken: number;
  streak: number;
  difficulty: string;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  accuracy: number;
  date: string;
  badge: string;
}

interface ScoreBoardProps {
  scoreData: ScoreData;
  onRetry: () => void;
  onNewChallenge: () => void;
  onBackToMenu: () => void;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({
  scoreData,
  onRetry,
  onNewChallenge,
  onBackToMenu
}) => {
  const [activeTab, setActiveTab] = useState<'results' | 'leaderboard'>('results');

  // Sample leaderboard data
  const leaderboardData: LeaderboardEntry[] = [
    { id: '1', name: 'Deepfake Hunter', score: 95, accuracy: 95, date: '2024-01-15', badge: '🏆' },
    { id: '2', name: 'AI Detective', score: 88, accuracy: 88, date: '2024-01-14', badge: '🥈' },
    { id: '3', name: 'Truth Seeker', score: 82, accuracy: 82, date: '2024-01-13', badge: '🥉' },
    { id: '4', name: 'Digital Guardian', score: 78, accuracy: 78, date: '2024-01-12', badge: '⭐' },
    { id: '5', name: 'Media Analyst', score: 75, accuracy: 75, date: '2024-01-11', badge: '⭐' },
  ];

  const getAchievementBadge = (accuracy: number): { badge: string; title: string; description: string } => {
    if (accuracy >= 95) {
      return {
        badge: '🏆',
        title: 'Master Detector',
        description: 'Exceptional deepfake detection skills!'
      };
    } else if (accuracy >= 85) {
      return {
        badge: '🥈',
        title: 'Expert Detector',
        description: 'Excellent detection abilities!'
      };
    } else if (accuracy >= 75) {
      return {
        badge: '🥉',
        title: 'Advanced Detector',
        description: 'Good detection skills!'
      };
    } else if (accuracy >= 60) {
      return {
        badge: '⭐',
        title: 'Intermediate Detector',
        description: 'Decent detection abilities!'
      };
    } else {
      return {
        badge: '🌱',
        title: 'Novice Detector',
        description: 'Keep practicing to improve!'
      };
    }
  };

  const achievement = getAchievementBadge(scoreData.accuracy);

  const getPerformanceColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-400';
    if (accuracy >= 75) return 'text-yellow-400';
    if (accuracy >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold gradient-text mb-4">Challenge Complete!</h2>
        <p className="text-gray-300 text-lg">
          Here's how you performed in the deepfake detection challenge.
        </p>
      </div>

      {/* Achievement Badge */}
      <div className="card text-center mb-8">
        <div className="text-8xl mb-4">{achievement.badge}</div>
        <h3 className="text-2xl font-bold text-white mb-2">{achievement.title}</h3>
        <p className="text-gray-300 mb-4">{achievement.description}</p>
        <div className="inline-block bg-accent/20 border border-accent/30 rounded-full px-4 py-2">
          <span className="text-accent font-semibold">New Achievement Unlocked!</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <div className="bg-background-secondary rounded-lg p-1 flex">
          <button
            onClick={() => setActiveTab('results')}
            className={`px-6 py-3 rounded-md text-sm font-semibold transition-all duration-300 ${
              activeTab === 'results'
                ? 'bg-accent text-background shadow-lg'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Your Results
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-6 py-3 rounded-md text-sm font-semibold transition-all duration-300 ${
              activeTab === 'leaderboard'
                ? 'bg-accent text-background shadow-lg'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Leaderboard
          </button>
        </div>
      </div>

      {/* Results Tab */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          {/* Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="card text-center">
              <div className="text-3xl font-bold text-accent mb-1">{scoreData.score}/{scoreData.totalQuestions}</div>
              <div className="text-sm text-gray-300">Total Score</div>
            </div>
            <div className="card text-center">
              <div className={`text-3xl font-bold mb-1 ${getPerformanceColor(scoreData.accuracy)}`}>
                {scoreData.accuracy}%
              </div>
              <div className="text-sm text-gray-300">Accuracy</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">{scoreData.streak}</div>
              <div className="text-sm text-gray-300">Best Streak</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">{scoreData.timeTaken}s</div>
              <div className="text-sm text-gray-300">Time Taken</div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="card">
            <h3 className="text-xl font-semibold text-white mb-4">Performance Breakdown</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Accuracy</span>
                  <span className="text-white font-semibold">{scoreData.accuracy}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-accent h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${scoreData.accuracy}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Speed</span>
                  <span className="text-white font-semibold">
                    {Math.round((scoreData.totalQuestions / scoreData.timeTaken) * 60)} q/min
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, (scoreData.totalQuestions / scoreData.timeTaken) * 60)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h4 className="text-lg font-semibold text-white mb-3">📊 Statistics</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Questions Answered:</span>
                  <span className="text-white">{scoreData.totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Correct Answers:</span>
                  <span className="text-green-400">{scoreData.score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Incorrect Answers:</span>
                  <span className="text-red-400">{scoreData.totalQuestions - scoreData.score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Average Time:</span>
                  <span className="text-white">{Math.round(scoreData.timeTaken / scoreData.totalQuestions)}s</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h4 className="text-lg font-semibold text-white mb-3">🎯 Recommendations</h4>
              <div className="space-y-3 text-sm text-gray-300">
                {scoreData.accuracy < 70 && (
                  <div className="flex items-start space-x-2">
                    <span>📚</span>
                    <span>Complete the learning module to improve your detection skills</span>
                  </div>
                )}
                {scoreData.streak < 3 && (
                  <div className="flex items-start space-x-2">
                    <span>🎯</span>
                    <span>Focus on maintaining longer streaks for better scores</span>
                  </div>
                )}
                <div className="flex items-start space-x-2">
                  <span>⚡</span>
                  <span>Practice regularly to maintain your detection abilities</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span>🔍</span>
                  <span>Pay attention to lighting, edges, and facial movements</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="card">
          <h3 className="text-xl font-semibold text-white mb-6">🏆 Top Performers</h3>
          <div className="space-y-4">
            {leaderboardData.map((entry, index) => (
              <div key={entry.id} className="flex items-center justify-between p-4 bg-background-secondary rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{entry.badge}</div>
                  <div>
                    <div className="font-semibold text-white">{entry.name}</div>
                    <div className="text-sm text-gray-300">{entry.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-accent">{entry.score}%</div>
                  <div className="text-sm text-gray-300">Accuracy: {entry.accuracy}%</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Current User Position */}
          <div className="mt-6 p-4 bg-accent/20 border border-accent/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">👤</div>
                <div>
                  <div className="font-semibold text-white">Your Score</div>
                  <div className="text-sm text-gray-300">Just completed</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-accent">{scoreData.accuracy}%</div>
                <div className="text-sm text-gray-300">Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-8">
        <button
          onClick={onRetry}
          className="btn-primary px-8 py-3 text-lg"
        >
          🔄 Try Again
        </button>
        <button
          onClick={onNewChallenge}
          className="btn-secondary px-8 py-3 text-lg"
        >
          🎯 New Challenge
        </button>
        <button
          onClick={onBackToMenu}
          className="bg-background-secondary hover:bg-background-secondary/80 text-white px-8 py-3 rounded-lg transition-colors text-lg"
        >
          🏠 Back to Menu
        </button>
      </div>
    </div>
  );
};

export default ScoreBoard; 