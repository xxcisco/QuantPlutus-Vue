<template>
  <div id="userLayout" :class="['user-layout-wrapper', isMobile && 'mobile']">
    <LoginGrid
      :square-size="isMobile ? 16 : 36"
      :gap="isMobile ? 6 : 18"
      :stagger-delay="120"
      :scale-max="1.3"
      glow-size="1rem"
      color="#9fe870"
      :opacity="0.85"
    />
    <div class="wise-canvas">
      <!-- Decorative band: hero greeting on the left, language on the right (desktop) -->
      <div class="wise-topbar">
        <a href="/" class="wise-brand">
          <img :src="loginLogo" class="wise-logo" :alt="brandConfig.app_name">
        </a>
        <div class="wise-lang">
          <select-lang class="wise-lang-trigger" />
        </div>
      </div>

      <main class="wise-stage">
        <!-- Left column: hero copy (hidden on mobile, kept compact on tablet) -->
        <section class="wise-hero" aria-hidden="true">
          <h1 class="wise-hero-display" v-html="$t('layouts.userLayout.title')"></h1>
          <p class="wise-hero-sub">
            AI-driven quantitative insights for global markets
          </p>
          <div class="wise-hero-stats">
            <div class="stat-card stat-card--dark">
              <span class="stat-label">Realtime</span>
              <span class="stat-value">24/7</span>
              <span class="stat-foot">Cross-exchange signals</span>
            </div>
            <div class="stat-card stat-card--green">
              <span class="stat-label">Backtested</span>
              <span class="stat-value">10k+</span>
              <span class="stat-foot">Strategies validated</span>
            </div>
          </div>
        </section>

        <!-- Right column: form card (router-view) -->
        <section class="wise-form-col">
          <router-view />
        </section>
      </main>

      <!-- Footer band -->
      <footer class="wise-footer">
        <div class="wise-footer-inner">
          <div class="wise-copy">{{ brandConfig.copyright }}</div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { deviceMixin } from '@/store/device-mixin'
import SelectLang from '@/components/SelectLang'
import defaultLogo from '@/assets/logo.png'
import LoginGrid from '@/components/Animejs/LoginGrid'

export default {
  name: 'UserLayout',
  components: {
    SelectLang,
    LoginGrid
  },
  mixins: [deviceMixin],
  data() {
    return {
      showRisk: false
    }
  },
  computed: {
    ...mapState({
      brandConfig: state => state.brand.config
    }),
    loginLogo() {
      const remote = this.brandConfig && this.brandConfig.logos && this.brandConfig.logos.light
      return remote || defaultLogo
    }
  },
  methods: {
    toggleRisk() {
      this.showRisk = !this.showRisk
    },
  },
  mounted() {
    document.body.classList.add('userLayout')
  },
  beforeDestroy() {
    document.body.classList.remove('userLayout')
  }
}
</script>

<style lang="less" scoped>
#userLayout.user-layout-wrapper {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background: var(--wise-canvas-soft);
  color: var(--wise-ink);
  font-family: var(--wise-font-body);
  overflow: hidden;
}

.wise-canvas {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  max-width: var(--wise-container-max);
  margin: 0 auto;
  padding: 0 var(--wise-page-pad-x);
  box-sizing: border-box;
}

/* ===== Top bar ===== */
.wise-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  padding: 0;

  .wise-brand {
    display: inline-flex;
    align-items: center;
    text-decoration: none;

    .wise-logo {
      height: 36px;
      width: auto;
      object-fit: contain;
      max-width: 220px;
    }
  }

  .wise-lang {
    .wise-lang-trigger {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: var(--wise-r-full);
      background: var(--wise-canvas);
      color: var(--wise-ink);
      cursor: pointer;
      transition: background var(--wise-dur-fast) var(--wise-ease);

      &:hover {
        background: #fff;
        box-shadow: var(--wise-shadow-card);
      }
    }
  }
}

/* ===== Stage (hero + form) ===== */
.wise-stage {
  flex: 1;
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 48px;
  align-items: center;
  padding: 16px 0 32px;
}

/* ===== Hero (left column) ===== */
.wise-hero {
  display: flex;
  flex-direction: column;
  gap: 24px;

  .wise-hero-display {
    font-family: var(--wise-font-display);
    font-size: clamp(40px, 6vw, 80px);
    font-weight: 900;
    line-height: 1.3;
    letter-spacing: -0.025em;
    color: var(--wise-ink);
    margin: 0;
  }

  .wise-hero-sub {
    font-size: clamp(16px, 1.4vw, 20px);
    line-height: 1.5;
    color: var(--wise-body);
    margin: 0;
    max-width: 460px;
  }

  .wise-hero-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 12px;
    max-width: 460px;
  }

  .stat-card {
    border-radius: var(--wise-r-xl);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    transition: transform var(--wise-dur-base) var(--wise-ease);

    &:hover {
      transform: translateY(-3px);
    }

    .stat-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      opacity: 0.75;
    }

    .stat-value {
      font-family: var(--wise-font-display);
      font-size: 32px;
      font-weight: 900;
      line-height: 1.1;
      letter-spacing: -0.02em;
    }

    .stat-foot {
      font-size: 13px;
      opacity: 0.8;
    }

    &--green {
      background: var(--wise-primary-pale);
      color: var(--wise-ink-deep);
    }

    &--dark {
      background: var(--wise-primary-neutral);
      color: var(--wise-positive-deep);
    }
  }
}

/* ===== Form column ===== */
.wise-form-col {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  min-height: 100%;
  width: 100%;
}

/* ===== Footer ===== */
.wise-footer {
  padding: 16px 0 24px;

  .wise-footer-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }

  .wise-copy {
    font-size: 13px;
    color: var(--wise-mute);
  }

  .wise-privacy a {
    font-size: 13px;
    color: var(--wise-ink);
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    border-bottom: 1px solid currentColor;

    &:hover {
      color: var(--wise-positive);
    }
  }

  .wise-risk {
    margin-top: 16px;
    padding: 16px;
    background: var(--wise-canvas);
    border-radius: var(--wise-r-lg);
    font-size: 12px;
    color: var(--wise-body);
    line-height: 1.6;

    .wise-risk-title {
      font-weight: 600;
      color: var(--wise-ink);
      margin-bottom: 6px;
    }
  }
}

/* ===== Tablet ===== */
@media (max-width: 1023px) {
  .wise-stage {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 24px 0 32px;
  }

  .wise-hero {
    text-align: left;

    .wise-hero-display {
      font-size: clamp(36px, 8vw, 56px);
    }

    .wise-hero-stats {
      max-width: 100%;
    }
  }
}

/* ===== Mobile ===== */
@media (max-width: 767px) {
  .wise-topbar {
    height: 56px;

    .wise-brand .wise-logo {
      height: 28px;
      max-width: 160px;
    }
  }

  .wise-stage {
    padding: 16px 0 24px;
    gap: 24px;
  }

  .wise-hero {
    gap: 16px;

    .wise-hero-display {
      font-size: 32px;
      line-height: 1.1;
    }

    .wise-hero-sub {
      font-size: 15px;
    }

    .wise-hero-stats {
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      display: none;

      .stat-card {
        padding: 12px;

        .stat-value {
          font-size: 24px;
        }

        .stat-foot {
          font-size: 12px;
        }
      }
    }
  }

  .wise-footer {
    padding: 16px 0 24px;

    .wise-footer-inner {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
  }
}

</style>
