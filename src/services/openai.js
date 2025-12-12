export class OpenAIService {
  constructor(apiKey) {
    this.apiKey = apiKey
    this.baseURL = 'https://api.openai.com/v1'
  }

  async sendMessage(messages, model = 'gpt-3.5-turbo', systemPrompt = null, onStream = null) {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is not configured')
    }

    const messagesWithSystem = systemPrompt
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : messages

    const requestBody = {
      model,
      messages: messagesWithSystem,
      stream: !!onStream,
      temperature: 0.7,
      max_tokens: 2000
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }))
        throw new Error(error.error?.message || `API request failed with status ${response.status}`)
      }

      if (onStream) {
        return this.handleStream(response, onStream)
      } else {
        const data = await response.json()
        return data.choices[0].message.content
      }
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw error
    }
  }

  async handleStream(response, onStream) {
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''
    let fullContent = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmedLine = line.trim()
          if (!trimmedLine || trimmedLine === 'data: [DONE]') continue
          
          if (trimmedLine.startsWith('data: ')) {
            try {
              const json = JSON.parse(trimmedLine.slice(6))
              const content = json.choices?.[0]?.delta?.content
              
              if (content) {
                fullContent += content
                onStream(content, false)
              }
            } catch (e) {
              console.error('Error parsing stream data:', e)
            }
          }
        }
      }

      onStream('', true)
      return fullContent
    } catch (error) {
      console.error('Stream error:', error)
      throw error
    }
  }

  async testConnection() {
    try {
      const response = await fetch(`${this.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      })
      return response.ok
    } catch (error) {
      return false
    }
  }
}

export function createOpenAIService(apiKey) {
  return new OpenAIService(apiKey)
}
