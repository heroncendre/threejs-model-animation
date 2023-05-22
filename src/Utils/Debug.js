import * as dat from 'lil-gui'

import { App } from '../App'

export class Debug {
    constructor() {

        this.active = window.location.hash === '#debug'

        this.app = null

        this.ui = null

        if (this.active) {
            this.init()
        }
    }

    init() {
        this.app = new App()
        window.app = this.app

        this.ui = new dat.GUI({
            width: 350
        })
    }

    closeUI() {
        if (this.ui !== null) {
            this.ui.close()
        }
    }

    update() {

    }

    destroy() {
        this.ui.destroy()
        this.ui = null

        this.app = null
    }
}