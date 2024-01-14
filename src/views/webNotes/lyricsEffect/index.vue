<template>
  <div class="lyric-container">
    <div class="audio">
      <audio @timeupdate="timeupdate" controls :src="songUrl"></audio>
    </div>
    <div class="lyric" ref="lyricRef">
      <ul ref="ulRef" :style="'transform:translateY(' + ulOffset + 'px)'">
        <li
          v-for="(item, index) in lrcDataArr"
          :key="item.time"
          :class="currentIndex === index ? 'active' : ''"
        >
          {{ item.words }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onUnmounted, onMounted, ref } from 'vue'
  import { lrcData } from './lrc'
  import songUrl from './song.mp3'
  import { throttle } from 'lodash-es'
  const lyricRef = ref<HTMLElement | null>(null)
  const ulRef = ref<HTMLElement | null>(null)
  // ul的盒子div的高度
  let ulBoxHeight = 0
  // li高度
  let liHeight = 0
  // 当前歌曲时间
  let currentTime = 0
  // ul向上偏移量
  const ulOffset = ref(0)
  // 当前歌词在歌词数组中的index
  const currentIndex = ref(-1)

  // 解析歌词，转为数组
  const parseLrc = (lrc: string) => {
    return lrc.split('\n').map((str) => {
      let arr = str.split(']')
      let time = arr[0].substring(1).split(':')
      return {
        time: (+time[0] * 60 + +time[1]).toFixed(2),
        words: arr[1]
      }
    })
  }
  const lrcDataArr = parseLrc(lrcData)

  // 找到当前播放的歌词下标
  const findCurrentIndex = (time: number): number => {
    let index = -1
    for (let i = 0; i < lrcDataArr.length; i++) {
      const lrc = lrcDataArr[i]
      if (time < +lrc.time) {
        index = i - 1
        break
      }
    }
    let lastItem = lrcDataArr[lrcDataArr.length - 1]
    if (time > +lastItem.time) {
      index = lrcDataArr.length - 1
    }
    return index
  }

  // 设置歌词ul的向上偏移值
  const setOffset = (index: number) => {
    ulOffset.value = -((index + 0.5) * liHeight - ulBoxHeight / 2)
  }

  // 初始化ul盒子高度和偏移量
  const initHeight = () => {
    ulBoxHeight = lyricRef.value?.clientHeight || 0
    liHeight = (ulRef.value?.clientHeight || 0) / lrcDataArr.length
    ulOffset.value = ulBoxHeight / 2 - liHeight / 2
    console.log(ulOffset.value)
  }

  // audio标签timeupdate事件
  const timeupdate = (e: Event) => {
    currentTime = (e.target! as unknown as { currentTime: number }).currentTime
    currentIndex.value = findCurrentIndex(currentTime)
    setOffset(currentIndex.value)
  }

  // 视口大小变化时，重新初始化
  const resizeHandle = throttle(() => {
    initHeight()
    setOffset(currentIndex.value)
  }, 500)

  onMounted(() => {
    initHeight()
    window.addEventListener('resize', resizeHandle)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', resizeHandle)
  })
</script>

<style lang="less" scoped>
  .lyric-container {
    text-align: center;
    color: #c0bebe;
    height: 100%;
    overflow: hidden;
    background-color: var(--main-bg-color);
    .lyric {
      font-size: 18px;
      margin-top: 30px;
      height: 50%;
      overflow: hidden;
      ul {
        transition: 0.5s;
        li {
          height: 38px;
          line-height: 38px;
          transition: 0.5s;
        }
        li.active {
          color: var(--main-font-color);
          transform: scale(1.2);
        }
      }
    }
  }
</style>
