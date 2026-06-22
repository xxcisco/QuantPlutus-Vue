<template>
  <div :class="wrpCls">
    <avatar-dropdown :menu="true" :current-user="currentUser" :class="prefixCls" />
    <notice-icon :class="prefixCls" />
    <select-lang :class="prefixCls" />
    <a-tooltip :title="isDarkTheme ? $t('app.setting.pagestyle.light') : $t('app.setting.pagestyle.dark')">
      <span :class="prefixCls" @click="handleThemeToggle">
        <Icon
          :icon="isDarkTheme ? 'mdi:white-balance-sunny' : 'mdi:moon-waning-crescent'"
          class="theme-toggle-icon" style="font-size: 16px;"
        />
      </span>
    </a-tooltip>
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
import SelectLang from '@/components/SelectLang'
import NoticeIcon from '@/components/NoticeIcon'
import { Icon } from '@iconify/vue2'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'RightContent',
  components: {
    AvatarDropdown,
    SelectLang,
    NoticeIcon,
    Icon
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    },
    isMobile: {
      type: Boolean,
      default: () => false
    },
    topMenu: {
      type: Boolean,
      required: true
    },
    theme: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      apiBase: 'https://api.nextplutus.com/'
    }
  },
  methods: {
    handleSettingClick () {
      this.$root.$emit('show-setting-drawer')
    }
  },
  computed: {
    ...mapGetters(['nickname', 'avatar', 'userInfo']),
    currentUser () {
      return {
        userId: this.userInfo?.id,
        name: this.nickname,
        avatar: this.avatar,
        credits: this.userInfo && this.userInfo.credits
      }
    },
    wrpCls () {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${(this.isMobile || !this.topMenu) ? 'light' : this.theme}`]: true
      }
    }
  }
}
</script>

<style lang="less">
@import '@/styles/antd-vars.less';

.ant-pro-global-header-index-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;

  .ant-pro-global-header-index-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 64px;
    padding: 0 12px;
    color: var(--wise-body);
    transition: all 0.3s;
    cursor: pointer;
    vertical-align: top;
    border-radius: var(--wise-r-sm);

    .theme-toggle-icon {
      width: 16px;
      height: 16px;
      vertical-align: middle;
    }

    &:hover {
      color: var(--wise-primary);
      background: rgba(159, 232, 112, 0.12);
    }
  }
}

@media (max-width: 768px) {
  .ant-pro-global-header-index-right {
    .ant-pro-global-header-index-action {
      padding: 0 8px !important;
    }

    .ant-pro-drop-down,
    .ant-pro-account-avatar {
      padding: 0 8px !important;
    }
  }
}

body.dark,
body.realdark,
.ant-layout.dark,
.ant-layout.realdark,
.ant-pro-layout.dark,
.ant-pro-layout.realdark {
  .ant-pro-global-header-index-right {
    color: rgba(255, 255, 255, 0.85) !important;

    * {
      color: rgba(255, 255, 255, 0.85) !important;
    }

    .ant-pro-global-header-index-action {
      color: rgba(255, 255, 255, 0.85) !important;

      &:hover {
        color: var(--wise-primary) !important;
        background: rgba(159, 232, 112, 0.12) !important;
      }
    }

    .ant-pro-account-avatar {
      .antd-pro-global-header-index-avatar {
        background: rgba(255, 255, 255, 0.25) !important;
      }
    }

    .ant-pro-drop-down,
    .ant-dropdown-trigger {
      color: rgba(255, 255, 255, 0.85) !important;

      &:hover {
        color: var(--wise-primary) !important;
        background: rgba(159, 232, 112, 0.12) !important;
      }

      .anticon {
        color: rgba(255, 255, 255, 0.85) !important;
      }
    }
  }
}
</style>

