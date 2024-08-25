document.addEventListener("DOMContentLoaded", function() {
    const methodSelect = document.getElementById("methodSelect");
    const inputText = document.getElementById("inputText");
    const outputText = document.getElementById("outputText");
    const detectedType = document.getElementById("detectedType");
    const encodeButton = document.getElementById("encodeButton");
    const decodeButton = document.getElementById("decodeButton");
    const customCodeInput = document.getElementById("customCode");

    function caesarCipher(text, shift) {
        return text.split('').map(char => {
            if (char.match(/[a-z]/i)) {
                const code = char.charCodeAt();
                const shiftBase = (char.toUpperCase() === char ? 65 : 97);
                return String.fromCharCode(((code - shiftBase + shift) % 26 + 26) % 26 + shiftBase);
            }
            return char;
        }).join('');
    }

    function morseCode(text) {
        const morse = {
            'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
            'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
            'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
            'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
            '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', ', ': '--..--', '.': '.-.-.-',
            '?': '..--..', '/': '-..-.', '-': '-....-', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
            ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '/': '-..-.', '@': '.--.-', ' ': '/'
        };
        return text.toUpperCase().split('').map(char => morse[char] || char).join(' ');
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

    function binaryDecode(text) {
        return text.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
    }

    function hexEncode(text) {
        return text.split('').map(char => char.charCodeAt(0).toString(16)).join(' ');
    }

    function hexDecode(text) {
        return text.split(' ').map(hex => String.fromCharCode(parseInt(hex, 16))).join('');
    }

    function rot13(text) {
        return caesarCipher(text, 13);
    }

    function atbash(text) {
        return text.split('').map(char => {
            if (char.match(/[a-zA-Z]/)) {
                return String.fromCharCode(25 - (char.charCodeAt(0) - (char.toUpperCase() === char ? 65 : 97)) + (char.toUpperCase() === char ? 65 : 97));
            }
            return char;
        }).join('');
    }

    function vigenere(text, key) {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        text = text.toUpperCase();
        key = key.toUpperCase();
        let keyIndex = 0;

        return text.split('').map(char => {
            if (alphabet.includes(char)) {
                const textCharIndex = alphabet.indexOf(char);
                const keyCharIndex = alphabet.indexOf(key[keyIndex % key.length]);
                keyIndex++;
                return alphabet[(textCharIndex + keyCharIndex) % 26];
            }
            return char;
        }).join('');
    }

    function railFence(text, numRails) {
        let rail = Array.from({ length: numRails }, () => []);
        let dir = 1;
        let row = 0;

        for (let char of text) {
            rail[row].push(char);
            row += dir;
            if (row === 0 || row === numRails - 1) dir *= -1;
        }

        return rail.flat().join('');
    }

    function detectCodeType(text) {
        // Simple detection logic based on patterns
        if (/^[01\s]+$/.test(text)) return "Binary";
        if (/^[0-9A-F\s]+$/i.test(text)) return "Hexadecimal";
        if (/^[\s\.\-\/\|]+$/.test(text)) return "Morse Code";
        if (/^[A-Za-z\s]+$/.test(text) && /[a-zA-Z]/.test(text)) return "Plain Text";
        return "Unknown";
    }

    function encode() {
        const method = methodSelect.value;
        const text = inputText.value;

        let encodedText;
        switch (method) {
            case "caesar":
                encodedText = caesarCipher(text, 3); // Using a shift of 3 for demonstration
                break;
            case "morse":
                encodedText = morseCode(text);
                break;
            case "base64":
                encodedText = base64Encode(text);
                break;
            case "binary":
                encodedText = binaryEncode(text);
                break;
            case "hex":
                encodedText = hexEncode(text);
                break;
            case "rot13":
                encodedText = rot13(text);
                break;
            case "atbash":
                encodedText = atbash(text);
                break;
            case "vigenere":
                encodedText = vigenere(text, "KEY"); // Use a fixed key for demonstration
                break;
            case "railfence":
                encodedText = railFence(text, 3); // Using 3 rails for demonstration
                break;
            default:
                encodedText = text;
        }

        outputText.textContent = encodedText;
        detectedType.textContent = `Detected Code Type: ${detectCodeType(encodedText)}`;
    }

    function decode() {
        const method = methodSelect.value;
        const text = inputText.value;

        let decodedText;
        switch (method) {
            case "base64":
                decodedText = base64Decode(text);
                break;
            case "binary":
                decodedText = binaryDecode(text);
                break;
            case "hex":
                decodedText = hexDecode(text);
                break;
            case "morse":
                decodedText = morseCode(text); // Morse decoding function not implemented
                break;
            case "caesar":
                decodedText = caesarCipher(text, -3); // Reverse shift for Caesar
                break;
            case "rot13":
                decodedText = rot13(text);
                break;
            case "atbash":
                decodedText = atbash(text);
                break;
            case "vigenere":
                decodedText = vigenere(text, "KEY"); // Reverse Vigenère not implemented
                break;
            case "railfence":
                decodedText = railFence(text, 3); // Rail Fence decoding not implemented
                break;
            default:
                decodedText = text;
        }

        outputText.textContent = decodedText;
        detectedType.textContent = `Detected Code Type: ${detectCodeType(decodedText)}`;
    }

    encodeButton.addEventListener("click", encode);
    decodeButton.addEventListener("click", decode);
});
