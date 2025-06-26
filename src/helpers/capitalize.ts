export const capitalize = (value: string) => {
  const originalString = value.toLowerCase();
  return originalString.charAt(0).toUpperCase() + originalString.slice(1);
}
