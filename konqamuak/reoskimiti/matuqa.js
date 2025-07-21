
function generateMIDI() {
  const text = document.getElementById('inputText').value;

  const noteMap = {
    '˩': [53],   // F3
    '˧': [55],   // G3
    '˥': [57],   // A3
    '5': [48, 60] // C3, C4
  };

  function writeVarLen(value) {
    let buffer = [];
    buffer.push(value & 0x7F);
    while (value >>= 7) {
      buffer.unshift((value & 0x7F) | 0x80);
    }
    return buffer;
  }

  function noteOn(note) {
    return [0x90, note, 64];
  }

  function noteOff(note) {
    return [0x80, note, 64];
  }

  let track = [];
  let tickDelay = 480;
  let time = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (noteMap[char]) {
      for (let note of noteMap[char]) {
        track.push(...writeVarLen(time), ...noteOn(note));
        track.push(...writeVarLen(tickDelay), ...noteOff(note));
        time = 0;
      }
    }
    time += tickDelay;
  }

  // Add end-of-track meta event
  track.push(...writeVarLen(0), 0xFF, 0x2F, 0x00);

  function makeHeaderChunk() {
    return [
      ...[...'MThd'].map(c => c.charCodeAt(0)),
      0x00, 0x00, 0x00, 0x06,
      0x00, 0x01,
      0x00, 0x01,
      0x01, 0xE0
    ];
  }

  function makeTrackChunk(trackData) {
    const length = trackData.length;
    return [
      ...[...'MTrk'].map(c => c.charCodeAt(0)),
      (length >> 24) & 0xFF, (length >> 16) & 0xFF,
      (length >> 8) & 0xFF, length & 0xFF,
      ...trackData
    ];
  }

  const fullMidi = new Uint8Array([
    ...makeHeaderChunk(),
    ...makeTrackChunk(track)
  ]);

  const blob = new Blob([fullMidi], { type: 'audio/midi' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'conlang_melody.mid';
  a.click();
  URL.revokeObjectURL(url);
}
