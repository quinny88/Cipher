document.addEventListener("DOMContentLoaded", () => {
    const methodSelect = document.getElementById("methodSelect");
    const customCodeContainer = document.getElementById("customCodeContainer");
    const customCodeInput = document.getElementById("customCodeInput");
    const inputText = document.getElementById("inputText");
    const outputText = document.getElementById("outputText");
    const encodeButton = document.getElementById("encodeButton");
    const decodeButton = document.getElementById("decodeButton");
    const detectedTypeText = document.getElementById("detectedTypeText");
    const previewText = document.getElementById("previewText");
    const toggleDarkModeButton = document.getElementById("toggleDarkMode");
    const tabs = document.querySelectorAll(".tab-button");
    const tabContents = document.querySelectorAll(".tab-content");
    const detectButton = document.getElementById("detectButton");
    const autoDetectInput = document.getElementById("autoDetectInput");
    const detectResult = document.getElementById("detectResult");

    let darkMode = false;

    const ciphers = {
        caesar: {
            encode: (text) => caesarShift(text, 3),
            decode: (text) => caesarShift(text, -3)
        },
        morse: {
            encode: (text) => textToMorse(text),
            decode: (text) => morseToText(text)
        },
        base64: {
            encode: (text) => btoa(text),
            decode: (text) => atob(text)
        },
        binary: {
            encode: (text) => text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' '),
            decode: (text) => text.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('')
        },
        hex: {
            encode: (text) => text.split('').map(char => char.charCodeAt(0).toString(16)).join(' '),
            decode: (text) => text.split(' ').map(hex => String.fromCharCode(parseInt(hex, 16))).join('')
        },
        rot13: {
            encode: (text) => caesarShift(text, 13),
            decode: (text) => caesarShift(text, 13)
        },
        atbash: {
            encode: (text) => text.split('').map(char => atbash(char)).join(''),
            decode: (text) => text.split('').map(char => atbash(char)).join('')
        },
        vigenere: {
            encode: (text, key) => vigenereCipher(text, key),
            decode: (text, key) => vigenereCipher(text, key, false)
        },
        railfence: {
            encode: (text) => railFenceCipher(text, true),
            decode: (text) => railFenceCipher(text, false)
        },
        custom: {
            encode: (text, key) => customCipher(text, key),
            decode: (text, key) => customCipher(text, key, false)
        }
    };

    const caesarShift = (text, shift) => {
        return text.replace(/[a-z]/g, (char) => String.fromCharCode((char.charCodeAt(0) - 97 + shift) % 26 + 97));
    };

    const atbash = (char) => {
        return char.match(/[a-z]/i) ? String.fromCharCode(122 - char.charCodeAt(0) + 97) : char;
    };

    const vigenereCipher = (text, key, encode = true) => {
        key = key.toLowerCase().repeat(Math.ceil(text.length / key.length));
        return text.split('').map((char, i) => {
            if (char.match(/[a-z]/i)) {
                const shift = (key.charCodeAt(i) - 97) * (encode ? 1 : -1);
                return caesarShift(char, shift);
            }
            return char;
        }).join('');
    };

    const railFenceCipher = (text, encode) => {
        if (encode) {
            let result = '';
            for (let i = 0; i < 3; i++) {
                for (let j = i; j < text.length; j += 3) {
                    result += text[j];
                }
            }
            return result;
        } else {
            const length = Math.ceil(text.length / 3);
            return text.slice(0, length) + text.slice(length, 2 * length) + text.slice(2 * length);
        }
    };

    const customCipher = (text, key, encode = true) => {
        // Add your custom cipher logic here
        return text.split('').map((char, i) => {
            const shift = parseInt(key[i % key.length], 36) * (encode ? 1 : -1);
            return caesarShift(char, shift);
        }).join('');
    };

    const textToMorse = (text) => {
        const morseCode = {
            'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.', 'g': '--.', 'h': '....',
            'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..', 'm': '--', 'n': '-.', 'o': '---', 'p': '.--.',
            'q': '--.-', 'r': '.-.', 's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
            'y': '-.--', 'z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', 
            '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', ' ': '/'
        };
        return text.toLowerCase().split('').map(char => morseCode[char] || '').join(' ');
    };

    const morseToText = (morse) => {
        const textCode = {
            '.-': 'a', '-...': 'b', '-.-.': 'c', '-..': 'd', '.': 'e', '..-.': 'f', '--.': 'g', '....': 'h',
            '..': 'i', '.---': 'j', '-.-': 'k', '.-..': 'l', '--': 'm', '-.': 'n', '---': 'o', '.--.': 'p',
            '--.-': 'q', '.-.': 'r', '...': 's', '-': 't', '..-': 'u', '...-': 'v', '.--': 'w', '-..-': 'x',
            '-.--': 'y', '--..': 'z', '-----': '0', '.----': '1', '..---': '2', '...--': '3', '....-': '4', 
            '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9', '/': ' '
        };
        return morse.split(' ').map(code => textCode[code] || '').join('');
    };

    const encodeText = (text, method) => {
        if (method === "custom") {
            const key = customCodeInput.value;
            return ciphers.custom.encode(text, key);
        }
        return ciphers[method].encode(text);
    };

    const decodeText = (text, method) => {
        if (method === "custom") {
            const key = customCodeInput.value;
            return ciphers.custom.decode(text, key);
        }
        return ciphers[method].decode(text);
    };

    methodSelect.addEventListener("change", () => {
        if (methodSelect.value === "custom") {
            customCodeContainer.classList.remove("hidden");
        } else {
            customCodeContainer.classList.add("hidden");
        }
    });

    encodeButton.addEventListener("click", () => {
        outputText.value = encodeText(inputText.value, methodSelect.value);
    });

    decodeButton.addEventListener("click", () => {
        outputText.value = decodeText(inputText.value, methodSelect.value);
    });

    inputText.addEventListener("input", () => {
        previewText.textContent = encodeText(inputText.value, methodSelect.value);
    });

    toggleDarkModeButton.addEventListener("click", () => {
        darkMode = !darkMode;
        document.body.classList.toggle("dark-mode", darkMode);
    });

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            tabContents.forEach(content => content.classList.remove("active"));
            document.getElementById(tab.dataset.tab).classList.add("active");
        });
    });

    detectButton.addEventListener("click", () => {
        const input = autoDetectInput.value;
        let detectedMethod = "Unknown";
        let result = "";

        for (const method in ciphers) {
            try {
                result = decodeText(input, method);
                detectedMethod = method;
                break;
            } catch (e) {
                continue;
            }
        }

        detectResult.textContent = `Detected Method: ${detectedMethod}, Decoded Text: ${result}`;
    });

    customCodeInput.addEventListener("input", () => {
        const value = customCodeInput.value;
        if (value.length > 6) {
            customCodeInput.value = value.slice(0, 6);
        }
    });

    const codeInfoContent = document.getElementById("codeInfoContent");
    codeInfoContent.innerHTML = `
        <h3>Caesar Cipher</h3>
        <p>The Caesar Cipher is a type of substitution cipher where each letter in the plaintext is shifted by a certain number of places down or up the alphabet.</p>
        <h3>Morse Code</h3>
        <p>Morse Code is a method used in telecommunication to encode text characters as sequences of two different signal durations, called dots and dashes.</p>
        <h3>Base64</h3>
        <p>Base64 is a group of binary-to-text encoding schemes that represent binary data in an ASCII string format by translating it into a radix-64 representation.</p>
        <!-- Add more information about other ciphers here -->
    `;
});
