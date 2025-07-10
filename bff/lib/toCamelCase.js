function toCamelCase(sentence) {
  return sentence
    .toLowerCase()
    .split(" ")
    .map((word, index) =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
}


export default toCamelCase