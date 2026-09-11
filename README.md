# FAGU verkefnaborð

Static project board for the FAGU course (Tækniskólinn, autumn 2026). Nine
projects. Eight have three parts: a 6-point base part and two optional 2-point
additions. Students open the board inside Canvas or on its own page, tick off
steps as they go, and follow the Canvas link to submit.

Live site: https://ellertsmari.github.io/faguVerkefni/

There is no backend. All project text lives in one file in this repository,
and every push to `main` rebuilds and redeploys the site automatically.

## Editing a project

Edit `src/project-data.ts`. Each project is an object with:

| Field | Meaning |
| --- | --- |
| `number` | Verk number shown to students. Projects are sorted by this. |
| `title`, `intro` | Heading and one-paragraph introduction. |
| `tools`, `ai` | The "Verkfæri" and "AI-regla" boxes. |
| `canvasId` | The Canvas assignment id. Used for the submit link and for `?assignment=` embeds. |
| `group` | Optional. Marks a group project and adds the group submission note. |
| `scenario` | Optional. A boxed "read this first" text, used for the customer email in Verk 8. |
| `submission` | Optional. Replaces the default submission instructions. |
| `photoGuide` | Optional. Shows the Inna and Canvas profile-photo guides (Verk 6). |
| `gradeSplit` | Optional. Boxes under the rubric showing how the final grade is split, same shape as `rubric` (Verk 7). |
| `assessment` | Optional. Paragraphs under the grade split; line breaks separate paragraphs (Verk 7). |
| `rubric` | Optional. Three quality bands (`grade`, `title`, `text`) for a single-part project graded 0–10 (Verk 7). |
| `levels` | Three parts with keys `easy`, `medium`, `hard` worth 6 + 2 + 2, or a single `easy` part worth 10 when the project has a `rubric`. Each has `label`, `kicker`, `points`, `task`, `steps` and `deliverable`. |

A step is either a plain string or an object with `text` and optional
`phase` (starts a checklist section), `hint`, `list` (always-visible
requirement bullets) and `link` (shown inline under the step). Steps with a
hint get a "Hjálp" button that opens the hint under the step. Use hints for where a tool lives, what a good answer looks
like, or a link back to the earlier Verk the step builds on.

Keep the points at 6, 2 and 2. The test suite checks this and the Canvas ids.

You can edit the file directly on GitHub. Once the commit lands on `main`,
the "Deploy to GitHub Pages" action runs the type check, lint and tests, then
publishes. Allow a minute or two before reloading the site. Students on an
already-open page see the change on their next page load.

The profile-photo guide texts and screenshots are in `src/photo-guide.tsx` and
`public/guides/`. Identifying details in the screenshots were permanently
blurred before they were added.

## Embedding in Canvas

Each Canvas assignment embeds the board in an iframe. When the page detects
that it is inside a frame it locks to a single project, hides the hero and the
project switcher, and points the submit button at the parent window.

Use one of these URL forms:

```
https://ellertsmari.github.io/faguVerkefni/?assignment=27490
https://ellertsmari.github.io/faguVerkefni/?verk=6
https://ellertsmari.github.io/faguVerkefni/?verk=6&locked=1
```

`assignment` looks the project up by Canvas id, `verk` by project number, and
`locked=1` forces single-project mode outside an iframe, which is handy for
previewing what students will see. `level=easy|medium|hard` opens a specific
part.

Checkmarks and the last selected project are stored in the student's browser
only. Nothing is sent anywhere.

## Verk 7: student workflow and assessment

Canvas links to `?verk=7&locked=1` in a new tab. The public page has the
complete brief, a compact schedule, quick links and a checklist in seven
sections: start together, work the parts in parallel, a stop-and-check step
when about 50 minutes remain of the second workday (Monday 21 September), one checklist per
deliverable (PDF report, ZIP, slides) and a final submit/present/evaluate
section. Each section shows its own done/total count. There is deliberately
no minute-by-minute timetable, since groups work at very different speeds.
Required details stay visible; "Hjálp" explains how to do the work, and links
to earlier Verk are shown inline under the step. Checklist marks are personal
to the browser, never shared group progress or Canvas submissions.
`checklistVersion` invalidates stale Verk 7 marks after substantial
instruction changes without touching the other projects.

A group submits exactly three files together: PDF report, ZIP of working
files (including the spreadsheet and saved circuit), and PPTX or Keynote slides.
The report includes a 3–5 sentence justification ("rökstuðningur") of the
layout and purchases; it is what separates 9–10 from 7–8 in the rubric.
Canvas assignment 24134 accepts only file uploads with pdf, zip, pptx, key
extensions. Students export Google Slides/Canva to PPTX; links are not submissions.
Workdays: Tuesday 15 September (photo session) and Monday 21 September; groups
are asked to submit at the end of the Monday class, and the Canvas deadline is
21 September 23:59 the same day (wording "í síðasta lagi", never "fyrir"); presentations: 22 September,
10–15 minutes per group, run from the teacher's computer using the uploaded
slide file; individual reflection: 23 September 23:59. Dates must agree with Canvas.

The five group quality bands are 1–2, 3–4, 5–6, 7–8 and 9–10. Everyone
speaking in the presentation is a requirement from 5–6 upwards. Excellence
means accurate, justified, verified execution of the required work, without
requiring decorative effects or extra circuit components. The group grade
counts 50%; each student's teacher assessment counts 50%. Canvas uses two
5-point criteria; halve each 0–10 grade when entering it.

“Jafningjamat Verk 7” is a mandatory, named, ungraded Canvas survey
(assignment 30396). Students describe their own contribution, every teammate's
contribution and their experience of collaboration. Responses support the
teacher's individual assessment. The public page only links to Canvas.

The group screenshot is an existing Canvas course file and is embedded only
inside the Canvas assignment. Never copy student names, group screenshots,
or assessment responses into this public repository or its assets.

## Theme

The board follows the system colour scheme and has a sun/moon toggle in the
top bar. The choice is stored in the browser under `fagu-theme`, and a small
inline script in `index.html` applies it before the first paint. Colours are
CSS variables in `src/globals.css`; the light palette overrides them under
`:root[data-theme="light"]`.

## Working locally

Requires Node.js 22 or newer.

```sh
npm install
npm run dev        # http://localhost:5173/faguVerkefni/
npm run typecheck
npm run lint
npm test           # builds, then runs tests/
```

The build is a plain folder of HTML, CSS, JS and images in `dist/`. It is
served from the `/faguVerkefni/` sub-path on GitHub Pages. To host it at a
domain root instead, build with `VITE_BASE=/ npm run build`.

## Deployment

`.github/workflows/deploy.yml` builds and deploys on every push to `main`.
Pages must be enabled once on the repository: open Settings → Pages and set
"Build and deployment → Source" to "GitHub Actions". Until that is done the
`configure-pages` step fails. After enabling it, rerun the failed workflow
from the Actions tab or push any commit.

## History

The board was first built with ChatGPT on ChatGPT Sites, with a teacher
editor and a database so that project text could be changed without touching
code. That backend was removed when the project moved to GitHub, since the
text is now edited directly in this repository.
