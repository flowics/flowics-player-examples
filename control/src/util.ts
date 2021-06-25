export function getGraphicsUrl(): string | null {
  return new URLSearchParams(document.location.hash.split('#')[1]).get('g');
}