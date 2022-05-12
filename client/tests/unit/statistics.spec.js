import Vue from 'vue';
import Vuetify from 'vuetify';
import { createLocalVue, shallowMount } from '@vue/test-utils';

import Statistics from '../../src/views/Statistics.vue';

Vue.use(Vuetify);

const localVue = createLocalVue();

jest.mock('../../src/views/BarChart.vue');
jest.mock('chart.js');
jest.mock('../../src/services/user');

describe('Statistics.vue', () => {
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
  });
  it('returns data set object', () => {
    const wrapper = shallowMount(Statistics, {
      localVue,
      vuetify,
      stubs: {
        BarChart: true,
      },
    });
    const res = wrapper.vm.getDataSet([['Test', 123]], 'green', 'test');
    expect(res).toEqual({
      labels: ['Test'],
      datasets: [
        {
          label: 'test',
          backgroundColor: 'green',
          data: [123],
        },
      ],
    });
  });
});
