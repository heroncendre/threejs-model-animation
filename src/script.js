// import modules
import * as THREE from 'three'
import { App } from './App'

import './scss/style.scss'

const canvas = document.querySelector('canvas.webgl')
const app = new App(canvas)


document.getElementById("btn-left-up").addEventListener("click", (e) => {
    app.animLeftStairsUp(0)
})

document.getElementById("btn-left-down").addEventListener("click", (e) => {
    app.animLeftStairsDown(0)
})

document.getElementById("btn-right-up").addEventListener("click", (e) => {
    app.animRightStairsUp(0)
})

document.getElementById("btn-right-down").addEventListener("click", (e) => {
    app.animRightStairsDown(0)
})

document.getElementById("btn-left-up-long").addEventListener("click", (e) => {
    app.animLeftStairsUp(1)
})

document.getElementById("btn-left-down-long").addEventListener("click", (e) => {
    app.animLeftStairsDown(1)
})

document.getElementById("btn-right-up-long").addEventListener("click", (e) => {
    app.animRightStairsUp(1)
})

document.getElementById("btn-right-down-long").addEventListener("click", (e) => {
    app.animRightStairsDown(1)
})

document.getElementById("btn-toggle-all").addEventListener("click", (e) => {
    app.toggleAllStairs(0)
})
document.getElementById("btn-toggle-all-long").addEventListener("click", (e) => {
    app.toggleAllStairs(2)
})

