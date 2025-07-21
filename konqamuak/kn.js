// konqamuak/kn.js
// Handles floating window logic for the new landing page

// List of HTML files, titles, and emojis (auto-generated, all .html files)
// List of HTML files, titles, and emojis (auto-generated, all .html files, no duplicates)
const htmlPagesRaw = [
  { file: "../3d/index.html", title: "3D Navigation", emoji: "🧭" },
  { file: "../lip-sync/index.html", title: "Lip Sync", emoji: "👄" },
  { file: "../pitch/index.html", title: "Pitch", emoji: "🎤" },
  { file: "../rhyming/index.html", title: "Rhyming Dictionary", emoji: "📝" },
  { file: "../pink-trombone/test.html", title: "Pink Trombone (Test)", emoji: "🎺" },
  { file: "../pink-trombone/default.html", title: "Pink Trombone (Default)", emoji: "🎺" },
  { file: "../pink-trombone/index.html", title: "Pink Trombone", emoji: "🎺" },
  { file: "../synth/synthesizer.html", title: "Rea Ngana Kalimba Grid", emoji: "🎹" },
  { file: "../index.html", title: "GRUB Boot Menu - Pink Trombone Demos", emoji: "🧪" },
  { file: "../edge-impulse/index.html", title: "Edge Impulse", emoji: "🤖" },
  { file: "../knn/index.html", title: "KNN", emoji: "🧠" },
  { file: "../midi2utterances/index.html", title: "MIDI to Utterances Converter", emoji: "🎼" },
  { file: "../machine-learning/index.html", title: "Machine Learning", emoji: "🦾" },
  { file: "../debug/index.html", title: "Debug", emoji: "🐞" },
  { file: "../pronunciation/index.html", title: "Pronunciation", emoji: "🔊" },
  { file: "../tts/index.html", title: "Text to Speech", emoji: "🗣️" },
  { file: "../nganafuawai3.html", title: "Bidirectional Script Swapper", emoji: "🔄" },
  { file: "tosi.html", title: "Tosi Onscreen Keyboard", emoji: "⌨️" },
  { file: "ranqimatak.html", title: "Ranqimatak MIDI Note Viewer", emoji: "🎶" },
  { file: "../Lafukauta Sliding Mbira.htm", title: "Lafukauta Sliding Mbira", emoji: "🎹" },
  { file: "../konqamuak/km.html", title: "Hyprland Style Launcher", emoji: "🖥️" },
];

// Remove duplicates by file path
const seen = new Set();
const htmlPages = htmlPagesRaw.filter(p => {
  if (seen.has(p.file)) return false;
  seen.add(p.file);
  return true;
});

const container = document.getElementById('windowContainer');

function createWindow(file) {
  const page = htmlPages.find(p => p.file === file);
  const win = document.createElement('div');
  win.className = 'floating-window';
  win.innerHTML = `
    <div class="window-header">
      <span>${page ? page.emoji + ' ' + page.title : file.split('/').pop()}</span>
      <button class="close-btn">×</button>
    </div>
    <iframe src="${file}" frameborder="0"></iframe>
  `;
  win.querySelector('.close-btn').onclick = () => win.remove();
  makeDraggable(win);
  container.appendChild(win);
}

document.getElementById('fileList').addEventListener('click', e => {
  if (e.target.tagName === 'LI') {
    createWindow(e.target.dataset.file);
  }
});

function makeDraggable(win) {
  let isDragging = false, offsetX = 0, offsetY = 0;
  const header = win.querySelector('.window-header');
  header.onmousedown = e => {
    isDragging = true;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    document.onmousemove = move;
    document.onmouseup = () => {
      isDragging = false;
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };
  function move(e) {
    if (!isDragging) return;
    win.style.left = (e.clientX - offsetX) + 'px';
    win.style.top = (e.clientY - offsetY) + 'px';
  }
}

// Populate file list
const fileList = document.getElementById('fileList');
// Populate file list with emoji and title
fileList.innerHTML = htmlPages.map(p => `<li data-file="${p.file}">${p.emoji} ${p.title}</li>`).join('');
