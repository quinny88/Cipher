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
        case 'hexadecimal':
            return operation === 'encode'
                ? hexadecimalEncode(text)
                : hexadecimalDecode(text);
        case 'auto-detect':
            return autoDetect(text, operation);
        default:
            return 'Invalid method selected';
    }
}

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

function hexadecimalEncode(text) {
    return text.split('').map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
}

function hexadecimalDecode(hex) {
    return hex.split(' ').map(hex => String.fromCharCode(parseInt(hex, 16))).join('');
}

function autoDetect(text, operation) {
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


