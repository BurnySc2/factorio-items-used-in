import { allItemNames, generateItemsFrom, idToName, nameToId } from "../constants/helper"
import React, { useState } from "react"

export default function Website(props: any) {
    let [allowSmelting, setAllowSmelting] = useState(false)
    let [inputItems, setInputItems] = useState(Array(20).fill(""))

    let inputHtml = []
    for (let i = 0; i < 20; i++) {
        inputHtml.push(
            <label key={`label${i}`} className={"my-1 mx-4 col-span-2"} htmlFor={`input${i}`}>
                Input {i + 1}
            </label>
        )
        inputHtml.push(
            <input
                className={"bg-blue-200 rounded col-span-3"}
                key={`input${i}`}
                id={`input${i}`}
                list={"items"}
                value={inputItems[i]}
                onChange={(e) => {
                    console.log(e.target.value)
                    setInputItems([
                        ...inputItems.slice(0, i),
                        e.target.value,
                        ...inputItems.slice(i + 1),
                    ])
                }}
            />
        )
    }
    let output = Array.from(
        generateItemsFrom(
            inputItems.map((item) => {
                // @ts-ignore
                return nameToId[item]
            }),
            allowSmelting
        )
    )
    output.sort()
    let outputHtml = output.map((itemName) => {
        return (
            <div className={"bg-blue-200 rounded my-2"} key={itemName}>
                {
                    // @ts-ignore
                    idToName[itemName]
                }
            </div>
        )
    })

    let datalist = (
        <datalist id={"items"}>
            {allItemNames.map((item) => {
                return (
                    <option
                        key={item}
                        value={
                            // @ts-ignore
                            idToName[item]
                        }
                    />
                )
            })}
        </datalist>
    )

    return (
        <div>
            <div className={"text-center"}>
                <a
                    className={"text-center text-lg font-bold hover:bg-blue-300 rounded"}
                    target="_blank"
                    rel="noreferrer"
                    href="https://github.com/BurnySc2/factorio-items-used-in"
                >
                    Source code
                </a>
            </div>
            <div className={"grid grid-cols-2 m-4 gap-x-4"}>
                <div>
                    <div className={"m-auto"}>
                        <div className={"text-xl font-bold"}>Ingredients</div>
                        <input
                            id="allowSmelting"
                            type={"checkbox"}
                            checked={allowSmelting}
                            onChange={(e) => {
                                setAllowSmelting(e.target.checked)
                            }}
                        />
                        <label htmlFor={"allowSmelting"}>Allow smelting?</label>
                    </div>
                    <div className={"grid grid-cols-5 gap-x-2 gap-y-1"}>{inputHtml}</div>
                </div>
                <div>
                    <div className={"text-xl font-bold"}>
                        Items that can be made from ingredients
                    </div>
                    {outputHtml}
                </div>
                {datalist}
            </div>
        </div>
    )
}
