const fileInput = document.getElementById("fileInput")
const uploadZone = document.getElementById("uploadZone")
const filePreview = document.getElementById("filePreview")
const thumb = document.getElementById("thumb")
const fileName = document.getElementById("fileName")
const btnAnalyze = document.getElementById("btnAnalyze")
const loadingOverlay = document.getElementById("loadingOverlay")

let selectedFile = null

uploadZone.addEventListener("click", () => fileInput.click())

fileInput.addEventListener("change", (e) => {
  if (e.target.files.length > 0) handleFile(e.target.files[0])
})

uploadZone.addEventListener("dragover", (e) => {
  e.preventDefault()
  uploadZone.classList.add("dragover")
})
uploadZone.addEventListener("dragleave", () =>
  uploadZone.classList.remove("dragover"),
)
uploadZone.addEventListener("drop", (e) => {
  e.preventDefault()
  uploadZone.classList.remove("dragover")
  if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0])
})

function handleFile(file) {
  if (!file.type.match(/image\/(png|jpg|jpeg)/)) {
    alert("Format file harus PNG, JPG, atau JPEG")
    return
  }
  selectedFile = file
  fileName.textContent = file.name

  const reader = new FileReader()
  reader.onload = (e) => {
    thumb.style.backgroundImage = `url(${e.target.result})`
  }
  reader.readAsDataURL(file)

  filePreview.style.display = "flex"
  btnAnalyze.disabled = false
}

btnAnalyze.addEventListener("click", async () => {
  if (!selectedFile) return
  loadingOverlay.style.display = "flex"

  const formData = new FormData()
  formData.append("file", selectedFile)

  try {
    const response = await fetch("/klasifikasi", {
      method: "POST",
      body: formData,
    })
    const data = await response.json()

    if (data.error) {
      alert("Error: " + data.error)
      return
    }
    renderResult(data)
    loadHistory()
  } catch (err) {
    alert("Gagal terhubung ke server: " + err.message)
  } finally {
    loadingOverlay.style.display = "none"
  }
})

function renderResult(data) {
  document.getElementById("resultTime").textContent = data.waktu

  const cls = data.color

  // Icon berdasarkan kelas diagnosis
  const icons = {
    segar: {
      path: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
      color: "#4ADE80",
    },
    busuk: {
      path: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
      color: "#F87171",
    },
    blackspot: {
      path: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
      color: "#FBBF24",
    },
    berpenyakit: {
      path: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
      color: "#FB923C",
    },
  }

  const icon = icons[cls] || icons["busuk"]

  // Mapping penamaan label di UI web
  const labelDisplay = {
    freshoranges: "Segar",
    rottenoranges: "Busuk",
    blackspot: "Bintik Hitam",
    berpenyakit: "Berpenyakit",
    fresh: "Segar",
    rotten: "Busuk",
  }

  const colorDisplay = {
    freshoranges: "#4ADE80",
    rottenoranges: "#F87171",
    blackspot: "#FBBF24",
    berpenyakit: "#FB923C",
    fresh: "#4ADE80",
    rotten: "#F87171",
  }

  // 1. Render Hasil Utama ke resultBody
  document.getElementById("resultBody").innerHTML = `
        <div class="verdict">
            <div class="verdict-icon ${cls}">
                <svg viewBox="0 0 24 24" fill="none" stroke="${icon.color}"
                     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    ${icon.path}
                </svg>
            </div>
            <div class="verdict-info">
                <div class="verdict-label ${cls}">${data.label}</div>
                <div class="verdict-sub">${data.label_full}</div>
            </div>
            <div class="verdict-conf-side">
                <div class="verdict-conf-val ${cls}">${data.confidence}%</div>
                <div class="verdict-conf-label">confidence</div>
            </div>
        </div>
    `

  // 2. Render Bar Probabilitas ke Elemen probaContainer Secara Terpisah
  let barsHTML = ""
  if (data.all_proba) {
    for (const [key, val] of Object.entries(data.all_proba)) {
      const barColor = colorDisplay[key] || "#888"
      const dispName = labelDisplay[key] || key
      barsHTML += `
            <div class="confidence-bar-wrap" style="background: #1a1a1a; padding: 12px; border-radius: 8px; border: 1px solid #333; margin-bottom: 8px;">
                <div class="conf-row" style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 6px;">
                    <span class="conf-label" style="color: #fff">${dispName}</span>
                    <span class="conf-val" style="color:${barColor}">${val}%</span>
                </div>
                <div class="bar-track" style="background: #333; height: 8px; border-radius: 4px; overflow: hidden;">
                    <div class="bar-fill" style="width:${val}%; background:${barColor}; height: 100%; border-radius: 4px; transition: width 0.5s ease-in-out;"></div>
                </div>
            </div>
        `
    }

    // Temukan kontainer "Nilai Probabilitas Klasifikasi" di HTML Anda
    const probaBox = document.getElementById("probaContainer")
    if (probaBox) {
      probaBox.innerHTML = barsHTML
    }
  }

  // Baris pemanggilan data.fitur JST lama di bagian ini sudah dihapus bersih agar tidak crash!
}

async function loadHistory() {
  try {
    const response = await fetch("/riwayat")
    const data = await response.json()
    const list = document.getElementById("historyList")

    if (data.length === 0) {
      list.innerHTML = '<div class="placeholder-small">Belum ada riwayat</div>'
      return
    }

    const dotColor = {
      SEGAR: "#4ADE80",
      BUSUK: "#F87171",
      "BINTIK HITAM": "#FBBF24",
      BERPENYAKIT: "#FB923C",
    }

    list.innerHTML = data
      .map((item) => {
        const color = dotColor[item.label] || "#888"
        return `
        <div class="hist-item">
          <div class="hist-dot" style="background:${color}; flex-shrink:0;"></div>
          <div class="hist-info">
            <div class="hist-name">${item.filename}</div>
            <div class="hist-verdict" style="color:${color}">${item.label}</div>
          </div>
          <div class="hist-conf">${item.confidence}%</div>
        </div>
      `
      })
      .join("")
  } catch (err) {
    console.error("Gagal load history:", err)
  }
}

loadHistory()
