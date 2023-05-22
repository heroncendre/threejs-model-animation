import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { EventEmitter } from "./EventEmitter";

export class AssetManager extends EventEmitter {
    constructor(assets) {
        super()

        this.assets = assets

        this.loaders = null
        this.items = null
        this.loadingCount = assets.length
        this.loadedCount = 0

        this.init()
    }

    init() {
        this.items = {}

        this.loaders = {}
        this.loaders.texture = new THREE.TextureLoader()
        this.loaders.gltf = new GLTFLoader()
    }

    startLoading() {
        if (this.assets.length === 0) {
            this.trigger('ready')
            return
        }

        for (const asset of this.assets) {
            if (asset.type.toLowerCase() === "texture") {
                this.loaders.texture.load(asset.path, (texture) => {
                    this.loadComplete(asset, texture)
                })
            }

            else
            if (asset.type.toLowerCase() === "gltf") {
                this.loaders.gltf.load(asset.path, (gltf) => {
                    this.loadComplete(asset, gltf)
                })
            }
        }
    }

    loadComplete(asset, object) {
        this.items[asset.name] = object

        if (++this.loadedCount === this.loadingCount) {
            this.trigger('ready')
        }
    }

    getItemNamesOfType(type) {
        return this.assets.filter(asset => asset.type.toLowerCase() === type.toLowerCase()).map(e => e.name)
    }

    getItem(name) {
        return this.items[name]
    }

    destroy() {
        this.assets = null

        this.loaders.texture = null
        this.loaders.gltf = null
        this.loaders = null

        this.items.length = 0
        this.items = null
    }
}