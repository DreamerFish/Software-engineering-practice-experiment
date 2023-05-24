<template>
  <div class="navbar">
    <div class="left-side">
      <a-space>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1"
          width="24" height="24" viewBox="0 0 24 24">
          <defs>
            <clipPath id="master_svg0_124_8710">
              <rect x="0" y="0" width="24" height="24" rx="0" />
            </clipPath>
          </defs>
          <g clip-path="url(#master_svg0_124_8710)">
            <g>
              <path
                d="M6.749999761581421,2.5C9.097209761581421,2.500000476837,10.999999761581421,4.4027899999999995,10.999999761581421,6.75L10.999999761581421,11L6.749999761581421,11C4.40278976158142,11,2.499999761581421,9.09721,2.499999761581421,6.75C2.499999761581421,4.4027899999999995,4.40278976158142,2.500000238419,6.749999761581421,2.5ZM6.749999761581421,13L10.999999761581421,13L10.999999761581421,17.25C10.999999761581421,19.5972,9.097209761581421,21.5,6.749999761581421,21.5C4.40278976158142,21.5,2.500000476837421,19.5972,2.500000476837421,17.25C2.500000476837421,14.9028,4.40278976158142,13,6.749999761581421,13ZM17.24999976158142,2.5C19.59719976158142,2.500000238419,21.49999976158142,4.4027899999999995,21.49999976158142,6.75C21.49999976158142,9.09721,19.59719976158142,11,17.24999976158142,11L12.999999761581421,11L12.999999761581421,6.75C12.999999761581421,4.4027899999999995,14.90279976158142,2.500000238419,17.24999976158142,2.5ZM12.999999761581421,13L17.24999976158142,13C19.59719976158142,13,21.49999976158142,14.9028,21.49999976158142,17.25C21.49999976158142,19.5972,19.59719976158142,21.5,17.24999976158142,21.5C14.90279976158142,21.5,12.999999761581421,19.5972,12.999999761581421,17.25L12.999999761581421,13Z"
                fill="#0057FE" fill-opacity="1" />
            </g>
          </g>
        </svg>
        <a-typography-title :style="{ margin: 0, fontSize: '18px' }" :heading="5">
          体育场馆管理系统
        </a-typography-title>
        <icon-menu-fold v-if="appStore.device === 'mobile'" style="font-size: 22px; cursor: pointer"
          @click="toggleDrawerMenu" />
      </a-space>
    </div>
    <ul class="right-side">
      <!-- <li>
        <a-tooltip :content="$t('settings.search')">
          <a-button class="nav-btn" type="outline" :shape="'circle'">
            <template #icon>
              <icon-search />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-tooltip :content="$t('settings.language')">
          <a-button
            class="nav-btn"
            type="outline"
            :shape="'circle'"
            @click="setDropDownVisible"
          >
            <template #icon>
              <icon-language />
            </template>
          </a-button>
        </a-tooltip>
        <a-dropdown trigger="click" @select="changeLocale as any">
          <div ref="triggerBtn" class="trigger-btn"></div>
          <template #content>
            <a-doption
              v-for="item in locales"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-doption>
          </template>
        </a-dropdown>
      </li> -->
      <li v-if="userStore.role.includes('admin')">
        <a-tooltip content="下载财务数据报表">
          <a-button class="nav-btn" type="outline" :shape="'circle'" @click="download">
            <template #icon>
              <icon-computer />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-tooltip :content="theme === 'light'
            ? $t('settings.navbar.theme.toDark')
            : $t('settings.navbar.theme.toLight')
          ">
          <a-button class="nav-btn" type="outline" :shape="'circle'" @click="handleToggleTheme">
            <template #icon>
              <icon-moon-fill v-if="theme === 'dark'" />
              <icon-sun-fill v-else />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-tooltip :content="isFullscreen
            ? $t('settings.navbar.screen.toExit')
            : $t('settings.navbar.screen.toFull')
          ">
          <a-button class="nav-btn" type="outline" :shape="'circle'" @click="toggleFullScreen">
            <template #icon>
              <icon-fullscreen-exit v-if="isFullscreen" />
              <icon-fullscreen v-else />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-tooltip :content="$t('settings.title')">
          <a-button class="nav-btn" type="outline" :shape="'circle'" @click="setVisible">
            <template #icon>
              <icon-settings />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-dropdown trigger="click">
          <a-avatar :size="32" :style="{ marginRight: '8px', cursor: 'pointer' }">
            <img alt="avatar" src="@/assets/images/head.png" />
          </a-avatar>
          <template #content>
            <a-doption>
              <a-space @click="$router.push({ name: 'Setting' })">
                <icon-settings />
                <span>
                  {{ $t('messageBox.userSettings') }}
                </span>
              </a-space>
            </a-doption>
            <a-doption>
              <a-space @click="handleLogout">
                <icon-export />
                <span>
                  {{ $t('messageBox.logout') }}
                </span>
              </a-space>
            </a-doption>
          </template>
        </a-dropdown>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, inject } from 'vue';
import { Message } from '@arco-design/web-vue';
import { useDark, useToggle, useFullscreen } from '@vueuse/core';
import { useAppStore, useUserStore } from '@/store';
import { LOCALE_OPTIONS } from '@/locale';
import useLocale from '@/hooks/locale';
import useUser from '@/hooks/user';
import { transaction } from '@/network/module/download';

const appStore = useAppStore();
const userStore = useUserStore();
const { logout } = useUser();
const { isFullscreen, toggle: toggleFullScreen } = useFullscreen();

const theme = computed(() => {
  return appStore.theme;
});
const isDark = useDark({
  selector: 'body',
  attribute: 'arco-theme',
  valueDark: 'dark',
  valueLight: 'light',
  storageKey: 'arco-theme',
  onChanged(dark: boolean) {
    // overridden default behavior
    appStore.toggleTheme(dark);
  },
});
const toggleTheme = useToggle(isDark);
const handleToggleTheme = () => {
  toggleTheme();
};
const setVisible = () => {
  appStore.updateSettings({ globalSettings: true });
};
const handleLogout = () => {
  logout();
};

const toggleDrawerMenu = inject('toggleDrawerMenu');
const download = async () => {
  const { data: { returnUrl }, code } = await transaction()
  if (code === 20000) {
    Message.warning('正在下载')
    const link = document.createElement('a');
    link.href = returnUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    Message.error('下载失败，请重试！')
  }
}
</script>

<style scoped lang="less">
.navbar {
  display: flex;
  justify-content: space-between;
  height: 100%;
  background-color: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border);
}

.left-side {
  display: flex;
  align-items: center;
  padding-left: 20px;
}

.right-side {
  display: flex;
  padding-right: 20px;
  list-style: none;

  :deep(.locale-select) {
    border-radius: 20px;
  }

  li {
    display: flex;
    align-items: center;
    padding: 0 10px;
  }

  a {
    color: var(--color-text-1);
    text-decoration: none;
  }

  .nav-btn {
    color: rgb(var(--gray-8));
    font-size: 16px;
    border-color: rgb(var(--gray-2));
  }

  .trigger-btn,
  .ref-btn {
    position: absolute;
    bottom: 14px;
  }

  .trigger-btn {
    margin-left: 14px;
  }
}
</style>

<style lang="less">
.message-popover {
  .arco-popover-content {
    margin-top: 0;
  }
}
</style>
