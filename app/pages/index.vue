<template>
  <div class="min-h-screen p-5 bg-base-200">
    <div class="container mx-auto">
      <div class="card card-lg w-full max-w-lg mx-auto text-primary bg-base-100 border border-base-300 shadow-lg">
        <div class="card-body">
          <h1 class="card-title text-2xl">宇宙无敌真·随机 mini</h1>
          <a onclick="information_modal.showModal()" class="absolute top-3 right-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
              class="w-6 h-6 cursor-pointer hover:text-primary/90">
              <path fill-rule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                clip-rule="evenodd" />
            </svg>
          </a>

          <div class="mt-3 px-3 py-6 bg-gradient-to-br from-gray-50 to-pink-50 border border-pink-100 rounded-lg">
            <div class="flex flex-col space-y-2">
              <label class="input input-primary w-full tooltip" data-tip="最小值(min)，整数类型，范围 ±1e15">
                <span class="label text-primary/90">最小值</span>
                <input type="number" v-model="min" min="-1e15" max="1e15"></input>
              </label>

              <label class="input input-primary w-full tooltip" data-tip="最大值(max)，整数类型，范围 ±1e15">
                <span class="label text-primary/90">最大值</span>
                <input type="number" v-model="max" min="-1e15" max="1e15"></input>
              </label>

              <label class="input input-primary w-full tooltip" data-tip="生成数量(blocks)，整数类型，范围 [1, 100]">
                <span class="label text-primary/90">生成数量</span>
                <input type="number" v-model="blocks" min="1" max="100" class="validator"></input>
              </label>

              <div class="mt-3 card-actions justify-end">
                <button @click="generate_random_numbers()"
                  class="btn bg-primary text-white hover:bg-primary/90 hover:scale-105">生成随机数</button>
              </div>
            </div>
          </div>

          <div class="mt-6 flex flex-col">
            <h2 class="text-xl font-semibold">生成结果</h2>

            <div
              class="mt-2 p-4 min-h-20 bg-gradient-to-br text-secondary-content from-blue-50 to-indigo-50 border border-blue-100 rounded-lg">
              <a v-if="loading"><span class="loading loading-spinner loading-md mr-2"></span>加载中</a>
              <div v-else class="flex flex-wrap gap-1">
                <span v-for="num in result" class="px-2 py-1 rounded bg-secondary">{{ num }}</span>
              </div>
            </div>

            <p v-if="lastTime" class="mt-2">生成时间：{{ lastTime }}</p>
          </div>
        </div>

        <dialog id="information_modal" class="modal">
          <div class="modal-box space-y-2">
            <h3 class="text-xl font-semibold">CappuccinoZ/random</h3>
            <p>输入最小值(min)、最大值(max)与生成数量(blocks)后，点击“生成随机数”即可生成随机数。</p>
            <p>确保min、max与blocks是整数，blocks范围 [1, 100]，min和max范围 ±1e15，且 max >= min。</p>
            <p>算法：min + (range*q >> k)，range是生成随机数的区间长度, q是从QRNG API获取的量子随机数，k是右移位数。</p>
            <p>链接：
              <a class="link" href="https://github.com/CappuccinoZ/random">GitHub项目地址</a> |
              <a class="link" href="https://outshift.cisco.com/quantum-random-number-generator">QRNG API</a>
            </p>
            <p>工具：
              <a class="link" href="/randompassword">密码生成器</a>
            </p>
          </div>
          <form method="dialog" class="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>

        <dialog id="alert_modal" class="modal">
          <div class="modal-box">
            <h3>{{ message }}</h3>
          </div>
          <form method="dialog" class="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
const min = ref(1)
const max = ref(10)
const blocks = ref(1)
const loading = ref(false)
const result = ref([])
const message = ref(null)
const lastTime = ref('')

function checkInput1() {
  if (min.value === '' || max.value === '' || blocks === '') {
    return '缺少参数: min, max, blocks'
  }

  if (typeof min.value !== 'number' || !Number.isInteger(min.value) ||
    (min.value < -1e15 || min.value > 1e15)) {
    return '最小值(min)必须是整数，且范围 ±1e15'
  }

  if (typeof max.value !== 'number' || !Number.isInteger(max.value) ||
    (max.value < -1e15 || max.value > 1e15)) {
    return '最大值(max)必须是整数，且范围 ±1e15'
  }

  if (max.value < min.value) {
    return '应满足: max >= min'
  }

  if (typeof blocks.value !== 'number' || !Number.isInteger(blocks.value) ||
    (blocks.value < 1 || blocks.value > 100)) {
    return '生成数量(blocks)必须是整数，且范围 [1, 100]'
  }

  return null
}

async function generate_random_numbers() {
  const now = new Date().toLocaleString()
  message.value = checkInput1()
  if (message.value) {
    alert_modal.showModal()
    return
  }

  loading.value = true

  try {
    result.value = await $fetch('/api/random_numbers', {
      method: 'post',
      body: {
        min: min.value,
        max: max.value,
        blocks: blocks.value
      },
      timeout: 10000,
      retry: 1
    })
  } catch (error) {
    console.error('请求失败:', error)
    message.value = '生成随机数失败，请重试'
    alert_modal.showModal()
    result.value = []
  } finally {
    lastTime.value = now
    loading.value = false
  }
}
</script>