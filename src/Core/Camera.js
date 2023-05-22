import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { App } from '../App'
import { EventEmitter } from '../Utils/EventEmitter'

export class Camera extends EventEmitter {
    constructor(controllable) {
        super()
        
        this.controllable = controllable

        this.app = null
        this.instance = null
        this.controls = null
        
        this.resizeHandlerBound = this.resizeHandler.bind(this)
        
        this.init()
    }
    
    init() {
        this.app = new App()
        
        this.instance = new THREE.PerspectiveCamera(30, this.app.renderSize.aspect, 0.1, 1000)

        if (this.controllable === true) {
            this.controls = new OrbitControls(this.instance, this.app.canvas)
        }

        this.app.renderSize.on('resize', this.resizeHandlerBound)
    }

    resizeHandler(info) {
        this.instance.aspect = info.aspect
        this.instance.updateProjectionMatrix()
    }

    destroy() {
        this.app.renderSize.off('resize')
        this.resizeHandlerBound = null

        this.controls.dispose()
        this.controls = null

        this.instance = null

        this.app = null
    }
}