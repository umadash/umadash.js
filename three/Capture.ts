import * as THREE from 'three';


export class Capture extends THREE.Scene {

    private texture: THREE.WebGLRenderTarget;

    constructor() {
        super();
        
    }

    public init(): void {

        this.texture = new THREE.WebGLRenderTarget(16, 16);
    }
}