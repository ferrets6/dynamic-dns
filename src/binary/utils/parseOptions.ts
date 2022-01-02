import toCamelCase from "./toCamelCase.js";

/**
 * Parse the arguments by creating chunks of options (`[key, value][]`),
 * then converting these chunks to an object (`{ key: value }[]`)
 * and merging them (`{ key: value }`).
 */
export default function parseOptions (args: string[]) {
  const parsedArgumentsArray = args.reduce((
    resultArray: [string, (string | number)][],
    item,
    index
  ) => {
    const chunkIndex = Math.floor(index / 2);

    // Create a new chunk.
    if (!resultArray[chunkIndex]) {
      // We set a temporary empty value to not mess it up in the object.
      resultArray[chunkIndex] = [item, ""];
    }
    else {
      // We convert strings to number, if possible.
      const value = isNaN(+item) ? item : parseInt(item);

      // Replace the empty string with the actual value.
      resultArray[chunkIndex][1] = value;
    }

    // Return the array.
    return resultArray;
  }, []);

  // Convert the parsed arguments to an object.
  const convertArrayToObject = (
    finalObject: { [key: string]: string | number },
    item: [string, (string | number)]
  ) => {
    // Convert the key name to camelCase.
    const key = toCamelCase(item[0].slice(2));
    const value = item[1];

    // Define the argument in the object.
    finalObject[key] = value;
    return finalObject;
  };

  const parsedArguments = parsedArgumentsArray.reduce(convertArrayToObject, {});
  return parsedArguments;
}