document.addEventListener("DOMContentLoaded", () => {
    const methodSelect = document.getElementById("methodSelect");
    const customCodeContainer = document.getElementById("customCodeContainer");
    const customCodeInput = document.getElementById("customCodeInput");
    const shiftLabel = document.getElementById("shiftLabel");
    const shiftInput = document.getElementById("shiftInput");
    const inputText = document.getElementById("inputText");
    const outputText = document.getElementById("outputText");
    const encodeButton = document.getElementById("encodeButton");
    const decodeButton = document.getElementById("decodeButton");
    const previewText = document.getElementById("realTimePreview");
    const autoDetectInput = document.getElementById("autoDetectInput");
    const detectButton = document.getElementById("detectButton");
    const detectResult = document.getElementById("detectResult");
    const tabs = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".tab-content");
    const toggleDarkModeButton = document.getElementById("toggleDarkModeButton");
    let darkMode = false;

    const ciphers = {
        caesar: {
            encode: (text, shift) => caesarShift(text, parseInt(shift)),
            decode: (text, shift) => caesarShift(text, -parseInt(shift))
        },
        morse: {
            encode: text => morseEncode(text),
            decode: text => morseDecode(text)
        },
        base64: {
            encode: text => btoa(text),
            decode: text => atob(text)
        },
        binary: {
            encode: text => text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' '),
            decode: text => text.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('')
        },
        hex: {
            encode: text => text.split('').map(char => char.charCodeAt(0).toString(16)).join(' '),
            decode: text => text.split(' ').map(hex => String.fromCharCode(parseInt(hex, 16))).join('')
        },
        rot13: {
            encode: text => text.replace(/[a-z]/gi, char => String.fromCharCode(char.charCodeAt(0) + (char.toLowerCase() <= 'm' ? 13 : -13))),
            decode: text => text.replace(/[a-z]/gi, char => String.fromCharCode(char.charCodeAt(0) + (char.toLowerCase() <= 'm' ? 13 : -13)))
        },
        atbash: {
            encode: text => atbash(text),
            decode: text => atbash(text)
        },
        vigenere: {
            encode: (text, key) => vigenere(text, key),
            decode: (text, key) => vigenere(text, key, false)
        },
        railfence: {
            encode: text => railFence(text),
            decode: text => railFence(text, false)
        },
        custom: {
            encode: (text, key) => customCipher(text, key),
            decode: (text, key) => customCipher(text, key, false)
        }
    };

    const caesarShift = (text, shift) => {
        return text.replace(/[a-z]/gi, char => {
            const offset = char.charCodeAt(0) >= 97 ? 97 : 65;
            return String.fromCharCode((char.charCodeAt(0) - offset + shift) % 26 + offset);
        });
    };

    const atbash = text => {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        const reverseAlphabet = alphabet.split('').reverse().join('');
        return text.split('').map(char => {
            const index = alphabet.indexOf(char.toLowerCase());
            return index !== -1 ? (char === char.toLowerCase() ? reverseAlphabet[index] : reverseAlphabet[index].toUpperCase()) : char;
        }).join('');
    };

    const vigenere = (text, key, encode = true) => {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        let j = 0;
        return text.split('').map(char => {
            const index = alphabet.indexOf(char.toLowerCase());
            if (index === -1) return char;
            const shift = alphabet.indexOf(key[j % key.length].toLowerCase()) * (encode ? 1 : -1);
            j++;
            return String.fromCharCode((index + shift + 26) % 26 + (char === char.toLowerCase() ? 97 : 65));
        }).join('');
    };

    const customCipher = (text, key, encode = true) => {
        // Example custom cipher logic
        const shift = [...key].reduce((acc, char) => acc + char.charCodeAt(0), 0) % 26;
        return caesarShift(text, encode ? shift : -shift);
    };

    const morseEncode = text => {
        // Implement morse encoding
    };

    const morseDecode = text => {
        // Implement morse decoding
    };

    const railFence = (text, encode = true) => {
        // Implement rail fence cipher
    };

    const detectCodeType = text => {
        const possibleTypes = [];
        // Add detection logic here for each cipher type
        if (/^[01\s]+$/.test(text)) {
            possibleTypes.push('Binary');
        }
        if (/^[A-Za-z]+$/.test(text)) {
            possibleTypes.push('Caesar Cipher', 'Vigenère Cipher');
        }
        if (text.match(/^[\.\-\s]+$/)) {
            possibleTypes.push('Morse Code');
        }
        // Add more detection rules...
        return possibleTypes;
    };

    methodSelect.addEventListener("change", () => {
        const method = methodSelect.value;
        customCodeContainer.classList.toggle("hidden", method !== "custom");
        shiftLabel.classList.toggle("hidden", method !== "caesar");
        shiftInput.classList.toggle("hidden", method !== "caesar");
    });

    encodeButton.addEventListener("click", () => {
        const method = methodSelect.value;
        const text = inputText.value;
        const shift = shiftInput.value;
        const key = customCodeInput.value;
        const output = ciphers[method].encode(text, shift || key);
        outputText.value = output;
    });

    decodeButton.addEventListener("click", () => {
        const method = methodSelect.value;
        const text = inputText.value;
        const shift = shiftInput.value;
        const key = customCodeInput.value;
        const output = ciphers[method].decode(text, shift || key);
        outputText.value = output;
    });

    inputText.addEventListener("input", () => {
        const method = methodSelect.value;
        const text = inputText.value;
        const shift = shiftInput.value;
        const key = customCodeInput.value;
        const preview = ciphers[method].encode(text, shift || key);
        previewText.textContent = preview;
    });

    detectButton.addEventListener("click", () => {
        const text = autoDetectInput.value;
        const detectedTypes = detectCodeType(text);
        detectResult.innerHTML = detectedTypes.map(type => `<p>${type}</p>`).join('');
    });

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const tabId = tab.getAttribute("data-tab");

            tabs.forEach(t => t.classList.remove("active"));
            tabContents.forEach(content => content.classList.remove("active"));

            tab.classList.add("active");
            document.getElementById(tabId).classList.add("active");
        });
    });

    toggleDarkModeButton.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    methodSelect.dispatchEvent(new Event("change"));
});
