interface RandomNumber {
    decimal: string;
}

interface Data {
    encoding: string;
    random_numbers: RandomNumber[];
}

interface RequestBody {
    min: number;
    range: number;
    blocks: number;
}

function throwBadRequest(message: string) {
    throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: message
    })
}

function checkInput2(min: number, range: number, blocks: number) {
    if (min === undefined || range === undefined || blocks === undefined) {
        throwBadRequest('缺少参数: min, range, blocks')
    }

    if (typeof min !== 'number' || !Number.isInteger(min)) {
        throwBadRequest('min 必须是整数')
    }

    if (typeof range !== 'number' || !Number.isInteger(range) || (range < 1 || range > 104_8575)) {
        throwBadRequest('range 必须是整数，且 1 <= range <= 104,8575')
    }

    if (typeof blocks !== 'number' || !Number.isInteger(blocks) || (blocks < 1 || blocks > 100)) {
        throwBadRequest('blocks 必须是整数，且 1 <= blocks <= 100')
    }
}

function convert(data: Data, min: number, range: number) {
    const result: number[] = []

    const random_numbers = data.random_numbers
    for (let i = 0; i < random_numbers.length; i++) {
        const num = +random_numbers[i].decimal
        const a = parseInt((num * range).toString(2).slice(0, -30), 2) || 0
        result.push(min + a)
    }

    return result
}

export default defineEventHandler(async (event) => {
    const { min, range, blocks }: RequestBody = await readBody(event)
    checkInput2(min, range, blocks)

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
            bits_per_block: 30,
            number_of_blocks: blocks
        }
    })

    const result = convert(data, min, range)

    return result
})