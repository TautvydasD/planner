import Vue from 'vue';
import Vuetify from 'vuetify';
import { createLocalVue, shallowMount } from '@vue/test-utils';

import Logger from '../../src/views/Logger.vue';

Vue.use(Vuetify);
const localVue = createLocalVue();

describe('Logger.vue', () => {
  let vuetify;
  beforeEach(() => {
    vuetify = new Vuetify();
  });
  it('returns component', () => {
    const wrapper = shallowMount(Logger, {
      localVue,
      vuetify,
    });
    const res = wrapper.vm.getComponent('Water');
    expect(res).toBe('Water');
  });
});
