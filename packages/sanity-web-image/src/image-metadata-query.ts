export function imageMetadataQuery(id: string) {
  return `*[_id == "${id}"]{ extension, ...metadata{ blurHash, breakpoints, dimensions }}`
}
