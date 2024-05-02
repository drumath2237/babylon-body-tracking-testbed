import { Engine, MeshBuilder, Scene, Vector3 } from "@babylonjs/core";
import "./style.css";

const main = async () => {
  const renderCanvas =
    document.querySelector<HTMLCanvasElement>("#renderCanvas");
  if (!renderCanvas) {
    return;
  }

  const engine = new Engine(renderCanvas);
  const scene = new Scene(engine);

  scene.createDefaultCameraOrLight(true, true, true);

  const box = MeshBuilder.CreateBox("box", { size: 0.1 });
  box.position = new Vector3(0, 0, 0.3);

  const xr = await scene.createDefaultXRExperienceAsync({
    uiOptions: {
      sessionMode: "immersive-ar",
      referenceSpaceType: "local",
    },
    optionalFeatures: ["body-tracking"],
  });

  const sessionManager = xr.baseExperience.sessionManager;

  sessionManager.onXRFrameObservable.add((frame) => {
    const xrFrame = frame as any;
    if (!xrFrame.body) {
      return;
    }

    for (let j of xrFrame.body) {
      const bodySpace = j[1];
      const pose = frame.getPose(bodySpace, sessionManager.referenceSpace);
      // @ts-ignore
      const pos = pose?.transform;
    }
  });

  window.addEventListener("resize", () => engine.resize());
  engine.runRenderLoop(() => scene.render());
};

main();

