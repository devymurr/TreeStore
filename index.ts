class TreeStore implements TreeStoreFactory {
  readonly _items: Item[]
  readonly _itemsMap: Map<ID, Item> = new Map()
  readonly _parentMap: Map<ID, Item[]> = new Map()

  constructor(items: Item[]) {
    this._items = items

    items.forEach((item) => {
      this._itemsMap.set(item.id, item)
      this._parentMap.set(item.parent, [
        ...(this._parentMap.get(item.parent) || []),
        item,
      ])
    })
  }
  getAll() {
    return this._items
  }

  getItem(id: ID) {
    return this._itemsMap.get(id)
  }

  getChildren(id: ID) {
    return this._parentMap.get(id) || []
  }

  getAllChildren(id: ID) {
    const rootChildren = this.getChildren(id)
    const root = this.getItem(id)
    const allChildren = root ? [root, ...rootChildren] : []

    const stack = [...rootChildren]

    while (stack.length) {
      const item = stack.pop()
      if (this._parentMap.has(item!.id)) {
        const children = this._parentMap.get(item!.id)
        if (children?.length) {
          stack.push(...children)
          allChildren.push(...children)
        }
      }
    }

    return allChildren
  }

  getAllParents(id: ID) {
    let node = this.getItem(id)
    const parents: Item[] = []

    while (node) {
      parents.push(node)
      node = this.getItem(node?.parent)
    }

    return parents
  }
}

const items = [
  { id: 1, parent: 'root' },
  { id: 2, parent: 1, type: 'test' },
  { id: 3, parent: 1, type: 'test' },

  { id: 4, parent: 2, type: 'test' },
  { id: 5, parent: 2, type: 'test' },
  { id: 6, parent: 2, type: 'test' },

  { id: 7, parent: 4, type: null },
  { id: 8, parent: 4, type: null },
]
const ts = new TreeStore(items)

// --- test
console.log(ts.getAllChildren(1))

// ---- typing
type ID = number | string
type Nullable<T> = T | null | undefined
type Item = {
  id: ID
  parent: ID
  type?: any
}
interface TreeStoreFactory {
  _items: Item[]
  getAll: () => Item[]
  getItem: (id: ID) => Nullable<Item>
  getChildren: (id: ID) => Array<Item | null>
  getAllChildren: (id: ID) => Item[]
  getAllParents: (id: ID) => Item[]
}
