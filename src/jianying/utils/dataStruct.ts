/**
 * 数据结构
 * 完全按照Python版本 dataStruct.py 实现
 */

export type AnimationTypes = "in" | "out" | "group";

/**
 * 资源数据
 */
export class ResourceData {
  public guid: string = "";
  public name: string = "";
  public resourceId: string = "";

  constructor(guid: string = "", name: string = "", resourceId: string = "") {
    this.guid = guid;
    this.name = name;
    this.resourceId = resourceId;
  }
}

/**
 * 延时资源数据
 */
export class DurationResourceData extends ResourceData {
  public start: number = 0;
  public duration: number = 0;

  constructor(
    guid: string = "", 
    resourceId: string = "", 
    duration: number = 0, 
    name: string = "", 
    start: number = 0
  ) {
    super(guid, name, resourceId);
    this.start = start;
    this.duration = duration;
  }
}

/**
 * 特效数据
 */
export class EffectData extends DurationResourceData {
  constructor(guid: string = "", resourceId: string = "", name: string = "") {
    super(guid, resourceId, 0, name, 0);
  }
}

/**
 * 转场数据
 */
export class TransitionData extends DurationResourceData {
  constructor(
    guid: string = "", 
    resourceId: string = "", 
    duration: number = 0, 
    name: string = ""
  ) {
    super(guid, resourceId, duration, name, 0);
  }
}

/**
 * 动画数据
 */
export class AnimationData extends DurationResourceData {
  public animationType: AnimationTypes = "in";

  constructor(
    guid: string = "", 
    resourceId: string = "", 
    duration: number = 0, 
    animationType: AnimationTypes = "in", 
    start: number = 0, 
    name: string = ""
  ) {
    super(guid, resourceId, duration, name, start);
    this.animationType = animationType;
  }
}
