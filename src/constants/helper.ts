import itemList from "./itemlist.json"

export let allItemNames = itemList.map((item) => {
    return item.id
})

export let recipes = itemList
    .map((item) => {
        let ingredients = new Set()
        if (item.recipe.ingredients.length > 0) {
            item.recipe.ingredients.forEach((ingredient) => {
                ingredients.add(ingredient.id)
            })
            return { [item.id]: ingredients }
        }
        return null
    })
    .filter((item) => {
        return item
    })

function union(setA: Set<string>, setB: Set<string>): Set<string> {
    let _union = new Set(setA)
    for (let elem of setB) {
        _union.add(elem)
    }
    return _union
}

function isSuperset(set: Set<string>, subset: Set<string>): boolean {
    for (let elem of subset) {
        if (!set.has(elem)) {
            return false
        }
    }
    return true
}

let smeltItems = new Set(["iron-plate", "steel-plate", "copper-plate", "stone-brick"])

export let generateItemsFrom = (availableItems: string[], allowSmelting = false): string[] => {
    let availableItemsSet = new Set(availableItems)
    let newItems: Set<string> = new Set()
    let oldLength = newItems.size
    let iteration = 0
    while (iteration === 0 || newItems.size !== oldLength) {
        iteration += 1
        oldLength = newItems.size
        availableItemsSet = union(availableItemsSet, newItems)
        // eslint-disable-next-line no-loop-func
        recipes.forEach((item) => {
            // @ts-ignore
            let key: string = Object.keys(item)[0]
            if (!allowSmelting && smeltItems.has(key)) {
                return
            }
            // @ts-ignore
            let value: Set<string> = item[key]
            if (isSuperset(availableItemsSet, value)) {
                newItems.add(key)
            }
        })
    }
    return [...newItems]
}
