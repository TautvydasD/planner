import Vue from 'vue';
import Vuetify from 'vuetify';
import { createLocalVue, shallowMount } from '@vue/test-utils';

import Navigation from '../../src/components/Navigation.vue';

Vue.use(Vuetify);

const localVue = createLocalVue();

describe('Navigation.vue', () => {
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
  });
  it('returns isLoggedIn false', () => {
    const wrapper = shallowMount(Navigation, {
      localVue,
      stubs: ['router-link', 'router-view'],
      vuetify,
      mocks: {
        $store: {
          state: {
            auth: {
              isLoggedIn: false,
            },
          },
          dispatch: () => new Promise((resolve) => resolve({})),
        },
      },
      computed: {
        profile: () => ({ email: 'test' }),
      },
    });
    wrapper.vm.loadUserProfile = jest.fn();
    wrapper.vm.loadUserProfile.mockResolvedValue({});
    expect(wrapper.vm.isLoggedIn).toBe(false);
  });
  it('returns isLoggedIn true', () => {
    const wrapper = shallowMount(Navigation, {
      localVue,
      stubs: ['router-link', 'router-view'],
      vuetify,
      mocks: {
        $store: {
          state: {
            auth: {
              isLoggedIn: true,
            },
          },
          dispatch: () => new Promise((resolve) => resolve({})),
        },
      },
      computed: {
        profile: () => ({ email: 'test' }),
      },
    });
    wrapper.vm.loadUserProfile = jest.fn();
    wrapper.vm.loadUserProfile.mockResolvedValue({});
    expect(wrapper.vm.isLoggedIn).toBe(true);
  });
  it('returns logout when route path is /', () => {
    const wrapper = shallowMount(Navigation, {
      localVue,
      vuetify,
      stubs: ['router-link', 'router-view'],
      mocks: {
        $store: {
          state: {
            auth: {
              isLoggedIn: true,
            },
          },
          dispatch: () => new Promise((resolve) => resolve({})),
        },
        $route: {
          path: '/',
        },
        $router: {
          push: () => {},
        },
      },
      computed: {
        profile: () => ({ email: 'test' }),
      },
    });
    wrapper.vm.loadUserProfile = jest.fn();
    wrapper.vm.loadUserProfile.mockResolvedValue({});
    const spy1 = jest.spyOn(wrapper.vm.$store, 'dispatch');
    const spy2 = jest.spyOn(wrapper.vm.$router, 'push');
    wrapper.vm.logout();
    expect(spy1).toHaveBeenCalledWith('auth/logout');
    expect(spy2).not.toHaveBeenCalledWith('/');
    expect(wrapper.vm.isLoggedIn).toBe(true);
  });
  it('returns logout when route path is /', () => {
    const wrapper = shallowMount(Navigation, {
      localVue,
      vuetify,
      stubs: ['router-link', 'router-view'],
      mocks: {
        $store: {
          state: {
            auth: {
              isLoggedIn: true,
            },
          },
          dispatch: () => new Promise((resolve) => resolve({})),
        },
        $route: {
          path: '/',
        },
        $router: {
          push: () => {},
        },
      },
      computed: {
        profile: () => ({ email: 'test' }),
      },
    });
    wrapper.vm.loadUserProfile = jest.fn();
    wrapper.vm.loadUserProfile.mockResolvedValue({});
    const spy1 = jest.spyOn(wrapper.vm.$store, 'dispatch');
    const spy2 = jest.spyOn(wrapper.vm.$router, 'push');
    wrapper.vm.logout();
    expect(spy1).toHaveBeenCalledWith('auth/logout');
    expect(spy2).not.toHaveBeenCalledWith('/');
    expect(wrapper.vm.isLoggedIn).toBe(true);
  });
  it('gets user profile data', () => {
    const wrapper = shallowMount(Navigation, {
      localVue,
      vuetify,
      stubs: ['router-link', 'router-view'],
      mocks: {
        $store: {
          state: {
            auth: {
              isLoggedIn: true,
            },
          },
          dispatch: () => new Promise((resolve) => resolve({})),
        },
        $route: {
          path: '/',
        },
        $router: {
          push: () => {},
        },
      },
      computed: {
        profile: () => ({ email: 'test' }),
      },
    });
    const spy1 = jest.spyOn(wrapper.vm.$store, 'dispatch');
    wrapper.vm.loadUserProfile();
    expect(spy1).toHaveBeenCalledWith('getProfileData');
  });
});
