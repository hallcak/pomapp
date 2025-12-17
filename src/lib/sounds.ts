export type SoundType = 'classic' | 'bell' | 'tomato-splat' | 'tomato-squeeze' | 'pop' | 'victory' | 'cartoon' | 'duck' | 'slap' | 'frog' | 'snake' | 'none'

export const SOUND_OPTIONS: { value: SoundType; label: string; emoji: string }[] = [
  { value: 'classic', label: 'Classic Beep', emoji: '🔔' },
  { value: 'bell', label: 'Bell Chime', emoji: '🔔' },
  { value: 'tomato-splat', label: 'Tomato Splat', emoji: '🍅' },
  { value: 'tomato-squeeze', label: 'Tomato Squeeze', emoji: '🍅' },
  { value: 'pop', label: 'Pop', emoji: '🎈' },
  { value: 'victory', label: 'Victory Fanfare', emoji: '🎉' },
  { value: 'cartoon', label: 'Cartoon Boing', emoji: '🎪' },
  { value: 'duck', label: 'Rubber Duck', emoji: '🦆' },
  { value: 'slap', label: 'Slap', emoji: '👋' },
  { value: 'frog', label: 'Frog Croak', emoji: '🐸' },
  { value: 'snake', label: 'Snake Hiss', emoji: '🐍' },
  { value: 'none', label: 'No Sound', emoji: '🔇' },
]

function getAudioContext(): AudioContext {
  return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
}

function playClassic(ctx: AudioContext) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.value = 800
  osc.type = 'sine'
  gain.gain.setValueAtTime(0.3, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
  osc.start()
  osc.stop(ctx.currentTime + 0.3)
}

function playBell(ctx: AudioContext) {
  const frequencies = [523, 659, 784, 1047]
  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = freq
    osc.type = 'sine'
    const startTime = ctx.currentTime + i * 0.1
    gain.gain.setValueAtTime(0.2, startTime)
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4)
    osc.start(startTime)
    osc.stop(startTime + 0.4)
  })
}

function playTomatoSplat(ctx: AudioContext) {
  // Splat sound - noise burst with pitch drop
  const bufferSize = ctx.sampleRate * 0.3
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)

  for (let i = 0; i < bufferSize; i++) {
    const t = i / ctx.sampleRate
    const decay = Math.exp(-t * 15)
    data[i] = (Math.random() * 2 - 1) * decay
  }

  const noise = ctx.createBufferSource()
  noise.buffer = buffer

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(2000, ctx.currentTime)
  filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2)

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.5, ctx.currentTime)

  noise.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  noise.start()

  // Add a low "thud"
  const osc = ctx.createOscillator()
  const oscGain = ctx.createGain()
  osc.connect(oscGain)
  oscGain.connect(ctx.destination)
  osc.frequency.setValueAtTime(150, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.15)
  osc.type = 'sine'
  oscGain.gain.setValueAtTime(0.4, ctx.currentTime)
  oscGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
  osc.start()
  osc.stop(ctx.currentTime + 0.15)
}

function playTomatoSqueeze(ctx: AudioContext) {
  // Juicy squeeze sound - wet, squishy
  const duration = 0.4

  // Multiple "squish" oscillators
  for (let i = 0; i < 3; i++) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    const startTime = ctx.currentTime + i * 0.08
    const baseFreq = 200 + Math.random() * 100

    osc.frequency.setValueAtTime(baseFreq, startTime)
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, startTime + 0.1)
    osc.frequency.setValueAtTime(baseFreq * 1.2, startTime + 0.1)
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.3, startTime + 0.2)
    osc.type = 'sine'

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(800, startTime)
    filter.Q.value = 5

    gain.gain.setValueAtTime(0.25, startTime)
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15)

    osc.start(startTime)
    osc.stop(startTime + 0.2)
  }

  // Add wet "juice" noise
  const bufferSize = ctx.sampleRate * duration
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)

  for (let i = 0; i < bufferSize; i++) {
    const t = i / ctx.sampleRate
    const envelope = Math.sin(t * Math.PI / duration) * Math.exp(-t * 3)
    data[i] = (Math.random() * 2 - 1) * envelope * 0.3
  }

  const noise = ctx.createBufferSource()
  noise.buffer = buffer

  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 600
  filter.Q.value = 2

  const gain = ctx.createGain()
  gain.gain.value = 0.4

  noise.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  noise.start()
}

function playPop(ctx: AudioContext) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.setValueAtTime(400, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1)
  osc.type = 'sine'
  gain.gain.setValueAtTime(0.4, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
  osc.start()
  osc.stop(ctx.currentTime + 0.1)
}

function playVictory(ctx: AudioContext) {
  const notes = [523, 659, 784, 1047, 784, 1047]
  const durations = [0.1, 0.1, 0.1, 0.2, 0.1, 0.3]
  let time = ctx.currentTime

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = freq
    osc.type = 'square'
    gain.gain.setValueAtTime(0.15, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + durations[i])
    osc.start(time)
    osc.stop(time + durations[i])
    time += durations[i]
  })
}

function playCartoon(ctx: AudioContext) {
  // Boing sound
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.setValueAtTime(200, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1)
  osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.3)
  osc.type = 'sine'
  gain.gain.setValueAtTime(0.3, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
  osc.start()
  osc.stop(ctx.currentTime + 0.4)
}

function playDuck(ctx: AudioContext) {
  // Rubber duck squeak
  for (let i = 0; i < 2; i++) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    const startTime = ctx.currentTime + i * 0.25
    osc.frequency.setValueAtTime(800, startTime)
    osc.frequency.exponentialRampToValueAtTime(1200, startTime + 0.05)
    osc.frequency.exponentialRampToValueAtTime(600, startTime + 0.15)
    osc.type = 'sine'

    gain.gain.setValueAtTime(0.3, startTime)
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2)

    osc.start(startTime)
    osc.stop(startTime + 0.2)
  }
}

function playSlap(ctx: AudioContext) {
  // Sharp slap sound
  const bufferSize = ctx.sampleRate * 0.15
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)

  for (let i = 0; i < bufferSize; i++) {
    const t = i / ctx.sampleRate
    const decay = Math.exp(-t * 40)
    data[i] = (Math.random() * 2 - 1) * decay
  }

  const noise = ctx.createBufferSource()
  noise.buffer = buffer

  const filter = ctx.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.value = 1000

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.6, ctx.currentTime)

  noise.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  noise.start()

  // Add a sharp attack
  const osc = ctx.createOscillator()
  const oscGain = ctx.createGain()
  osc.connect(oscGain)
  oscGain.connect(ctx.destination)
  osc.frequency.setValueAtTime(300, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05)
  osc.type = 'triangle'
  oscGain.gain.setValueAtTime(0.5, ctx.currentTime)
  oscGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08)
  osc.start()
  osc.stop(ctx.currentTime + 0.08)
}

function playFrog(ctx: AudioContext) {
  // Frog croak - "ribbit"
  for (let i = 0; i < 2; i++) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    const startTime = ctx.currentTime + i * 0.2

    // Croak frequency pattern
    osc.frequency.setValueAtTime(120, startTime)
    osc.frequency.exponentialRampToValueAtTime(200, startTime + 0.05)
    osc.frequency.exponentialRampToValueAtTime(80, startTime + 0.15)
    osc.type = 'sawtooth'

    gain.gain.setValueAtTime(0.3, startTime)
    gain.gain.setValueAtTime(0.35, startTime + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.18)

    osc.start(startTime)
    osc.stop(startTime + 0.18)
  }

  // Add some "bubbling" harmonics
  const osc2 = ctx.createOscillator()
  const gain2 = ctx.createGain()
  osc2.connect(gain2)
  gain2.connect(ctx.destination)
  osc2.frequency.setValueAtTime(350, ctx.currentTime)
  osc2.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.3)
  osc2.type = 'sine'
  gain2.gain.setValueAtTime(0.1, ctx.currentTime)
  gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
  osc2.start()
  osc2.stop(ctx.currentTime + 0.3)
}

function playSnake(ctx: AudioContext) {
  // Snake hiss - white noise with filtering
  const duration = 0.5
  const bufferSize = ctx.sampleRate * duration
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)

  for (let i = 0; i < bufferSize; i++) {
    const t = i / ctx.sampleRate
    // Envelope: fade in then fade out
    const envelope = Math.sin(t * Math.PI / duration)
    data[i] = (Math.random() * 2 - 1) * envelope
  }

  const noise = ctx.createBufferSource()
  noise.buffer = buffer

  // High-pass filter for hiss
  const highpass = ctx.createBiquadFilter()
  highpass.type = 'highpass'
  highpass.frequency.value = 3000

  // Band-pass for character
  const bandpass = ctx.createBiquadFilter()
  bandpass.type = 'bandpass'
  bandpass.frequency.setValueAtTime(6000, ctx.currentTime)
  bandpass.frequency.linearRampToValueAtTime(4000, ctx.currentTime + duration)
  bandpass.Q.value = 1

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.3, ctx.currentTime)

  noise.connect(highpass)
  highpass.connect(bandpass)
  bandpass.connect(gain)
  gain.connect(ctx.destination)
  noise.start()

  // Add slight tonal "sss" component
  const osc = ctx.createOscillator()
  const oscGain = ctx.createGain()
  osc.connect(oscGain)
  oscGain.connect(ctx.destination)
  osc.frequency.value = 5000
  osc.type = 'sine'
  oscGain.gain.setValueAtTime(0.05, ctx.currentTime)
  oscGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.2)
  oscGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)
  osc.start()
  osc.stop(ctx.currentTime + duration)
}

export function playSound(soundType: SoundType) {
  if (soundType === 'none') return

  const ctx = getAudioContext()

  switch (soundType) {
    case 'classic':
      playClassic(ctx)
      break
    case 'bell':
      playBell(ctx)
      break
    case 'tomato-splat':
      playTomatoSplat(ctx)
      break
    case 'tomato-squeeze':
      playTomatoSqueeze(ctx)
      break
    case 'pop':
      playPop(ctx)
      break
    case 'victory':
      playVictory(ctx)
      break
    case 'cartoon':
      playCartoon(ctx)
      break
    case 'duck':
      playDuck(ctx)
      break
    case 'slap':
      playSlap(ctx)
      break
    case 'frog':
      playFrog(ctx)
      break
    case 'snake':
      playSnake(ctx)
      break
  }
}

export function previewSound(soundType: SoundType) {
  playSound(soundType)
}
