document.getElementById('encodeBtn').addEventListener('click', function() {
    const text = document.getElementById('inputText').value;
    const method = document.getElementById('methodSelect').value;
    
    let outputText;

    switch(method) {
        case 'caesar':
            outputText = caesarCipher(text, 3); // Example shift of 3
            break;
        case 'base64':
            outputText = base64EncodeDecode(text);
            break;
        case 'hex':
            outputText = hexEncodeDecode(text);
            break;
        case 'morse':
            outputText = morseEncodeDecode(text);
            break;
        case 'custom':
            outputText = customEncodeDecode(text);
            break;
        case 'auto-detect':
            outputText = autoDetectAndDecode(text);
            break;
        default:
            outputText = 'Unsupported encoding';
    }
    
    document.getElementById('outputText').value = outputText;
});

// Caesar Cipher
function caesarCipher(text, shift) {
    return text.replace(/[a-z]/gi, (char) =>
        String.fromCharCode((char.charCodeAt(0) - (char.toLowerCase() < 'a' ? 65 : 97) + shift) % 26 + (char.toLowerCase() < 'a' ? 65 : 97))
    );
}

// Base64 Encoding/Decoding
function base64EncodeDecode(text) {
    try {
        if (btoa(atob(text)) === text) {
            return atob(text); // Decode
        }
    } catch (e) {}
    return btoa(text); // Encode
}

// Hexadecimal Encoding/Decoding
function hexEncodeDecode(text) {
    if (/^[0-9a-f]+$/i.test(text.replace(/\s+/g, ''))) {
        // Decode
        return text.split(' ').map(hex => String.fromCharCode(parseInt(hex, 16))).join('');
    } else {
        // Encode
        return text.split('').map(char => char.charCodeAt(0).toString(16)).join(' ');
    }
}

// Morse Code Encoding/Decoding
const morseCodeMap = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.',
    'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.',
    'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-',
    'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..', '1': '.----',
    '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.', '0': '-----', ' ': '/', '.': '.-.-.-', ',': '--..--'
};
const reverseMorseCodeMap = Object.fromEntries(Object.entries(morseCodeMap).map(([k, v]) => [v, k]));

function morseEncodeDecode(text) {
    if (/^[.\-/ ]+$/.test(text)) {
        // Decode
        return text.split(' ').map(morse => reverseMorseCodeMap[morse] || '?').join('');
    } else {
        // Encode
        return text.toUpperCase().split('').map(char => morseCodeMap[char] || '?').join(' ');
    }
}

// Custom Encoding/Decoding (User-defined)
function customEncodeDecode(text) {
    // Example: Implement your own custom encoding/decoding logic here
    const customMap = { 'A': '1', 'B': '2', 'C': '3' }; // Example custom map
    const reverseCustomMap = Object.fromEntries(Object.entries(customMap).map(([k, v]) => [v, k]));

    if (Object.values(customMap).includes(text[0])) {
        // Decode
        return text.split('').map(char => reverseCustomMap[char] || '?').join('');
    } else {
        // Encode
        return text.split('').map(char => customMap[char] || '?').join('');
    }
}

// Auto-detection and Decoding
function autoDetectAndDecode(text) {
    if (/^[0-9a-f ]+$/i.test(text)) {
        return hexEncodeDecode(text);
    } else if (/^[A-Za-z0-9+/=]+$/.test(text)) {
        return base64EncodeDecode(text);
    } else if (/^[.\-/ ]+$/.test(text)) {
        return morseEncodeDecode(text);
    } else {
        return caesarCipher(text, -3); // Assume Caesar Cipher with shift of -3
    }
}
