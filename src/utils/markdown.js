import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

// Configure marked
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value
      } catch (err) {
        console.error('Highlight error:', err)
      }
    }
    return hljs.highlightAuto(code).value
  },
  breaks: true,
  gfm: true
})

// Custom renderer for code blocks with copy button
const renderer = new marked.Renderer()
const originalCodeRenderer = renderer.code.bind(renderer)

renderer.code = function(code, language) {
  const lang = language || 'text'
  const highlighted = originalCodeRenderer(code, language)
  
  return `
    <div class="code-block-wrapper">
      <div class="code-block-header">
        <span class="code-block-lang">${lang}</span>
        <button class="copy-code-btn" data-code="${encodeURIComponent(code)}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy
        </button>
      </div>
      ${highlighted}
    </div>
  `
}

marked.use({ renderer })

export function parseMarkdown(text) {
  try {
    return marked.parse(text)
  } catch (error) {
    console.error('Markdown parsing error:', error)
    return text
  }
}

export function setupCodeCopyButtons(container) {
  if (!container) return
  
  const copyButtons = container.querySelectorAll('.copy-code-btn')
  
  copyButtons.forEach(button => {
    button.onclick = async (e) => {
      e.preventDefault()
      const code = decodeURIComponent(button.getAttribute('data-code'))
      
      try {
        await navigator.clipboard.writeText(code)
        const originalText = button.innerHTML
        button.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Copied!
        `
        setTimeout(() => {
          button.innerHTML = originalText
        }, 2000)
      } catch (err) {
        console.error('Copy failed:', err)
      }
    }
  })
}
