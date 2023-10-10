import { keccak256 } from 'js-sha3';

export function toChecksumAddress(address) {
  address = address.toLowerCase().replace('0x', '');
  const hash = keccak256(address);
  let checksumAddress = '0x';

  for (let i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      checksumAddress += address[i].toUpperCase();
    } else {
      checksumAddress += address[i];
    }
  }

  return checksumAddress;
}

export function friendlyNumberFormat(num) {
  if (num < 1e3) return num.toFixed(2);
  if (num < 1e6) return (num / 1e3).toFixed(2) + 'k';
  if (num < 1e9) return (num / 1e6).toFixed(2) + 'M';
  if (num < 1e12) return (num / 1e9).toFixed(2) + 'B';
  if (num < 1e15) return (num / 1e12).toFixed(2) + 'T';
  if (num < 1e18) return (num / 1e15).toFixed(2) + 'Q';
  
  return 'Unlimited';
}