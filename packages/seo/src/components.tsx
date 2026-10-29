import type { CSSProperties } from 'react';

import { DEMOS } from './demos';
import { REPO_URL, otherDemoUrl, type IDemoSite } from './site';
import { jsonLdHtml, structuredData } from './structured-data';

/** The page's whole @graph in one script tag. Render it once, on the home page. */
export function JsonLd({ site }: { site: IDemoSite }) {
  return (
    <script
      type="application/ld+json"
      // The payload is built from our own constants and escaped by jsonLdHtml.
      dangerouslySetInnerHTML={{ __html: jsonLdHtml(structuredData(site)) }}
    />
  );
}

// Neutral styles that sit inside any of the demo themes: colours are inherited
// or translucent, and the type comes from the app's own body font.
const muted: CSSProperties = { opacity: 0.78 };
const rule = '1px solid rgba(127, 127, 127, 0.28)';
const link: CSSProperties = { color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '3px' };
const code: CSSProperties = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: '0.8125rem',
  background: 'rgba(127, 127, 127, 0.12)',
  borderRadius: 4,
  padding: '1px 6px',
};
const h2: CSSProperties = { fontSize: '1.75rem', lineHeight: 1.2, fontWeight: 600, margin: 0 };
const h3: CSSProperties = { fontSize: '1.125rem', lineHeight: 1.3, fontWeight: 600, margin: 0 };

/**
 * The indexable half of a demo's home page: what it is, which Filestack
 * features it uses, how it works, the FAQ and links to the other demos.
 *
 * FAQ answers use <details>, so they stay in the DOM when collapsed and
 * crawlers read them. The text is the same data as the FAQPage JSON-LD.
 */
export function DemoAbout({ site }: { site: IDemoSite }) {
  const isDirectory = !site.slug;
  const others = DEMOS.filter((demo) => demo.slug !== site.slug);
  const source = site.sourcePath ? `${REPO_URL}/tree/main/${site.sourcePath}` : REPO_URL;

  return (
    <section
      id="about-this-demo"
      aria-labelledby="about-this-demo-title"
      style={{ borderTop: rule, background: 'rgba(127, 127, 127, 0.04)' }}
    >
      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '4rem 1.25rem', display: 'grid', gap: '3rem' }}>
        <div style={{ display: 'grid', gap: '1rem', maxWidth: '48rem' }}>
          <p style={{ ...muted, margin: 0, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {isDirectory ? 'Built on Filestack' : 'A Filestack demo'}
          </p>
          <h2 id="about-this-demo-title" style={h2}>
            {isDirectory ? site.name : `${site.name} demo`}
          </h2>
          <p style={{ margin: 0, fontSize: '1.0625rem', lineHeight: 1.65 }}>{site.intro}</p>
          {site.brand && (
            <p style={{ ...muted, margin: 0, fontSize: '0.875rem', lineHeight: 1.6 }}>
              {site.brand} is a fictional company. Its people and figures are invented to show
              how Filestack works in {site.vertical.toLowerCase()}. The uploads, processing and
              delivery run on the real Filestack API.
            </p>
          )}
          <p style={{ margin: 0, display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1.5rem', fontSize: '0.9375rem' }}>
            {site.useCasePage && (
              <a href={site.useCasePage} style={link}>
                Read the use case
              </a>
            )}
            <a href={source} style={link}>
              Source code on GitHub
            </a>
            {!isDirectory && (
              <a href={otherDemoUrl('')} style={link}>
                All Filestack demos
              </a>
            )}
            <a href="https://www.filestack.com/docs/" style={link}>
              Filestack documentation
            </a>
          </p>
        </div>

        {site.features.length > 0 && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            <h3 style={h3}>Filestack features in this demo</h3>
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'grid',
                gap: '1rem',
                gridTemplateColumns: 'repeat(auto-fit, minmax(15rem, 1fr))',
              }}
            >
              {site.features.map((feature) => (
                <li key={feature.name} style={{ border: rule, borderRadius: 8, padding: '1rem 1.125rem', display: 'grid', gap: '0.5rem', alignContent: 'start' }}>
                  <span style={{ fontWeight: 600 }}>{feature.name}</span>
                  {feature.task && (
                    <span>
                      <code style={code}>{feature.task}</code>
                    </span>
                  )}
                  <span style={{ ...muted, fontSize: '0.875rem', lineHeight: 1.55 }}>{feature.what}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {site.steps.length > 0 && (
          <div style={{ display: 'grid', gap: '1rem', maxWidth: '48rem' }}>
            <h3 style={h3}>How it works</h3>
            <ol style={{ margin: 0, paddingLeft: '1.25rem', display: 'grid', gap: '0.75rem', lineHeight: 1.6 }}>
              {site.steps.map((step) => (
                <li key={step.name}>
                  <strong style={{ fontWeight: 600 }}>{step.name}.</strong> {step.text}
                </li>
              ))}
            </ol>
          </div>
        )}

        {site.faq.length > 0 && (
          <div style={{ display: 'grid', gap: '0.25rem', maxWidth: '48rem' }}>
            <h2 style={{ ...h2, fontSize: '1.5rem', marginBottom: '0.75rem' }}>Frequently asked questions</h2>
            {site.faq.map((item) => (
              <details key={item.question} style={{ borderTop: rule, padding: '0.875rem 0' }}>
                <summary style={{ cursor: 'pointer', listStylePosition: 'outside' }}>
                  <h3 style={{ ...h3, display: 'inline', fontSize: '1rem' }}>{item.question}</h3>
                </summary>
                <p style={{ ...muted, margin: '0.625rem 0 0', lineHeight: 1.65 }}>{item.answer}</p>
              </details>
            ))}
          </div>
        )}

        <nav aria-label="Filestack demos" style={{ display: 'grid', gap: '1rem' }}>
          <h3 style={h3}>{isDirectory ? 'Every demo' : 'More Filestack demos'}</h3>
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'grid',
              gap: '0.75rem 1.5rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))',
            }}
          >
            {others.map((demo) => (
              <li key={demo.slug} style={{ lineHeight: 1.5 }}>
                <a href={otherDemoUrl(demo.slug)} style={{ ...link, fontWeight: 600 }}>
                  {demo.name}
                </a>
                <span style={{ ...muted, display: 'block', fontSize: '0.875rem' }}>{demo.summary}</span>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
