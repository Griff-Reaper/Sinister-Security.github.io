# Portfolio — Jace Griffith

Source for my portfolio site. AI security and automation engineer; active Secret
clearance; U.S. Navy veteran.

**Live:** [griff-reaper.github.io/Sinister-Security.github.io](https://griff-reaper.github.io/Sinister-Security.github.io/)

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
| Prompt Shield | [prompt-shield](https://github.com/Griff-Reaper/prompt-shield) | `eval/attacks_test.jsonl`, `eval/benign_test.jsonl` |
| Security Intelligence RAG | [security-intel-rag](https://github.com/Griff-Reaper/security-intel-rag) | `data/manifest.json`, `experiments/results/` |
| Red Team Attack Simulator | [red-team-simulator](https://github.com/Griff-Reaper/red-team-simulator) | `results/attack_log.jsonl` |

## Build

There is no build. Three files, no framework, no dependencies, no tracking.

```text
index.html    structure and content, including every provenance excerpt
styles.css    design tokens, layout, light/dark themes
app.js        progressive enhancement only — the page works fully without it
```

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
- `prefers-reduced-motion` respected
- `prefers-color-scheme` light and dark, both with real contrast ratios
- Charts are hand-authored inline SVG with `<title>`/`<desc>`; every figure's numbers
  also appear as text in its caption

## Contact

- [cybergriffith@gmail.com](mailto:cybergriffith@gmail.com)
- [LinkedIn](https://www.linkedin.com/in/jace-griffith-jg11/)
- [Credly](https://www.credly.com/users/joyelle-griffith)
