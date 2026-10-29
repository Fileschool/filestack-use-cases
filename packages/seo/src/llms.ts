import { DEMOS } from './demos';
import { FILESTACK_URL, REPO_URL, otherDemoUrl, siteUrl, type IDemoSite } from './site';

/**
 * llms.txt for one demo, built from the same data as the page, the JSON-LD
 * and the FAQ. Served from app/llms.txt/route.ts so it is regenerated on every
 * build rather than hand-maintained.
 */
export function llmsTxt(site: IDemoSite): string {
  const url = siteUrl(site);
  const lines: string[] = [];

  lines.push(`# ${site.title}`, '');
  lines.push(`> ${site.description}`, '');
  lines.push(site.intro, '');

  if (site.brand) {
    lines.push(
      `The demo is dressed as ${site.brand}, a fictional ${site.vertical.toLowerCase()} business. The company, people and figures are invented. The file handling runs on the real Filestack API.`,
      '',
    );
  }

  lines.push('## What it answers', '');
  for (const item of site.faq) lines.push(`- ${item.question}`);
  lines.push('');

  if (site.steps.length > 0) {
    lines.push('## How it works', '');
    site.steps.forEach((step, index) => lines.push(`${index + 1}. ${step.name}: ${step.text}`));
    lines.push('');
  }

  if (site.features.length > 0) {
    lines.push('## Filestack features used', '');
    for (const feature of site.features) {
      lines.push(`- ${feature.name}${feature.task ? ` (\`${feature.task}\`)` : ''}: ${feature.what}`);
    }
    lines.push('');
  }

  if (site.limits.length > 0) {
    lines.push('## Accuracy and limits', '');
    for (const limit of site.limits) lines.push(`- ${limit}`);
    lines.push('');
  }

  lines.push('## Other Filestack demos', '');
  for (const demo of DEMOS.filter((item) => item.slug !== site.slug)) {
    lines.push(`- [${demo.name}](${otherDemoUrl(demo.slug)}): ${demo.summary}`);
  }
  lines.push('');

  lines.push('## Frequently asked questions', '');
  for (const item of site.faq) lines.push(`### ${item.question}`, '', item.answer, '');

  lines.push('## Links', '');
  lines.push(`- This demo: ${url}`);
  if (site.useCasePage) lines.push(`- Use case: ${site.useCasePage}`);
  lines.push(`- All demos: ${otherDemoUrl('')}`);
  lines.push(`- Source code: ${site.sourcePath ? `${REPO_URL}/tree/main/${site.sourcePath}` : REPO_URL}`);
  lines.push(`- Filestack: ${FILESTACK_URL}`);
  lines.push('- Filestack documentation: https://www.filestack.com/docs/');
  lines.push('');

  return lines.join('\n');
}

export function llmsResponse(site: IDemoSite): Response {
  return new Response(llmsTxt(site), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
