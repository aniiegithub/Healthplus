const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

/**
 * Generates a QR code buffer from a given URL or text.
 * @param {string} url - The content to encode in the QR code.
 * @returns {Promise<Buffer>} - The QR code image buffer.
 */
exports.generateQR = async (url) => {
  try {
    const qrBuffer = await QRCode.toBuffer(url, {
      type: 'png',
      width: 300, // bigger size for better scanning
      errorCorrectionLevel: 'H' // High error correction
    });
    return qrBuffer;
  } catch (err) {
    console.error('QR code generation failed:', err);
    throw err;
  }
};