export function get(language, sublevelId) {
  const key = `content:${language}:${sublevelId}`;
  const stored = localStorage.getItem(key);
  if (stored === null) {
    return null;
  }
  return JSON.parse(stored);
}

export function set(language, sublevelId, content) {
  const key = `content:${language}:${sublevelId}`;
  const value = JSON.stringify(content);
  localStorage.setItem(key, value);
}
export function remove(language, sublevelId) {
  const key = `content:${language}:${sublevelId}`;
  localStorage.removeItem(key);
}
