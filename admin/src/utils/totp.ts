/**
 * Standard RFC 6238 TOTP (Time-based One-Time Password) Verification Utility.
 * Compatible with Google Authenticator, Microsoft Authenticator, Authy, and 1Password.
 * Uses the Web Cryptography API (crypto.subtle) without external dependencies.
 */

const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/**
 * Decodes a Base32 string into a Uint8Array.
 */
function base32ToBytes(base32: string): Uint8Array {
  const clean = base32.toUpperCase().replace(/[\s=-]/g, '');
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < clean.length; i++) {
    const idx = BASE32_CHARS.indexOf(clean[i]);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return new Uint8Array(bytes);
}

/**
 * Generates a 6-digit TOTP code for a given counter using HMAC-SHA1.
 */
async function generateHOTP(secretBytes: Uint8Array, counter: number): Promise<string> {
  const counterBuffer = new ArrayBuffer(8);
  const counterView = new DataView(counterBuffer);
  // High 32 bits are 0, low 32 bits are counter
  counterView.setUint32(4, counter, false);

  const key = await crypto.subtle.importKey(
    'raw',
    secretBytes as unknown as BufferSource,
    { name: 'HMAC', hash: { name: 'SHA-1' } },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, counterBuffer);
  const hash = new Uint8Array(signature);

  const offset = hash[hash.length - 1] & 0x0f;
  const binary =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff);

  const otp = binary % 1000000;
  return otp.toString().padStart(6, '0');
}

/**
 * Verifies a 6-digit TOTP token against a Base32 secret key.
 * Allows a +/- 1 step (30-second) drift window to accommodate client clock differences.
 */
export async function verifyTOTP(token: string, base32Secret: string, stepSeconds = 30): Promise<boolean> {
  const cleanToken = token.trim();
  if (cleanToken.length !== 6 || !/^\d+$/.test(cleanToken)) {
    return false;
  }

  try {
    const secretBytes = base32ToBytes(base32Secret);
    const nowSec = Math.floor(Date.now() / 1000);
    const currentCounter = Math.floor(nowSec / stepSeconds);

    // Check current step, previous step (-30s), and next step (+30s)
    for (let offset = -1; offset <= 1; offset++) {
      const generated = await generateHOTP(secretBytes, currentCounter + offset);
      if (generated === cleanToken) {
        return true;
      }
    }
    return false;
  } catch (err) {
    console.error('TOTP verification error:', err);
    return false;
  }
}

/**
 * Generates an otpauth:// URI string for setting up Google Authenticator via QR code.
 */
export function getTOTPUri(accountName: string, issuer: string, base32Secret: string): string {
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedAccount = encodeURIComponent(accountName);
  return `otpauth://totp/${encodedIssuer}:${encodedAccount}?secret=${base32Secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
}
