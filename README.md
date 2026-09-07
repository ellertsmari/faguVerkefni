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
| `levels` | Exactly three parts with keys `easy`, `medium`, `hard`, each with `label`, `kicker`, `points`, `task`, `steps` and `deliverable`. |

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

`.github/workflows/deploy.yml` builds and deploys on every push to `main`
using GitHub Pages with the "GitHub Actions" source. The first run enables
Pages on the repository; if it fails with a permissions error, open the repo
Settings → Pages and set the source to "GitHub Actions", then rerun the job.

## History

The board was first built with ChatGPT on ChatGPT Sites, with a teacher
editor and a database so that project text could be changed without touching
code. That backend was removed when the project moved to GitHub, since the
text is now edited directly in this repository.
