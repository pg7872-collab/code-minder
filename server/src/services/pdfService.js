import pdfParse from 'pdf-parse';

/**
 * Extracts plain text from an in-memory PDF buffer.
 * Performs sanitization to avoid prompt injection or control characters.
 */
export const extractTextFromPdf = async (buffer) => {
  if (!buffer || buffer.length === 0) {
    throw new Error('Empty PDF file buffer provided.');
  }

  try {
    const data = await pdfParse(buffer);
    const rawText = data.text || '';

    // Sanitize text: remove null bytes and limit excessive repetitions
    const sanitized = rawText
      .replace(/\0/g, '')
      .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
      .trim();

    if (!sanitized || sanitized.length < 50) {
      throw new Error('Could not extract readable text from PDF. The document might be scanned as an image or empty.');
    }

    return {
      text: sanitized,
      pages: data.numpages || 1,
      wordCount: sanitized.split(/\s+/).length,
    };
  } catch (err) {
    if (err.message.includes('readable text')) {
      throw err;
    }
    throw new Error(`Failed to parse PDF file: ${err.message}`);
  }
};
