// prompt.js
// Builds the chat completion payload for image analysis.

/**
 * Build the OpenAI chat/completion payload for analyzing an image.
 * @param {string} base64Image - JPEG image data (base64, without data: prefix)
 * @returns {object} payload ready to POST to OpenAI's /v1/chat/completions
 */
function buildChatPayload(base64Image) {
  return {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyze this image. Provide exactly 10 abstract, poetic sets of keywords (no more than 3 words per set) describing the person, lighting, or mood.\n- Return exactly 10 single-word keywords (no extra punctuation).\n- Separate words with a single ' • ' (bullet) character.\n- Example output: 'Shadow • Glimmer • Blue'.\nReturn ONLY the keywords string with no explanation."
          },
          {
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${base64Image}` }
          }
        ]
      }
    ],
    max_tokens: 60
  };
}

module.exports = { buildChatPayload };
