interface RandomNumber {
    decimal: string;
}

interface Data {
    encoding: string;
    random_numbers: RandomNumber[];
}

interface RequestBody {
    min: number;
    max: number;
    blocks: number;
}

function checkInput2(min: number, max: number, blocks: number) {
    if (min === undefined || max === undefined || blocks === undefined) {
        return '缺少参数: min, range, blocks'
    }

    if (typeof min !== 'number' || !Number.isInteger(min) ||
        (min < -1e15 || min > 1e15)) {
        return '最小值(min)必须是整数，且范围 ±1e15'
    }

    if (typeof max !== 'number' || !Number.isInteger(max) ||
        (max < -1e15 || max > 1e15)) {
        return '最大值(max)必须是整数，且范围 ±1e15'
    }

    if (max < min) {
        return '应满足: max >= min'
    }

    if (typeof blocks !== 'number' || !Number.isInteger(blocks) ||
        (blocks < 1 || blocks > 100)) {
        return '生成数量(blocks)必须是整数，且范围 [1, 100]'
    }

    return null
}

function convert(data: Data, min: number, range: number, k: number) {
    const result: number[] = []

    const random_numbers = data.random_numbers
    for (let i = 0; i < random_numbers.length; i++) {
        const q = +random_numbers[i].decimal
        const a = min + Number((BigInt(range) * BigInt(q)) >> BigInt(k))
        result.push(a)
    }

    return result
}

export default defineEventHandler(async (event) => {
    const { min, max, blocks }: RequestBody = await readBody(event)
    const message = checkInput2(min, max, blocks)
    if (message) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: message
        })
    }
    
    const range = max - min + 1
    const k = range <= 1024 ? 20 : Math.ceil(Math.log2(range)) + 10

    const runtimeConfig = useRuntimeConfig()
    const api_secret = runtimeConfig.randomApiSecret
    const api_base = runtimeConfig.public.randomApiBase

    const data: Data = await $fetch(api_base, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-id-api-key': api_secret
        },
        body: {
            encoding: 'raw',
            format: 'decimal',
            bits_per_block: k,
            number_of_blocks: blocks
        }
    })

    const result = convert(data, min, range, k)

    return result
})