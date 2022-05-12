import axios from 'axios';
import user from '../../src/services/user';

jest.mock('axios');

describe('user.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it.each`
    invokedFunction      | dataReturned | httpMethod | testText
    ${'getStatistics'}   | ${[]}        | ${'get'}   | ${'statistics data'}
    ${'getEvents'}       | ${[]}        | ${'get'}   | ${'events data'}
    ${'addEvent'}        | ${{}}        | ${'post'}  | ${'new event instance'}
    ${'editEvent'}       | ${{}}        | ${'put'}   | ${'editted event instance'}
    ${'removeEvent'}     | ${null}      | ${'delete'}| ${'event instance removed message'}
    ${'getExercises'}    | ${[]}        | ${'get'}   | ${'exercises data'}
    ${'createExercise'}  | ${{}}        | ${'post'}  | ${'new exercise instance'}
    ${'editExercise'}    | ${{}}        | ${'put'}   | ${'editted exercise instance'}
    ${'removeExercise'}  | ${null}      | ${'delete'}| ${'exercise instance removed message'}
    ${'getWaterLogs'}    | ${[]}        | ${'get'}   | ${'waterlogs data'}
    ${'createWaterLog'}  | ${{}}        | ${'post'}  | ${'new waterlog instance'}
    ${'editWaterLog'}    | ${{}}        | ${'put'}   | ${'editted waterlog instance'}
    ${'removeWaterLog'}  | ${null}      | ${'delete'}| ${'waterlog instance removed message'}
    ${'getWeightLogs'}   | ${[]}        | ${'get'}   | ${'weightlogs data'}
    ${'createWeightLog'} | ${{}}        | ${'post'}  | ${'new weightlog instance'}
    ${'editWeightLog'}   | ${{}}        | ${'put'}   | ${'editted weightlog instance'}
    ${'removeWeightLog'} | ${null}      | ${'delete'}| ${'weightlog instance removed message'}
    ${'getWorkouts'}     | ${[]}        | ${'get'}   | ${'workouts data'}
    ${'addWorkout'}      | ${{}}        | ${'post'}  | ${'new workout instance'}
    ${'editWorkout'}     | ${{}}        | ${'put'}   | ${'editted workout instance'}
    ${'removeWorkout'}   | ${null}      | ${'delete'}| ${'workout instance removed message'}
    ${'getCoaches'}      | ${[]}        | ${'get'}   | ${'coaches data'}
    ${'getRooms'}        | ${[]}        | ${'get'}   | ${'rooms data'}
    ${'getWgerExercises'}| ${[]}        | ${'get'}   | ${'wger exercises data'}
    ${'getProfile'}      | ${[]}        | ${'get'}   | ${'profile data'}
    ${'createRoom'}      | ${{}}        | ${'post'}  | ${'new rooms instance'}
  `('returns $testText', async ({ invokedFunction, dataReturned, httpMethod }) => {
  const spy = jest.spyOn(axios, httpMethod);
  const res = await user[invokedFunction]();
  const expectedData = !dataReturned
    ? { success: true }
    : { success: true, data: dataReturned };
  expect(res).toEqual(expectedData);
  expect(spy).toBeCalledTimes(1);
});
  it('returns editted Profile instance', async () => {
    const spy = jest.spyOn(axios, 'put');
    const res = await user.editProfile({ id: 1 });
    expect(res).toEqual({
      success: true,
      data: {},
    });
    expect(spy).toBeCalledTimes(1);
  });
});
