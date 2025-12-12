# ChatGPT Clone

A full-featured ChatGPT-like web application built with Vue.js. This application provides a modern, responsive interface for interacting with OpenAI's GPT models, complete with conversation management, markdown support, and multiple themes.

![ChatGPT Clone](https://img.shields.io/badge/Vue.js-3.x-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

### Core Features
- 💬 **Beautiful Chat Interface** - Clean, responsive UI similar to ChatGPT
- 🌙 **Dark/Light Mode** - Smooth theme transitions with system preference detection
- 📚 **Conversation Management** - Create, switch, and delete multiple conversations
- ✨ **Markdown Support** - Full markdown rendering with syntax highlighting
- 🔑 **OpenAI API Integration** - Direct integration with OpenAI's API
- 💾 **Local Storage** - All conversations saved locally in your browser
- 📱 **Responsive Design** - Works seamlessly on mobile, tablet, and desktop

### Advanced Features
- 🎨 **Syntax Highlighting** - Code blocks with language detection and copy button
- 🔄 **Streaming Responses** - Real-time AI responses as they're generated
- ⌨️ **Keyboard Shortcuts** - Power user features for faster navigation
- 🔍 **Search Conversations** - Quickly find past conversations
- 📤 **Export Data** - Download conversations as JSON
- ♻️ **Regenerate Responses** - Re-generate AI responses if needed
- ✏️ **Edit & Resend** - Edit previous messages and resend
- ⏹️ **Stop Generation** - Cancel ongoing AI responses

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mohammedshoaib8912-netizen/Chatgpt-.git
   cd Chatgpt-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Getting Your OpenAI API Key

1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and paste it in the app's Settings modal
5. The key is stored securely in your browser's localStorage

## 🎮 Usage

### Basic Usage

1. **Configure API Key**: Click the settings icon and enter your OpenAI API key
2. **Start Chatting**: Click "New Chat" or press `Ctrl+N`
3. **Type Your Message**: Enter your message in the input box
4. **Send**: Press `Enter` or click the send button
5. **View Response**: Watch the AI response stream in real-time

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+N` | New chat |
| `Ctrl+/` | Show shortcuts |
| `Ctrl+S` | Open settings |
| `Ctrl+B` | Toggle sidebar |
| `Ctrl+R` | Regenerate response |
| `Enter` | Send message |
| `Shift+Enter` | New line |
| `Esc` | Stop generation / Close modal |

### Model Selection

The app supports multiple OpenAI models:
- **GPT-3.5 Turbo** - Fast and cost-effective
- **GPT-4** - More capable, better reasoning
- **GPT-4 Turbo** - Latest GPT-4 with improved performance

### System Prompts

Customize the AI's behavior by editing the system prompt in Settings. Examples:
- "You are a helpful assistant."
- "You are a Python programming expert."
- "You are a creative writing assistant."

## 🏗️ Project Structure

```
├── index.html              # Entry HTML file
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── netlify.toml           # Netlify deployment config
├── vercel.json            # Vercel deployment config
├── src/
│   ├── main.js            # Application entry point
│   ├── App.vue            # Root component
│   ├── components/        # Vue components
│   │   ├── ChatMessage.vue
│   │   ├── ChatInput.vue
│   │   ├── Sidebar.vue
│   │   ├── SettingsModal.vue
│   │   ├── ShortcutsModal.vue
│   │   └── WelcomeScreen.vue
│   ├── composables/       # Vue composables
│   │   ├── useChat.js
│   │   ├── useTheme.js
│   │   └── useStorage.js
│   ├── services/          # API services
│   │   └── openai.js
│   ├── utils/             # Utility functions
│   │   └── markdown.js
│   └── assets/
│       └── styles/        # CSS files
│           ├── main.css
│           └── variables.css
└── public/
    └── favicon.ico
```

## 🔧 Configuration

### Environment Variables

While the app stores the API key in localStorage, you can also set default values:

```javascript
// In src/composables/useChat.js
const settings = ref({
  model: 'gpt-3.5-turbo',  // Default model
  systemPrompt: 'You are a helpful assistant.',  // Default prompt
  streamEnabled: true  // Enable streaming
})
```

### Customizing Themes

Edit `src/assets/styles/variables.css` to customize colors:

```css
:root {
  --accent-color: #10a37f;  /* Primary accent color */
  --bg-primary: #ffffff;     /* Main background */
  --text-primary: #202123;   /* Main text color */
  /* ... more variables */
}
```

## 📦 Building for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

The built files will be in the `dist` directory.

## 🚢 Deployment

### Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Vite and deploy

Or use the Vercel CLI:
```bash
npm install -g vercel
vercel
```

### Netlify

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Import your repository
4. Use these settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

Or use the Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### GitHub Pages

Add this to your `package.json`:
```json
{
  "scripts": {
    "deploy": "vite build && gh-pages -d dist"
  }
}
```

Then run:
```bash
npm install -g gh-pages
npm run deploy
```

## 🔒 Security & Privacy

- **API keys** are stored only in your browser's localStorage
- **Conversations** are saved locally and never sent to any server except OpenAI
- **No tracking** or analytics are included
- All communication with OpenAI uses HTTPS

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow Vue 3 Composition API patterns
- Use existing CSS variables for styling
- Ensure responsive design works on all screen sizes
- Test keyboard shortcuts
- Add JSDoc comments for complex functions

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](#) file for details.

## 🙏 Acknowledgments

- Built with [Vue.js](https://vuejs.org/)
- Powered by [OpenAI API](https://openai.com/)
- Markdown parsing by [Marked](https://marked.js.org/)
- Code highlighting by [Highlight.js](https://highlightjs.org/)
- Bundled with [Vite](https://vitejs.dev/)

## ⚠️ Disclaimer

This is an independent project and is not affiliated with, endorsed by, or connected to OpenAI. The official ChatGPT is available at [chat.openai.com](https://chat.openai.com).

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the [OpenAI API documentation](https://platform.openai.com/docs)

---

Made with ❤️ by the community