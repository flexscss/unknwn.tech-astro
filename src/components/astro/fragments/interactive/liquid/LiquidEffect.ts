import * as THREE from 'three'

export class LiquidEffect {
  private container: HTMLElement
  private canvas: HTMLCanvasElement
  private audio: HTMLAudioElement
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private dataArray: Uint8Array | null = null
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer
  private time: number = 0
  private geometry: THREE.PlaneGeometry
  private material: THREE.ShaderMaterial
  private mesh: THREE.Mesh
  private audioButton: HTMLButtonElement
  private isInitialized: boolean = false
  private emojiSprites: THREE.Sprite[] = []
  private readonly EMOJI_LIST = ['😎', '🥳', '🤪', '😈', '👽', '🤖', '👻', '😂', '🦄', '😎', '😱', '😼']
  private emojiScene: THREE.Scene

  constructor() {
    this.container = document.querySelector('.liquid-container') as HTMLElement
    this.canvas = document.querySelector('#liquidCanvas') as HTMLCanvasElement
    this.audio = document.querySelector('#audioElement') as HTMLAudioElement
    this.audioButton = document.querySelector('#audioControl') as HTMLButtonElement

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.camera.position.z = 1

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true
    })

    const aspect = window.innerWidth / window.innerHeight
    this.geometry = new THREE.PlaneGeometry(aspect > 1 ? 2 * aspect : 2, aspect > 1 ? 2 : 2 / aspect, 256, 256)
    this.material = this.createShaderMaterial()
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.mesh)

    this.emojiScene = new THREE.Scene()
    this.initEmojis()

    this.init()
    this.setupEventListeners()
    this.animate()
  }

  private createEmojiTexture(emoji: string): THREE.Texture {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.font = '48px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(emoji, 32, 32)
    }
    const texture = new THREE.Texture(canvas)
    texture.needsUpdate = true
    return texture
  }

  private initEmojis(): void {
    for (let i = 0; i < 15; i++) {
      const emoji = this.EMOJI_LIST[Math.floor(Math.random() * this.EMOJI_LIST.length)]
      const texture = this.createEmojiTexture(emoji)
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.7
      })

      const sprite = new THREE.Sprite(material)

      sprite.position.set((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 3, 0.5)

      const scale = 0.1 + Math.random() * 0.05
      sprite.scale.set(scale, scale, 1)

      sprite.userData = {
        speedX: (Math.random() - 0.5) * 0.005,
        speedY: (Math.random() - 0.5) * 0.005,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        originalScale: scale
      }

      this.emojiScene.add(sprite)
      this.emojiSprites.push(sprite)
    }
  }

  private updateEmojis(audioData: { average: number, bass: number, kick: number }): void {
    this.emojiSprites.forEach((sprite) => {
      sprite.position.x += sprite.userData.speedX * (1 + audioData.average * 2)
      sprite.position.y += sprite.userData.speedY * (1 + audioData.average * 2)

      sprite.material.rotation += sprite.userData.rotationSpeed * (1 + audioData.bass * 2)

      const scale = sprite.userData.originalScale * (1 + audioData.kick * 0.8)
      sprite.scale.set(scale, scale, 1)

      if (sprite.position.x > 3)
        sprite.position.x = -3
      if (sprite.position.x < -3)
        sprite.position.x = 3
      if (sprite.position.y > 2)
        sprite.position.y = -2
      if (sprite.position.y < -2)
        sprite.position.y = 2
      ;(sprite.material as THREE.SpriteMaterial).opacity = 0.5 + audioData.average * 0.2 + audioData.kick * 0.3
    })
  }

  private createShaderMaterial(): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uAudioData: { value: 0 },
        uBassFrequency: { value: 0 },
        uKick: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uAspect: { value: window.innerWidth / window.innerHeight }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float uBassFrequency;
        uniform float uKick;

        void main() {
          vUv = uv;
          vPosition = position;

          vec3 pos = position;
          float displacement = uBassFrequency * 0.1 * sin(position.x * 6.0);
          displacement += uKick * 0.15 * cos(position.y * 5.0);
          pos.z += displacement;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uAudioData;
        uniform float uBassFrequency;
        uniform float uKick;
        uniform vec2 uResolution;
        uniform float uAspect;

        varying vec2 vUv;
        varying vec3 vPosition;

        #define PI 3.14159265359

        vec2 smoothRandomVector(vec2 uv) {
            uv = vec2(dot(uv, vec2(127.1, 311.7)), dot(uv, vec2(269.5, 183.3)));
            return -1.0 + 2.0 * fract(sin(uv) * 43758.5453123);
        }

        float noise(vec2 st) {
            vec2 i = floor(st);
            vec2 f = fract(st);

            vec2 u = f * f * (3.0 - 2.0 * f);

            return mix(
                mix(dot(smoothRandomVector(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                    dot(smoothRandomVector(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
                mix(dot(smoothRandomVector(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                    dot(smoothRandomVector(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
                u.y
            );
        }

        float createHoles(vec2 pos, float time) {
            vec2 hole1 = vec2(
                sin(time * 0.15) * 0.5 + cos(time * 0.1) * 0.3,
                cos(time * 0.2) * 0.5 + sin(time * 0.25) * 0.3
            );
            
            vec2 hole2 = vec2(
                cos(time * 0.1) * 0.6 + sin(time * 0.15) * 0.2,
                sin(time * 0.15) * 0.4 + cos(time * 0.2) * 0.4
            );
            
            vec2 hole3 = vec2(
                sin(time * 0.25) * 0.4 + cos(time * 0.1) * 0.3,
                cos(time * 0.15) * 0.5 + sin(time * 0.2) * 0.2
            );

            float d1 = length(pos - hole1);
            float d2 = length(pos - hole2);
            float d3 = length(pos - hole3);

            float radius1 = 0.2 + sin(time * 0.35) * 0.08;
            float radius2 = 0.25 + cos(time * 0.25) * 0.12;
            float radius3 = 0.3 + sin(time * 0.15) * 0.1;

            float holes = smoothstep(radius1, radius1 + 0.2, d1) *
                         smoothstep(radius2, radius2 + 0.25, d2) *
                         smoothstep(radius3, radius3 + 0.22, d3);
                         
            return holes;
        }

        vec3 getDynamicColor(float time, float intensity) {
            // Создаем несколько базовых цветов для переходов
            vec3 color1 = vec3(0.2, 0.5, 1.0);  // Синий
            vec3 color2 = vec3(0.7, 0.3, 0.9);  // Фиолетовый
            vec3 color3 = vec3(0.3, 0.8, 0.5);  // Бирюзовый
            vec3 color4 = vec3(0.9, 0.4, 0.3);  // Коралловый
            vec3 color5 = vec3(0.4, 0.3, 0.8);  // Индиго
            
            // Создаем плавные переходы между цветами
            float t1 = sin(time * 0.1) * 0.5 + 0.5;
            float t2 = sin(time * 0.15 + PI * 0.5) * 0.5 + 0.5;
            float t3 = sin(time * 0.2 + PI) * 0.5 + 0.5;
            
            // Смешиваем цвета с разными весами
            vec3 mixedColor1 = mix(color1, color2, t1);
            vec3 mixedColor2 = mix(color3, color4, t2);
            vec3 mixedColor3 = mix(mixedColor1, color5, t3);
            
            // Добавляем влияние интенсивности звука на насыщенность
            return mix(mixedColor3, mixedColor2, intensity * 0.5);
        }

        void main() {
            vec2 uv = vUv;
            vec2 pos = gl_FragCoord.xy/uResolution.xy;
            pos.x *= uAspect;

            vec3 color1 = vec3(0.2, 0.5, 1.0);
            vec3 color2 = vec3(0.4, 0.7, 1.0);
            vec3 color3 = vec3(0.1, 0.3, 0.9);
            vec3 color4 = vec3(0.3, 0.6, 1.0);

            float slowTime = uTime * 0.08;
            float mediumTime = uTime * 0.12;
            float fastTime = uTime * 0.2;
            
            vec2 flowDirection1 = vec2(
                sin(uTime * 0.05) * 0.5 + cos(uTime * 0.07) * 0.5,
                cos(uTime * 0.06) * 0.5 + sin(uTime * 0.08) * 0.5
            );
            vec2 flowDirection2 = vec2(
                cos(uTime * 0.07) * 0.5 + sin(uTime * 0.06) * 0.5,
                sin(uTime * 0.08) * 0.5 + cos(uTime * 0.05) * 0.5
            );
            
            vec2 noisePos1 = pos + flowDirection1 * slowTime * 0.5;
            vec2 noisePos2 = pos + flowDirection2 * mediumTime * 0.3;
            vec2 noisePos3 = pos + vec2(sin(uTime * 0.15), cos(uTime * 0.17)) * fastTime * 0.2;

            float baseNoise1 = noise(noisePos1 * 2.5 + sin(uTime * 0.05) * 1.5) * 0.5 + 0.5;
            float baseNoise2 = noise(noisePos2 * 3.0 + cos(uTime * 0.07) * 1.2) * 0.5 + 0.5;
            float baseNoise3 = noise(noisePos3 * 1.5 + sin(uTime * 0.1) * 0.8) * 0.5 + 0.5;

            float bassIntensity = uBassFrequency * 2.5 + uKick * 3.5;
            
            float holes = createHoles(pos - vec2(0.5), uTime);
            
            float audioNoise1 = noise(noisePos1 * 3.0) * (uAudioData * 0.7 + bassIntensity * 0.5);
            float audioNoise2 = noise(noisePos2 * 4.0) * (uAudioData * 0.5 + bassIntensity * 0.4);
            float audioNoise3 = noise(noisePos3 * 5.0) * (uAudioData * 0.4 + bassIntensity * 0.3);

            float combinedNoise = mix(
                baseNoise1 * 0.5 + baseNoise2 * 0.3 + baseNoise3 * 0.2,
                audioNoise1 * 0.5 + audioNoise2 * 0.3 + audioNoise3 * 0.2,
                0.5 + bassIntensity * 0.3
            );

            float turbulence = noise(pos * 3.0 + uTime * 0.05) * 0.08;
            
            float angle1 = uTime * 0.1;
            float angle2 = uTime * 0.15;
            vec2 waveDir1 = vec2(cos(angle1), sin(angle1));
            vec2 waveDir2 = vec2(cos(angle2), sin(angle2));
            
            float baseWave1 = sin(dot(pos, waveDir1) * 6.0 + slowTime) * 0.5 + 0.5;
            float baseWave2 = sin(dot(pos, waveDir2) * 4.0 + mediumTime) * 0.3 + 0.5;
            float baseWave3 = sin(pos.x * 1.5 + pos.y * 6.0 + fastTime) * 0.2 + 0.5;

            float baseWave = (baseWave1 * 0.5 + baseWave2 * 0.3 + baseWave3 * 0.2);

            float kickWave = sin(dot(pos, waveDir1) * 6.0 + turbulence + uTime) * (uKick * 1.5);
            float bassWave = sin(dot(pos, waveDir2) * 4.0 + turbulence + uTime) * (uBassFrequency * 1.2);

            float randomFactor = noise(vec2(uTime * 0.05)) * 0.2 + 0.8;
            float finalEffect = mix(
                baseWave,
                combinedNoise + kickWave + bassWave,
                0.5 * randomFactor
            ) * holes;

            // Получаем динамические цвета
            vec3 primaryColor = getDynamicColor(uTime, bassIntensity);
            vec3 secondaryColor = getDynamicColor(uTime + PI, bassIntensity);
            vec3 accentColor = getDynamicColor(uTime + PI * 0.5, uKick);

            // Обновляем цветовые переходы
            vec3 baseColor = mix(primaryColor, secondaryColor, finalEffect);
            
            // Добавляем акцентный цвет на основе аудио
            baseColor = mix(
                baseColor, 
                accentColor, 
                (sin(uTime * 0.2) * 0.3 + 0.5) * bassIntensity
            );

            // Добавляем цветовые вспышки от басов и киков
            vec3 kickColor = vec3(0.8, 0.4, 1.0);  // Яркий фиолетовый для киков
            vec3 bassColor = vec3(0.3, 0.7, 1.0);  // Яркий голубой для басов
            
            baseColor = mix(baseColor, kickColor, uKick * 0.4);
            baseColor = mix(baseColor, bassColor, uBassFrequency * 0.3);

            // Добавляем свечение с динамическим цветом
            float baseGlow = 0.4;
            float audioGlow = bassIntensity * 1.5;
            float totalGlow = baseGlow + audioGlow;

            vec3 glowColor = getDynamicColor(uTime * 0.5, audioGlow);
            baseColor += glowColor * totalGlow * finalEffect * 0.5;

            // Регулируем яркость
            float baseBrightness = 0.8;
            float audioBrightness = 1.0 + uKick * 0.4 + sin(uTime) * 0.1;
            baseColor *= baseBrightness * audioBrightness;

            // Добавляем цветовую насыщенность от аудио
            float saturationBoost = 1.0 + (uAudioData + uBassFrequency) * 0.3;
            baseColor = mix(
                vec3((baseColor.r + baseColor.g + baseColor.b) / 3.0),
                baseColor,
                saturationBoost
            );

            float baseAlpha = 0.5;
            float audioAlpha = uAudioData * 0.2 + uBassFrequency * 0.2 + uKick * 0.3;
            float alpha = clamp(baseAlpha + audioAlpha, 0.4, 0.85);

            gl_FragColor = vec4(baseColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false
    })
  }

  private setupEventListeners(): void {
    this.audioButton.addEventListener('click', () => {
      if (!this.isInitialized) {
        this.initializeAudioContext()
        this.isInitialized = true
      }
      this.handleAudioPlayPause()
    })
  }

  private initializeAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.analyser = this.audioContext.createAnalyser()
      this.setupAudio()
    }
    catch (error) {
      console.error('Error initializing audio context:', error)
    }
  }

  private init(): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    window.addEventListener('resize', this.onResize.bind(this))
  }

  private setupAudio(): void {
    if (!this.audioContext || !this.analyser)
      return

    try {
      this.analyser.fftSize = 4096
      this.analyser.smoothingTimeConstant = 0.65

      const source = this.audioContext.createMediaElementSource(this.audio)
      source.connect(this.analyser)
      this.analyser.connect(this.audioContext.destination)
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)
    }
    catch (error) {
      console.error('Error setting up audio:', error)
    }
  }

  private getAudioData(): { average: number, bass: number, kick: number } {
    if (!this.analyser || !this.dataArray)
      return { average: 0, bass: 0, kick: 0 }

    this.analyser.getByteFrequencyData(this.dataArray)

    const average = this.dataArray.slice(0, 100).reduce((a, b) => a + b, 0) / 100

    const bassRange = this.dataArray.slice(1, 8)
    const bass = bassRange.reduce((a, b) => a + b, 0) / bassRange.length

    const kickRange = this.dataArray.slice(2, 4)
    const kick = kickRange.reduce((a, b) => a + b, 0) / kickRange.length

    return {
      average: (average / 255.0) * 1,
      bass: (bass / 255.0) * 1,
      kick: (kick / 255.0) * 1
    }
  }

  private handleAudioPlayPause(): void {
    if (this.audio.paused) {
      const playPromise = this.audio.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.audioButton.classList.add('playing')
            this.container.classList.remove('hidden')
            if (this.audioContext?.state === 'suspended') {
              this.audioContext.resume()
            }
          })
          .catch((error) => {
            console.error('Error playing audio:', error)
          })
      }
    }
    else {
      this.audio.pause()
      this.audioButton.classList.remove('playing')
      this.container.classList.add('hidden')
    }
  }

  private animate(): void {
    requestAnimationFrame(this.animate.bind(this))

    if (!this.container.classList.contains('hidden')) {
      this.time += 0.01
      const audioData = this.audio.paused ? { average: 0, bass: 0, kick: 0 } : this.getAudioData()

      this.material.uniforms.uTime.value = this.time
      this.material.uniforms.uAudioData.value = audioData.average
      this.material.uniforms.uBassFrequency.value = audioData.bass
      this.material.uniforms.uKick.value = audioData.kick

      this.updateEmojis(audioData)

      this.renderer.autoClear = true
      this.renderer.setClearColor(0x000000, 0)

      this.renderer.render(this.scene, this.camera)

      this.renderer.autoClear = false
      this.renderer.render(this.emojiScene, this.camera)
    }
  }

  private onResize(): void {
    const width = window.innerWidth
    const height = window.innerHeight
    const aspect = width / height

    this.camera.aspect = aspect
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(width, height)

    this.geometry.dispose()
    this.geometry = new THREE.PlaneGeometry(aspect > 1 ? 2 * aspect : 2, aspect > 1 ? 2 : 2 / aspect, 256, 256)
    this.mesh.geometry = this.geometry

    this.material.uniforms.uResolution.value.set(width, height)
    this.material.uniforms.uAspect.value = aspect

    this.emojiSprites.forEach((sprite) => {
      if (sprite.position.x > aspect)
        sprite.position.x = -aspect
      if (sprite.position.x < -aspect)
        sprite.position.x = aspect
    })
  }
}
