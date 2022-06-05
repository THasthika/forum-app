export function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch (err) {
    console.log(err);
    return null;
  }
}

export function setUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}
