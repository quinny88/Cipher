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
        affine: {
            encode: (text) => affineCipher(text, true),
            decode: (text) => affineCipher(text, false)
        },
        baconian: {
            encode: (text) => baconianCipher(text, true),
            decode: (text) => baconianCipher(text, false)
        },
        beaufort: {
            encode: (text, key) => beaufortCipher(text, key, true),
            decode: (text, key) => beaufortCipher(text, key, false)
        },
        playfair: {
            encode: (text, key) => playfairCipher(text, key, true),
            decode: (text, key) => playfairCipher(text, key, false)
        },
        polybius: {
            encode: (text) => polybiusSquare(text, true),
            decode: (text) => polybiusSquare(text, false)
        },
        scytale: {
            encode: (text, key) => scytaleCipher(text, key, true),
            decode: (text, key) => scytaleCipher(text, key, false)
        },
        substitution: {
            encode: (text, key) => substitutionCipher(text, key, true),
            decode: (text, key) => substitutionCipher(text, key, false)
        },
        hill: {
            encode: (text, key) => hillCipher(text, key, true),
            decode: (text, key) => hillCipher(text, key, false)
        },
        xor: {
            encode: (text, key) => xorCipher(text, key, true),
            decode: (text, key) => xorCipher(text, key, false)
        },
        custom: {
            encode: (text, key) => customCipher(text, key, true),
            decode: (text, key) => customCipher(text, key, false)
        }
    };

    const caesarShift = (text, shift) => {
        return text.split('').map(char => {
            const code = char.charCodeAt(0);
            if (code >= 65 && code <= 90) {
                return String.fromCharCode(((code - 65 + shift) % 26 + 26) % 26 + 65);
            } else if (code >= 97 && code <= 122) {
                return String.fromCharCode(((code - 97 + shift) % 26 + 26) % 26 + 97);
            }
            return char;
        }).join('');
    };

    const atbash = (char) => {
        return char.match(/[a-z]/i) ? String.fromCharCode(char.charCodeAt(0) >= 97 ?
            (219 - char.charCodeAt(0)) : (155 - char.charCodeAt(0))) : char;
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

    const affineCipher = (text, encode) => {
        const a = 5, b = 8, m = 26;
        if (encode) {
            return text.split('').map(char => {
                const code = char.charCodeAt(0) - 97;
                return String.fromCharCode(((a * code + b) % m) + 97);
            }).join('');
        } else {
            const aInv = 21;
            return text.split('').map(char => {
                const code = char.charCodeAt(0) - 97;
                return String.fromCharCode(((aInv * (code - b)) % m + m) % m + 97);
            }).join('');
        }
    };

    const baconianCipher = (text, encode) => {
        const baconianMap = {
            'a': 'AAAAA', 'b': 'AAAAB', 'c': 'AAABA', 'd': 'AAABB', 'e': 'AABAA',
            'f': 'AABAB', 'g': 'AABBA', 'h': 'AABBB', 'i': 'ABAAA', 'j': 'ABAAB',
            'k': 'ABABA', 'l': 'ABABB', 'm': 'ABBAA', 'n': 'ABBAB', 'o': 'ABBBA',
            'p': 'ABBBB', 'q': 'BAAAA', 'r': 'BAAAB', 's': 'BAABA', 't': 'BAABB',
            'u': 'BABAA', 'v': 'BABAB', 'w': 'BABBA', 'x': 'BABBB', 'y': 'BBAAA',
            'z': 'BBAAB'
        };
        if (encode) {
            return text.toLowerCase().split('').map(char => baconianMap[char] || char).join(' ');
        } else {
            const reverseBaconianMap = Object.entries(baconianMap).reduce((acc, [k, v]) => {
                acc[v] = k;
                return acc;
            }, {});
            return text.split(' ').map(code => reverseBaconianMap[code] || code).join('');
        }
    };

    const beaufortCipher = (text, key) => {
        return vigenereCipher(text, key, false).split('').map(char => {
            return String.fromCharCode(26 - (char.charCodeAt(0) - 97) + 97);
        }).join('');
    };

    const playfairCipher = (text, key, encode = true) => {
        const size = 5;
        let matrix = '';
        key += 'abcdefghiklmnopqrstuvwxyz'; // note that j is removed
        for (let i = 0; i < key.length; i++) {
            if (matrix.indexOf(key[i]) === -1) {
                matrix += key[i];
            }
        }
        const bigram = text.match(/(.{1,2})/g).map(pair => {
            if (pair.length === 1) return pair + 'x';
            return pair[0] === pair[1] ? pair[0] + 'x' : pair;
        });
        return bigram.map(pair => {
            const i1 = matrix.indexOf(pair[0]), i2 = matrix.indexOf(pair[1]);
            const r1 = Math.floor(i1 / size), c1 = i1 % size, r2 = Math.floor(i2 / size), c2 = i2 % size;
            if (r1 === r2) return matrix[r1 * size + (c1 + (encode ? 1 : -1) + size) % size] + matrix[r2 * size + (c2 + (encode ? 1 : -1) + size) % size];
            if (c1 === c2) return matrix[((r1 + (encode ? 1 : -1) + size) % size) * size + c1] + matrix[((r2 + (encode ? 1 : -1) + size) % size) * size + c2];
            return matrix[r1 * size + c2] + matrix[r2 * size + c1];
        }).join('');
    };

    const polybiusSquare = (text, encode) => {
        const size = 5;
        const square = 'abcdefghiklmnopqrstuvwxyz'; // j is omitted
        if (encode) {
            return text.split('').map(char => {
                const index = square.indexOf(char);
                if (index === -1) return char;
                const row = Math.floor(index / size) + 1;
                const col = (index % size) + 1;
                return row.toString() + col.toString();
            }).join(' ');
        } else {
            return text.match(/.{1,2}/g).map(pair => {
                const row = parseInt(pair[0]) - 1;
                const col = parseInt(pair[1]) - 1;
                return square[row * size + col];
            }).join('');
        }
    };

    const scytaleCipher = (text, key, encode = true) => {
        if (encode) {
            let result = '';
            for (let i = 0; i < key; i++) {
                for (let j = i; j < text.length; j += key) {
                    result += text[j];
                }
            }
            return result;
        } else {
            const length = Math.ceil(text.length / key);
            return text.slice(0, length) + text.slice(length, 2 * length) + text.slice(2 * length);
        }
    };

    const substitutionCipher = (text, key, encode = true) => {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        if (encode) {
            return text.split('').map(char => {
                const index = alphabet.indexOf(char);
                return index !== -1 ? key[index] : char;
            }).join('');
        } else {
            return text.split('').map(char => {
                const index = key.indexOf(char);
                return index !== -1 ? alphabet[index] : char;
            }).join('');
        }
    };

    const hillCipher = (text, key, encode = true) => {
        // Simplified example, key should be a matrix
        const matrix = [[3, 3], [2, 5]]; // example 2x2 matrix
        const mod = 26;
        return text.match(/.{1,2}/g).map(pair => {
            const vec = pair.split('').map(char => char.charCodeAt(0) - 97);
            const resultVec = [
                (matrix[0][0] * vec[0] + matrix[0][1] * vec[1]) % mod,
                (matrix[1][0] * vec[0] + matrix[1][1] * vec[1]) % mod
            ];
            return String.fromCharCode(resultVec[0] + 97) + String.fromCharCode(resultVec[1] + 97);
        }).join('');
    };

    const xorCipher = (text, key) => {
        return text.split('').map((char, i) => String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))).join('');
    };

    const customCipher = (text, key, encode = true) => {
        const shift = parseInt(key, 36) % 26;
        return caesarShift(text, encode ? shift : -shift);
    };

    const populateInfoTab = () => {
        const infoContent = document.getElementById("codeInfoContent");
        infoContent.innerHTML = Object.keys(ciphers).map(cipher => {
            return `<h3>${cipher.toUpperCase()} Cipher</h3><p>${cipherDescriptions[cipher]}</p>`;
        }).join('');
    };

    const cipherDescriptions = {
        caesar: "A Caesar cipher shifts each letter of the text by a fixed number of positions in the alphabet.",
        morse: "Morse code is a method used in telecommunication to encode text characters as sequences of two different signal durations, called dots and dashes.",
        base64: "Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format by translating it into a radix-64 representation.",
        binary: "Binary code is a coding system using the binary digits 0 and 1 to represent a letter, digit, or other character in a computer or other electronic device.",
        hex: "Hexadecimal is a base-16 number system that uses 16 symbols: the numbers 0 to 9 and the letters A to F.",
        rot13: "ROT13 is a simple substitution cipher that shifts each letter by 13 places in the alphabet.",
        atbash: "Atbash is a substitution cipher where the letters of the alphabet are reversed.",
        vigenere: "Vigenère cipher uses a keyword to apply multiple Caesar ciphers to the text.",
        railfence: "Rail Fence Cipher is a transposition cipher that rearranges the letters of the plaintext to form the ciphertext.",
        affine: "Affine cipher is a type of monoalphabetic substitution cipher where each letter is mapped to its numeric equivalent, encrypted using a mathematical function, and converted back to a letter.",
        baconian: "Baconian cipher is a method of steganography devised by Francis Bacon in 1605. It uses a binary encoding scheme to represent the letters of the alphabet.",
        beaufort: "Beaufort cipher is a polyalphabetic substitution cipher similar to the Vigenère cipher, but with a different encryption algorithm.",
        playfair: "Playfair cipher is a digraph substitution cipher, where pairs of letters are encrypted together.",
        polybius: "Polybius square is a cipher that uses a 5x5 grid filled with letters for encryption.",
        scytale: "Scytale cipher is a transposition cipher that involves writing the text on a strip of parchment wrapped around a cylinder and reading it off the cylinder after unwinding.",
        substitution: "Substitution cipher is a method of encrypting where each letter in the plaintext is replaced by a letter with a fixed shift in the alphabet.",
        hill: "Hill cipher is a polygraphic substitution cipher based on linear algebra. It involves matrix multiplication and modular arithmetic.",
        xor: "XOR cipher is a type of additive cipher in which the plaintext is combined with a key using the XOR bitwise operation.",
        custom: "Custom cipher allows the user to define their own encoding scheme using a 6-digit alphanumeric key."
    };

    const updateOutput = () => {
        const method = methodSelect.value;
        const input = inputText.value;
        const key = customCodeInput.value;

        if (method === 'custom' && key.length !== 6) {
            outputText.value = 'Error: Custom code must be 6 characters long.';
            return;
        }

        outputText.value = ciphers[method].encode(input, key);
        previewText.textContent = outputText.value;
    };

    const detectCodeType = () => {
        const input = autoDetectInput.value.trim();
        const potentialTypes = Object.keys(ciphers).filter(cipher => {
            try {
                ciphers[cipher].decode(input);
                return true;
            } catch (e) {
                return false;
            }
        });
        detectResult.innerHTML = potentialTypes.length > 0 ? `Possible types: ${potentialTypes.join(', ')}` : 'No matches found.';
    };

    const switchTab = (tabName) => {
        tabs.forEach(tab => tab.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName).classList.add('active');
    };

    methodSelect.addEventListener("change", () => {
        if (methodSelect.value === "custom") {
            customCodeContainer.classList.remove("hidden");
        } else {
            customCodeContainer.classList.add("hidden");
        }
    });

    encodeButton.addEventListener("click", updateOutput);
    decodeButton.addEventListener("click", () => {
        const method = methodSelect.value;
        const input = inputText.value;
        const key = customCodeInput.value;

        if (method === 'custom' && key.length !== 6) {
            outputText.value = 'Error: Custom code must be 6 characters long.';
            return;
        }

        outputText.value = ciphers[method].decode(input, key);
        previewText.textContent = outputText.value;
    });

    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            inputText.value = reader.result;
        };
        reader.readAsText(file);
    });

    toggleDarkModeButton.addEventListener("click", () => {
        darkMode = !darkMode;
        document.body.classList.toggle("dark-mode", darkMode);
    });

    tabs.forEach(tab => {
        tab.addEventListener("click", (event) => {
            const tabName = event.target.dataset.tab;
            switchTab(tabName);
        });
    });

    detectButton.addEventListener("click", detectCodeType);

    populateInfoTab();
});
