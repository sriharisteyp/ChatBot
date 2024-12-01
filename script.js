// script.js

document.getElementById("generateBtn").addEventListener("click", generateContent);

async function generateContent() {
    const prompt = document.getElementById("prompt").value;
    const resultDiv = document.getElementById("result");
    const output = document.getElementById("output");

    // Clear any previous results
    output.textContent = "Generating... please wait.";

    // API call to Zuki Journey
    try {
        const response = await fetch('https://api.zukijourney.com/v1/models', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer YOUR_ZUKI_API_KEY`, // Replace with your Zuki API key
            },
            body: JSON.stringify({
                prompt: prompt,
            }),
        });

        const data = await response.json();

        // Check if the API call was successful
        if (response.ok) {
            output.textContent = data.result || "No content returned from the API.";
        } else {
            output.textContent = "Error: " + (data.error || "Something went wrong.");
        }
    } catch (error) {
        output.textContent = "Error: " + error.message;
    }
}
