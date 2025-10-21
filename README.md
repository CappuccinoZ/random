# Random
一个基于 Nuxt 4 + Vue 3 + Tailwind CSS + daisyUI 构建，源于量子随机数的随机数生成网站。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FCappuccinoZ%2Frandom&env=NUXT_RANDOM_API_SECRET&envDescription=QRNG%20API%20Key)

## 功能
输入最小值(min)、最大值(max)与生成数量(blocks)后，点击“生成随机数”即可生成随机数。
确保min、max与blocks是整数，blocks范围 [1, 100]，min和max范围 ±1e15，且 max >= min。

## 安装和运行
```bash
# 安装依赖
npm install

# 从QRNG API获取并配置环境变量NUXT_RANDOM_API_SECRET

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

## 算法
`min + (range*q >> k)`
range是生成随机数的区间长度, q是从QRNG API获取的量子随机数，k是右移位数。

QRNG API地址：https://outshift.cisco.com/quantum-random-number-generator