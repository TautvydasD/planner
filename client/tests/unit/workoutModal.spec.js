import Vue from 'vue';
import Vuetify from 'vuetify';
import { createLocalVue, shallowMount } from '@vue/test-utils';

import WorkoutModal from '../../src/components/WorkoutModal.vue';

Vue.use(Vuetify);

const localVue = createLocalVue();

describe('Navigation.vue', () => {
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
  });
  it('returns show Form true when edit is true', () => {
    const wrapper = shallowMount(WorkoutModal, {
      localVue,
      vuetify,
      stubs: ['card-table'],
      propsData: {
        workout: {
          id: 1,
          exercises: [],
        },
        exercises: {
          myExercises: {},
          exercises: {},
          wGerExercises: {},
        },
        isEdit: true,
      },
    });
    wrapper.vm.editable = true;
    expect(wrapper.vm.showForm).toBe(true);
  });
  it('returns show Form true when add is true', () => {
    const wrapper = shallowMount(WorkoutModal, {
      localVue,
      vuetify,
      propsData: {
        workout: {
          id: 1,
          exercises: [],
        },
        exercises: {
          myExercises: {},
          exercises: {},
          wGerExercises: {},
        },
        isAdd: true,
      },
    });
    expect(wrapper.vm.showForm).toBe(true);
  });
  it('returns shown exercises', () => {
    const wrapper = shallowMount(WorkoutModal, {
      localVue,
      vuetify,
      propsData: {
        workout: {
          id: 1,
          exercises: [],
        },
        exercises: {
          myExercises: {},
          exercises: {},
          wGerExercises: {},
        },
        isAdd: true,
      },
    });
    expect(wrapper.vm.shownExercises).toEqual([]);
  });
  it('returns show Form false add and edit are false', () => {
    const wrapper = shallowMount(WorkoutModal, {
      localVue,
      vuetify,
      propsData: {
        exercises: {},
        workout: {
          id: 1,
          exercises: [],
        },
      },
    });
    expect(wrapper.vm.showForm).toBe(false);
  });
  it('returns title text create new when edit is false', () => {
    const wrapper = shallowMount(WorkoutModal, {
      localVue,
      vuetify,
      propsData: {
        exercises: {},
        workout: {
          id: 1,
          exercises: [],
        },
      },
    });
    expect(wrapper.vm.titleText).toBe('Create new');
  });
  it('returns title text Update when edit is true', () => {
    const wrapper = shallowMount(WorkoutModal, {
      localVue,
      vuetify,
      propsData: {
        workout: {
          id: 1,
          exercises: [],
        },
        exercises: {
          myExercises: {},
          exercises: {},
          wGerExercises: {},
        },
        isEdit: true,
      },
    });
    expect(wrapper.vm.titleText).toBe('Update');
  });
  it('returns resets workoutModal', () => {
    const wrapper = shallowMount(WorkoutModal, {
      localVue,
      vuetify,
      propsData: {
        exercises: {},
        workout: {
          exercises: [],
        },
      },
    });
    wrapper.vm.workoutModal = true;
    wrapper.vm.resetForm();
    expect(wrapper.vm.workoutModal).toBe(false);
  });
  it('returns removes workouts', () => {
    const wrapper = shallowMount(WorkoutModal, {
      localVue,
      vuetify,
      propsData: {
        exercises: {},
        workout: {
          exercises: [],
        },
      },
    });
    wrapper.vm.workoutForm = {
      id: 1,
    };
    const spy = jest.spyOn(wrapper.vm, '$emit');
    wrapper.vm.removeWorkout();
    expect(spy).toBeCalledWith('remove-workout', 1);
  });
  it('returns opens edit', () => {
    const wrapper = shallowMount(WorkoutModal, {
      localVue,
      vuetify,
      propsData: {
        exercises: {},
        workout: {
          id: 1,
          exercises: [],
        },
      },
    });
    wrapper.vm.openEdit();
    expect(wrapper.vm.workoutForm).toEqual({
      id: 1,
      exercises: [],
    });
  });
});
