import { Scene } from "@babylonjs/core";
import {
  IWebXRBpdyTrackingOptions,
  WebXRBodyTracking,
} from "./bodyTracking/WebXRBodyTracking";

export const app = async (scene: Scene): Promise<void> => {
  const xr = await scene.createDefaultXRExperienceAsync({
    uiOptions: {
      sessionMode: "immersive-ar",
      referenceSpaceType: "bounded-floor",
    },
  });
  const { featuresManager, sessionManager } = xr.baseExperience;

  // init body-tracking feature
  const bodyTracking = featuresManager.enableFeature(
    WebXRBodyTracking.Name,
    "latest",
    {
      mirrorZ: true, // swap z-direction
      baseXRSpace: sessionManager.referenceSpace, // base XRSPace
    }
  ) as WebXRBodyTracking;

  // acquire body joints data from event
  bodyTracking.onBodyTrackedObservable.add((joints) => {
    // acquire body joints count
    const jointCount = joints.size;

    // usage of acquire specific joint pose
    const headJoint = joints.get("head");
    if (headJoint) {
      headJoint.position;
      headJoint.rotation;
    }

    // you can iterate joints by for-statement
    for (const [jointName, { position, rotation }] of joints) {
    }
    // or...
    joints.forEach(({ position, rotation }, jointName) => {});
  });

  // you can also use Frame capture loop
  sessionManager.onXRFrameObservable.add(() => {
    if (bodyTracking.size === 0) return;

    const joints = bodyTracking.joints;
  });
};
