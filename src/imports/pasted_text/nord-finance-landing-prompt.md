Here's the fully updated prompt reflecting the Electra UX/UI approach:

---

**NORD FINANCE — LANDING PAGE PROMPT (FINAL)**

Design a premium, dark-luxury automotive finance landing page for **Nord Finance**, a structured vehicle credit company and subsidiary of Nord Automobiles Limited. The UX/UI reference is the Electra electric vehicle website — study its scroll rhythm, section pacing, stat display style, circular metric widgets, and how it balances car imagery with functional UI elements. The tone is Polestar meets Goldman Sachs. Every detail communicates trust, sophistication, and aspiration.

---

**BRAND TOKENS — use these exactly, no substitutions:**
- Black: `#000000`
- Gold: `#C39529`
- Navy: `#072765`
- White: `#FFFFFF`
- Display font: FEP Demo Morpha (headlines and section titles only)
- Body/UI font: Poppins (all body copy, labels, inputs, buttons)
- Domain: www.nordfinance.ng

---

**UX/UI DESIGN PRINCIPLES (from Electra reference):**
- Full-page scroll layout with strong section rhythm — each section has one clear job and one clear visual anchor
- Sections alternate between pure black and deep navy to create depth without color noise
- Large typographic numbers are UI elements — use them as visual anchors (9%, 48mo, ₦32.5M, 824)
- Circular widgets for key metrics — the Nord Credit Score circle is a signature element, treat it like Electra treats its center radial
- Car imagery lives alongside UI, not just behind text — place cars in context with data overlays, spec callouts, or floating stat cards
- Stat rows and spec grids replace bullet lists — always show numbers, never describe them in prose when you can display them visually
- Subtle glows, gradients, and soft light effects on dark backgrounds — not flat black, but dimensional dark
- Section transitions feel cinematic — use subtle dividers or gradient fades between sections
- Every section has a label in small gold uppercase ("// WHAT IS NORD FINANCE") before the headline
- Horizontal scrolling cards or carousels for tier cards and testimonials on mobile

---

**SECTIONS — design all of the following in sequence:**

**1. Navigation**
- Logo left: "Nord.Finance" in white serif
- Nav center in uppercase spaced Poppins: **Products, Credit Score, Finance Assets, Nord Automobiles**
- Right: "WhatsApp Us" dark outlined button with green WhatsApp dot icon + "Apply Now" gold-filled button
- Sticky on scroll, frosted glass blur on scroll
- Hover: gold text transition
- Mobile: hamburger, full-screen overlay, links stacked large and centered

**2. Ticker Strip**
- Full-width scrolling marquee immediately below nav
- Small uppercase Poppins, dark background
- Content: "30% MINIMUM DOWN PAYMENT • FOUR TIERS. ONE INTELLIGENT SYSTEM. • POWERED BY THE NORD CREDIT SCORE • STARTING FROM ₦32.5M • UP TO 48 MONTHS TENURE • www.nordfinance.ng"
- Gold dot separators
- Continuous loop, subtle speed — adds motion and credibility without distraction

**3. Hero**
- Full viewport height (100vh)
- Left column (55%): text and CTAs
- Right column (45%): Nord Credit Score circular widget
- Small gold label top left: "— TIERED VEHICLE CREDIT INFRASTRUCTURE"
- Hero headline in FEP Demo Morpha, very large, two lines: gold italic first word + white roman weight. Example: "*Drive* the car you deserve."
- Subheadline in Poppins Regular, narrow: "Nord Finance is not a loan provider. It is a structured credit system that matches your financial profile to the vehicle and financing terms that work for you — intelligently, transparently, fairly."
- Three CTAs: gold-filled "Apply Now" + dark outlined "Contact Us" with WhatsApp icon + ghost text "View Vehicles →"
- Bottom stat strip anchored to bottom of hero: **₦32.5M+ FROM | 9% FROM P.A. | 4 CREDIT TIERS** — gold numbers, grey Poppins labels, gold vertical dividers
- Right side: large circular widget showing "NORD CREDIT SCORE" label, gold number "824", green dot "PREMIUM TIER" — surrounded by subtle concentric arc rings with a soft gold glow. Inspired by Electra's center radial widget but adapted for a credit score context
- Background: full-bleed cinematic shot of a premium dark SUV, dramatic low-angle lighting, strong dark gradient overlay left two-thirds

**4. What Is Nord Finance**
- Black background
- Two column layout — Electra "World-Class Engineering" style
- Left: section label "// WHAT IS NORD FINANCE" in gold + large mixed-weight FEP Demo Morpha headline: "Vehicle ownership, *reimagined* through credit." + dark card linking to Nord Automobiles with arrow
- Right: one strong paragraph of positioning copy + 2x2 stat grid in dark bordered cells with gold numbers:
  - 30% — Minimum Down Payment
  - 48mo — Maximum Tenure
  - 9% — Starting Annual Rate
  - 4 — Credit Tiers
- Subtle background texture using Nord diagonal pattern at low opacity

**5. Product Tiers**
- Navy `#072765` background
- Section label: "// PRODUCT TIERS"
- Headline left in FEP Demo Morpha: "Four tiers. One system."
- Subtext right: "Every borrower is different. Our tiered structure ensures your financing matches your financial reality."
- Four cards in a horizontal row — Electra model card style but adapted for finance tiers:
  - **Access Tier** — green top border — 28%+ p.a. — Score < 700
  - **Core Tier** — gold top border — 22% p.a. — Score 700-800
  - **Premium Tier** — orange top border — 18% p.a. avg. — Score 800-850
  - **HNI Product / Private Bridge** — red top border — 9% from p.a. — Score 850+
- Each card: dark background, tier badge label, large colored rate number, feature list with dash separators, score required at bottom
- Hover: subtle card lift with gold border glow

**6. How It Works**
- Black background
- Section label: "// THE PROCESS"
- Headline: "Four steps to your dream car."
- Electra-style horizontal process flow — four nodes connected by a line:
  - 01 — Choose Your Car
  - 02 — Apply Online
  - 03 — Get Approved
  - 04 — Drive Home
- Each node: large gold number, bold white title, one description line
- Connecting line in gold with subtle animated pulse on load
- Below the steps: a horizontal spec-style row showing key facts — "24hr Approval | No Hidden Charges | Nationwide Service | Transparent Process"

**7. Nord Credit Score Deep Dive**
- Navy background
- Section label: "// THE NORD CREDIT SCORE"
- Two column layout — Electra "Performance" section style
- Left: headline "Your score. Your rate. Your car." + explanatory copy about how the credit score system works + "Check Your Score" gold outlined CTA
- Right: large circular score widget — this time showing all four tier bands visually (like a gauge) with score ranges labeled. The needle or highlighted arc points to the Premium tier zone
- Below: horizontal tier band summary row — Access | Core | Premium | Private Bridge — with corresponding score ranges and rates

**8. Loan Calculator**
- Black background
- Section label: "// RUN THE NUMBERS"
- Headline: "Calculate your monthly payment."
- Centered dark card with generous padding and subtle Nord diagonal pattern texture
- Three inputs:
  - Vehicle Price — number input, default ₦35,000,000
  - Tenure — dropdown: 12 / 24 / 36 / 48 Months
  - Interest Rate — static read-only: 9% Per Annum
- Output: "Estimated Monthly Payment" label + large bold gold figure "₦1,590,312"
- Gold-filled "Get Started" CTA button
- Input style: dark fill, white text, gold border on focus — Electra spec input aesthetic

**9. Testimonials**
- Navy background
- Section label: "// WHAT OUR CUSTOMERS SAY"
- Headline: "Real people. Real drives."
- Three testimonial cards in a row — Electra "Real Experiences" layout
- Each card: star rating, quote, customer name, car model financed, tier badge
- Dark cards, thin gold top border, subtle hover lift

**10. Final CTA Band**
- Full-width, gold background `#C39529`
- FEP Demo Morpha headline in black: "Your dream car is closer than you think."
- One black-filled "Apply Now" button
- www.nordfinance.ng in small Poppins below

**11. Footer**
- Black background
- Thin gold top divider
- Four columns: Nord.Finance logo + tagline | Products links | Company links | Contact + socials
- "A Subsidiary of Nord Automobiles Limited" in small gold centered below columns
- Bottom bar: "© 2025 Nord Finance. All Rights Reserved." left | www.nordfinance.ng right

---

**COMPONENT STANDARDS:**
- Buttons: 8px border radius, Poppins SemiBold, uppercase with letter-spacing
- Cards: 12px border radius, no heavy drop shadows — subtle gold border or soft glow on hover
- Inputs: dark fill, white text, gold focus ring
- Section padding: minimum 120px top and bottom
- Max content width: 1440px, 12-column grid, 80px gutters
- Icons: minimal single-weight line icons only — no filled clip-art
- Numbers as design elements: always large, always gold, always Poppins or FEP Demo Morpha
- Serif italic mix: one emotionally weighted italic gold word per key headline — not every section, only where it earns its place
- Subtle glow effects: soft radial gold or navy glow behind circular widgets and hero car image — never harsh, always dimensional

---

**OVERALL QUALITY STANDARD:**
Awwwards competitive. The Electra site is the UX/UI reference — match its scroll rhythm, section confidence, and how it makes technical information feel exciting rather than dry. The Nord Credit Score widget is the signature UI element of this site — it should appear in the hero, deepen in Section 7, and feel like a product in itself. Gold is earned, never decorative. Car imagery is cinematic, never stock. Every number on this page is a design decision.

---

That is the complete final prompt. Every section, every component, every design principle is now in one clean block. Paste it directly into Figma Make.