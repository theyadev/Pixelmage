export default function levenshtein(string1: string, string2: string) {
  let mattrix = [];
  const min = Math.min;

  if (!(string1 && string2)) return (string2 || string1).length;

  for (let i = 0; i <= string2.length; mattrix[i] = [i++]);
  for (let j = 0; j <= string1.length; mattrix[0][j] = j++);

  for (let i = 1; i <= string2.length; i++) {
    for (let j = 1; j <= string1.length; j++) {
      mattrix[i][j] =
        string2.charAt(i - 1) == string1.charAt(j - 1)
          ? mattrix[i - 1][j - 1]
          : (mattrix[i][j] = min(
              mattrix[i - 1][j - 1] + 1,
              min(mattrix[i][j - 1] + 1, mattrix[i - 1][j] + 1)
            ));
    }
  }

  return (
    100 -
    (100 * mattrix[string2.length][string1.length]) /
      Math.max(string1.length, string2.length)
  );
}
