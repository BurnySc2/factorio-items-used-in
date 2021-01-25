// From: https://github.com/KirkMcDonald/kirkmcdonald.github.io/blob/master/data/vanilla-1.0.0.json
import itemList from "./itemlist.json"
let _recipes: any[] = []
Object.keys(itemList.recipes).forEach((key) => {
    // @ts-ignore
    let value = itemList.recipes[key]
    _recipes.push(value)
})

export let allItemNames = _recipes.map((item) => {
    return item.name
})
export let idToName = {}
_recipes.forEach((item) => {
    // @ts-ignore
    idToName[item.name] = item.localized_name.en
})
export let nameToId = {}
_recipes.forEach((item) => {
    // @ts-ignore
    nameToId[item.localized_name.en] = item.name
})

let smeltItemsArray: string[] = []
_recipes.forEach((recipe) => {
    if (recipe.category === "smelting") {
        smeltItemsArray.push(recipe.name)
    }
})

let smeltItems = new Set(smeltItemsArray)
// let smeltItems = new Set(["iron-plate", "steel-plate", "copper-plate", "stone-brick"])

export let recipes = _recipes
    .map((item) => {
        let ingredients = new Set()
        if (item.ingredients.length > 0) {
            item.ingredients.forEach((ingredient: { name: unknown }) => {
                ingredients.add(ingredient.name)
            })
            return { [item.name]: ingredients }
        }
        return null
    })
    .filter((item) => {
        return item
    })

let union = (setA: Set<string>, setB: Set<string>): Set<string> => {
    let _union = new Set(setA)
    for (let elem of setB) {
        _union.add(elem)
    }
    return _union
}

let isSuperset = (set: Set<string>, subset: Set<string>): boolean => {
    for (let elem of subset) {
        if (!set.has(elem)) {
            return false
        }
    }
    return true
}

export let difference = (setA: Set<string>, setB: Set<string>): Set<string> => {
    let _difference = new Set(setA)
    for (let elem of setB) {
        _difference.delete(elem)
    }
    return _difference
}

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
