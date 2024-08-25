document.addEventListener('DOMContentLoaded', () => {
    const methodSelect = document.getElementById('methodSelect');
    const customCodeSection = document.getElementById('customCodeSection');
    const customCodeInput = document.getElementById('customCode');
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const detectedType = document.getElementById('detectedType');
    const previewText = document.getElementById('previewText');
    const encodeButton = document.getElementById('encodeButton');
    const decodeButton = document.getElementById('decodeButton');
    const themeToggle = document.getElementById('themeToggle');
    const fileInput = document.getElementById('fileInput');
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackText = document.getElementById('feedbackText');
    const infoText = document.getElementById('infoText');

    let customCode = '';

    // Toggle dark mode
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    // Show/Hide custom code section
    methodSelect.addEventListener('change', () => {
        const method = methodSelect.value;
        customCodeSection.style.display = method === 'custom' ? 'block' : 'none';
        if (method !== 'custom') {
            customCodeInput.value = '';
        }
        updateInfoText(method);
    });

    // Handle file input
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                inputText.value = reader.result;
            };
            reader.readAsText(file);
        }
    });

    // Encode and decode
    encodeButton.addEventListener('click', () => {
        const method = methodSelect.value;
        const text = inputText.value;
        const customCode = customCodeInput.value || '';

        let result = '';
        switch (method) {
            case 'caesar':
                result = caesarCipher(text, parseInt(customCode, 10) || 3); // Custom shift value
                break;
            case 'morse':
                result = textToMorse(text);
                break;
            case 'base64':
                result = btoa(text);
                break;
            case 'binary':
                result = textToBinary(text);
                break;
            case 'hex':
                result = textToHex(text);
                break;
            case 'rot13':
                result = rot13(text);
                break;
            case 'atbash':
                result = atbashCipher(text);
                break;
            case 'vigenere':
                result = vigenereCipher(text, customCode);
                break;
            case 'railfence':
                result = railFence(text, parseInt(customCode, 10) || 3); // Custom number of rails
                break;
            case 'playfair':
                result = playfairCipher(text, customCode);
                break;
            case 'substitution':
                result = substitutionCipher(text, customCode);
                break;
            case 'transposition':
                result = transpositionCipher(text, customCode);
                break;
            case 'columnar':
                result = columnarTransposition(text, customCode);
                break;
            case 'scytale':
                result = scytaleCipher(text, parseInt(customCode, 10) || 5); // Custom diameter
                break;
            case 'xorcipher':
                result = xorCipher(text, customCode);
                break;
            case 'affine':
                const [a, b] = customCode.split(',').map(num => parseInt(num, 10));
                result = affineCipher(text, a, b);
                break;
            case 'keyword':
                result = keywordCipher(text, customCode);
                break;
            case 'base32':
                result = base32Encode(text);
                break;
            case 'base58':
                result = base58Encode(text);
                break;
            case 'custom':
                result = customEncodeDecode(text, customCode, true); // Encoding
                break;
            default:
                result = 'Unknown method';
        }
        outputText.textContent = result;
        detectedType.textContent = detectType(result);
        previewText.textContent = result;
    });

    decodeButton.addEventListener('click', () => {
        const method = methodSelect.value;
        const text = inputText.value;
        const customCode = customCodeInput.value || '';

        let result = '';
        switch (method) {
            case 'caesar':
                result = caesarCipher(text, -(parseInt(customCode, 10) || 3)); // Custom shift value
                break;
            case 'morse':
                result = morseToText(text);
                break;
            case 'base64':
                result = atob(text);
                break;
            case 'binary':
                result = binaryToText(text);
                break;
            case 'hex':
                result = hexToText(text);
                break;
            case 'rot13':
                result = rot13(text);
                break;
            case 'atbash':
                result = atbashCipher(text);
                break;
            case 'vigenere':
                result = vigenereCipher(text, customCode, false);
                break;
            case 'railfence':
                result = railFenceDecode(text, parseInt(customCode, 10) || 3); // Custom number of rails
                break;
            case 'playfair':
                result = playfairCipher(text, customCode, false);
                break;
            case 'substitution':
                result = substitutionCipher(text, customCode, false);
                break;
            case 'transposition':
                result = transpositionCipher(text, customCode, false);
                break;
            case 'columnar':
                result = columnarTransposition(text, customCode, false);
                break;
            case 'scytale':
                result = scytaleCipher(text, parseInt(customCode, 10) || 5, false); // Custom diameter
                break;
            case 'xorcipher':
                result = xorCipher(text, customCode, false);
                break;
            case 'affine':
                const [a, b] = customCode.split(',').map(num => parseInt(num, 10));
                result = affineCipher(text, a, b, false);
                break;
            case 'keyword':
                result = keywordCipher(text, customCode, false);
                break;
            case 'base32':
                result = base32Decode(text);
                break;
            case 'base58':
                result = base58Decode(text);
                break;
            case 'custom':
                result = customEncodeDecode(text, customCode, false); // Decoding
                break;
            default:
                result = 'Unknown method';
        }
        outputText.textContent = result;
        detectedType.textContent = detectType(result);
        previewText.textContent = result;
    });

    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your feedback!');
        feedbackText.value = '';
    });

    function updateInfoText(method) {
        const descriptions = {
            caesar: "Caesar Cipher: Shifts letters by a fixed number.",
            morse: "Morse Code: Encodes text into Morse code.",
            base64: "Base64: Encodes text into Base64 format.",
            binary: "Binary: Encodes text into binary format.",
            hex: "Hexadecimal: Encodes text into hexadecimal format.",
            rot13: "ROT13: Rotates letters by 13 places.",
            atbash: "Atbash: Reverses the alphabet.",
            vigenere: "Vigenère: Uses a keyword to encode text.",
            railfence: "Rail Fence: Writes text in a zigzag pattern.",
            playfair: "Playfair Cipher: Uses a 5x5 grid with a keyword.",
            substitution: "Substitution Cipher: Replaces characters with others.",
            transposition: "Transposition Cipher: Rearranges characters.",
            columnar: "Columnar Transposition: Uses a grid to reorder text.",
            scytale: "Scytale Cipher: Uses a cylindrical tool for encoding.",
            xorcipher: "XOR Cipher: Uses bitwise XOR for encoding.",
            affine: "Affine Cipher: Uses a mathematical function for encoding.",
            keyword: "Keyword Cipher: Uses a keyword to create a substitution alphabet.",
            base32: "Base32: Encodes text into Base32 format.",
            base58: "Base58: Encodes text into Base58 format.",
            custom: "Custom Code: Allows custom encoding/decoding based on user input."
        };
        infoText.textContent = descriptions[method] || "Select a method to see details.";
    }

    function detectType(text) {
        if (/^[01\s]+$/.test(text)) return 'Binary';
        if (/^[a-fA-F0-9\s]+$/.test(text)) return 'Hexadecimal';
        if (/^[a-zA-Z0-9+\/=]+$/.test(text)) return 'Base64';
        if (/^[\.\-\/\s]+$/.test(text)) return 'Morse Code';
        // Add more detection as needed
        return 'Plain Text';
    }

    // Define encoding/decoding functions for each method here...
    function caesarCipher(text, shift) {
        // Implement Caesar Cipher
    }

    function morseCode(text) {
        // Implement Morse Code encoding
    }

    function morseToText(text) {
        // Implement Morse Code decoding
    }

    function textToBinary(text) {
        return text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
    }

    function binaryToText(binary) {
        return binary.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
    }

    function textToHex(text) {
        return text.split('').map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
    }

    function hexToText(hex) {
        return hex.split(' ').map(hexStr => String.fromCharCode(parseInt(hexStr, 16))).join('');
    }

    function rot13(text) {
        return text.replace(/[a-zA-Z]/g, (char) => {
            const base = char <= 'Z' ? 'A' : 'a';
            return String.fromCharCode((char.charCodeAt(0) - base.charCodeAt(0) + 13) % 26 + base.charCodeAt(0));
        });
    }

    function atbashCipher(text) {
        return text.split('').map(char => {
            if (char >= 'a' && char <= 'z') return String.fromCharCode('z'.charCodeAt(0) - (char.charCodeAt(0) - 'a'.charCodeAt(0)));
            if (char >= 'A' && char <= 'Z') return String.fromCharCode('Z'.charCodeAt(0) - (char.charCodeAt(0) - 'A'.charCodeAt(0)));
            return char;
        }).join('');
    }

    function vigenereCipher(text, keyword, encode = true) {
        // Implement Vigenère Cipher
    }

    function railFence(text, rails) {
        // Implement Rail Fence Cipher
    }

    function railFenceDecode(text, rails) {
        // Implement Rail Fence Decoding
    }

    function playfairCipher(text, keyword, encode = true) {
        // Implement Playfair Cipher
    }

    function substitutionCipher(text, key, encode = true) {
        // Implement Substitution Cipher
    }

    function transpositionCipher(text, key, encode = true) {
        // Implement Transposition Cipher
    }

    function columnarTransposition(text, key, encode = true) {
        // Implement Columnar Transposition
    }

    function scytaleCipher(text, diameter, encode = true) {
        // Implement Scytale Cipher
    }

    function xorCipher(text, key, encode = true) {
        // Implement XOR Cipher
    }

    function affineCipher(text, a, b, encode = true) {
        // Implement Affine Cipher
    }

    function keywordCipher(text, keyword, encode = true) {
        // Implement Keyword Cipher
    }

    function base32Encode(text) {
        // Implement Base32 Encoding
    }

    function base32Decode(text) {
        // Implement Base32 Decoding
    }

    function base58Encode(text) {
        // Implement Base58 Encoding
    }

    function base58Decode(text) {
        // Implement Base58 Decoding
    }

    function customEncodeDecode(text, code, encode = true) {
        // Implement Custom Encoding/Decoding
    }
});
