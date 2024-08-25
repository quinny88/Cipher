document.addEventListener('DOMContentLoaded', () => {
    const encodeBtn = document.getElementById('encodeBtn');
    const methodSelect = document.getElementById('methodSelect');
    const operationSelect = document.getElementById('operationSelect');
    const settingsContainer = document.getElementById('settings');

    function updateSettingsUI() {
        const method = methodSelect.value;
        settingsContainer.innerHTML = ''; // Clear previous settings
        
        if (method === 'caesar') {
            settingsContainer.innerHTML = `
                <label for="caesarShift">Caesar Shift:</label>
                <input type="number" id="caesarShift" value="3">
            `;
        } else if (method === 'vigenere') {
            settingsContainer.innerHTML = `
                <label for="vigenereKey">Vigenère Key:</label>
                <input type="text" id="vigenereKey" placeholder="Enter key here">
            `;
        } else if (method === 'railfence') {
            settingsContainer.innerHTML = `
                <label for="railFenceLevel">Rail Fence Levels:</label>
                <input type="number" id="railFenceLevel" value="3">
            `;
        } else if (method === 'playfair') {
            settingsContainer.innerHTML = `
                <label for="playfairKey">Playfair Key:</label>
                <input type="text" id="playfairKey" placeholder="Enter key here">
            `;
        } else if (method === 'transposition') {
            settingsContainer.innerHTML = `
                <label for="transpositionKey">Transposition Key:</label>
                <input type="text" id="transpositionKey" placeholder="Enter key here">
            `;
        }
        // Additional settings for other methods can be added here
    }

    methodSelect.addEventListener('change', updateSettingsUI);
    updateSettingsUI();

    encodeBtn.addEventListener('click', function() {
        const text = document.getElementById('inputText').value;
        const method = methodSelect.value;
        const operation = operationSelect.value;
        let resultText;

        switch(method) {
            case 'caesar':
                const shift = parseInt(document.getElementById('caesarShift').value, 10);
                resultText = caesarCipher(text, shift, operation);
                break;
            case 'base64':
                resultText = base64EncodeDecode(text, operation);
                break;
            case 'hex':
                resultText = hexEncodeDecode(text, operation);
                break;
            case 'morse':
                resultText = morseEncodeDecode(text, operation);
                break;
            case 'rot13':
                resultText = rot13(text, operation);
                break;
            case 'atbash':
                resultText = atbash(text, operation);
                break;
            case 'vigenere':
                const vigenereKey = document.getElementById('vigenereKey').value;
                resultText = vigenereCipher(text, vigenereKey, operation);
                break;
            case 'binary':
                resultText = binaryEncodeDecode(text, operation);
                break;
            case 'ascii':
                resultText = asciiEncodeDecode(text, operation);
                break;
            case 'url':
                resultText = urlEncodeDecode(text, operation);
                break;
            case 'railfence':
                const railFenceLevel = parseInt(document.getElementById('railFenceLevel').value, 10);
                resultText = railFenceCipher(text, railFenceLevel, operation);
                break;
            case 'playfair':
                const playfairKey = document.getElementById('playfairKey').value;
                resultText = playfairCipher(text, playfairKey, operation);
                break;
            case 'transposition':
                const transpositionKey = document.getElementById('transpositionKey').value;
                resultText = transpositionCipher(text, transpositionKey, operation);
                break;
            case 'custom':
                resultText = customEncodeDecode(text, operation);
                break;
            case 'auto-detect':
                resultText = autoDetectAndDecode(text);
                break;
            default:
                resultText = 'Unsupported encoding';
        }
        
        document.getElementById('outputText').value = resultText;
    });

    // Caesar Cipher
    function caesarCipher(text, shift, operation) {
        shift = operation === 'decode' ? -shift : shift;
        return text.replace(/[a-z]/gi, (char) => {
            const base = char < 'a' ? 65 : 97;
            return String.fromCharCode((char.charCodeAt(0) - base + shift + 26) % 26 + base);
        });
    }

    // Base64 Encoding/Decoding
    function base64EncodeDecode(text, operation) {
        try {
            return operation === 'encode' ? btoa(text) : atob(text);
        } catch (e) {
            return 'Invalid Base64 input';
        }
    }

    // Hexadecimal Encoding/Decoding
    function hexEncodeDecode(text, operation) {
        if (operation === 'decode' && /^[0-9a-f\s]+$/i.test(text)) {
            return text.split(' ').map(hex => String.fromCharCode(parseInt(hex, 16))).join('');
        } else if (operation === 'encode') {
            return text.split('').map(char => char.charCodeAt(0).toString(16)).join(' ');
        }
        return 'Invalid Hex input';
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

    function morseEncodeDecode(text, operation) {
        if (operation === 'decode' && /^[.\-/ ]+$/.test(text)) {
            return text.split(' ').map(morse => reverseMorseCodeMap[morse] || '?').join('');
        } else if (operation === 'encode') {
            return text.toUpperCase().split('').map(char => morseCodeMap[char] || '?').join(' ');
        }
        return 'Invalid Morse input';
    }

    // ROT13 Encoding/Decoding
    function rot13(text, operation) {
        return caesarCipher(text, 13, operation);
    }

    // Atbash Cipher
    function atbash(text, operation) {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return text.toUpperCase().split('').map(char => {
            const index = alphabet.indexOf(char);
            return index >= 0 ? alphabet[25 - index] : char;
        }).join('');
    }

    // Vigenère Cipher
    function vigenereCipher(text, key, operation) {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        key = key.toUpperCase().repeat(Math.ceil(text.length / key.length)).slice(0, text.length);
        return text.toUpperCase().split('').map((char, i) => {
            if (alphabet.indexOf(char) >= 0) {
                const shift = alphabet.indexOf(key[i]);
                const base = operation === 'encode' ? (alphabet.indexOf(char) + shift) % 26 : (alphabet.indexOf(char) - shift + 26) % 26;
                return alphabet[base];
            }
            return char;
        }).join('');
    }

    // Binary Encoding/Decoding
    function binaryEncodeDecode(text, operation) {
        if (operation === 'decode') {
            return text.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
        } else {
            return text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
        }
    }

    // ASCII Encoding/Decoding
    function asciiEncodeDecode(text, operation) {
        if (operation === 'decode') {
            return text.split(' ').map(ascii => String.fromCharCode(parseInt(ascii, 10))).join('');
        } else {
            return text.split('').map(char => char.charCodeAt(0).toString(10)).join(' ');
        }
    }

    // URL Encoding/Decoding
    function urlEncodeDecode(text, operation) {
        return operation === 'encode' ? encodeURIComponent(text) : decodeURIComponent(text);
    }

    // Rail Fence Cipher
    function railFenceCipher(text, level, operation) {
        if (operation === 'encode') {
            const rails = Array.from({ length: level }, () => []);
            let rail = 0;
            let direction = 1;
            for (const char of text) {
                rails[rail].push(char);
                rail += direction;
                if (rail === 0 || rail === level - 1) direction *= -1;
            }
            return rails.flat().join('');
        } else {
            const length = text.length;
            const rails = Array.from({ length: level }, () => []);
            let rail = 0;
            let direction = 1;
            for (let i = 0; i < length; i++) {
                rails[rail].push(null);
                rail += direction;
                if (rail === 0 || rail === level - 1) direction *= -1;
            }
            let index = 0;
            for (rail = 0; rail < level; rail++) {
                for (let j = 0; j < rails[rail].length; j++) {
                    rails[rail][j] = text[index++];
                }
            }
            let result = '';
            rail = 0;
            direction = 1;
            for (let i = 0; i < length; i++) {
                result += rails[rail].shift();
                rail += direction;
                if (rail === 0 || rail === level - 1) direction *= -1;
            }
            return result;
        }
    }

    // Playfair Cipher
    function playfairCipher(text, key, operation) {
        // Example implementation (simplified)
        const grid = generatePlayfairGrid(key);
        text = text.toUpperCase().replace(/J/g, 'I').match(/.{1,2}/g) || [];
        if (text.length % 2 === 1) text.push(text.pop() + 'X');
        return text.map(pair => {
            const [a, b] = pair.split('');
            const [aRow, aCol] = findPosition(grid, a);
            const [bRow, bCol] = findPosition(grid, b);
            if (aRow === bRow) return grid[aRow][(aCol + (operation === 'encode' ? 1 : -1) + 5) % 5] + grid[bRow][(bCol + (operation === 'encode' ? 1 : -1) + 5) % 5];
            if (aCol === bCol) return grid[(aRow + (operation === 'encode' ? 1 : -1) + 5) % 5][aCol] + grid[(bRow + (operation === 'encode' ? 1 : -1) + 5) % 5][bCol];
            return grid[aRow][bCol] + grid[bRow][aCol];
        }).join('');
    }

    function generatePlayfairGrid(key) {
        const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
        const seen = new Set();
        const grid = [];
        for (const char of (key + alphabet).toUpperCase()) {
            if (!seen.has(char) && char !== 'J') {
                seen.add(char);
                grid.push(char);
            }
        }
        return chunkArray(grid, 5);
    }

    function findPosition(grid, char) {
        for (let r = 0; r < 5; r++) {
            const c = grid[r].indexOf(char);
            if (c >= 0) return [r, c];
        }
    }

    function chunkArray(array, size) {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    }

    // Transposition Cipher
    function transpositionCipher(text, key, operation) {
        // Example implementation (simplified)
        key = parseInt(key, 10);
        const columns = Math.ceil(text.length / key);
        const paddedLength = columns * key;
        const paddedText = text.padEnd(paddedLength, ' ');
        let result = '';
        for (let i = 0; i < key; i++) {
            for (let j = i; j < paddedLength; j += key) {
                result += paddedText[j];
            }
        }
        return operation === 'decode' ? decodeTransposition(result, key, paddedLength) : result;
    }

    function decodeTransposition(text, key, length) {
        const columns = Math.ceil(length / key);
        let result = '';
        for (let i = 0; i < columns; i++) {
            for (let j = i; j < text.length; j += columns) {
                result += text[j];
            }
        }
        return result.trim();
    }

    // Custom Encoding/Decoding (User-defined)
    function customEncodeDecode(text, operation) {
        const customMap = {
            'A': '1', 'B': '2', 'C': '3', 'D': '4', 'E': '5', 'F': '6', 'G': '7',
            'H': '8', 'I': '9', 'J': '10', 'K': '11', 'L': '12', 'M': '13', 'N': '14',
            'O': '15', 'P': '16', 'Q': '17', 'R': '18', 'S': '19', 'T': '20', 'U': '21',
            'V': '22', 'W': '23', 'X': '24', 'Y': '25', 'Z': '26', ' ': '0'
        };
        if (operation === 'decode') {
            const reverseMap = Object.fromEntries(Object.entries(customMap).map(([k, v]) => [v, k]));
            return text.split(' ').map(code => reverseMap[code] || '?').join('');
        } else if (operation === 'encode') {
            return text.toUpperCase().split('').map(char => customMap[char] || '?').join(' ');
        }
        return 'Invalid Custom input';
    }

    // Auto-detection and Decoding
    function autoDetectAndDecode(text) {
        if (/^[0-9a-f ]+$/i.test(text)) {
            return hexEncodeDecode(text, 'decode');
        } else if (/^[A-Za-z0-9+/=]+$/.test(text)) {
            return base64EncodeDecode(text, 'decode');
        } else if (/^[.\-/ ]+$/.test(text)) {
            return morseEncodeDecode(text, 'decode');
        } else if (/^[01\s]+$/.test(text)) {
            return binaryEncodeDecode(text, 'decode');
        } else if (/^[0-9\s]+$/.test(text)) {
            return asciiEncodeDecode(text, 'decode');
        } else {
            return caesarCipher(text, -3, 'decode'); // Default to Caesar Cipher with shift of -3
        }
    }
});
