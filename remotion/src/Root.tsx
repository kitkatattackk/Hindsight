import React from 'react';
import { Composition, Folder } from 'remotion';
import { HindsightDemo } from './HindsightDemo';
import { SceneIntro } from './SceneIntro';
import { SceneRitual } from './SceneRitual';
import { SceneDashboard } from './SceneDashboard';
import { SceneJournal } from './SceneJournal';
import { SceneCTA } from './SceneCTA';

// Scene durations (frames @ 60fps)
// Intro:180 + Ritual:480 + Dashboard:360 + Journal:240 + CTA:180
// Transitions: 4 × 36 = 144
// Total: 1440 - 144 = 1296
const DEMO_DURATION = 1296;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HindsightDemo"
        component={HindsightDemo}
        durationInFrames={DEMO_DURATION}
        fps={60}
        width={1080}
        height={1920}
      />

      <Folder name="Scenes">
        <Composition id="Intro"     component={SceneIntro}     durationInFrames={180} fps={60} width={1080} height={1920} />
        <Composition id="Ritual"    component={SceneRitual}    durationInFrames={480} fps={60} width={1080} height={1920} />
        <Composition id="Dashboard" component={SceneDashboard} durationInFrames={360} fps={60} width={1080} height={1920} />
        <Composition id="Journal"   component={SceneJournal}   durationInFrames={240} fps={60} width={1080} height={1920} />
        <Composition id="CTA"       component={SceneCTA}       durationInFrames={180} fps={60} width={1080} height={1920} />
      </Folder>
    </>
  );
};
