# Portfolio — Jace Griffith

Source for my portfolio site. AI security and automation engineer; active Secret
clearance; U.S. Navy veteran.

**Live:** [cyber-griffith.github.io](https://cyber-griffith.github.io/)

---

## The one rule

Every quantitative claim on the page carries its source inline, linked to the exact
committed file that produced it. Click a figure's tag and you get the verbatim lines
from the artifact, plus a link to it on GitHub.

Provenance is marked in one of three states, and the page never blurs them together:

| State | Meaning |
| --- | --- |
| **committed** | Links to a result file in a public repo. Check it yourself. |
| **reproduce** | The run artifact is deliberately not committed (it embeds corpus text). The exact command that regenerates it is shown instead, and the eval corpora it ran against *are* committed. |
| **internal** | Employer work. No public artifact exists, and none is implied. |

The point of separating them is that the third state exists at all. A page that
presents unverifiable internal figures the same way it presents linked ones devalues
the linked ones.

## Projects referenced

| Project | Repo | Headline artifact |
| --- | --- | --- |
| Prompt Shield | [prompt-shield](https://github.com/cyber-griffith/prompt-shield) | `eval/attacks_test.jsonl`, `eval/benign_test.jsonl` |
| Security Intelligence RAG | [security-intel-rag](https://github.com/cyber-griffith/security-intel-rag) | `data/manifest.json`, `experiments/results/` |
| Red Team Attack Simulator | [red-team-simulator](https://github.com/cyber-griffith/red-team-simulator) | `results/attack_log.jsonl` |

## Build

There is no build step, no framework, no dependencies, and no third-party requests
of any kind — fonts included.

```text
index.html      structure and content, including every provenance excerpt
styles.css      design tokens, layout, light/dark themes, aurora, motion
app.js          progressive enhancement only — the page works fully without it
field-data.js   1,824 attack outcomes, generated from attack_log.jsonl
fonts/          Bricolage Grotesque, Archivo, IBM Plex Mono — latin subset, woff2
```

## The attack field

The block under the hero is not an illustration. It is one mark per line of
`results/attack_log.jsonl` — 1,824 executions in run order grouped by target,
with the 78 the judge scored as successful lit. Hover any mark for its technique
ID, name, severity, target and verdict; "replay the run" redraws the sweep.

`field-data.js` is generated from the log: technique index, target index and
outcome packed into four characters per attack, plus a lookup table of the 40
techniques. 10 KB for the whole run.

Type is Bricolage Grotesque for display, Archivo for text, IBM Plex Mono for data
and identifiers. The woff2 files are committed rather than loaded from a CDN, so
the page makes no request to any host but its own.

The background is three soft radial fields drifting behind the content, built from
gradients rather than blurred elements — a blur filter at that size is expensive to
composite, and a wide gradient falloff is already soft. It stops entirely under
`prefers-reduced-motion`.

Run it locally with any static server:

```bash
python -m http.server 8000
```

The provenance drawers are native `<details>` elements, so they open, close, and
respond to the keyboard with JavaScript disabled. `app.js` only adds
one-drawer-at-a-time behaviour, Escape-to-close, and nav highlighting.

## Accessibility and quality floor

- Responsive to 360px with no horizontal scrolling; wide content scrolls inside its
  own container
- Visible keyboard focus on every interactive element, plus a skip link
- `prefers-reduced-motion` respected — the aurora holds still
- `prefers-color-scheme` light and dark, both with real contrast ratios
- Charts are hand-authored inline SVG with `<title>`/`<desc>`; every figure's numbers
  also appear as text in its caption

## Contact

- [cybergriffith@gmail.com](mailto:cybergriffith@gmail.com)
- [LinkedIn](https://www.linkedin.com/in/jace-griffith-jg11/)
- [Credly](https://www.credly.com/users/joyelle-griffith)
