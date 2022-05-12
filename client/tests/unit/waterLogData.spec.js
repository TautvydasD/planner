import Vue from 'vue';
import Vuetify from 'vuetify';
import { createLocalVue, shallowMount } from '@vue/test-utils';

import WaterLogData from '../../src/components/WaterLogData.vue';

Vue.use(Vuetify);

const localVue = createLocalVue();

describe('Navigation.vue', () => {
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
  });
  it('loads water log array', async () => {
    const wrapper = shallowMount(WaterLogData, {
      localVue,
      vuetify,
    });
    wrapper.vm.user.getWaterLogs = jest.fn();
    wrapper.vm.user.getWaterLogs.mockResolvedValue({ data: { waterLogs: [{}] } });
    await wrapper.vm.loadWaterLogs();
    expect(wrapper.vm.waterLogs).toEqual([{}]);
  });
  it('opens edit', async () => {
    const wrapper = shallowMount(WaterLogData, {
      localVue,
      vuetify,
    });
    wrapper.vm.user.getWaterLogs = jest.fn();
    wrapper.vm.user.getWaterLogs.mockResolvedValue({ data: { waterLogs: [{}] } });
    wrapper.vm.$refs = {
      'water-modal': {
        handleEdit: jest.fn(),
      },
    };
    wrapper.vm.$refs['water-modal'].handleEdit.mockReturnValueOnce();
    const spy = jest.spyOn(wrapper.vm.$refs['water-modal'], 'handleEdit');
    wrapper.vm.openEdit({ id: 1, amount: 200, loggedAt: '3030-02-02 02:20:20' }, 1);
    expect(spy).toHaveBeenCalled();
  });
  it('removes water log from waterlog array', async () => {
    const wrapper = shallowMount(WaterLogData, {
      localVue,
      vuetify,
    });
    wrapper.vm.user.removeWaterLog = jest.fn();
    wrapper.vm.user.removeWaterLog.mockResolvedValueOnce({});
    wrapper.vm.waterLogs = [{ id: 1 }];
    expect(wrapper.vm.waterLogs).toEqual([{ id: 1 }]);
    await wrapper.vm.removeWaterLog(1);
    expect(wrapper.vm.waterLogs).toEqual([]);
    wrapper.vm.waterLogs = [];
  });
  it('created water log when loggedAtDate exists', async () => {
    const wrapper = shallowMount(WaterLogData, {
      localVue,
      vuetify,
    });
    wrapper.vm.waterLogs = [];
    wrapper.vm.user.createWaterLog = jest.fn();
    wrapper.vm.user.createWaterLog.mockResolvedValueOnce({ data: { waterLog: { test: 'yes' } } });
    await wrapper.vm.createLog({ amount: 1, loggedAtDate: '2020-02-02', loggedAtTime: '20:20' });
    expect(wrapper.vm.waterLogs).toEqual([{}, { test: 'yes' }]);
  });
  it('created water log when does not loggedAtDate exists', async () => {
    const wrapper = shallowMount(WaterLogData, {
      localVue,
      vuetify,
    });
    wrapper.vm.user.createWaterLog = jest.fn();
    wrapper.vm.user.createWaterLog.mockResolvedValueOnce({ data: { waterLog: { test: 'yes' } } });
    wrapper.vm.waterLogs = [];
    await wrapper.vm.createLog({ amount: 1 });
    expect(wrapper.vm.waterLogs).toEqual([{}, { test: 'yes' }]);
  });
});
