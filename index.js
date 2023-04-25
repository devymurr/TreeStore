var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var TreeStore = /** @class */ (function () {
    function TreeStore(items) {
        var _this = this;
        this._itemsMap = new Map();
        this._parentMap = new Map();
        this._items = items;
        items.forEach(function (item) {
            _this._itemsMap.set(item.id, item);
            _this._parentMap.set(item.parent, __spreadArray(__spreadArray([], (_this._parentMap.get(item.parent) || []), true), [
                item,
            ], false));
        });
    }
    TreeStore.prototype.getAll = function () {
        return this._items;
    };
    TreeStore.prototype.getItem = function (id) {
        return this._itemsMap.get(id);
    };
    TreeStore.prototype.getChildren = function (id) {
        return this._parentMap.get(id) || [];
    };
    TreeStore.prototype.getAllChildren = function (id) {
        var rootChildren = this.getChildren(id);
        var root = this.getItem(id);
        var allChildren = root ? __spreadArray([root], rootChildren, true) : [];
        var stack = __spreadArray([], rootChildren, true);
        while (stack.length) {
            var item = stack.pop();
            if (this._parentMap.has(item.id)) {
                var children = this._parentMap.get(item.id);
                if (children === null || children === void 0 ? void 0 : children.length) {
                    stack.push.apply(stack, children);
                    allChildren.push.apply(allChildren, children);
                }
            }
        }
        return allChildren;
    };
    TreeStore.prototype.getAllParents = function (id) {
        var node = this.getItem(id);
        var parents = [];
        while (node) {
            parents.push(node);
            node = this.getItem(node === null || node === void 0 ? void 0 : node.parent);
        }
        return parents;
    };
    return TreeStore;
}());
var items = [
    { id: 1, parent: 'root' },
    { id: 2, parent: 1, type: 'test' },
    { id: 3, parent: 1, type: 'test' },
    { id: 4, parent: 2, type: 'test' },
    { id: 5, parent: 2, type: 'test' },
    { id: 6, parent: 2, type: 'test' },
    { id: 7, parent: 4, type: null },
    { id: 8, parent: 4, type: null },
];
var ts = new TreeStore(items);
// --- test
console.log(ts.getAllChildren(1));
