import { Camera } from './Core/Camera.js'
import { Renderer } from './Core/Renderer.js'
import { AnimationLoop } from './Utils/AnimationLoop.js'
import { RenderSize } from './Utils/RenderSize.js'
import { AssetManager } from './Utils/AssetManager.js'
import assets from "./assets.js"
import { Debug } from './Utils/Debug.js'

import * as THREE from 'three'
import { Stairs } from './World/Stairs.js'

let instance = null

export class App {
    constructor(canvas) {
        if (instance !== null) {
            return instance
        }
        instance = this

        this.canvas = canvas

        this.debug = new Debug(true)

        this.renderSize = new RenderSize()
        this.renderer = new Renderer()

        this.camera = new Camera(true)
        this.camera.instance.position.z = 20

        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0xffffff)

        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        this.scene.add(ambientLight)

        const dirLight = new THREE.DirectionalLight(0xffffff, 1)
        this.scene.add(dirLight)

        this.stairs = null

        this.animationLoop = new AnimationLoop()
        this.updateBound = this.update.bind(this)
        this.animationLoop.on('update', this.updateBound)

        this.assetManagerReadyHandlerBound = this.assetManagerReadyHandler.bind(this)
        this.assetManager = new AssetManager(assets)
        this.assetManager.on('ready', this.assetManagerReadyHandlerBound)
        this.assetManager.startLoading()
    }

    assetManagerReadyHandler(info) {
        this.stairs = new Stairs(this.assetManager.items.stairs)
        this.scene.add(this.stairs.scene)

        this.animationLoop.start()
    }

    update(info) {
        this.stairs.update(info)

        this.renderer.render(this.scene, this.camera.instance)
    }

    destroy() {
        this.animationLoop.off('update')
        this.updateBound = null

        this.animationLoop.destroy()
        this.animationLoop = null

        this.assetManager.off('ready')
        this.assetManagerReadyHandlerBound = null

        this.assetManager.destroy()
        this.assetManager = null

        this.scene.traverse((node) => {
            if (node.isMesh) {
                node.geometry.dispose()
                // node.material.map.dispose()
                node.material.dispose()
            }
        })

        this.scene = null

        this.stairs.destroy()
        this.stairs = null

        this.debug = null

        this.renderSize.destroy()
        this.renderSize = null

        this.renderer.destroy()
        this.renderer = null

        this.camera.destroy()
        this.camera = null
    }
}