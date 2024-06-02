import {
  Matrix,
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
  mirrorZ?: boolean;
}

export type WebXRBodyJointMap = Map<XRBodyJoint, IWebXRBodyJointPose>;
export type ReadonlyWebXRBodyJointMap = ReadonlyMap<
  XRBodyJoint,
  IWebXRBodyJointPose
>;

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

  public setBaseSpace(baseSpace: XRSpace): void {
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

      const position = WebXRBodyTracking.DOMPointToVec3(
        transform.position,
        this.mirrorZ
      );
      const rotation = WebXRBodyTracking.DOMPointToQuaternion(
        transform.orientation,
        this.mirrorZ
      );

      this._joints.set(j, { position, rotation });
    }
  }

  private static DOMPointToVec3 = (
    pos: DOMPointReadOnly,
    mirrorZ?: boolean
  ): Vector3 => {
    return mirrorZ
      ? new Vector3(pos.x, pos.y, -pos.z)
      : new Vector3(pos.x, pos.y, pos.z);
  };

  private static DOMPointToQuaternion = (
    rot: DOMPointReadOnly,
    mirrorZ?: boolean
  ): Quaternion => {
    return mirrorZ
      ? new Quaternion(-rot.x, -rot.y, rot.z, rot.w)
      : new Quaternion(rot.x, rot.y, rot.z, rot.w);
  };
}
