import tkinter as tk
from tkinter import messagebox

# Function to encode and decode text
def process_text():
    try:
        # Get user input
        input_text = text_input.get("1.0", tk.END).strip()
        encode_option = encode_var.get()

        # Process the text based on selected option
        if encode_option == "Base64":
            import base64
            if action_var.get() == "Encode":
                result_text = base64.b64encode(input_text.encode()).decode()
            else:
                result_text = base64.b64decode(input_text.encode()).decode()
        elif encode_option == "Hex":
            if action_var.get() == "Encode":
                result_text = input_text.encode().hex()
            else:
                result_text = bytes.fromhex(input_text).decode()
        else:
            result_text = "Unsupported option"

        # Show result
        text_result.config(state=tk.NORMAL)
        text_result.delete("1.0", tk.END)
        text_result.insert(tk.END, result_text)
        text_result.config(state=tk.DISABLED)
    except Exception as e:
        messagebox.showerror("Error", str(e))

# Create the main window
root = tk.Tk()
root.title("Cipher Tool")

# Create and place widgets
tk.Label(root, text="Enter Text:").pack(pady=5)
text_input = tk.Text(root, height=10, width=50)
text_input.pack(pady=5)

tk.Label(root, text="Select Encoding/Decoding Option:").pack(pady=5)
encode_var = tk.StringVar(value="Base64")
tk.Radiobutton(root, text="Base64", variable=encode_var, value="Base64").pack()
tk.Radiobutton(root, text="Hex", variable=encode_var, value="Hex").pack()

tk.Label(root, text="Select Action:").pack(pady=5)
action_var = tk.StringVar(value="Encode")
tk.Radiobutton(root, text="Encode", variable=action_var, value="Encode").pack()
tk.Radiobutton(root, text="Decode", variable=action_var, value="Decode").pack()

tk.Button(root, text="Process", command=process_text).pack(pady=10)

tk.Label(root, text="Result:").pack(pady=5)
text_result = tk.Text(root, height=10, width=50, state=tk.DISABLED)
text_result.pack(pady=5)

# Run the application
root.mainloop()
