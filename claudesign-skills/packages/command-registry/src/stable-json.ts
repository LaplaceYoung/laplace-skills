function stableSortValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => stableSortValue(item));
  }

  if (value !== null && typeof value === 'object') {
    const source = value as Record<string, unknown>;
    const target: Record<string, unknown> = {};
    const keys = Object.keys(source).sort((a, b) => a.localeCompare(b));

    for (const key of keys) {
      target[key] = stableSortValue(source[key]);
    }

    return target;
  }

  return value;
}

export function stableStringify(value: unknown, space = 2): string {
  return JSON.stringify(stableSortValue(value), null, space);
}
