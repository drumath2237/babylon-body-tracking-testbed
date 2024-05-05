import {
  MeshBuilder,
  Quaternion,
  Scene,
  TransformNode,
  Vector3,
} from "@babylonjs/core";

export const app = async (scene: Scene): Promise<void> => {
  const xr = await scene.createDefaultXRExperienceAsync({
    uiOptions: {
      sessionMode: "immersive-ar",
      referenceSpaceType: "bounded-floor",
    },
    optionalFeatures: ["body-tracking"],
  });

  let jointsObjects: TransformNode[] | null = null;

  const sessionManager = xr.baseExperience.sessionManager;
  sessionManager.onXRFrameObservable.add((frame) => {
    if (!frame.body) {
      return;
    }

    const xrBody = frame.body;
    if (
      jointsObjects == null ||
      (jointsObjects as TransformNode[]).length != xrBody.size
    ) {
      jointsObjects = new Array<TransformNode>(xrBody.size);
      for (let i = 0; i < xrBody.size; i++) {
        jointsObjects[i] = MeshBuilder.CreateBox(`joint_${i}`, { size: 0.02 });
      }
    }

    let jointIndex = 0;
    for (let j of frame.body) {
      const bodySpace = j[1];
      const pose = frame.getPose(bodySpace, sessionManager.referenceSpace);
      if (!pose) {
        jointIndex++;
        continue;
      }

      const transform = pose.transform;

      jointsObjects[jointIndex].position = DOMPointToVec3(transform.position);
      jointsObjects[jointIndex].rotationQuaternion = DOMPointToQuaternion(
        transform.orientation
      );

      jointIndex++;
    }
  });
};

const DOMPointToVec3 = (pos: DOMPointReadOnly, mirrorZ?: boolean): Vector3 => {
  return mirrorZ
    ? new Vector3(pos.x, pos.y, -pos.z)
    : new Vector3(pos.x, pos.y, pos.z);
};

const DOMPointToQuaternion = (
  rot: DOMPointReadOnly,
  mirrorZ?: boolean
): Quaternion => {
  return mirrorZ
    ? new Quaternion(-rot.x, -rot.y, rot.z, rot.w)
    : new Quaternion(rot.x, rot.y, rot.z, rot.w);
};
