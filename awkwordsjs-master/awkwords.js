// Awkwords - Word Generator (JS version)
// This file ports the core logic from PHP to JavaScript

// Default subpatterns
const defaultSubpatterns = [
  { name: 'V', content: 'a/i/u' },
  { name: 'C', content: 'p/t/k/s/m/n' },
  { name: 'N', content: 'm/n' }
];

const maxSubpatterns = 26;

function createSubpatternRows(subpatterns) {
  const tbody = document.getElementById('subpatterns-tbody');
  tbody.innerHTML = '';
  for (let n = 0; n < maxSubpatterns; n++) {
    const tr = document.createElement('tr');
    tr.className = 'sc_row';
    tr.id = 'sc_row' + n;
    // Subpattern name select
    const tdName = document.createElement('td');
    const select = document.createElement('select');
    select.name = `sp_names[${n}]`;
    select.id = `sc_select${n}`;
    const optEmpty = document.createElement('option');
    optEmpty.value = '';
    optEmpty.textContent = '-';
    select.appendChild(optEmpty);
    for (let i = 0; i < 26; i++) {
      const char = String.fromCharCode(65 + i);
      const opt = document.createElement('option');
      opt.value = char;
      opt.textContent = char;
      select.appendChild(opt);
    }
    if (subpatterns[n] && subpatterns[n].name) select.value = subpatterns[n].name;
    tdName.appendChild(select);
    // Subpattern content input
    const tdContent = document.createElement('td');
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'sp_contents[]';
    input.size = 64;
    input.value = subpatterns[n] ? subpatterns[n].content : '';
    input.id = `sc_input${n}`;
    tdContent.appendChild(input);
    tr.appendChild(tdName);
    tr.appendChild(tdContent);
    tbody.appendChild(tr);
    // Hide unused rows
    if (n > subpatterns.length) tr.style.display = 'none';
    // Add row on select change
    select.onchange = function() {
      if (n === subpatterns.length) {
        document.getElementById('sc_row' + (n + 1)).style.display = '';
      }
    };
  }
}

function getSubpatternsFromForm() {
  const names = Array.from(document.querySelectorAll('select[name^="sp_names"]')).map(s => s.value);
  const contents = Array.from(document.querySelectorAll('input[name="sp_contents[]"]')).map(i => i.value);
  const subpatterns = [];
  for (let i = 0; i < maxSubpatterns; i++) {
    if (names[i] || contents[i]) {
      subpatterns.push({ name: names[i], content: contents[i] });
    }
  }
  return subpatterns;
}

function showWords(words, stats) {
  const wordsDiv = document.getElementById('words');
  wordsDiv.textContent = words;
  document.getElementById('stats').textContent = stats;
  document.getElementById('select-all-btn').style.display = words ? '' : 'none';
}

document.addEventListener('DOMContentLoaded', function() {
  createSubpatternRows(defaultSubpatterns);
  document.getElementById('awkwords-form').addEventListener('submit', function(e) {
    e.preventDefault();
    generateWords();
  });
  document.getElementById('select-all-btn').onclick = function() {
    const range = document.createRange();
    range.selectNodeContents(document.getElementById('words'));
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };

  // Save button handler
  document.getElementById('save-btn').onclick = function() {
    saveSettings();
  };

  // Load button handler
  document.getElementById('load-btn').onclick = function() {
    document.getElementById('load-input').click();
  };
  document.getElementById('load-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
      loadSettings(evt.target.result);
    };
    reader.readAsText(file);
    // Reset input so same file can be loaded again if needed
    e.target.value = '';
  });
});

// Load settings from file content (cross-compatible with PHP format)
function loadSettings(text) {
  const lines = text.replace(/\r/g, '').split('\n');
  let subpatterns = [];
  let pattern = '';
  let numw = 100;
  let nle = false;
  let filterdup = false;
  let spCount = 0;
  for (let line of lines) {
    if (!line || line[0] === '#') continue;
    if (/^[A-Z]:/.test(line)) {
      // Subpattern line
      const idx = line.indexOf(':');
      const name = line.substring(0, idx);
      const content = line.substring(idx + 1);
      subpatterns[spCount++] = { name, content };
    } else if (line.startsWith('r:')) {
      pattern = line.substring(2);
    } else if (line.startsWith('n:')) {
      numw = parseInt(line.substring(2)) || 100;
    } else if (line === 'nle') {
      nle = true;
    } else if (line === 'filterdup') {
      filterdup = true;
    }
  }
  // Fill up to 26 subpatterns
  while (subpatterns.length < 26) subpatterns.push({ name: '', content: '' });
  createSubpatternRows(subpatterns);
  // Set values
  for (let i = 0; i < 26; i++) {
    document.getElementById('sc_select' + i).value = subpatterns[i].name;
    document.getElementById('sc_input' + i).value = subpatterns[i].content;
  }
  document.getElementById('pattern').value = pattern;
  document.getElementById('numw').value = numw;
  document.getElementById('nle').checked = nle;
  document.getElementById('filterdup').checked = filterdup;
}

// Save settings in the same format as PHP save.php
function saveSettings() {
  const subpatterns = getSubpatternsFromForm();
  const pattern = document.getElementById('pattern').value;
  const numw = document.getElementById('numw').value;
  const nle = document.getElementById('nle').checked;
  const filterdup = document.getElementById('filterdup').checked;

  let lines = [];
  lines.push('#awkwords version 1.2');
  // 26 subpatterns, output only those with name or content
  for (let n = 0; n < 26; n++) {
    const sp = subpatterns[n];
    const name = sp ? (sp.name || '') : '';
    const content = sp ? (sp.content || '') : '';
    if (name !== '' || content !== '') {
      lines.push(name + ':' + content);
    }
  }
  lines.push('r:' + pattern);
  lines.push('n:' + numw);
  if (nle) lines.push('nle');
  if (filterdup) lines.push('filterdup');

  const content = lines.join('\n') + '\n';
  let filename = 'awkwords-settings.awkw';
  // Optionally, prompt for filename
  if (window.prompt) {
    const userFile = window.prompt('Save as filename:', filename);
    if (userFile && userFile.trim()) filename = userFile.trim();
  }
  const blob = new Blob([content], { type: 'application/octet-stream' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }, 100);
}

// --- Core logic port from PHP ---
// (To be implemented: pattern parsing, rendering, validation, etc.)

// --- Pattern parsing and word generation logic ---
function generateWords() {
  const subpatterns = getSubpatternsFromForm();
  const pattern = document.getElementById('pattern').value;
  const numw = Math.min(9999, Math.max(1, parseInt(document.getElementById('numw').value) || 100));
  const nle = document.getElementById('nle').checked;
  const filterdup = document.getElementById('filterdup').checked;

  // Build subpattern lookup
  const spn = [];
  const spc = [];
  for (let i = 0; i < subpatterns.length; i++) {
    if (subpatterns[i].name) {
      spn.push(subpatterns[i].name);
      spc.push(subpatterns[i].content);
    }
  }

  // Helper: choose (random or all options)
  function choose(str, all = false) {
    let options = [], target = [];
    let p = 0, i = 0, ti = 0;
    while (p < str.length) {
      options[i] = '';
      let weightStr = '';
      let level = 0;
      for (; !(level === 0 && str[p] === '/' || p === str.length); p++) {
        if (str[p] === '"') {
          options[i] += str[p++];
          for (; p < str.length; p++) {
            options[i] += str[p];
            if (str[p] === '"') break;
          }
        } else if (str[p] === '*' && level === 0) {
          p++;
          while (str[p] >= '0' && str[p] <= '9' && p < str.length) weightStr += str[p++];
          p--;
        } else {
          options[i] += str[p];
          if (str[p] === '[' || str[p] === '(') level++;
          if (str[p] === ']' || str[p] === ')') level--;
        }
      }
      i++;
      let weight = parseInt(weightStr) || 1;
      if (weight < 1) weight = 1;
      if (weight > 128) weight = 128;
      let stop = ti + weight;
      for (; ti < stop; ti++) target[ti] = options[i - 1];
      p++;
    }
    if (all) return options;
    return target[Math.floor(Math.random() * target.length)];
  }

  // Helper: fragments (split pattern into fragments)
  function fragments(str, spn, spc) {
    let f = [], strlen = str.length, i = 0, filti = 0;
    for (let p = 0; p < strlen; p++) {
      if (str[p] >= 'A' && str[p] <= 'Z') {
        let scrlim = spn.length, found = '';
        for (let n = 0; n < scrlim; n++) if (spn[n] === str[p]) found = '[' + spc[n] + ']';
        f[i] = [found];
        i++; filti = 0;
      } else if (str[p] === '^') {
        p++;
        let length = 0, esc = false;
        while (
          esc || (str[p + length] !== '[' && str[p + length] !== '(' && !(str[p + length] >= 'A' && str[p + length] <= 'Z') && str[p + length] !== '^' && (p + length) < strlen)
        ) {
          if (str[p + length] === '"') esc = !esc;
          length++;
        }
        if (length > 0) {
          let filter = fragments(str.substr(p, length), spn, spc);
          f[i - 1][1 + filti] = filter[0][0]; filti++;
          p = p + length;
          if (str[p] === '^') p--;
        }
      } else {
        if (str[p] === '[' || str[p] === '(') {
          let level = -1, frag = '';
          do {
            if (str[p] === '[' || str[p] === '(') level++;
            if (str[p] === ']' || str[p] === ')') level--;
            frag += str[p++];
          } while (level >= 0 && p < strlen);
          p--; f[i] = [frag]; i++; filti = 0;
        } else {
          let frag = '';
          for (; str[p] !== '[' && str[p] !== '(' && !(str[p] >= 'A' && str[p] <= 'Z') && str[p] !== '^' && p < strlen; p++) {
            if (str[p] === '"') {
              p++;
              if (str[p] === '"') frag += '"';
              for (; str[p] !== '"' && p < strlen; p++) {
                if (str[p] === '[') frag += String.fromCharCode(1);
                else if (str[p] === '(') frag += String.fromCharCode(2);
                else frag += str[p];
              }
            } else if (str[p] !== ' ') frag += str[p];
          }
          p--;
          if (frag !== undefined) { f[i] = [frag]; i++; filti = 0; }
        }
      }
    }
    return f;
  }

  // Helper: render (main recursive generator)
  function render(string, spn, spc) {
    let rendering_aborted = false;
    function _render(string) {
      let f = fragments(choose(string), spn, spc);
      let r = '';
      for (let i = 0; f[i] && f[i][0] !== undefined; i++) {
        let fragr = '';
        switch (f[i][0][0]) {
          case '[':
            fragr = _render(f[i][0].slice(1, -1));
            break;
          case '(': // optional
            if (Math.random() < 0.5) fragr = _render(f[i][0].slice(1, -1));
            break;
          default:
            fragr = f[i][0];
        }
        for (let filti = 0; f[i][1 + filti] !== undefined; filti++) {
          if (fragr === f[i][1 + filti]) rendering_aborted = true;
        }
        if (rendering_aborted) return false;
        r += fragr;
      }
      // Uncover brackets
      return r.replace(/[\x01\x02]/g, m => m === '\x01' ? '[' : '(');
    }
    return _render(string);
  }

  // Generate words
  let words = [], generated = {}, ws = 0, dups = 0, fabts = 0;
  const startTime = performance.now();
  for (let i = 0; i < numw; i++) {
    let word = render(pattern, spn, spc);
    if (word === false) { fabts++; continue; }
    if (filterdup && generated[word]) { dups++; continue; }
    generated[word] = true;
    words.push(word);
    ws++;
  }
  const finishTime = performance.now();
  let output = words.join(nle ? '\n' : ' ');
  let stats = `${ws} word${ws !== 1 ? 's' : ''}`;
  if (dups || fabts) {
    stats += ' (filtered out: ';
    if (fabts) stats += `${fabts} by pattern filters`;
    if (dups && fabts) stats += ', ';
    if (dups) stats += `${dups} duplicate${dups !== 1 ? 's' : ''}`;
    stats += ')';
  }
  stats += ` | time: ${((finishTime - startTime) / 1000).toFixed(3)} seconds`;
  showWords(output, stats);
}
