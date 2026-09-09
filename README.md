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

A step is either a plain string or an object with `text`, a `hint` and an
optional `link`. Steps with a hint get a small "?" button that opens the hint
under the step. Use hints for where a tool lives, what a good answer looks
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

## Verk 7: grading and peer evaluation

Verk 7 is the group capstone and the one project without optional parts. It
is a single list of ten required steps, and the grade depends on the quality
of the work: 1–2 for almost nothing, 3–4 when parts are missing, 5–6 for
handing in everything at a bare minimum, 7–8 when the
PDF, zip folder, slides and presentation are all well done, and 9–10 for
extra effort such as a richer floor plan, a more elaborate circuit, animated
slides or a report that looks like it came from a professional firm. Every
group hands in three things that each show the whole work: a PDF report, a
zip file with tidy folders and file names (the spreadsheet included as a
file), and a slide deck presented in class on 22 September 2026. The work
day is 15 September, submissions are due 21 September at 23:59, and the peer
evaluation by 23 September. The teams are fixed by the teacher and published in
Canvas, not on the site. Students open the page in its own window from a
link in Canvas rather than in an iframe, because there is a lot to read.

The final grade is two equal halves. The group grade from the quality bands
counts 50% and is the same for everyone in the team. The other 50% is the
teachers' grade for each student, based on how they saw the student work in
class during the project.

The peer and self evaluation is mandatory and is the student's voice in that
second half. It is a 0-point Canvas quiz named "Jafningjamat Verk 7", filled
in after the presentations. The site only explains it and links nowhere; the
answers stay in Canvas. Suggested questions: for yourself and each teammate,
what did they do, and one or two sentences of reasoning.

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
