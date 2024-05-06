import { WebXRAbstractFeature } from "@babylonjs/core";

export class WebXRBodyTracking extends WebXRAbstractFeature {
  protected _onXRFrame(_xrFrame: XRFrame): void {
    throw new Error("Method not implemented.");
  }
}
