import { CONFIG } from '../../config.js';

const G = CONFIG.GROUND_Y;

export const SKY_STAGES = {
  'sky-1': {
    id: 'sky-1',
    name: 'Sky 1: Cloud Highway',
    world: 'sky',
    width: 3100,
    startX: 60,
    objects: [
      // Area 1: Jump 4 times!
      { id: 'kc1', type: 'coin', x: 260, y: G - 96, w: 24, h: 24 },
      { id: 'kc2', type: 'coin', x: 380, y: G - 118, w: 24, h: 24 },
      { id: 'kgate1', type: 'gate', x: 640, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Stay on the tree!
      { id: 'kbox1', type: 'box', x: 840, y: G - 48, w: 48, h: 48 },
      { id: 'ktree1', type: 'tree', x: 1000, y: G - 125, w: 130, h: 26 },
      { id: 'kgate2', type: 'gate', x: 1360, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Shoot 3 bats!
      { id: 'ktree2', type: 'tree', x: 1620, y: G - 108, w: 120, h: 26 },
      { id: 'kgate3', type: 'gate', x: 2460, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'kc3', type: 'coin', x: 2660, y: G - 76, w: 24, h: 24 },
      { id: 'kgoal1', type: 'goal', x: 2900, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 'ke_bat1', type: 'bat', word: 'Bat', x: 1780, y: G - 150, patrolRange: 85, hp: 1 },
      { id: 'ke_bat2', type: 'bat', word: 'Bat', x: 2000, y: G - 115, patrolRange: 85, hp: 1 },
      { id: 'ke_bat3', type: 'bat', word: 'Bat', x: 2220, y: G - 165, patrolRange: 85, hp: 1 },
    ],
    missions: [
      {
        id: 'mk1_jump4',
        triggerX: 40,
        checkpointX: 60,
        type: 'jump_count',
        targetCount: 4,
        text: 'Jump 4 times!',
        jp: '4回ジャンプしよう！',
        timeLimit: 20,
        gateId: 'kgate1',
      },
      {
        id: 'mk1_stay',
        triggerX: 690,
        checkpointX: 710,
        type: 'stay_on_object',
        targetId: 'ktree1',
        holdSeconds: 3,
        text: 'Stay on the tree!',
        jp: '木の上に3びょう乗りつづけよう！',
        timeLimit: 25,
        gateId: 'kgate2',
      },
      {
        id: 'mk1_bats',
        triggerX: 1410,
        checkpointX: 1430,
        type: 'defeat_enemy_type',
        targetType: 'bat',
        targetCount: 3,
        text: 'Shoot 3 bats!',
        jp: 'コウモリを3びき撃とう！',
        timeLimit: 35,
        gateId: 'kgate3',
      },
    ],
  },

  'sky-2': {
    id: 'sky-2',
    name: 'Sky 2: Storm Tower',
    world: 'sky',
    width: 3150,
    startX: 60,
    objects: [
      // Area 1: Jump on the box, then the tree!
      { id: 'kbox2_1', type: 'box', x: 300, y: G - 54, w: 54, h: 54 },
      { id: 'ktree2_1', type: 'tree', x: 470, y: G - 125, w: 120, h: 26 },
      { id: 'kgate2_1', type: 'gate', x: 780, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Get the red star!
      { id: 'kstar_y', type: 'star', color: 'yellow', x: 980, y: G - 48, w: 30, h: 30 },
      { id: 'kstar_r', type: 'star', color: 'red', x: 1180, y: G - 115, w: 30, h: 30 },
      { id: 'kstar_b', type: 'star', color: 'blue', x: 1380, y: G - 48, w: 30, h: 30 },
      { id: 'kgate2_2', type: 'gate', x: 1600, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Shoot green, then yellow!
      { id: 'ksw_g', type: 'switch', color: 'green', resetOnFail: true, x: 1940, y: G - 62, w: 38, h: 38 },
      { id: 'ksw_y', type: 'switch', color: 'yellow', resetOnFail: true, x: 2140, y: G - 122, w: 38, h: 38 },
      { id: 'kgate2_3', type: 'gate', x: 2440, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'kc2_1', type: 'coin', x: 2660, y: G - 76, w: 24, h: 24 },
      { id: 'kgoal2', type: 'goal', x: 2940, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [
      { id: 'ke_tur1', type: 'turret', word: 'Turret', x: 2700, y: G - 26, hp: 2, shootInterval: 2.0 },
    ],
    missions: [
      {
        id: 'mk2_seq_jump',
        triggerX: 40,
        checkpointX: 60,
        type: 'sequence',
        subType: 'jump_objects',
        steps: ['kbox2_1', 'ktree2_1'],
        text: 'Jump on the box, then the tree!',
        jp: 'まず箱（BOX）、つぎに木（TREE）に飛び乗ろう！',
        timeLimit: 30,
        gateId: 'kgate2_1',
      },
      {
        id: 'mk2_star',
        triggerX: 830,
        checkpointX: 850,
        type: 'collect_star',
        targetColor: 'red',
        text: 'Get the red star!',
        jp: '赤いスター（RED STAR）を取ろう！',
        timeLimit: 25,
        gateId: 'kgate2_2',
      },
      {
        id: 'mk2_seq_sw',
        triggerX: 1650,
        checkpointX: 1670,
        type: 'sequence',
        subType: 'shoot_switches',
        steps: ['green', 'yellow'],
        text: 'Shoot green, then yellow!',
        jp: 'まず緑（GREEN）、つぎに黄（YELLOW）を撃とう！',
        timeLimit: 30,
        gateId: 'kgate2_3',
      },
    ],
  },

  'sky-2b': {
    id: 'sky-2b',
    name: 'Sky 3: Rainbow Gate',
    world: 'sky',
    width: 3100,
    startX: 60,
    objects: [
      // Area 1: Don't move!
      { id: 'k2b_c1', type: 'coin', x: 240, y: G - 56, w: 24, h: 24 },
      { id: 'k2b_gate1', type: 'gate', x: 640, y: G - 130, w: 34, h: 130, open: false },

      // Area 2: Shoot the circle! (Square / Circle / Triangle)
      { id: 'k2b_sh_s', type: 'shape_target', shape: 'square', color: 'red', x: 960, y: G - 62, w: 46, h: 46 },
      { id: 'k2b_sh_c', type: 'shape_target', shape: 'circle', color: 'green', x: 1120, y: G - 126, w: 46, h: 46 },
      { id: 'k2b_sh_t', type: 'shape_target', shape: 'triangle', color: 'yellow', x: 1280, y: G - 62, w: 46, h: 46 },
      { id: 'k2b_gate2', type: 'gate', x: 1520, y: G - 130, w: 34, h: 130, open: false },

      // Area 3: Break the ice!
      { id: 'k2b_ice', type: 'ice', x: 1960, y: G - 78, w: 66, h: 78, broken: false },
      { id: 'k2b_gate3', type: 'gate', x: 2320, y: G - 130, w: 34, h: 130, open: false },

      // Goal
      { id: 'k2b_c2', type: 'coin', x: 2560, y: G - 76, w: 24, h: 24 },
      { id: 'k2b_goal', type: 'goal', x: 2900, y: G - 120, w: 56, h: 120 },
    ],
    enemies: [],
    missions: [
      {
        id: 'mk2b_freeze',
        triggerX: 40,
        checkpointX: 60,
        type: 'dont_move',
        holdSeconds: 3,
        text: "Don't move!",
        jp: '3びょう間じっと止まろう！',
        timeLimit: 20,
        gateId: 'k2b_gate1',
      },
      {
        id: 'mk2b_circle',
        triggerX: 690,
        checkpointX: 710,
        type: 'shoot_shape',
        targetShape: 'circle',
        text: 'Shoot the circle!',
        jp: '丸（CIRCLE）の的を撃とう！',
        timeLimit: 25,
        gateId: 'k2b_gate2',
      },
      {
        id: 'mk2b_ice',
        triggerX: 1570,
        checkpointX: 1590,
        type: 'break_object',
        targetId: 'k2b_ice',
        text: 'Break the ice!',
        jp: 'チャージショットで氷（ICE）をこわそう！',
        timeLimit: 30,
        gateId: 'k2b_gate3',
      },
    ],
  },

  'sky-3': {
    id: 'sky-3',
    name: 'Sky 4: Thunder Bird',
    world: 'sky',
    width: 2200,
    startX: 60,
    isBossStage: true,
    objects: [
      { id: 'kc3_1', type: 'coin', x: 230, y: G - 54, w: 24, h: 24 },
      { id: 'kc3_2', type: 'coin', x: 340, y: G - 94, w: 24, h: 24 },
      { id: 'kc3_3', type: 'coin', x: 450, y: G - 54, w: 24, h: 24 },
      { id: 'kbox3_1', type: 'box', x: 560, y: G - 48, w: 48, h: 48 },
    ],
    enemies: [],
    missions: [],
    boss: {
      id: 'thunder_bird',
      name: 'Thunder Bird',
      triggerX: 720,
      arenaLeft: 700,
      arenaRight: 2140,
      x: 1840,
      hp: 16,
    },
  },
};
