const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

async function extractTextFromFile(filePath, mimeType, originalName) {
  const ext = path.extname(originalName).toLowerCase();

  // PDF
 // PDF
  // PDF
if (mimeType === 'application/pdf' || ext === '.pdf') {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfParse = require('pdf-parse');
    const data = await pdfParse(dataBuffer);
    if (!data.text || data.text.trim().length < 10) {
      throw new Error('PDF appears to be empty or image-based. Try copying the text directly.');
    }
    return { text: data.text.slice(0, 3000), type: 'pdf' };
  } catch (err) {
    throw new Error(`Could not read PDF: ${err.message}. Try a different PDF or paste the text directly.`);
  }
}

  // Word documents
  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword' || ext === '.docx' || ext === '.doc') {
    const result = await mammoth.extractRawText({ path: filePath });
    return { text: result.value, type: 'docx' };
  }

  // Plain text
  if (mimeType === 'text/plain' || ext === '.txt') {
    const text = fs.readFileSync(filePath, 'utf8');
    return { text: text.slice(0, 3000), type: 'txt' };
  }

  // CSV
  if (mimeType === 'text/csv' || ext === '.csv') {
    const text = fs.readFileSync(filePath, 'utf8');
    return { text: `CSV Data:\n${text.slice(0, 3000)}`, type: 'csv' };
  }

  // Excel
  if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      mimeType === 'application/vnd.ms-excel' || ext === '.xlsx' || ext === '.xls') {
    const XLSX = require('xlsx');
    const workbook = XLSX.readFile(filePath);
    let text = '';
    workbook.SheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      text += `Sheet: ${sheetName}\n`;
      text += XLSX.utils.sheet_to_csv(sheet) + '\n\n';
    });
    return { text: text.slice(0, 3000), type: 'xlsx' };
  }

  // PowerPoint
  if (mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
      ext === '.pptx') {
    const JSZip = require('jszip');
    const zip = await JSZip.loadAsync(fs.readFileSync(filePath));
    let text = '';
    const slideFiles = Object.keys(zip.files).filter(f => f.match(/ppt\/slides\/slide\d+\.xml/));
    for (const slideFile of slideFiles.slice(0, 20)) {
      const content = await zip.files[slideFile].async('text');
      const matches = content.match(/<a:t[^>]*>([^<]+)<\/a:t>/g) || [];
      text += matches.map(m => m.replace(/<[^>]+>/g, '')).join(' ') + '\n';
    }
    return { text: text.slice(0, 3000) || 'No text found in presentation', type: 'pptx' };
  }

  // RTF
  if (ext === '.rtf') {
    const text = fs.readFileSync(filePath, 'utf8');
    const cleaned = text.replace(/\{[^{}]*\}|\\[a-z]+\d*\s?|[{}]/g, '').trim();
    return { text: cleaned.slice(0, 3000), type: 'rtf' };
  }

  // Markdown
  if (ext === '.md' || ext === '.markdown') {
    const text = fs.readFileSync(filePath, 'utf8');
    return { text: text.slice(0, 3000), type: 'md' };
  }

  // Images
  if (mimeType.startsWith('image/')) {
    const imageData = fs.readFileSync(filePath);
    return { isImage: true, base64: imageData.toString('base64'), mimeType, type: 'image' };
  }

  throw new Error(`Unsupported file type: ${ext}`);
}

module.exports = { extractTextFromFile };