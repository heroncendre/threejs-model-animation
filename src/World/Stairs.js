import * as THREE from 'three'

import { EventEmitter } from "../Utils/EventEmitter";
import { App } from '../App';

export class Stairs extends EventEmitter {
    constructor(model) {
        super()

        this.app = new App()

        this.model = model
        this.scene = model.scene

        this.leftStairsClipAction = null
        this.rightStairsClipAction = null

        this.keyframeUp = 0
        this.keyframeDown = 0

        this.animMixer = null

        this.init()
        this.initControls()
    }

    init() {
        this.animMixer = new THREE.AnimationMixer(this.scene)

        const leftClip = THREE.AnimationClip.findByName(this.model.animations, 'Key.003Action')
        this.leftStairsClipAction = this.animMixer.clipAction(leftClip)

        const rightClip = THREE.AnimationClip.findByName(this.model.animations, 'Key.004Action')
        this.rightStairsClipAction = this.animMixer.clipAction(rightClip)

        const mainTrack = leftClip.tracks[0]
        const times = mainTrack.times

        this.keyframeUp = times[times.length -1]
        this.keyframeDown = times[0]

        this.model.animations.forEach(clip => {
            const clipAction = this.animMixer.clipAction(clip)
            clipAction.setLoop(THREE.LoopOnce)
            clipAction.clampWhenFinished = true
            clipAction.time = this.keyframeUp
        })
    }

    initControls() {
        if (this.app.debug === null) {
            return
        }

        const controls = {
            leftUp : () => {
                this.animStairs(this.leftStairsClipAction, 'up', 0)
            },
            leftUpLong : () => {
                this.animStairs(this.leftStairsClipAction, 'up', 1)
            },
            leftDown : () => {
                this.animStairs(this.leftStairsClipAction, 'down', 0)
            },
            leftDownLong : () => {
                this.animStairs(this.leftStairsClipAction, 'down', 1)
            },

            rightUp : () => {
                this.animStairs(this.rightStairsClipAction, 'up', 0)
            },
            rightUpLong : () => {
                this.animStairs(this.rightStairsClipAction, 'up', 1)
            },
            rightDown : () => {
                this.animStairs(this.rightStairsClipAction, 'down', 0)
            },
            rightDownLong : () => {
                this.animStairs(this.rightStairsClipAction, 'down', 1)
            },

            toggleLeftAndRight : () => {
                this.animStairs(this.leftStairsClipAction, this.leftStairsClipAction.time === this.keyframeUp ? "down" : "up", 0)
                this.animStairs(this.rightStairsClipAction, this.rightStairsClipAction.time === this.keyframeUp ? "down" : "up", 0)
            },
            toggleLeftAndRightLong : () => {
                this.animStairs(this.leftStairsClipAction, this.leftStairsClipAction.time === this.keyframeUp ? "down" : "up", 2)
                this.animStairs(this.rightStairsClipAction, this.rightStairsClipAction.time === this.keyframeUp ? "down" : "up", 2)
            }
        }

        this.app.debug.ui.add(controls, 'leftUp').name("Left Up")
        this.app.debug.ui.add(controls, 'leftUpLong').name("Left Up (1s)")
        this.app.debug.ui.add(controls, 'leftDown').name("Left Down")
        this.app.debug.ui.add(controls, 'leftDownLong').name("Left Down (1s)")

        this.app.debug.ui.add(controls, 'rightUp').name("Right Up")
        this.app.debug.ui.add(controls, 'rightUpLong').name("Right Up (1s)")
        this.app.debug.ui.add(controls, 'rightDown').name("Right Down")
        this.app.debug.ui.add(controls, 'rightDownLong').name("Right Down (1s)")

        this.app.debug.ui.add(controls, 'toggleLeftAndRight').name("Toggle Left and Right")
        this.app.debug.ui.add(controls, 'toggleLeftAndRightLong').name("Toggle Left and Right (2s)")
    }

    animStairs(clipAction, animDirection, duration) {
        duration = typeof duration === 'number' ? duration : 0

        clipAction.reset()
        clipAction.play()

        clipAction.timeScale = duration === 0 ? 0 : clipAction.getClip().duration / duration
        console.log(`clip action time scale: ${clipAction.timeScale}`)

        const finishHandler = (e) => {
            console.log(`Stair ${clipAction.getClip().name} -> ${animDirection} - complete (time ${this.animMixer.time})`)
            this.animMixer.removeEventListener("finished", finishHandler)
        }

        if (animDirection === "up") {
            clipAction.time = duration === 0 ? this.keyframeUp : this.keyframeDown
            clipAction.timeScale = Math.abs(clipAction.timeScale)
            this.animMixer.addEventListener("finished", finishHandler)
        }

        else if (animDirection === "down") {
            clipAction.time = duration === 0 ? this.keyframeDown : this.keyframeUp
            clipAction.timeScale = -Math.abs(clipAction.timeScale)
            this.animMixer.addEventListener("finished", finishHandler)
        }
    }

    update(info) {
        this.animMixer.update(info.delta)
    }

    destroy() {
        this.leftStairsClipAction = null
        this.rightStairsClipAction = null

        this.model = null
        this.scene = null

        this.animMixer = null

        this.app = null
    }
}