// Dark Mode Toggle
document.getElementById('themeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});

// Real-time Preview
document.getElementById('inputText').addEventListener('input', function() {
    const inputText = this.value;
    document.getElementById('previewText').textContent = inputText;
    document.getElementById('previewArea').classList.remove('hidden');
});

// File Upload Handling
document.getElementById('uploadButton').addEventListener('click', function() {
    const file = document.getElementById('fileInput').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('inputText').value = event.target.result;
        };
        reader.readAsText(file);
    }
});

// File Download Handling
function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.getElementById('downloadLink');
    link.href = url;
    link.download = filename;
    link.textContent = 'Download Result';
    link.classList.remove('hidden');
}

// Encoding/Decoding Functions
function encode(text, method) {
    switch (method) {
        case 'caesar':
            return caesarCipher(text, 3);
        case 'morse':
            return toMorse(text);
        case 'base64':
            return btoa(text);
        case 'binary':
            return toBinary(text);
        case 'hex':
            return toHex(text);
        case 'rot13':
            return rot13(text);
        case 'atbash':
            return atbash(text);
        case 'vigenere':
            return vigenere(text, 'KEY');
        case 'railfence':
            return railFence(text, 3);
        case 'custom':
            const code = document.getElementById('customCode').value;
            return customEncode(text, code);
        default:
            return text;
    }
}

function decode(text, method) {
    switch (method) {
        case 'caesar':
            return caesarCipher(text, -3);
        case 'morse':
            return fromMorse(text);
        case 'base64':
            return atob(text);
        case 'binary':
            return fromBinary(text);
        case 'hex':
            return fromHex(text);
        case 'rot13':
            return rot13(text);
        case 'atbash':
            return atbash(text);
        case 'vigenere':
            return vigenere(text, 'KEY', true);
        case 'railfence':
            return railFence(text, 3, true);
        case 'custom':
            const code = document.getElementById('customCode').value;
            return customDecode(text, code);
        default:
            return text;
    }
}

// Example Encoding/Decoding Functions
function caesarCipher(text, shift) {
    return text.split('')
        .map(char => String.fromCharCode(((char.charCodeAt(0) - 32 + shift) % 95 + 95) % 95 + 32))
        .join('');
}

function toMorse(text) {
    const morseCode = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
        'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
        'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
        'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
        'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
        '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
        '8': '---..', '9': '----.', ' ': '/'
    };
    return text.toUpperCase().split('').map(char => morseCode[char] || '').join(' ');
}

function fromMorse(morse) {
    const morseToText = {
        '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F',
        '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L',
        '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R',
        '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X',
        '-.--': 'Y', '--..': 'Z', '-----': '0', '.----': '1', '..---': '2',
        '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7',
        '---..': '8', '----.': '9', '/': ' '
    };
    return morse.split(' ').map(code => morseToText[code] || '').join('');
}

function toBinary(text) {
    return text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
}

function fromBinary(binary) {
    return binary.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
}

function toHex(text) {
    return text.split('').map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
}

function fromHex(hex) {
    return hex.match(/.{1,2}/g).map(hex => String.fromCharCode(parseInt(hex, 16))).join('');
}

function rot13(text) {
    return text.replace(/[a-zA-Z]/g, c => String.fromCharCode(((c.charCodeAt(0) - (c < 'a' ? 65 : 97) + 13) % 26) + (c < 'a' ? 65 : 97)));
}

function atbash(text) {
    return text.replace(/[a-zA-Z]/g, c => String.fromCharCode(155 - c.charCodeAt(0)));
}

function vigenere(text, key, decode = false) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    key = key.toUpperCase();
    let result = '';
    for (let i = 0, j = 0; i < text.length; i++) {
        const c = text[i];
        if (alphabet.indexOf(c.toUpperCase()) !== -1) {
            const shift = alphabet.indexOf(key[j % key.length].toUpperCase());
            const newIndex = (alphabet.indexOf(c.toUpperCase()) + (decode ? -shift : shift) + 26) % 26;
            result += (c === c.toUpperCase() ? alphabet[newIndex] : alphabet[newIndex].toLowerCase());
            j++;
        } else {
            result += c;
        }
    }
    return result;
}

function railFence(text, numRails, decode = false) {
    if (numRails === 1) return text;
    const rails = Array.from({ length: numRails }, () => []);
    let rail = 0;
    let direction = 1;
    for (let i = 0; i < text.length; i++) {
        rails[rail].push(text[i]);
        rail += direction;
        if (rail === 0 || rail === numRails - 1) direction *= -1;
    }
    if (!decode) return rails.flat().join('');
    let result = '';
    rail = 0;
    direction = 1;
    for (let i = 0; i < text.length; i++) {
        result += rails[rail].shift();
        rail += direction;
        if (rail === 0 || rail === numRails - 1) direction *= -1;
    }
    return result;
}

function customEncode(text, code) {
    const shift = parseInt(code, 10) || 0;
    return text.split('')
        .map(char => String.fromCharCode(char.charCodeAt(0) + shift))
        .join('');
}

function customDecode(text, code) {
    const shift = parseInt(code, 10) || 0;
    return text.split('')
        .map(char => String.fromCharCode(char.charCodeAt(0) - shift))
        .join('');
}

// Handling method selection and custom code visibility
document.getElementById('methodSelect').addEventListener('change', function() {
    const method = this.value;
    document.getElementById('customCodeWrapper').style.display = (method === 'custom') ? 'block' : 'none';
    document.getElementById('customCode').value = ''; // Clear custom code input
    document.getElementById('previewArea').classList.add('hidden');
});

// Encode/Decode Button Handlers
document.getElementById('encodeButton').addEventListener('click', function() {
    const method = document.getElementById('methodSelect').value;
    const inputText = document.getElementById('inputText').value;
    const result = encode(inputText, method);
    document.getElementById('outputText').textContent = result;
    document.getElementById('detectedType').textContent = 'Detected Code Type: ' + method;
    document.getElementById('downloadLink').classList.remove('hidden');
    downloadFile(result, 'encoded.txt');
});

document.getElementById('decodeButton').addEventListener('click', function() {
    const method = document.getElementById('methodSelect').value;
    const inputText = document.getElementById('inputText').value;
    const result = decode(inputText, method);
    document.getElementById('outputText').textContent = result;
    document.getElementById('detectedType').textContent = 'Detected Code Type: ' + method;
    document.getElementById('downloadLink').classList.remove('hidden');
    downloadFile(result, 'decoded.txt');
});
