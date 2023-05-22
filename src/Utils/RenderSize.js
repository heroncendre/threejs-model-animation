import { EventEmitter } from "./EventEmitter"


export class RenderSize extends EventEmitter {

    constructor() {
        super()

        /**
         * Render size properties
         */
        this.width = 0
        this.height = 0
        this.aspect = 1
        this.pixelRatio = 0
        this.mobile = false

        /**
         * Bound event handlers
         */
        this.onResizeHandler = this.resizeHandler.bind(this)

        this.init()
    }

    resetInnerValues() {
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.aspect = this.width / this.height
        this.pixelRatio = Math.min(2, window.devicePixelRatio)

        this.mobile = this.width < 800

    }

    init() {
        this.resetInnerValues()
        window.addEventListener('resize', this.onResizeHandler)
    }

    resizeHandler() {
        this.resetInnerValues()

        this.trigger('resize', [{
            width: this.width,
            height: this.height,
            aspect: this.aspect,
            pixelRatio: this.pixelRatio,
            mobile: this.mobile
        }])
    }

    destroy() {
        window.removeEventListener('resize', this.onResizeHandler)
        this.onResizeHandler = null
    }
}