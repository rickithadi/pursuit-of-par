// In Pursuit of Par - Enhanced 3D Game Engine
// Three.js integration with authentic 1987 board game mechanics

import * as THREE from 'https://unpkg.com/three@0.169.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.169.0/examples/jsm/controls/OrbitControls.js';

// Enhanced 3D Golf Game Engine
class Enhanced3DGolfEngine {
    constructor() {
        // Core game state (preserving original mechanics)
        this.players = [];
        this.currentPlayer = 1;
        this.currentHole = 1;
        this.shotHistory = [];
        this.gameStarted = false;
        
        // 3D Rendering components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        
        // Course elements
        this.courseGeometry = null;
        this.ballMesh = null;
        this.pinMesh = null;
        this.terrainMesh = null;
        
        // Animation and physics
        this.animationMixer = null;
        this.ballTrajectory = [];
        this.isAnimating = false;
        
        // Performance optimization
        this.lodLevels = {
            high: { detail: 1.0, renderDistance: 1000 },
            medium: { detail: 0.7, renderDistance: 500 },
            low: { detail: 0.4, renderDistance: 250 }
        };
        this.currentLOD = 'high';
        
        this.init();
    }

    async init() {
        await this.initializeCore();
        this.setupDefaultPlayers();
        this.init3DScene();
        this.setupEventHandlers();
        this.startGameLoop();
        
        console.log('Enhanced 3D Golf Engine initialized with authentic board game mechanics');
    }

    async initializeCore() {
        // Preserve original game mechanics initialization
        this.diceRoller = new AuthenticDiceSystem();
        this.shotCalculator = new BoardGameShotCalculator();
        this.courseManager = new TPC3DCourseManager();
    }

    init3DScene() {
        // Create Three.js scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x87CEEB, 50, 2000);
        
        // Setup camera with golf-optimized positioning
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            2000
        );
        this.camera.position.set(0, 50, 100);
        
        // Initialize renderer with performance optimizations
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: this.currentLOD === 'high',
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth * 0.6, 600);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0x87CEEB, 1);
        
        // Add renderer to DOM
        const courseVisualization = document.getElementById('courseVisualization');
        courseVisualization.innerHTML = '';
        courseVisualization.appendChild(this.renderer.domElement);
        
        // Setup camera controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxDistance = 500;
        this.controls.minDistance = 10;
        
        // Create lighting system
        this.setupLighting();
        
        // Build initial hole
        this.buildCurrentHole();
        
        console.log('3D Scene initialized successfully');
    }

    setupLighting() {
        // Ambient lighting for general illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        // Directional sun light with shadows
        const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
        sunLight.position.set(100, 200, 50);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 1000;
        sunLight.shadow.camera.left = -200;
        sunLight.shadow.camera.right = 200;
        sunLight.shadow.camera.top = 200;
        sunLight.shadow.camera.bottom = -200;
        this.scene.add(sunLight);
        
        // Secondary fill light
        const fillLight = new THREE.DirectionalLight(0x8FAAFF, 0.3);
        fillLight.position.set(-50, 50, -50);
        this.scene.add(fillLight);
    }

    buildCurrentHole() {
        // Clear previous hole geometry
        this.clearHole();
        
        const hole = courseData.holes[this.currentHole - 1];
        
        // Create terrain based on hole characteristics
        this.createTerrain(hole);
        this.createFairwayAndRough(hole);
        this.createHazards(hole);
        this.createGreenAndPin(hole);
        this.createTeeBox(hole);
        this.placeBall();
        
        // Position camera for optimal hole view
        this.setCameraForHole(hole);
    }

    createTerrain(hole) {
        // Board game style flat terrain - simple and authentic
        const terrainGeometry = new THREE.PlaneGeometry(400, hole.yardage * 1.2, 4, 4);
        
        // Keep it flat like the original board game - no complex elevation
        // Just slight slope toward green for visual depth
        const vertices = terrainGeometry.attributes.position;
        for (let i = 0; i < vertices.count; i++) {
            const z = vertices.getZ(i);
            // Very subtle slope - board game aesthetic
            const elevation = -(z / hole.yardage) * 0.5;
            vertices.setY(i, elevation);
        }
        
        terrainGeometry.attributes.position.needsUpdate = true;
        terrainGeometry.computeVertexNormals();
        
        // Board game style grass texture - clean and simple
        const grassTexture = this.createBoardGameGrassTexture();
        const terrainMaterial = new THREE.MeshLambertMaterial({ 
            map: grassTexture,
            color: 0x4A7C59 
        });
        
        this.terrainMesh = new THREE.Mesh(terrainGeometry, terrainMaterial);
        this.terrainMesh.rotation.x = -Math.PI / 2;
        this.terrainMesh.receiveShadow = true;
        this.scene.add(this.terrainMesh);
    }

    createFairwayAndRough(hole) {
        // Create fairway strip
        const fairwayGeometry = new THREE.PlaneGeometry(60, hole.yardage * 0.8);
        const fairwayMaterial = new THREE.MeshLambertMaterial({ color: 0x2E7D32 });
        
        const fairway = new THREE.Mesh(fairwayGeometry, fairwayMaterial);
        fairway.rotation.x = -Math.PI / 2;
        fairway.position.y = 0.1;
        fairway.receiveShadow = true;
        this.scene.add(fairway);
        
        // Add rough areas with different grass height simulation
        this.createRoughAreas(hole);
    }

    createRoughAreas(hole) {
        const roughPositions = this.generateRoughPositions(hole);
        
        roughPositions.forEach(pos => {
            const roughGeometry = new THREE.PlaneGeometry(20, 20);
            const roughMaterial = new THREE.MeshLambertMaterial({ color: 0x1B5E20 });
            
            const rough = new THREE.Mesh(roughGeometry, roughMaterial);
            rough.rotation.x = -Math.PI / 2;
            rough.position.set(pos.x, 0.05, pos.z);
            rough.receiveShadow = true;
            this.scene.add(rough);
        });
    }

    createHazards(hole) {
        // Water hazards
        if (this.holeHasWater(hole)) {
            this.createWaterHazard(hole);
        }
        
        // Sand bunkers
        this.createSandBunkers(hole);
        
        // Trees and natural obstacles
        this.createTreesAndObstacles(hole);
    }

    createWaterHazard(hole) {
        const waterGeometry = new THREE.PlaneGeometry(80, 40);
        const waterMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x1565C0,
            transparent: true,
            opacity: 0.8,
            shininess: 100
        });
        
        const water = new THREE.Mesh(waterGeometry, waterMaterial);
        water.rotation.x = -Math.PI / 2;
        water.position.set(-30, -0.5, hole.yardage * 0.3);
        this.scene.add(water);
        
        // Add water movement animation
        this.animateWater(water);
    }

    createSandBunkers(hole) {
        const bunkerPositions = this.generateBunkerPositions(hole);
        
        bunkerPositions.forEach(pos => {
            const bunkerGeometry = new THREE.CylinderGeometry(8, 10, 1, 16);
            const bunkerMaterial = new THREE.MeshLambertMaterial({ color: 0xF5DEB3 });
            
            const bunker = new THREE.Mesh(bunkerGeometry, bunkerMaterial);
            bunker.position.set(pos.x, -0.3, pos.z);
            bunker.receiveShadow = true;
            this.scene.add(bunker);
        });
    }

    createTreesAndObstacles(hole) {
        const treePositions = this.generateTreePositions(hole);
        
        treePositions.forEach(pos => {
            const tree = this.createTree();
            tree.position.set(pos.x, 0, pos.z);
            this.scene.add(tree);
        });
    }

    createTree() {
        const treeGroup = new THREE.Group();
        
        // Simple board game style tree - geometric shapes
        // Tree trunk - simple cylinder
        const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 6, 6);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 3;
        trunk.castShadow = true;
        treeGroup.add(trunk);
        
        // Tree foliage - simple geometric shape like board game pieces
        const foliageGeometry = new THREE.ConeGeometry(3, 8, 6);
        const foliageMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.y = 8;
        foliage.castShadow = true;
        treeGroup.add(foliage);
        
        return treeGroup;
    }

    createGreenAndPin(hole) {
        // Create elevated green
        const greenGeometry = new THREE.CylinderGeometry(15, 18, 0.5, 32);
        const greenMaterial = new THREE.MeshLambertMaterial({ color: 0x0D4F0D });
        
        const green = new THREE.Mesh(greenGeometry, greenMaterial);
        green.position.set(0, 0.25, hole.yardage * -0.4);
        green.receiveShadow = true;
        this.scene.add(green);
        
        // Create flagstick and pin
        this.createFlagstick(green.position);
    }

    createFlagstick(greenPosition) {
        // Flagstick pole
        const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 10, 8);
        const poleMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.set(greenPosition.x, 5, greenPosition.z);
        pole.castShadow = true;
        this.scene.add(pole);
        
        // Flag
        const flagGeometry = new THREE.PlaneGeometry(3, 2);
        const flagMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
        const flag = new THREE.Mesh(flagGeometry, flagMaterial);
        flag.position.set(greenPosition.x + 1.5, 8.5, greenPosition.z);
        this.scene.add(flag);
        
        this.pinMesh = pole;
    }

    createTeeBox(hole) {
        const teeGeometry = new THREE.BoxGeometry(8, 0.2, 4);
        const teeMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
        
        const teeBox = new THREE.Mesh(teeGeometry, teeMaterial);
        teeBox.position.set(0, 0.1, hole.yardage * 0.45);
        teeBox.receiveShadow = true;
        this.scene.add(teeBox);
    }

    placeBall() {
        if (this.ballMesh) {
            this.scene.remove(this.ballMesh);
        }
        
        // Create golf ball
        const ballGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const ballMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xFFFFF0,
            shininess: 100
        });
        
        this.ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
        this.ballMesh.castShadow = true;
        
        // Position ball based on current player state
        const currentPlayerObj = this.players[this.currentPlayer - 1];
        const hole = courseData.holes[this.currentHole - 1];
        
        if (currentPlayerObj.lie === 'tee') {
            this.ballMesh.position.set(0, 0.3, hole.yardage * 0.45);
        } else {
            this.ballMesh.position.set(
                currentPlayerObj.position.x * 2 - 50,
                0.3,
                (100 - currentPlayerObj.position.y) * hole.yardage * 0.01 - hole.yardage * 0.4
            );
        }
        
        this.scene.add(this.ballMesh);
    }

    setCameraForHole(hole) {
        // Position camera for optimal hole viewing
        this.camera.position.set(30, 40, hole.yardage * 0.3);
        this.camera.lookAt(0, 0, hole.yardage * -0.2);
        this.controls.target.set(0, 0, hole.yardage * -0.2);
        this.controls.update();
    }

    // Preserve authentic board game mechanics
    setupDefaultPlayers() {
        this.players = [
            { name: 'Player 1', strokes: 0, scores: new Array(18).fill(0), position: {x: 50, y: 0}, lie: 'tee', holedOut: false },
            { name: 'Player 2', strokes: 0, scores: new Array(18).fill(0), position: {x: 50, y: 0}, lie: 'tee', holedOut: false }
        ];
    }

    // Board game style shot mechanics - preserve authentic dice-based gameplay
    async takeShot() {
        if (this.isAnimating) return;
        
        const currentPlayerObj = this.players[this.currentPlayer - 1];
        const selectedClub = document.querySelector('.club-option.selected')?.dataset.club;
        
        if (!selectedClub) {
            alert('Please select a club first!');
            return;
        }
        
        // Roll dice using authentic board game mechanics
        const diceResult = await this.rollDiceWithAnimation();
        
        // Calculate shot using original board game tables
        const shotResult = this.calculateShot(selectedClub, diceResult, currentPlayerObj);
        
        // Simple board game style ball movement - no complex physics
        await this.moveBallBoardGameStyle(shotResult);
        
        // Update game state
        this.processShotResult(shotResult);
    }

    async moveBallBoardGameStyle(shotResult) {
        return new Promise((resolve) => {
            this.isAnimating = true;
            
            const startPos = this.ballMesh.position.clone();
            const endPos = this.calculateEndPosition(shotResult);
            
            // Board game style: simple linear movement with slight arc
            const steps = 20;
            let currentStep = 0;
            
            const animate = () => {
                if (currentStep <= steps) {
                    const progress = currentStep / steps;
                    
                    // Linear interpolation like moving a game piece
                    this.ballMesh.position.x = startPos.x + (endPos.x - startPos.x) * progress;
                    this.ballMesh.position.z = startPos.z + (endPos.z - startPos.z) * progress;
                    
                    // Simple hop for visual interest - board game aesthetic
                    this.ballMesh.position.y = startPos.y + Math.sin(progress * Math.PI) * 3;
                    
                    currentStep++;
                    setTimeout(animate, 50);
                } else {
                    this.ballMesh.position.copy(endPos);
                    this.ballMesh.position.y = 0.3;
                    this.isAnimating = false;
                    resolve();
                }
            };
            
            animate();
        });
    }

    generateTrajectoryPoints(start, end, distance) {
        const points = [];
        const numPoints = 30;
        
        for (let i = 0; i <= numPoints; i++) {
            const t = i / numPoints;
            const point = new THREE.Vector3();
            
            // Linear interpolation for x and z
            point.x = start.x + (end.x - start.x) * t;
            point.z = start.z + (end.z - start.z) * t;
            
            // Parabolic arc for y (height)
            const maxHeight = Math.min(distance * 0.1, 25);
            point.y = start.y + maxHeight * 4 * t * (1 - t);
            
            points.push(point);
        }
        
        return points;
    }

    // Performance optimization methods
    optimizeForDevice() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            this.currentLOD = 'low';
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
            this.renderer.shadowMap.enabled = false;
        } else {
            this.currentLOD = this.detectPerformanceLevel();
        }
        
        this.applyLODSettings();
    }

    detectPerformanceLevel() {
        // Simple performance detection
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) return 'low';
        
        const renderer = gl.getParameter(gl.RENDERER);
        if (renderer.includes('Intel')) return 'medium';
        if (renderer.includes('GTX') || renderer.includes('RTX')) return 'high';
        
        return 'medium';
    }

    applyLODSettings() {
        const settings = this.lodLevels[this.currentLOD];
        
        // Adjust render distance and detail based on performance level
        this.camera.far = settings.renderDistance;
        this.camera.updateProjectionMatrix();
        
        // Adjust terrain detail
        if (this.terrainMesh) {
            const scale = settings.detail;
            this.terrainMesh.scale.set(scale, 1, scale);
        }
    }

    startGameLoop() {
        const animate = () => {
            requestAnimationFrame(animate);
            
            // Update controls
            this.controls.update();
            
            // Update any animations
            if (this.animationMixer) {
                this.animationMixer.update(0.016);
            }
            
            // Render the scene
            this.renderer.render(this.scene, this.camera);
        };
        
        animate();
    }

    setupEventHandlers() {
        // Preserve all original UI event handlers
        document.getElementById('takeShot')?.addEventListener('click', () => this.takeShot());
        document.getElementById('undoShot')?.addEventListener('click', () => this.undoLastShot());
        document.getElementById('nextHole')?.addEventListener('click', () => this.nextHole());
        
        // Handle window resize for 3D renderer
        window.addEventListener('resize', () => this.handleResize());
        
        // Club selection handlers
        document.querySelectorAll('.club-option').forEach(club => {
            club.addEventListener('click', () => this.selectClub(club));
        });
    }

    handleResize() {
        const container = document.getElementById('courseVisualization');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    // Board game style textures - clean and simple
    createBoardGameGrassTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        // Simple, clean grass color like board game artwork
        ctx.fillStyle = '#4A7C59';
        ctx.fillRect(0, 0, 128, 128);
        
        // Minimal texture variation - board game aesthetic
        for (let i = 0; i < 100; i++) {
            ctx.fillStyle = `rgba(${45 + Math.random() * 10}, ${115 + Math.random() * 10}, ${55 + Math.random() * 10}, 0.3)`;
            ctx.fillRect(Math.random() * 128, Math.random() * 128, 1, 1);
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4);
        return texture;
    }

    generateRoughPositions(hole) {
        const positions = [];
        const numRoughAreas = Math.floor(hole.difficulty * 0.3) + 2;
        
        for (let i = 0; i < numRoughAreas; i++) {
            positions.push({
                x: (Math.random() - 0.5) * 150,
                z: Math.random() * hole.yardage * 0.6 - hole.yardage * 0.3
            });
        }
        
        return positions;
    }

    generateBunkerPositions(hole) {
        const positions = [];
        const numBunkers = Math.floor(hole.difficulty * 0.2) + 1;
        
        for (let i = 0; i < numBunkers; i++) {
            positions.push({
                x: (Math.random() - 0.5) * 100,
                z: Math.random() * hole.yardage * 0.4 - hole.yardage * 0.2
            });
        }
        
        return positions;
    }

    generateTreePositions(hole) {
        const positions = [];
        const numTrees = Math.floor(hole.difficulty * 0.4) + 3;
        
        for (let i = 0; i < numTrees; i++) {
            positions.push({
                x: (Math.random() - 0.5) * 200,
                z: Math.random() * hole.yardage * 0.8 - hole.yardage * 0.4
            });
        }
        
        return positions;
    }

    holeHasWater(hole) {
        // Notable water holes at TPC Sawgrass
        return [8, 17].includes(hole.number) || Math.random() < 0.3;
    }

    clearHole() {
        // Remove all course-specific geometry for hole transition
        const objectsToRemove = [];
        this.scene.traverse((child) => {
            if (child.isMesh && child !== this.ballMesh) {
                objectsToRemove.push(child);
            }
        });
        
        objectsToRemove.forEach(obj => {
            this.scene.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(mat => mat.dispose());
                } else {
                    obj.material.dispose();
                }
            }
        });
    }

    // Preserve all original game logic methods
    rollDiceWithAnimation() {
        // Implementation preserves original dice mechanics with 3D visual enhancement
        return new Promise((resolve) => {
            // Original board game dice logic maintained
            const result = this.diceRoller.rollAuthentic();
            
            // Add 3D dice animation here
            setTimeout(() => resolve(result), 500);
        });
    }

    calculateShot(club, diceResult, player) {
        // Preserve authentic 1987 board game shot calculation
        return this.shotCalculator.calculate(club, diceResult, player.lie);
    }

    calculateEndPosition(shotResult) {
        // Convert 2D game coordinates to 3D world coordinates
        const hole = courseData.holes[this.currentHole - 1];
        return new THREE.Vector3(
            shotResult.position.x * 2 - 50,
            0.3,
            (100 - shotResult.position.y) * hole.yardage * 0.01 - hole.yardage * 0.4
        );
    }
}

// Initialize enhanced game engine when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.enhanced3DGolfEngine = new Enhanced3DGolfEngine();
    console.log('Enhanced 3D Golf Engine loaded successfully');
});

// Export for module usage
export { Enhanced3DGolfEngine };