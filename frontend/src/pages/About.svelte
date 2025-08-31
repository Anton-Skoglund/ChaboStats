<script>
    import { onMount } from "svelte";
    import * as THREE from "three";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

    let canvas = null;

    onMount(() => {
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
            75,
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            1000,
        );
        camera.position.set(0, 1, 3);

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        // Light
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 10, 7.5);
        scene.add(light);

        // Load model
        const loader = new GLTFLoader();
        loader.load("/models/scene.glb", (glb) => {
            scene.add(glb.scene);

            // Add red cube for reference
            const redMaterial = new THREE.MeshStandardMaterial({
                color: 0xff0000,
            });
            const redCube = new THREE.Mesh(
                new THREE.BoxGeometry(1, 1, 1),
                redMaterial,
            );
            redCube.position.set(2, 0.5, 0);
            scene.add(redCube);
        });

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);

        // Raycaster setup
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        function onClick(event) {
            // Normalize mouse coordinates (-1 to +1)
            mouse.x = (event.clientX / canvas.clientWidth) * 2 - 1;
            mouse.y = -(event.clientY / canvas.clientHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);

            // Intersect all objects in the scene
            const intersects = raycaster.intersectObjects(scene.children, true);
            if (intersects.length > 0) {
                const point = intersects[0].point;

                // Create small red sphere at intersection
                const marker = new THREE.Mesh(
                    new THREE.SphereGeometry(0.05, 16, 16),
                    new THREE.MeshBasicMaterial({ color: 0xff0000 }),
                );
                marker.position.copy(point);
                scene.add(marker);

                // Create tracer line from camera to intersection
                const origin = raycaster.ray.origin;
                const tracerPoints = [origin.clone(), point.clone()]; // line from camera to point
                const tracerGeometry = new THREE.BufferGeometry().setFromPoints(
                    tracerPoints,
                );
                const tracerMaterial = new THREE.LineBasicMaterial({
                    color: 0x00ff00,
                });
                const tracerLine = new THREE.Line(
                    tracerGeometry,
                    tracerMaterial,
                );
                scene.add(tracerLine);

                // Optional: remove tracer after 2 seconds
                setTimeout(() => scene.remove(tracerLine), 2000);
            }
        }

        canvas.addEventListener("click", onClick);

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
    });
</script>

<canvas bind:this={canvas} width="800" height="600"></canvas>
