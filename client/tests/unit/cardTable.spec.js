import Vue from 'vue';
import Vuetify from 'vuetify';
import { createLocalVue, shallowMount } from '@vue/test-utils';

import CardTable from '../../src/components/CardTable.vue';

Vue.use(Vuetify);

const localVue = createLocalVue();

describe('CardTable.vue', () => {
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
  });
  it('returns dataSource with empty objects when data is not loaded', () => {
    const wrapper = shallowMount(CardTable, {
      localVue,
      vuetify,
      propsData: {
        instances: [],
      },
    });
    expect(wrapper.vm.dataSource).toEqual([{}, {}, {}, {}, {}, {}]);
  });
  it('returns dataSource with data when data is loaded', () => {
    const wrapper = shallowMount(CardTable, {
      localVue,
      vuetify,
      propsData: {
        instances: [{}],
        loaded: true,
      },
    });
    expect(wrapper.vm.dataSource).toEqual([{}]);
  });
  it('sets itemsPerPage to 12', () => {
    const wrapper = shallowMount(CardTable, {
      localVue,
      vuetify,
      propsData: {
        instances: [],
        loaded: false,
      },
    });
    expect(wrapper.vm.itemsPerPage).toBe(6);
    wrapper.vm.updateItemsPerPage(12);
    expect(wrapper.vm.itemsPerPage).toBe(12);
  });
  it('returns rows array when dataSource is an Array', () => {
    const wrapper = shallowMount(CardTable, {
      localVue,
      vuetify,
      propsData: {
        instances: [{}],
        loaded: true,
      },
      computed: {
        dataSource: () => [{}],
      },
    });
    expect(wrapper.vm.rows).toEqual([{}]);
  });
  it('returns rows array when dataSource is an Object', () => {
    const wrapper = shallowMount(CardTable, {
      localVue,
      vuetify,
      propsData: {
        instances: [{}],
        loaded: true,
      },
      computed: {
        dataSource: () => ({ test: '' }),
      },
    });
    expect(wrapper.vm.rows).toEqual(['']);
  });
});
