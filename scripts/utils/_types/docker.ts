export type ensureDockerOptionsType = {
  maxWaitMs?: number
  pollIntervalMs?: number
  dockerDesktopPaths?: string[]
}

export type containerExistsParamsType = {
  name?: string
}

export type dockerLoginParamsType = {
  registry?: string
  username?: string
  password?: string
}


