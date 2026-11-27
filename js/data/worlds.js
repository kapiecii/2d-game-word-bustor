// World & Stage Registry (All 4 Worlds x 3 Stages = 12 Stages)

import { FOREST_STAGES } from './stages/forest.js';
import { DESERT_STAGES } from './stages/desert.js';
import { SNOW_STAGES } from './stages/snow.js';
import { ROBOT_STAGES } from './stages/robot.js';

export const WORLDS = [
  {
    id: 'forest',
    name: '1. Forest World',
    implemented: true,
    stages: [
      { id: 'forest-1', label: 'Forest 1', subtitle: 'Green Meadow', isBoss: false },
      { id: 'forest-2', label: 'Forest 2', subtitle: 'Deep Woods', isBoss: false },
      { id: 'forest-3', label: 'Forest 3', subtitle: 'Forest Guardian', isBoss: true },
    ],
  },
  {
    id: 'desert',
    name: '2. Desert World',
    implemented: true,
    stages: [
      { id: 'desert-1', label: 'Desert 1', subtitle: 'Sandy Trail', isBoss: false },
      { id: 'desert-2', label: 'Desert 2', subtitle: 'Canyon Run', isBoss: false },
      { id: 'desert-3', label: 'Desert 3', subtitle: 'Rock Golem', isBoss: true },
    ],
  },
  {
    id: 'snow',
    name: '3. Snow World',
    implemented: true,
    stages: [
      { id: 'snow-1', label: 'Snow 1', subtitle: 'Frost Path', isBoss: false },
      { id: 'snow-2', label: 'Snow 2', subtitle: 'Ice Cave', isBoss: false },
      { id: 'snow-3', label: 'Snow 3', subtitle: 'Ice Machine', isBoss: true },
    ],
  },
  {
    id: 'robot',
    name: '4. Robot World',
    implemented: true,
    stages: [
      { id: 'robot-1', label: 'Robot 1', subtitle: 'Metal Factory', isBoss: false },
      { id: 'robot-2', label: 'Robot 2', subtitle: 'Laser Core', isBoss: false },
      { id: 'robot-3', label: 'Robot 3', subtitle: 'Mega Robot', isBoss: true },
    ],
  },
];

const STAGE_DATA_MAP = {
  ...FOREST_STAGES,
  ...DESERT_STAGES,
  ...SNOW_STAGES,
  ...ROBOT_STAGES,
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
