import getAuthenticationHeader from '../../src/services/auth';

describe('auth.js', () => {
  beforeEach(() => {
    localStorage.setItem('user', null);
  });
  it('returns empty object when no access key is present', () => {
    const res = getAuthenticationHeader();
    expect(res).toEqual({});
  });
  it('return access token when access key is present', () => {
    localStorage.setItem('user', JSON.stringify({ access_token: 'test' }));
    const res = getAuthenticationHeader();
    expect(res).toEqual({
      Authorization: 'Bearer test',
    });
    localStorage.setItem('user', null);
  });
});
