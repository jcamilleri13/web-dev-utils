export async function asyncDeepMap(
  input: unknown,
  fn: (input: unknown) => Promise<unknown>,
): Promise<unknown> {
  const result = await fn(input)
  if (result !== undefined) return result

  if (Array.isArray(input)) {
    return await Promise.all(input.map((item) => asyncDeepMap(item, fn)))
  }

  // typeof `null` is 'object' in JavaScript 🙃
  if (typeof input === 'object' && input != null) {
    return (
      await Promise.all(
        Object.entries(input).map(async ([key, value]) => ({
          [key]: await asyncDeepMap(value, fn),
        })),
      )
    ).reduce((combinedObject, object) => ({ ...combinedObject, ...object }), {})
  }

  return input
}

export function deepMap(input: unknown, fn: (input: unknown) => unknown): unknown {
  const result = fn(input)
  if (result !== undefined) return result

  if (Array.isArray(input)) {
    return input.map((item) => deepMap(item, fn))
  }

  // typeof `null` is 'object' in JavaScript 🙃
  if (typeof input === 'object' && input != null) {
    return Object.entries(input)
      .map(([key, value]) => ({ [key]: deepMap(value, fn) }))
      .reduce((combinedObject, object) => ({ ...combinedObject, ...object }), {})
  }

  return input
}
