# Random
一个基于 Nuxt 4 + Vue 3 + Tailwind CSS + daisyUI 构建，源于量子随机数的随机数生成网站。

## 功能
输入最小值(min)、最大值(max)与生成数量(blocks)后，点击“生成随机数”即可生成随机数。
确保min、max与blocks是整数，blocks范围[1, 100]，range = (max-min+1)范围[1, 104,8575]。

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
`min + (range*num >> 30)`
range是生成随机数的区间长度(不超过20位), num是从QRNG API获取的量子随机数(30位)。

QRNG API地址：https://outshift.cisco.com/quantum-random-number-generator