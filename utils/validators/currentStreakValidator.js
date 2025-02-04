export const currentSreakValidator = (streak) => {
  const regex = /^[0-9]+$/;
  return regex.test(streak);
};
