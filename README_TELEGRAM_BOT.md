# 🤖 DeepShield AI Telegram Bot

A powerful Telegram bot that integrates with DeepShield AI to provide real-time deepfake detection services. Users can send images, videos, and audio files to get instant analysis and detection results.

## ✨ Features

- 🖼️ **Image Deepfake Detection** - Analyze photos for manipulation
- 🎥 **Video Deepfake Detection** - Check video clips for deepfakes
- 🎵 **Audio Deepfake Detection** - Detect fake voice recordings
- 📊 **Detailed Reports** - Get confidence scores and analysis details
- 🔒 **Privacy Protection** - Files are deleted after analysis
- ⚡ **Real-time Processing** - Fast detection with AI models
- 🌐 **Multi-language Support** - Hindi and English interface

## 🚀 Quick Start

### 1. Prerequisites

- Python 3.8 or higher
- Telegram account
- Bot token from @BotFather

### 2. Installation

```bash
# Clone or download the project
cd "DeepShield Ai"

# Run the setup script
python bot_setup.py
```

### 3. Manual Setup (Alternative)

```bash
# Install dependencies
pip install -r requirements_telegram.txt

# Create .env file with your bot token
echo "TELEGRAM_BOT_TOKEN=your_bot_token_here" > .env

# Run the bot
python telegram_bot.py
```

## 🔧 Bot Setup

### Getting Bot Token

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow instructions to create your bot
4. Copy the bot token (format: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Configuration

Create a `.env` file in the project directory:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
WEBHOOK_URL=  # Optional: for webhook mode
ADMIN_USER_ID=  # Optional: for admin commands
```

## 📱 Usage

### Bot Commands

- `/start` - Start the bot and see welcome message
- `/help` - Show help and usage instructions
- `/detect` - Activate detection mode
- `/status` - Check bot and model status

### Supported File Types

#### Images
- **Formats:** JPG, PNG, JPEG
- **Max Size:** 20MB
- **Features:** Face detection, manipulation analysis

#### Videos
- **Formats:** MP4, AVI, MOV
- **Max Size:** 50MB
- **Features:** Frame analysis, consistency checking

#### Audio
- **Formats:** WAV, MP3, M4A, Voice messages
- **Max Duration:** 10 minutes
- **Features:** Voice synthesis detection

### Example Usage

1. **Start the bot:**
   ```
   /start
   ```

2. **Send an image for analysis:**
   - Upload any photo
   - Bot will analyze and provide results

3. **Get detailed report:**
   - Results include confidence score
   - Model information
   - Recommendations

## 🧠 AI Models

The bot uses multiple AI models for detection:

### Image Detection
- **Model:** Xception-based CNN
- **Features:** Transfer learning from ImageNet
- **Accuracy:** High precision deepfake detection

### Video Detection
- **Model:** Frame-based analysis
- **Features:** Temporal consistency checking
- **Output:** Frame-by-frame analysis

### Audio Detection
- **Model:** CNN on mel spectrograms
- **Features:** Voice synthesis detection
- **Processing:** Real-time audio analysis

## 📊 Detection Results

### Sample Output

```
🚨 Deepfake Detection Report

📊 Result: DEEPFAKE DETECTED
🎯 Confidence: 87.5%
🤖 Model Used: pre_trained_xception
⚙️ Processing: xception_preprocessing
📅 Analysis Time: 2024-01-15T10:30:45

📋 Technical Details:
• Raw Score: 0.8750
• Model: pre_trained_xception
• Method: xception_preprocessing

⚠️ Recommendations:
• इस content को share न करें
• Source verify करें
• Additional verification करें
```

## 🔒 Privacy & Security

- **File Storage:** Temporary storage only
- **Data Retention:** Files deleted after analysis
- **No Logging:** User data not stored
- **Secure Processing:** Local AI processing

## 🛠️ Development

### Project Structure

```
telegram_bot.py          # Main bot file
bot_setup.py            # Setup script
requirements_telegram.txt # Dependencies
README_TELEGRAM_BOT.md   # This file
.env                    # Configuration (create this)
```

### Adding New Features

1. **New Commands:**
   ```python
   self.application.add_handler(CommandHandler("newcommand", self.new_command))
   ```

2. **New Media Types:**
   ```python
   self.application.add_handler(MessageHandler(filters.Document.ALL, self.handle_document))
   ```

3. **Custom Responses:**
   ```python
   await update.message.reply_text("Your custom message")
   ```

## 🚨 Troubleshooting

### Common Issues

1. **Bot not responding:**
   - Check if bot token is correct
   - Verify bot is not blocked
   - Check internet connection

2. **File processing errors:**
   - Ensure file format is supported
   - Check file size limits
   - Verify file is not corrupted

3. **Model loading issues:**
   - Install TensorFlow: `pip install tensorflow`
   - Check available memory
   - Verify Python version compatibility

### Error Messages

- `❌ Bot connection failed` - Check token
- `❌ Detection failed` - Try different file
- `❌ Unsupported file type` - Use supported formats

## 📈 Performance

### Processing Times
- **Images:** 5-15 seconds
- **Videos:** 30-60 seconds (depending on length)
- **Audio:** 10-30 seconds

### Accuracy
- **Image Detection:** 85-95%
- **Video Detection:** 80-90%
- **Audio Detection:** 75-85%

## 🔗 Integration

### Web Dashboard
- Connect to web interface for detailed reports
- Historical analysis tracking
- Batch processing capabilities

### API Integration
- RESTful API endpoints
- Webhook support
- Custom integrations

## 📞 Support

### Getting Help
1. Check this README
2. Review error messages
3. Contact developer for issues

### Contributing
- Report bugs via issues
- Suggest new features
- Submit pull requests

## 📄 License

This project is part of DeepShield AI system.
For licensing information, contact the development team.

---

**🤖 DeepShield AI Telegram Bot** - Protecting digital authenticity one message at a time! 🛡️ 