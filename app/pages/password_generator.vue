<template>
    <div class="min-h-screen p-5 bg-base-200">
        <div class="container mx-auto">
            <div class="card card-lg w-full max-w-lg mx-auto text-primary bg-base-100 border border-base-300 shadow-lg">
                <div class="card-body">
                    <h1 class="card-title text-2xl">随机密码生成器</h1>

                    <div
                        class="mt-3 px-3 py-6 bg-gradient-to-br from-gray-50 to-pink-50 border border-pink-100 rounded-lg">
                        <div class="flex flex-col space-y-2">
                            <div class="flex flex-wrap w-full px-2 py-1 space-x-3 items-center">
                                <span class="text-primary/90">使用字符：</span>
                                <div class="flex space-x-2">
                                    <label class="label">
                                        <input type="checkbox" class="checkbox" value="0" v-model="use_char" />
                                        0-9
                                    </label>
                                    <label class="label">
                                        <input type="checkbox" class="checkbox" value="1" v-model="use_char" />
                                        a-z
                                    </label>
                                    <label class="label">
                                        <input type="checkbox" class="checkbox" value="2" v-model="use_char" />
                                        A-Z
                                    </label>
                                    <label class="label">
                                        <input type="checkbox" class="checkbox" value="3" v-model="use_char" />
                                        特殊符号
                                    </label>
                                </div>
                            </div>

                            <label class="input input-primary w-full">
                                <span class="label text-primary/90">密码长度</span>
                                <input type="number" v-model="password_length" min="6" max="100"></input>
                            </label>

                            <label class="input input-primary w-full">
                                <span class="label text-primary/90">包含字符</span>
                                <input type="text" v-model="include_char" placeholder="可空"></input>
                            </label>

                            <label class="input input-primary w-full">
                                <span class="label text-primary/90">排除字符</span>
                                <input type="text" v-model="exclude_char"></input>
                            </label>


                            <div class="mt-3 card-actions justify-end">
                                <button @click="generate_password()"
                                    class="btn bg-primary text-white hover:bg-primary/90 hover:scale-105">生成密码</button>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 flex flex-col">
                        <h2 class="text-xl font-semibold">生成结果</h2>

                        <div
                            class="mt-2 p-4 min-h-20 bg-gradient-to-br text-secondary-content text-2xl from-blue-50 to-indigo-50 border border-blue-100 rounded-lg break-words">
                            <a v-if="loading"><span class="loading loading-spinner loading-md mr-2"></span>加载中</a>
                            <a v-else>{{ result }}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const use_char = ref(["0", "1", "2"])
const include_char = ref('')
const exclude_char = ref('0oO1iIlLq9g')
const password_length = ref(14)
const loading = ref(false)
const result = ref('')

async function generate_password() {
    loading.value = true

    let s = ''
    if (use_char.value.includes("0")) {
        s += '0123456789'
    }
    if (use_char.value.includes("1")) {
        s += 'abcdefghijklmnopqrstuvwxyz'
    }
    if (use_char.value.includes("2")) {
        s += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    }
    if (use_char.value.includes("3")) {
        s += '!@#$%^&*()'
    }
    const union = Array.from(new Set(s + include_char.value))
    s = union.filter(char => !exclude_char.value.includes(char)).join('')

    let index_list = []
    try {
        index_list = await $fetch('/api/random_numbers', {
            method: 'post',
            body: {
                min: 0,
                max: s.length - 1,
                blocks: password_length.value
            },
            timeout: 10000,
            retry: 1
        })

        let t = ''
        for (let i = 0; i < index_list.length; i++) {
            t += s[index_list[i]]
        }
        result.value = t
    } catch (error) {
        console.error('请求失败:', error)
        result.value = '生成随机数失败，请重试'
    } finally {
        loading.value = false
    }
}
</script>