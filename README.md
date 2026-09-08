# FAGU verkefnaborð

Static project board for the FAGU course (Tækniskólinn, autumn 2026). Nine
projects, each with three parts: a 6-point base part and two optional 2-point
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
| `peerEval` | Optional. Adds the peer and self evaluation box and link after the project (Verk 7). |
| `levels` | Exactly three parts with keys `easy`, `medium`, `hard`, each with `label`, `kicker`, `points`, `task`, `steps` and `deliverable`. |

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

## Peer and self evaluation (Verk 7)

After the group presentation every student rates themselves and each
teammate on two axes, contribution and teamwork, from −2 to +2 with a
written reason. Scores are relative, so per axis they must add up to zero or
less: a team cannot rate itself above its own average. This is the same model
Vefskólinn uses for its group projects.

There is no backend, so Canvas stores the answers:

1. **Student form.** `?view=jafningjamat&verk=7` shows the form with a live
   balance meter and produces a text block ending in a `KÓÐI:` line. The
   Verk 7 page links to it.
2. **Canvas assignment.** Create an individual assignment named
   "Jafningjamat Verk 7" with submission type *Text Entry*, 0 points, due
   the day after the presentation. Put the form link in its description. Only
   the teacher sees text submissions.
3. **Teacher summary.** `?view=matsyfirlit` takes everything pasted from
   SpeedGrader, groups it into teams by the names mentioned, averages what
   each student received, and computes the individual grade from the group
   grade you enter. Confirmed figures default to the averages and can be
   changed per student. "Afrita töflu" copies a tab-separated table for Excel.
   Everything stays in your browser.
4. **Grading in Canvas.** On the Verk 7 group assignment tick *Assign grades
   to each student individually*, then enter the computed grades.

The formula: `P = (contribution + 2) × (teamwork + 2) − 4`, factor
`1 + P × 0.025` when P ≥ 0 and `1 + P × 0.175` otherwise, grade
`group grade × factor` capped at 10. That is at most +30% and at least −70%.

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
