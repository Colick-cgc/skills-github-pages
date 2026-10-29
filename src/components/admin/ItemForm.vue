<script setup>
import { reactive, ref, computed } from 'vue'
import ImageUploader from '@/components/ImageUploader.vue'

/**
 * 内容编辑表单：根据 type 渲染不同字段。
 * initial 为 null 表示「新增」，否则表示「编辑」。
 * 提交时 emit('submit', { type, data, uploads })，其中 uploads 是待上传的新图片。
 */
const props = defineProps({
  type: { type: String, required: true },
  initial: { type: Object, default: null },
})
const emit = defineEmits(['submit', 'cancel'])

const EMPTY = {
  papers: () => ({
    id: '', title: '', authors: '', venue: '', date: '', tags: '', summary: '',
    coreProblem: '', method: '', understanding: '', questions: '', nextSteps: '', links: '',
  }),
  journal: () => ({
    id: '', date: '', title: '', tags: '', mood: '', summary: '', content: '', image: '',
  }),
  reading: () => ({
    id: '', category: 'book', title: '', type: '', creator: '', date: '', tags: '',
    rating: 5, synopsis: '', thoughts: '', quote: '', memorableScene: '',
  }),
  travel: () => ({
    id: '', title: '', location: '', date: '', tags: '', text: '', images: [],
  }),
}

const form = reactive(EMPTY[props.type]())
const removedImages = ref([]) // 被移除的「已存在」图片
const newImages = ref([]) // 本次新选待上传 [{ name, base64 }]

// 用初始值填充（编辑模式）
if (props.initial) {
  const it = props.initial
  form.id = it.id || ''
  form.title = it.title || ''
  form.date = it.date || ''
  form.tags = (it.tags || []).join('、')
  if (props.type === 'papers') {
    form.authors = (it.authors || []).join('、')
    form.venue = it.venue || ''
    form.summary = it.summary || ''
    form.coreProblem = it.coreProblem || ''
    form.method = it.method || ''
    form.understanding = it.understanding || ''
    form.questions = it.questions || ''
    form.nextSteps = it.nextSteps || ''
    form.links = (it.links || [])
      .map((l) => (l.url ? `${l.label || ''}|${l.url}` : ''))
      .filter(Boolean)
      .join('\n')
  } else if (props.type === 'journal') {
    form.mood = it.mood || ''
    form.summary = it.summary || ''
    form.content = it.content || ''
    form.image = it.image || ''
  } else if (props.type === 'reading') {
    form.category = it.category || 'book'
    form.type = it.type || ''
    form.creator = it.creator || ''
    form.rating = it.rating || 5
    form.synopsis = it.synopsis || ''
    form.thoughts = it.thoughts || ''
    form.quote = it.quote || ''
    form.memorableScene = it.memorableScene || ''
  } else if (props.type === 'travel') {
    form.location = it.location || ''
    form.text = it.text || ''
    form.images = [...(it.images || [])]
  }
}

const typeName = computed(
  () => ({ papers: '论文', journal: '日记', reading: '读书观影', travel: '旅行' }[props.type]),
)

// 图片目录：日记单图存 images/journal，旅行存 images/travel
const dir = computed(() => (props.type === 'journal' ? 'images/journal' : 'images/travel'))

function splitList(s) {
  return (s || '')
    .split(/[,，、\n]/)
    .map((x) => x.trim())
    .filter(Boolean)
}
function parseLinks(s) {
  return (s || '')
    .split('\n')
    .map((line) => {
      const i = line.indexOf('|')
      return i >= 0
        ? { label: line.slice(0, i).trim(), url: line.slice(i + 1).trim() }
        : { label: '', url: line.trim() }
    })
    .filter((l) => l.url)
}
function newId() {
  const prefix = { papers: 'p', journal: 'j', reading: 'r', travel: 't' }[props.type]
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 5)
}

function buildData() {
  const base = { id: form.id || newId(), date: form.date, title: form.title, tags: splitList(form.tags) }
  if (props.type === 'papers') {
    return {
      ...base,
      authors: splitList(form.authors),
      venue: form.venue,
      summary: form.summary,
      coreProblem: form.coreProblem,
      method: form.method,
      understanding: form.understanding,
      questions: form.questions,
      nextSteps: form.nextSteps,
      links: parseLinks(form.links),
    }
  }
  if (props.type === 'journal') {
    return { ...base, mood: form.mood, summary: form.summary, content: form.content, image: form.image }
  }
  if (props.type === 'reading') {
    return {
      ...base,
      category: form.category,
      type: form.type,
      creator: form.creator,
      rating: Number(form.rating),
      synopsis: form.synopsis,
      thoughts: form.thoughts,
      quote: form.quote,
      memorableScene: form.memorableScene,
    }
  }
  // travel
  return {
    ...base,
    location: form.location,
    text: form.text,
    images: form.images.filter((i) => !removedImages.value.includes(i)),
  }
}

function onSubmit() {
  if (!form.title || !form.date) {
    window.alert('请至少填写「标题」和「日期」')
    return
  }
  const data = buildData()
  const uploads = newImages.value.map((p) => ({
    filename: p.name,
    base64: p.base64,
    targetPath: `public/${dir.value}/${p.name}`,
    jsonPath: `${dir.value}/${p.name}`,
  }))
  emit('submit', { type: props.type, data, uploads })
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between border-b border-border pb-4">
      <h2 class="text-lg font-semibold">
        {{ initial ? '编辑' : '新增' }}{{ typeName }}
      </h2>
      <button class="text-sm text-muted hover:text-primary" @click="emit('cancel')">取消 ✕</button>
    </div>

    <div class="mt-4 flex flex-col gap-4">
      <!-- 通用字段 -->
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="admin-label">标题 *</label>
          <input v-model="form.title" class="admin-input mt-1" placeholder="标题" />
        </div>
        <div>
          <label class="admin-label">日期 *</label>
          <input v-model="form.date" type="date" class="admin-input mt-1" />
        </div>
      </div>
      <div>
        <label class="admin-label">标签（用顿号 / 逗号分隔）</label>
        <input v-model="form.tags" class="admin-input mt-1" placeholder="如：CFD、路径规划" />
      </div>

      <!-- 论文 -->
      <template v-if="type === 'papers'">
        <div>
          <label class="admin-label">作者（顿号分隔）</label>
          <input v-model="form.authors" class="admin-input mt-1" placeholder="作者一、作者二" />
        </div>
        <div>
          <label class="admin-label">期刊 / 会议</label>
          <input v-model="form.venue" class="admin-input mt-1" placeholder="期刊或会议名称" />
        </div>
        <div>
          <label class="admin-label">一句话摘要</label>
          <input v-model="form.summary" class="admin-input mt-1" placeholder="首页信息流显示" />
        </div>
        <div>
          <label class="admin-label">核心问题</label>
          <textarea v-model="form.coreProblem" class="admin-input mt-1" rows="2" />
        </div>
        <div>
          <label class="admin-label">方法</label>
          <textarea v-model="form.method" class="admin-input mt-1" rows="2" />
        </div>
        <div>
          <label class="admin-label">我的理解</label>
          <textarea v-model="form.understanding" class="admin-input mt-1" rows="3" />
        </div>
        <div>
          <label class="admin-label">疑问</label>
          <textarea v-model="form.questions" class="admin-input mt-1" rows="2" />
        </div>
        <div>
          <label class="admin-label">后续计划</label>
          <textarea v-model="form.nextSteps" class="admin-input mt-1" rows="2" />
        </div>
        <div>
          <label class="admin-label">相关链接（每行一个：标题|网址）</label>
          <textarea v-model="form.links" class="admin-input mt-1" rows="2" placeholder="arXiv|https://arxiv.org/abs/xxxx" />
        </div>
      </template>

      <!-- 日记 -->
      <template v-else-if="type === 'journal'">
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="admin-label">心情</label>
            <input v-model="form.mood" class="admin-input mt-1" placeholder="平静 / 开心 / 焦虑…" />
          </div>
          <div>
            <label class="admin-label">摘要</label>
            <input v-model="form.summary" class="admin-input mt-1" placeholder="列表里显示的一句话" />
          </div>
        </div>
        <div>
          <label class="admin-label">正文（空行分段）</label>
          <textarea v-model="form.content" class="admin-input mt-1" rows="10" placeholder="第一段&#10;&#10;第二段" />
        </div>
        <div>
          <label class="admin-label">配图（可选，一张）</label>
          <ImageUploader
            :existing="form.image ? [form.image] : []"
            :pending="newImages"
            dir="images/journal"
            :multiple="false"
            @add="newImages.push(...$event)"
            @remove-existing="form.image = ''"
            @remove-pending="newImages = newImages.filter((p) => p.name !== $event)"
          />
        </div>
      </template>

      <!-- 读书观影 -->
      <template v-else-if="type === 'reading'">
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="admin-label">分类</label>
            <select v-model="form.category" class="admin-input mt-1">
              <option value="book">读书心得</option>
              <option value="video">视频与纪录片</option>
            </select>
          </div>
          <div>
            <label class="admin-label">评分（1–5）</label>
            <select v-model.number="form.rating" class="admin-input mt-1">
              <option :value="n" v-for="n in 5" :key="n">{{ n }} 星</option>
            </select>
          </div>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="admin-label">类型</label>
            <input v-model="form.type" class="admin-input mt-1" placeholder="小说 / 纪录片 / 电影…" />
          </div>
          <div>
            <label class="admin-label">作者 / 导演</label>
            <input v-model="form.creator" class="admin-input mt-1" />
          </div>
        </div>
        <div>
          <label class="admin-label">梗概</label>
          <textarea v-model="form.synopsis" class="admin-input mt-1" rows="3" />
        </div>
        <div>
          <label class="admin-label">我的思考</label>
          <textarea v-model="form.thoughts" class="admin-input mt-1" rows="4" />
        </div>
        <div v-if="form.category === 'book'">
          <label class="admin-label">摘抄</label>
          <textarea v-model="form.quote" class="admin-input mt-1" rows="3" />
        </div>
        <div v-else>
          <label class="admin-label">印象最深的片段</label>
          <textarea v-model="form.memorableScene" class="admin-input mt-1" rows="3" />
        </div>
      </template>

      <!-- 旅行 -->
      <template v-else-if="type === 'travel'">
        <div>
          <label class="admin-label">地点</label>
          <input v-model="form.location" class="admin-input mt-1" placeholder="如：福建 · 厦门" />
        </div>
        <div>
          <label class="admin-label">回忆文字（空行分段）</label>
          <textarea v-model="form.text" class="admin-input mt-1" rows="6" />
        </div>
        <div>
          <label class="admin-label">照片（可多张）</label>
          <ImageUploader
            :existing="form.images.filter((i) => !removedImages.includes(i))"
            :pending="newImages"
            dir="images/travel"
            :multiple="true"
            @add="newImages.push(...$event)"
            @remove-existing="removedImages.push($event)"
            @remove-pending="newImages = newImages.filter((p) => p.name !== $event)"
          />
        </div>
      </template>

      <!-- 提交 -->
      <div class="flex justify-end gap-3 border-t border-border pt-4">
        <button class="rounded-xl px-4 py-2 text-sm text-secondary hover:text-primary" @click="emit('cancel')">
          取消
        </button>
        <button
          class="rounded-xl bg-accent px-5 py-2 text-sm font-medium text-[color:var(--on-accent)] transition hover:opacity-90"
          @click="onSubmit"
        >
          保存
        </button>
      </div>
    </div>
  </div>
</template>
