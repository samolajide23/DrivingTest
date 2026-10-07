# Road Ready

Personal Irish driving-test practice using the two supplied ODT documents.

## Run

`npm install`, then `npm run dev`. Open the local URL printed by Vite.

`npm test` validates the question bank and review logic. `npm run build` creates a static site in `dist` for hosting.

## Content

- All 28 oral questions, including the repeated fog question.
- All 140 numbered road signs and markings, cropped from the original sheets. The source skips number 69.
- Original sign sheets and answer keys, plus secondary controls and technical checklists.
- Two main views: Study for guided sessions, and Reference for the full collection, collapsible sign guide, vehicle preparation and original sheets.
- Sessions select up to ten questions automatically: missed and not-yet-learned answers first, balanced new oral/sign questions next, then least-practised learned answers. With new material available, reviews use at most six initial slots. Each missed answer gets at most one later retry, with a recap and a newly planned next session. No timed advancement interrupts reading the feedback.
- The recognition guide covers sign shapes, colours, lane diagrams, plates and road markings, with important exceptions. Matching source examples also provide targeted tips after a missed sign answer. These clues do not replace the exact sign meaning.
- Oral questions use self-assessment after revealing the supplied answer; sign questions use multiple choice.
- Not sure reveals the supplied answer without awarding correct credit, resets the correct-answer streak and adds the question to review with the same bounded later retry as a missed answer.
- Progress and checklists are saved in this browser on this device. Two consecutive correct answers mark an entry learned. Sessions restart after reloading, but recorded results remain. The scored total is 167; disputed sign 9 remains in Reference. Guidance is based on these practice results, not an AI assessment or a guarantee of test readiness.

These are sample study materials, not an official RSA question bank. Supplied wording is retained with spacing corrections. Important caveats appear on selected oral questions. Sign 9 has a picture/answer-key mismatch and is excluded from scoring; its supplied answer is preserved for comparison. Verify rules, speed limits and vehicle procedures against current RSA guidance and your vehicle handbook. No practice score guarantees a test pass.

Recognition-guide references: [RSA Rules of the Road](https://www.rsa.ie/services/learner-drivers/resources/rules-of-the-road), [Department of Transport Traffic Signs Manual](https://www.gov.ie/en/department-of-transport/publications/traffic-signs-manual/), [Traffic Signs Regulations 2025](https://www.irishstatutebook.ie/eli/2025/si/433/made/en/print), and [RSA rural speed-limit guidance](https://www.rsa.ie/road-safety/campaigns/rural-speed-limit). The rural sign's current 60 km/h meaning is explained separately without changing the supplied answer key.

Individual sign crops can be rebuilt with `npm run assets` from the extracted original images in `public/media`. Source ODT documents remain unchanged.

Sign crops use lossless PNG, isolate the sign face from source numbering, and retain multi-part lane diagrams. `npm run assets -- --audit` creates numbered contact sheets in a temporary directory for checking every crop. The supplied sheets are only 563 x 765 and 569 x 728 pixels; individual signs are typically 30-55 pixels tall. Cropping cannot recover missing detail. Truly high-resolution replacements require higher-resolution originals or verified official artwork; these crops are not presented as HD images.