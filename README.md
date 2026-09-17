# Launchpad

**A guided first project for new HexCoded users.**

Megha Gupta · [Live prototype](https://plan-your-ad.lovable.app/) · Walkthrough: [paste Loom link]

---

## Why I picked this problem

I signed up for HexCoded the way any new user would, and wrote down what happened.

The homepage button said "Get started for free." I signed up, landed in Creative Studio, and received 40 credits. I tried to create an actor first, because the actor library is what the product is built around. The form failed with an error reading `display_name required`, and no field on screen carried that label. The information tooltip beside it did not open. I refreshed the page, retried in an incognito window, and got the same result each time. I never created an actor.

So I used Creative Studio instead. One prompt, one image, five credits. That gave me eight images in total.

Then I opened the [pricing page](https://hexcoded.ai/pricing) and found the number that reframed the session. A polished 15 second 1080p ad runs roughly 2,000 credits, and a single 5 second clip starts at 60 to 90. The balance I had been handed could not produce one second of video.

> **HexCoded is a video studio. My first session ended without a video in it.**

---

## The problem

**A new user spends their entire free balance before they see the output that would make them pay.**

Three things make this worse than it needs to be.

1. **The free balance goes on the wrong thing.** Forty credits buys eight images at five credits each. Nothing points the user toward one coherent project, so the credits go on disconnected test prompts and add up to nothing worth showing a client.
2. **The first step can break.** Actor creation is the entry point to the product's strongest differentiator, and mine failed with an error naming a field I could not find.
3. **Cost is shown per render, not per project.** The product already promises you see the exact cost before you render, which is good. But nobody buys a subscription to make one clip. Users need the cost of a finished ad and the plan that covers it.

---

## Evidence

### From my own session

| What happened | Cost |
|---|---|
| Actor creation failed with `display_name required`. No field on the form carries that label | Blocked |
| Information tooltip on the actor form did not open | Blocked |
| Refreshed and retried in incognito. Same error | Blocked |
| Age dropdown starts at 25 to 34 while the description field invites any age. The two can contradict each other with no warning | Confusing |
| One Creative Studio image generated | 5 credits |
| Free balance covers eight images. Video produced: none | 40 credits |

Screenshots: [paste link to screenshot folder]

### What the numbers say

| Item | Source | Figure |
|---|---|---|
| Free credits on signup | My account | 40 |
| One image in Creative Studio | My account | 5 credits |
| Cheapest 5 second clip | HexCoded pricing page | 60 to 90 credits |
| 15 second 1080p ad | HexCoded pricing page | About 2,000 credits |
| Free balance as a share of one ad | Calculated | About 2 percent |

The [homepage](https://hexcoded.ai/) invites users to get started for free. The [pricing FAQ](https://hexcoded.ai/pricing) states there is no free plan. Both are live at the same time.

### What competitors give away

| Tool | Free allowance | What it actually buys | Video free |
|---|---|---|---|
| HexCoded | 40 credits, one time | About 8 images | No |
| LTX Studio | 800 credits, one time, no renewal | Their own LTX 2 models only. Personal use, no commercial rights | Limited |
| OpenArt | 40 credits, plus 50 for joining Discord | A few images | Drains fast |
| ImagineArt | 100 credits daily, refreshed | Daily images, limited video models, outputs public | Limited |
| Magnific | Paid first since the Freepik rebrand | Very little | No |

Pricing pages checked September 2026: [HexCoded](https://hexcoded.ai/pricing), [LTX Studio](https://support.ltx.studio/hc/en-us/articles/32039381455122-Understanding-the-free-plan), [OpenArt](https://openart.ai/pricing), [ImagineArt](https://docs.imagine.art/account/subscription-plans), [Magnific](https://magnific.com/pricing).

**The pattern holds across the category. Free credits buy images, not video. Nobody has solved the problem of letting a user see their own video before they pay. That is not a gap HexCoded needs to close. It is one HexCoded could open.**

---

## What I built

Live at [plan-your-ad.lovable.app](https://plan-your-ad.lovable.app/). Four steps, no sign in, works on a phone.

### 1. Brief in, shot plan out, at no cost

Paste a client brief or a product link. Launchpad returns a five shot plan: scene description, on screen text, a recommended model per shot, and an estimated cost for each. Every field is editable, because the tool assists the user's judgment rather than replacing it.

This step is text generation. It costs HexCoded a fraction of a cent and hands the user a plan worth having before a single credit is spent.

### 2. The free credits go into their project, not into tests

Launchpad selects the cheapest suitable image model and renders keyframes of their actor in their scenes. It says up front that 40 credits covers five keyframes of this ad, and shows the alternative beneath it: without a plan, the same 40 credits buys eight unrelated test images.

Same credits, same cost to HexCoded. The difference is that the user finishes the session holding five frames of one coherent ad.

### 3. Whole project cost, matched to a plan

The product shows cost per render. Launchpad shows the total, across three quality settings, with the plan that covers each.

This does two jobs. It turns the paywall into a decision rather than a wall. And it gives agencies a number they can quote a client, which is the actual buying trigger for that segment.

### 4. An actor form that cannot fail silently

Display name is the first field, visibly marked as required. Validation runs as the user types. The submit button stays disabled and names the fields still missing. The handle is checked live for format. If the age range and the description disagree, both fields carry a warning. No error names a field that is not on screen.

---

## What I deliberately left out

- **No free video.** Video is the expensive part and giving it away invites abuse. The free tier stays image only. Launchpad changes only what those images are of.
- **No pricing change.** I am not proposing HexCoded move to freemium. That is a business call needing data I do not have. Launchpad works inside the pricing that exists today.
- **No project management, collaboration, or export.** First session only.
- **No brand kit or asset library.** Real problems, different ones.

---

## How I would measure it

| Metric | Today | Why it matters |
|---|---|---|
| Signup to first saved actor | Baseline unknown | Shows whether the entry point still breaks |
| Signup to first completed shot plan | Does not exist | The new activation moment |
| Share of free credits spent on a defined project | Near zero | The core behaviour change |
| Time from signup to first paid plan | Unknown | The business outcome |
| Trial to paid conversion | Unknown | The business outcome |
| Cost to HexCoded per free session | About 40 credits | Must stay flat. If it rises, the design is wrong |

**Experiment.** Run the current signup flow against Launchpad for new users. Primary metric is trial to paid conversion within seven days. Guardrail is cost per free session. Ship if conversion lifts while cost stays flat.

---

## Risks

- Shot plans are cheap to generate, so they could be farmed. Rate limit to a few per account per day. Text costs are low enough that this is not urgent.
- A weak first plan is worse than none. The quality of the brief to shot list step decides whether this helps or hurts, so that is where the engineering effort belongs.
- Cost estimates go stale when model prices change. They should read from the same source the render screen uses, never a separate table.
- Keyframes could set expectations the final render cannot meet. They must come from models the user will actually pay for, not a flattering cheap one.

---

## Four small fixes I would ship this week

Separate from the feature. These came out of the same session.

1. The `display_name required` error names a field that is not on the form. It blocks actor creation for new users.
2. The information tooltip on the actor form does not open.
3. The age dropdown starts at 25 to 34 while the description field invites any age. The two can contradict each other silently.
4. The homepage offers a free start while the pricing FAQ states there is no free plan. One of them should change.

---

## Why I am the person who noticed this

I spent two years as a Subject Matter Expert at Chegg, reviewing roughly 15,000 questions a month against a rubric for completeness, correctness and relevancy, and raising the pass rate from an 85 percent baseline to 98 percent. Part of that work was evaluating LLM generated answers, correcting them, and refining prompts so the output met graduate level standards.

I also benchmarked competing AI models on multi step problems, comparing accuracy, reasoning quality and consistency, to decide which model the subject should use. That is the same question a HexCoded user faces across 30 plus models, except they answer it by spending credits and looking at what comes out.

Judging AI output against a standard, and working out which model to trust for which job, is what I did professionally before I saw it as a product problem.

---

## Scope note

This is a standalone tool and is not connected to HexCoded systems. Credit figures come from the public pricing page and from my own account, and all of them live in one file, so if a number changes the logic still holds and the update is a single edit.
