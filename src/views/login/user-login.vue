<template>
  <div class="login-wrapper">
    <canvas id="canvas" class="login-canvas"></canvas>

    <div class="login-box">
      <div class="login-form">
        <el-select v-model="username" type="info">
          <el-option label="admin" value="admin" type="info"></el-option>
          <el-option label="user" value="user" type="info"></el-option>
        </el-select>
        <el-input
          v-model="password"
          class="password"
          type="password"
          placeholder="请输入密码"></el-input>
      </div>
      <p class="error-message ellipsis">{{ errorMessage }}</p>
      <el-button @click="login" type="primary" class="login-btn"
        >登录</el-button
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useCommonStore } from '@/store/common.ts'
  import $http from '@/utils/http'
  import { authApi } from '@/_api/index'

  const commonStore = useCommonStore()
  const router = useRouter()
  const username = ref('admin')
  const password = ref('123456')
  let errorMessage = ref('')
  const login = async () => {
    const params = {
      username: username.value,
      password: password.value
    }
    const { data } = await authApi.postAuthLogin(params)
    const token = data.token_type + ' ' + data.access_token
    $http.defaults.headers.common['Authorization'] = token
    localStorage.setItem('token', token)
    commonStore.initRouterFlag = false
    router.replace({ path: '/home' })
  }

  //画星空背景
  function drawStars() {
    const canvas = document.getElementById('canvas')! as HTMLCanvasElement
    const ctx = canvas.getContext('2d')!
    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)
    let hue = 217 //色调色彩
    let stars: Array<Star> = [] //保存所有星星
    let maxStars = 1300 //星星数量

    //canvas2是用来创建星星的源图像，即母版，
    //根据星星自身属性的大小来设置
    const canvas2 = document.createElement('canvas')! as HTMLCanvasElement
    const ctx2 = canvas2.getContext('2d')!
    canvas2.width = 100
    canvas2.height = 100
    //创建径向渐变，从坐标(half，half)半径为0的圆开始，
    //到坐标为(half,half)半径为half的圆结束
    let half = canvas2.width / 2
    let gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half)
    gradient2.addColorStop(0.025, '#CCC')
    //hsl是另一种颜色的表示方式，
    //h->hue,代表色调色彩，0为red，120为green，240为blue
    //s->saturation，代表饱和度，0%-100%
    //l->lightness，代表亮度，0%为black，100%位white
    gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)')
    gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)')
    gradient2.addColorStop(1, 'transparent')

    ctx2.fillStyle = gradient2
    ctx2.beginPath()
    ctx2.arc(half, half, half, 0, Math.PI * 2)
    ctx2.fill()

    // End cache
    function random(min: number, max?: number) {
      if (max === undefined) {
        max = min
        min = 0
      }
      if (min > max) {
        let hold = max
        max = min
        min = hold
      }
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    function maxOrbit(x: number, y: number) {
      let max = Math.max(x, y)
      let diameter = Math.round(Math.sqrt(max * max + max * max))
      //星星移动范围，值越大范围越小，
      return diameter / 2
    }
    class Star {
      orbitRadius: number
      radius: number
      orbitX: number
      orbitY: number
      timePassed: number
      speed: number
      alpha: number
      constructor() {
        this.orbitRadius = random(maxOrbit(w, h))
        //星星大小，半径越小，星星也越小，即外面的星星会比较大
        this.radius = random(60, this.orbitRadius) / 8
        //所有星星都是以屏幕的中心为圆心
        this.orbitX = w / 2
        this.orbitY = h / 1.5
        //星星在旋转圆圈位置的角度,每次增加speed值的角度
        //利用正弦余弦算出真正的x、y位置
        this.timePassed = random(0, maxStars)
        //星星移动速度
        // this.speed = random(this.orbitRadius) / 500000
        this.speed = 0.0001
        //星星图像的透明度
        this.alpha = random(2, 10) / 10
      }
      draw(ctx: CanvasRenderingContext2D) {
        //星星围绕在以屏幕中心为圆心，半径为orbitRadius的圆旋转
        let x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX
        let y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY
        let twinkle = random(10)

        //星星每次移动会有1/10的几率变亮或者变暗
        if (twinkle === 1 && this.alpha > 0) {
          //透明度降低，变暗
          this.alpha -= 0.05
        } else if (twinkle === 2 && this.alpha < 1) {
          //透明度升高，变亮
          this.alpha += 0.05
        }

        ctx.globalAlpha = this.alpha
        //使用canvas2作为源图像来创建星星，
        //位置在x - this.radius / 2, y - this.radius / 2
        //大小为 this.radius
        ctx.drawImage(
          canvas2,
          x - this.radius / 2,
          y - this.radius / 2,
          this.radius,
          this.radius
        )
        //没旋转一次，角度就会增加
        this.timePassed += this.speed
      }
    }

    //初始化所有星星
    for (var i = 0; i < maxStars; i++) {
      stars.push(new Star())
    }

    function animation() {
      //以新图像覆盖已有图像的方式进行绘制背景颜色
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 0.5 //尾巴
      ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 2)'
      ctx.fillRect(0, 0, w, h)

      //源图像和目标图像同时显示，重叠部分叠加颜色效果
      ctx.globalCompositeOperation = 'lighter'
      for (let i = 0, l = stars.length; i < l; i++) {
        stars[i].draw(ctx)
      }
      window.requestAnimationFrame(animation)
    }

    animation()
  }

  onMounted(() => {
    const htl = document.documentElement
    htl.classList.add('default')
    htl.removeAttribute('style')
    drawStars()
  })
</script>

<style lang="less" scoped>
  .login-wrapper {
    width: 100%;
    height: 100%;
    // background-color: var(--el-color-primary-light-3);
    position: relative;
    overflow: hidden;
    .login-canvas {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: -1;
      filter: alpha(opacity=20);
      // opacity: 0.2;
    }
    .login-box {
      position: absolute;
      left: 50%;
      top: 30%;
      transform: translate(-50%, -50%);
      width: 350px;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      margin: auto;
      padding: 40px 30px;
      display: flex;
      flex-direction: column;
    }
    .login-form {
      display: flex;
      flex-direction: column;
    }
    .password {
      margin-top: 20px;
    }
    .error-message {
      height: 20px;
      line-height: 20px;
      margin-top: 10px;
      font-size: 12px;
      color: var(--el-color-error);
      text-align: center;
    }
    .login-btn {
      margin-top: 10px;
    }
  }
</style>
