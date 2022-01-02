export default function sentenceFromArray (arr: string[]) {
  return arr.slice(0, -1).join(", ").concat(" and " + arr[arr.length - 1]);
}