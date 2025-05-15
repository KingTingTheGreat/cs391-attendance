import { INPUT_TEMP_CODE_LENGTH, INPUT_TEMP_CODE_NUM_DIGITS } from "./env";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function base32EncodeBuffer(input: Buffer<ArrayBufferLike>) {
  let bits = 0;
  let value = 0;
  let output = "";

  for (let i = 0; i < input.length; i++) {
    value = (value << 8) | input[i];
    bits += 8;

    while (bits >= 5) {
      output += chars[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += chars[(value << (5 - bits)) & 31];
  }

  return output;
}

export function digitsToBase32Code(input: number): string {
  let output = "";
  do {
    output = chars[input % 32] + output;
    input = Math.floor(input / 32);
  } while (input > 0);
  return output.padStart(INPUT_TEMP_CODE_LENGTH, "A");
}

export function base32CodeToDigits(code: string): string | null {
  let num = 0;
  for (let i = 0; i < code.length; i++) {
    const val = chars.indexOf(code[i].toUpperCase());
    if (val === -1) {
      return null;
    }
    num = num * 32 + val;
  }
  return num.toString().padStart(INPUT_TEMP_CODE_NUM_DIGITS, "0");
}
