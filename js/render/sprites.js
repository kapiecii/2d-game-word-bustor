// Procedural pixel-art sprite generator & cache (no external image files required)

const spriteCache = new Map();

function buildSprite(grid, palette, scale = 3, flipX = false) {
  const rows = grid.length;
  const cols = grid[0].length;
  const canvas = document.createElement('canvas');
  canvas.width = cols * scale;
  canvas.height = rows * scale;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  for (let y = 0; y < rows; y++) {
    const row = grid[y];
    for (let x = 0; x < cols; x++) {
      const ch = row[x];
      const color = palette[ch];
      if (!color) continue;
      ctx.fillStyle = color;
      const drawX = flipX ? (cols - 1 - x) * scale : x * scale;
      ctx.fillRect(drawX, y * scale, scale, scale);
    }
  }
  return canvas;
}

export function getSprite(key, grid, palette, scale = 3, flipX = false) {
  const cacheKey = `${key}_${scale}_${flipX ? 'L' : 'R'}`;
  if (!spriteCache.has(cacheKey)) {
    spriteCache.set(cacheKey, buildSprite(grid, palette, scale, flipX));
  }
  return spriteCache.get(cacheKey);
}

// --- High-Resolution Hero Palettes (24x28 16-bit style) ---
const HERO_PALETTE = {
  O: '#1a1f36', // Dark outline / eyes
  R: '#e63946', // Red suit main
  D: '#9e1c28', // Red suit dark shade
  H: '#ff7582', // Red highlight
  S: '#ffd5b4', // Skin
  T: '#f2b891', // Skin shadow
  K: '#ff9aa2', // Rosy cheek
  W: '#ffffff', // White accent / eye shine
  C: '#4cc9f0', // Arm cannon cyan glow
  B: '#2678b2', // Cannon / visor blue
  G: '#6c7a96', // Cannon metal
  M: '#9fb0cc', // Metal highlight
  Y: '#ffd24c', // Yellow belt / buckle
  N: '#3b281c', // Boy spiky dark brown hair
  L: '#634430', // Boy hair highlight
  F: '#f4a236', // Girl golden-orange ponytail hair
  J: '#ffd166', // Girl hair highlight
  P: '#ff5d9e', // Girl ribbon & skirt accent
  Q: '#ff9ec7', // Girl light pink accent
};

// BOY: Red hero helmet with cyan visor gem, spiky brown hair peeking out,
// red & white hero armor, sturdy boots, cyan arm cannon (24x28)
const BOY_IDLE = [
  '........OOOOOOOO........',
  '......OORRRRRRRROO......',
  '.....ORHHHHHHHHHRRO.....',
  '....ORRRROCCORRRRRO.....',
  '....ORRRROBBORRRRRO.....',
  '...ONNLLLLLLLLRRNNO.....',
  '...ONNNSSSSSSSRNNO......',
  '...ON.OSSSSSSSO..O......',
  '......OSWOSWOSO.........',
  '......OSOOSSOOO.........',
  '......OSSSSSSSSO........',
  '.......OOTTTTOO.........',
  '.....OODWWWWWWDOO.......',
  '....ORRRRRRRRRRROO......',
  '...ORRWWWRRRRGGMMGO.....',
  '...ORRWWWRRRRGGCCCO.....',
  '...ODRRRRRRRRGGCCCO.....',
  '....ODDRRRRRRGGMMGO.....',
  '.....OODYYYYYDOOO.......',
  '.....OORRRRRRRO.........',
  '.....ORRRROORRO.........',
  '.....ORRRROORRO.........',
  '.....ODDDDOODDO.........',
  '.....OOWWOOOWWO.........',
  '....OORRRROORRRRO.......',
  '....ODDDDDOODDDDO.......',
  '....OOOOOOOOOOOOO.......',
  '........................',
];

const BOY_RUN1 = [
  '........OOOOOOOO........',
  '......OORRRRRRRROO......',
  '.....ORHHHHHHHHHRRO.....',
  '....ORRRROCCORRRRRO.....',
  '....ORRRROBBORRRRRO.....',
  '...ONNLLLLLLLLRRNNO.....',
  '...ONNNSSSSSSSRNNO......',
  '...ON.OSSSSSSSO..O......',
  '......OSWOSWOSO.........',
  '......OSOOSSOOO.........',
  '......OSSSSSSSSO........',
  '.......OOTTTTOO.........',
  '.....OODWWWWWWDOO.......',
  '....ORRRRRRRRRRROO......',
  '...ORRWWWRRRRGGMMGO.....',
  '..ODRRWWWRRRRGGCCCO.....',
  '..ODDRRRRRRRRGGCCCO.....',
  '....ODDRRRRRRGGMMGO.....',
  '.....OODYYYYYDOOO.......',
  '....OORRRRRRRRO.........',
  '...ORRRRO..ORRRRO.......',
  '..ORRRRO....ORRRRO......',
  '..OOWWOO.....OOWWOO.....',
  '.OORRRRO......OORRRRO...',
  '.ODDDDDO......ODDDDDO...',
  '.OOOOOOO.......OOOOOO...',
  '........................',
  '........................',
];

const BOY_JUMP = [
  '........OOOOOOOO........',
  '......OORRRRRRRROO......',
  '.....ORHHHHHHHHHRRO.....',
  '....ORRRROCCORRRRRO.....',
  '....ORRRROBBORRRRRO.....',
  '...ONNLLLLLLLLRRNNO.....',
  '...ONNNSSSSSSSRNNO......',
  '...ON.OSSSSSSSO..O......',
  '......OSWOSWOSO.........',
  '......OSOOSSOOO.........',
  '......OSSSSSSSSO........',
  '.......OOTTTTOO.........',
  '...OOOODWWWWWWDOO.......',
  '..ORRWRRRRRRRRRROO......',
  '..ODRRWWWRRRRGGMMGO.....',
  '...ODRRRRRRRRGGCCCO.....',
  '....ODDRRRRRRGGCCCO.....',
  '.....OODYYYYYGGMMGO.....',
  '....OORRRRRRRROOOO......',
  '...ORRRRO.OORRRRO.......',
  '...OOWWOO..OOWWOO.......',
  '..OORRRRO..OORRRRO......',
  '..ODDDDDO..ODDDDDO......',
  '..OOOOOOO..OOOOOOO......',
  '........................',
  '........................',
  '........................',
  '........................',
];

// GIRL: Flowing golden ponytail & bangs, pink ribbon headband, rosy cheeks,
// red & pink-white hero tunic/skirt, sleek boots, cyan arm cannon (24x28)
const GIRL_IDLE = [
  '.......OOOOOOOOO........',
  '.....OOFFJJJJJFFOO......',
  '....OFFJJJJJJJJJFFO.....',
  '..OOOOPPPPRRRRPPPOO.....',
  '.OJJFFOPQQRRRRQQPO......',
  '.OFJFFOFFJJJJJFFFO......',
  'OJJFFOOFSSSSSSFFO.......',
  'OFFFO.OSSSSSSSSFO.......',
  '.OFO..OSWOSWOSOO........',
  '..O...OSOOSSOOFO........',
  '......OKSSSSSKO.........',
  '.......OOTTTTOO.........',
  '.....OOWWWPPWWWOO.......',
  '....ORRRRRRRRRRROO......',
  '...ORRQQQRRRRGGMMGO.....',
  '...ORRQQQRRRRGGCCCO.....',
  '...ODRRRRRRRRGGCCCO.....',
  '....OODYYYYYYGGMMGO.....',
  '...OORRRPPPPPPPROOO.....',
  '..ORRRRRQQQQQQRRRRO.....',
  '..OODDDDDDDDDDDDDOO.....',
  '.....OSSSSOOSSSO........',
  '.....OOWWOOOWWO.........',
  '.....ORRRROORRO.........',
  '....OORRRROORRRRO.......',
  '....ODDDDDOODDDDO.......',
  '....OOOOOOOOOOOOO.......',
  '........................',
];

const GIRL_RUN1 = [
  '.......OOOOOOOOO........',
  '.....OOFFJJJJJFFOO......',
  '....OFFJJJJJJJJJFFO.....',
  '..OOOOPPPPRRRRPPPOO.....',
  'OJJFFOPQQRRRRQQPO.......',
  'OFJFFOFFJJJJJFFFO.......',
  'OJJFO.OFSSSSSSFFO.......',
  '.OFO..OSSSSSSSSFO.......',
  '......OSWOSWOSOO........',
  '......OSOOSSOOFO........',
  '......OKSSSSSKO.........',
  '.......OOTTTTOO.........',
  '.....OOWWWPPWWWOO.......',
  '....ORRRRRRRRRRROO......',
  '...ORRQQQRRRRGGMMGO.....',
  '..ODRRQQQRRRRGGCCCO.....',
  '..ODDRRRRRRRRGGCCCO.....',
  '....OODYYYYYYGGMMGO.....',
  '...OORRRPPPPPPPROOO.....',
  '..ORRRRRQQQQQQRRRRO.....',
  '..OODDDDDDDDDDDDDOO.....',
  '....OSSSSO..OSSSO.......',
  '...OOWWOO....OOWWOO.....',
  '..OORRRRO.....OORRRRO...',
  '..ODDDDDO.....ODDDDDO...',
  '..OOOOOOO......OOOOOO...',
  '........................',
  '........................',
];

const GIRL_JUMP = [
  '.......OOOOOOOOO........',
  '.....OOFFJJJJJFFOO......',
  '....OFFJJJJJJJJJFFO.....',
  '..OOOOPPPPRRRRPPPOO.....',
  'OJJFFOPQQRRRRQQPO.......',
  'OFJFFOFFJJJJJFFFO.......',
  'OJJFO.OFSSSSSSFFO.......',
  '.OFO..OSSSSSSSSFO.......',
  '......OSWOSWOSOO........',
  '......OSOOSSOOFO........',
  '......OKSSSSSKO.........',
  '.......OOTTTTOO.........',
  '...OOOOWWWPPWWWOO.......',
  '..ORRQRRRRRRRRRROO......',
  '..ODRRQQQRRRRGGMMGO.....',
  '...ODRRRRRRRRGGCCCO.....',
  '....OODYYYYYYGGCCCO.....',
  '...OORRRPPPPPPPGMGO.....',
  '..ORRRRRQQQQQQRRROO.....',
  '..OODDDDDDDDDDDDOO......',
  '....OSSSSOOSSSO.........',
  '...OOWWOO..OOWWOO.......',
  '..OORRRRO..OORRRRO......',
  '..ODDDDDO..ODDDDDO......',
  '..OOOOOOO..OOOOOOO......',
  '........................',
  '........................',
  '........................',
];

const SUIT_OVERRIDES = {
  suit_red: { R: '#e63946', D: '#9e1c28', H: '#ff7582' },
  suit_blue: { R: '#2f80ed', D: '#1b498a', H: '#7cc0ff' },
  suit_ninja: { R: '#2d3748', D: '#141923', H: '#ffd166' },
  suit_gold: { R: '#f2b705', D: '#b57b00', H: '#fff08a' },
};

export function getPlayerSprite(charType, state, flipX = false, scale = 2, suitId = 'suit_red') {
  const isGirl = charType === 'girl';
  let grid;
  if (state === 'jump') grid = isGirl ? GIRL_JUMP : BOY_JUMP;
  else if (state === 'run') grid = isGirl ? GIRL_RUN1 : BOY_RUN1;
  else grid = isGirl ? GIRL_IDLE : BOY_IDLE;

  const overrides = SUIT_OVERRIDES[suitId] || SUIT_OVERRIDES.suit_red;
  const palette = { ...HERO_PALETTE, ...overrides };
  return getSprite(`player_hd_${charType}_${state}_${suitId}`, grid, palette, scale, flipX);
}

export function drawPlayerCape(ctx, accessoryId, drawX, drawY, spriteW, spriteH, facing = 1, time = 0) {
  if (accessoryId !== 'acc_cape') return;
  const wave = Math.sin(time * 9) * 3;
  const backX = facing > 0 ? drawX + spriteW * 0.28 : drawX + spriteW * 0.72;
  const topY = drawY + spriteH * 0.44;
  const tailX = backX - facing * (spriteW * 0.42);
  const bottomY = drawY + spriteH * 0.88 + wave;

  ctx.save();
  ctx.fillStyle = '#e63946';
  ctx.beginPath();
  ctx.moveTo(backX, topY);
  ctx.lineTo(tailX, topY + 6 + wave * 0.5);
  ctx.lineTo(tailX - facing * 4, bottomY);
  ctx.lineTo(backX - facing * 4, bottomY - 4);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#ffd24c';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

export function drawPlayerFrontAccessory(ctx, accessoryId, drawX, drawY, spriteW, spriteH, facing = 1) {
  if (accessoryId === 'acc_crown') {
    const cw = Math.round(spriteW * 0.44);
    const ch = Math.round(spriteH * 0.2);
    const cx = Math.round(drawX + (spriteW - cw) / 2);
    const cy = Math.round(drawY - ch + spriteH * 0.08);
    ctx.save();
    ctx.fillStyle = '#ffd24c';
    ctx.beginPath();
    ctx.moveTo(cx, cy + ch);
    ctx.lineTo(cx, cy + 2);
    ctx.lineTo(cx + cw * 0.28, cy + ch * 0.52);
    ctx.lineTo(cx + cw * 0.5, cy);
    ctx.lineTo(cx + cw * 0.72, cy + ch * 0.52);
    ctx.lineTo(cx + cw, cy + 2);
    ctx.lineTo(cx + cw, cy + ch);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#b57b00';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#f24b59';
    ctx.fillRect(cx + cw * 0.44, cy + ch * 0.58, Math.max(3, cw * 0.14), Math.max(3, ch * 0.28));
    ctx.restore();
  } else if (accessoryId === 'acc_sunglasses') {
    const gw = Math.round(spriteW * 0.36);
    const gh = Math.max(5, Math.round(spriteH * 0.1));
    const gx = facing > 0
      ? Math.round(drawX + spriteW * 0.34)
      : Math.round(drawX + spriteW * 0.30);
    const gy = Math.round(drawY + spriteH * 0.28);
    ctx.save();
    ctx.fillStyle = '#111626';
    ctx.fillRect(gx, gy, gw, gh);
    ctx.fillStyle = '#4cc9f0';
    ctx.fillRect(gx + 2, gy + 1, Math.max(3, gw * 0.28), Math.max(2, gh * 0.45));
    ctx.fillRect(gx + Math.round(gw * 0.56), gy + 1, Math.max(3, gw * 0.28), Math.max(2, gh * 0.45));
    ctx.restore();
  }
}

// --- Buddy (White + Orange Mini-Drone Navigator, 18x16 HD) ---
const BUDDY_FRAME_0 = [
  '..OOOOOOOOOOOO....',
  '........GG........',
  '.......GGGG.......',
  '.....WWWWWWWW.....',
  '...WWWWWWWWWWWW...',
  '..OWWDDDDDDDDWWO..',
  '..OWDDGGGGGGDDWO..',
  '..OWDGEWEEWEGDWO..',
  '..OWDGEEEEEEGDWO..',
  '..OWDDDDDDDDDDWO..',
  '..OOWWWOOWWWOO....',
  '...WWWWWWWWWW.....',
  '....OOOWWOOO......',
  '......OOOO........',
  '.......YY.........',
  '......Y..Y........',
];

const BUDDY_FRAME_1 = [
  '....OOOOOOOOOOOO..',
  '........GG........',
  '.......GGGG.......',
  '.....WWWWWWWW.....',
  '...WWWWWWWWWWWW...',
  '..OWWDDDDDDDDWWO..',
  '..OWDDGGGGGGDDWO..',
  '..OWDGEWEEWEGDWO..',
  '..OWDGEEEEEEGDWO..',
  '..OWDDDDDDDDDDWO..',
  '..OOWWWOOWWWOO....',
  '...WWWWWWWWWW.....',
  '....OOOWWOOO......',
  '......OOOO........',
  '......Y..Y........',
  '.......YY.........',
];

export function getBuddySprite(frame = 0, mood = 'normal', flipX = false, scale = 2) {
  const glowColor =
    mood === 'happy' ? '#45f28f' : mood === 'encourage' ? '#ffe066' : '#ff9f1c';
  const palette = {
    W: '#f5f8ff',
    O: '#ff8c2b',
    D: '#1d2b45',
    G: '#8d9cb8',
    E: glowColor,
    Y: '#ffd24c',
  };
  const grid = frame % 2 === 0 ? BUDDY_FRAME_0 : BUDDY_FRAME_1;
  return getSprite(`buddy_hd_${frame % 2}_${mood}`, grid, palette, scale, flipX);
}

// --- Enemies ---
const SLIME_GRID = [
  '....XXXX....',
  '..XXHHHHXX..',
  '.XHHXXXXXXX.',
  '.XXWEXXWEXX.',
  'XXXEEXXEEXXX',
  'XXXXXXXXXXXX',
  'XDDDDDDDDDDX',
  '.DDDDDDDDDD.',
];

const BAT_FRAME_0 = [
  'XX........XX',
  'XXX..XX..XXX',
  'XXXXWWWWXXXX',
  '.XXWEWWEWXX.',
  '..XXXXXXXX..',
  '...XX..XX...',
];

const BAT_FRAME_1 = [
  '.....XX.....',
  '....WWWW....',
  '..XWEWWEWX..',
  'XXXXXXXXXXXX',
  'XXX.XXXX.XXX',
  'XX........XX',
];

const TURRET_GRID = [
  '...GGGGGG...',
  '..GLLLLLLG..',
  '.GGDDDDDDGG.',
  'CCDDDRRDDDG.',
  'CCDDDRRDDDG.',
  '.GGDDDDDDGG.',
  '..GGGGGGGG..',
  '.DDDDDDDDDD.',
];

export function getEnemySprite(type, frame = 0, flipX = false, scale = 3) {
  if (type === 'red_slime') {
    return getSprite(
      'enemy_red_slime',
      SLIME_GRID,
      { X: '#e63946', H: '#ff8fa3', D: '#9d0208', W: '#ffffff', E: '#1d1e2c' },
      scale,
      flipX
    );
  }
  if (type === 'blue_slime') {
    return getSprite(
      'enemy_blue_slime',
      SLIME_GRID,
      { X: '#2f80ed', H: '#85c1ff', D: '#1b498a', W: '#ffffff', E: '#1d1e2c' },
      scale,
      flipX
    );
  }
  if (type === 'bat') {
    const grid = frame % 2 === 0 ? BAT_FRAME_0 : BAT_FRAME_1;
    return getSprite(
      `enemy_bat_${frame % 2}`,
      grid,
      { X: '#5b3cc4', W: '#f4f7ff', E: '#ff4d6d' },
      scale,
      flipX
    );
  }
  if (type === 'turret') {
    return getSprite(
      'enemy_turret',
      TURRET_GRID,
      { G: '#6c7a96', L: '#a3b3cf', D: '#2d374c', R: '#ff4d4f', C: '#445473' },
      scale,
      flipX
    );
  }
  return getSprite(
    'enemy_robot',
    TURRET_GRID,
    { G: '#52796f', L: '#84a98c', D: '#2f3e46', R: '#ffd166', C: '#354f52' },
    scale,
    flipX
  );
}

// --- Boss: Forest Guardian ---
const BOSS_FOREST_0 = [
  '....LLLLLLLL....',
  '..LLGGGGGGGGLL..',
  '.LGGGBBBBBBGGGL.',
  '.GGBBYYYYYYBBGG.',
  'GGBBYEEBBEEYBGGG',
  'GGBBYYYYYYYYBBGG',
  'GGBBBBBBBBBBBBGG',
  '.GBBWWWWWWWWBBG.',
  '.GBBBBBBBBBBBBG.',
  'BBGBBGGGGGGGBBGB',
  'BBGBBGGGGGGGBBGB',
  'BBB.BBBBBBBB.BBB',
  '....BBB..BBB....',
  '...BBBB..BBBB...',
];

const BOSS_FOREST_1 = [
  '...LLLLLLLLLL...',
  '..LLGGGGGGGGLL..',
  '.LGGGBBBBBBGGGL.',
  '.GGBBYYYYYYBBGG.',
  'GGBBYEEBBEEYBGGG',
  'GGBBYYYYYYYYBBGG',
  'GGBBBBBBBBBBBBGG',
  '.GBBWWWWWWWWBBG.',
  'BBGBBBBBBBBBBBGB',
  'BBGBBGGGGGGGBBGB',
  'BBB.BGGGGGG.BBBB',
  '....BBBBBBBB....',
  '...BBB....BBB...',
  '..BBBB....BBBB..',
];

const BOSS_ROCK_0 = [
  '.....GGGGGG.....',
  '...GGLLLLLLGG...',
  '..GLLBBBBBBLLG..',
  '.GLBBOOOOOOBBLG.',
  'GGBBOYYBBYYOBBGG',
  'GGBBBOOOOOOBBBGG',
  'GGBBBBBBBBBBBBGG',
  'GGBBYYBBBBYYBBGG',
  'GGGBBBBBBBBBBGGG',
  'BBBBBBBBBBBBBBBB',
  'BBB.GGGGGGGG.BBB',
  '....BBBBBBBB....',
  '...BBBB..BBBB...',
  '..DDDDD..DDDDD..',
];

const BOSS_ROCK_1 = [
  '....GGGGGGGG....',
  '...GGLLLLLLGG...',
  '..GLLBBBBBBLLG..',
  '.GLBBOOOOOOBBLG.',
  'GGBBOYYBBYYOBBGG',
  'GGBBBOOOOOOBBBGG',
  'GGBBBBBBBBBBBBGG',
  'GGBBYYBBBBYYBBGG',
  'BBBBBBBBBBBBBBBB',
  'BBB.BBBBBBBB.BBB',
  '....GGGGGGGG....',
  '...BBBB..BBBB...',
  '..DDDDD..DDDDD..',
  '................',
];

const BOSS_ICE_0 = [
  '.....CCCCCC.....',
  '...CCWWWWWWCC...',
  '..CWWBBBBBBWWC..',
  '.CWBBDDDDDDBBWC.',
  '.CWBDRRBBDRRBWC.',
  '.CWBBDDDDDDBBWC.',
  '..CWWWWWWWWWWC..',
  '.CCCBBBBBBBBCCC.',
  'CCWCBCCCCCCBCWCC',
  'CCWCBBBBBBBBCWCC',
  '..CC.BBBBBB.CC..',
  '.....CC..CC.....',
  '....BBB..BBB....',
  '...DDDD..DDDD...',
];

const BOSS_ICE_1 = [
  '....CCCCCCCC....',
  '...CCWWWWWWCC...',
  '..CWWBBBBBBWWC..',
  '.CWBBDDDDDDBBWC.',
  '.CWBDRRBBDRRBWC.',
  '.CWBBDDDDDDBBWC.',
  '..CWWWWWWWWWWC..',
  'CCCCBBBBBBBBCCCC',
  'CCWCBCCCCCCBCWCC',
  '..CC.BBBBBB.CC..',
  '.....CC..CC.....',
  '....BBB..BBB....',
  '...DDDD..DDDD...',
  '................',
];

const BOSS_MEGA_0 = [
  '...YY......YY...',
  '...YYRRRRRRYY...',
  '..RRRRGGGGGRRR..',
  '.RRGGDDDDDDGGRR.',
  '.RRGDYYDDYYDGRR.',
  '.RRGGDDDDDDGGRR.',
  '..RRRRYYYYRRRR..',
  '.GGRRGGGGGGGRGG.',
  'GGGRRGGCCGGGRGGG',
  'GGGRRGGGGGGGRGGG',
  'DDD..RRRRRR..DDD',
  '....GGG..GGG....',
  '...RRRR..RRRR...',
  '..DDDDD..DDDDD..',
];

const BOSS_MEGA_1 = [
  '..YY........YY..',
  '...YYRRRRRRYY...',
  '..RRRRGGGGGRRR..',
  '.RRGGDDDDDDGGRR.',
  '.RRGDYYDDYYDGRR.',
  '.RRGGDDDDDDGGRR.',
  '..RRRRYYYYRRRR..',
  'GGGRRGGGGGGGRGGG',
  'GGGRRGGCCGGGRGGG',
  'DDD..GGGGGG..DDD',
  '.....RRRRRR.....',
  '....GGG..GGG....',
  '...RRRR..RRRR...',
  '..DDDDD..DDDDD..',
];

const BOSS_OCTOPUS_0 = [
  '....PPPPPPPP....',
  '..PPHHHHHHHHPP..',
  '.PPHPPPPPPPPHPP.',
  '.PPPPPPPPPPPPPP.',
  '.PPPWWPPPPWWPPP.',
  '.PPWYEPPPWYEPPP.',
  '.PPPWWPPPPWWPPP.',
  '..PPPPDDDDPPPP..',
  '..PPPPPDDPPPPP..',
  '.PP.PPP..PPP.PP.',
  'PP..PP....PP..PP',
  'P..PP..PP..PP..P',
  '...P...PP...P...',
  '.......PP.......',
];

const BOSS_OCTOPUS_1 = [
  '....PPPPPPPP....',
  '..PPHHHHHHHHPP..',
  '.PPHPPPPPPPPHPP.',
  '.PPPPPPPPPPPPPP.',
  '.PPPWWPPPPWWPPP.',
  '.PPWYEPPPWYEPPP.',
  '.PPPWWPPPPWWPPP.',
  '..PPPPDDDDPPPP..',
  '.PPPPPPDDPPPPPP.',
  'PP..PP.PP.PP..PP',
  '.P..PP.PP.PP..P.',
  '....P..PP..P....',
  '..PP........PP..',
  '..P..........P..',
];

const BOSS_DRAGON_0 = [
  'YY............YY',
  'OYY..RRRRRR..YYO',
  'OOYRRRRRRRRRRYOO',
  '.OORRRYYYYRRROO.',
  '..ORRYERRRYERO..',
  '..ORRRRRRRRRRO..',
  '...ORWWWWWWRO...',
  'RRRRRROYYORRRRRR',
  'RRROORROORROORRR',
  'OO..ORRRRRRO..OO',
  '....ORROORRO....',
  '...ORRO..ORRO...',
  '...DDDO..ODDD...',
  '................',
];

const BOSS_DRAGON_1 = [
  '....RRRRRRRR....',
  '...RRRRRRRRRR...',
  '..ORRRYYYYRRRO..',
  '..ORRYERRRYERO..',
  '..ORRRRRRRRRRO..',
  '...ORWWWWWWRO...',
  'OO..RROYYORR..OO',
  'RRRRRRROORRRRRRR',
  'RRROORRRRRROORRR',
  'OO..ORRRRRRO..OO',
  '...ORRO..ORRO...',
  '..ORRO....ORRO..',
  '..DDDO....ODDD..',
  '................',
];

const BOSS_BIRD_0 = [
  'CC....YYYY....CC',
  'CCC..YHHHHY..CCC',
  'CCCCYYYYYYYYCCCC',
  '.CCCYYEWWEYYCCC.',
  '..CCYYOOOOYYCC..',
  '...CYYYOOYYYC...',
  '....YYYYYYYY....',
  '...CYYYYYYYYC...',
  '..CCYYYYYYYYCC..',
  '.....YY..YY.....',
  '....OOO..OOO....',
  '....O.O..O.O....',
  '................',
  '................',
];

const BOSS_BIRD_1 = [
  '......YYYY......',
  '.....YHHHHY.....',
  '....YYYYYYYY....',
  '...CYYEWWEYYC...',
  '..CCYYOOOOYYCC..',
  '.CCCYYYOOYYYCCC.',
  'CCCCYYYYYYYYCCCC',
  'CCC.YYYYYYYY.CCC',
  'CC...YYYYYY...CC',
  '.....YY..YY.....',
  '....OOO..OOO....',
  '................',
  '................',
  '................',
];

const BOSS_CANDY_0 = [
  '.....Y.YY.Y.....',
  '.....YYYYYY.....',
  '....WWWWWWWW....',
  '...WWPPPPPPWW...',
  '..WWPPPPPPPPWW..',
  '..WPPWEYYEWPPW..',
  '..WPPWEEEEWPPW..',
  '..WPPPPPPPPPPW..',
  '.WWWWWWWWWWWWWW.',
  '.WCCCCCCCCCCCCW.',
  '.WCCYYCCCCYYCCW.',
  '..CCCCCCCCCCCC..',
  '...PPP....PPP...',
  '..DDDD....DDDD..',
];

const BOSS_CANDY_1 = [
  '....Y..YY..Y....',
  '.....YYYYYY.....',
  '....WWWWWWWW....',
  '...WWPPPPPPWW...',
  '..WWPPPPPPPPWW..',
  '..WPPWEYYEWPPW..',
  '..WPPWEEEEWPPW..',
  '..WPPPPPPPPPPW..',
  '.WWWWWWWWWWWWWW.',
  'WWCCCCCCCCCCCCWW',
  '.WCCYYCCCCYYCCW.',
  '..CCCCCCCCCCCC..',
  '..PPP......PPP..',
  '.DDDD......DDDD.',
];

export function getBossSprite(bossId, frame = 0, flipX = false, scale = 6) {
  if (bossId === 'candy_king') {
    const palette = {
      Y: '#ffd24c',
      W: '#ffffff',
      P: '#ff5d9e',
      C: '#c98a52',
      D: '#8a4f24',
      E: '#1a1f36',
    };
    return getSprite(`boss_candy_${frame % 2}`, frame % 2 === 0 ? BOSS_CANDY_0 : BOSS_CANDY_1, palette, scale, flipX);
  }
  if (bossId === 'giant_octopus') {
    const palette = {
      P: '#9b5de5',
      H: '#d0a2ff',
      D: '#5a189a',
      W: '#ffffff',
      Y: '#ffd166',
      E: '#1a1f36',
    };
    return getSprite(`boss_octopus_${frame % 2}`, frame % 2 === 0 ? BOSS_OCTOPUS_0 : BOSS_OCTOPUS_1, palette, scale, flipX);
  }
  if (bossId === 'fire_dragon') {
    const palette = {
      R: '#e63946',
      O: '#ff6d00',
      Y: '#ffd166',
      E: '#1a1f36',
      W: '#ffffff',
      D: '#7a1220',
    };
    return getSprite(`boss_dragon_${frame % 2}`, frame % 2 === 0 ? BOSS_DRAGON_0 : BOSS_DRAGON_1, palette, scale, flipX);
  }
  if (bossId === 'thunder_bird') {
    const palette = {
      Y: '#ffd24c',
      H: '#fff3a8',
      C: '#4cc9f0',
      O: '#ff8c2b',
      W: '#ffffff',
      E: '#1a1f36',
    };
    return getSprite(`boss_bird_${frame % 2}`, frame % 2 === 0 ? BOSS_BIRD_0 : BOSS_BIRD_1, palette, scale, flipX);
  }
  if (bossId === 'rock_golem') {
    const palette = {
      G: '#8d99ae',
      L: '#cbd5e1',
      B: '#5c677d',
      D: '#33415c',
      O: '#1e293b',
      Y: '#ffb703',
    };
    return getSprite(`boss_rock_${frame % 2}`, frame % 2 === 0 ? BOSS_ROCK_0 : BOSS_ROCK_1, palette, scale, flipX);
  }
  if (bossId === 'ice_machine') {
    const palette = {
      C: '#4cc9f0',
      W: '#eef8ff',
      B: '#3a86ff',
      D: '#1d3557',
      R: '#ff4d6d',
    };
    return getSprite(`boss_ice_${frame % 2}`, frame % 2 === 0 ? BOSS_ICE_0 : BOSS_ICE_1, palette, scale, flipX);
  }
  if (bossId === 'mega_robot') {
    const palette = {
      R: '#e63946',
      Y: '#ffd166',
      G: '#495057',
      D: '#1a1f36',
      C: '#4cc9f0',
    };
    return getSprite(`boss_mega_${frame % 2}`, frame % 2 === 0 ? BOSS_MEGA_0 : BOSS_MEGA_1, palette, scale, flipX);
  }

  const palette = {
    L: '#7ae582',
    G: '#2d6a4f',
    B: '#6f4e37',
    Y: '#ffd166',
    E: '#e63946',
    W: '#e9f5db',
  };
  const grid = frame % 2 === 0 ? BOSS_FOREST_0 : BOSS_FOREST_1;
  return getSprite(`boss_${bossId}_${frame % 2}`, grid, palette, scale, flipX);
}

// --- Objects ---
const COIN_GRID = [
  '..YYYY..',
  '.YHHHHY.',
  'YHYWWYHY',
  'YHYWWYHY',
  'YHYWWYHY',
  '.YDDDDY.',
  '..DDDD..',
];

const KEY_GRID = [
  '..YYYY..',
  '.Y....Y.',
  '.Y....Y.',
  '..YYYY..',
  '...YY...',
  '...YY...',
  '...YYYY.',
  '...YY...',
  '...YYYY.',
];

export function getCoinSprite(scale = 3) {
  return getSprite(
    'obj_coin',
    COIN_GRID,
    { Y: '#f2b705', H: '#ffe66d', W: '#fff9cc', D: '#b57b00' },
    scale,
    false
  );
}

export function getKeySprite(scale = 3) {
  return getSprite('obj_key', KEY_GRID, { Y: '#ffd24c' }, scale, false);
}
