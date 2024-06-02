# Babylon.js WebXR Body Tracking Testbed

[![Deploy](https://github.com/drumath2237/babylon-body-tracking-testbed/actions/workflows/deploy.yml/badge.svg)](https://github.com/drumath2237/babylon-body-tracking-testbed/actions/workflows/deploy.yml)

https://github.com/drumath2237/babylon-body-tracking-testbed/assets/11372210/d4ac4dcb-dd70-4fa1-adb9-44b938b8226b

## About

An experiment for implementing Babylon.js WebXR Body Tracking Feature.

## Environment

- Meta Quest v65.0.0.546.596219110
- Quest Browser 33.2.0.74.167.602488549
- Babylon.js 7.3.1

## Usage

```bash
# install dependencies
pnpm install

# start dev server
pnpm dev

# build projects
pnpm build
```

> [!IMPORTANT]
> You need to enable WebXR Experiments flag on Quest Browser (for body-tracking).
> To do this, access chrome://flags and serach "webxr" in serch bar.

[>> Demo Page <<](https://drumath2237.github.io/babylon-body-tracking-testbed/)

## API Spec

```ts
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
```

## Author

@drumath2237

