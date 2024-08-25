document.getElementById('applyBtn').addEventListener('click', () => {
    const inputText = document.getElementById('inputText').value;
    const method = document.getElementById('methodSelect').value;
    const operation = document.getElementById('operationSelect').value;
    const additionalInput = document.getElementById('additionalInput').value;

    let result = '';
    try {
        result = applyOperation(method, operation, inputText, additionalInput);
    } catch (error) {
        console.error('Error:', error);
        result = 'An error occurred. Check console for details.';
    }

    document.getElementById('outputText').value = result;
});

function applyOperation(method, operation, text, additionalInput) {
    switch (method) {
        case 'caesar':
            const shift = parseInt(additionalInput, 10) || 3;
            return operation === 'encode'
                ? caesarCipher(text, shift)
                : caesarCipher(text, -shift);
        case 'base64':
            return operation === 'encode'
                ? base64Encode(text)
                : base64Decode(text);
        case 'binary':
            return operation === 'encode'
                ? binaryEncode(text)
                : binaryDecode(text);
        case 'morse':
            return operation === 'encode'
                ? morseEncode(text)
                : morseDecode(text);
        case 'hex':
            return operation === 'encode'
                ? hexadecimalEncode(text)
                : hexadecimalDecode(text);
        case 'rot13':
            return rot13(text);
        case 'atbash':
            return atbash(text);
        case 'vigenere':
            return vigenere(text, additionalInput, operation);
        case 'railfence':
            return railFence(text, parseInt(additionalInput, 10) || 3, operation);
        case 'playfair':
            return playfair(text, additionalInput, operation);
        case 'transposition':
            return transposition(text, parseInt(additionalInput, 10) || 3, operation);
        case 'simple':
            return simpleSubstitution(text, additionalInput, operation);
        case 'custom':
            return customCipher(text, additionalInput, operation);
        case 'ascii':
            return operation === 'encode'
                ? asciiEncode(text)
                : asciiDecode(text);
        case 'url':
            return operation === 'encode'
                ? encodeURIComponent(text)
                : decodeURIComponent(text);
        case 'auto-detect':
            return autoDetect(text, operation);
        default:
            return 'Invalid method selected';
    }
}

// Caesar Cipher
function caesarCipher(text, shift) {
    if (isNaN(shift)) return 'Invalid shift value';
    return text.toUpperCase().split('').map(char => {
        if (/[A-Z]/.test(char)) {
            const code = char.charCodeAt(0);
            return String.fromCharCode(((code - 65 + shift) % 26 + 26) % 26 + 65);
        }
        return char;
    }).join('');
}

// ROT13
function rot13(text) {
    return text.replace(/[A-Za-z]/g, char =>
        String.fromCharCode(((char.charCodeAt(0) - (char < 'a' ? 65 : 97) + 13) % 26) + (char < 'a' ? 65 : 97))
    );
}

// Atbash Cipher
function atbash(text) {
    return text.toUpperCase().split('').map(char => {
        if (/[A-Z]/.test(char)) {
            return String.fromCharCode(155 - char.charCodeAt(0));
        }
        return char;
    }).join('');
}

// Vigenère Cipher
function vigenere(text, key, operation) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    key = key.toUpperCase().replace(/[^A-Z]/g, '');
    let result = '';
    let keyIndex = 0;

    text = text.toUpperCase().replace(/[^A-Z]/g, '');

    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        if (alphabet.includes(char)) {
            const shift = alphabet.indexOf(key[keyIndex % key.length]);
            const newIndex = (alphabet.indexOf(char) + (operation === 'encode' ? shift : -shift) + 26) % 26;
            result += alphabet[newIndex];
            keyIndex++;
        } else {
            result += char;
        }
    }
    return result;
}

// Rail Fence Cipher
function railFence(text, numRails, operation) {
    if (numRails < 2) return 'Number of rails must be 2 or greater';
    text = text.replace(/[^A-Z]/gi, '');
    if (operation === 'encode') {
        const rails = Array.from({ length: numRails }, () => []);
        let rail = 0;
        let direction = 1;

        for (const char of text) {
            rails[rail].push(char);
            rail += direction;
            if (rail === 0 || rail === numRails - 1) direction *= -1;
        }
        return rails.flat().join('');
    } else { // decode
        const rails = Array.from({ length: numRails }, () => []);
        let rail = 0;
        let direction = 1;

        for (let i = 0; i < text.length; i++) {
            rails[rail].push('*');
            rail += direction;
            if (rail === 0 || rail === numRails - 1) direction *= -1;
        }

        let index = 0;
        for (let r = 0; r < numRails; r++) {
            for (let c = 0; c < rails[r].length; c++) {
                if (rails[r][c] === '*') {
                    rails[r][c] = text[index++];
                }
            }
        }

        let result = '';
        rail = 0;
        direction = 1;
        for (let i = 0; i < text.length; i++) {
            result += rails[rail][i];
            rail += direction;
            if (rail === 0 || rail === numRails - 1) direction *= -1;
        }
        return result;
    }
}

// Playfair Cipher (a simplified version)
function playfair(text, key, operation) {
    // For simplicity, this example uses a fixed key and doesn't fully implement the Playfair cipher
    // Full implementation would be more complex and is omitted for brevity
    return operation === 'encode' ? text : text; // Placeholder logic
}

// Transposition Cipher
function transposition(text, numCols, operation) {
    if (numCols < 2) return 'Number of columns must be 2 or greater';
    text = text.replace(/\s+/g, '');
    const numRows = Math.ceil(text.length / numCols);
    let result = '';

    if (operation === 'encode') {
        for (let i = 0; i < numCols; i++) {
            for (let j = 0; j < numRows; j++) {
                const index = j * numCols + i;
                if (index < text.length) result += text[index];
            }
        }
        return result;
    } else { // decode
        let grid = '';
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                const index = j * numRows + i;
                if (index < text.length) grid += text[index];
            }
        }
        return grid;
    }
}

// Simple Substitution Cipher (Example: ROT13)
function simpleSubstitution(text, key, operation) {
    // For simplicity, this example uses a fixed key and doesn't fully implement substitution
    // Full implementation would require a more complex approach
    return operation === 'encode' ? text : text; // Placeholder logic
}

// Custom Cipher
function customCipher(text, key, operation) {
    // Placeholder for a custom cipher logic
    return operation === 'encode' ? text : text; // Placeholder logic
}

// ASCII Encoding/Decoding
function asciiEncode(text) {
    return text.split('').map(char => char.charCodeAt(0)).join(' ');
}

function asciiDecode(ascii) {
    return ascii.split(' ').map(code => String.fromCharCode(parseInt(code, 10))).join('');
}

// Base64 Encoding/Decoding
function base64Encode(text) {
    try {
        return btoa(unescape(encodeURIComponent(text)));
    } catch (error) {
        return 'Error encoding to Base64';
    }
}

function base64Decode(text) {
    try {
        return decodeURIComponent(escape(atob(text)));
    } catch (error) {
        return 'Error decoding from Base64';
    }
}

// Binary Encoding/Decoding
function binaryEncode(text) {
    return text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
}

function binaryDecode(binary) {
    return binary.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
}

// Morse Encoding/Decoding
function morseEncode(text) {
    const morseCode = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..',
        'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
        'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
        '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', 
        '8': '---..', '9': '----.', ' ': ' / '
    };
    return text.toUpperCase().split('').map(char => morseCode[char] || '').join(' ');
}

function morseDecode(morse) {
    const morseCode = {
        '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I',
        '.---': 'J', '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R',
        '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y', '--..': 'Z',
        '-----': '0', '.----': '1', '..---': '2', '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7',
        '---..': '8', '----.': '9', '/': ' '
    };
    return morse.split(' ').map(code => morseCode[code] || '').join('');
}

// Hexadecimal Encoding/Decoding
function hexadecimalEncode(text) {
    return text.split('').map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
}

function hexadecimalDecode(hex) {
    return hex.split(' ').map(hex => String.fromCharCode(parseInt(hex, 16))).join('');
}

// Auto Detect
function autoDetect(text, operation) {
    const binaryRegex = /^[01\s]+$/;
    const hexRegex = /^[0-9a-fA-F\s]+$/;
    const asciiRegex = /^\d+(\s\d+)*$/;

    if (binaryRegex.test(text)) {
        return operation === 'decode' ? binaryDecode(text) : 'Binary detected. Use encode/decode for conversion.';
    }
    if (hexRegex.test(text)) {
        return operation === 'decode' ? hexadecimalDecode(text) : 'Hexadecimal detected. Use encode/decode for conversion.';
    }
    if (asciiRegex.test(text)) {
        return operation === 'decode' ? asciiDecode(text) : 'ASCII detected. Use encode/decode for conversion.';
    }
    // Additional auto-detection rules can be added here
    return 'Unknown encoding format';
}

