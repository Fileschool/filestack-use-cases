const CDN = 'https://cdn.filestackcontent.com';

/** A screenshot at the size the card or page needs, built from its handle. */
export function shot(handle: string, width: number, height?: number): string {
  const tasks = height
    ? [`resize=width:${width},height:${height},fit:crop,align:top`]
    : [`resize=width:${width},fit:max`];
  return `${CDN}/${[...tasks, 'output=format:webp'].join('/')}/${handle}`;
}
