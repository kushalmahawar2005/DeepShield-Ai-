import React from 'react';

interface QuestionCardProps {
  question: {
    id: string;
    type: 'image' | 'video';
    src: string;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    timeLimit: number;
  };
  timeLeft: number;
  onAnswer: (answer: boolean) => void;
  isAnswered: boolean;
  userAnswer: boolean | null;
  correctAnswer: boolean;
  explanation: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  timeLeft,
  onAnswer,
  isAnswered,
  userAnswer,
  correctAnswer,
  explanation
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'hard': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getTimeColor = () => {
    if (timeLeft > 10) return 'text-green-400';
    if (timeLeft > 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const isCorrect = userAnswer === correctAnswer;

  return (
    <div className="card">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">{question.title}</h3>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty.toUpperCase()}
          </span>
          <div className={`bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 ${getTimeColor()}`}>
            <span className="font-bold">{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Media Display */}
      <div className="aspect-video bg-background-secondary rounded-lg overflow-hidden mb-6 relative">
        {question.type === 'image' ? (
          <div className="w-full h-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🖼️</div>
              <p className="text-gray-300">Question Image</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🎥</div>
              <p className="text-gray-300">Question Video</p>
            </div>
          </div>
        )}

        {/* Media Type Badge */}
        <div className="absolute top-4 left-4">
          <div className="bg-background/80 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-sm font-semibold text-white">
              {question.type === 'image' ? '📷 Image' : '🎬 Video'}
            </span>
          </div>
        </div>
      </div>

      {/* Answer Buttons */}
      {!isAnswered && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => onAnswer(true)}
            className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-lg py-4 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <span className="text-2xl">✅</span>
            <span>Authentic (Real)</span>
            <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
          </button>
          
          <button
            onClick={() => onAnswer(false)}
            className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-lg py-4 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <span className="text-2xl">🚨</span>
            <span>Deepfake</span>
            <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
          </button>
        </div>
      )}

      {/* Feedback */}
      {isAnswered && (
        <div className={`p-4 rounded-lg border mb-6 ${
          isCorrect
            ? 'bg-green-500/20 border-green-500/30'
            : 'bg-red-500/20 border-red-500/30'
        }`}>
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-3xl">
              {isCorrect ? '✅' : '❌'}
            </span>
            <div>
              <div className={`font-semibold text-lg ${
                isCorrect ? 'text-green-400' : 'text-red-400'
              }`}>
                {isCorrect ? 'Correct!' : 'Incorrect!'}
              </div>
              <div className="text-sm text-gray-300">
                The correct answer was: <span className="font-semibold">
                  {correctAnswer ? 'Authentic' : 'Deepfake'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-background/50 rounded-lg p-3">
            <h4 className="font-semibold text-white mb-2">💡 Explanation</h4>
            <p className="text-sm text-gray-300">{explanation}</p>
          </div>
        </div>
      )}

      {/* Quick Analysis */}
      {isAnswered && (
        <div className="bg-background-secondary rounded-lg p-4">
          <h4 className="font-semibold text-white mb-3">🔍 Quick Analysis</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="text-center">
              <div className="text-2xl mb-1">👁️</div>
              <div className="text-gray-300">Eye Movement</div>
              <div className={`text-xs ${correctAnswer ? 'text-green-400' : 'text-red-400'}`}>
                {correctAnswer ? 'Natural' : 'Artificial'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">💡</div>
              <div className="text-gray-300">Lighting</div>
              <div className={`text-xs ${correctAnswer ? 'text-green-400' : 'text-red-400'}`}>
                {correctAnswer ? 'Consistent' : 'Inconsistent'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">👄</div>
              <div className="text-gray-300">Lip Sync</div>
              <div className={`text-xs ${correctAnswer ? 'text-green-400' : 'text-red-400'}`}>
                {correctAnswer ? 'Natural' : 'Mismatched'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🔍</div>
              <div className="text-gray-300">Edges</div>
              <div className={`text-xs ${correctAnswer ? 'text-green-400' : 'text-red-400'}`}>
                {correctAnswer ? 'Sharp' : 'Blurry'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard; 