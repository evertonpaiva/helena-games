const COLUMNS = 16;
const ROWS = 10;
const ROCK_COUNT = 10;
const START_TOWERS = 2;
const UNLOCK_ORDER = ["lantern", "cauldron", "bat", "candle", "cat", "crystal", "hunter", "tombstone", "witch"];
const RESEARCH_MAX_LEVEL = 3;
const RESEARCH_BONUS = { damage: 0.3, hp: 0.25, range: 0.25, heal: 0.3 };
const TOTAL_WAVES = 10;
const TICK_MS = 625;
const levelOf = (wave) => (wave - 1) * 2 + 1;
const STARTING_COINS = 550;
const VOICE_CHANCE = { spawn: 0.6, death: 0.75 };
const STARTING_LIVES = 15;
const REPAIR_COST_PER_HP = 0.5;
const SAVE_KEY = "tower-defense-feriados-save-v2";
const LEGACY_SAVE_KEY = "tower-defense-feriados-save-v1";

const STATUS_INFO = {
  freeze: { icon: "❄️", label: "Congelado" },
  stun: { icon: "💫", label: "Atordoado" },
  disarm: { icon: "🔇", label: "Desarmado" },
  slow: { icon: "🐌", label: "Lento" },
  burn: { icon: "🔥", label: "Queimando" },
  poison: { icon: "☠️", label: "Envenenado" },
};

const ELEMENT_LABELS = { fire: "fogo", arcane: "arcano", physical: "físico", poison: "veneno", frost: "gelo" };

// Arquétipos: a mecânica (dano, alcance, efeitos, preços) é comum a todos os temas;
// cada tema só troca identidade visual e, nos invasores, fraquezas/imunidades.
const TOWER_BASE = {
  lantern: {
    name: "Lanterna", emoji: "🎃", price: 70, damage: 24, range: 2.7, reload: 3, hp: 60, element: "fire",
    effects: [{ status: "burn", ticks: 3, power: 4 }],
    glyph: "✦", color: "#ffb447", blurb: "Fogo: queima o alvo",
  },
  cat: {
    name: "Gato mágico", emoji: "🐈‍⬛", price: 115, damage: 44, range: 3.2, reload: 4, hp: 80, element: "arcane",
    effects: [{ status: "stun", ticks: 3, chance: 0.3 }],
    glyph: "◆", color: "#c58cff", blurb: "Arcano: pode atordoar",
  },
  bat: {
    name: "Morcego", emoji: "🦇", price: 90, damage: 14, range: 3.6, reload: 2, hp: 45, element: "physical",
    effects: [{ status: "disarm", ticks: 4, chance: 0.4 }],
    glyph: "➤", color: "#ff6b8a", blurb: "Rápido: pode desarmar",
  },
  witch: {
    name: "Bruxa", emoji: "🧙", price: 150, damage: 30, range: 3, reload: 5, hp: 70, element: "arcane", splash: 1.3,
    effects: [{ status: "poison", ticks: 4, power: 3 }],
    glyph: "✺", color: "#7dff9c", blurb: "Área arcana + veneno",
  },
  cauldron: {
    name: "Caldeirão", emoji: "🫕", price: 100, damage: 9, range: 2.4, reload: 3, hp: 95, element: "poison",
    effects: [{ status: "slow", ticks: 5 }],
    glyph: "●", color: "#5fe0ff", blurb: "Poção: retarda o inimigo",
  },
  crystal: {
    name: "Cristal gélido", emoji: "🧊", price: 110, damage: 16, range: 2.8, reload: 5, hp: 60, element: "frost",
    effects: [{ status: "freeze", ticks: 3, chance: 0.5 }, { status: "slow", ticks: 4 }],
    glyph: "❆", color: "#b8ecff", blurb: "Gelo: congela ou retarda",
  },
  hunter: {
    name: "Caçador", emoji: "🏹", price: 130, damage: 58, range: 4.4, reload: 6, hp: 55, element: "physical", crit: 0.2,
    effects: [],
    glyph: "➳", color: "#ffe27a", blurb: "Longo alcance; 20% crítico",
  },
  candle: {
    name: "Vela benta", emoji: "🕯️", price: 85, damage: 0, range: 0, reload: 4, hp: 50, heal: { amount: 9, range: 2.3 },
    effects: [],
    glyph: "", color: "#fff0a8", blurb: "Cura defesas próximas",
  },
  tombstone: {
    name: "Lápide", emoji: "🪦", price: 45, damage: 0, range: 0, reload: 1, hp: 240, bait: true,
    effects: [],
    glyph: "", color: "#9aa0b5", blurb: "Escudo que atrai ataques",
  },
};

const ENEMY_BASE = {
  ghost: {
    name: "Fantasma", emoji: "👻", hp: 1, speed: 3, reward: 1, from: 1, weight: 3,
    attack: { damage: 4, range: 1.5, cooldown: 4 }, glyph: "✺", color: "#c9b3ff",
    mods: { physical: 0.4, arcane: 1.5 }, immune: ["poison"],
  },
  spider: {
    name: "Aranha", emoji: "🕷️", hp: 0.6, speed: 2, reward: 1, from: 2, weight: 2,
    attack: { damage: 3, range: 1.5, cooldown: 2 }, glyph: "✶", color: "#d8d8e8",
    mods: { fire: 1.6, poison: 0.5 }, immune: [],
  },
  zombie: {
    name: "Zumbi", emoji: "🧟", hp: 2, speed: 4, reward: 1.4, from: 3, weight: 2,
    attack: { damage: 10, range: 1.5, cooldown: 4 }, glyph: "✸", color: "#8fd46a",
    mods: { fire: 1.5, frost: 0.7 }, immune: ["poison", "stun"],
  },
  skeleton: {
    name: "Esqueleto", emoji: "💀", hp: 0.9, speed: 3, reward: 1.3, from: 5, weight: 2,
    attack: { damage: 7, range: 3, cooldown: 5 }, glyph: "➶", color: "#f0e6c8",
    mods: { physical: 0.5, arcane: 1.4 }, immune: ["poison", "burn"],
  },
  vampire: {
    name: "Vampiro", emoji: "🧛", hp: 1.6, speed: 3, reward: 1.7, from: 9, weight: 2,
    attack: { damage: 12, range: 2, cooldown: 4 }, glyph: "❖", color: "#ff5d6e",
    mods: { fire: 1.4, frost: 0.6 }, immune: ["freeze"],
  },
  clown: {
    name: "Palhaço sinistro", emoji: "🤡", hp: 1.2, speed: 2, reward: 1.6, from: 12, weight: 2,
    attack: { damage: 6, range: 1.5, cooldown: 3 }, glyph: "✹", color: "#ff7a3d",
    mods: { poison: 1.4, physical: 1.2 }, immune: ["disarm"],
  },
  ogre: {
    name: "Ogro", emoji: "👹", hp: 5, speed: 4, reward: 4, from: 99, weight: 0, boss: true,
    attack: { damage: 22, range: 2.2, cooldown: 4 }, glyph: "☄", color: "#ff3b3b",
    mods: { frost: 0.8 }, immune: ["stun"],
  },
};

const TOWERS = {};
const ENEMIES = {};
const BONUS_TYPES = [];
const BONUS_LIFETIME = 12;
const BONUS_MAX_ON_BOARD = 2;
const BONUS_SPAWN_CHANCE = 0.05;
let DECOR = [];
let DECOR_LANDMARKS = {};

const THEME_DEFS = {
  halloween: {
    id: 1, name: "Dia das Bruxas", icon: "🎃", blurb: "Noite sombria e criaturas da escuridão",
    music: "Trilha de Halloween", sky: "halloween", victory: "Fase Dia das Bruxas concluída!",
    towers: {},
    enemies: {},
    bonus: [
      { emoji: "🍬", value: 22, weight: 5, name: "Doce" },
      { emoji: "💰", value: 38, weight: 3, name: "Bolsa de moedas" },
      { emoji: "💎", value: 70, weight: 1, name: "Gema" },
    ],
    decor: ["🌲", "🌲", "🪦", "🍄", "🕸️", "🦴", "🍂", "🌿", "🪦", "🌲"],
    landmarks: { 10: "🏚️", 49: "⚰️", 12: "🌳", 84: "🦉" },
  },
  natal: {
    id: 2, name: "Natal", icon: "🎄", blurb: "Vila coberta de neve e duendes travessos",
    music: "Trilha de Natal", sky: "natal", victory: "Fase Natal concluída!",
    towers: {
      lantern: { name: "Lareira", emoji: "🔥", color: "#ff8a3d" },
      cat: { name: "Anjo de luz", emoji: "👼", color: "#fff2a8" },
      bat: { name: "Rena veloz", emoji: "🦌", color: "#d9a066" },
      witch: { name: "Mamãe Noel", emoji: "🤶", color: "#ff6b6b" },
      cauldron: { name: "Chocolate quente", emoji: "☕", color: "#c98a5a" },
      crystal: { name: "Boneco de neve", emoji: "⛄", color: "#cfefff" },
      hunter: { name: "Papai Noel", emoji: "🎅", color: "#ff4d4d" },
      candle: { name: "Sino abençoado", emoji: "🔔", color: "#ffe27a" },
      tombstone: { name: "Árvore de Natal", emoji: "🎄", color: "#5fd17a" },
    },
    enemies: {
      ghost: { name: "Espírito do inverno", emoji: "🥶", color: "#a9dcff", mods: { physical: 0.5, fire: 1.5 }, immune: ["poison", "freeze"] },
      spider: { name: "Pinguim ladrão", emoji: "🐧", color: "#dfe8f5", mods: { fire: 1.6, frost: 0.4 }, immune: ["freeze"] },
      zombie: { name: "Mamute", emoji: "🦣", color: "#c9a27a", mods: { fire: 1.5, frost: 0.6 }, immune: ["stun", "freeze"] },
      skeleton: { name: "Quebra-nozes", emoji: "💂", color: "#ff9b9b", mods: { arcane: 1.4, physical: 0.6 }, immune: ["poison"] },
      vampire: { name: "Krampus", emoji: "😈", color: "#ff5d6e", mods: { fire: 0.6, frost: 1.3 }, immune: ["burn"] },
      clown: { name: "Elfo travesso", emoji: "🧝", color: "#7dff9c", mods: { poison: 1.4, physical: 1.2 }, immune: ["disarm"] },
      ogre: { name: "Grinch", emoji: "👺", color: "#6fe06f", mods: { frost: 0.8, arcane: 1.2 }, immune: ["stun"] },
    },
    bonus: [
      { emoji: "🎁", value: 22, weight: 5, name: "Presente" },
      { emoji: "💰", value: 38, weight: 3, name: "Bolsa de moedas" },
      { emoji: "⭐", value: 70, weight: 1, name: "Estrela de ouro" },
    ],
    decor: ["🌲", "🌲", "🧣", "❄️", "🧦", "🍪", "🌲", "🕯️", "🧤"],
    landmarks: { 10: "🏠", 49: "⛪", 12: "🌲", 84: "🛷" },
  },
  pascoa: {
    id: 3, name: "Páscoa", icon: "🐰", blurb: "Campo florido e guardiões de ovos",
    music: "Trilha de Páscoa", sky: "pascoa", victory: "Fase Páscoa concluída!",
    towers: {
      lantern: { name: "Raio de sol", emoji: "☀️", color: "#ffd34d" },
      cat: { name: "Coelho mágico", emoji: "🐇", color: "#ffb3e6" },
      bat: { name: "Passarinho", emoji: "🐦", color: "#6bd0ff" },
      witch: { name: "Fada das flores", emoji: "🧚", color: "#ff9ee0" },
      cauldron: { name: "Poça de chocolate", emoji: "🍫", color: "#9b6038" },
      crystal: { name: "Sorvete gelado", emoji: "🍦", color: "#bdeaff" },
      hunter: { name: "Arqueiro cenoura", emoji: "🥕", color: "#ff9a3c" },
      candle: { name: "Girassol curativo", emoji: "🌻", color: "#ffe14d" },
      tombstone: { name: "Cesta de ovos", emoji: "🧺", color: "#e0b06a" },
    },
    enemies: {
      ghost: { name: "Coruja sombria", emoji: "🦉", color: "#d2bfff", mods: { physical: 0.5, arcane: 1.5 }, immune: ["poison"] },
      spider: { name: "Formiga-soldado", emoji: "🐜", color: "#ff8f7a", mods: { fire: 1.6, poison: 0.5 }, immune: [] },
      zombie: { name: "Tartaruga blindada", emoji: "🐢", color: "#8fd46a", mods: { physical: 0.5, poison: 1.5 }, immune: ["stun", "freeze"] },
      skeleton: { name: "Caranguejo", emoji: "🦀", color: "#ff8a6a", mods: { frost: 1.5, physical: 0.6 }, immune: ["disarm"] },
      vampire: { name: "Raposa matreira", emoji: "🦊", color: "#ffa04d", mods: { fire: 1.4, arcane: 0.7 }, immune: ["slow"] },
      clown: { name: "Abelha furiosa", emoji: "🐝", color: "#ffe14d", mods: { poison: 1.5, frost: 1.3 }, immune: ["burn"] },
      ogre: { name: "Dragão de chocolate", emoji: "🐉", color: "#c47a3d", mods: { frost: 0.8, fire: 1.5 }, immune: ["stun"] },
    },
    bonus: [
      { emoji: "🥚", value: 22, weight: 5, name: "Ovo colorido" },
      { emoji: "🍫", value: 38, weight: 3, name: "Barra de chocolate" },
      { emoji: "🌟", value: 70, weight: 1, name: "Ovo dourado" },
    ],
    decor: ["🌷", "🌸", "🍀", "🌼", "🍄", "🐛", "🌿", "🌺", "🐞", "🌳"],
    landmarks: { 10: "🏡", 49: "⛲", 12: "🌳", 84: "🐓" },
  },
  ambiente: {
    id: 4, name: "Dia do Meio Ambiente", icon: "🌎", blurb: "Floresta ameaçada e guardiões da natureza",
    music: "Trilha do Meio Ambiente", sky: "ambiente", victory: "Fase Dia do Meio Ambiente concluída!",
    towers: {
      lantern: { name: "Energia solar", emoji: "🌞", color: "#ffd34d" },
      cat: { name: "Coruja sábia", emoji: "🦉", color: "#d2b3ff" },
      bat: { name: "Arara veloz", emoji: "🦜", color: "#ff6b6b" },
      witch: { name: "Cientista", emoji: "🧑‍🔬", color: "#7dff9c" },
      cauldron: { name: "Poço de água", emoji: "💧", color: "#5fc8ff" },
      crystal: { name: "Urso polar", emoji: "🐻‍❄️", color: "#d6f2ff" },
      hunter: { name: "Águia", emoji: "🦅", color: "#ffd27a" },
      candle: { name: "Muda de árvore", emoji: "🌱", color: "#9dff8a" },
      tombstone: { name: "Barreira de bambu", emoji: "🎋", color: "#7fd18a" },
    },
    enemies: {
      ghost: { name: "Nuvem de fumaça", emoji: "💨", color: "#b9bfcc", mods: { physical: 0.4, arcane: 1.5 }, immune: ["poison"] },
      spider: { name: "Rato do lixão", emoji: "🐀", color: "#c9b8a6", mods: { fire: 1.6, poison: 0.5 }, immune: [] },
      zombie: { name: "Barril tóxico", emoji: "🛢️", color: "#9bd45a", mods: { fire: 1.5, frost: 0.7 }, immune: ["poison", "stun"] },
      skeleton: { name: "Motosserra", emoji: "🪚", color: "#ffb36b", mods: { physical: 0.5, arcane: 1.4 }, immune: ["poison", "burn"] },
      vampire: { name: "Caminhão poluidor", emoji: "🚛", color: "#ff8a6e", mods: { fire: 1.4, frost: 0.6 }, immune: ["freeze"] },
      clown: { name: "Incendiário", emoji: "🧨", color: "#ff7a3d", mods: { poison: 1.4, physical: 1.2 }, immune: ["disarm"] },
      ogre: { name: "Escavadeira gigante", emoji: "🚜", color: "#ffc13b", mods: { frost: 0.8 }, immune: ["stun"] },
    },
    bonus: [
      { emoji: "🌰", value: 22, weight: 5, name: "Semente" },
      { emoji: "♻️", value: 38, weight: 3, name: "Reciclável" },
      { emoji: "🌍", value: 70, weight: 1, name: "Planeta salvo" },
    ],
    decor: ["🌲", "🌿", "🍃", "🍄", "🌼", "🦋", "🪵", "🌾", "🌲", "🐛"],
    landmarks: { 10: "🏞️", 49: "🌳", 12: "🌲", 84: "🦌" },
  },
};
const THEME_KEYS = Object.keys(THEME_DEFS);
let currentTheme = "halloween";

const PATH = [];
const pathSet = new Set();
const rockSet = new Set();
let mapSeed = 0;

// Rota em escada: trechos horizontais ligados por trechos verticais em colunas
// separadas por pelo menos 2 casas, o que evita cruzamentos e encostos.
function buildRoute() {
  const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
  const cells = [];
  let row = randomInt(1, ROWS - 2);
  let column = 0;
  const turns = randomInt(4, 6);
  const stops = [];
  let cursor = 1;
  for (let index = 0; index < turns; index += 1) {
    const remaining = turns - index;
    const maxColumn = COLUMNS - 2 - (remaining - 1) * 2;
    if (cursor + 1 > maxColumn) break;
    cursor = randomInt(cursor + 1, Math.min(maxColumn, cursor + 3));
    stops.push(cursor);
    cursor += 2;
  }
  for (const stop of stops) {
    for (; column < stop; column += 1) cells.push([column, row]);
    let nextRow;
    do nextRow = randomInt(0, ROWS - 1); while (Math.abs(nextRow - row) < 2);
    const step = nextRow > row ? 1 : -1;
    for (; row !== nextRow; row += step) cells.push([column, row]);
  }
  for (; column < COLUMNS; column += 1) cells.push([column, row]);
  return cells.map(([x, y]) => y * COLUMNS + x);
}

function generatePath() {
  const previous = PATH.join(",");
  let route;
  do route = buildRoute(); while (route.length < 22 || route.length > 46 || route.join(",") === previous);
  PATH.splice(0, PATH.length, ...route);
  pathSet.clear();
  for (const cell of PATH) pathSet.add(cell);
  mapSeed = Math.floor(Math.random() * 1e6);
  placeRocks();
}

// Pedras ficam em casas vizinhas ao caminho (inclusive diagonais) e bloqueiam construção.
function placeRocks() {
  rockSet.clear();
  const candidates = [];
  for (let cell = 0; cell < COLUMNS * ROWS; cell += 1) {
    if (pathSet.has(cell)) continue;
    const x = cell % COLUMNS;
    const y = Math.floor(cell / COLUMNS);
    let near = false;
    for (let dy = -1; dy <= 1 && !near; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < COLUMNS && ny >= 0 && ny < ROWS && pathSet.has(ny * COLUMNS + nx)) {
          near = true;
          break;
        }
      }
    }
    if (near) candidates.push(cell);
  }
  for (let count = 0; count < ROCK_COUNT && candidates.length; count += 1) {
    rockSet.add(candidates.splice(Math.floor(Math.random() * candidates.length), 1)[0]);
  }
}

generatePath();
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const board = document.querySelector("#board");
const effectsLayer = document.querySelector("#effects-layer");
const boardFrame = document.querySelector(".board-frame");
const themeList = document.querySelector("#theme-list");
const coinsElement = document.querySelector("#coins");
const livesElement = document.querySelector("#lives");
const towerCountElement = document.querySelector("#tower-count");
const waveCounter = document.querySelector("#wave-counter");
const messageElement = document.querySelector("#game-message");
const shopHint = document.querySelector("#shop-hint");
const cancelButton = document.querySelector("#cancel-button");
const tutorialOverlay = document.querySelector("#tutorial");
const TUTORIAL_KEY = "tower-defense-feriados-tutorial-v1";
const turnButton = document.querySelector("#turn-button");
const pauseButton = document.querySelector("#pause-button");
const pauseOverlay = document.querySelector("#pause-overlay");
const defeatOverlay = document.querySelector("#defeat");
const restartButton = document.querySelector("#restart-button");
const shopButtons = [];
const musicButton = document.querySelector("#music-toggle");
const musicLabel = document.querySelector("#music-label");
const sfxButton = document.querySelector("#sfx-toggle");
const sfxLabel = document.querySelector("#sfx-label");
const volumeSlider = document.querySelector("#volume-slider");
const volumeValue = document.querySelector("#volume-value");
const waveElements = {
  phase: document.querySelector("#wave-phase-label"),
  percent: document.querySelector("#wave-percent"),
  progress: document.querySelector("#wave-progress"),
  fill: document.querySelector("#wave-progress-fill"),
  totalLabel: document.querySelector("#wave-total-label"),
  total: document.querySelector("#wave-total"),
  remaining: document.querySelector("#wave-remaining"),
  defeated: document.querySelector("#wave-defeated"),
  escaped: document.querySelector("#wave-escaped"),
  note: document.querySelector("#wave-note"),
  roster: document.querySelector("#wave-roster"),
};
const shopItemsElement = document.querySelector("#shop-items");
const researchListElement = document.querySelector("#research-list");
const inspectorElement = document.querySelector("#tower-inspector");
let researchSignature = "";
const repairButton = document.querySelector("#repair-button");

let storageNotice = "";
const progress = loadProgress();
let game;
let nextEnemyId = 0;
let nextBonusId = 0;

function waveSize(wave) {
  return 8 + Math.ceil(levelOf(wave));
}

function waveComposition(wave) {
  const pool = [];
  for (const [id, enemy] of Object.entries(ENEMIES)) {
    if (enemy.from <= levelOf(wave)) for (let copy = 0; copy < enemy.weight; copy += 1) pool.push(id);
  }
  const size = waveSize(wave);
  const bosses = wave === TOTAL_WAVES ? 3 : wave === 8 ? 2 : wave === 5 || wave === 3 ? 1 : 0;
  const list = [];
  for (let index = 0; index < size - bosses; index += 1) {
    list.push(pool[(index * 5 + wave * 3 + Math.floor(index / 3)) % pool.length]);
  }
  for (let boss = 0; boss < bosses; boss += 1) list.push("ogre");
  return list;
}

function decorFor(cell) {
  if (pathSet.has(cell) || rockSet.has(cell)) return "";
  if (DECOR_LANDMARKS[cell]) return DECOR_LANDMARKS[cell];
  const hash = Math.imul(cell + 7 + mapSeed * 97, 2654435761) >>> 0;
  return hash % 100 < 28 ? DECOR[(hash >>> 8) % DECOR.length] : "";
}

function createGame() {
  return {
    coins: STARTING_COINS,
    lives: STARTING_LIVES,
    wave: 0,
    phase: "preparation",
    selectedTower: null,
    inspected: null,
    research: {},
    pendingResearch: {},
    towers: [],
    enemies: [],
    effects: [],
    pendingEnemies: 0,
    queue: [],
    towersLost: 0,
    lostPending: 0,
    bonuses: [],
    bonusCollected: 0,
    bonusCoins: 0,
    waveTotal: 0,
    defeated: 0,
    escaped: 0,
    tick: 0,
    paused: false,
    message: storageNotice || "Posicione suas defesas e inicie o primeiro turno.",
  };
}

function loadProgress() {
  const fresh = { completed: {}, lastTheme: "halloween" };
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      for (const key of THEME_KEYS) if (data.completed && data.completed[key] === true) fresh.completed[key] = true;
      if (THEME_KEYS.includes(data.lastTheme)) fresh.lastTheme = data.lastTheme;
      return fresh;
    }
    const legacy = localStorage.getItem(LEGACY_SAVE_KEY);
    if (legacy && JSON.parse(legacy).unlockedTheme >= 2) fresh.completed.halloween = true;
    return fresh;
  } catch (error) {
    console.error("Não foi possível ler o progresso salvo.", error);
    storageNotice = "O progresso salvo não pôde ser lido; esta partida começou do início.";
    return fresh;
  }
}

function saveProgress() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(progress));
    return true;
  } catch (error) {
    console.error("Não foi possível salvar o progresso.", error);
    return false;
  }
}

function setMessage(text) {
  game.message = text;
  render();
}

function toggleMusic() {
  const enabled = !GameAudio.isMusicEnabled();
  if (!GameAudio.setMusic(enabled)) {
    game.message = "Não foi possível iniciar a música neste navegador.";
  } else if (enabled) {
    game.message = `${THEME_DEFS[currentTheme].music} ativada. Boa defesa!`;
  }
  render();
}

function toggleSfx() {
  GameAudio.unlock();
  GameAudio.setSfx(!GameAudio.isSfxEnabled());
  if (GameAudio.isSfxEnabled()) GameAudio.play("select");
  render();
}

function buildSky(kind) {
  const flyers = (emoji, count) => Array.from({ length: count }, (_, index) => `<span class="sky-bat sky-bat-${index + 1}">${emoji}</span>`).join("");
  if (kind === "natal") {
    const flakes = Array.from({ length: 26 }, (_, index) => {
      const left = (index * 37) % 100;
      const size = 10 + (index * 7) % 12;
      const duration = 9 + (index * 5) % 9;
      return `<span class="snowflake" style="left:${left}%;font-size:${size}px;animation-duration:${duration}s;animation-delay:-${(index * 3) % duration}s">❄</span>`;
    }).join("");
    return `<span class="moon">🌙</span>${flakes}<span class="mist mist-1"></span><span class="mist mist-2"></span>`;
  }
  if (kind === "ambiente") {
    return `<span class="moon">🌤️</span><span class="sky-cloud sky-cloud-1">☁️</span><span class="sky-cloud sky-cloud-2">☁️</span>${flyers("🐦", 3)}<span class="mist mist-1"></span><span class="mist mist-2"></span>`;
  }
  if (kind === "pascoa") {
    return `<span class="moon">☀️</span><span class="sky-cloud sky-cloud-1">☁️</span><span class="sky-cloud sky-cloud-2">☁️</span>${flyers("🦋", 3)}<span class="mist mist-1"></span><span class="mist mist-2"></span>`;
  }
  return `<span class="moon">🌕</span>${flyers("🦇", 3)}<span class="mist mist-1"></span><span class="mist mist-2"></span>`;
}

function applyTheme(key) {
  const def = THEME_DEFS[key];
  currentTheme = key;
  progress.lastTheme = key;
  for (const store of [TOWERS, ENEMIES]) for (const id of Object.keys(store)) delete store[id];
  for (const [id, base] of Object.entries(TOWER_BASE)) TOWERS[id] = { ...base, ...def.towers[id] };
  for (const [id, base] of Object.entries(ENEMY_BASE)) ENEMIES[id] = { ...base, ...def.enemies[id] };
  BONUS_TYPES.splice(0, BONUS_TYPES.length, ...def.bonus);
  DECOR = def.decor.filter((emoji) => !def.bonus.some((bonus) => bonus.emoji === emoji) && !Object.values(TOWERS).some((tower) => tower.emoji === emoji));
  DECOR_LANDMARKS = def.landmarks;
  document.body.dataset.theme = key;
  document.querySelector("#brand-mark").textContent = def.icon;
  document.querySelector("#phase-eyebrow").textContent = def.name;
  document.querySelector("#game-layout").setAttribute("aria-label", `Fase ${def.name}`);
  document.querySelector("#sky").innerHTML = buildSky(def.sky);
  document.querySelector("#legend-tower").textContent = TOWERS.lantern.emoji;
  document.querySelector("#legend-enemy").textContent = ENEMIES.ghost.emoji;
  shopItemsElement.replaceChildren();
  shopButtons.length = 0;
  researchSignature = "";
  GameAudio.setTheme(key);
  saveProgress();
}

function selectTheme(key) {
  if (key === currentTheme) return;
  const inProgress = game.wave > 0 && game.phase !== "victory" && game.phase !== "defeat";
  if (inProgress && !window.confirm(`Trocar para o tema ${THEME_DEFS[key].name}? A partida atual será perdida.`)) return;
  if (game.interval) window.clearInterval(game.interval);
  applyTheme(key);
  resetGame(`Tema ${THEME_DEFS[key].name}: nova rota gerada! Posicione suas defesas e inicie o primeiro turno.`);
}

function renderThemes() {
  themeList.innerHTML = THEME_KEYS.map((key) => {
    const theme = THEME_DEFS[key];
    const active = key === currentTheme;
    const done = progress.completed[key];
    return `
      <button type="button" class="theme-card ${active ? "available" : ""} ${done ? "is-done" : ""}" data-theme-key="${key}" aria-pressed="${active}">
        <span class="theme-icon" aria-hidden="true">${theme.icon}</span>
        <span class="theme-copy"><strong>${theme.name}</strong><small>${theme.blurb}</small></span>
        <span class="theme-state">${active ? "Jogando" : done ? "Concluído ✓" : "Jogar"}</span>
      </button>
    `;
  }).join("");
  const completed = THEME_KEYS.filter((key) => progress.completed[key]).length;
  document.querySelector("#campaign-progress").textContent = `${completed} de ${THEME_KEYS.length} temas concluídos`;
}

function renderBoard() {
  const previousEnemies = new Map(
    [...board.querySelectorAll(".enemy-entity")].map((enemy) => [
      enemy.dataset.enemyId,
      { x: enemy.parentElement.offsetLeft, y: enemy.parentElement.offsetTop },
    ])
  );
  const enemyAt = new Map();
  for (const enemy of game.enemies) {
    const group = enemyAt.get(PATH[enemy.pathIndex]) || [];
    group.push(enemy);
    enemyAt.set(PATH[enemy.pathIndex], group);
  }
  const towerAt = new Map(game.towers.map((tower) => [tower.cell, tower]));
  const bonusAt = new Map(game.bonuses.map((bonus) => [bonus.cell, bonus]));

  board.innerHTML = Array.from({ length: COLUMNS * ROWS }, (_, cell) => {
    const tower = towerAt.get(cell);
    const enemies = enemyAt.get(cell) || [];
    const isPath = pathSet.has(cell);
    const isRock = rockSet.has(cell);
    const classes = ["tile"];
    if (isPath) classes.push("path");
    if (isRock) classes.push("rock-tile");
    if (tower && game.inspected === cell) classes.push("inspected");
    if (tower) classes.push("tower-tile");
    if (tower && tower.hitAt === game.tick && game.phase === "wave") classes.push("tower-hit");
    const bonus = bonusAt.get(cell);
    const decor = !tower && !enemies.length && !bonus ? decorFor(cell) : "";
    if (decor) classes.push("has-decor");
    if (enemies.length) classes.push("enemy-tile");
    if (game.selectedTower && !isPath && !isRock && !tower) classes.push("selected");
    const enemyMarkup = enemies.map((enemy, index) => `
      <span class="enemy-entity ${index > 0 ? "enemy-stacked" : ""} ${statusClasses(enemy)} ${enemy.type === "ogre" ? "is-boss" : ""}" data-enemy-id="${enemy.id}" aria-label="${ENEMIES[enemy.type].name}">
        <span class="tile-emoji">${enemy.emoji}</span>
        <span class="enemy-status">${statusIcons(enemy)}</span>
        <span class="enemy-health"><span style="width:${Math.max(0, enemy.hp / enemy.maxHp * 100)}%"></span></span>
      </span>
    `).join("");
    const icon = enemies.length
      ? enemyMarkup
      : tower
        ? `<span class="tower-entity tower-${tower.type} ${tower.hp < tower.maxHp * 0.4 ? "is-critical" : ""}" title="${tower.name} (nível ${tower.level}): ${tower.hp}/${tower.maxHp} de vida — clique para ver e reparar"><span class="tower-base"></span><span class="tile-emoji">${tower.emoji}</span><span class="tower-glint"></span><span class="tower-health"><span style="width:${Math.max(0, tower.hp / tower.maxHp * 100)}%"></span></span>${tower.level > 1 ? `<span class="tower-level" aria-hidden="true">${"★".repeat(tower.level - 1)}</span>` : ""}</span>`
        : isRock
          ? `<span class="rock-item" aria-hidden="true">🪨</span>`
          : isPath
          ? `<span class="tile-emoji path-marker" aria-hidden="true">${cell === PATH[0] ? "🚪" : cell === PATH.at(-1) ? "🕸️" : ""}</span>`
          : decor
            ? `<span class="decor decor-${decorKind(decor)}" aria-hidden="true">${decor}</span>`
            : bonus
              ? `<span class="bonus-item ${bonus.life <= 5 ? "is-expiring" : ""}" data-bonus-id="${bonus.id}" role="img" aria-label="${bonus.name}: clique para ganhar ${bonus.value} moedas">${bonus.emoji}<span class="bonus-ring"></span></span>`
              : "";
    const label = tower ? `${tower.name} nível ${tower.level}, casa ${cell + 1}, vida ${tower.hp} de ${tower.maxHp}` : isPath ? "Caminho" : isRock ? "Pedra: não é possível construir" : `Espaço livre ${cell + 1}`;
    return `<button class="${classes.join(" ")}" type="button" role="gridcell" data-cell="${cell}" aria-label="${label}">${icon}</button>`;
  }).join("");

  if (reduceMotion.matches) return;
  for (const enemy of board.querySelectorAll(".enemy-entity")) {
    const previous = previousEnemies.get(enemy.dataset.enemyId);
    if (!previous) {
      enemy.animate(
        [{ transform: "translateY(7px) scale(.45)", opacity: 0 }, { transform: "translateY(0) scale(1)", opacity: 1 }],
        { duration: 300, easing: "cubic-bezier(.2,.8,.2,1)" }
      );
      continue;
    }
    const deltaX = previous.x - enemy.parentElement.offsetLeft;
    const deltaY = previous.y - enemy.parentElement.offsetTop;
    if (Math.abs(deltaX) + Math.abs(deltaY) > 1) {
      enemy.animate(
        [
          { transform: `translate(${deltaX}px, ${deltaY}px) scale(1.1)` },
          { transform: "translate(0, 0) scale(1)" },
        ],
        { duration: 320, easing: "cubic-bezier(.2,.7,.25,1)" }
      );
    }
  }
}

function statusClasses(enemy) {
  return Object.keys(enemy.status).filter((key) => enemy.status[key].ticks > 0).map((key) => `st-${key}`).join(" ");
}

function statusIcons(enemy) {
  return Object.entries(enemy.status)
    .filter(([, state]) => state.ticks > 0)
    .map(([key]) => `<i title="${STATUS_INFO[key].label}">${STATUS_INFO[key].icon}</i>`)
    .join("");
}

function decorKind(emoji) {
  if (["🌲", "🌳"].includes(emoji)) return "tree";
  if (["🏚️", "⚰️", "🦉", "🏠", "⛪", "🛷", "🏡", "⛲", "🐓", "🏞️", "🦌"].includes(emoji)) return "landmark";
  if (["🕯️"].includes(emoji)) return "pumpkin";
  return "small";
}

function addCombatEffect(effect) {
  game.effects.push(effect);
  if (game.effects.length > 48) game.effects.shift();
}

function cellCenter(cell) {
  const tile = board.querySelector(`[data-cell="${cell}"]`);
  if (!tile) return null;
  return { x: tile.offsetLeft + tile.offsetWidth / 2, y: tile.offsetTop + tile.offsetHeight / 2 };
}

function animateEffect(element, keyframes, options) {
  const animation = element.animate(keyframes, options);
  animation.onfinish = () => element.remove();
}

function showImpact(cell, color, scale = 1.5) {
  const center = cellCenter(cell);
  if (!center) return;
  const impact = document.createElement("span");
  impact.className = "impact-flash";
  if (color) impact.style.setProperty("--glow", color);
  impact.style.left = `${center.x}px`;
  impact.style.top = `${center.y}px`;
  effectsLayer.append(impact);
  animateEffect(
    impact,
    [
      { transform: "translate(-50%, -50%) scale(.1)", opacity: 1 },
      { transform: `translate(-50%, -50%) scale(${scale})`, opacity: 0 },
    ],
    { duration: 280, easing: "ease-out" }
  );
}

function showDestruction(cell, emoji, big = false) {
  const center = cellCenter(cell);
  if (!center) return;
  const burst = document.createElement("span");
  burst.className = "destruction-burst";
  burst.style.left = `${center.x}px`;
  burst.style.top = `${center.y}px`;
  burst.textContent = emoji;
  effectsLayer.append(burst);
  animateEffect(
    burst,
    [
      { transform: "translate(-50%, -50%) scale(.35) rotate(-12deg)", opacity: 1, filter: "brightness(1.8)" },
      { transform: "translate(-50%, -65%) scale(1.5) rotate(12deg)", opacity: 0, filter: "brightness(1)" },
    ],
    { duration: 440, easing: "cubic-bezier(.15,.7,.3,1)" }
  );

  const colors = ["#ffb45c", "#ffe29a", "#d9a1ff", "#ff735e", "#fff1c2"];
  const particles = big ? 18 : 8;
  for (let index = 0; index < particles; index += 1) {
    const angle = (Math.PI * 2 * index) / particles + Math.random() * 0.3;
    const distance = (big ? 28 : 15) + Math.random() * (big ? 36 : 22);
    const particle = document.createElement("span");
    particle.className = "debris-particle";
    particle.style.left = `${center.x}px`;
    particle.style.top = `${center.y}px`;
    particle.style.backgroundColor = colors[index % colors.length];
    effectsLayer.append(particle);
    animateEffect(
      particle,
      [
        { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
        {
          transform: `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px)) scale(.15)`,
          opacity: 0,
        },
      ],
      { duration: 420 + Math.random() * 160, easing: "ease-out" }
    );
  }
}

function showFloatingText(cell, text, className) {
  const center = cellCenter(cell);
  if (!center) return;
  const label = document.createElement("span");
  label.className = `floating-text ${className}`;
  label.textContent = text;
  label.style.left = `${center.x}px`;
  label.style.top = `${center.y - 12}px`;
  effectsLayer.append(label);
  animateEffect(
    label,
    [
      { transform: "translate(-50%, 0) scale(.7)", opacity: 0 },
      { transform: "translate(-50%, -14px) scale(1.15)", opacity: 1, offset: 0.25 },
      { transform: "translate(-50%, -34px) scale(1)", opacity: 0 },
    ],
    { duration: 900, easing: "ease-out" }
  );
}

function flushCombatEffects() {
  const effects = game.effects.splice(0);
  if (reduceMotion.matches) return;
  for (const effect of effects) {
    if (effect.type === "destroyed") {
      showDestruction(effect.cell, effect.emoji);
      continue;
    }
    if (effect.type === "towerDestroyed") {
      showDestruction(effect.cell, effect.emoji, true);
      showImpact(effect.cell, "#ff5a3c", 2.6);
      showFloatingText(effect.cell, "Destruída!", "text-destroyed");
      continue;
    }
    if (effect.type === "note") {
      showFloatingText(effect.cell, effect.text, effect.className);
      continue;
    }
    if (effect.type === "towerHit") {
      window.setTimeout(() => {
        showImpact(effect.cell, "#ff5a5a", 1.7);
        showFloatingText(effect.cell, `-${effect.damage}`, "text-damage");
      }, 220);
      continue;
    }
    const start = cellCenter(effect.from);
    const end = cellCenter(effect.to);
    if (!start || !end) continue;
    const projectile = document.createElement("span");
    projectile.className = `projectile ${effect.enemyShot ? "enemy-shot" : ""}`;
    projectile.style.setProperty("--glow", effect.color);
    projectile.textContent = effect.glyph;
    projectile.style.left = `${start.x}px`;
    projectile.style.top = `${start.y}px`;
    effectsLayer.append(projectile);
    animateEffect(
      projectile,
      [
        { transform: "translate(-50%, -50%) scale(.5) rotate(0deg)", opacity: 0 },
        { transform: `translate(calc(-50% + ${(end.x - start.x) * 0.5}px), calc(-50% + ${(end.y - start.y) * 0.5 - 16}px)) scale(1.2) rotate(90deg)`, opacity: 1, offset: 0.55 },
        { transform: `translate(calc(-50% + ${end.x - start.x}px), calc(-50% + ${end.y - start.y}px)) scale(.75) rotate(180deg)`, opacity: 0.9 },
      ],
      { duration: 260, easing: "cubic-bezier(.2,.65,.3,1)" }
    );
    if (!effect.enemyShot) window.setTimeout(() => showImpact(effect.to, effect.color, effect.splash ? 2.4 : 1.5), 235);
  }
}

function enemyTooltip(id) {
  const enemy = ENEMIES[id];
  const weak = Object.entries(enemy.mods).filter(([, value]) => value > 1).map(([key]) => ELEMENT_LABELS[key]);
  const resist = Object.entries(enemy.mods).filter(([, value]) => value < 1).map(([key]) => ELEMENT_LABELS[key]);
  const immune = enemy.immune.map((key) => STATUS_INFO[key].label.toLowerCase());
  return [
    enemy.name,
    weak.length ? `fraco a ${weak.join(", ")}` : "",
    resist.length ? `resiste a ${resist.join(", ")}` : "",
    immune.length ? `imune a ${immune.join(", ")}` : "",
  ].filter(Boolean).join(" · ");
}

function renderWavePanel() {
  const upcoming = game.wave + 1;
  const inWave = game.phase === "wave";
  const finished = game.phase === "victory" || game.phase === "defeat";
  const showingCurrent = inWave || finished;
  const total = showingCurrent ? game.waveTotal : waveSize(upcoming);
  const remaining = showingCurrent ? game.pendingEnemies + game.enemies.length : total;
  const defeated = showingCurrent ? game.defeated : 0;
  const escaped = showingCurrent ? game.escaped : 0;
  const percent = showingCurrent && total ? Math.round(((defeated + escaped) / total) * 100) : 0;

  waveElements.phase.textContent = showingCurrent ? `Turno ${game.wave}` : `Prévia do turno ${upcoming}`;
  waveElements.totalLabel.textContent = showingCurrent ? "Total" : "Previstos";
  waveElements.total.textContent = total;
  waveElements.remaining.textContent = remaining;
  waveElements.defeated.textContent = defeated;
  waveElements.escaped.textContent = escaped;
  waveElements.percent.textContent = `${percent}%`;
  waveElements.fill.style.width = `${percent}%`;
  waveElements.progress.setAttribute("aria-valuenow", String(percent));

  const counts = new Map();
  for (const id of waveComposition(showingCurrent ? game.wave : upcoming)) counts.set(id, (counts.get(id) || 0) + 1);
  waveElements.roster.innerHTML = [...counts]
    .map(([id, count]) => `<span class="roster-chip" title="${enemyTooltip(id)} — quantidade: ${count}">${ENEMIES[id].emoji}<b>×${count}</b></span>`)
    .join("");

  if (inWave && game.wave < TOTAL_WAVES) {
    waveElements.note.textContent = `Depois deste turno: ${waveSize(upcoming)} invasores no turno ${upcoming}.`;
  } else if (game.phase === "intermission") {
    const lost = game.towersLost ? ` ${game.towersLost} defesa(s) destruída(s) no total.` : "";
    waveElements.note.textContent = `Turno ${game.wave} concluído: ${game.defeated} derrotados e ${game.escaped} escaparam.${lost}`;
  } else if (finished) {
    waveElements.note.textContent = game.phase === "victory"
      ? "Todos os turnos foram concluídos."
      : `A defesa caiu no turno ${game.wave}.`;
  } else {
    waveElements.note.textContent = "Prepare a defesa antes do primeiro turno.";
  }
}

function upcomingWave() {
  return game.phase === "wave" ? game.wave : game.wave + 1;
}

function unlockedCount() {
  return Math.min(UNLOCK_ORDER.length, START_TOWERS + upcomingWave() - 1);
}

function isUnlocked(type) {
  return UNLOCK_ORDER.indexOf(type) < unlockedCount();
}

function unlockWave(type) {
  return UNLOCK_ORDER.indexOf(type) - START_TOWERS + 2;
}

function levelStats(base, level) {
  const steps = level - 1;
  const stats = {
    damage: Math.round(base.damage * (1 + RESEARCH_BONUS.damage * steps)),
    hp: Math.round(base.hp * (1 + RESEARCH_BONUS.hp * steps)),
    range: base.range ? Number((base.range + RESEARCH_BONUS.range * steps).toFixed(2)) : 0,
  };
  if (base.heal) stats.heal = { ...base.heal, amount: Math.round(base.heal.amount * (1 + RESEARCH_BONUS.heal * steps)) };
  return stats;
}

function researchCost(type, level) {
  return Math.round((TOWERS[type].price * (level - 1) * 1.5) / 5) * 5;
}

function researchSummary(type) {
  const tower = TOWERS[type];
  const parts = [`+${RESEARCH_BONUS.hp * 100}% vida`];
  if (tower.damage) parts.unshift(`+${RESEARCH_BONUS.damage * 100}% dano`);
  if (tower.heal) parts.unshift(`+${RESEARCH_BONUS.heal * 100}% cura`);
  if (tower.range) parts.push(`+${RESEARCH_BONUS.range} alcance`);
  return parts.join(", ");
}

function renderShop() {
  if (!shopItemsElement.childElementCount) {
    shopItemsElement.innerHTML = UNLOCK_ORDER.map((type) => {
      const tower = TOWERS[type];
      return `
        <button class="shop-item" type="button" data-tower="${type}">
          <span class="shop-emoji">${tower.emoji}</span>
          <span class="shop-copy"><strong>${tower.name}</strong><small class="shop-stats">❤ ${tower.hp}${tower.damage ? ` · ⚔ ${tower.damage}` : ""}</small></span>
          <span class="shop-price">${tower.price} 🪙</span>
        </button>
      `;
    }).join("");
    shopButtons.push(...shopItemsElement.querySelectorAll(".shop-item"));
    for (const button of shopButtons) {
      button.addEventListener("click", () => selectTower(button.dataset.tower));
    }
  }
  for (const button of shopButtons) {
    const type = button.dataset.tower;
    const tower = TOWERS[type];
    const locked = !isUnlocked(type);
    button.classList.toggle("is-locked", locked);
    button.querySelector(".shop-price").textContent = locked ? `🔒 Turno ${unlockWave(type)}` : `${tower.price} 🪙`;
    button.title = locked
      ? `${tower.name}: liberada no turno ${unlockWave(type)}`
      : `${tower.name} (${tower.element ? ELEMENT_LABELS[tower.element] : "apoio"}): ${tower.blurb}`;
  }
}

function renderResearch() {
  const unlocked = UNLOCK_ORDER.filter(isUnlocked);
  const canResearch = game.phase !== "victory" && game.phase !== "defeat";
  const signature = JSON.stringify([unlocked.length, canResearch, game.research, game.pendingResearch, unlocked.map((type) => game.coins >= researchCost(type, (game.research[type] || 1) + 1)), upcomingWave()]);
  if (signature === researchSignature) return;
  researchSignature = signature;
  researchListElement.innerHTML = unlocked.map((type) => {
    const tower = TOWERS[type];
    const level = game.research[type] || 1;
    const pending = game.pendingResearch[type];
    let action;
    if (pending) {
      action = `<span class="research-state">⏳ Nível ${pending} no turno ${upcomingWave() + (game.phase === "wave" ? 1 : 0)}</span>`;
    } else if (level >= RESEARCH_MAX_LEVEL) {
      action = `<span class="research-state is-max">★ Nível máximo</span>`;
    } else {
      const cost = researchCost(type, level + 1);
      action = `<button class="research-button" type="button" data-research="${type}" ${!canResearch || game.coins < cost ? "disabled" : ""} title="Nível ${level + 1}: ${researchSummary(type)}">🔬 Nível ${level + 1} · ${cost} 🪙</button>`;
    }
    return `<div class="research-row"><span class="research-emoji">${tower.emoji}</span><span class="research-name"><strong>${tower.name}</strong><small>Nível ${level}/${RESEARCH_MAX_LEVEL}</small></span>${action}</div>`;
  }).join("");
}

function researchTower(type) {
  if (game.phase === "victory" || game.phase === "defeat" || !isUnlocked(type) || game.pendingResearch[type]) return;
  const level = (game.research[type] || 1) + 1;
  if (level > RESEARCH_MAX_LEVEL) return;
  const cost = researchCost(type, level);
  if (game.coins < cost) {
    GameAudio.play("error");
    setMessage(`Você precisa de ${cost} moedas para pesquisar ${TOWERS[type].name} nível ${level}.`);
    return;
  }
  game.coins -= cost;
  game.pendingResearch[type] = level;
  GameAudio.play("place");
  game.message = `Pesquisa de ${TOWERS[type].name} nível ${level} iniciada: a evolução fica disponível no próximo turno.`;
  render();
}

function applyResearch() {
  const done = [];
  for (const [type, level] of Object.entries(game.pendingResearch)) {
    game.research[type] = level;
    done.push(`${TOWERS[type].name} nível ${level}`);
    for (const tower of game.towers.filter((item) => item.type === type)) {
      const stats = levelStats(TOWERS[type], level);
      tower.hp += stats.hp - tower.maxHp;
      Object.assign(tower, stats, { maxHp: stats.hp, level });
    }
  }
  game.pendingResearch = {};
  return done;
}

function inspectedTower() {
  return game.towers.find((tower) => tower.cell === game.inspected) || null;
}

function towerRepairCost(tower) {
  return Math.ceil((tower.maxHp - tower.hp) * REPAIR_COST_PER_HP);
}

function renderInspector() {
  const tower = inspectedTower();
  inspectorElement.hidden = !tower;
  if (!tower) return;
  const cost = towerRepairCost(tower);
  const blocked = game.phase === "wave" || game.phase === "victory" || game.phase === "defeat";
  inspectorElement.querySelector("#inspector-info").textContent =
    `${tower.emoji} ${tower.name} · nível ${tower.level} · ❤ ${tower.hp}/${tower.maxHp}${tower.damage ? ` · ⚔ ${tower.damage}` : ""}${tower.range ? ` · alcance ${tower.range}` : ""}`;
  const button = inspectorElement.querySelector("#inspector-repair");
  button.disabled = cost === 0 || blocked;
  button.textContent = cost ? `🔧 Reparar (${cost} 🪙)` : "🔧 Em perfeito estado";
  button.title = blocked && cost ? "O reparo só é possível entre os turnos." : "";
}

function repairTower(tower) {
  if (game.phase === "wave" || game.phase === "victory" || game.phase === "defeat") return;
  const missing = tower.maxHp - tower.hp;
  if (!missing) {
    GameAudio.play("error");
    setMessage(`${tower.name} já está em perfeito estado.`);
    return;
  }
  const points = Math.min(missing, Math.floor(game.coins / REPAIR_COST_PER_HP));
  if (points <= 0) {
    GameAudio.play("error");
    setMessage("Sem moedas para reparar.");
    return;
  }
  tower.hp += points;
  game.coins -= Math.ceil(points * REPAIR_COST_PER_HP);
  GameAudio.play("repair");
  game.message = points < missing ? `${tower.name}: reparo parcial, faltaram moedas.` : `${tower.name} reparada!`;
  render();
}

function repairCost() {
  return Math.ceil(game.towers.reduce((sum, tower) => sum + (tower.maxHp - tower.hp), 0) * REPAIR_COST_PER_HP);
}

function repairTowers() {
  if (game.phase === "wave" || game.phase === "victory" || game.phase === "defeat") return;
  const damaged = game.towers.filter((tower) => tower.hp < tower.maxHp).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp);
  if (!damaged.length || game.coins <= 0) {
    GameAudio.play("error");
    setMessage(damaged.length ? "Sem moedas para reparar." : "Nenhuma defesa precisa de reparo.");
    return;
  }
  let budget = Math.floor(game.coins / REPAIR_COST_PER_HP);
  let spent = 0;
  for (const tower of damaged) {
    const points = Math.min(tower.maxHp - tower.hp, budget);
    tower.hp += points;
    budget -= points;
    spent += points * REPAIR_COST_PER_HP;
    if (budget <= 0) break;
  }
  game.coins -= Math.ceil(spent);
  GameAudio.play("repair");
  game.message = repairCost() ? "Reparo parcial: faltaram moedas para recuperar tudo." : "Defesas reparadas!";
  render();
}

function render() {
  renderThemes();
  renderShop();
  renderBoard();
  renderInspector();
  renderResearch();
  flushCombatEffects();
  renderWavePanel();
  coinsElement.textContent = game.coins;
  livesElement.textContent = game.lives;
  towerCountElement.textContent = game.towers.length;
  waveCounter.innerHTML = `Turno ${game.wave} <span>/ ${TOTAL_WAVES}</span>`;
  messageElement.textContent = game.message;

  const musicOn = GameAudio.isMusicEnabled();
  musicButton.setAttribute("aria-pressed", String(musicOn));
  musicButton.classList.toggle("is-playing", musicOn);
  musicLabel.textContent = musicOn ? "Desativar música" : "Ativar música";
  const sfxOn = GameAudio.isSfxEnabled();
  sfxButton.setAttribute("aria-pressed", String(sfxOn));
  sfxButton.classList.toggle("is-playing", sfxOn);
  sfxLabel.textContent = sfxOn ? "Efeitos: ligados" : "Efeitos: desligados";

  const canShop = game.phase !== "victory" && game.phase !== "defeat";
  for (const button of shopButtons) {
    const tower = TOWERS[button.dataset.tower];
    button.disabled = !canShop || !isUnlocked(button.dataset.tower) || game.coins < tower.price;
    button.classList.toggle("selected", game.selectedTower === button.dataset.tower);
  }
  cancelButton.hidden = !game.selectedTower;
  shopHint.textContent = game.selectedTower
      ? "Agora escolha um espaço livre no mapa para posicionar."
      : "Escolha uma defesa e depois um espaço livre no mapa.";

  if (game.phase === "preparation" || game.phase === "intermission") {
    turnButton.hidden = false;
    turnButton.disabled = false;
    turnButton.textContent = `Iniciar turno ${game.wave + 1}`;
  } else if (game.phase === "wave") {
    turnButton.hidden = false;
    turnButton.disabled = true;
    turnButton.textContent = `Turno ${game.wave} em andamento...`;
  } else {
    turnButton.hidden = true;
  }
  pauseButton.hidden = game.phase !== "wave";
  pauseButton.textContent = game.paused ? "▶ Continuar" : "⏸ Pausar jogo";
  pauseOverlay.hidden = !(game.paused && game.phase === "wave");
  restartButton.classList.toggle("is-alert", game.phase === "defeat");
  const cost = repairCost();
  repairButton.hidden = !game.towers.length;
  repairButton.disabled = cost === 0 || game.phase === "wave" || game.phase === "victory" || game.phase === "defeat";
  repairButton.textContent = cost ? `🔧 Reparar defesas (${cost} 🪙)` : "🔧 Defesas em perfeito estado";
}

function selectTower(type) {
  if (game.phase === "victory" || game.phase === "defeat") return;
  const tower = TOWERS[type];
  if (!isUnlocked(type)) {
    GameAudio.play("error");
    setMessage(`${tower.name} será liberada no turno ${unlockWave(type)}.`);
    return;
  }
  if (game.coins < tower.price) {
    GameAudio.play("error");
    setMessage(`Você precisa de ${tower.price} moedas para comprar ${tower.name}.`);
    return;
  }
  GameAudio.play("select");
  game.inspected = null;
  game.selectedTower = game.selectedTower === type ? null : type;
  game.message = game.selectedTower
    ? `Escolha um espaço livre para posicionar ${tower.name}.`
    : "Posicionamento cancelado.";
  render();
}

function placeTower(cell) {
  if (game.phase === "victory" || game.phase === "defeat") return;
  const existing = game.towers.find((tower) => tower.cell === cell);
  if (!game.selectedTower) {
    if (existing) {
      game.inspected = game.inspected === cell ? null : cell;
      GameAudio.play("select");
      render();
    }
    return;
  }
  if (rockSet.has(cell)) {
    GameAudio.play("error");
    setMessage("Há uma pedra neste espaço: não é possível construir aqui.");
    return;
  }
  if (pathSet.has(cell)) {
    GameAudio.play("error");
    setMessage("As defesas só podem ser posicionadas fora do caminho.");
    return;
  }
  if (game.towers.some((tower) => tower.cell === cell)) {
    GameAudio.play("error");
    setMessage("Esse espaço já tem uma defesa.");
    return;
  }
  const type = game.selectedTower;
  const config = TOWERS[type];
  if (game.coins < config.price) {
    game.selectedTower = null;
    GameAudio.play("error");
    setMessage("Moedas insuficientes para essa defesa.");
    return;
  }
  game.coins -= config.price;
  if (game.lostPending > 0) game.lostPending -= 1;
  const level = game.research[type] || 1;
  const stats = levelStats(config, level);
  game.towers.push({ ...config, ...stats, type, level, cell, cooldown: 0, maxHp: stats.hp, hp: stats.hp });
  game.selectedTower = null;
  game.message = game.phase === "wave"
    ? `${config.name} entrou em campo em pleno turno!`
    : `${config.name} posicionada. Prepare-se para o próximo turno!`;
  GameAudio.play("place");
  render();
}

function beginWave() {
  if (game.phase !== "preparation" && game.phase !== "intermission") return;
  game.wave += 1;
  game.phase = "wave";
  game.waveTotal = waveSize(game.wave);
  game.queue = waveComposition(game.wave);
  game.pendingEnemies = game.waveTotal;
  game.defeated = 0;
  game.escaped = 0;
  game.tick = 0;
  game.towersLost = 0;
  game.bonuses = [];
  game.bonusCollected = 0;
  game.bonusCoins = 0;
  game.enemies = [];
  const evolved = applyResearch();
  game.message = `Turno ${game.wave}: ${game.waveTotal} invasores estão chegando!${evolved.length ? ` Evoluções prontas: ${evolved.join(", ")}.` : ""}`;
  GameAudio.setIntensity(1);
  GameAudio.play("waveStart");
  render();
  game.interval = window.setInterval(advanceWave, TICK_MS);
}

function spawnEnemy() {
  const type = game.queue.shift();
  const config = ENEMIES[type];
  if (Math.random() < VOICE_CHANCE.spawn) GameAudio.play("enemySpawn", type);
  const maxHp = Math.round((30 + levelOf(game.wave) * 8) * config.hp);
  game.enemies.push({
    id: String(++nextEnemyId),
    type,
    emoji: config.emoji,
    pathIndex: 0,
    hp: maxHp,
    maxHp,
    moveCd: config.speed,
    attackCd: 2,
    status: {},
  });
}

function distanceBetweenCells(first, second) {
  const firstX = first % COLUMNS;
  const firstY = Math.floor(first / COLUMNS);
  const secondX = second % COLUMNS;
  const secondY = Math.floor(second / COLUMNS);
  return Math.hypot(firstX - secondX, firstY - secondY);
}

function isActive(enemy, status) {
  return (enemy.status[status]?.ticks ?? 0) > 0;
}

function canMove(enemy) {
  return !isActive(enemy, "freeze") && !isActive(enemy, "stun");
}

function canAttack(enemy) {
  return canMove(enemy) && !isActive(enemy, "disarm");
}

function applyStatus(enemy, effect) {
  const config = ENEMIES[enemy.type];
  const cell = PATH[enemy.pathIndex];
  if (effect.chance && Math.random() > effect.chance) return;
  if (config.immune.includes(effect.status)) {
    addCombatEffect({ type: "note", cell, text: "Imune!", className: "text-note" });
    return;
  }
  const ticks = config.boss ? Math.max(1, Math.ceil(effect.ticks / 2)) : effect.ticks;
  const current = enemy.status[effect.status];
  enemy.status[effect.status] = { ticks: Math.max(ticks, current?.ticks ?? 0), power: effect.power ?? 0 };
  addCombatEffect({ type: "note", cell, text: `${STATUS_INFO[effect.status].icon} ${STATUS_INFO[effect.status].label}`, className: `text-status-${effect.status}` });
  GameAudio.play("status", effect.status, 0.2);
}

function hitEnemy(enemy, tower, factor, primary) {
  const config = ENEMIES[enemy.type];
  const modifier = config.mods[tower.element] ?? 1;
  let damage = tower.damage * factor * modifier;
  const critical = primary && tower.crit && Math.random() < tower.crit;
  if (critical) damage *= 2;
  enemy.hp -= Math.round(damage);
  const cell = PATH[enemy.pathIndex];
  if (critical) addCombatEffect({ type: "note", cell, text: "Crítico!", className: "text-crit" });
  else if (primary && modifier > 1) addCombatEffect({ type: "note", cell, text: "Fraco!", className: "text-weak" });
  else if (primary && modifier < 1) addCombatEffect({ type: "note", cell, text: "Resiste", className: "text-note" });
  for (const effect of tower.effects) applyStatus(enemy, effect);
}

function tickStatuses() {
  for (const enemy of game.enemies) {
    for (const [key, state] of Object.entries(enemy.status)) {
      if (state.ticks <= 0) continue;
      if ((key === "burn" || key === "poison") && state.power) enemy.hp -= state.power;
      state.ticks -= 1;
    }
  }
}

function spawnBonus() {
  if (game.bonuses.length >= BONUS_MAX_ON_BOARD || Math.random() > BONUS_SPAWN_CHANCE) return;
  const taken = new Set([...game.towers.map((tower) => tower.cell), ...game.bonuses.map((bonus) => bonus.cell)]);
  const free = [];
  for (let cell = 0; cell < COLUMNS * ROWS; cell += 1) {
    if (!pathSet.has(cell) && !rockSet.has(cell) && !taken.has(cell) && !decorFor(cell)) free.push(cell);
  }
  if (!free.length) return;
  const roll = Math.random() * BONUS_TYPES.reduce((sum, type) => sum + type.weight, 0);
  let acc = 0;
  const type = BONUS_TYPES.find((candidate) => (acc += candidate.weight) >= roll) || BONUS_TYPES[0];
  game.bonuses.push({
    id: String(++nextBonusId),
    cell: free[Math.floor(Math.random() * free.length)],
    emoji: type.emoji,
    name: type.name,
    value: Math.round(type.value * (1 + levelOf(game.wave) * 0.04)),
    life: BONUS_LIFETIME,
  });
  GameAudio.play("bonusAppear");
}

function collectBonus(bonusId) {
  const index = game.bonuses.findIndex((bonus) => bonus.id === bonusId);
  if (index < 0) return false;
  const [bonus] = game.bonuses.splice(index, 1);
  game.coins += bonus.value;
  game.bonusCoins += bonus.value;
  game.bonusCollected += 1;
  addCombatEffect({ type: "note", cell: bonus.cell, text: `+${bonus.value} 🪙`, className: "text-bonus" });
  GameAudio.play("bonus");
  render();
  return true;
}

function advanceWave() {
  if (game.paused) return;
  if (game.phase !== "wave") {
    window.clearInterval(game.interval);
    return;
  }
  try {
    stepWave();
  } catch (error) {
    console.error("Erro no turno:", error);
    game.enemies = game.enemies.filter((enemy) => Number.isFinite(enemy.hp) && ENEMIES[enemy.type]);
    game.queue = game.queue.filter((type) => ENEMIES[type]);
    game.pendingEnemies = Math.min(game.pendingEnemies, game.queue.length);
  }
  checkWaveEnd();
}

function checkWaveEnd() {
  if (game.phase !== "wave") return;
  if (game.lives <= 0) {
    finishWave(false);
  } else if (game.pendingEnemies <= 0 && game.enemies.length === 0) {
    finishWave(true);
  } else {
    try {
      render();
    } catch (error) {
      console.error("Erro ao desenhar:", error);
    }
  }
}

function stepWave() {
  game.tick += 1;
  if (game.pendingEnemies > 0 && game.tick % 2 === 0) {
    spawnEnemy();
    game.pendingEnemies -= 1;
  }

  spawnBonus();
  for (const bonus of game.bonuses) bonus.life -= 1;
  game.bonuses = game.bonuses.filter((bonus) => bonus.life > 0);

  tickStatuses();
  for (const enemy of game.enemies) {
    if (!canMove(enemy)) continue;
    if (isActive(enemy, "slow") && game.tick % 2 === 0) continue;
    enemy.moveCd -= 1;
    if (enemy.moveCd <= 0) {
      enemy.pathIndex += 1;
      enemy.moveCd = ENEMIES[enemy.type].speed;
    }
  }

  const escaped = game.enemies.filter((enemy) => enemy.pathIndex >= PATH.length).length;
  if (escaped) {
    game.lives -= escaped;
    game.escaped += escaped;
    GameAudio.play("escaped");
  }
  game.enemies = game.enemies.filter((enemy) => enemy.pathIndex < PATH.length);

  enemiesAttackTowers();
  towersSupport();
  towersAttackEnemies();

  const survivors = [];
  for (const enemy of game.enemies) {
    if (enemy.hp <= 0) {
      game.coins += Math.round((17 + levelOf(game.wave) * 0.6) * ENEMIES[enemy.type].reward);
      game.defeated += 1;
      addCombatEffect({ type: "destroyed", cell: PATH[enemy.pathIndex], emoji: enemy.emoji });
      GameAudio.play("destroyed", null, 0.24);
      if (Math.random() < VOICE_CHANCE.death) GameAudio.play("enemyDeath", enemy.type, 0.3);
    } else {
      survivors.push(enemy);
    }
  }
  game.enemies = survivors;
}

function enemiesAttackTowers() {
  for (const enemy of game.enemies) {
    const config = ENEMIES[enemy.type];
    if (!canAttack(enemy)) continue;
    if (enemy.attackCd > 0) {
      enemy.attackCd -= 1;
      continue;
    }
    const enemyCell = PATH[enemy.pathIndex];
    let target;
    let best = Infinity;
    for (const tower of game.towers) {
      const distance = distanceBetweenCells(enemyCell, tower.cell);
      const score = distance - (tower.bait ? 1.2 : 0);
      if (distance <= config.attack.range && score < best) {
        best = score;
        target = tower;
      }
    }
    if (!target) continue;
    const damage = Math.round(config.attack.damage * (1 + levelOf(game.wave) * 0.03));
    target.hp -= damage;
    target.hitAt = game.tick;
    enemy.attackCd = config.attack.cooldown;
    addCombatEffect({ type: "shot", enemyShot: true, from: enemyCell, to: target.cell, glyph: config.glyph, color: config.color });
    addCombatEffect({ type: "towerHit", cell: target.cell, damage });
    GameAudio.play("enemyShot");
    GameAudio.play("towerHit", null, 0.22);
    if (target.hp <= 0) {
      game.towers = game.towers.filter((tower) => tower !== target);
      if (game.inspected === target.cell) game.inspected = null;
      game.towersLost += 1;
      game.lostPending += 1;
      game.message = `💥 ${target.name} foi destruída por ${config.name}! Você pode comprá-la de novo entre os turnos.`;
      addCombatEffect({ type: "towerDestroyed", cell: target.cell, emoji: target.emoji });
      GameAudio.play("towerDestroyed", null, 0.25);
    }
  }
}

function towersSupport() {
  for (const tower of game.towers) {
    if (!tower.heal) continue;
    if (tower.cooldown > 0) {
      tower.cooldown -= 1;
      continue;
    }
    const wounded = game.towers.filter((other) =>
      other !== tower && other.hp < other.maxHp && distanceBetweenCells(tower.cell, other.cell) <= tower.heal.range
    );
    if (!wounded.length) continue;
    for (const other of wounded) {
      const amount = Math.min(tower.heal.amount, other.maxHp - other.hp);
      other.hp += amount;
      addCombatEffect({ type: "note", cell: other.cell, text: `+${amount} ❤`, className: "text-heal" });
    }
    addCombatEffect({ type: "shot", from: tower.cell, to: wounded[0].cell, glyph: "✚", color: tower.color });
    GameAudio.play("repair", null, 0.1);
    tower.cooldown = tower.reload;
  }
}

function towersAttackEnemies() {
  for (const tower of game.towers) {
    if (!tower.damage) continue;
    if (tower.cooldown > 0) {
      tower.cooldown -= 1;
      continue;
    }
    let target;
    for (const enemy of game.enemies) {
      if (enemy.hp <= 0) continue;
      if (distanceBetweenCells(tower.cell, PATH[enemy.pathIndex]) > tower.range) continue;
      if (!target || enemy.pathIndex > target.pathIndex) target = enemy;
    }
    if (!target) continue;
    addCombatEffect({
      type: "shot",
      from: tower.cell,
      to: PATH[target.pathIndex],
      glyph: tower.glyph,
      color: tower.color,
      splash: Boolean(tower.splash),
    });
    GameAudio.play("shot", tower.type);
    GameAudio.play("impact", null, 0.22);
    hitEnemy(target, tower, 1, true);
    if (tower.splash) {
      for (const enemy of game.enemies) {
        if (enemy !== target && enemy.hp > 0 && distanceBetweenCells(PATH[enemy.pathIndex], PATH[target.pathIndex]) <= tower.splash) {
          hitEnemy(enemy, tower, 0.6, false);
        }
      }
    }
    tower.cooldown = tower.reload;
  }
}

function showWaveBanner(title, detail, className = "") {
  const banner = document.createElement("div");
  banner.className = `wave-banner ${className}`;
  banner.setAttribute("aria-hidden", "true");
  banner.innerHTML = `<strong>${title}</strong><span>${detail}</span>`;
  boardFrame.append(banner);
  const colors = ["#ffe27a", "#ffb447", "#c58cff", "#7dff9c", "#ff6b8a"];
  const rect = { w: boardFrame.clientWidth, h: boardFrame.clientHeight };
  const sparks = reduceMotion.matches ? 0 : 26;
  for (let index = 0; index < sparks; index += 1) {
    const spark = document.createElement("span");
    spark.className = "banner-spark";
    spark.style.left = `${rect.w / 2}px`;
    spark.style.top = `${rect.h / 2}px`;
    spark.style.background = colors[index % colors.length];
    boardFrame.append(spark);
    const angle = Math.random() * Math.PI * 2;
    const distance = 90 + Math.random() * 190;
    const animation = spark.animate(
      [
        { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance + 50}px)) scale(.2) rotate(240deg)`, opacity: 0 },
      ],
      { duration: 1000 + Math.random() * 700, easing: "cubic-bezier(.1,.7,.3,1)" }
    );
    animation.onfinish = () => spark.remove();
  }
  window.setTimeout(() => banner.remove(), reduceMotion.matches ? 1800 : 2400);
}

function finishWave(won) {
  window.clearInterval(game.interval);
  try {
    concludeWave(won);
  } catch (error) {
    console.error("Erro ao concluir turno:", error);
  }
  render();
}

function concludeWave(won) {
  game.bonuses = [];
  game.phase = won ? (game.wave === TOTAL_WAVES ? "victory" : "intermission") : "defeat";
  GameAudio.setIntensity(0);

  if (!won) {
    game.message = "Suas vidas acabaram. Recomece a fase e tente outra estratégia.";
    GameAudio.play("defeat");
    showDefeat();
  } else if (game.phase === "victory") {
    const name = THEME_DEFS[currentTheme].name;
    game.message = `Fase ${name} concluída! Escolha outro tema quando quiser.`;
    GameAudio.play("victory");
    showWaveBanner("Fase concluída!", `${name} · escolha outro tema`, "is-victory");
    showCongrats(name);
    progress.completed[currentTheme] = true;
    if (!saveProgress()) game.message += " (Não foi possível salvar o progresso neste navegador.)";
  } else {
    const bonusText = game.bonusCollected ? ` Bônus coletados: ${game.bonusCollected} (+${game.bonusCoins} 🪙).` : "";
    const lost = (game.towersLost ? ` ${game.towersLost} defesa(s) caiu(caíram) — recompre ou repare.` : "") + bonusText;
    const unlockedType = UNLOCK_ORDER[START_TOWERS + game.wave - 1];
    const unlockText = unlockedType ? ` 🔓 Nova defesa liberada: ${TOWERS[unlockedType].emoji} ${TOWERS[unlockedType].name}!` : "";
    showWaveBanner(`Turno ${game.wave} concluído!`, `${game.defeated} derrotados · próximo: ${waveSize(game.wave + 1)} invasores${unlockedType ? ` · 🔓 Nova defesa: ${TOWERS[unlockedType].emoji} ${TOWERS[unlockedType].name}` : ""}`);
    game.message = `Turno ${game.wave} concluído! O turno ${game.wave + 1} terá ${waveSize(game.wave + 1)} invasores.${unlockText}${lost} Reforce a defesa.`;
    GameAudio.play("waveClear");
  }
}

function setPaused(paused) {
  if (game.phase !== "wave" && paused) return;
  game.paused = paused;
  if (paused) {
    window.clearInterval(game.interval);
  } else if (game.phase === "wave") {
    window.clearInterval(game.interval);
    game.interval = window.setInterval(advanceWave, TICK_MS);
  }
  GameAudio.setPaused(paused);
  if (!paused) GameAudio.play("select");
  render();
}

function showDefeat() {
  document.querySelector("#defeat-text").textContent =
    `Os invasores romperam a defesa no turno ${game.wave} de ${TOTAL_WAVES}: ${game.defeated} derrotados neste turno e ${game.towersLost} defesa(s) destruída(s). Reorganize a estratégia e tente de novo!`;
  defeatOverlay.hidden = false;
}

function showCongrats(themeName) {
  const overlay = document.querySelector("#congrats");
  const next = THEME_KEYS.filter((key) => !progress.completed[key] && key !== currentTheme);
  document.querySelector("#congrats-title").textContent = `Parabéns! Tema ${themeName} concluído!`;
  document.querySelector("#congrats-text").textContent =
    `Você defendeu todos os ${TOTAL_WAVES} turnos com ${game.lives} vida(s) restante(s), ${game.towers.length} defesa(s) de pé e ${game.coins} moedas.` +
    (next.length ? ` Ainda faltam: ${next.map((key) => THEME_DEFS[key].name).join(" e ")}.` : " Você concluiu todos os temas da campanha — lenda das datas comemorativas! 🏆");
  const confetti = document.querySelector("#confetti");
  const colors = ["#ffd34d", "#ff7ab8", "#7dd8ff", "#9dff9c", "#ffa24d", "#c79bff"];
  confetti.innerHTML = Array.from({ length: 60 }, (_, index) => {
    const duration = 3 + (index * 7) % 4;
    return `<i style="left:${(index * 53) % 100}%;background:${colors[index % colors.length]};animation-duration:${duration}s;animation-delay:-${(index * 3) % duration}s"></i>`;
  }).join("");
  overlay.hidden = false;
  GameAudio.play("victory");
}

function resetGame(message) {
  if (game && game.interval) window.clearInterval(game.interval);
  GameAudio.setIntensity(0);
  nextEnemyId = 0;
  nextBonusId = 0;
  effectsLayer.replaceChildren();
  document.querySelector("#congrats").hidden = true;
  defeatOverlay.hidden = true;
  pauseOverlay.hidden = true;
  GameAudio.setPaused(false);
  generatePath();
  game = createGame();
  game.message = message;
  render();
}

function restartGame() {
  const inProgress = game.wave > 0 && game.phase !== "victory" && game.phase !== "defeat";
  if (inProgress && !window.confirm("Reiniciar o jogo e voltar ao começo? A partida atual será perdida (os temas concluídos são mantidos).")) return;
  resetGame("Nova rota gerada! Posicione suas defesas e inicie o primeiro turno.");
}

function requestWave() {
  const damaged = game.towers.filter((tower) => tower.hp < tower.maxHp).length;
  if (game.wave > 0 && (damaged || game.lostPending)) {
    const problems = [];
    if (damaged) problems.push(`${damaged} defesa(s) danificada(s) (reparo: ${repairCost()} 🪙)`);
    if (game.lostPending) problems.push(`${game.lostPending} defesa(s) destruída(s) sem recompra`);
    if (!window.confirm(`Suas defesas não foram recuperadas: ${problems.join(" e ")}.\n\nIniciar o turno mesmo assim?`)) {
      GameAudio.play("error");
      setMessage("Turno adiado. Repare ou recompre suas defesas antes de iniciar.");
      return;
    }
  }
  beginWave();
}

for (let cell = 0; cell < COLUMNS * ROWS; cell += 1) {
  const tile = document.createElement("button");
  tile.className = "tile";
  tile.type = "button";
  tile.setAttribute("role", "gridcell");
  tile.dataset.cell = String(cell);
  board.append(tile);
}

document.addEventListener("pointerdown", () => GameAudio.unlock(), { passive: true });

board.addEventListener("pointerdown", (event) => {
  const bonus = event.target.closest("[data-bonus-id]");
  if (bonus && collectBonus(bonus.dataset.bonusId)) event.preventDefault();
});

board.addEventListener("click", (event) => {
  const tile = event.target.closest("[data-cell]");
  if (!tile) return;
  const cell = Number(tile.dataset.cell);
  const bonus = game.bonuses.find((item) => item.cell === cell);
  if (bonus) collectBonus(bonus.id);
  else placeTower(cell);
});

repairButton.addEventListener("click", repairTowers);
document.querySelector("#inspector-repair").addEventListener("click", () => {
  const tower = inspectedTower();
  if (tower) repairTower(tower);
});
document.querySelector("#inspector-close").addEventListener("click", () => {
  game.inspected = null;
  render();
});
researchListElement.addEventListener("click", (event) => {
  const button = event.target.closest("[data-research]");
  if (button) researchTower(button.dataset.research);
});
document.querySelector("#congrats-close").addEventListener("click", () => { document.querySelector("#congrats").hidden = true; });
turnButton.addEventListener("click", requestWave);
pauseButton.addEventListener("click", () => setPaused(!game.paused));
document.querySelector("#resume-button").addEventListener("click", () => setPaused(false));
document.querySelector("#defeat-restart").addEventListener("click", () => resetGame("Nova rota gerada! Posicione suas defesas e inicie o primeiro turno."));
function cancelSelection() {
  if (!game.selectedTower) return;
  game.selectedTower = null;
  GameAudio.play("select");
  setMessage("Posicionamento cancelado.");
}

function openTutorial() {
  tutorialOverlay.hidden = false;
  document.querySelector("#tutorial-close").focus();
}

function closeTutorial() {
  tutorialOverlay.hidden = true;
  try {
    localStorage.setItem(TUTORIAL_KEY, "1");
  } catch (error) {
    console.error("Não foi possível salvar o tutorial visto.", error);
  }
}

cancelButton.addEventListener("click", cancelSelection);
document.querySelector("#tutorial-button").addEventListener("click", openTutorial);
document.querySelector("#tutorial-close").addEventListener("click", closeTutorial);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!tutorialOverlay.hidden) closeTutorial();
    else if (game.selectedTower) cancelSelection();
    else if (game.inspected !== null) {
      game.inspected = null;
      render();
    }
  }
  if ((event.key === "p" || event.key === "P") && !event.ctrlKey && !event.metaKey && game.phase === "wave") setPaused(!game.paused);
});
themeList.addEventListener("click", (event) => {
  const card = event.target.closest("[data-theme-key]");
  if (card) selectTheme(card.dataset.themeKey);
});
restartButton.addEventListener("click", restartGame);
volumeSlider.value = String(Math.round(GameAudio.getVolume() * 100));
volumeValue.textContent = `${volumeSlider.value}%`;
volumeSlider.addEventListener("input", () => {
  GameAudio.unlock();
  GameAudio.setVolume(Number(volumeSlider.value) / 100);
  volumeValue.textContent = `${volumeSlider.value}%`;
});
volumeSlider.addEventListener("change", () => GameAudio.play("select"));
musicButton.addEventListener("click", toggleMusic);
sfxButton.addEventListener("click", toggleSfx);
applyTheme(progress.lastTheme);
resetGame(storageNotice || "Posicione suas defesas e inicie o primeiro turno.");
try {
  if (!localStorage.getItem(TUTORIAL_KEY)) openTutorial();
} catch (error) {
  openTutorial();
}
