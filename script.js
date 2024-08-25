<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cipher Encoder/Decoder</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        input, select, textarea { margin: 10px 0; width: 300px; }
    </style>
</head>
<body>
    <h1>Cipher Encoder/Decoder</h1>
    
    <label for="inputText">Input Text:</label>
    <textarea id="inputText" rows="4"></textarea>

    <label for="methodSelect">Method:</label>
    <select id="methodSelect">
        <option value="caesar">Caesar Cipher</option>
        <option value="morse">Morse Code</option>
        <option value="base64">Base64</option>
        <option value="binary">Binary</option>
        <option value="hex">Hexadecimal</option>
        <option value="rot13">ROT13</option>
        <option value="atbash">Atbash</option>
        <option value="vigenere">Vigenère</option>
        <option value="railfence">Rail Fence</option>
    </select>

    <label for="operationSelect">Operation:</label>
    <select id="operationSelect">
        <option value="encode">Encode</option>
        <option value="decode">Decode</option>
    </select>

    <label for="additionalInput">Additional Input (e.g., shift/key):</label>
    <input type="text" id="additionalInput" placeholder="e.g., 3 for Caesar">

    <button id="applyBtn">Apply</button>

    <label for="outputText">Output Text:</label>
    <textarea id="outputText" rows="4" readonly></textarea>

    <script>
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
    </script>
</body>
</html>
