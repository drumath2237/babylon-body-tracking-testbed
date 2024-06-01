import {
  Observable,
  Quaternion,
  Vector3,
  WebXRAbstractFeature,
  WebXRSessionManager,
} from "@babylonjs/core";

export interface IWebXRBodyJointPose {
  position: Vector3;
  rotation: Quaternion;
}

export interface IWebXRBpdyTrackingOptions {
  baseXRSpace?: XRSpace;
}

export type WebXRBodyJointMap = Map<XRBodyJoint, IWebXRBodyJointPose>;
export type ReadonlyWebXRBodyJointMap = ReadonlyMap<
  XRBodyJoint,
  IWebXRBodyJointPose
>;

export class WebXRBodyTracking extends WebXRAbstractFeature {
  public onBodyTrackedObservable: Observable<ReadonlyWebXRBodyJointMap> =
    new Observable();

  private _joints?: WebXRBodyJointMap;

  public get size(): number | undefined {
    return this._joints?.size;
  }

  public get joints(): ReadonlyWebXRBodyJointMap | undefined {
    return this._joints;
  }

  public constructor(
    _xrSessionManager: WebXRSessionManager,
    private _options: IWebXRBpdyTrackingOptions = {}
  ) {
    super(_xrSessionManager);
    this.xrNativeFeatureName = "body-tracking";
  }

  public get baseSpace(): XRSpace | undefined {
    return this._options.baseXRSpace;
  }

  public setBaseSpace(baseSpace: XRSpace): void {
    this._options.baseXRSpace = baseSpace;
  }

  protected _onXRFrame(_xrFrame: XRFrame): void {
    throw new Error("Method not implemented.");
  }
}
