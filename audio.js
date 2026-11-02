const GameAudio = (() => {
  const BASE_FREQUENCY = 55;
  const CHORDS = { m: [0, 3, 7], M: [0, 4, 7], d: [0, 3, 6] };
  const PROFILES = {
    halloween: {
      scale: [0, 2, 3, 5, 7, 8, 11],
      progressions: [
        [[0, "m"], [8, "M"], [5, "m"], [7, "M"]],
        [[0, "m"], [10, "M"], [8, "M"], [7, "M"]],
        [[0, "m"], [5, "m"], [8, "M"], [7, "M"]],
        [[0, "m"], [2, "d"], [7, "M"], [0, "m"]],
        [[0, "m"], [3, "M"], [10, "M"], [8, "M"]],
      ],
      arpeggios: [
        [0, 1, 2, 3, 2, 1, 2, 1],
        [0, 2, 1, 3, 0, 2, 1, 3],
        [0, 1, 2, 1, 3, 2, 1, 0],
      ],
      tempo: 1, lead: "sine", leadVolume: 0.042, melodyChance: 1,
    },
    natal: {
      scale: [0, 2, 4, 5, 7, 9, 11],
      progressions: [
        [[0, "M"], [9, "m"], [5, "M"], [7, "M"]],
        [[0, "M"], [5, "M"], [2, "m"], [7, "M"]],
        [[0, "M"], [7, "M"], [9, "m"], [5, "M"]],
        [[0, "M"], [4, "m"], [5, "M"], [7, "M"]],
        [[5, "M"], [0, "M"], [7, "M"], [0, "M"]],
      ],
      arpeggios: [
        [0, 2, 1, 3, 2, 1, 3, 1],
        [0, 1, 3, 2, 0, 1, 3, 2],
        [3, 2, 1, 0, 1, 2, 3, 2],
      ],
      tempo: 1.1, lead: "bell", leadVolume: 0.05, melodyChance: 1.15,
    },
    pascoa: {
      scale: [0, 2, 4, 6, 7, 9, 11],
      progressions: [
        [[0, "M"], [7, "M"], [9, "m"], [5, "M"]],
        [[0, "M"], [2, "m"], [7, "M"], [0, "M"]],
        [[0, "M"], [9, "m"], [2, "m"], [7, "M"]],
        [[5, "M"], [7, "M"], [0, "M"], [9, "m"]],
        [[0, "M"], [5, "M"], [0, "M"], [7, "M"]],
      ],
      arpeggios: [
        [0, 3, 1, 3, 2, 3, 1, 3],
        [0, 1, 2, 3, 3, 2, 1, 0],
        [0, 2, 0, 3, 1, 3, 2, 1],
      ],
      tempo: 0.85, lead: "pluck", leadVolume: 0.05, melodyChance: 1.3,
    },
    carnaval: {
      scale: [0, 2, 3, 5, 7, 9, 10],
      progressions: [
        [[0, "m"], [5, "M"], [10, "M"], [7, "m"]],
        [[0, "m"], [7, "M"], [0, "m"], [5, "M"]],
        [[0, "m"], [10, "M"], [5, "M"], [7, "M"]],
        [[0, "m"], [3, "M"], [10, "M"], [7, "M"]],
        [[5, "M"], [0, "m"], [7, "M"], [0, "m"]],
      ],
      arpeggios: [
        [0, 2, 1, 3, 0, 2, 1, 3],
        [0, 1, 0, 2, 3, 2, 1, 2],
        [3, 1, 2, 0, 3, 1, 2, 0],
      ],
      tempo: 0.72, lead: "bell", leadVolume: 0.05, melodyChance: 1.4,
    },
    junina: {
      scale: [0, 2, 4, 5, 7, 9, 10],
      progressions: [
        [[0, "M"], [5, "M"], [7, "M"], [0, "M"]],
        [[0, "M"], [10, "M"], [5, "M"], [0, "M"]],
        [[0, "M"], [7, "M"], [5, "M"], [7, "M"]],
        [[0, "M"], [9, "m"], [5, "M"], [7, "M"]],
        [[5, "M"], [0, "M"], [7, "M"], [0, "M"]],
      ],
      arpeggios: [
        [0, 2, 1, 2, 0, 2, 1, 3],
        [0, 1, 2, 3, 2, 1, 2, 1],
        [0, 2, 0, 3, 1, 3, 2, 1],
      ],
      tempo: 0.8, lead: "pluck", leadVolume: 0.052, melodyChance: 1.35,
    },
    ambiente: {
      scale: [0, 2, 4, 5, 7, 9, 10],
      progressions: [
        [[0, "M"], [10, "M"], [5, "M"], [0, "M"]],
        [[0, "M"], [7, "M"], [5, "M"], [10, "M"]],
        [[0, "M"], [9, "m"], [5, "M"], [7, "M"]],
        [[5, "M"], [0, "M"], [10, "M"], [0, "M"]],
        [[0, "M"], [2, "m"], [10, "M"], [7, "M"]],
      ],
      arpeggios: [
        [0, 1, 2, 1, 3, 2, 1, 2],
        [0, 2, 1, 3, 2, 0, 1, 3],
        [3, 2, 1, 0, 1, 2, 3, 1],
      ],
      tempo: 1, lead: "pluck", leadVolume: 0.048, melodyChance: 1.1,
    },
  };
  let profile = PROFILES.halloween;
  let SCALE = profile.scale;
  let PROGRESSIONS = profile.progressions;
  let ARPEGGIOS = profile.arpeggios;
  const MIN_SOUND_INTERVAL = { shot: 0.05, impact: 0.05, destroyed: 0.06, towerHit: 0.08, enemyShot: 0.08, status: 0.1, enemySpawn: 0.25, enemyDeath: 0.25, repair: 0.3, bonus: 0.05 };

  let context;
  let masterGain;
  let musicBus;
  let sfxBus;
  let noiseBuffer;
  let musicEnabled = false;
  const VOLUME_KEY = "tower-defense-feriados-volume-v1";
  const MAX_MASTER_GAIN = 2.6;
  let volume = loadVolume();
  let sfxEnabled = true;
  let schedulerTimer;
  let schedulerWorker;
  let nextStepTime = 0;
  let step = 0;
  let bar = -1;
  let progressionIndex = 0;
  let arpeggioIndex = 0;
  let melody = [];
  let intensity = 0;
  let paused = false;
  const lastPlayed = {};

  const frequency = (semitones) => BASE_FREQUENCY * 2 ** (semitones / 12);
  const randomItem = (items) => items[Math.floor(Math.random() * items.length)];
  const stepDuration = () => (intensity > 0.5 ? 0.25 : 0.34) * profile.tempo;

  function loadVolume() {
    try {
      const saved = Number.parseFloat(localStorage.getItem(VOLUME_KEY));
      if (Number.isFinite(saved) && saved >= 0 && saved <= 1) return saved;
    } catch (error) {
      console.error("Não foi possível ler o volume salvo.", error);
    }
    return 0.8;
  }

  function setVolume(value) {
    volume = Math.min(1, Math.max(0, value));
    if (masterGain) masterGain.gain.setTargetAtTime(volume * MAX_MASTER_GAIN, context.currentTime, 0.03);
    try {
      localStorage.setItem(VOLUME_KEY, String(volume));
    } catch (error) {
      console.error("Não foi possível salvar o volume.", error);
    }
  }

  function unlock() {
    if (context) {
      if (context.state === "suspended" && !paused) context.resume().catch((error) => console.error("Não foi possível retomar o áudio.", error));
      return true;
    }
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return false;

    context = new AudioContextClass();
    const compressor = context.createDynamicsCompressor();
    masterGain = context.createGain();
    masterGain.gain.value = volume * MAX_MASTER_GAIN;
    masterGain.connect(compressor);
    compressor.connect(context.destination);

    musicBus = context.createGain();
    musicBus.gain.value = 0;
    musicBus.connect(masterGain);
    sfxBus = context.createGain();
    sfxBus.gain.value = sfxEnabled ? 0.9 : 0;
    sfxBus.connect(masterGain);

    const echoSend = context.createGain();
    const echoDelay = context.createDelay(1);
    const echoTone = context.createBiquadFilter();
    const echoFeedback = context.createGain();
    echoSend.gain.value = 0.28;
    echoDelay.delayTime.value = 0.37;
    echoTone.type = "lowpass";
    echoTone.frequency.value = 1800;
    echoFeedback.gain.value = 0.38;
    musicBus.connect(echoSend);
    echoSend.connect(echoDelay);
    echoDelay.connect(echoTone);
    echoTone.connect(echoFeedback);
    echoFeedback.connect(echoDelay);
    echoTone.connect(masterGain);

    noiseBuffer = context.createBuffer(1, context.sampleRate, context.sampleRate);
    const samples = noiseBuffer.getChannelData(0);
    for (let index = 0; index < samples.length; index += 1) samples[index] = Math.random() * 2 - 1;

    if (context.state === "suspended" && !paused) context.resume().catch((error) => console.error("Não foi possível iniciar o áudio.", error));
    return true;
  }

  function tone({ dest, freq, to, start, duration, volume, type = "sine", attack = 0.01, lowpass, vibrato }) {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, start);
    if (to) oscillator.frequency.exponentialRampToValueAtTime(to, start + duration);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(volume, start + attack);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    let output = oscillator;
    if (lowpass) {
      const filter = context.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = lowpass;
      output.connect(filter);
      output = filter;
    }
    output.connect(envelope);
    envelope.connect(dest);

    if (vibrato) {
      const lfo = context.createOscillator();
      const depth = context.createGain();
      lfo.frequency.value = vibrato.rate;
      depth.gain.value = vibrato.depth;
      lfo.connect(depth);
      depth.connect(oscillator.frequency);
      lfo.start(start);
      lfo.stop(start + duration + 0.05);
    }
    oscillator.start(start);
    oscillator.stop(start + duration + 0.05);
  }

  function noise({ dest, start, duration, volume, type = "bandpass", from, to, q = 1 }) {
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const envelope = context.createGain();
    source.buffer = noiseBuffer;
    source.loop = true;
    filter.type = type;
    filter.Q.value = q;
    filter.frequency.setValueAtTime(from, start);
    if (to) filter.frequency.exponentialRampToValueAtTime(to, start + duration);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(volume, start + Math.min(0.02, duration / 3));
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(filter);
    filter.connect(envelope);
    envelope.connect(dest);
    source.start(start, Math.random() * 0.5);
    source.stop(start + duration + 0.05);
  }

  function startBar(time) {
    bar += 1;
    if (bar % 8 === 0) {
      let next = progressionIndex;
      while (next === progressionIndex && bar > 0) next = Math.floor(Math.random() * PROGRESSIONS.length);
      progressionIndex = next;
      arpeggioIndex = Math.floor(Math.random() * ARPEGGIOS.length);
      tone({ dest: musicBus, freq: 1318.5, start: time, duration: 2.6, volume: 0.028, attack: 0.005 });
      tone({ dest: musicBus, freq: 2637, start: time, duration: 1.4, volume: 0.01, attack: 0.005 });
    }
    if (bar % 2 === 0) {
      let degree = Math.floor(Math.random() * 6);
      melody = Array.from({ length: 8 }, (_, slot) => {
        const chance = (intensity > 0.5 ? 0.62 : 0.4) * profile.melodyChance;
        if (Math.random() > (slot % 2 === 0 ? chance : chance * 0.35)) return null;
        degree = Math.max(0, Math.min(9, degree + randomItem([-2, -1, -1, 0, 1, 1, 2])));
        return { degree, length: Math.random() < 0.35 ? 2 : 1 };
      });
    } else {
      const changed = Math.floor(Math.random() * melody.length);
      if (melody[changed]) {
        melody[changed] = { ...melody[changed], degree: Math.max(0, Math.min(9, melody[changed].degree + randomItem([-1, 1]))) };
      }
    }
    if (bar % 2 === 0) {
      noise({ dest: musicBus, start: time, duration: 2.8, volume: 0.018, type: "lowpass", from: 350, to: 1400 });
    }
  }

  function scheduleStep(time) {
    const position = step % 8;
    if (position === 0) startBar(time);
    const duration = stepDuration();
    const [root, quality] = PROGRESSIONS[progressionIndex][bar % 4];
    const chord = CHORDS[quality];
    const battle = intensity > 0.5;

    if (position === 0) {
      for (const interval of [...chord, 12]) {
        tone({
          dest: musicBus,
          freq: frequency(root + 12 + interval),
          start: time,
          duration: duration * 8,
          volume: 0.02,
          type: "triangle",
          attack: duration * 3,
          lowpass: 900,
        });
      }
    }

    const bassSteps = battle ? [0, 3, 4, 6] : [0, 4];
    if (bassSteps.includes(position) && (position === 0 || Math.random() < 0.7)) {
      tone({ dest: musicBus, freq: frequency(root), start: time, duration: duration * 2.4, volume: 0.09, attack: 0.02 });
      tone({ dest: musicBus, freq: frequency(root + 12), start: time, duration: duration * 1.8, volume: 0.04, type: "triangle", lowpass: 700 });
    }

    if ((battle || position % 2 === 0) && Math.random() > 0.1) {
      const tones = [...chord, 12];
      const interval = tones[ARPEGGIOS[arpeggioIndex][position] % tones.length];
      tone({
        dest: musicBus,
        freq: frequency(root + 24 + interval),
        start: time,
        duration: duration * 1.6,
        volume: battle ? 0.038 : 0.028,
        type: "triangle",
        attack: 0.006,
      });
    }

    const note = melody[position];
    if (note) {
      const freq = frequency(36 + SCALE[note.degree % 7] + 12 * Math.floor(note.degree / 7));
      const length = duration * note.length * 0.95;
      if (profile.lead === "bell") {
        tone({ dest: musicBus, freq: freq * 2, start: time, duration: length * 1.6, volume: profile.leadVolume, attack: 0.005 });
        tone({ dest: musicBus, freq: freq * 5.4, start: time, duration: length * 0.5, volume: profile.leadVolume * 0.3, attack: 0.003 });
      } else if (profile.lead === "pluck") {
        tone({ dest: musicBus, freq: freq * 2, start: time, duration: length * 0.7, volume: profile.leadVolume, type: "triangle", attack: 0.004, lowpass: 3200 });
      } else {
        tone({ dest: musicBus, freq, start: time, duration: length, volume: profile.leadVolume, attack: 0.04, vibrato: { rate: 5.5, depth: 4 } });
      }
    }

    if (battle) {
      if (position % 4 === 0) tone({ dest: musicBus, freq: 125, to: 45, start: time, duration: 0.2, volume: 0.13 });
      if (position === 2 || position === 6) {
        noise({ dest: musicBus, start: time, duration: 0.12, volume: 0.05, from: 1800, q: 0.8 });
      }
      if (position % 2 === 1) noise({ dest: musicBus, start: time, duration: 0.04, volume: 0.025, type: "highpass", from: 7000 });
    }
  }

  // Agenda notas com folga grande e relógio em Web Worker: no celular o thread
  // principal engasga ao redesenhar o tabuleiro e, com timers atrasados, a música
  // perdia passos e ficava mais lenta que no desktop.
  const LOOKAHEAD = 1.2;
  const TICK_INTERVAL_MS = 100;

  function tick() {
    if (!context || !musicEnabled) return;
    if (nextStepTime < context.currentTime - LOOKAHEAD) nextStepTime = context.currentTime + 0.05;
    while (nextStepTime < context.currentTime + LOOKAHEAD) {
      scheduleStep(nextStepTime);
      step += 1;
      nextStepTime += stepDuration();
    }
  }

  function startScheduler() {
    try {
      const source = `setInterval(() => postMessage(0), ${TICK_INTERVAL_MS});`;
      const url = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
      schedulerWorker = new Worker(url);
      URL.revokeObjectURL(url);
      schedulerWorker.onmessage = tick;
    } catch (error) {
      schedulerWorker = undefined;
      schedulerTimer = window.setInterval(tick, TICK_INTERVAL_MS);
    }
  }

  function stopScheduler() {
    if (schedulerWorker) schedulerWorker.terminate();
    schedulerWorker = undefined;
    window.clearInterval(schedulerTimer);
    schedulerTimer = undefined;
  }

  function setMusic(enabled) {
    if (enabled && !unlock()) return false;
    if (enabled) {
      musicEnabled = true;
      musicBus.gain.cancelScheduledValues(context.currentTime);
      musicBus.gain.setTargetAtTime(0.9, context.currentTime, 0.2);
      if (!schedulerTimer && !schedulerWorker) {
        step = 0;
        bar = -1;
        nextStepTime = context.currentTime + 0.05;
        tick();
        startScheduler();
      }
    } else {
      musicEnabled = false;
      stopScheduler();
      if (context) {
        musicBus.gain.cancelScheduledValues(context.currentTime);
        musicBus.gain.setTargetAtTime(0, context.currentTime, 0.08);
      }
    }
    return true;
  }

  function setSfx(enabled) {
    sfxEnabled = enabled;
    if (sfxBus) sfxBus.gain.setTargetAtTime(enabled ? 0.9 : 0, context.currentTime, 0.02);
  }

  const SOUNDS = {
    shot(type, t) {
      if (type === "bat") {
        tone({ dest: sfxBus, freq: 2200, to: 3200, start: t, duration: 0.05, volume: 0.06, type: "square", lowpass: 4000 });
        tone({ dest: sfxBus, freq: 3000, to: 2000, start: t + 0.05, duration: 0.06, volume: 0.05, type: "square", lowpass: 4000 });
      } else if (type === "witch") {
        tone({ dest: sfxBus, freq: 300, to: 900, start: t, duration: 0.3, volume: 0.1, type: "sawtooth", lowpass: 1800 });
        tone({ dest: sfxBus, freq: 450, to: 1350, start: t, duration: 0.3, volume: 0.05, type: "triangle" });
        noise({ dest: sfxBus, start: t, duration: 0.25, volume: 0.08, type: "bandpass", from: 800, to: 3000, q: 3 });
      } else if (type === "cauldron") {
        noise({ dest: sfxBus, start: t, duration: 0.22, volume: 0.15, type: "lowpass", from: 600, to: 1600 });
        tone({ dest: sfxBus, freq: 180, to: 320, start: t, duration: 0.18, volume: 0.1, type: "sine" });
        tone({ dest: sfxBus, freq: 260, to: 420, start: t + 0.07, duration: 0.14, volume: 0.07, type: "sine" });
      } else if (type === "hunter") {
        noise({ dest: sfxBus, start: t, duration: 0.07, volume: 0.2, type: "highpass", from: 2500 });
        tone({ dest: sfxBus, freq: 1400, to: 380, start: t, duration: 0.2, volume: 0.1, type: "triangle" });
      } else if (type === "cat") {
        tone({ dest: sfxBus, freq: 700, to: 1400, start: t, duration: 0.14, volume: 0.14, type: "triangle" });
        tone({ dest: sfxBus, freq: 1800, to: 900, start: t + 0.03, duration: 0.18, volume: 0.07 });
        noise({ dest: sfxBus, start: t, duration: 0.1, volume: 0.05, type: "highpass", from: 4000 });
      } else {
        noise({ dest: sfxBus, start: t, duration: 0.16, volume: 0.22, from: 500, to: 2200, q: 2 });
        tone({ dest: sfxBus, freq: 640, to: 240, start: t, duration: 0.16, volume: 0.12, type: "triangle" });
      }
    },
    impact(_, t) {
      noise({ dest: sfxBus, start: t, duration: 0.14, volume: 0.25, type: "lowpass", from: 1800, to: 250 });
      tone({ dest: sfxBus, freq: 150, to: 55, start: t, duration: 0.12, volume: 0.18 });
    },
    destroyed(_, t) {
      tone({ dest: sfxBus, freq: 380, to: 70, start: t, duration: 0.3, volume: 0.1, type: "sawtooth", lowpass: 1500 });
      noise({ dest: sfxBus, start: t, duration: 0.3, volume: 0.22, from: 900, to: 200 });
      tone({ dest: sfxBus, freq: 988, start: t + 0.12, duration: 0.12, volume: 0.08 });
      tone({ dest: sfxBus, freq: 1319, start: t + 0.18, duration: 0.18, volume: 0.08 });
    },
    status(kind, t) {
      if (kind === "freeze") {
        [1568, 2093, 2637].forEach((note, index) => tone({ dest: sfxBus, freq: note, start: t + index * 0.04, duration: 0.18, volume: 0.06, type: "triangle" }));
      } else if (kind === "stun") {
        tone({ dest: sfxBus, freq: 900, to: 300, start: t, duration: 0.2, volume: 0.07, type: "square", lowpass: 1400 });
        tone({ dest: sfxBus, freq: 300, to: 900, start: t + 0.1, duration: 0.15, volume: 0.05, type: "square", lowpass: 1400 });
      } else if (kind === "burn") {
        noise({ dest: sfxBus, start: t, duration: 0.2, volume: 0.1, type: "highpass", from: 2000 });
      } else if (kind === "poison") {
        tone({ dest: sfxBus, freq: 200, to: 320, start: t, duration: 0.12, volume: 0.07, type: "sine" });
        tone({ dest: sfxBus, freq: 300, to: 200, start: t + 0.08, duration: 0.12, volume: 0.06, type: "sine" });
      } else {
        tone({ dest: sfxBus, freq: 500, to: 250, start: t, duration: 0.15, volume: 0.06, type: "triangle" });
      }
    },
    enemySpawn(type, t) {
      const voice = {
        ghost: () => { tone({ dest: sfxBus, freq: 420, to: 640, start: t, duration: 0.35, volume: 0.06, type: "sine", attack: 0.1 }); tone({ dest: sfxBus, freq: 640, to: 380, start: t + 0.3, duration: 0.35, volume: 0.05, type: "sine" }); },
        spider: () => { for (let i = 0; i < 4; i += 1) tone({ dest: sfxBus, freq: 3400 + i * 150, start: t + i * 0.05, duration: 0.03, volume: 0.04, type: "square", lowpass: 5000 }); },
        zombie: () => { tone({ dest: sfxBus, freq: 110, to: 70, start: t, duration: 0.5, volume: 0.12, type: "sawtooth", lowpass: 500, vibrato: 18 }); noise({ dest: sfxBus, start: t, duration: 0.4, volume: 0.06, type: "lowpass", from: 500, to: 200 }); },
        skeleton: () => { for (let i = 0; i < 4; i += 1) tone({ dest: sfxBus, freq: 1200 + (i % 2) * 400, start: t + i * 0.07, duration: 0.04, volume: 0.07, type: "square", lowpass: 3000 }); },
        vampire: () => { tone({ dest: sfxBus, freq: 880, to: 440, start: t, duration: 0.45, volume: 0.06, type: "sawtooth", lowpass: 1500 }); tone({ dest: sfxBus, freq: 1320, to: 660, start: t + 0.05, duration: 0.4, volume: 0.04, type: "triangle" }); },
        clown: () => { [660, 880, 660, 990, 760].forEach((note, i) => tone({ dest: sfxBus, freq: note, start: t + i * 0.09, duration: 0.08, volume: 0.06, type: "square", lowpass: 2200 })); },
        ogre: () => { tone({ dest: sfxBus, freq: 70, to: 45, start: t, duration: 0.8, volume: 0.22, type: "sawtooth", lowpass: 400 }); noise({ dest: sfxBus, start: t, duration: 0.5, volume: 0.12, type: "lowpass", from: 400, to: 100 }); },
      };
      (voice[type] || voice.ghost)();
    },
    enemyDeath(type, t) {
      const voice = {
        ghost: () => tone({ dest: sfxBus, freq: 700, to: 200, start: t, duration: 0.45, volume: 0.07, type: "sine" }),
        spider: () => { tone({ dest: sfxBus, freq: 2600, to: 600, start: t, duration: 0.15, volume: 0.05, type: "square", lowpass: 4000 }); noise({ dest: sfxBus, start: t, duration: 0.1, volume: 0.08, type: "highpass", from: 3000 }); },
        zombie: () => tone({ dest: sfxBus, freq: 150, to: 50, start: t, duration: 0.6, volume: 0.13, type: "sawtooth", lowpass: 450 }),
        skeleton: () => { for (let i = 0; i < 6; i += 1) tone({ dest: sfxBus, freq: 900 + Math.random() * 900, start: t + i * 0.05, duration: 0.04, volume: 0.07, type: "square", lowpass: 3000 }); },
        vampire: () => { tone({ dest: sfxBus, freq: 900, to: 120, start: t, duration: 0.5, volume: 0.07, type: "sawtooth", lowpass: 1600 }); noise({ dest: sfxBus, start: t, duration: 0.3, volume: 0.1, type: "bandpass", from: 2500, to: 400, q: 2 }); },
        clown: () => [880, 740, 622, 494, 392].forEach((note, i) => tone({ dest: sfxBus, freq: note, start: t + i * 0.08, duration: 0.1, volume: 0.06, type: "square", lowpass: 2200 })),
        ogre: () => { tone({ dest: sfxBus, freq: 90, to: 30, start: t, duration: 1, volume: 0.25, type: "sawtooth", lowpass: 350 }); noise({ dest: sfxBus, start: t, duration: 0.7, volume: 0.18, type: "lowpass", from: 800, to: 80 }); },
      };
      (voice[type] || voice.ghost)();
    },
    bonus(_, t) {
      [988, 1319, 1760].forEach((note, index) => tone({ dest: sfxBus, freq: note, start: t + index * 0.06, duration: 0.22, volume: 0.1, type: "triangle" }));
    },
    bonusAppear(_, t) {
      tone({ dest: sfxBus, freq: 1568, start: t, duration: 0.1, volume: 0.04, type: "sine" });
    },
    enemyShot(_, t) {
      tone({ dest: sfxBus, freq: 320, to: 140, start: t, duration: 0.14, volume: 0.07, type: "sawtooth", lowpass: 900 });
    },
    towerHit(_, t) {
      noise({ dest: sfxBus, start: t, duration: 0.12, volume: 0.2, type: "lowpass", from: 1400, to: 300 });
      tone({ dest: sfxBus, freq: 220, to: 90, start: t, duration: 0.14, volume: 0.12, type: "square", lowpass: 900 });
    },
    towerDestroyed(_, t) {
      noise({ dest: sfxBus, start: t, duration: 0.55, volume: 0.32, type: "lowpass", from: 2200, to: 120 });
      tone({ dest: sfxBus, freq: 220, to: 38, start: t, duration: 0.5, volume: 0.25, type: "sawtooth", lowpass: 800 });
      tone({ dest: sfxBus, freq: 110, to: 45, start: t + 0.12, duration: 0.45, volume: 0.18 });
    },
    repair(_, t) {
      [392, 523, 659].forEach((note, index) => {
        tone({ dest: sfxBus, freq: note, start: t + index * 0.07, duration: 0.2, volume: 0.09, type: "triangle" });
      });
      noise({ dest: sfxBus, start: t, duration: 0.12, volume: 0.06, type: "highpass", from: 3000 });
    },
    place(_, t) {
      tone({ dest: sfxBus, freq: 180, to: 70, start: t, duration: 0.16, volume: 0.22 });
      tone({ dest: sfxBus, freq: 523, start: t + 0.05, duration: 0.35, volume: 0.1, type: "triangle" });
      tone({ dest: sfxBus, freq: 784, start: t + 0.12, duration: 0.35, volume: 0.08, type: "triangle" });
    },
    select(_, t) {
      tone({ dest: sfxBus, freq: 640, start: t, duration: 0.07, volume: 0.08, type: "triangle" });
    },
    error(_, t) {
      tone({ dest: sfxBus, freq: 160, to: 110, start: t, duration: 0.18, volume: 0.07, type: "square", lowpass: 700 });
    },
    escaped(_, t) {
      tone({ dest: sfxBus, freq: 260, to: 90, start: t, duration: 0.45, volume: 0.12, type: "sawtooth", lowpass: 900 });
      tone({ dest: sfxBus, freq: 80, start: t, duration: 0.4, volume: 0.15 });
    },
    waveStart(_, t) {
      for (const [offset, notes] of [[0, [147, 220]], [0.28, [196, 294]]]) {
        for (const note of notes) {
          tone({ dest: sfxBus, freq: note, start: t + offset, duration: 0.6, volume: 0.06, type: "sawtooth", attack: 0.08, lowpass: 1100 });
        }
      }
    },
    waveClear(_, t) {
      [523, 659, 784, 1047].forEach((note, index) => {
        tone({ dest: sfxBus, freq: note, start: t + index * 0.1, duration: 0.35, volume: 0.13, type: "triangle" });
        tone({ dest: sfxBus, freq: note * 2, start: t + index * 0.1, duration: 0.2, volume: 0.04, type: "sine" });
      });
      for (const note of [784, 988, 1319]) {
        tone({ dest: sfxBus, freq: note, start: t + 0.45, duration: 0.9, volume: 0.09, type: "triangle", attack: 0.02 });
      }
      tone({ dest: sfxBus, freq: 131, start: t + 0.45, duration: 0.8, volume: 0.14, type: "sine" });
      noise({ dest: sfxBus, start: t + 0.45, duration: 0.5, volume: 0.07, type: "highpass", from: 5000 });
    },
    victory(_, t) {
      [523, 659, 784, 1047, 1319, 1568, 2093].forEach((note, index) => {
        tone({ dest: sfxBus, freq: note, start: t + index * 0.12, duration: 0.5, volume: 0.1, type: "triangle" });
      });
      for (const note of [523, 659, 784, 1047]) {
        tone({ dest: sfxBus, freq: note, start: t + 0.9, duration: 1.2, volume: 0.07, type: "triangle", attack: 0.03 });
      }
    },
    defeat(_, t) {
      [392, 349, 294, 196].forEach((note, index) => {
        tone({ dest: sfxBus, freq: note, start: t + index * 0.22, duration: 0.45, volume: 0.1, type: "sawtooth", lowpass: 900 });
      });
    },
  };

  function play(name, argument, delay = 0) {
    if (!sfxEnabled || !context || context.state === "closed") return;
    const now = context.currentTime;
    const interval = MIN_SOUND_INTERVAL[name];
    if (interval && now - (lastPlayed[name] ?? -Infinity) < interval) return;
    lastPlayed[name] = now;
    SOUNDS[name](argument, now + delay);
  }

  function setPaused(value) {
    paused = value;
    if (!context) return;
    if (value && context.state === "running") context.suspend().catch(() => {});
    else if (!value && context.state === "suspended") context.resume().catch(() => {});
  }

  function setTheme(key) {
    profile = PROFILES[key] || PROFILES.halloween;
    SCALE = profile.scale;
    PROGRESSIONS = profile.progressions;
    ARPEGGIOS = profile.arpeggios;
    progressionIndex = 0;
    arpeggioIndex = 0;
    bar = -1;
    step = 0;
    melody = [];
  }

  function setIntensity(value) {
    intensity = value;
  }

  return {
    unlock,
    setMusic,
    setSfx,
    setIntensity,
    setTheme,
    setPaused,
    setVolume,
    getVolume: () => volume,
    play,
    isMusicEnabled: () => musicEnabled,
    isSfxEnabled: () => sfxEnabled,
  };
})();
