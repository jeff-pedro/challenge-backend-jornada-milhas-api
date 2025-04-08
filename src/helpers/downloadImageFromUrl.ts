export async function downloadImageFromUrl(url: string): Promise<Blob> {
  const response = await fetch(url);
  const mimeType = response.headers.get('content-type')?.toString() ?? 'image/jpeg';

  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }

  const imageArrayBuffer = await response.arrayBuffer(); 
  return new Blob([imageArrayBuffer], { type: mimeType });
}
