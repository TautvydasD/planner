export default function getAuthenticationHeader() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.access_token) {
    return { Authorization: `Bearer ${user.access_token}` };
  }
  return {};
}
