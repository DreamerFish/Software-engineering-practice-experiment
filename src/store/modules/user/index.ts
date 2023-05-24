import { defineStore } from 'pinia';
import {
  login as userLogin,
  logout as userLogout,
  getUserInfo,
  LoginData,
} from '@/api/user';
import { setToken, clearToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { UserState } from './types';
import useAppStore from '../app';
import { login, getInfo } from '@/network/module/login/index'
import { useStorage } from '@vueuse/core';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    name: undefined,
    avatar: undefined,
    job: undefined,
    organization: undefined,
    location: undefined,
    email: undefined,
    introduction: undefined,
    personalWebsite: undefined,
    jobName: undefined,
    organizationName: undefined,
    locationName: undefined,
    phone: undefined,
    registrationDate: undefined,
    accountId: undefined,
    certification: undefined,
    uId: undefined,
    uName: undefined,
    uNumber: undefined,
    cre: undefined,
    uEmail: undefined,
    uPhone: undefined,
    role: [],
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    switchRoles() {
      // return new Promise((resolve) => {
      //   this.role = this.role === 'user' ? 'admin' : 'user';
      //   resolve(this.role);
      // });
    },
    // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async info() {
      const res = await getInfo();
      res.data.user.role = res.data.user.uRoles.split(',').slice(0, -1)

      this.setInfo(res.data.user);
    },

    // Login
    async login(loginForm: LoginData) {
      try {
        const res = await login(loginForm);
        console.log(res, this.role);
        if (res.code === 20001) {
          throw Error(res.message)
        } else {
          setToken(res.data.token);
        }
        
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearServerMenu();
    },
    // Logout
    async logout() {
        this.logoutCallBack();
    },
  },
});

export default useUserStore;
