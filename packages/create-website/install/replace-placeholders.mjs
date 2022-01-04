export async function replacePlaceholders(fileString, replacements) {
  for (const [key, value] of Object.entries(replacements)) {
    fileString = fileString.replace(`{{${key}}}`, value)
  }

  return fileString
}
