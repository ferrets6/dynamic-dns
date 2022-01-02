export default function toCamelCase (str: string) {
  return str
    .toLowerCase()
    .replace(/[-]+[a-z]/g, group =>
      group
        .toUpperCase()
        .replace(/-/g, "")
    );
}