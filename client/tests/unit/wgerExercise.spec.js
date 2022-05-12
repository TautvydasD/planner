import Vue from 'vue';
import Vuetify from 'vuetify';
import { createLocalVue, shallowMount } from '@vue/test-utils';

import WgerExercise from '../../src/components/WgerExercise.vue';

Vue.use(Vuetify);

const localVue = createLocalVue();

describe('WgerExercise.vue', () => {
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
  });
  it('returns parsed title', () => {
    const wrapper = shallowMount(WgerExercise, {
      localVue,
      vuetify,
      propsData: {
        exercise: {
          name: 'test',
        },
      },
    });

    const res = wrapper.vm.parseTitle('hello_world');
    expect(res).toBe('Hello world');
  });
  it('returns parsed subtitle when array is given', () => {
    const wrapper = shallowMount(WgerExercise, {
      localVue,
      vuetify,
      propsData: {
        exercise: {
          name: 'test',
        },
      },
    });

    const res = wrapper.vm.parseSubtitle([{ name: 'test' }, {name: 'test' }]);
    expect(res).toBe('test, test');
  });
  it('returns parsed subtitle when object is given', () => {
    const wrapper = shallowMount(WgerExercise, {
      localVue,
      vuetify,
      propsData: {
        exercise: {
          name: 'test',
        },
      },
    });

    const res = wrapper.vm.parseSubtitle({ name: 'test' });
    expect(res).toBe('test');
  });
  it('returns parsed subtitle when bad value is given', () => {
    const wrapper = shallowMount(WgerExercise, {
      localVue,
      vuetify,
      propsData: {
        exercise: {
          name: 'test',
        },
      },
    });

    const res = wrapper.vm.parseSubtitle(1);
    expect(res).toBe('-');
  });
});
