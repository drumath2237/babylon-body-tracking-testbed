import { MeshBuilder, Scene, TransformNode } from "@babylonjs/core";
import {
  IWebXRBpdyTrackingOptions,
  WebXRBodyTracking,
  WebXRFeatureNameExt,
} from "./bodyTracking/WebXRBodyTracking";

export const app = async (scene: Scene): Promise<void> => {
  const xr = await scene.createDefaultXRExperienceAsync({
    uiOptions: {
      sessionMode: "immersive-ar",
      referenceSpaceType: "bounded-floor",
    },
  });
  const { featuresManager /*sessionManager*/ } = xr.baseExperience;

  const bodyTracking = featuresManager.enableFeature(
    WebXRFeatureNameExt.BODY_TRACKING,
    "latest",
    { mirrorZ: true } as IWebXRBpdyTrackingOptions
  ) as WebXRBodyTracking;

  let jointsObjects: TransformNode[] = [];

  bodyTracking.onBodyTrackedObservable.add((joints) => {
    if (jointsObjects.length !== joints.size) {
      jointsObjects.splice(0);
      for (let i = 0; i < joints.size; i++) {
        jointsObjects.push(MeshBuilder.CreateBox(`joint${i}`, { size: 0.02 }));
      }
    }

    bodyTracking.mirrorZ = false;

    let i = 0;
    for (const [, pose] of joints) {
      jointsObjects[i].position = pose.position;
      jointsObjects[i].rotationQuaternion = pose.rotation;
      i++;
    }
  });

  // const sessionManager = xr.baseExperience.sessionManager;
  // sessionManager.onXRFrameObservable.add(() => {
  //   if (bodyTracking.size === 0) {
  //     return;
  //   }

  //   if (jointsObjects.length !== bodyTracking.size) {
  //     jointsObjects.splice(0);
  //     for (let i = 0; i < bodyTracking.size; i++) {
  //       jointsObjects.push(MeshBuilder.CreateBox(`joint${i}`, { size: 0.02 }));
  //     }
  //   }

  //   let i = 0;
  //   for (const [, pose] of bodyTracking.joints) {
  //     jointsObjects[i].position = pose.position;
  //     jointsObjects[i].rotationQuaternion = pose.rotation;
  //     i++;
  //   }
  // });
};
