(() => {
'use strict';

const $ = (id) => document.getElementById(id);

const textInput = $('nx-text');
const animationSelect = $('nx-animation');
const filterSelect = $('nx-filter');
const volumeInput = $('nx-volume');
const audioFileInput = $('nx-audio-file');
const audioPlayer = $('nx-audio');
const audioName = $('nx-audio-name');
const status = $('nx-status');
const preview = $('preview');
const video = $('video');

if (
!textInput ||
!animationSelect ||
!filterSelect ||
!volumeInput ||
!audioFileInput ||
!audioPlayer ||
!preview
) {
console.error('Nexcut creative tools: Required HTML elements are missing.');
return;
}

let audioURL = null;
let titleElement = null;

function setStatus(message) {
if (status) status.textContent = message;
}

function updateTitle() {
const title = textInput.value.trim();

if (!title) {
  if (titleElement) titleElement.remove();
  titleElement = null;
  setStatus('Text overlay cleared.');
  return;
}

if (!titleElement) {
  titleElement = document.createElement('div');
  titleElement.className = 'nx-title';
  titleElement.setAttribute('aria-label', 'Video text overlay');
  preview.appendChild(titleElement);
}

titleElement.textContent = title;

titleElement.classList.remove(
  'nx-fade',
  'nx-slide',
  'nx-zoom',
  'nx-type',
  'nx-bounce'
);

const animation = animationSelect.value;
const animationClasses = {
  fade: 'nx-fade',
  slide: 'nx-slide',
  zoom: 'nx-zoom',
  type: 'nx-type',
  bounce: 'nx-bounce'
};

if (animationClasses[animation]) {
  void titleElement.offsetWidth;
  titleElement.classList.add(animationClasses[animation]);
}

setStatus('Text overlay updated.');

}

function updateFilter() {
const filters = {
none: 'none',
cinematic: 'contrast(1.18) saturate(0.85)',
vintage: 'sepia(0.45) contrast(0.95)',
mono: 'grayscale(1)',
vivid: 'saturate(1.65) contrast(1.08)',
cool: 'saturate(0.95) hue-rotate(12deg)',
warm: 'sepia(0.18) saturate(1.15)'
};

if (video) {
  video.style.filter = filters[filterSelect.value] || 'none';
}

setStatus('Video filter applied to preview.');

}

function updateVolume() {
const volume = Math.max(
0,
Math.min(100, Number(volumeInput.value) || 0)
);

audioPlayer.volume = volume / 100;
setStatus('Music volume: ' + volume + '%.');

}

audioFileInput.addEventListener('change', () => {
const file = audioFileInput.files &&
audioFileInput.files[0];

if (!file) return;

if (!file.type.startsWith('audio/')) {
  setStatus('Please select an audio file.');
  audioFileInput.value = '';
  return;
}

if (audioURL) URL.revokeObjectURL(audioURL);

audioURL = URL.createObjectURL(file);
audioPlayer.src = audioURL;
audioPlayer.load();
audioPlayer.volume = Number(volumeInput.value) / 100;

if (audioName) {
  audioName.textContent = 'Selected: ' + file.name;
}

setStatus('Music imported. Press Play on the audio player to listen.');

});

textInput.addEventListener('input', updateTitle);
animationSelect.addEventListener('change', updateTitle);
filterSelect.addEventListener('change', updateFilter);
volumeInput.addEventListener('input', updateVolume);

const templates = {
cinematic: {
animation: 'fade',
filter: 'cinematic',
text: 'CINEMATIC'
},
travel: {
animation: 'slide',
filter: 'vivid',
text: 'MY TRAVEL STORY'
},
memories: {
animation: 'fade',
filter: 'warm',
text: 'BEAUTIFUL MEMORIES'
},
vintage: {
animation: 'zoom',
filter: 'vintage',
text: 'THE GOOD OLD DAYS'
},
shorts: {
animation: 'bounce',
filter: 'vivid',
text: 'WATCH THIS!'
}
};

document.querySelectorAll('[data-nx-template]').forEach((button) => {
button.addEventListener('click', () => {
const template = templates[button.dataset.nxTemplate];

  if (!template) return;

  textInput.value = template.text;
  animationSelect.value = template.animation;
  filterSelect.value = template.filter;

  updateTitle();
  updateFilter();

  setStatus(
    button.textContent.trim() +
    ' template applied to the preview.'
  );
});

});

const resetButton = $('nx-reset');

if (resetButton) {
resetButton.addEventListener('click', () => {
textInput.value = '';
animationSelect.value = 'none';
filterSelect.value = 'none';
volumeInput.value = '80';

  updateTitle();
  updateFilter();
  updateVolume();

  if (audioURL) {
    audioPlayer.pause();
    audioPlayer.removeAttribute('src');
    audioPlayer.load();
    URL.revokeObjectURL(audioURL);
    audioURL = null;
  }

  audioFileInput.value = '';

  if (audioName) {
    audioName.textContent = 'No audio selected';
  }

  setStatus('Creative tools reset.');
});

}

window.addEventListener('beforeunload', () => {
if (audioURL) URL.revokeObjectURL(audioURL);
});

updateVolume();
setStatus('Creative tools ready.');
})();
