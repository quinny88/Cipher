// script.js

document.getElementById('applyBtn').addEventListener('click', () => {
    const inputText = document.getElementById('inputText').value;
    const method = document.getElementById('methodSelect').value;
    const operation = document.getElementById('operationSelect').value;
    const additionalInput = document.getElementById('additionalInput').value;

    let result;
    switch (method) {
        case 'caesar':
            const shift = parseInt(additionalInput) || 3;
            result = operation === 'encode'
                ? caesarCipher(inputText, shift)
                : caesarCipher(inputText, -shift);
            break;
        case 'base64':
            result = operation === 'encode'
                ? base64Encode(inputText)
                : base64Decode(inputText);
            break;
        case 'binary':
            result = operation === 'encode'
                ? binaryEncode(inputText)
                : binaryDecode(inputText);
            break;
        case 'morse':
            result = operation === 'encode'
                ? morseEncode(inputText)
                : morseDecode(inputText);
            break;
        case 'hexadecimal':
            result = operation === 'encode'
                ? hexadecimalEncode(inputText)
                : hexadecimalDecode(inputText);
            break;
        case 'auto-detect':
            result = autoDetect(inputText, operation);
            break;
    }

    document.getElementById('outputText').value = result;
});

function caesarCipher(text, shift) {
    return text.toUpperCase().split('').map(char => {
        if (char.match(/[A-Z]/)) {
            let code = char.charCodeAt(0);
            code = ((code - 65 + shift) % 26 + 26) % 26 + 65;
            return String.fromCharCode(code);
        }
        return char;
    }).join('');
}

function base64Encode(text) {
    return btoa(text);
}

function base64Decode(text) {
    return atob(text);
}

function binaryEncode(text) {
    return text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
}

function binaryDecode(binary) {
    return binary.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
}

function morseEncode(text) {
    const morseCode = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..',
        'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
        'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
        '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', 
        '8': '---..', '9': '----.',
        ' ': ' / '
    };
    return text.toUpperCase().split('').map(char => morseCode[char] || '').join(' ');
}

function morseDecode(morse) {
    const morseCode = {
        '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I',
        '.---': 'J', '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R',
        '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y', '--..': 'Z',
        '-----': '0', '.----': '1', '..---': '2', '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7',
        '---..': '8', '----.': '9',
        '/': ' '
    };
    return morse.split(' ').map(code => morseCode[code] || '').join('');
}

function hexadecimalEncode(text) {
    return text.split('').map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
}

function hexadecimalDecode(hex) {
    return hex.split(' ').map(hex => String.fromCharCode(parseInt(hex, 16))).join('');
}

function autoDetect(text, operation) {
    // Simple auto-detection
    const binaryRegex = /^[01\s]+$/;
    const hexRegex = /^[0-9a-fA-F\s]+$/;

    if (binaryRegex.test(text)) {
        return operation === 'decode' ? binaryDecode(text) : 'Binary detected. Use encode/decode for conversion.';
    }
    if (hexRegex.test(text)) {
        return operation === 'decode' ? hexadecimalDecode(text) : 'Hexadecimal detected. Use encode/decode for conversion.';
    }
    // Additional auto-detection rules can be added here
    return 'Unknown encoding format';
}

