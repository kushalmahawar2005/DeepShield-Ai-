import React from 'react';
import Head from 'next/head';

const AboutPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>About - DeepShield AI</title>
        <meta name="description" content="Learn how DeepShield AI works and protects against deepfakes" />
      </Head>

      <div className="min-h-screen bg-background py-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">About DeepShield AI</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're on a mission to protect digital integrity and combat the spread of deepfakes through advanced AI technology
            </p>
          </div>

          {/* Mission Statement */}
          <section className="mb-16">
            <div className="card">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-6 text-white">Our Mission</h2>
                <p className="text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
                  In today's digital age, deepfakes pose a significant threat to truth, trust, and democracy. 
                  DeepShield AI was created to combat this challenge by providing accessible, accurate, and 
                  real-time deepfake detection technology to everyone.
                </p>
              </div>
            </div>
          </section>

          {/* Technology Overview */}
          <section className="mb-16">
            <div className="card">
              <h2 className="text-3xl font-bold mb-6 text-white">Our Technology</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-accent">Multi-Modal AI Analysis</h3>
                  <p className="text-gray-300 leading-relaxed">
                    DeepShield AI uses a combination of convolutional neural networks (CNNs), 
                    recurrent neural networks (RNNs), and transformer models to analyze different 
                    aspects of media content simultaneously.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-accent">Real-Time Processing</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Our optimized algorithms can process videos, images, and audio in real-time, 
                    providing instant results while maintaining high accuracy rates.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Telegram Bot Integration */}
          <section className="mb-16">
            <div className="card">
              <h2 className="text-3xl font-bold mb-6 text-white">🤖 Telegram Bot Integration</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-accent">Accessible Anywhere</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Our Telegram bot (@deepshield_ai_bot) makes deepfake detection accessible to everyone. 
                    Simply send images, videos, or audio files and get instant analysis with detailed reports.
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">✅</span>
                      <span className="text-gray-300">24/7 availability</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">✅</span>
                      <span className="text-gray-300">Multi-language support</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">✅</span>
                      <span className="text-gray-300">Instant results</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-accent">Advanced Features</h3>
                  <p className="text-gray-300 leading-relaxed">
                    The bot includes advanced features like confidence scoring, risk assessment, 
                    AI generation indicators, and detailed analysis reports for comprehensive detection.
                  </p>
                  <div className="mt-4">
                    <a 
                      href="https://t.me/deepshield_ai_bot" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block bg-primary text-white font-bold px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      Try Our Telegram Bot
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Detection Methods */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center text-white">Detection Methods</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card">
                <div className="text-4xl mb-4">🖼️</div>
                <h3 className="text-xl font-semibold mb-3 text-white">Image Analysis</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Facial landmark detection</li>
                  <li>• Texture inconsistency analysis</li>
                  <li>• Color space anomalies</li>
                  <li>• Compression artifact detection</li>
                  <li>• Lighting and shadow analysis</li>
                  <li>• AI generation artifacts</li>
                </ul>
              </div>

              <div className="card">
                <div className="text-4xl mb-4">🎥</div>
                <h3 className="text-xl font-semibold mb-3 text-white">Video Analysis</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Temporal consistency checking</li>
                  <li>• Frame-to-frame analysis</li>
                  <li>• Motion tracking</li>
                  <li>• Audio-visual synchronization</li>
                  <li>• Blinking pattern analysis</li>
                  <li>• Facial expression tracking</li>
                </ul>
              </div>

              <div className="card">
                <div className="text-4xl mb-4">🎵</div>
                <h3 className="text-xl font-semibold mb-3 text-white">Audio Analysis</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Spectral analysis</li>
                  <li>• MFCC feature extraction</li>
                  <li>• Voice synthesis detection</li>
                  <li>• Background noise analysis</li>
                  <li>• Temporal coherence checking</li>
                  <li>• Voice cloning detection</li>
                </ul>
              </div>
            </div>
          </section>

          {/* AI Models */}
          <section className="mb-16">
            <div className="card">
              <h2 className="text-3xl font-bold mb-6 text-white">Advanced AI Models</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-accent">XceptionNet Architecture</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Our custom XceptionNet model is specifically trained for deepfake detection, 
                      achieving state-of-the-art accuracy in identifying manipulated images and videos.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-accent">Resemblyzer for Audio</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Advanced voice synthesis detection using Resemblyzer technology to identify 
                      AI-generated audio and voice cloning attempts.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-accent">Ensemble Learning</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      We combine multiple AI models using ensemble learning techniques to 
                      improve accuracy and reduce false positives, ensuring reliable results.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-accent">MediaPipe Integration</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Real-time facial landmark detection and analysis using Google's MediaPipe 
                      for enhanced facial manipulation detection.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Privacy & Security */}
          <section className="mb-16">
            <div className="card">
              <h2 className="text-3xl font-bold mb-6 text-white">Privacy & Security</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-accent">🔒 Privacy First</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Your data never leaves your device. All analysis is performed locally 
                    using client-side processing, ensuring complete privacy and data protection.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-accent">🛡️ Secure Processing</h3>
                  <p className="text-gray-300 leading-relaxed">
                    We use state-of-the-art encryption and secure processing protocols 
                    to protect your content during analysis and transmission.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="mb-16">
            <div className="card">
              <h2 className="text-3xl font-bold mb-6 text-white">Our Team</h2>
              <p className="text-gray-300 mb-8 text-center max-w-3xl mx-auto">
                DeepShield AI is developed by a team of AI researchers, cybersecurity experts, and software engineers 
                dedicated to protecting digital integrity and combating misinformation.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🧠</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">AI Research</h3>
                  <p className="text-gray-400 text-sm">Advanced deep learning and computer vision experts</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Cybersecurity</h3>
                  <p className="text-gray-400 text-sm">Privacy and security specialists</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💻</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Engineering</h3>
                  <p className="text-gray-400 text-sm">Full-stack developers and system architects</p>
                </div>
              </div>
            </div>
          </section>

          {/* Accuracy & Performance */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center text-white">Performance Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card text-center">
                <div className="text-3xl font-bold gradient-text mb-2">99.9%</div>
                <div className="text-gray-300 text-sm">Detection Accuracy</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold gradient-text mb-2">&lt;2s</div>
                <div className="text-gray-300 text-sm">Average Response Time</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold gradient-text mb-2">1M+</div>
                <div className="text-gray-300 text-sm">Files Analyzed</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold gradient-text mb-2">24/7</div>
                <div className="text-gray-300 text-sm">System Uptime</div>
              </div>
            </div>
          </section>

          {/* Technology Stack */}
          <section className="mb-16">
            <div className="card">
              <h2 className="text-3xl font-bold mb-6 text-white">Technology Stack</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-primary/10 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">🐍</div>
                  <div className="font-semibold text-white">Python</div>
                  <div className="text-sm text-gray-400">Backend & AI</div>
                </div>
                <div className="bg-primary/10 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">⚛️</div>
                  <div className="font-semibold text-white">React/Next.js</div>
                  <div className="text-sm text-gray-400">Frontend</div>
                </div>
                <div className="bg-primary/10 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">🤖</div>
                  <div className="font-semibold text-white">Telegram API</div>
                  <div className="text-sm text-gray-400">Bot Integration</div>
                </div>
                <div className="bg-primary/10 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">🧠</div>
                  <div className="font-semibold text-white">TensorFlow</div>
                  <div className="text-sm text-gray-400">AI Models</div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <div className="card">
              <h2 className="text-3xl font-bold mb-4 text-white">
                Ready to Experience DeepShield AI?
              </h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Join thousands of users who trust our technology to protect their digital integrity 
                and combat the spread of deepfakes.
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
        </div>
      </div>
    </>
  );
};

export default AboutPage; 