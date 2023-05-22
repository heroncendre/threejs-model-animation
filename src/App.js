import { Camera } from './Core/Camera.js'
import { Renderer } from './Core/Renderer.js'
import { AnimationLoop } from './Utils/AnimationLoop.js'
import { RenderSize } from './Utils/RenderSize.js'
import { AssetManager } from './Utils/AssetManager.js'
import assets from "./assets.js"
import { Debug } from './Utils/Debug.js'

import * as THREE from 'three'

let instance = null

export class App {
    constructor(canvas) {
        if (instance !== null) {
            return instance
        }
        instance = this
        window.app = this

        this.canvas = canvas
        this.stairs = null

        this.renderSize = new RenderSize()
        this.renderer = new Renderer()
        this.camera = new Camera(true)
        this.camera.instance.position.z = 20

        this.animMixer = null

        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0xffffff)

        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        this.scene.add(ambientLight)

        const dirLight = new THREE.DirectionalLight(0xffffff, 1)
        this.scene.add(dirLight)

        this.animationLoop = new AnimationLoop()
        this.updateBound = this.update.bind(this)
        this.animationLoop.on('update', this.updateBound)

        this.assetManagerReadyHandlerBound = this.assetManagerReadyHandler.bind(this)
        this.assetManager = new AssetManager(assets)
        this.assetManager.on('ready', this.assetManagerReadyHandlerBound)
        this.assetManager.startLoading()
    }

    assetManagerReadyHandler(info) {
        this.stairs = this.assetManager.items.stairs

        this.animMixer = new THREE.AnimationMixer(this.stairs.scene)

        this.stairs.animations.forEach(clip => {
            const clipAction = this.animMixer.clipAction(clip)
            clipAction.setLoop(THREE.LoopOnce)
            clipAction.clampWhenFinished = true
            clipAction.time = this.getAnimKeyframes().up
        })

        this.scene.add(this.stairs.scene)

        this.animationLoop.start()
    }

    leftStairsClipAction() {
        return this.animMixer.clipAction(THREE.AnimationClip.findByName(this.stairs.animations, 'Key.003Action'))
    }

    rightStairsClipAction() {
        return this.animMixer.clipAction(THREE.AnimationClip.findByName(this.stairs.animations, 'Key.004Action'))
    }

    getAnimKeyframes() {
        const left = this.leftStairsClipAction()
        const right = this.rightStairsClipAction()

        const clip = left.getClip()
        const mainTrack = clip.tracks[0]
        const times = mainTrack.times

        return {
            up: times[times.length -1],
            down: times[0]
        }
    }

    animStairs(clipAction, animDirection, duration) {
        duration = typeof duration === 'number' ? duration : 0

        const keyframes = this.getAnimKeyframes()
        console.log(`Animation keys : [up : ${keyframes.up}, down : ${keyframes.down}]`)

        clipAction.reset()
        clipAction.play()

        clipAction.timeScale = duration === 0 ? 0 : clipAction.getClip().duration / duration
        console.log(`clip action time scale: ${clipAction.timeScale}`)

        const finishHandler = (e) => {
            console.log(`Stair ${clipAction.getClip().name} -> ${animDirection} - complete (time ${this.animMixer.time})`)
            this.animMixer.removeEventListener("finished", finishHandler)
        }

        if (animDirection === "up") {
            clipAction.time = duration === 0 ? keyframes.up : keyframes.down
            clipAction.timeScale = Math.abs(clipAction.timeScale)
            this.animMixer.addEventListener("finished", finishHandler)
        }

        else if (animDirection === "down") {
            clipAction.time = duration === 0 ? keyframes.down : keyframes.up
            clipAction.timeScale = -Math.abs(clipAction.timeScale)
            this.animMixer.addEventListener("finished", finishHandler)
        }
    }

    animLeftStairsUp(duration) {
        this.animStairs(this.leftStairsClipAction(), 'up', duration)
    }

    animLeftStairsDown(duration) {
        this.animStairs(this.leftStairsClipAction(), 'down', duration)
    }

    animRightStairsUp(duration) {
        this.animStairs(this.rightStairsClipAction(), 'up', duration)
    }

    animRightStairsDown(duration) {
        this.animStairs(this.rightStairsClipAction(), 'down', duration)
    }

    toggleAllStairs(duration) {
        duration = typeof duration === 'number' ? duration : 0

        const left = this.leftStairsClipAction()
        const right = this.rightStairsClipAction()
        const keyframes = this.getAnimKeyframes()

        this.animStairs(left, left.time === keyframes.up ? "down" : "up", duration)
        this.animStairs(right, right.time === keyframes.up ? "down" : "up", duration)
    }

    update(info) {
        this.animMixer.update(info.delta)
        this.renderer.render(this.scene, this.camera.instance)
    }

    destroy() {
        this.animationLoop.off('update')
        this.updateBound = null

        this.assetManager.off('ready')
        this.assetManagerReadyHandlerBound = null

        this.scene.traverse((node) => {
            if (node.isMesh) {
                node.geometry.dispose()
                // node.material.map.dispose()
                node.material.dispose()
            }
        })

        this.assetManager.destroy()
        this.assetManager = null

        this.animMixer = null
    }
}