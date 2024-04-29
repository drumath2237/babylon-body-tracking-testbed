import { Engine, MeshBuilder, Scene } from "@babylonjs/core";
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

  MeshBuilder.CreateBox("box", { size: 0.2 });

  await scene.createDefaultXRExperienceAsync({
    uiOptions: { sessionMode: "immersive-ar", referenceSpaceType: "unbounded" },
  });

  window.addEventListener("resize", () => engine.resize());
  engine.runRenderLoop(() => scene.render());
};

main();

