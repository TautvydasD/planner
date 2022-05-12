import Vue from 'vue';
import Vuetify from 'vuetify';
import { createLocalVue, shallowMount } from '@vue/test-utils';

import Workouts from '../../src/views/Workouts.vue';

Vue.use(Vuetify);

const localVue = createLocalVue();

describe('Navigation.vue', () => {
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
  });
  it('load exercises', async () => {
    const wrapper = shallowMount(Workouts, {
      localVue,
      vuetify,
    });
    wrapper.vm.user.getWgerExercises = jest.fn();
    wrapper.vm.user.getWgerExercises.mockResolvedValue({ data: { wGerExercises: [] } });
    wrapper.vm.user.getExercises = jest.fn();
    wrapper.vm.user.getExercises.mockResolvedValue({ data: { exercises: [] } });
    expect(wrapper.vm.loaded).toBe(false);
    await wrapper.vm.loadExercises();
    expect(wrapper.vm.loaded).toBe(true);
  });
});
