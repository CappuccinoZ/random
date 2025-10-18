<template>
  <div class="min-h-screen w-screen p-5 bg-gray-50">
    <div class="card card-lg w-100 mx-auto bg-white text-sakura shadow-lg">
      <div class="card-body">
        <h1 class="card-title text-2xl">宇宙无敌真·随机 mini</h1>
        <a onclick="information_modal.showModal()"
          class="absolute top-3 right-3 flex items-center justify-center rounded-full cursor-pointer hover:bg-sakura/10">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
            stroke="currentColor" class="w-6 h-6 font-semibold">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
        </a>

        <dialog id="information_modal" class="modal">
          <div class="modal-box space-y-2">
            <h3 class="text-xl font-semibold">README</h3>
            <p>输入最小值(min)、最大值(max)与生成数量(blocks)后，点击“生成随机数”即可生成随机数。</p>
            <p>确保min、max与blocks是整数，blocks范围1~100，range = (max-min+1)范围1~1048575。</p>
            <p>算法：min + (range*num >> 30)，range是生成随机数的区间长度(不超过20位), num是从QRNG API获取的量子随机数(30位)。</p>
            <p>QRNG API地址：<a
                href="https://outshift.cisco.com/quantum-random-number-generator">https://outshift.cisco.com/quantum-random-number-generator</a>
            </p>
          </div>
          <form method="dialog" class="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>

        <div class="mt-3 px-3 py-6 rounded-lg bg-gradient-to-br from-gray-50 to-pink-50 border border-gray-200">
          <div class="flex flex-col space-y-2">
            <label class="input">
              <span class="label">最小值</span>
              <input type="number" v-model="min"></input>
            </label>

            <label class="input">
              <span class="label">最大值</span>
              <input type="number" v-model="max"></input>
            </label>

            <label class="input">
              <span class="label">生成数量</span>
              <input type="number" v-model="blocks" placeholder="1 ~ 100" min="1" max="100" class="validator"></input>
            </label>

            <div class="mt-3 card-actions justify-end">
              <button @click="generate_random_numbers()"
                class="btn bg-sakura text-white rounded-lg hover:bg-sakura/90 hover:scale-105">生成随机数</button>
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

        <div class="flex flex-col mt-6">
          <h2 class="text-xl font-semibold">生成结果</h2>

          <div
            class="mt-2 min-h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100 text-blue-800">
            <a v-if="loading"><span class="loading loading-spinner loading-md bg-blue-800 mr-2"></span>加载中</a>
            <div v-else class="flex flex-wrap gap-1">
              <span v-for="num in result" class="px-2 py-1 rounded bg-blue-100 ">{{ num }}</span>
            </div>
          </div>
        </div>
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

const range = computed(() => {
  return max.value - min.value + 1
})

function checkInput1() {
  if (min.value === '' || max.value === '' || blocks === '') {
    return '缺少参数: min, max, blocks'
  }

  if (typeof min.value !== 'number' || !Number.isInteger(min.value)) {
    return 'min 必须是整数'
  }

  if (typeof max.value !== 'number' || !Number.isInteger(max.value)) {
    return 'max 必须是整数'
  }

  if (typeof blocks.value !== 'number' || !Number.isInteger(blocks.value) ||
    (blocks.value < 1 || blocks.value > 100)) {
    return 'blocks 必须是整数，且 1 <= blocks <= 100'
  }

  if (range.value < 1 || range.value > 104_8575) {
    return 'range = (max-min+1) 应满足: 1 <= range <= 104,8575'
  }

  return null
}

async function generate_random_numbers() {
  message.value = checkInput1()
  if (message.value) {
    alert_modal.showModal()
    return
  }

  loading.value = true

  result.value = await $fetch('/api/random_numbers', {
    method: 'post',
    body: {
      min: min.value,
      range: range.value,
      blocks: blocks.value
    }
  })

  loading.value = false
}
</script>