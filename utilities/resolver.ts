export const resolveName = (path: any, obj: any) => {
  return path.split('.').reduce((prev: any, curr: any) => {
    return prev ? prev[curr] : null;
  }, obj || window.self);
};

export const nameValidate = (name: string) => {
  const newName = name?.split('.');
  const nameLength = newName?.length;
  return newName?.[nameLength - 1];
};
