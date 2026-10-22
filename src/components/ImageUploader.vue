<script setup>
import { ref } from 'vue'
import { asset } from '@/utils/asset.js'

/**
 * 图片上传组件（网页编辑器用）。
 * - existing：已在仓库里的图片路径（相对 public/，如 images/travel/xx.jpg）
 * - pending ：本次新选、尚未上传的图片 [{ name, base64 }]
 * 上传动作由父组件在「保存」时执行，本组件只负责选图 + 客户端压缩 + 预览。
 */
const props = defineProps({
  existing: { type: Array, default: () => [] },
  pending: { type: Array, default: () => [] },
  dir: { type: String, default: 'images/travel' },
  multiple: { type: Boolean, default: false },
})
const emit = defineEmits(['add', 'remove-existing', 'remove-pending'])

const inputEl = ref(null)

// 客户端压缩：限制最长边 1600px，输出 JPEG（base64）
function compress(file, maxW = 1600, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width)
        const w = Math.max(1, Math.round(img.width * scale))
        const h = Math.max(1, Math.round(img.height * scale))
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        const base64 = canvas.toDataURL('image/jpeg', quality).split(',')[1]
        const prefix = props.dir.split('/').pop() || 'img'
        const name = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.jpg`
        resolve({ name, base64 })
      }
      img.onerror = () => reject(new Error('图片读取失败'))
      img.src = e.target.result
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsDataURL(file)
  })
}

async function onChange(e) {
  const files = [...e.target.files]
  const out = []
  for (const f of files) {
    try {
      out.push(await compress(f))
    } catch (err) {
      /* 跳过无法读取的文件 */
    }
  }
  if (out.length) emit('add', out)
  e.target.value = '' // 允许再次选择同一个文件
}
</script>

<template>
  <div>
    <div v-if="existing.length || pending.length" class="grid grid-cols-3 gap-2 sm:grid-cols-4">
      <!-- 已存在图片 -->
      <div v-for="img in existing" :key="img" class="group relative">
        <img :src="asset(img)" class="aspect-square w-full rounded-lg object-cover" alt="" />
        <button
          type="button"
          class="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-[11px] text-white opacity-0 transition group-hover:opacity-100"
          @click="emit('remove-existing', img)"
        >
          ✕
        </button>
      </div>
      <!-- 待上传图片 -->
      <div v-for="p in pending" :key="p.name" class="group relative">
        <img :src="'data:image/jpeg;base64,' + p.base64" class="aspect-square w-full rounded-lg object-cover" alt="" />
        <button
          type="button"
          class="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-[11px] text-white opacity-0 transition group-hover:opacity-100"
          @click="emit('remove-pending', p.name)"
        >
          ✕
        </button>
      </div>
    </div>

    <input ref="inputEl" type="file" accept="image/*" :multiple="multiple" class="hidden" @change="onChange" />
    <button
      type="button"
      class="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-dashed border-border-strong px-4 py-2.5 text-sm text-secondary transition hover:text-primary"
      @click="inputEl.click()"
    >
      ＋ 上传图片
    </button>
    <p class="mt-1 text-xs text-muted">自动压缩（最长 1600px），保存后随站点一起发布</p>
  </div>
</template>
