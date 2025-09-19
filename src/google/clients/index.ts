import Veo from './veo.client'
import Imagen from './imagen.client'
import Lyria from './lyria.client'

type Ctor<T = object> = new (...args: any[]) => T

export function mixinClass<TBase extends Ctor>(Base: TBase) {
  return class extends Base {
    veo: Veo
    imagen: Imagen
    lyria: Lyria
    constructor(...args: any[]) {
      super(...args)
      const apiKey = args[0] as string
      this.veo = new Veo(apiKey)
      this.imagen = new Imagen(apiKey)
      this.lyria = new Lyria(apiKey)
    }
  }
}

class Base { constructor(..._args: any[]) {} }

const Mixed = mixinClass(Base)

function mergePublicMembers(target: any, source: any) {
  if (!source || !target)
    return
  for (const key of Object.keys(source)) {
    if (key in target)
      continue
    const desc = Object.getOwnPropertyDescriptor(source, key)
    if (desc)
      Object.defineProperty(target, key, desc)
  }
  const proto = Object.getPrototypeOf(source)
  if (!proto)
    return
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key === 'constructor')
      continue
    if (key in target)
      continue
    const desc = Object.getOwnPropertyDescriptor(proto, key)
    if (!desc)
      continue
    if (typeof desc.value === 'function') {
      Object.defineProperty(target, key, {
        value: desc.value.bind(source),
        writable: false,
        enumerable: false,
        configurable: true,
      })
    }
    else {
      Object.defineProperty(target, key, desc)
    }
  }
}

export default function createGoogleModels(apiKey: string) {
  const inst = new Mixed(apiKey) as InstanceType<typeof Mixed> & Veo & Imagen & Lyria
  mergePublicMembers(inst, inst.veo)
  mergePublicMembers(inst, inst.imagen)
  mergePublicMembers(inst, inst.lyria)
  return inst
}

export { Imagen, Lyria, Veo }


