"use client"

import { useState, useEffect, useRef, useMemo, memo } from "react"
import * as THREE from "three"

// --- Icon Components (Optimized for Performance with memo) ---
const createIcon = (svgContent) =>
  memo(({ className }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  ))

const Shield = createIcon('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />')
const Code = createIcon('<polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />')
const Copy = createIcon(
  '<rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />',
)
const Check = createIcon('<polyline points="20 6 9 17 4 12" />')
const SlidersHorizontal = createIcon(
  '<line x1="21" x2="14" y1="4" y2="4" /><line x1="10" x2="3" y1="4" y2="4" /><line x1="21" x2="12" y1="12" y2="12" /><line x1="8" x2="3" y1="12" y2="12" /><line x1="21" x2="16" y1="20" y2="20" /><line x1="12" x2="3" y1="20" y2="20" /><line x1="14" x2="14" y1="2" y2="6" /><line x1="8" x2="8" y1="10" y2="14" /><line x1="16" x2="16" y1="18" y2="22" />',
)
const Zap = createIcon('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />')
const ZapOff = createIcon(
  '<polyline points="12.41 6.75 13 2 10.57 4.92" /><polyline points="18.57 12.91 21 10 15.66 10" /><polyline points="8 8 3 14 12 14 11 22 16 16" /><line x1="1" x2="23" y1="1" y2="23" />',
)
const Globe = createIcon(
  '<circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />',
)
const BarChart3 = createIcon('<path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />')
const Activity = createIcon('<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />')
const Terminal = createIcon('<polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />')
const BookOpen = createIcon(
  '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
)
const PlusCircle = createIcon(
  '<circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />',
)
const MinusCircle = createIcon('<circle cx="12" cy="12" r="10" /><line x1="8" y1="12" x2="16" y2="12" />')

// --- Core Application Logic Hook ---
const useObfuscationCore = () => {
  // Memoize functions to prevent re-creation on every render
  const obfuscateNumbers = useMemo(
    () => (code) =>
      code.replace(/\b(\d+)\b/g, (match, numStr) => {
        const num = Number.parseInt(numStr, 10)
        if (num < 10 || num > 9999) return match
        const patterns = [() => `(${Math.floor(num / 2)} + ${num - Math.floor(num / 2)})`, () => `(${num + 10} - 10)`]
        return patterns[Math.floor(Math.random() * patterns.length)]()
      }),
    [],
  )

  const addOpaquePredicates = useMemo(() => (code) => code.replace(/\bif\s+true\b/g, () => `if (1 + 1 == 2)`), [])

  const encryptString = useMemo(
    () => (code) =>
      code.replace(/"([^"]+)"/g, (match, str) => {
        if (str.length < 2 || str.includes("{")) return match
        try {
          const encoded = btoa(str)
          return `base64::decode("${encoded}").unwrap()`
        } catch (e) {
          return match
        }
      }),
    [],
  )

  const splitString = useMemo(
    () => (code) =>
      code.replace(/"([^"]+)"/g, (match, str) => {
        if (str.length < 4 || str.includes("{")) return match
        const mid = Math.floor(str.length / 2)
        return `concat!("${str.substring(0, mid)}", "${str.substring(mid)}")`
      }),
    [],
  )

  // Add other core functions here if they don't depend on state
  const addDeadCode = useMemo(
    () => (code) => {
      const snippets = [" if false { let _unused = 42; }", " let _dummy = 0; let _dummy2 = _dummy * 0;"]
      return code.replace(
        /(fn\s+\w+[^{]*\{)/g,
        (match) => `${match}\n    ${snippets[Math.floor(Math.random() * snippets.length)]}`,
      )
    },
    [],
  )

  const obfuscateVariableNames = useMemo(
    () => (code) => {
      const varPattern = /\blet\s+(mut\s+)?([a-z_][a-z0-9_]*)\b/g
      const variables = new Map()
      let counter = 0
      let result = code
      ;[...code.matchAll(varPattern)].forEach((match) => {
        const varName = match[2]
        if (!varName.startsWith("_") && varName.length > 1 && varName !== "main" && !variables.has(varName)) {
          variables.set(varName, `var_${counter++}`)
        }
      })
      variables.forEach((newName, oldName) => {
        result = result.replace(new RegExp(`\\b${oldName}\\b`, "g"), newName)
      })
      return result
    },
    [],
  )

  const obfuscateControlFlow = useMemo(
    () => (code) =>
      code.replace(
        /if\s+([^{]+)\s*\{([^}]+)\}\s*else\s*\{([^}]+)\}/g,
        (match, condition, ifBlock, elseBlock) =>
          `match ${condition} { true => {${ifBlock}}, false => {${elseBlock}} }`,
      ),
    [],
  )

  const createStringConstants = useMemo(
    () => (code) => {
      const strings = []
      let counter = 0
      let result = code.replace(/"([^"{}]+)"/g, (match, str) => {
        if (str.length < 3 || str.includes("{")) return match
        const constName = `STR_${counter++}`
        strings.push({ name: constName, value: match })
        return constName
      })
      if (strings.length > 0) {
        const constants = strings.map((s) => `const ${s.name}: &str = ${s.value};`).join("\n")
        result = `${constants}\n\n${result}`
      }
      return result
    },
    [],
  )

  const deobfuscateNumbers = useMemo(
    () => (code) =>
      code.replace(/$$(\s*\d+\s*[+\-*]\s*\d+\s*)$$/g, (match, expr) => {
        try {
          return new Function(`return ${expr}`)()
        } catch {
          return match
        }
      }),
    [],
  )

  const simplifyPredicates = useMemo(
    () => (code) =>
      code.replace(/if\s+$$[^)]+$$/g, (match) => {
        if (match.includes("==") || match.includes(">") || match.includes("||") || match.includes("!="))
          return "if true"
        return match
      }),
    [],
  )

  const removeDeadCode = useMemo(
    () => (code) =>
      code.replace(/\s*if false \{[^}]+\}/g, "").replace(/\s*let _dummy = 0; let _dummy2 = _dummy \* 0;/g, ""),
    [],
  )

  const simplifyControlFlow = useMemo(
    () => (code) =>
      code.replace(
        /match\s+([^{]+)\s*\{\s*true\s*=>\s*\{([^}]+)\},\s*false\s*=>\s*\{([^}]+)\}\s*\}/g,
        (match, condition, trueBlock, falseBlock) => `if ${condition} {\n${trueBlock}\n} else {\n${falseBlock}\n}`,
      ),
    [],
  )

  const inlineStringConstants = useMemo(
    () => (code) => {
      const consts = new Map()
      const constPattern = /const\s+(STR_\d+):\s*&str\s*=\s*("[^"]+");/g
      let result = code.replace(constPattern, (match, name, value) => {
        consts.set(name, value)
        return ""
      })
      consts.forEach((value, name) => {
        result = result.replace(new RegExp(`\\b${name}\\b`, "g"), value)
      })
      return result.trim()
    },
    [],
  )

  return {
    obfuscateNumbers,
    addOpaquePredicates,
    encryptString,
    splitString,
    addDeadCode,
    obfuscateVariableNames,
    obfuscateControlFlow,
    createStringConstants,
    deobfuscateNumbers,
    simplifyPredicates,
    removeDeadCode,
    simplifyControlFlow,
    inlineStringConstants,
  }
}

// --- UI Components ---

const Header = memo(() => (
  <header className="text-center mb-8 animate-fade-in-down">
    <div className="flex items-center justify-center gap-3 mb-2">
      <Shield className="w-10 h-10 text-blue-400 animate-pulse" />
      <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
        Rust Obfuscator
      </h1>
    </div>
    <p className="text-gray-400">A high-performance transformation and analysis engine.</p>
  </header>
))

const Navigation = memo(({ activeView, setActiveView }) => {
  const navItems = ["obfuscator", "visualization", "dashboard", "library"]
  return (
    <nav className="flex justify-center mb-8 animate-fade-in-down" style={{ animationDelay: "100ms" }}>
      <div className="flex flex-wrap justify-center p-1 bg-black/30 backdrop-blur-sm border border-blue-500/20 rounded-xl">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => setActiveView(item)}
            className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm sm:text-base capitalize relative ${activeView === item ? "text-white" : "text-gray-400 hover:text-white"}`}
            aria-current={activeView === item ? "page" : undefined}
          >
            {activeView === item && (
              <span className="absolute inset-0 bg-blue-500/30 rounded-lg -z-10 motion-safe:animate-nav-pulse" />
            )}
            {item}
          </button>
        ))}
      </div>
    </nav>
  )
})

const ObfuscatorView = ({ core, stats, setStats, setCodeAnalysis }) => {
  const [inputCode, setInputCode] = useState(
    `fn main() {\n    let x = 42;\n    let name = "Rust";\n    if true {\n        println!("Hello, {}!", name);\n        println!("The answer is: {}", x);\n    }\n}`,
  )
  const [outputCode, setOutputCode] = useState("")
  const [copied, setCopied] = useState(false)
  const [options, setOptions] = useState({
    numbers: true,
    predicates: true,
    deadCode: true,
    variables: true,
    controlFlow: false,
    stringConstants: false,
  })

  const runObfuscation = () => {
    let result = inputCode
    if (options.numbers) result = core.obfuscateNumbers(result)
    if (options.predicates) result = core.addOpaquePredicates(result)
    if (options.deadCode) result = core.addDeadCode(result)
    if (options.variables) result = core.obfuscateVariableNames(result)
    if (options.controlFlow) result = core.obfuscateControlFlow(result)
    if (options.stringConstants) result = core.createStringConstants(result)
    setOutputCode(result)

    const lines = inputCode.split("\n").length
    const funcs = (inputCode.match(/fn /g) || []).length
    const vars = (inputCode.match(/let /g) || []).length
    const loops = (inputCode.match(/for|while|loop/g) || []).length
    const conds = (inputCode.match(/if|match/g) || []).length
    const strs = (inputCode.match(/"/g) || []).length / 2
    const complexity = funcs * 5 + vars * 1 + loops * 3 + conds * 2
    const activeOptions = Object.values(options).filter((v) => v).length

    setCodeAnalysis({
      functions: funcs,
      variables: vars,
      loops,
      conditionals: conds,
      strings: Math.floor(strs),
      comments: 0,
    })
    setStats((prev) => ({
      totalObfuscations: prev.totalObfuscations + 1,
      linesProcessed: prev.linesProcessed + lines,
      securityLevel: Math.min(99, 40 + activeOptions * 10 + Math.floor(Math.random() * 5)),
      codeComplexity: complexity,
      obfuscationLevel: Math.min(100, Math.floor((result.length / (inputCode.length || 1)) * 50)),
      performanceImpact: Math.min(99, 5 + activeOptions * 3 + Math.floor(Math.random() * 5)),
    }))
  }

  const runDeobfuscation = () => {
    let result = outputCode || inputCode
    if (options.stringConstants) result = core.inlineStringConstants(result)
    if (options.controlFlow) result = core.simplifyControlFlow(result)
    if (options.deadCode) result = core.removeDeadCode(result)
    if (options.predicates) result = core.simplifyPredicates(result)
    if (options.numbers) result = core.deobfuscateNumbers(result)
    setOutputCode(result)
  }

  const copyToClipboard = () => {
    if (!outputCode) return
    const textArea = document.createElement("textarea")
    textArea.value = outputCode
    textArea.style.position = "fixed"
    textArea.style.left = "-9999px"
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand("copy")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
    document.body.removeChild(textArea)
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-black/30 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 mb-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-3 text-blue-300">
          <SlidersHorizontal className="w-5 h-5" /> Transformation Protocols
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
          {Object.entries(options).map(([key, value]) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setOptions((prev) => ({ ...prev, [key]: e.target.checked }))}
                  className="peer w-5 h-5 rounded-md bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900 appearance-none checked:bg-blue-500 transition duration-200"
                />
                <Check
                  className={`w-4 h-4 absolute top-0.5 left-0.5 text-black transition-opacity duration-200 ${value ? "opacity-100" : "opacity-0"}`}
                />
              </div>
              <span className="capitalize text-gray-300 group-hover:text-blue-300 transition">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="source-code-input" className="text-lg font-semibold mb-2 text-gray-300 block">
            Source Code
          </label>
          <div className="relative">
            <textarea
              id="source-code-input"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="w-full h-96 p-4 bg-black/50 border border-blue-500/20 rounded-lg font-mono text-sm text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Paste your Rust code here..."
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-300">Transformed Code</h3>
            {outputCode && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-blue-500/20 text-gray-300 hover:text-blue-300 border border-gray-600 hover:border-blue-500/30 rounded-lg transition"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>
          <textarea
            value={outputCode}
            readOnly
            aria-label="Obfuscated Code Output"
            className="w-full h-96 p-4 bg-black/50 border border-blue-500/20 rounded-lg font-mono text-sm text-gray-200"
            placeholder="Transformed code will appear here..."
          />
        </div>
      </div>
      <div className="mt-6 flex justify-center items-center gap-4">
        <button
          onClick={runObfuscation}
          className="group relative px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/30 rounded-lg font-semibold text-white transform transition hover:scale-105 flex items-center gap-2"
        >
          <Zap className="w-5 h-5" />
          Obfuscate
        </button>
        <button
          onClick={runDeobfuscation}
          className="group relative px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold text-white transform transition hover:scale-105 flex items-center gap-2"
        >
          <ZapOff className="w-5 h-5" />
          Deobfuscate
        </button>
      </div>
    </div>
  )
}

const VisualizationView = ({ codeAnalysis, stats }) => {
  const mountRef = useRef(null)

  useEffect(() => {
    if (!mountRef.current) return
    const currentMount = mountRef.current

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    currentMount.appendChild(renderer.domElement)
    camera.position.z = 15

    const nucleusGeo = new THREE.IcosahedronGeometry(1, 3)
    const nucleusMat = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      wireframe: true,
      emissive: 0x00ffff,
      emissiveIntensity: 0.5,
    })
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat)
    scene.add(nucleus)

    const electronGroup = new THREE.Group()
    scene.add(electronGroup)
    const electronData = []
    const createElectron = (radius, color, size) => {
      const orbit = new THREE.Group()
      const geo = new THREE.SphereGeometry(size, 8, 8)
      const mat = new THREE.MeshBasicMaterial({ color })
      const electron = new THREE.Mesh(geo, mat)
      electron.position.x = radius
      orbit.add(electron)
      electronGroup.add(orbit)

      const trailGeo = new THREE.BufferGeometry()
      const trailMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5 })
      const trail = new THREE.Line(trailGeo, trailMat)
      orbit.add(trail)

      electronData.push({ orbit, speed: (Math.random() * 0.5 + 0.5) / radius, radius, trail })
    }

    Object.entries(codeAnalysis).forEach(([key, value]) => {
      for (let i = 0; i < value; i++) {
        if (key === "functions") createElectron(3 + i * 0.5, 0xff00ff, 0.2)
        if (key === "variables") createElectron(5 + i * 0.2, 0x00ff00, 0.1)
        if (key === "loops") createElectron(7 + i * 0.5, 0xffff00, 0.15)
        if (key === "conditionals") createElectron(8 + i * 0.5, 0xff8800, 0.15)
      }
    })

    const clock = new THREE.Clock()
    const animate = () => {
      requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()
      const chaos = stats.obfuscationLevel / 100

      nucleus.rotation.y = elapsedTime * 0.2
      nucleus.scale.setScalar(1 + Math.sin(elapsedTime) * 0.05 * (1 + chaos))

      electronData.forEach((data) => {
        const { orbit, speed, radius, trail } = data
        orbit.rotation.x += speed * 0.01 * (1 + chaos * Math.random())
        orbit.rotation.y += speed * 0.02 * (1 + chaos * Math.random())
        orbit.rotation.z = Math.sin(elapsedTime * speed) * chaos

        const points = []
        for (let i = 0; i <= 360; i += 10) {
          const theta = (i * Math.PI) / 180
          points.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0))
        }
        trail.geometry.setFromPoints(points)
      })

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight)
    }
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      if (currentMount) currentMount.innerHTML = ""
    }
  }, [codeAnalysis, stats.obfuscationLevel])

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-blue-200 mb-4 flex items-center gap-3 justify-center">
        <Globe className="w-8 h-8 text-blue-400" />
        Code Visualization
      </h1>
      <p className="text-gray-400 mb-8 text-center">
        3D model of the code's structural components and obfuscation entropy.
      </p>
      <div className="w-full h-[65vh] max-h-[700px] rounded-xl border border-blue-500/20 overflow-hidden bg-black/50 backdrop-blur-sm shadow-2xl shadow-blue-500/10 relative">
        <div ref={mountRef} className="w-full h-full" />
        <div className="absolute top-4 left-4 text-white bg-black/50 p-3 rounded-lg border border-gray-700 text-xs">
          <p className="font-semibold text-blue-300">
            Functions <span className="text-purple-400 ml-2 font-mono">{codeAnalysis.functions}</span>
          </p>
          <p className="font-semibold text-blue-300">
            Variables <span className="text-green-400 ml-2 font-mono">{codeAnalysis.variables}</span>
          </p>
          <p className="font-semibold text-blue-300">
            Loops <span className="text-yellow-400 ml-2 font-mono">{codeAnalysis.loops}</span>
          </p>
          <p className="font-semibold text-blue-300">
            Conditionals <span className="text-orange-400 ml-2 font-mono">{codeAnalysis.conditionals}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

const DashboardView = ({ stats, codeAnalysis }) => {
  const RadialChart = ({ percentage, color, label }) => {
    const radius = 50
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (percentage / 100) * circumference
    return (
      <div className="relative flex flex-col items-center justify-center">
        <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
          <circle cx="60" cy="60" r={radius} strokeWidth="10" className="stroke-gray-700" fill="transparent" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            strokeWidth="10"
            className={`stroke-current ${color}`}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.5s ease-out" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={`text-2xl font-bold ${color}`}>{percentage}%</span>
          <span className="text-xs text-gray-400">{label}</span>
        </div>
      </div>
    )
  }

  const MetricCard = ({ title, value, icon: Icon, color, suffix = "" }) => {
    const colorClasses = {
      cyan: "text-cyan-400",
      blue: "text-blue-400",
      green: "text-green-400",
      purple: "text-purple-400",
      orange: "text-orange-400",
      red: "text-red-400",
    }
    return (
      <div className="bg-black/40 p-4 rounded-xl border border-blue-500/20 backdrop-blur-sm flex items-center gap-4 transform transition hover:scale-105 hover:border-blue-500/50">
        <div className={`p-3 rounded-lg bg-gray-800/50 ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <div className="text-gray-400 text-sm">{title}</div>
          <div className={`text-2xl font-bold ${colorClasses[color]}`}>
            {value}
            {suffix}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-blue-200 mb-4 flex items-center gap-3 justify-center">
        <BarChart3 className="w-8 h-8 text-blue-400" />
        Dashboard
      </h1>
      <p className="text-gray-400 mb-8 text-center">Aggregate analysis of obfuscation performance.</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <MetricCard title="Total Obfuscations" value={stats.totalObfuscations} icon={Activity} color="cyan" />
          <MetricCard title="Lines Processed" value={stats.linesProcessed} icon={Terminal} color="blue" />
          <MetricCard title="Code Complexity" value={stats.codeComplexity} icon={Code} color="purple" />
          <MetricCard title="Obfuscation Level" value={stats.obfuscationLevel} icon={Zap} color="orange" suffix="%" />
        </div>
        <div className="bg-black/40 p-4 rounded-xl border border-blue-500/20 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
          <RadialChart percentage={stats.securityLevel} color="text-green-400" label="Security Level" />
          <RadialChart percentage={stats.performanceImpact} color="text-red-400" label="Performance Impact" />
        </div>
      </div>
      <div className="bg-black/40 rounded-xl p-6 border border-blue-500/20 backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-blue-100">
          <Code className="w-6 h-6 text-blue-400" />
          Last Run: Code Structure Analysis
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          {Object.entries(codeAnalysis).map(([key, value]) => (
            <div key={key} className="p-4 bg-black/30 rounded-lg border border-gray-600/50">
              <div className="text-2xl font-bold text-blue-200">{value}</div>
              <div className="text-sm text-gray-400 mt-1 capitalize">{key}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const LibraryView = ({ core }) => {
  const [activeTab, setActiveTab] = useState("arithmetic")

  const techniques = useMemo(
    () => ({
      arithmetic: {
        title: "Arithmetic Obfuscation",
        description:
          "This technique replaces simple numeric literals with more complex mathematical expressions that evaluate to the original number. It makes the code harder to read at a glance by obscuring the actual values being used.",
        pros: ["Hides constants and magic numbers.", "Simple to implement and low performance overhead."],
        cons: ["Easily reversed by compilers or simple analysis.", "Can slightly increase code size."],
        demoFunc: core.obfuscateNumbers,
        exampleCode: "let version = 10;\nlet retries = 30;",
      },
      predicates: {
        title: "Opaque Predicates",
        description:
          'Opaque predicates involve inserting conditional branches (like if statements) that always evaluate to the same result. This adds unnecessary complexity and "dead code" paths to confuse reverse engineers.',
        pros: [
          "Breaks linear code flow, confusing static analysis tools.",
          "Can be used to insert large amounts of dead code.",
        ],
        cons: [
          "Modern compilers may optimize away simple predicates.",
          "Can be fingerprinted if the same patterns are used repeatedly.",
        ],
        demoFunc: core.addOpaquePredicates,
        exampleCode: 'if true {\n    println!("Critical operation");\n}',
      },
      encryption: {
        title: "String Encryption",
        description:
          "This method hides string literals by encrypting them at compile-time and decrypting them only when needed at runtime. This prevents an attacker from easily finding sensitive information like API keys or error messages in the compiled binary.",
        pros: ["Effectively hides sensitive string data.", "Makes it much harder to understand the program's purpose."],
        cons: [
          "Adds runtime performance overhead due to decryption.",
          "Requires a decryption routine to be included in the binary.",
        ],
        demoFunc: core.encryptString,
        exampleCode: 'let api_key = "SECRET_KEY";\nlet message = "Hello World";',
      },
      splitting: {
        title: "String Splitting",
        description:
          "A simpler alternative to encryption, this technique breaks a single string literal into multiple smaller parts that are concatenated at runtime. This can prevent simple text searches for the full string within the compiled binary.",
        pros: ["Defeats basic string search tools.", "Very low performance impact compared to encryption."],
        cons: ["Easily defeated by more advanced analysis.", "Can make source code harder to maintain."],
        demoFunc: core.splitString,
        exampleCode: 'let command = "launch_missiles";',
      },
    }),
    [core],
  )

  const TechniqueDemo = ({ title, description, pros, cons, demoFunc, exampleCode }) => {
    const [input, setInput] = useState(exampleCode)
    const [output, setOutput] = useState("")
    const handleApply = () => setOutput(demoFunc(input))

    return (
      <div className="bg-black/30 p-6 rounded-lg border border-blue-500/20 animate-fade-in">
        <h3 className="text-2xl font-bold text-blue-300 mb-3">{title}</h3>
        <p className="text-gray-400 mb-4">{description}</p>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
              <PlusCircle className="w-5 h-5" /> Pros
            </h4>
            <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
              {pros.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
              <MinusCircle className="w-5 h-5" /> Cons
            </h4>
            <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
              {cons.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bg-black/40 p-4 rounded-lg border border-gray-600">
          <h4 className="font-semibold text-gray-200 mb-3">Interactive Demo</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-48 p-2 bg-gray-900 border border-gray-700 rounded font-mono text-xs focus:ring-1 focus:ring-blue-500 outline-none"
            />
            <textarea
              value={output}
              readOnly
              className="w-full h-48 p-2 bg-gray-900 border border-gray-700 rounded font-mono text-xs"
              placeholder="Result..."
            />
          </div>
          <button
            onClick={handleApply}
            className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-semibold text-sm transition"
          >
            Apply
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-blue-200 mb-4 flex items-center gap-3 justify-center">
        <BookOpen className="w-8 h-8 text-blue-400" />
        Techniques Library
      </h1>
      <p className="text-gray-400 mb-8 text-center">An interactive guide to the core transformation protocols.</p>
      <div className="flex justify-center mb-6">
        <div className="flex flex-wrap justify-center p-1 bg-gray-800/80 backdrop-blur-sm border border-blue-500/20 rounded-lg">
          {Object.keys(techniques).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-md transition text-sm sm:text-base capitalize ${activeTab === key ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30" : "hover:bg-gray-700"}`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>
      <div>{techniques[activeTab] && <TechniqueDemo {...techniques[activeTab]} />}</div>
    </div>
  )
}

// --- Main Application ---
const RustObfuscator = () => {
  const [activeView, setActiveView] = useState("obfuscator")
  const core = useObfuscationCore()
  const [stats, setStats] = useState({
    totalObfuscations: 0,
    linesProcessed: 0,
    securityLevel: 0,
    codeComplexity: 0,
    obfuscationLevel: 0,
    performanceImpact: 0,
  })
  const [codeAnalysis, setCodeAnalysis] = useState({
    functions: 1,
    variables: 2,
    loops: 0,
    conditionals: 1,
    strings: 2,
    comments: 0,
  })

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 font-sans relative overflow-hidden">
      <style>{`
                :root { --glow-color: #38bdf8; }
                .animate-fade-in { animation: fadeIn 0.5s ease-in-out forwards; }
                .animate-fade-in-down { animation: fadeInDown 0.5s ease-in-out forwards; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-nav-pulse { animation: navPulse 2s infinite; }
                @keyframes navPulse { 0%, 100% { box-shadow: 0 0 5px 0px var(--glow-color); } 50% { box-shadow: 0 0 15px 3px var(--glow-color); } }
            `}</style>
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, var(--glow-color), transparent 30%), radial-gradient(circle at 75% 75%, var(--glow-color), transparent 30%)",
        }}
      />
      <div className="absolute inset-0 z-0 bg-black" />

      <div className="max-w-7xl mx-auto relative z-10">
        <Header />
        <Navigation activeView={activeView} setActiveView={setActiveView} />
        <main>
          {activeView === "obfuscator" && (
            <ObfuscatorView core={core} stats={stats} setStats={setStats} setCodeAnalysis={setCodeAnalysis} />
          )}
          {activeView === "visualization" && <VisualizationView codeAnalysis={codeAnalysis} stats={stats} />}
          {activeView === "dashboard" && <DashboardView stats={stats} codeAnalysis={codeAnalysis} />}
          {activeView === "library" && <LibraryView core={core} />}
        </main>
      </div>
    </div>
  )
}

export default RustObfuscator
