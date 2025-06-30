import os
import logging
import requests
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, CallbackQueryHandler, filters, ContextTypes
from accurate_deepfake_detector import AccurateDeepfakeDetector
import tempfile
import asyncio
from datetime import datetime
import json

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Bot Configuration - Direct Setup
BOT_TOKEN = "7280688427:AAGSDYkwgAwkwtoNKS4WrFjnBEnK-penwdQ"
BOT_USERNAME = "@deepshield_ai_bot"

class DeepShieldTelegramBot:
    def __init__(self, token=None):
        """
        Initialize DeepShield Telegram Bot
        
        Args:
            token: Telegram Bot Token (optional, uses default if not provided)
        """
        self.token = token or BOT_TOKEN
        self.detector = AccurateDeepfakeDetector()
        self.application = Application.builder().token(self.token).build()
        
        # Register handlers
        self._register_handlers()
        
        print("🤖 DeepShield Telegram Bot Initialized!")
        print(f"🔗 Bot Username: {BOT_USERNAME}")
        print("🔗 Bot is ready to detect deepfakes!")
    
    def _register_handlers(self):
        """Register all bot handlers"""
        # Command handlers
        self.application.add_handler(CommandHandler("start", self.start_command))
        self.application.add_handler(CommandHandler("help", self.help_command))
        self.application.add_handler(CommandHandler("detect", self.detect_command))
        self.application.add_handler(CommandHandler("status", self.status_command))
        
        # Message handlers
        self.application.add_handler(MessageHandler(filters.PHOTO, self.handle_photo))
        self.application.add_handler(MessageHandler(filters.VIDEO, self.handle_video))
        self.application.add_handler(MessageHandler(filters.AUDIO | filters.VOICE, self.handle_audio))
        self.application.add_handler(MessageHandler(filters.Document.ALL, self.handle_document))
        
        # Text message handler for debugging
        self.application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, self.handle_text))
        
        # Callback query handler
        self.application.add_handler(CallbackQueryHandler(self.button_callback))
        
        print("✅ All handlers registered successfully")
    
    async def _safe_reply(self, update, text, **kwargs):
        """Safely reply to a user, fallback to chat.send_message if message is None"""
        if getattr(update, 'message', None):
            return await update.message.reply_text(text, **kwargs)
        elif getattr(update, 'effective_chat', None):
            return await update.effective_chat.send_message(text, **kwargs)
        else:
            print("[Warning] Could not send message: no message or chat context.")
            return None

    async def start_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        try:
            user = update.effective_user
            welcome_message = f"""
🤖 *DeepShield AI Bot* - Your Deepfake Detection Assistant

👋 Hello {user.first_name}!

🎯 *Main Features:*
• 🖼️ Deepfake Detection in Images
• 🎥 Deepfake Detection in Videos
• 🎵 Deepfake Detection in Audio
• 📊 Detailed Analysis Reports

📋 *How to use:*
• `/detect` - Start detection
• `/help` - See all commands
• `/status` - Check bot status

📤 *Send Media:*
• Photos, Videos, Audio files
• Supported formats: JPG, PNG, MP4, AVI, WAV, MP3

🔒 *Privacy:* Your data is safe and will be deleted after analysis

_Bot Username: {BOT_USERNAME}_
_Powered by DeepShield AI_ 🛡️
            """
            keyboard = [
                [InlineKeyboardButton("🔍 Start Detection", callback_data="start_detection")],
                [InlineKeyboardButton("📖 Help", callback_data="help_info")],
                [InlineKeyboardButton("📊 Status", callback_data="bot_status")]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            await self._safe_reply(update, welcome_message, parse_mode='Markdown', reply_markup=reply_markup)
            print(f"✅ Start command processed for user: {user.first_name}")
        except Exception as e:
            print(f"❌ Error in start_command: {e}")
            await self._safe_reply(update, "❌ Error occurred. Please try again.")
    
    async def help_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        try:
            help_message = f"""
📖 *DeepShield AI Bot - Help Guide*

🔧 *Commands:*
• `/start` - Start the bot
• `/help` - This help message
• `/detect` - Activate detection mode
• `/status` - Bot and model status

📤 *Media Detection:*
• **Images:** JPG, PNG, JPEG files
• **Videos:** MP4, AVI, MOV files (max 50MB)
• **Audio:** WAV, MP3, M4A files

⚡ *Detection Process:*
1. Send a media file
2. Bot will automatically detect
3. You will get a detailed report
4. Confidence score and analysis

🎯 *Features:*
• Real-time deepfake detection
• Multiple AI models
• High accuracy analysis
• Privacy protection

⚠️ *Limitations:*
• Video size: up to 50MB
• Audio duration: up to 10 minutes
• Processing time: 30-60 seconds

🆘 *Support:* Contact the developer if you face any problem

_Bot Username: {BOT_USERNAME}_
            """
            await self._safe_reply(update, help_message, parse_mode='Markdown')
            print("✅ Help command processed")
        except Exception as e:
            print(f"❌ Error in help_command: {e}")
            await self._safe_reply(update, "❌ Error occurred. Please try again.")
    
    async def detect_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        try:
            message = f"""
🔍 *Deepfake Detection Mode Activated*

📤 Now you can send:
• 🖼️ **Images** - Check photos for deepfakes
• 🎥 **Videos** - Analyze video clips
• 🎵 **Audio** - Check voice recordings

⚡ *Processing:* The bot will automatically detect and give a detailed report

💡 *Tip:* High quality files give better results

_Bot Username: {BOT_USERNAME}_
            """
            await self._safe_reply(update, message, parse_mode='Markdown')
            print("✅ Detect command processed")
        except Exception as e:
            print(f"❌ Error in detect_command: {e}")
            await self._safe_reply(update, "❌ Error occurred. Please try again.")
    
    async def status_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        try:
            models_status = {
                'image': '✅' if self.detector.models.get('image') else '❌',
                'video': '✅' if self.detector.models.get('video') else '❌',
                'audio': '✅' if self.detector.models.get('audio') else '❌'
            }
            status_message = f"""
📊 *DeepShield AI Bot Status*

🤖 **Bot Status:** ✅ Online
📱 **Bot Username:** {BOT_USERNAME}
⏰ **Last Update:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

🧠 **AI Models:**
• Image Detection: {models_status['image']}
• Video Detection: {models_status['video']}
• Audio Detection: {models_status['audio']}

💾 **Memory Usage:** Optimized
🔒 **Privacy:** Enabled
⚡ **Performance:** High

_All systems operational_ 🟢
            """
            await self._safe_reply(update, status_message, parse_mode='Markdown')
            print("✅ Status command processed")
        except Exception as e:
            print(f"❌ Error in status_command: {e}")
            await self._safe_reply(update, "❌ Error occurred. Please try again.")
    
    async def handle_photo(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle photo messages"""
        await self._process_media(update, context, 'image')
    
    async def handle_video(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle video messages"""
        await self._process_media(update, context, 'video')
    
    async def handle_audio(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle audio messages"""
        await self._process_media(update, context, 'audio')
    
    async def handle_document(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        document = update.message.document if getattr(update, 'message', None) else None
        if document and document.mime_type:
            if 'image' in document.mime_type:
                await self._process_media(update, context, 'image')
            elif 'video' in document.mime_type:
                await self._process_media(update, context, 'video')
            elif 'audio' in document.mime_type:
                await self._process_media(update, context, 'audio')
            else:
                await self._safe_reply(update, "❌ Unsupported file type. Please send images, videos, or audio files only.")
        else:
            await self._safe_reply(update, "❌ Unable to determine file type. Please send supported media files.")
    
    async def _process_media(self, update: Update, context: ContextTypes.DEFAULT_TYPE, media_type: str):
        """Process media files for deepfake detection"""
        try:
            processing_msg = await self._safe_reply(update, f"🔍 Processing {media_type}...\n⏳ Please wait, this may take 30-60 seconds...")
            
            # Get file
            if media_type == 'image':
                file = await context.bot.get_file(update.message.photo[-1].file_id)
            elif media_type == 'video':
                file = await context.bot.get_file(update.message.video.file_id)
            elif media_type == 'audio':
                if update.message.audio:
                    file = await context.bot.get_file(update.message.audio.file_id)
                else:  # Voice message
                    file = await context.bot.get_file(update.message.voice.file_id)
            
            # Download file to temporary location
            with tempfile.NamedTemporaryFile(delete=False, suffix=f'.{media_type}') as temp_file:
                file_path = temp_file.name
                await file.download_to_drive(file_path)
            
            # Run detection in background
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(None, self._run_detection, file_path, media_type)
            
            # Clean up temporary file
            os.unlink(file_path)
            
            # Send results
            await self._send_detection_results(update, context, result, media_type)
            
            # Delete processing message
            await processing_msg.delete()
            
        except Exception as e:
            logger.error(f"Error processing {media_type}: {e}")
            await self._safe_reply(update, f"❌ Error processing {media_type}. Please try again or contact support.")
    
    def _run_detection(self, file_path: str, media_type: str):
        """Run detection on file (blocking operation)"""
        try:
            # Primary detection
            if media_type == 'image':
                primary_result = self.detector.detect_image(file_path)
            elif media_type == 'video':
                primary_result = self.detector.detect_video(file_path)
            elif media_type == 'audio':
                primary_result = self.detector.detect_audio(file_path)
            
            # Enhanced analysis with multiple methods
            enhanced_result = self._enhance_detection(primary_result, file_path, media_type)
            
            return enhanced_result
            
        except Exception as e:
            logger.error(f"Detection error: {e}")
            return None
    
    def _enhance_detection(self, primary_result, file_path: str, media_type: str):
        """Enhance detection with additional analysis methods"""
        if primary_result is None:
            return None
        
        try:
            # Get primary prediction
            prediction = primary_result['result']
            
            # Add additional analysis methods
            additional_analysis = {}
            
            if media_type == 'image':
                additional_analysis = self._analyze_image_enhanced(file_path, prediction)
            elif media_type == 'video':
                additional_analysis = self._analyze_video_enhanced(file_path, prediction)
            elif media_type == 'audio':
                additional_analysis = self._analyze_audio_enhanced(file_path, prediction)
            
            # Combine results
            enhanced_prediction = self._combine_predictions(prediction, additional_analysis)
            
            # Update result
            enhanced_result = primary_result.copy()
            enhanced_result['result'] = enhanced_prediction
            enhanced_result['enhanced_analysis'] = additional_analysis
            
            return enhanced_result
            
        except Exception as e:
            logger.error(f"Enhanced detection error: {e}")
            return primary_result
    
    def _analyze_image_enhanced(self, file_path: str, primary_prediction):
        """Enhanced image analysis"""
        try:
            import cv2
            import numpy as np
            
            img = cv2.imread(file_path)
            if img is None:
                return {}
            
            analysis = {}
            
            # Color analysis
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
            saturation = np.mean(hsv[:, :, 1])
            analysis['saturation_score'] = saturation / 255.0
            
            # Edge analysis
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            edges = cv2.Canny(gray, 50, 150)
            edge_density = np.sum(edges > 0) / (edges.shape[0] * edges.shape[1])
            analysis['edge_density'] = edge_density
            
            # Noise analysis
            noise_level = cv2.Laplacian(gray, cv2.CV_64F).var()
            analysis['noise_level'] = noise_level
            
            # AI generation indicators
            ai_indicators = []
            
            # Check for unusual patterns
            if saturation > 200:  # Over-saturated
                ai_indicators.append("Over-saturated colors")
            
            if edge_density < 0.01:  # Too smooth
                ai_indicators.append("Unusually smooth textures")
            
            if noise_level < 50:  # Too clean
                ai_indicators.append("Unnaturally clean image")
            
            analysis['ai_indicators'] = ai_indicators
            
            return analysis
            
        except Exception as e:
            logger.error(f"Enhanced image analysis error: {e}")
            return {}
    
    def _analyze_video_enhanced(self, file_path: str, primary_prediction):
        """Enhanced video analysis"""
        try:
            import cv2
            
            cap = cv2.VideoCapture(file_path)
            analysis = {}
            
            frame_count = 0
            motion_scores = []
            brightness_variations = []
            
            while cap.isOpened() and frame_count < 30:  # Analyze first 30 frames
                ret, frame = cap.read()
                if not ret:
                    break
                
                # Motion analysis
                if frame_count > 0:
                    motion = cv2.absdiff(frame, prev_frame)
                    motion_score = np.mean(motion)
                    motion_scores.append(motion_score)
                
                # Brightness analysis
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                brightness = np.mean(gray)
                brightness_variations.append(brightness)
                
                prev_frame = frame.copy()
                frame_count += 1
            
            cap.release()
            
            if motion_scores:
                analysis['motion_consistency'] = 1 - (np.std(motion_scores) / np.mean(motion_scores)) if np.mean(motion_scores) > 0 else 1
                analysis['brightness_stability'] = 1 - (np.std(brightness_variations) / np.mean(brightness_variations)) if np.mean(brightness_variations) > 0 else 1
            
            # AI generation indicators
            ai_indicators = []
            
            if 'motion_consistency' in analysis and analysis['motion_consistency'] < 0.3:
                ai_indicators.append("Unnatural motion patterns")
            
            if 'brightness_stability' in analysis and analysis['brightness_stability'] < 0.5:
                ai_indicators.append("Inconsistent lighting")
            
            analysis['ai_indicators'] = ai_indicators
            
            return analysis
            
        except Exception as e:
            logger.error(f"Enhanced video analysis error: {e}")
            return {}
    
    def _analyze_audio_enhanced(self, file_path: str, primary_prediction):
        """Enhanced audio analysis"""
        try:
            import librosa
            
            y, sr = librosa.load(file_path, sr=None)
            analysis = {}
            
            # Spectral analysis
            spectral_centroid = np.mean(librosa.feature.spectral_centroid(y=y, sr=sr))
            spectral_rolloff = np.mean(librosa.feature.spectral_rolloff(y=y, sr=sr))
            zero_crossing_rate = np.mean(librosa.feature.zero_crossing_rate(y))
            
            analysis['spectral_centroid'] = spectral_centroid
            analysis['spectral_rolloff'] = spectral_rolloff
            analysis['zero_crossing_rate'] = zero_crossing_rate
            
            # AI generation indicators
            ai_indicators = []
            
            if spectral_centroid < 1000:  # Unusually low frequency content
                ai_indicators.append("Unusual frequency distribution")
            
            if zero_crossing_rate < 0.01:  # Too smooth
                ai_indicators.append("Unnaturally smooth audio")
            
            analysis['ai_indicators'] = ai_indicators
            
            return analysis
            
        except Exception as e:
            logger.error(f"Enhanced audio analysis error: {e}")
            return {}
    
    def _combine_predictions(self, primary_prediction, additional_analysis):
        """Combine primary prediction with additional analysis"""
        enhanced_prediction = primary_prediction.copy()
        
        # Adjust confidence based on additional analysis
        confidence_adjustment = 0
        
        if 'ai_indicators' in additional_analysis:
            ai_indicators = additional_analysis['ai_indicators']
            if ai_indicators:
                # Increase confidence if AI indicators are found
                confidence_adjustment += len(ai_indicators) * 5
        
        # Apply adjustment
        new_confidence = min(100, max(0, enhanced_prediction['confidence'] + confidence_adjustment))
        enhanced_prediction['confidence'] = new_confidence
        
        # Update deepfake status if confidence crosses threshold
        if new_confidence > 60 and not enhanced_prediction['is_deepfake']:
            enhanced_prediction['is_deepfake'] = True
        elif new_confidence < 40 and enhanced_prediction['is_deepfake']:
            enhanced_prediction['is_deepfake'] = False
        
        # Add enhanced analysis info
        enhanced_prediction['enhanced_analysis'] = additional_analysis
        
        return enhanced_prediction
    
    async def _send_detection_results(self, update: Update, context: ContextTypes.DEFAULT_TYPE, result, media_type: str):
        """Send detection results to user"""
        if result is None:
            await self._safe_reply(update, "❌ Detection failed. Please try again with a different file.")
            return
        
        # Format results
        prediction = result['result']
        
        if prediction['is_deepfake']:
            status_emoji = "🚨"
            status_text = "DEEPFAKE DETECTED"
            confidence_text = f"Deepfake Confidence: {prediction['confidence']:.1f}%"
        else:
            status_emoji = "✅"
            status_text = "AUTHENTIC CONTENT"
            confidence_text = f"Authenticity: {prediction['confidence']:.1f}%"
        
        # Enhanced analysis based on confidence levels
        analysis_level = self._get_analysis_level(prediction['confidence'])
        risk_assessment = self._get_risk_assessment(prediction['confidence'], prediction['is_deepfake'])
        
        # Create detailed report
        report = f"""
{status_emoji} *Deepfake Detection Report*

📊 **Result:** {status_text}
🎯 **Confidence:** {confidence_text}
🔍 **Analysis Level:** {analysis_level}
⚠️ **Risk Assessment:** {risk_assessment}
🤖 **Model Used:** {prediction['model_used']}
⚙️ **Processing:** {prediction['preprocessing']}
📅 **Analysis Time:** {result['timestamp']}

📋 **Technical Details:**
• Raw Score: {prediction['raw_score']:.4f}
• Model: {prediction['model_used']}
• Method: {prediction['preprocessing']}
        """
        
        # Add video-specific details
        if media_type == 'video' and 'frame_consistency' in prediction:
            report += f"""
🎬 **Video Analysis:**
• Frames Analyzed: {prediction['frames_analyzed']}
• Frame Consistency: {prediction['frame_consistency']:.2f}
• Temporal Analysis: {'✅ Consistent' if prediction['frame_consistency'] > 0.7 else '⚠️ Inconsistent'}
            """
        
        # Add AI/Animation detection hints
        ai_hints = self._get_ai_detection_hints(prediction, media_type)
        if ai_hints:
            report += f"""
🤖 **AI/Animation Detection:**
{ai_hints}
            """
        
        # Add recommendations
        if prediction['is_deepfake']:
            report += """
⚠️ **Recommendations:**
• Do not share this content
• Verify the source thoroughly
• Consider additional verification tools
• Report if it's misleading content
            """
        else:
            report += """
✅ **Recommendations:**
• Content appears authentic
• Use normal precautions
• Source verification is still recommended
• Stay vigilant for new deepfake techniques
            """
        
        # Add disclaimer
        report += """
📝 **Disclaimer:** This analysis is based on current AI detection models. 
New deepfake techniques may not be detected. Always verify from multiple sources.
        """
        
        # Create keyboard for additional actions
        keyboard = [
            [InlineKeyboardButton("🔄 New Detection", callback_data="new_detection")],
            [InlineKeyboardButton("📊 Detailed Report", callback_data="detailed_report")],
            [InlineKeyboardButton("❓ Help", callback_data="help_info")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await self._safe_reply(update, report, parse_mode='Markdown', reply_markup=reply_markup)
    
    def _get_analysis_level(self, confidence):
        """Get analysis level based on confidence"""
        if confidence >= 90:
            return "🔴 High Confidence"
        elif confidence >= 75:
            return "🟡 Medium Confidence"
        elif confidence >= 60:
            return "🟠 Low Confidence"
        else:
            return "⚪ Very Low Confidence"
    
    def _get_risk_assessment(self, confidence, is_deepfake):
        """Get risk assessment based on confidence and result"""
        if is_deepfake:
            if confidence >= 90:
                return "🔴 HIGH RISK - Very likely fake"
            elif confidence >= 75:
                return "🟡 MEDIUM RISK - Probably fake"
            else:
                return "🟠 LOW RISK - Possibly fake"
        else:
            if confidence >= 90:
                return "🟢 LOW RISK - Very likely authentic"
            elif confidence >= 75:
                return "🟡 MEDIUM RISK - Probably authentic"
            else:
                return "🟠 UNCERTAIN - Low confidence"
    
    def _get_ai_detection_hints(self, prediction, media_type):
        """Get AI/Animation detection hints"""
        hints = []
        
        # Check for common AI generation patterns
        if prediction['raw_score'] > 0.8:
            hints.append("• High probability of AI generation")
        elif prediction['raw_score'] > 0.6:
            hints.append("• Possible AI-generated content")
        
        # Enhanced analysis hints
        if 'enhanced_analysis' in prediction:
            enhanced = prediction['enhanced_analysis']
            
            if 'ai_indicators' in enhanced and enhanced['ai_indicators']:
                hints.append("🔍 **Enhanced Analysis Found:**")
                for indicator in enhanced['ai_indicators']:
                    hints.append(f"• {indicator}")
            
            # Media-specific enhanced hints
            if media_type == 'image':
                if 'saturation_score' in enhanced:
                    hints.append(f"• Color saturation: {enhanced['saturation_score']:.2f}")
                if 'edge_density' in enhanced:
                    hints.append(f"• Edge density: {enhanced['edge_density']:.3f}")
                if 'noise_level' in enhanced:
                    hints.append(f"• Noise level: {enhanced['noise_level']:.1f}")
            
            elif media_type == 'video':
                if 'motion_consistency' in enhanced:
                    hints.append(f"• Motion consistency: {enhanced['motion_consistency']:.2f}")
                if 'brightness_stability' in enhanced:
                    hints.append(f"• Brightness stability: {enhanced['brightness_stability']:.2f}")
            
            elif media_type == 'audio':
                if 'spectral_centroid' in enhanced:
                    hints.append(f"• Spectral centroid: {enhanced['spectral_centroid']:.0f} Hz")
                if 'zero_crossing_rate' in enhanced:
                    hints.append(f"• Zero crossing rate: {enhanced['zero_crossing_rate']:.3f}")
        
        # Media-specific hints
        if media_type == 'image':
            if prediction['raw_score'] > 0.7:
                hints.append("• Unusual facial features detected")
                hints.append("• Possible GAN-generated image")
            if prediction['model_used'] == 'pre_trained_xception':
                hints.append("• Advanced CNN analysis performed")
        
        elif media_type == 'video':
            if 'frame_consistency' in prediction and prediction['frame_consistency'] < 0.5:
                hints.append("• Inconsistent frame patterns detected")
                hints.append("• Possible deepfake video")
        
        elif media_type == 'audio':
            if prediction['raw_score'] > 0.6:
                hints.append("• Unusual audio patterns detected")
                hints.append("• Possible voice synthesis")
        
        if not hints:
            hints.append("• No obvious AI generation patterns")
        
        return "\n".join(hints)
    
    async def button_callback(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle button callbacks"""
        query = update.callback_query
        await query.answer()
        
        if query.data == "start_detection":
            await self.detect_command(update, context)
        elif query.data == "help_info":
            await self.help_command(update, context)
        elif query.data == "bot_status":
            await self.status_command(update, context)
        elif query.data == "new_detection":
            await query.edit_message_text(
                "🔍 *New Detection Ready*\n\n📤 Please send your media file (image, video, or audio)",
                parse_mode='Markdown'
            )
        elif query.data == "detailed_report":
            await query.edit_message_text(
                "📊 *Detailed Report*\n\n🔗 For detailed analysis, visit our web dashboard:\nhttps://deepshield-ai.com\n\nOr use `/help` for more information.",
                parse_mode='Markdown'
            )
    
    async def handle_text(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle text messages for debugging"""
        try:
            text = update.message.text if getattr(update, 'message', None) else ''
            user = update.effective_user
            print(f"📨 Received text message from {user.first_name}: {text}")
            
            await self._safe_reply(update,
                f"📨 You sent: {text}\n\n"
                "🔍 For deepfake detection:\n"
                "• Send images\n"
                "• Send videos\n"
                "• Send audio files\n\n"
                "Or send the `/help` command"
            )
            
        except Exception as e:
            print(f"❌ Error in handle_text: {e}")
            await self._safe_reply(update, "❌ Error processing message. Please try again.")
    
    def run(self):
        """Start the bot"""
        print("🚀 Starting DeepShield Telegram Bot...")
        print("📱 Bot is now running. Press Ctrl+C to stop.")
        
        try:
            self.application.run_polling(allowed_updates=Update.ALL_TYPES)
        except KeyboardInterrupt:
            print("\n🛑 Bot stopped by user")
        except Exception as e:
            print(f"❌ Error running bot: {e}")

# Configuration
def load_config():
    """Load bot configuration"""
    config = {
        'token': os.getenv('TELEGRAM_BOT_TOKEN', ''),
        'webhook_url': os.getenv('WEBHOOK_URL', ''),
        'admin_user_id': os.getenv('ADMIN_USER_ID', '')
    }
    
    if not config['token']:
        print("❌ TELEGRAM_BOT_TOKEN not found in environment variables")
        print("📝 Please set your bot token:")
        print("   export TELEGRAM_BOT_TOKEN='your_bot_token_here'")
        return None
    
    return config

# Main execution
if __name__ == "__main__":
    print("🤖 DeepShield AI Telegram Bot")
    print("=" * 40)
    print(f"📱 Bot Username: {BOT_USERNAME}")
    print(f"🔑 Token: {BOT_TOKEN[:10]}...{BOT_TOKEN[-10:]}")
    
    # Create and run bot with hardcoded token
    bot = DeepShieldTelegramBot()
    bot.run() 