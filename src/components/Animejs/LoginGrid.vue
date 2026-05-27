<template>
  <div ref="container" class="login-grid" :style="containerStyle">
    <div
      v-for="i in totalCells"
      :key="`cell-${gridKey}-${i}`"
      class="login-grid__square"
    ></div>
  </div>
</template>

<script>
import { utils, animate } from 'animejs'

export default {
  name: 'LoginGrid',
  props: {
    /** Square edge length in px (controls density when combined with `gap`). */
    squareSize: { type: Number, default: 24 },
    /** Gap between squares in px. */
    gap: { type: Number, default: 8 },
    /** Square fill / glow color (CSS color string). */
    color: { type: String, default: '#9fe870' },
    /** Per-cell stagger delay in ms. */
    staggerDelay: { type: Number, default: 100 },
    /** Peak scale during the breathe-in keyframe. */
    scaleMax: { type: Number, default: 1.25 },
    /** Box-shadow blur radius for the glow halo (any CSS length). */
    glowSize: { type: String, default: '1rem' },
    /** Corner radius of each square. */
    borderRadius: { type: String, default: '2px' },
    /** Opacity ceiling for each square (0–1). */
    opacity: { type: Number, default: 0.9 },
    /** Cap on how many cells we render (perf guard for very large screens). */
    maxCells: { type: Number, default: 2400 }
  },
  data () {
    return {
      cols: 0,
      rows: 0,
      gridKey: 0,
      ro: null,
      currentAnim: null,
      animId: 0,
      destroyed: false
    }
  },
  computed: {
    totalCells () {
      const raw = this.cols * this.rows
      return Math.min(raw, this.maxCells)
    },
    containerStyle () {
      return {
        '--lg-size': `${this.squareSize}px`,
        '--lg-gap': `${this.gap}px`,
        '--lg-color': this.color,
        '--lg-glow': this.glowSize,
        '--lg-radius': this.borderRadius,
        '--lg-opacity': this.opacity,
        gridTemplateColumns: `repeat(${this.cols}, var(--lg-size))`,
        gridTemplateRows: `repeat(${this.rows}, var(--lg-size))`,
        gap: 'var(--lg-gap)'
      }
    }
  },
  watch: {
    totalCells () {
      this.gridKey++
      this.$nextTick(() => this.startAnimation())
    },
    squareSize () { this.recalc() },
    gap () { this.recalc() },
    color () { this.recalc() },
    staggerDelay () { this.$nextTick(() => this.startAnimation()) },
    scaleMax () { this.$nextTick(() => this.startAnimation()) }
  },
  mounted () {
    this.recalc()
    this.setupResizeObserver()
  },
  beforeDestroy () {
    this.destroyed = true
    if (this.ro) {
      this.ro.disconnect()
      this.ro = null
    }
    this.stopAnimation()
  },
  methods: {
    setupResizeObserver () {
      if (typeof ResizeObserver === 'undefined') {
        window.addEventListener('resize', this.recalc)
        this._fallbackResize = true
        return
      }
      this.ro = new ResizeObserver(() => this.recalc())
      if (this.$refs.container) this.ro.observe(this.$refs.container)
    },
    recalc () {
      const el = this.$refs.container
      if (!el) return
      const w = el.clientWidth
      const h = el.clientHeight
      if (!w || !h) return
      const step = this.squareSize + this.gap
      const cols = Math.max(1, Math.floor((w + this.gap) / step))
      const rows = Math.max(1, Math.floor((h + this.gap) / step))
      if (cols !== this.cols || rows !== this.rows) {
        this.cols = cols
        this.rows = rows
      }
    },
    stopAnimation () {
      if (this.currentAnim && typeof this.currentAnim.pause === 'function') {
        this.currentAnim.pause()
      }
      this.currentAnim = null
    },
    startAnimation () {
      this.stopAnimation()
      if (this.destroyed || !this.cols || !this.rows) return
      const squares = this.$el
        ? this.$el.querySelectorAll('.login-grid__square')
        : []
      if (!squares.length) return
      // Bump animation id so any in-flight onComplete is invalidated
      const id = ++this.animId
      this._runLoop(Array.from(squares), id)
    },
    _runLoop (squares, id) {
      if (this.destroyed || id !== this.animId || !squares.length) return
      this.currentAnim = animate(squares, {
        scale: [
          { to: [0, this.scaleMax] },
          { to: 0 }
        ],
        boxShadow: [
          { to: `0 0 ${this.glowSize} 0 currentColor` },
          { to: '0 0 0rem 0 currentColor' }
        ],
        delay: utils.stagger(this.staggerDelay, {
          grid: [this.cols, this.rows],
          from: utils.random(0, squares.length - 1)
        }),
        onComplete: () => this._runLoop(squares, id)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-grid {
  position: absolute;
  inset: 0;
  display: grid;
  justify-content: center;
  align-content: center;
  pointer-events: none;
  overflow: hidden;
}

.login-grid__square {
  width: var(--lg-size);
  height: var(--lg-size);
  background: var(--lg-color);
  color: var(--lg-color);
  border-radius: var(--lg-radius);
  opacity: var(--lg-opacity);
  transform: scale(0);
  will-change: transform, box-shadow;
}
</style>
