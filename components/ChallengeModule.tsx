import React, { useState, useEffect, useCallback } from 'react';

interface QuizQuestion {
  id: string;
  type: 'image' | 'video';
  src: string;
  isReal: boolean;
  title: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // in seconds
}

interface ChallengeModuleProps {
  onComplete: (score: number, totalQuestions: number) => void;
}

const sampleQuestions: QuizQuestion[] = [
  {
    id: '1',
    type: 'image',
    src: '/images/challenge/q1.jpg',
    isReal: true,
    title: 'Question 1',
    explanation: 'This is an authentic image with natural lighting and realistic facial features.',
    difficulty: 'easy',
    timeLimit: 30
  },
  {
    id: '2',
    type: 'image',
    src: '/images/challenge/q2.jpg',
    isReal: false,
    title: 'Question 2',
    explanation: 'Notice the blurry edges around the face and inconsistent lighting patterns.',
    difficulty: 'medium',
    timeLimit: 25
  },
  {
    id: '3',
    type: 'video',
    src: '/videos/challenge/q3.mp4',
    isReal: true,
    title: 'Question 3',
    explanation: 'Natural facial movements and consistent lip-sync with audio.',
    difficulty: 'hard',
    timeLimit: 20
  },
  {
    id: '4',
    type: 'image',
    src: '/images/challenge/q4.jpg',
    isReal: false,
    title: 'Question 4',
    explanation: 'Artificial facial symmetry and color inconsistencies indicate manipulation.',
    difficulty: 'medium',
    timeLimit: 25
  },
  {
    id: '5',
    type: 'video',
    src: '/videos/challenge/q5.mp4',
    isReal: false,
    title: 'Question 5',
    explanation: 'Unnatural blinking patterns and lip-sync mismatches reveal this is a deepfake.',
    difficulty: 'hard',
    timeLimit: 20
  }
];

const ChallengeModule: React.FC<ChallengeModuleProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(sampleQuestions[0].timeLimit);
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [streak, setStreak] = useState(0);

  const question = sampleQuestions[currentQuestion];

  const handleAnswer = useCallback((answer: boolean | null) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setUserAnswer(answer);

    const isCorrect = answer === question.isReal;
    if (isCorrect) {
      setScore(score + 1);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }

    setShowFeedback(true);

    // Show feedback for 3 seconds then move to next question
    setTimeout(() => {
      if (currentQuestion < sampleQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        onComplete(score + (isCorrect ? 1 : 0), sampleQuestions.length);
      }
    }, 3000);
  }, [isAnswered, question.isReal, score, streak, currentQuestion, onComplete]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleAnswer(null); // Time's up
    }
  }, [timeLeft, isAnswered, handleAnswer]);

  // Reset timer for new question
  useEffect(() => {
    setTimeLeft(question.timeLimit);
    setIsAnswered(false);
    setUserAnswer(null);
    setShowFeedback(false);
  }, [currentQuestion, question.timeLimit]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTimeColor = () => {
    if (timeLeft > 10) return 'text-green-400';
    if (timeLeft > 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStreakMessage = () => {
    if (streak >= 5) return '🔥 Unstoppable!';
    if (streak >= 3) return '⚡ On Fire!';
    if (streak >= 2) return '🎯 Great Streak!';
    return '';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold gradient-text mb-4">Deepfake Detection Challenge</h2>
        <p className="text-gray-300 text-lg">
          Test your skills! Identify real vs fake media before time runs out.
        </p>
      </div>

      {/* Progress and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card text-center">
          <div className="text-2xl font-bold text-white mb-1">{currentQuestion + 1}/{sampleQuestions.length}</div>
          <div className="text-sm text-gray-300">Question</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-accent mb-1">{score}</div>
          <div className="text-sm text-gray-300">Score</div>
        </div>
        <div className="card text-center">
          <div className={`text-2xl font-bold mb-1 ${getTimeColor()}`}>{timeLeft}s</div>
          <div className="text-sm text-gray-300">Time Left</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-400 mb-1">{streak}</div>
          <div className="text-sm text-gray-300">Streak</div>
        </div>
      </div>

      {/* Streak Message */}
      {getStreakMessage() && (
        <div className="text-center mb-6">
          <div className="inline-block bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2">
            <span className="text-purple-400 font-semibold">{getStreakMessage()}</span>
          </div>
        </div>
      )}

      {/* Question Card */}
      <div className="card mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">{question.title}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty.toUpperCase()}
          </span>
        </div>

        {/* Media Display */}
        <div className="aspect-video bg-background-secondary rounded-lg overflow-hidden mb-6 relative">
          {question.type === 'image' ? (
            <div className="w-full h-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🖼️</div>
                <p className="text-gray-300">Challenge Image</p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🎥</div>
                <p className="text-gray-300">Challenge Video</p>
              </div>
            </div>
          )}

          {/* Timer Overlay */}
          <div className="absolute top-4 right-4">
            <div className={`bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 ${getTimeColor()}`}>
              <span className="font-bold text-lg">{timeLeft}s</span>
            </div>
          </div>
        </div>

        {/* Answer Buttons */}
        {!isAnswered && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswer(true)}
              className="btn-primary text-lg py-4 flex items-center justify-center space-x-2 hover:bg-green-600 transition-colors"
            >
              <span>✅</span>
              <span>Authentic (Real)</span>
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="btn-secondary text-lg py-4 flex items-center justify-center space-x-2 hover:bg-red-600 transition-colors"
            >
              <span>🚨</span>
              <span>Deepfake</span>
            </button>
          </div>
        )}

        {/* Feedback */}
        {showFeedback && (
          <div className={`mt-6 p-4 rounded-lg border ${
            userAnswer === question.isReal
              ? 'bg-green-500/20 border-green-500/30 text-green-400'
              : 'bg-red-500/20 border-red-500/30 text-red-400'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">
                {userAnswer === question.isReal ? '✅' : '❌'}
              </span>
              <span className="font-semibold">
                {userAnswer === question.isReal ? 'Correct!' : 'Incorrect!'}
              </span>
            </div>
            <p className="text-sm">{question.explanation}</p>
            <div className="mt-2 text-xs opacity-75">
              Moving to next question in 3 seconds...
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-300">Progress</span>
          <span className="text-sm text-gray-300">
            {Math.round(((currentQuestion + 1) / sampleQuestions.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className="bg-accent h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / sampleQuestions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Tips */}
      <div className="card">
        <h4 className="text-lg font-semibold text-white mb-3">💡 Quick Tips</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>• Look for blurry edges around facial features</div>
          <div>• Check for inconsistent lighting patterns</div>
          <div>• Watch for unnatural eye movements</div>
          <div>• Listen for lip-sync mismatches</div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeModule; 