# Ad Plan Studio

Build a single page web app called Launchpad. It is a planning tool for new users of HexCoded, an AI video creation studio. The problem it solves: a new user gets 40 free credits, an image costs 5 credits, and a finished 15 second ad costs about 2,000 credits. So they spend everything on unrelated test images and never see their own ad. Launchpad makes them plan the whole ad first, spend the free credits on that one project, and see what the finished thing will cost.

Flow, four steps with a progress indicator at the top:

Step 1, Brief. One large textarea where the user pastes a client brief or a product link. Below it a button that says Build my shot plan. Also a link that says Try the example brief, which fills the textarea with a prefilled sample. Sample text: a 15 second vertical Instagram ad for Minimalist Niacinamide 10 percent face serum, aimed at Indian audiences aged 20 to 30 with oily skin, calm and clean tone, one recurring character named Riya.

Step 2, Shot plan. Show five shot cards in a vertical list. Each card shows shot number, timing such as 0 to 3s, a scene description, the on screen text, the suggested model name, and an estimated credit cost. Every field on the card is editable inline. Include a small dropdown on each card to switch the model, with options Seedance 2 Fast, Kling 3.0 Turbo, and Veo 3.1. Changing the model updates that card's credit estimate and the running total.

Step 3, Actor. A form with these fields: display name, handle, gender, age range, primary language, vibe, and a long description field. Validation rules that must work: display name is required and clearly marked before submit, not after. Handle must be 2 to 32 characters, lowercase letters, numbers, dash or underscore only, validated as the user types with a green tick or a red message. If the age range and the description text conflict, for example the description says 24 but the range is 25 to 34, show an inline warning under both fields. No error message may name a field that is not visible on screen.

Step 4, Credits and cost. Two panels side by side.

Left panel, Your free credits. The user enters their balance, defaulting to 40. It shows how those credits split across their five shots as keyframes, for example 40 credits equals 5 keyframes at 8 credits each. Underneath, a muted comparison line: without a plan, 40 credits equals 8 unrelated test images.

Right panel, Full project cost. A small table with a row per shot showing the model and credits, then a total. Below it, three cost scenarios as cards: Budget at 480p, Balanced at 1080p, Premium at 1080p with the top model. Each card shows the total credits and a line reading which plan covers it, such as Starter covers about 3 ads a month.

At the bottom, a large button labelled Open in HexCoded that links to https://hexcoded.ai.

Data and logic:

Put every credit figure in one file called pricing.js, exported as constants, with a comment above each saying it came from the HexCoded pricing page. Use these values: image 5 credits, five second clip 60 to 90 credits, 15 second 1080p ad about 2,000 credits. Calculate all totals from these constants. Never hardcode a total anywhere in the UI.

Ship with the Minimalist brief already turned into a full five shot plan as static data, so the app works completely without any API key. If an AI key is present, generate the plan from the user's brief instead. If generation fails, fall back to the example and say so clearly.

Design:

Clean and professional, aimed at creative professionals. Deep navy as the accent colour, a white background, generous spacing, and one serif font for headings with a sans serif for body text. No gradients, no emoji, no rounded playful shapes. It should look like a tool, not a landing page. Must work on mobile, since it will be opened on a phone.

Rules:

Never display a fake generated image. If there is no image, show a labelled placeholder frame with the prompt text on it.

The app must work on first load with no setup or sign in.

Handle empty input, a bad URL, and a failed request with a useful message.

Follow up prompts, one at a time

After the first build, send these separately rather than all at once:

"The actor form should fail gracefully. Add a test I can click that tries submitting with an empty display name, and make sure the error names the visible field and does not use the term display_name."

"Add a small panel at the top of Step 4 showing the single most important number: free credits as a percentage of the full ad cost. Calculate it, do not hardcode it."

"Make the shot cards draggable so the user can reorder shots, and renumber the timings automatically."

"Add a print stylesheet so the shot plan can be printed as a one page brief to send a client."

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://plan-your-ad.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c445534e-158c-4544-8fd6-da053d2e1b0b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
