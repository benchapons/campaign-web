export const minOrder = (days: any) => {
  return days.reduce((acc: any, cur: any) => {
    return acc?.order < cur?.order ? acc : cur;
  })?.order;
};

export const maxOrder = (days: any) => {
  return days.reduce((acc: any, cur: any) => {
    return acc?.order > cur?.order ? acc : cur;
  })?.order;
};
