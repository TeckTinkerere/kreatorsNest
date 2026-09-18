# Letting your peers build this with you

KreatorNest only becomes a go-to platform if the people it serves can put
things into it. Neither route below requires GitHub, a pull request, or you
being at a computer.

---

## Route 1 — Trusted peers edit the sheet directly

This is the high-trust, zero-friction path, and the one worth setting up first.

**Share → Editor** on the content sheet, for three to five peers whose judgement
you trust. Their rows go live within 30 minutes. No review step, no bottleneck,
no you.

Give them `docs/CONTENT-SHEET.md` — it has the column reference — and two rules:

1. **Fill in `title`, `link`, and `type` or the row is skipped.** Those three are
   required; everything else is optional.
2. **Never delete the last row in a tab.** An empty tab is treated as a mistake
   and the site keeps serving the previous content. Use `published = FALSE` to
   hide something instead.

Sheets keeps full version history under **File → Version history**, so any bad
edit is a two-click undo. That is your safety net — you do not need a review
process to protect against mistakes.

**Anyone with Editor access can publish to the live site.** That is the entire
point, and it is also the whole risk. Give it out deliberately.

---

## Route 2 — Anyone suggests, you approve

For peers you do not want to hand edit access to, and for strangers.

### Set up the form

1. In the content sheet: **Tools → Create a new form**. It arrives already
   linked to the sheet, writing into a new response tab.
2. Add these questions, all short-answer except where noted:

   | Question | Type | Required |
   |---|---|---|
   | What's the resource called? | Short answer | Yes |
   | Link | Short answer | Yes |
   | What kind is it? | Multiple choice: Learning, Tools, Templates, Gigs, Communities | Yes |
   | Which discipline? | Multiple choice, matching your categories | No |
   | Why is it worth adding? | Paragraph | No |
   | Your name, if you want credit | Short answer | No |

3. Rename the response tab to **`submissions`**. The site never reads this tab,
   so nothing here goes live by accident.
4. **Send → link icon → Copy.** That is your form URL.

### Wire it into the site

Set the URL as an environment variable on your host, alongside the sheet id:

```
REACT_APP_SUGGEST_FORM_URL = https://forms.gle/your-form-id
```

Redeploy once. An "Add a resource" card now appears at the end of every resource
grid — Resources, Community, and the legacy hubs. Leave the variable unset and
those cards simply do not render, so there is never a dead link.

### Approving a submission

Open the `submissions` tab, and for anything good, copy the values into a new row
on `resources`. Two minutes. Do it weekly.

If the submitter left a name, add them to the `contributors` tab — public credit
is most of what people want in return, and it is what turns a one-off submission
into a regular contributor.

---

## What to watch in analytics

Once Umami is running (see `.env.example` for the variable), the `suggest-open`
event tells you whether anyone is even trying to contribute, and the `context`
property tells you from which page. If that number is zero after a month, the
entry points are not visible enough — not that nobody wants to help.

The comparison that matters most:

- **`template-download`** — people using your paperwork
- **`resource-click`** — people using your curated links

Whichever wins is the half of KreatorNest worth your next month of effort.
