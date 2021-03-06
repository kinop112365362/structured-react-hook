// eslint-disable-next-line no-undef
export const combination = {
  // eslint-disable-next-line no-undef
  names: [],
  $find(name, sid) {
    let cName = name
    if (sid) {
      cName = `${name}_${sid}`
    }
    return this[cName]
  },
  $has(storeConfig) {
    const result = this.names.find((name) => {
      if (storeConfig.sid) {
        return name === `${storeConfig.name}_${storeConfig.sid}`
      } else {
        return name === storeConfig.name
      }
    })
    return !!result
  },
  $set(storeConfig, ins) {
    // 原有版本中循环带有 name 字段的组件, 在没有 sid 的情况下, 无法保持对 this 的正确引用
    // 因此对于包含 name 字段, 但没有 sid 字段的循环组件应当不做缓存
    if (storeConfig.name) {
      if (storeConfig.sid) {
        const cName = `${storeConfig.name}_${storeConfig.sid}`
        if (this[cName]) {
          throw new Error(`${cName} 已存在, 检查 sid 是否重复`)
        } else {
          this[cName] = ins
          this.names.push(cName)
        }
      } else {
        console.log(this[storeConfig.name])
        if (this[storeConfig.name]) {
          throw new Error(`${storeConfig.name} 已存在, 检查 name 是否重复`)
        } else {
          this[storeConfig.name] = ins
          this.names.push(storeConfig.name)
        }
      }
    }
  },
}
// export const combination = new Proxy(
//   {},
//   {
//     get(target, p) {
//       if (target[p] === undefined) {
//         throw new Error(`${p} 尚未初始化, 无法联结`)
//       }
//       return target[p][0]
//     },
//     set(target, p, v) {
//       if (target[p] === undefined) {
//         target[p] = []
//         target[p].push(v)
//         // TODO 后续是否需要支持多实例? 更复杂的 event bus?
//       }
//       if (target[p].length > 1) {
//         throw new Error(`${p} 具名 Store 不支持多实例, 请移除 name 属性`)
//       }
//       return v
//     },
//   }
// )
