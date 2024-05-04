import { Scene } from "@babylonjs/core";

export const app = async (scene: Scene): Promise<void> => {
  const xr = await scene.createDefaultXRExperienceAsync({
    uiOptions: {
      sessionMode: "immersive-ar",
      referenceSpaceType: "local",
    },
    optionalFeatures: ["body-tracking"],
  });

  const sessionManager = xr.baseExperience.sessionManager;
  sessionManager.onXRFrameObservable.add((frame) => {
    if (!frame.body) {
      return;
    }

    for (let j of frame.body) {
      const bodySpace = j[1];
      const pose = frame.getPose(bodySpace, sessionManager.referenceSpace);
      // @ts-ignore
      const pos = pose?.transform;
    }
  });
};
