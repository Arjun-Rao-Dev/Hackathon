const synth = window.speechSynthesis;
const voiceList = document.querySelector("#voiceList");
const speakBtn = document.querySelector("#speakBtn");

// Populate the dropdown with available system voices
function populateVoices() {
    const voices = synth.getVoices();
    voiceList.innerHTML = voices
        .map(voice => `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`)
        .join('');
}

// Ensure voices are loaded (some browsers load them asynchronously)
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoices;
}
populateVoices();

speakBtn.addEventListener("click", () => {
    const textToRead = document.querySelector("#content").innerText;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    // Set the selected voice
    const selectedVoiceName = voiceList.value;
    utterance.voice = synth.getVoices().find(v => v.name === selectedVoiceName);
    
    synth.speak(utterance);
});
