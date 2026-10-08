export function getRandomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join('');
}

export function generateUser() {
  const userName = getRandomString(6);
  return {
    userName,
    email: `${userName}${getRandomString(4)}@test.ua`,
    password: getRandomString(6),
  };
}
