// World & Stage Registry (8 Worlds x 4 Stages = 32 Stages)

import { FOREST_STAGES } from './stages/forest.js';
import { DESERT_STAGES } from './stages/desert.js';
import { SNOW_STAGES } from './stages/snow.js';
import { ROBOT_STAGES } from './stages/robot.js';
import { OCEAN_STAGES } from './stages/ocean.js';
import { VOLCANO_STAGES } from './stages/volcano.js';
import { SKY_STAGES } from './stages/sky.js';
import { CANDY_STAGES } from './stages/candy.js';

export const WORLDS = [
  {
    id: 'forest',
    name: '1. Forest World',
    implemented: true,
    stages: [
      { id: 'forest-1', label: 'Forest 1', subtitle: 'Green Meadow', isBoss: false },
      { id: 'forest-2', label: 'Forest 2', subtitle: 'Deep Woods', isBoss: false },
      { id: 'forest-2b', label: 'Forest 3', subtitle: 'Hidden Grove', isBoss: false },
      { id: 'forest-3', label: 'Forest 4', subtitle: 'Forest Guardian', isBoss: true },
    ],
  },
  {
    id: 'desert',
    name: '2. Desert World',
    implemented: true,
    stages: [
      { id: 'desert-1', label: 'Desert 1', subtitle: 'Sandy Trail', isBoss: false },
      { id: 'desert-2', label: 'Desert 2', subtitle: 'Canyon Run', isBoss: false },
      { id: 'desert-2b', label: 'Desert 3', subtitle: 'Pyramid Path', isBoss: false },
      { id: 'desert-3', label: 'Desert 4', subtitle: 'Rock Golem', isBoss: true },
    ],
  },
  {
    id: 'snow',
    name: '3. Snow World',
    implemented: true,
    stages: [
      { id: 'snow-1', label: 'Snow 1', subtitle: 'Frost Path', isBoss: false },
      { id: 'snow-2', label: 'Snow 2', subtitle: 'Ice Cave', isBoss: false },
      { id: 'snow-2b', label: 'Snow 3', subtitle: 'Frozen Peak', isBoss: false },
      { id: 'snow-3', label: 'Snow 4', subtitle: 'Ice Machine', isBoss: true },
    ],
  },
  {
    id: 'robot',
    name: '4. Robot World',
    implemented: true,
    stages: [
      { id: 'robot-1', label: 'Robot 1', subtitle: 'Metal Factory', isBoss: false },
      { id: 'robot-2', label: 'Robot 2', subtitle: 'Laser Core', isBoss: false },
      { id: 'robot-2b', label: 'Robot 3', subtitle: 'Cyber Vault', isBoss: false },
      { id: 'robot-3', label: 'Robot 4', subtitle: 'Mega Robot', isBoss: true },
    ],
  },
  {
    id: 'ocean',
    name: '5. Ocean World',
    implemented: true,
    stages: [
      { id: 'ocean-1', label: 'Ocean 1', subtitle: 'Coral Reef', isBoss: false },
      { id: 'ocean-2', label: 'Ocean 2', subtitle: 'Deep Sea Cave', isBoss: false },
      { id: 'ocean-2b', label: 'Ocean 3', subtitle: 'Sunken Ship', isBoss: false },
      { id: 'ocean-3', label: 'Ocean 4', subtitle: 'Giant Octopus', isBoss: true },
    ],
  },
  {
    id: 'volcano',
    name: '6. Volcano World',
    implemented: true,
    stages: [
      { id: 'volcano-1', label: 'Volcano 1', subtitle: 'Lava Ridge', isBoss: false },
      { id: 'volcano-2', label: 'Volcano 2', subtitle: 'Magma Core', isBoss: false },
      { id: 'volcano-2b', label: 'Volcano 3', subtitle: 'Ash Bridge', isBoss: false },
      { id: 'volcano-3', label: 'Volcano 4', subtitle: 'Fire Dragon', isBoss: true },
    ],
  },
  {
    id: 'sky',
    name: '7. Sky World',
    implemented: true,
    stages: [
      { id: 'sky-1', label: 'Sky 1', subtitle: 'Cloud Highway', isBoss: false },
      { id: 'sky-2', label: 'Sky 2', subtitle: 'Storm Tower', isBoss: false },
      { id: 'sky-2b', label: 'Sky 3', subtitle: 'Rainbow Gate', isBoss: false },
      { id: 'sky-3', label: 'Sky 4', subtitle: 'Thunder Bird', isBoss: true },
    ],
  },
  {
    id: 'candy',
    name: '8. Candy World',
    implemented: true,
    stages: [
      { id: 'candy-1', label: 'Candy 1', subtitle: 'Sugar Path', isBoss: false },
      { id: 'candy-2', label: 'Candy 2', subtitle: 'Cookie Hills', isBoss: false },
      { id: 'candy-2b', label: 'Candy 3', subtitle: 'Donut Bridge', isBoss: false },
      { id: 'candy-3', label: 'Candy 4', subtitle: 'Candy King', isBoss: true },
    ],
  },
];

const STAGE_DATA_MAP = {
  ...FOREST_STAGES,
  ...DESERT_STAGES,
  ...SNOW_STAGES,
  ...ROBOT_STAGES,
  ...OCEAN_STAGES,
  ...VOLCANO_STAGES,
  ...SKY_STAGES,
  ...CANDY_STAGES,
};

export function getStageData(stageId) {
  return STAGE_DATA_MAP[stageId] || null;
}

export function getNextPlayableStageId(currentStageId) {
  const all = WORLDS.flatMap((w) =>
    w.stages.map((s) => ({ ...s, implemented: w.implemented }))
  );
  const idx = all.findIndex((s) => s.id === currentStageId);
  if (idx === -1 || idx + 1 >= all.length) return null;
  const next = all[idx + 1];
  return next.implemented ? next.id : null;
}

export function getStageMeta(stageId) {
  for (const w of WORLDS) {
    for (const s of w.stages) {
      if (s.id === stageId) return { ...s, worldName: w.name };
    }
  }
  return null;
}
