import React from 'react';
import Head from 'next/head';
import Hero from '../components/Hero';
import FeatureCard from '../components/FeatureCard';

const features = [
  {
    title: "Real-Time Detection",
    description: "Analyze videos, images, and audio in real-time with our advanced AI models. Get instant results with 99.9% accuracy.",
    icon: "⚡",
    delay: 0
  },
  {
    title: "Multi-Modal Analysis",
    description: "Detect deepfakes across multiple formats - from facial manipulation in videos to synthetic audio generation.",
    icon: "🎯",
    delay: 100
  },
  {
    title: "Privacy First",
    description: "Your data never leaves your device. All analysis is performed locally with state-of-the-art encryption.",
    icon: "🔒",
    delay: 200
  },
  {
    title: "Transparent Results",
    description: "Get detailed analysis reports with confidence scores and explainable AI insights for every detection.",
    icon: "📊",
    delay: 300
  },
  {
    title: "Telegram Bot Integration",
    description: "Access deepfake detection directly through our Telegram bot @deepshield_ai_bot. Send media files and get instant analysis.",
    icon: "🤖",
    delay: 400
  },
  {
    title: "Advanced AI Models",
    description: "Powered by XceptionNet, Resemblyzer, and ensemble classifiers for the highest detection accuracy.",
    icon: "🧠",
    delay: 500
  }
];

const HomePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>DeepShield AI - Real-Time Deepfake Detection</title>
        <meta name="description" content="Detecting deepfakes in video and audio. Fast, transparent, and trustworthy." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero />

      {/* Features Section */}
      <section className="py-20 bg-background-secondary">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Advanced Features</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Powered by cutting-edge AI technology to protect you from the latest deepfake threats
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${feature.delay}ms` }}>
                <FeatureCard
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  delay={feature.delay}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Telegram Bot Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">🤖 Telegram Bot</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Access DeepShield AI directly through Telegram! Send images, videos, or audio files and get instant deepfake analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-2xl font-bold mb-4 text-white">How to Use</h3>
                <div className="space-y-4 text-gray-300">
                  <div className="flex items-start space-x-3">
                    <span className="text-primary text-xl">1.</span>
                    <p>Search for <code className="bg-primary/20 px-2 py-1 rounded">@deepshield_ai_bot</code> on Telegram</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-primary text-xl">2.</span>
                    <p>Send <code className="bg-primary/20 px-2 py-1 rounded">/start</code> to begin</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-primary text-xl">3.</span>
                    <p>Upload any image, video, or audio file</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-primary text-xl">4.</span>
                    <p>Get instant analysis with confidence scores</p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-2xl font-bold mb-4 text-white">Supported Formats</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <div className="text-3xl mb-2">🖼️</div>
                    <div className="font-semibold text-white">Images</div>
                    <div className="text-sm text-gray-400">JPG, PNG, JPEG</div>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <div className="text-3xl mb-2">🎥</div>
                    <div className="font-semibold text-white">Videos</div>
                    <div className="text-sm text-gray-400">MP4, AVI, MOV</div>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <div className="text-3xl mb-2">🎵</div>
                    <div className="font-semibold text-white">Audio</div>
                    <div className="text-sm text-gray-400">WAV, MP3, M4A</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-2xl font-bold mb-4 text-white">Bot Features</h3>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-center space-x-3">
                    <span className="text-green-400">✅</span>
                    <span>Real-time deepfake detection</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-400">✅</span>
                    <span>Detailed analysis reports</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-400">✅</span>
                    <span>Confidence scores & risk assessment</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-400">✅</span>
                    <span>AI generation indicators</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-400">✅</span>
                    <span>Privacy protection</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-400">✅</span>
                    <span>English interface</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary to-primary-dark p-6 rounded-lg text-center">
                <h3 className="text-2xl font-bold mb-4 text-white">Ready to Try?</h3>
                <p className="text-gray-200 mb-6">
                  Start detecting deepfakes right now through our Telegram bot!
                </p>
                <a 
                  href="https://t.me/deepshield_ai_bot" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-primary font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Open Telegram Bot
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-background-secondary">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">How It Works</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our advanced AI system uses multiple detection methods to identify deepfakes with high accuracy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📤</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">1. Upload Media</h3>
              <p className="text-gray-300">
                Send your image, video, or audio file through our web interface or Telegram bot
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🧠</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">2. AI Analysis</h3>
              <p className="text-gray-300">
                Our advanced AI models analyze the content using multiple detection techniques
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">3. Get Results</h3>
              <p className="text-gray-300">
                Receive detailed reports with confidence scores and risk assessments
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-4xl font-bold gradient-text mb-2">99.9%</div>
              <div className="text-gray-300">Detection Accuracy</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="text-4xl font-bold gradient-text mb-2">&lt;2s</div>
              <div className="text-gray-300">Average Analysis Time</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="text-4xl font-bold gradient-text mb-2">1M+</div>
              <div className="text-gray-300">Files Analyzed</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '600ms' }}>
              <div className="text-4xl font-bold gradient-text mb-2">24/7</div>
              <div className="text-gray-300">Bot Availability</div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-background-secondary">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Advanced Technology</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Built with state-of-the-art AI models and cutting-edge detection algorithms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card p-6 rounded-lg border border-border text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2 text-white">XceptionNet</h3>
              <p className="text-gray-400 text-sm">Advanced CNN for image analysis</p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border text-center">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-xl font-bold mb-2 text-white">Resemblyzer</h3>
              <p className="text-gray-400 text-sm">Voice synthesis detection</p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border text-center">
              <div className="text-4xl mb-4">👁️</div>
              <h3 className="text-xl font-bold mb-2 text-white">MediaPipe</h3>
              <p className="text-gray-400 text-sm">Facial landmark analysis</p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border text-center">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-bold mb-2 text-white">Ensemble AI</h3>
              <p className="text-gray-400 text-sm">Multiple model voting</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Protect Your Digital World?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Join thousands of users who trust DeepShield AI to detect deepfakes and protect their digital integrity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://t.me/deepshield_ai_bot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary text-lg px-8 py-4"
            >
              Try Telegram Bot
            </a>
            <a 
              href="/analyze" 
              className="bg-white text-primary font-bold text-lg px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Web Analysis
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage; 