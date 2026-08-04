# Lufiano Knowledge Assessment — v4

Staff training quiz portal. 15 topics, 20 questions each (10 multiple-choice + 10 written), 12-minute limit, one attempt per topic, with a manager dashboard.

## What's new in v4
- **Half the questions are now written (short-answer)** — 10 multiple-choice + 10 written per topic. Written answers are graded by detecting the key concepts in the answer, so they're much harder to cram or guess.
- **Manager review of written answers.** Answers that are partially correct are flagged amber ("review needed") in the dashboard. You can tap **Mark correct** / **Mark wrong** on any written answer and the score updates automatically.
- **One attempt per topic.** Once someone finishes a topic on a device, they can't retake it there. It locks to their name + surname + store.
- **12-minute time limit** (was 15).

## Editing common things
Open `src/LufianoQuiz.jsx`:
- **Manager PIN** — search `MANAGER_PIN` (currently `2580`)
- **Time limit** — search `QUIZ_TIME_SECONDS` (currently `12 * 60`)
- **Stores** — search `const STORES`
- **Questions** — search `QUIZ_DATA`. Multiple-choice look like `{ t: "mcq", q, options, answer, explanation }`. Written look like `{ t: "short", q, need, concepts, sample, explanation }` where `need` is how many key ideas are required and each concept's `any` array lists accepted phrasings.

## Run / build
```
npm install
npm run dev      # preview at http://localhost:5173
npm run build    # produces the dist/ folder to deploy
```
Then drag the **dist** folder to https://vercel.com/drop

## About the one-attempt lock
The lock uses the browser's local storage on the device. It stops repeats on the *same phone/browser*. Someone could still bypass it by using a different device, clearing their browser, or changing their name/surname/store. A fully cheat-proof lock needs a login system with a shared backend.

## v4.1 additions
- **Export CSV** button on the dashboard — downloads every result (one row per question, including written answers, auto/manager outcome, and any override reason) as a spreadsheet that opens in Excel.
- **Override reason note** — when you mark a written answer correct/wrong you can type an optional reason; it's saved on that answer, shown in the dashboard, and included in the CSV export.
