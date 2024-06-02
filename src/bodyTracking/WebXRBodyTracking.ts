import {
  Observable,
  Quaternion,
  Vector3,
  WebXRAbstractFeature,
  WebXRFeatureName,
  WebXRFeaturesManager,
  WebXRSessionManager,
} from "@babylonjs/core";

export class WebXRFeatureNameExt extends WebXRFeatureName {
  public static readonly BODY_TRACKING = "xr-body-tracking";
}

export interface IWebXRBodyJointPose {
  position: Vector3;
  rotation: Quaternion;
}

export interface IWebXRBpdyTrackingOptions {
  baseXRSpace?: XRSpace;
  mirrorZ?: boolean;
}

type WebXRBodyJointMap = Map<XRBodyJoint, IWebXRBodyJointPose>;
export type ReadonlyWebXRBodyJointMap = ReadonlyMap<
  XRBodyJoint,
  IWebXRBodyJointPose
>;

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

export class WebXRBodyTracking extends WebXRAbstractFeature {
  public onBodyTrackedObservable: Observable<ReadonlyWebXRBodyJointMap> =
    new Observable();

  private _joints: WebXRBodyJointMap;

  public get size(): number | undefined {
    return this._joints?.size;
  }

  public get joints(): ReadonlyWebXRBodyJointMap | undefined {
    return this._joints;
  }

  public get baseSpace(): XRSpace | undefined {
    return this._options.baseXRSpace;
  }

  public set baseSpace(baseSpace: XRSpace) {
    this._options.baseXRSpace = baseSpace;
  }

  public get mirrorZ(): boolean {
    if (!this._options?.mirrorZ) {
      return false;
    }

    return this._options.mirrorZ;
  }

  public set mirrorZ(value: boolean) {
    this._options.mirrorZ = value;
  }

  public static readonly Name = WebXRFeatureNameExt.BODY_TRACKING;

  public static readonly Version = 1;

  public constructor(
    _xrSessionManager: WebXRSessionManager,
    private _options: IWebXRBpdyTrackingOptions = {}
  ) {
    super(_xrSessionManager);
    this.xrNativeFeatureName = "body-tracking";
    this._joints = new Map<XRBodyJoint, IWebXRBodyJointPose>();
  }

  protected _onXRFrame(_xrFrame: XRFrame): void {
    const body = _xrFrame.body;
    if (!body) {
      return;
    }

    this._joints.clear();

    for (const [j, bodySpace] of body) {
      const baseSpace = this.baseSpace ?? this._xrSessionManager.referenceSpace;
      const jointPose = _xrFrame.getPose(bodySpace, baseSpace);
      const transform = jointPose?.transform;
      if (!transform) {
        continue;
      }

      const position = DOMPointToVec3(transform.position, this.mirrorZ);
      const rotation = DOMPointToQuaternion(
        transform.orientation,
        this.mirrorZ
      );

      this._joints.set(j, { position, rotation });
    }

    if (this._joints.size !== 0) {
      this.onBodyTrackedObservable.notifyObservers(this._joints);
    }
  }

  public override dispose(): void {
    this._joints.clear();
    this.onBodyTrackedObservable.clear();
  }
}

// register the plugin
WebXRFeaturesManager.AddWebXRFeature(
  WebXRBodyTracking.Name,
  (xrSessionManager, options: IWebXRBpdyTrackingOptions) => () =>
    new WebXRBodyTracking(xrSessionManager, options),
  WebXRBodyTracking.Version,
  false
);
