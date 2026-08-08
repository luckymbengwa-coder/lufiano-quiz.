import React, { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// LUFIANO KNOWLEDGE ASSESSMENT — v4 (short-answer + concept grading + one attempt)
// ═══════════════════════════════════════════════════════════════════════════════

const MANAGER_PIN = "8007";
const QUIZ_TIME_SECONDS = 20 * 60; // 20 minutes

const STORES = [
  "Lufiano – Menlyn Maine Central Square",
  "Lufiano – Sandton City",
  "Lufiano – Fairland Walk",
  "Lufiano – Gateway",
  "Lufiano – Boardwalk",
  "Lufiano – Hemmingways",
  "Lufiano – Mimosa Mall",
  "Nik'Ana",
  "Online / Head Office",
];

const QUIZ_DATA = {
  "Our Values": {
    color: "#C8A96E", icon: "◆", category: "Foundation",
    description: "Core principles that guide everything we do at Lufiano",
    questions: [
      { t: "mcq", q: "Which Lufiano value states 'Team objective before individual goals'?", options: ["Freedom through responsibility", "Strength through diversity", "High performance culture", "Honour and Integrity"], answer: 1, explanation: "Strength through diversity means we put team objectives first." },
      { t: "mcq", q: "How many core values does Lufiano have?", options: ["4", "5", "6", "7"], answer: 2, explanation: "Lufiano has 6 core values." },
      { t: "mcq", q: "The value 'Dignity and respect' applies to whom?", options: ["Customers only", "Suppliers only", "Each other and customers only", "Each other, customers AND suppliers"], answer: 3, explanation: "We treat each other, customers AND suppliers with dignity, respect and humility." },
      { t: "mcq", q: "Which value includes 'Quality is core of our business'?", options: ["Demonstrates Enterprising Spirit", "Honour and Integrity", "High performance culture", "Strength through diversity"], answer: 2, explanation: "High performance culture includes quality being core to the business." },
      { t: "mcq", q: "Which value describes being 'passionate, courageous and resilient'?", options: ["Honour and Integrity", "High performance culture", "Demonstrates Enterprising Spirit", "Freedom through responsibility"], answer: 2, explanation: "Demonstrates Enterprising Spirit — passionate, courageous and resilient." },
      { t: "mcq", q: "According to Lufiano values, diversity should be seen as:", options: ["A challenge to manage", "An opportunity, not a threat", "Secondary to performance", "A legal requirement only"], answer: 1, explanation: "Strength through diversity sees diversity as an opportunity, not a threat." },
      { t: "mcq", q: "Which value requires employees to be accountable for their actions?", options: ["Demonstrates Enterprising Spirit", "Strength through diversity", "Freedom through responsibility", "Dignity and respect"], answer: 2, explanation: "Freedom through responsibility — we are accountable for our actions and decisions." },
      { t: "mcq", q: "'We work hard and play hard' falls under which value?", options: ["High performance culture", "Freedom through responsibility", "Demonstrates Enterprising Spirit", "Strength through diversity"], answer: 2, explanation: "This is part of Demonstrates Enterprising Spirit." },
      { t: "mcq", q: "How do employees confirm they understand the values?", options: ["An online test", "By signing and dating the values page", "Verbal confirmation", "No confirmation needed"], answer: 1, explanation: "Employees sign and date the values page." },
      { t: "mcq", q: "The phrase 'We respect ourselves so we can respect others' belongs to which value?", options: ["Dignity and respect", "Strength through diversity", "Demonstrates Enterprising Spirit", "Honour and Integrity"], answer: 3, explanation: "This comes from Honour and Integrity." },
      { t: "short", q: "In your own words, explain what 'Freedom through responsibility' means and give an example of how you would show it in your daily work.", need: 2, concepts: [{ label: "accountability", any: ["account", "responsib", "own up", "answer for", "take ownership", "liable"] }, { label: "discipline", any: ["disciplin", "self-control", "exercise control", "professional"] }, { label: "decisions/actions", any: ["decision", "action", "choice", "behav"] }], sample: "It means being accountable for my own actions and decisions and exercising discipline — e.g. taking ownership of a mistake on a cash-up and correcting it rather than hiding it.", explanation: "Freedom through responsibility = accountability for our actions/decisions and exercising discipline." },
      { t: "short", q: "Lufiano says diversity is 'an opportunity, not a threat.' Explain what this means for how a team should work together.", need: 2, concepts: [{ label: "opportunity", any: ["opportun", "strength", "benefit", "advantage", "positive"] }, { label: "team over individual", any: ["team object", "team goal", "together", "collectiv", "group before", "team first"] }, { label: "different backgrounds/views", any: ["differ", "divers", "background", "perspective", "unique", "variety"] }], sample: "It means we treat our different backgrounds and viewpoints as a strength that makes the team better, and we put team objectives ahead of individual goals.", explanation: "Strength through diversity: diversity is a strength/opportunity and the team objective comes before individual goals." },
      { t: "short", q: "Name and briefly describe TWO of Lufiano's six core values in your own words.", need: 2, concepts: [{ label: "freedom/responsibility", any: ["freedom through", "responsib", "account"] }, { label: "diversity", any: ["strength through", "divers", "team object"] }, { label: "dignity/respect", any: ["dignity", "respect", "humility"] }, { label: "high performance", any: ["high performance", "quality", "innovat", "simplicity", "develop team", "results"] }, { label: "enterprising spirit", any: ["enterprising", "passionate", "courageous", "resilient"] }, { label: "honour/integrity", any: ["honour", "honor", "integrity", "honest", "fair", "reliab", "dependab"] }], sample: "Honour and Integrity — being honest, fair and dependable. Dignity and respect — treating colleagues, customers and suppliers with respect and humility.", explanation: "Any two of the six values, correctly described, is full marks." },
      { t: "short", q: "What does 'Honour and Integrity' require of you when no one is watching? Explain.", need: 2, concepts: [{ label: "honesty/fairness", any: ["honest", "fair", "truth", "transparent"] }, { label: "reliable/dependable", any: ["reliab", "dependab", "consistent", "trust", "depend on"] }, { label: "self-respect", any: ["respect myself", "self-respect", "respect ourselves", "respect our"] }], sample: "It means still being honest, fair and dependable even with no supervision, because we respect ourselves so we can respect others.", explanation: "Honour and Integrity = honesty, fairness, reliability and self-respect at all times." },
      { t: "short", q: "'High performance culture' lists several ideas. Describe in your own words what a high performance culture looks like on the shop floor.", need: 2, concepts: [{ label: "innovation", any: ["innovat", "creativ", "new idea", "improve"] }, { label: "simplicity", any: ["simpl", "straightforward", "easy", "streamline"] }, { label: "developing teams", any: ["develop", "train", "grow", "foster", "talent", "coach"] }, { label: "results/quality", any: ["result", "target", "quality", "standard", "deliver"] }], sample: "Staff look for simpler and better ways of working, help develop each other, keep quality high and stay focused on delivering results.", explanation: "High performance culture = innovation, simplicity, developing teams, driving results and quality." },
      { t: "short", q: "Explain why 'Dignity and respect' extends to suppliers and not just customers.", need: 2, concepts: [{ label: "suppliers included", any: ["supplier", "vendor", "partner"] }, { label: "everyone/all", any: ["everyone", "all", "each other", "both", "not just"] }, { label: "respect/humility", any: ["respect", "dignity", "humility", "courtesy"] }], sample: "Because we treat everyone we deal with — each other, customers and suppliers — with the same dignity, respect and humility; suppliers are partners in our business.", explanation: "Dignity and respect applies to each other, customers AND suppliers." },
      { t: "short", q: "A colleague wants to cut a corner on a process to hit a target faster. Which value(s) would guide your response, and what would you say?", need: 2, concepts: [{ label: "integrity/honesty", any: ["integrity", "honest", "honour", "honor", "right way", "proper"] }, { label: "responsibility/discipline", any: ["responsib", "disciplin", "account", "standard"] }, { label: "quality", any: ["quality", "standard", "proper", "correct"] }], sample: "Honour and Integrity and Freedom through responsibility — I'd say we should do it the right way; cutting corners breaks quality standards and we're accountable for doing things properly.", explanation: "Integrity + responsibility: we don't sacrifice standards/quality to save time." },
      { t: "short", q: "Why do you think Lufiano asks staff to put 'team objective before individual goals'? Give your reasoning.", need: 2, concepts: [{ label: "team success", any: ["team success", "whole team", "collective", "together", "shared goal"] }, { label: "business/store benefit", any: ["business", "store", "company", "overall", "bigger"] }, { label: "cooperation", any: ["cooperat", "support each", "help", "work together", "unity"] }], sample: "Because the store only succeeds when the whole team succeeds; putting the team first means we support each other rather than competing, which lifts overall results.", explanation: "Team-first thinking drives collective success and cooperation over internal competition." },
      { t: "short", q: "Give one practical example of 'Demonstrates Enterprising Spirit' in a retail setting.", need: 1, concepts: [{ label: "initiative/courage", any: ["initiativ", "courage", "bold", "step up", "volunteer", "take on"] }, { label: "passion/resilience", any: ["passion", "resilien", "persever", "keep going", "energy", "enthus"] }, { label: "hard work", any: ["hard work", "work hard", "effort", "extra"] }], sample: "Stepping up to turn around a slow sales day with energy and new ideas, and staying resilient when it's busy or difficult.", explanation: "Enterprising Spirit = passion, courage, resilience and hard work." },
      { t: "short", q: "Why does confirming the values by signing and dating the page matter, in your view?", need: 1, concepts: [{ label: "commitment/agreement", any: ["commit", "agree", "accept", "acknowledg", "buy-in", "pledge"] }, { label: "understanding", any: ["understand", "aware", "read", "know"] }, { label: "accountability", any: ["account", "responsib", "held to", "bound"] }], sample: "Signing shows you've read, understood and committed to the values, so you can be held accountable to them.", explanation: "Signing = understanding + commitment + accountability to the values." },
    ],
  },
  "Customer Service": {
    color: "#7B9E87", icon: "✦", category: "Foundation",
    description: "Standards for how customers are treated across all Lufiano stores",
    questions: [
      { t: "mcq", q: "Within how many rings should the store phone be answered?", options: ["1", "2", "3", "5"], answer: 2, explanation: "Answer the store line within 3 rings." },
      { t: "mcq", q: "How long do you have to respond to enquiries on the line?", options: ["5 min", "10 min", "15 min", "30 min"], answer: 1, explanation: "Respond within 10 minutes." },
      { t: "mcq", q: "What should every package tag be personalised with?", options: ["Store name", "Product code", "The client's name", "Purchase date"], answer: 2, explanation: "Personalise every tag with the client's name unless not provided." },
      { t: "mcq", q: "When a customer enters, you should NOT:", options: ["Make eye contact", "Stand behind the counter", "Smile", "Offer help"], answer: 1, explanation: "Do not stand behind the counter — approach the client." },
      { t: "mcq", q: "These customer service standards apply to:", options: ["Managers only", "Online staff only", "All employees in all stores", "Complaint handlers only"], answer: 2, explanation: "They apply to ALL employees in ALL stores." },
      { t: "mcq", q: "What is the first thing to do when a customer enters?", options: ["Show promotions", "Greet them", "Check purchase history", "Ask their budget"], answer: 1, explanation: "Greet the customer first." },
      { t: "mcq", q: "How should you communicate with customers?", options: ["Technically", "Clearly and concisely", "With a script", "In writing only"], answer: 1, explanation: "Communicate clearly and concisely." },
      { t: "mcq", q: "What attitude must staff maintain?", options: ["Formal", "Positive", "Neutral", "Assertive"], answer: 1, explanation: "Have a positive attitude." },
      { t: "mcq", q: "Not all customer cases are:", options: ["Important", "Equal", "Recorded", "Urgent"], answer: 1, explanation: "Acknowledge that not all cases are equal." },
      { t: "mcq", q: "You should not share with the client:", options: ["Product prices", "Crucial/irrelevant information", "Store hours", "Sizes"], answer: 1, explanation: "Do not share crucial or irrelevant information." },
      { t: "short", q: "Describe, step by step, how you should greet and approach a customer who has just walked into the store.", need: 2, concepts: [{ label: "greet", any: ["greet", "hello", "welcome", "acknowledge"] }, { label: "friendly/respectful", any: ["friendly", "respect", "warm", "polite", "smile"] }, { label: "approach not counter", any: ["approach", "go to", "walk to", "not behind", "leave the counter", "come from"] }], sample: "Greet them in a friendly, respectful way with a smile, and approach them rather than staying behind the counter.", explanation: "Greet warmly and approach the client — don't stand behind the counter." },
      { t: "short", q: "Explain why Lufiano personalises package tags with the client's name, and when you would NOT do this.", need: 2, concepts: [{ label: "personal/relationship", any: ["personal", "relationship", "special", "valued", "connect", "touch"] }, { label: "name", any: ["name", "client's name", "their name"] }, { label: "exception no name", any: ["not provided", "no name", "didn't give", "unless", "not given", "wasn't provided"] }], sample: "It makes the service feel personal and builds the relationship. You wouldn't when the customer's name wasn't provided.", explanation: "Personalisation builds relationship; exception is when no name was provided." },
      { t: "short", q: "A customer phones with a complaint. Using Lufiano's standards, describe how you should handle the call.", need: 2, concepts: [{ label: "answer promptly", any: ["3 ring", "three ring", "quickly", "promptly", "answer within"] }, { label: "respond in time", any: ["10 min", "ten min", "respond within", "timely", "follow up"] }, { label: "positive/clear", any: ["positive", "clear", "concise", "calm", "polite", "solid response"] }, { label: "case not equal", any: ["not equal", "each case", "treat as such", "unique", "individual"] }], sample: "Answer within 3 rings, respond to the enquiry within 10 minutes, stay positive and give clear, solid responses, and treat the case on its own merits since not all cases are equal.", explanation: "Prompt answer, 10-min response, positive/clear communication, treat each case individually." },
      { t: "short", q: "What does it mean that 'not all cases are equal' and how should that change the way you serve customers?", need: 2, concepts: [{ label: "different situations", any: ["differ", "situation", "each case", "individual", "unique", "circumstance"] }, { label: "tailor response", any: ["treat as such", "adapt", "tailor", "accordingly", "suit", "adjust"] }, { label: "judgement", any: ["judg", "assess", "understand", "listen"] }], sample: "Each customer's situation is different, so I shouldn't use one fixed script — I assess each case and respond in the way that suits that specific customer.", explanation: "Recognise each case is unique and tailor the response accordingly." },
      { t: "short", q: "Why is it important to communicate 'clearly and concisely' with customers? Give your reasoning.", need: 1, concepts: [{ label: "avoid confusion", any: ["confus", "misunderstand", "clear", "unclear", "mixed up", "ambigu"] }, { label: "understanding", any: ["understand", "know", "informed", "follow"] }, { label: "professional/trust", any: ["professional", "trust", "confiden", "credib"] }], sample: "So the customer understands exactly what's happening without confusion, which builds trust and looks professional.", explanation: "Clear, concise communication prevents confusion and builds trust." },
      { t: "short", q: "Give two things you should do to 'build a relationship' with a customer, and explain why it matters.", need: 2, concepts: [{ label: "engage/communicate", any: ["engage", "communicat", "talk", "converse", "listen", "interact"] }, { label: "positive/friendly", any: ["positive", "friendly", "warm", "smile", "welcom"] }, { label: "repeat/loyalty benefit", any: ["return", "repeat", "loyal", "come back", "relationship", "retain"] }], sample: "Engage and communicate warmly and stay positive. It matters because a good relationship makes customers feel valued and more likely to return.", explanation: "Engaging positively builds relationships that encourage loyalty and repeat business." },
      { t: "short", q: "Why should you NOT share 'crucial or irrelevant information' with a client? Explain the risk.", need: 1, concepts: [{ label: "confidential/internal", any: ["confidential", "internal", "private", "sensitive", "crucial", "business"] }, { label: "confusion/irrelevant", any: ["irrelevant", "confus", "overwhelm", "unnecessary", "distract"] }, { label: "protect business", any: ["protect", "risk", "harm", "misuse", "against"] }], sample: "Crucial information may be confidential to the business and irrelevant information just confuses the customer — sharing it creates risk and a poor experience.", explanation: "Protect confidential info and avoid confusing customers with irrelevant detail." },
      { t: "short", q: "A customer's enquiry will take longer than 10 minutes to resolve. What should you do and why?", need: 2, concepts: [{ label: "respond within 10", any: ["10 min", "ten min", "within", "respond", "reply"] }, { label: "acknowledge/update", any: ["acknowledge", "update", "let them know", "inform", "keep them", "feedback"] }, { label: "clear response", any: ["clear", "solid response", "honest", "manage expect"] }], sample: "Still respond within 10 minutes to acknowledge them, give a clear update on what's happening and when they'll hear back, rather than leaving them waiting.", explanation: "Respond within 10 minutes even if only to acknowledge and update the customer." },
      { t: "short", q: "Explain the difference a 'positive attitude' makes when a customer is being difficult.", need: 2, concepts: [{ label: "de-escalate/calm", any: ["calm", "de-escalat", "diffuse", "settle", "ease", "reduce tension"] }, { label: "positive", any: ["positive", "upbeat", "friendly", "pleasant", "optimis"] }, { label: "experience/outcome", any: ["experience", "outcome", "resolve", "satisf", "better", "turn around"] }], sample: "Staying positive helps calm the situation and can turn a difficult interaction into a better outcome and experience for the customer.", explanation: "A positive attitude de-escalates tension and improves the outcome." },
      { t: "short", q: "In your own words, what is the overall purpose of having customer service standards at Lufiano?", need: 1, concepts: [{ label: "consistency", any: ["consistent", "same", "uniform", "every store", "all staff", "standard"] }, { label: "clear expectations", any: ["expectation", "guideline", "clear", "know what", "how to"] }, { label: "customer experience", any: ["customer", "experience", "treat", "support", "satisf", "service"] }], sample: "To set clear, consistent guidelines for how every customer is treated and supported across all stores, so everyone gets the same good experience.", explanation: "Standards create consistent, clear expectations for how customers are treated everywhere." },
    ],
  },
  "Lay-buy Policy": {
    color: "#E07B7B", icon: "₁", category: "Policy",
    description: "Rules governing lay-buy deposits, payment plans and cancellations",
    questions: [
      { t: "mcq", q: "What deposit percentage starts a lay-buy?", options: ["20%", "25%", "35%", "50%"], answer: 2, explanation: "35% deposit." },
      { t: "mcq", q: "Lay-buy payment plan duration?", options: ["1 month", "2 months", "3 months", "6 months"], answer: 2, explanation: "Three-month payment plan." },
      { t: "mcq", q: "Lay-buy is only permitted on:", options: ["Custom items", "Pre-orders", "In-stock items", "All items"], answer: 2, explanation: "Only in-stock items." },
      { t: "mcq", q: "1st month cancellation penalty?", options: ["0%", "5%", "10%", "15%"], answer: 1, explanation: "5% in the 1st month." },
      { t: "mcq", q: "2nd month cancellation penalty?", options: ["5%", "10%", "15%", "20%"], answer: 1, explanation: "10% in the 2nd month." },
      { t: "mcq", q: "3rd month cancellation penalty?", options: ["10%", "12%", "15%", "20%"], answer: 2, explanation: "15% in the 3rd month." },
      { t: "mcq", q: "Refunds on a lay-buy item are:", options: ["Within 14 days", "Within 7 days", "Not permitted", "If faulty only"], answer: 2, explanation: "No refunds on lay-buy items." },
      { t: "mcq", q: "Exchange window after collecting a lay-buy item?", options: ["No exchanges", "7 calendar days", "14 days", "30 days"], answer: 1, explanation: "Exchange within 7 calendar days of collection." },
      { t: "mcq", q: "Cancellation on a custom-made item is:", options: ["Allowed with 15%", "1st month only", "Not permitted — liable for full value", "With 30 days notice"], answer: 2, explanation: "No cancellation on custom items; liable for full value." },
      { t: "mcq", q: "After the lay-buy is concluded, the in-stock item is:", options: ["Left on floor", "Transferred", "Fulfilled and stored away immediately", "Reserved on display"], answer: 2, explanation: "Fulfilled and stored away immediately." },
      { t: "short", q: "Explain the full lay-buy mechanism to a customer: deposit, plan length, and what happens to their item.", need: 2, concepts: [{ label: "35% deposit", any: ["35", "thirty-five", "thirty five"] }, { label: "3 months", any: ["3 month", "three month", "90 day", "quarter"] }, { label: "item stored", any: ["store", "stored away", "set aside", "reserve", "fulfil", "kept", "put away"] }], sample: "You pay a 35% deposit and pay off the balance over a three-month plan; once the lay-buy is concluded we fulfil the order and store the item away for you.", explanation: "35% deposit, 3-month plan, item fulfilled and stored away." },
      { t: "short", q: "A customer wants to cancel their lay-buy in the second month. Explain what happens to their money.", need: 2, concepts: [{ label: "10% penalty", any: ["10", "ten percent", "ten%"] }, { label: "penalty on total value", any: ["total purchase", "purchase value", "total value", "of the total", "of total"] }, { label: "2nd month", any: ["second month", "2nd month", "month 2", "month two"] }], sample: "In the second month the cancellation penalty is 10% of the total purchase value, which is deducted before returning the rest.", explanation: "2nd month cancellation = 10% of total purchase value." },
      { t: "short", q: "Why do you think lay-buy is only allowed on in-stock items and not custom-made ones? Give your reasoning.", need: 2, concepts: [{ label: "custom can't resell", any: ["can't resell", "cannot resell", "made to order", "specific", "bespoke", "hard to sell", "no one else", "unique"] }, { label: "in-stock available", any: ["in stock", "available", "already have", "on hand", "existing"] }, { label: "risk/liability", any: ["risk", "liable", "loss", "commit", "stuck", "tie up"] }], sample: "An in-stock item can be sold to someone else if the deal falls through, but a custom item is made specifically for that customer and can't easily be resold, so they stay liable for its full value.", explanation: "Custom items can't be resold, so lay-buy/cancellation rules differ; in-stock items carry less risk." },
      { t: "short", q: "A lay-buy expires with payments still outstanding and the customer never returns. Describe what the store does with the order and the money.", need: 2, concepts: [{ label: "cancel order", any: ["cancel", "close", "end the order", "terminate"] }, { label: "deduct 15%", any: ["15", "fifteen"] }, { label: "credit remainder", any: ["gift card", "store credit", "credit the", "remaining", "balance to", "rest as credit"] }], sample: "The store cancels the order, deducts the 15% penalty, and credits the remaining balance to a gift card or store credit.", explanation: "Expired lay-buy: cancel, deduct 15%, credit the remainder to gift card/store credit." },
      { t: "short", q: "How should a WhatsApp (manual) lay-buy be recorded differently from an in-store one, and why?", need: 2, concepts: [{ label: "text acknowledgement", any: ["text", "message", "whatsapp", "acknowledge through", "in writing", "reply"] }, { label: "screenshot", any: ["screenshot", "screen shot", "capture", "picture", "proof"] }, { label: "record/evidence", any: ["record", "evidence", "proof", "file", "folder", "store device"] }], sample: "For a manual lay-buy the customer acknowledges the policy by text, and you take a screenshot saved on the store device as proof, since there's no physical signature.", explanation: "Manual lay-buy: acknowledge by text + screenshot saved for record." },
      { t: "short", q: "Explain the difference between what happens when the CUSTOMER cancels a lay-buy versus when LUFIANO cancels it.", need: 2, concepts: [{ label: "customer penalty", any: ["penalty", "5", "10", "15", "percent", "deduct", "charge"] }, { label: "lufiano credits/refunds", any: ["credit", "full refund", "alternative goods", "refund all", "monies paid", "towards other"] }, { label: "lufiano reason", any: ["cannot fulfil", "can't fulfil", "impede", "unable", "stock issue", "reasons"] }], sample: "If the customer cancels, a 5/10/15% penalty applies by month. If Lufiano cancels (because it can't fulfil the order), the customer is credited towards alternative goods or given a full refund of all monies paid.", explanation: "Customer cancel = penalty by month; Lufiano cancel = credit toward alternatives or full refund." },
      { t: "short", q: "After signing the lay-buy policy in store, list the next administrative steps you take to complete the transaction.", need: 2, concepts: [{ label: "collect deposit on POS", any: ["deposit", "pos", "collect", "payment", "35", "point of sale"] }, { label: "picture of policy", any: ["picture", "photo", "submit", "relevant person", "screenshot"] }, { label: "cash up note + pack", any: ["cash up", "note", "pack", "partial order", "store away"] }], sample: "Collect the 35% deposit on the POS, take a picture of the signed policy and submit it to the relevant person, then note the amount on the cash up and pack the order with other partial orders.", explanation: "Collect deposit on POS, photograph/submit policy, note on cash up, pack with partial orders." },
      { t: "short", q: "Why is a 'random audit' done on the lay-buy process, and what is it checking?", need: 1, concepts: [{ label: "compliance/followed", any: ["followed", "complian", "correct", "properly", "adhere", "being done"] }, { label: "process/policy", any: ["process", "policy", "procedure", "steps", "rules"] }, { label: "catch errors/consistency", any: ["error", "mistake", "check", "catch", "ensure", "verify", "consistent"] }], sample: "To check that the lay-buy process is actually being followed correctly and consistently, catching any mistakes or shortcuts.", explanation: "Random audits verify the lay-buy process is being followed correctly." },
      { t: "short", q: "A customer asks for a refund on a lay-buy item they've already collected. How do you respond and why?", need: 2, concepts: [{ label: "no refund", any: ["no refund", "not permitted", "cannot refund", "can't refund", "refuse refund"] }, { label: "exchange 7 days", any: ["exchange", "7 day", "seven day", "swap"] }, { label: "policy basis", any: ["policy", "as per", "according", "rule", "states"] }], sample: "I'd explain that no refunds are permitted on lay-buy items as per policy, but they can exchange within 7 calendar days of collecting the item.", explanation: "No refunds on lay-buy; exchange allowed within 7 calendar days of collection." },
      { t: "short", q: "What is the purpose of offering lay-buy to customers, in your own words?", need: 1, concepts: [{ label: "secure item", any: ["secure", "reserve", "hold", "lock in", "guarantee", "set aside"] }, { label: "without full payment", any: ["without full", "not pay all", "over time", "instal", "spread", "deposit", "afford"] }, { label: "customer benefit", any: ["customer", "afford", "easier", "help", "flexib", "convenien"] }], sample: "It lets a customer secure an item they want without paying the full amount upfront, spreading the cost over time.", explanation: "Lay-buy secures an item without full outright payment." },
    ],
  },
  "Refund & Return Policy": {
    color: "#E09860", icon: "₂", category: "Policy",
    description: "Refund eligibility, deductions, timelines and exchange conditions",
    questions: [
      { t: "mcq", q: "Which channels are eligible for a refund?", options: ["In-store only", "All channels", "Online and WhatsApp orders only", "Online only"], answer: 2, explanation: "Only online and WhatsApp line orders." },
      { t: "mcq", q: "Refund request window?", options: ["3 days", "7 calendar days", "14 days", "30 days"], answer: 1, explanation: "7 calendar days of purchase." },
      { t: "mcq", q: "Handling cost deducted from an online refund?", options: ["2%", "4%", "6%", "10%"], answer: 1, explanation: "4% handling cost." },
      { t: "mcq", q: "Approved refunds are paid within:", options: ["7 days", "10 business days", "14 calendar days", "30 days"], answer: 2, explanation: "14 calendar days." },
      { t: "mcq", q: "Refunds for in-store purchases are:", options: ["Within 7 days", "If faulty", "Not permitted", "With approval"], answer: 2, explanation: "No refunds on in-store purchases." },
      { t: "mcq", q: "Exchange eligibility window?", options: ["3 days", "5 days", "7 calendar days", "14 days"], answer: 2, explanation: "7 calendar days." },
      { t: "mcq", q: "Can an approved refund be expedited?", options: ["Yes, for a fee", "With approval", "No, not for any reason", "If escalated"], answer: 2, explanation: "Cannot be expedited for any reason." },
      { t: "mcq", q: "Who signed the Refund & Return Policy?", options: ["HR Manager", "O Sefolo, Managing Director", "Legal", "Ops Manager"], answer: 1, explanation: "O Sefolo, Managing Director." },
      { t: "mcq", q: "Refunds are subject to:", options: ["Automatic approval", "Successful inspection of returned items", "Manager mood", "Item value"], answer: 1, explanation: "Subject to inspection of returned items." },
      { t: "mcq", q: "Terms of refund eligibility are:", options: ["Flexible", "Discretionary", "Non-negotiable", "Adjustable"], answer: 2, explanation: "Non-negotiable." },
      { t: "short", q: "List the deductions that apply to an online order refund and explain what the customer actually gets back.", need: 2, concepts: [{ label: "4% handling", any: ["4", "four percent", "handling"] }, { label: "courier costs", any: ["courier", "delivery cost", "shipping", "per trip", "standard rate"] }, { label: "remainder refunded", any: ["remain", "balance", "rest", "after deduct", "what's left", "minus"] }], sample: "A 4% handling cost and all associated courier costs (at the standard rate per trip) are deducted, and the customer gets the remaining balance back.", explanation: "Online refund deductions: 4% handling + courier costs; customer gets the remainder." },
      { t: "short", q: "A customer wants to return an item. Describe the condition it must be in to qualify for a refund.", need: 2, concepts: [{ label: "not worn/used", any: ["not worn", "unworn", "not used", "unused", "not damaged"] }, { label: "no odours/contamination", any: ["odour", "odor", "smell", "contaminat", "clean", "fragrance"] }, { label: "original packaging", any: ["original packag", "packaging", "box", "tags", "as received"] }], sample: "It must be in the exact condition received: not worn, not damaged or contaminated, free of foreign odours, and in its original packaging.", explanation: "Item must be unworn, undamaged, odour-free and in original packaging." },
      { t: "short", q: "Explain why in-store purchases are treated differently from online/WhatsApp orders for refunds. What can an in-store customer do instead?", need: 2, concepts: [{ label: "no in-store refund", any: ["no refund", "not permitted", "can't refund", "cannot refund", "in-store"] }, { label: "tried in person", any: ["tried", "try on", "saw", "in person", "inspect", "before buying", "physically"] }, { label: "exchange option", any: ["exchange", "swap", "7 day", "different item", "replace"] }], sample: "In-store customers can see and try the item before buying, so no refunds apply; instead they can exchange within 7 calendar days.", explanation: "In-store buyers inspect before buying, so no refunds — but exchange is available." },
      { t: "short", q: "A customer demands their approved refund be paid immediately. How do you respond and why?", need: 2, concepts: [{ label: "14 days", any: ["14", "fourteen", "two week"] }, { label: "cannot expedite", any: ["cannot expedit", "can't expedit", "not for any reason", "no faster", "cannot rush", "not sped"] }, { label: "policy/process", any: ["policy", "process", "procedure", "standard", "non-negotiable"] }], sample: "I'd explain that approved refunds are paid within 14 calendar days and cannot be expedited for any reason — it's fixed policy.", explanation: "Refunds pay within 14 days and cannot be expedited for any reason." },
      { t: "short", q: "What must happen before ANY refund is approved, and why is this step important?", need: 2, concepts: [{ label: "inspection", any: ["inspect", "check", "examine", "assess", "review the item"] }, { label: "meets condition", any: ["condition", "qualif", "standard", "not worn", "meets policy"] }, { label: "prevent abuse/fair", any: ["abuse", "fair", "protect", "fraud", "misuse", "genuine", "valid"] }], sample: "The returned item must pass a successful inspection to confirm it meets the condition requirements — this protects the store from abuse and keeps refunds fair.", explanation: "Refunds require successful inspection; protects against abuse and ensures fairness." },
      { t: "short", q: "Explain the exchange rules: the time window, item condition, and who pays courier costs.", need: 2, concepts: [{ label: "7 days", any: ["7 day", "seven day", "7 calendar"] }, { label: "same condition", any: ["same condition", "not worn", "original packag", "as received", "unused", "no odour"] }, { label: "customer pays courier", any: ["customer pays", "payable by", "customer courier", "pay in full", "before exchange"] }], sample: "Exchange within 7 calendar days, item in the same condition as received (unworn, original packaging, no odours); where shipping applies the customer pays the courier cost in full before the exchange.", explanation: "Exchange: 7 days, same condition, customer pays courier before exchange." },
      { t: "short", q: "Why does Lufiano recommend customers try items 'in store or at home' before deciding? Explain the benefit to both sides.", need: 2, concepts: [{ label: "avoid damage/contamination", any: ["damage", "contaminat", "odour", "clean", "safe", "avoid", "protect item"] }, { label: "customer sure", any: ["sure", "right choice", "fits", "suits", "satisf", "decide", "confiden"] }, { label: "fewer returns", any: ["return", "exchange", "refund", "fewer", "reduce", "less"] }], sample: "Trying it carefully at home or in store avoids damaging or contaminating the item, helps the customer be sure of their choice, and reduces returns.", explanation: "Careful trying avoids damage/contamination and helps the customer decide, reducing returns." },
      { t: "short", q: "What happens to exchange eligibility after 7 days, and how firm is this rule?", need: 2, concepts: [{ label: "ceases/expires", any: ["cease", "expire", "ends", "no longer", "invalid", "lapse", "over"] }, { label: "non-negotiable", any: ["non-negotiable", "not negotiable", "firm", "strict", "no exception", "final"] }, { label: "7 days", any: ["7", "seven", "after the window", "after that"] }], sample: "After 7 days the exchange eligibility ceases validity, and this is non-negotiable.", explanation: "Exchange eligibility ends after 7 days and is non-negotiable." },
      { t: "short", q: "Which platforms does Lufiano's product guarantee cover? Explain in your own words.", need: 2, concepts: [{ label: "online", any: ["online", "website", "web"] }, { label: "physical store", any: ["physical", "in-store", "store", "shop"] }, { label: "manual/social", any: ["manual", "whatsapp", "social media", "social"] }], sample: "It covers all platforms — the online store, the physical store, and manual orders via social media/WhatsApp.", explanation: "Guarantee covers online, physical store, and manual social media/WhatsApp orders." },
      { t: "short", q: "A customer says the refund terms are unfair and wants them changed. How do you handle this professionally?", need: 2, concepts: [{ label: "non-negotiable", any: ["non-negotiable", "not negotiable", "cannot change", "fixed", "can't change", "policy stands"] }, { label: "explain policy", any: ["explain", "policy", "terms", "clarify", "understand", "reason"] }, { label: "polite/empathy", any: ["polite", "calm", "empath", "understand", "apolog", "respect", "sorry"] }], sample: "I'd stay polite and empathetic, explain the refund terms clearly, and note that they're non-negotiable so I'm unable to change them.", explanation: "Handle empathetically but explain the terms are non-negotiable." },
    ],
  },
  "Inter-store Transfer Policy": {
    color: "#6BA3C8", icon: "₃", category: "Policy",
    description: "Rules for transferring stock between Lufiano store locations",
    questions: [
      { t: "mcq", q: "Transfers between stores take place on:", options: ["Mondays", "Tuesdays", "Wednesdays only", "Fridays"], answer: 2, explanation: "Wednesdays only." },
      { t: "mcq", q: "The transfer is booked as:", options: ["Individual items", "One bulk package by dispatching store", "Via 3rd-party portal", "By head office"], answer: 1, explanation: "One bulk package by the dispatching store." },
      { t: "mcq", q: "Transferred items arrive within:", options: ["3 days", "5 days", "7 working days", "14 days"], answer: 2, explanation: "Within 7 working days." },
      { t: "mcq", q: "Who is responsible for the system transaction correctness?", options: ["Requesting store", "Dispatching store", "Both", "Head office"], answer: 1, explanation: "The dispatching store." },
      { t: "mcq", q: "Confirmed transfer items must be placed in:", options: ["Stock room", "A dedicated bin", "Shop floor", "Front counter"], answer: 1, explanation: "A dedicated bin." },
      { t: "mcq", q: "Each transferred item must have:", options: ["A sticker", "An order number linked to it", "A signature", "A QA certificate"], answer: 1, explanation: "An order number linked, recorded in a book." },
      { t: "mcq", q: "Waybill details are kept in:", options: ["POS only", "A dedicated book in each store", "Online portal", "Manager's email"], answer: 1, explanation: "A dedicated book in each store." },
      { t: "mcq", q: "If a customer needs it outside the window:", options: ["Wait till Wednesday", "Normal courier policy applies", "Weekend transfer", "Head office approves"], answer: 1, explanation: "Normal courier policy applies." },
      { t: "mcq", q: "Before physical transfer, items must be:", options: ["On the daily report", "Paid in full and/or moved correctly in system", "Photographed", "Labelled"], answer: 1, explanation: "Paid in full and/or moved correctly in the system." },
      { t: "mcq", q: "How many rules in the transfer policy?", options: ["6", "7", "8", "9"], answer: 3, explanation: "9 rules." },
      { t: "short", q: "Explain the difference between 'physically ready' and 'systematically ready' for an inter-store transfer, and why both matter.", need: 2, concepts: [{ label: "physical present", any: ["physical", "actually there", "in hand", "on hand", "packed", "present"] }, { label: "system updated", any: ["system", "pos", "moved in", "updated", "processed", "correctly on"] }, { label: "integrity/accuracy", any: ["integrity", "accura", "match", "align", "correct", "discrepan", "consistent"] }], sample: "Physically ready means the item is actually there and packed; systematically ready means it's been correctly moved in the POS. Both matter so the physical stock and the system match, keeping inventory accurate.", explanation: "Physical = item present; systematic = correctly updated in system; both keep inventory accurate." },
      { t: "short", q: "Why does the DISPATCHING store carry full responsibility for the transaction's correctness? Explain the risk if they get it wrong.", need: 2, concepts: [{ label: "they move it", any: ["dispatch", "send", "they process", "initiate", "move the", "book it"] }, { label: "inventory integrity", any: ["integrity", "accura", "inventory", "stock level", "records"] }, { label: "discrepancy risk", any: ["discrepan", "wrong", "mismatch", "error", "missing", "don't add up", "imbalance"] }], sample: "They process and send the stock, so they control whether the system reflects it correctly; if they get it wrong it creates discrepancies and damages inventory integrity across both stores.", explanation: "Dispatching store controls the transaction; errors create discrepancies and hurt inventory integrity." },
      { t: "short", q: "Walk through what each store records in the dedicated transfer book and why that record matters.", need: 2, concepts: [{ label: "order number", any: ["order number", "order no", "order #", "reference"] }, { label: "waybill", any: ["waybill", "tracking", "courier detail", "consignment"] }, { label: "traceability", any: ["trace", "track", "record", "evidence", "follow", "account", "audit", "history"] }], sample: "Each item's order number and waybill details go in the book, so every transfer is traceable and can be accounted for later.", explanation: "Record order number + waybill details for full traceability." },
      { t: "short", q: "A customer needs a transferred item on a Monday but transfers only run Wednesdays. Explain the customer's options.", need: 2, concepts: [{ label: "wait for Wednesday", any: ["wednesday", "transfer window", "wait", "next transfer", "weekly"] }, { label: "normal courier", any: ["courier", "normal courier", "standard delivery", "courier policy", "pay courier"] }, { label: "customer pays/urgent", any: ["pay", "cost", "urgent", "overnight", "ovn", "faster"] }], sample: "They can wait for the Wednesday transfer, or use the normal courier policy (paying the courier cost) if they need it sooner.", explanation: "Outside the Wednesday window, normal courier policy applies (customer pays)." },
      { t: "short", q: "Describe the requesting store's responsibilities before a transfer is dispatched.", need: 2, concepts: [{ label: "communication", any: ["communicat", "confirm", "inform", "liaise", "talk to", "let them know"] }, { label: "items ready confirmation", any: ["ready", "physically", "systematically", "prepared", "in place"] }, { label: "support activities", any: ["support", "assist", "help", "coordinat", "related activit"] }], sample: "The requesting store must communicate clearly, confirm the items are ready both physically and systematically, and support all related activities for dispatch.", explanation: "Requesting store: clear communication, confirm readiness, support the process." },
      { t: "short", q: "Why do you think all transfers are booked as ONE bulk package rather than item by item? Give your reasoning.", need: 1, concepts: [{ label: "efficiency/cost", any: ["efficien", "cost", "cheaper", "save", "one trip", "less courier", "economic"] }, { label: "easier tracking", any: ["track", "manage", "simpl", "organis", "one waybill", "control"] }, { label: "fewer errors", any: ["error", "mistake", "lost", "accountab", "consolidat"] }], sample: "Booking one bulk package is more cost-efficient and easier to track than many separate bookings, with less chance of items going missing.", explanation: "Bulk booking is cheaper, easier to track and reduces errors." },
      { t: "short", q: "Explain the overall purpose of the inter-store transfer policy in your own words.", need: 2, concepts: [{ label: "structured movement", any: ["structure", "organis", "controlled", "orderly", "system", "proper way"] }, { label: "accurate/traceable", any: ["accura", "trace", "track", "record", "account", "correct"] }, { label: "between stores", any: ["between stores", "store to store", "across stores", "one store to"] }], sample: "It ensures stock moves between stores in a structured, accurate and traceable way so inventory stays correct everywhere.", explanation: "Purpose: structured, accurate, traceable movement of stock between stores." },
      { t: "short", q: "What must be true about an item's PAYMENT and SYSTEM status before it can physically leave a store? Explain why.", need: 2, concepts: [{ label: "paid in full", any: ["paid", "payment", "full", "settled"] }, { label: "moved in system", any: ["system", "moved", "pos", "updated", "processed correctly"] }, { label: "prevent loss/discrepancy", any: ["discrepan", "loss", "missing", "account", "control", "integrity", "protect"] }], sample: "It must be paid in full and/or correctly moved in the system first, so stock isn't lost and the records stay accurate when it leaves.", explanation: "Item must be paid and/or system-moved before physical transfer to prevent loss/discrepancy." },
      { t: "short", q: "How does the dedicated bin help the transfer process run smoothly? Explain.", need: 1, concepts: [{ label: "separate/organised", any: ["separate", "set aside", "organis", "dedicated", "apart", "designated"] }, { label: "ready for dispatch", any: ["ready", "dispatch", "confirmed", "waiting", "collect", "grab"] }, { label: "avoid mix/error", any: ["mix", "confus", "error", "sold by mistake", "wrong", "lost"] }], sample: "It keeps confirmed transfer items separate and organised so they're ready for dispatch and don't get mixed up or accidentally sold.", explanation: "A dedicated bin keeps transfer items separate, ready and safe from mix-ups." },
      { t: "short", q: "Two stores are arranging a transfer. Describe the communication that should happen between them and why it's important.", need: 2, concepts: [{ label: "confirm readiness", any: ["confirm", "ready", "check", "verify", "agree"] }, { label: "clear/both sides", any: ["clear", "both", "two-way", "between", "liaise", "communicat"] }, { label: "avoid mistakes", any: ["mistake", "error", "mismatch", "smooth", "avoid", "misunderstand", "delay"] }], sample: "They should communicate clearly to confirm the items are ready physically and in the system before dispatch, avoiding mistakes and delays.", explanation: "Clear two-way communication confirming readiness prevents transfer errors." },
    ],
  },
  "Delivery Threshold Policy": {
    color: "#9BC86E", icon: "₄", category: "Policy",
    description: "Courier fee rules based on purchase value and delivery urgency",
    questions: [
      { t: "mcq", q: "Minimum purchase for free delivery?", options: ["R2500", "R3000", "R3500", "R5000"], answer: 2, explanation: "R3500 and above." },
      { t: "mcq", q: "Standard courier fee below R3500?", options: ["R100", "R150", "R200", "R250"], answer: 2, explanation: "R200." },
      { t: "mcq", q: "OVN stands for:", options: ["Online Verified Number", "Overnight Courier", "Order Verification Notice", "Out of Network"], answer: 1, explanation: "Overnight Courier." },
      { t: "mcq", q: "Who pays the overnight courier cost?", options: ["Lufiano", "The customer", "Split", "The store"], answer: 1, explanation: "The customer is liable." },
      { t: "mcq", q: "OVN payment must be made:", options: ["After dispatch", "Before booking proceeds", "Within 24h", "At collection"], answer: 1, explanation: "Before booking proceeds." },
      { t: "mcq", q: "R4000 purchase delivery cost?", options: ["R200", "R200+surcharge", "Free", "OVN rate"], answer: 2, explanation: "R3500+ is free delivery." },
      { t: "mcq", q: "R2800 purchase standard delivery?", options: ["Free", "R100", "R200", "R300"], answer: 2, explanation: "Below R3500 pays R200." },
      { t: "mcq", q: "OVN below the free threshold means the customer pays:", options: ["The OVN cost", "Nothing", "The R200 standard fee", "Half"], answer: 2, explanation: "Still pays standard R200." },
      { t: "mcq", q: "OVN quote of R350 on a R2800 order — customer pays:", options: ["R200", "R350", "R550", "R150"], answer: 1, explanation: "OVN above standard: pay the exact OVN amount R350." },
      { t: "mcq", q: "Is a R3500 purchase eligible for free delivery?", options: ["No, must exceed", "Yes, R3500 and above", "Loyalty only", "Half rate"], answer: 1, explanation: "R3500 and above qualifies." },
      { t: "short", q: "Explain the two standard delivery scenarios based on purchase value (below and at/above R3500).", need: 2, concepts: [{ label: "3500 free", any: ["3500", "3,500", "free", "threshold", "above", "and above"] }, { label: "below pays 200", any: ["200", "less than", "below", "under", "standard fee"] }, { label: "customer pays courier", any: ["customer pay", "pay the", "courier fee", "charge"] }], sample: "Purchases of R3500 and above get free delivery; anything below R3500 means the customer pays the standard R200 courier fee.", explanation: "R3500+ = free; below R3500 = R200 standard fee." },
      { t: "short", q: "A customer on a R2800 order requests overnight courier. The OVN quote is R150. Explain exactly what they pay and why.", need: 2, concepts: [{ label: "pays R200", any: ["200", "standard"] }, { label: "OVN below threshold", any: ["below", "less than standard", "cheaper", "under 200", "lower"] }, { label: "not the 150", any: ["not 150", "still 200", "minimum", "standard applies", "regardless"] }], sample: "They pay R200, because when the overnight quote is below the standard fee the customer still pays the standard R200 — not the lower OVN amount.", explanation: "OVN below the standard fee → customer still pays R200." },
      { t: "short", q: "A customer on a R2800 order requests overnight courier and the OVN quote is R400. Explain what they pay and the steps you follow.", need: 2, concepts: [{ label: "pays R400 exact", any: ["400", "exact", "that amount", "the quote", "full ovn"] }, { label: "more than standard", any: ["more than", "above standard", "exceed", "higher than 200"] }, { label: "pay before booking", any: ["before booking", "pay first", "upfront", "before proceed", "in advance"] }], sample: "They pay the exact R400 because the OVN cost exceeds the R200 standard, and they must pay it before I proceed with the booking.", explanation: "OVN above standard → pay the exact OVN amount, before booking proceeds." },
      { t: "short", q: "Describe the full process you follow when a customer asks for overnight (OVN) delivery.", need: 2, concepts: [{ label: "get quote", any: ["quote", "charge", "price", "cost", "get a rate", "obtain"] }, { label: "customer liable", any: ["customer", "liable", "they pay", "responsible for cost"] }, { label: "pay before booking", any: ["before booking", "pay first", "upfront", "before proceed", "in advance"] }], sample: "I get an OVN quote/charge, tell the customer they're liable for that cost, and they must pay before I proceed with the booking.", explanation: "OVN: get quote → customer liable → pay before booking proceeds." },
      { t: "short", q: "Why do you think Lufiano sets a free-delivery threshold at R3500 rather than offering free delivery on everything? Give your reasoning.", need: 2, concepts: [{ label: "cover courier cost", any: ["cover cost", "courier cost", "expense", "afford", "absorb", "margin"] }, { label: "encourage bigger spend", any: ["encourage", "bigger", "more", "incentiv", "spend more", "upsell", "increase"] }, { label: "business/profit", any: ["business", "profit", "sustainab", "viable", "protect"] }], sample: "Below R3500 the courier cost eats into thin margins, so charging R200 covers it; the threshold also encourages customers to spend more to unlock free delivery.", explanation: "Threshold covers courier cost on small orders and encourages larger spend." },
      { t: "short", q: "A customer is R150 short of the free-delivery threshold. How might you explain their options to them?", need: 2, concepts: [{ label: "pay R200 now", any: ["200", "standard fee", "pay courier", "as is"] }, { label: "add to reach 3500", any: ["add", "3500", "reach", "top up", "spend more", "another item", "bring it to"] }, { label: "free if they do", any: ["free", "qualif", "unlock", "then free", "no charge"] }], sample: "They can pay the R200 fee now, or add about R150 more to reach R3500 and then qualify for free delivery.", explanation: "Options: pay R200, or add to reach R3500 for free delivery." },
      { t: "short", q: "How many distinct delivery-cost scenarios does this policy cover? Briefly name them.", need: 2, concepts: [{ label: "free 3500+", any: ["free", "3500", "above threshold"] }, { label: "standard 200", any: ["200", "standard", "below 3500"] }, { label: "ovn below", any: ["ovn below", "overnight below", "below still 200", "cheaper ovn"] }, { label: "ovn above", any: ["ovn above", "overnight above", "exact ovn", "more than 200"] }], sample: "Four: free delivery at R3500+, standard R200 below R3500, OVN below the threshold (still R200), and OVN above the standard (pay the exact OVN amount).", explanation: "Four scenarios: free, standard R200, OVN below (R200), OVN above (exact amount)." },
      { t: "short", q: "Explain why the overnight courier is never applied automatically, even for urgent-looking orders.", need: 1, concepts: [{ label: "customer must request", any: ["request", "ask", "opt", "choose", "customer decide", "only when asked"] }, { label: "extra cost", any: ["cost", "pay", "charge", "expense", "liable"] }, { label: "consent", any: ["consent", "agree", "aware", "confirm", "permission"] }], sample: "Because it carries an extra cost the customer must agree to, so it's only applied when the customer specifically requests it.", explanation: "OVN is opt-in only because the customer bears the extra cost." },
      { t: "short", q: "What is the single most important step before booking an overnight courier, and what goes wrong if you skip it?", need: 2, concepts: [{ label: "payment first", any: ["pay", "payment", "paid", "upfront", "before"] }, { label: "customer liable", any: ["customer", "liable", "their cost", "they cover"] }, { label: "store absorbs loss", any: ["store loses", "absorb", "out of pocket", "unpaid", "loss", "stuck with"] }], sample: "The customer must pay the OVN cost before booking; skip it and the store could end up absorbing a courier cost the customer never paid.", explanation: "Collect OVN payment before booking, or the store risks absorbing the cost." },
      { t: "short", q: "In your own words, summarise how purchase value and urgency together decide what a customer pays for delivery.", need: 2, concepts: [{ label: "value sets base", any: ["value", "3500", "amount", "above", "below", "how much"] }, { label: "urgency adds ovn", any: ["urgen", "overnight", "ovn", "fast", "rush"] }, { label: "higher of/pays more", any: ["pay more", "exact", "greater", "higher", "whichever", "depends"] }], sample: "Value sets the base (free at R3500+, else R200); if they want it urgently, OVN applies and they pay R200 when OVN is cheaper or the exact OVN amount when it's more.", explanation: "Value decides base fee; urgency (OVN) can raise it to the exact OVN amount." },
    ],
  },
  "Daily Operations Meeting": {
    color: "#C8A96E", icon: "①", category: "Process",
    description: "Structure, timing and agenda of the daily DMS meetings",
    questions: [
      { t: "mcq", q: "DMS meeting time?", options: ["08:00", "09:00", "09:30", "10:00"], answer: 2, explanation: "09:30am." },
      { t: "mcq", q: "DMS duration?", options: ["5 min", "10 min", "15 min", "30 min"], answer: 2, explanation: "15 minutes." },
      { t: "mcq", q: "First agenda item?", options: ["Safety", "Performance", "Actions", "Marketing"], answer: 2, explanation: "Actions is first." },
      { t: "mcq", q: "Safety inspections are done:", options: ["Weekly", "Monthly", "Daily", "Quarterly"], answer: 2, explanation: "Daily." },
      { t: "mcq", q: "Fire extinguisher reminder set how early?", options: ["7 days", "10 days", "15 days", "30 days"], answer: 2, explanation: "15 days prior to expiry." },
      { t: "mcq", q: "Dashboard sent to the team by:", options: ["08:00", "09:00", "09:20", "09:30"], answer: 2, explanation: "By 09:20." },
      { t: "mcq", q: "Store trackers submitted:", options: ["Before meeting", "At opening", "At close of day (previous day)", "Mondays"], answer: 2, explanation: "At close of day." },
      { t: "mcq", q: "NOT a daily safety inspection item:", options: ["Fire extinguisher", "Leaking taps", "Broken glass", "Staff uniforms"], answer: 3, explanation: "Staff uniforms is not a safety item." },
      { t: "mcq", q: "Customer complaints are raised under:", options: ["Actions", "Safety", "Quality Related Issues", "Marketing"], answer: 2, explanation: "Quality Related Issues." },
      { t: "mcq", q: "Performance covers MTD sales and:", options: ["Staff attendance", "Previous day sales vs target", "New products", "Markdowns"], answer: 1, explanation: "Previous day sales against targets." },
      { t: "short", q: "List the main agenda sections of the Daily Operations Meeting and briefly say what each covers.", need: 3, concepts: [{ label: "actions", any: ["action", "open action", "pending", "tracker", "task"] }, { label: "safety", any: ["safety", "inspect", "hazard", "fire", "risk"] }, { label: "quality issues", any: ["quality", "complaint", "issue", "customer problem"] }, { label: "performance", any: ["performance", "sales", "target", "mtd", "numbers"] }, { label: "marketing", any: ["marketing", "campaign", "promo", "creativ", "trend"] }], sample: "Actions (open/pending tasks), Safety (daily inspections), Quality Related Issues (complaints), Performance (MTD and previous-day sales vs target), and Marketing (campaigns and ideas).", explanation: "DMS sections: Actions, Safety, Quality Related Issues, Performance, Marketing." },
      { t: "short", q: "Explain the purpose of the Daily Operations Meeting and why it happens every single day.", need: 2, concepts: [{ label: "alignment", any: ["align", "on the same page", "everyone knows", "aware", "informed", "updated"] }, { label: "priorities", any: ["priorit", "focus", "day's", "what matters", "key task"] }, { label: "track actions", any: ["action", "track", "follow up", "accountab", "progress"] }], sample: "It aligns everyone on duty with the day's priorities and tracks actions, and doing it daily keeps the team constantly up to date and accountable.", explanation: "DMS aligns the team on daily priorities and tracks actions — daily keeps everyone current." },
      { t: "short", q: "Why must store performance trackers be sent at close of day, and what does this enable the next morning?", need: 2, concepts: [{ label: "dashboard ready", any: ["dashboard", "update", "prepar", "compil", "ready", "built"] }, { label: "by 09:20 visibility", any: ["09:20", "9:20", "before meeting", "visibility", "beforehand", "in advance"] }, { label: "informed meeting", any: ["informed", "review", "discuss", "see numbers", "performance", "prepared"] }], sample: "Sending them at close of day lets the dashboard be updated and ready, so it can go out by 09:20 and everyone has visibility of the numbers before the meeting.", explanation: "Close-of-day trackers let the dashboard be ready and shared by 09:20 for an informed meeting." },
      { t: "short", q: "Describe how the daily safety inspection works and give two examples of things you'd check.", need: 2, concepts: [{ label: "daily check", any: ["daily", "every day", "inspect", "walk", "check"] }, { label: "example hazards", any: ["fire extinguisher", "leaking tap", "broken glass", "cracked", "broken handle", "sharp corner"] }, { label: "raise/address", any: ["raise", "address", "report", "safety section", "out of place", "fix"] }], sample: "You inspect daily and raise anything out of place in the safety section — e.g. checking the fire extinguisher and looking for broken/cracked glass or leaking taps.", explanation: "Daily inspection of hazards (fire extinguisher, glass, taps, handles, sharp corners), raised in the safety section." },
      { t: "short", q: "Why is a fire-extinguisher reminder set 15 days before expiry, and where should that reminder live?", need: 2, concepts: [{ label: "time to replace", any: ["time", "replace", "arrange", "order", "refill", "before it expires", "in advance"] }, { label: "avoid lapse", any: ["lapse", "expire", "not covered", "gap", "without", "compliance", "legal"] }, { label: "on POS device", any: ["pos", "work device", "store device", "till device"] }], sample: "The 15-day lead time gives the store time to replace it before it expires so there's no safety lapse, and the reminder is set on the work device that has the POS.", explanation: "15 days gives time to replace before expiry; reminder lives on the POS device." },
      { t: "short", q: "What is discussed under 'Quality Related Issues' and why is it valuable to review daily?", need: 2, concepts: [{ label: "complaints/issues", any: ["complaint", "issue", "problem", "quality", "fault", "challenge"] }, { label: "customer experience", any: ["customer", "experience", "satisf", "service"] }, { label: "fix/improve", any: ["fix", "improve", "address", "resolve", "prevent", "learn", "act"] }], sample: "Each store raises quality issues and customer complaints; reviewing daily lets the team address and prevent recurring problems quickly.", explanation: "Quality Related Issues surfaces complaints/quality problems so they're addressed fast." },
      { t: "short", q: "Explain what 'MTD' performance tracking is and how it differs from 'previous day' tracking in the meeting.", need: 2, concepts: [{ label: "mtd = month to date", any: ["month to date", "mtd", "so far this month", "cumulative", "monthly"] }, { label: "previous day", any: ["previous day", "yesterday", "daily", "last day"] }, { label: "vs target", any: ["target", "plan", "against", "versus", "compare"] }], sample: "MTD is month-to-date sales measured against the monthly target, while previous-day tracking is yesterday's sales against the daily target — one shows the bigger trend, the other the latest result.", explanation: "MTD = month-to-date vs target; previous-day = yesterday vs daily target." },
      { t: "short", q: "What is the purpose of the Marketing section, and what kind of contributions are welcome?", need: 2, concepts: [{ label: "creative platform", any: ["creativ", "platform", "share", "ideas", "brainstorm"] }, { label: "campaigns/trends", any: ["campaign", "trend", "promo", "running", "marketing activit"] }, { label: "brand-aligned", any: ["brand", "aligned", "fit", "on-brand", "suits"] }], sample: "It's a platform to get creative — sharing trends, outlining running campaigns, and welcoming any ideas that align with the brand.", explanation: "Marketing section: share trends/campaigns and brand-aligned ideas." },
      { t: "short", q: "What happens to new actions raised during the meeting, and why does this step matter?", need: 2, concepts: [{ label: "logged in tracker", any: ["tracker", "log", "record", "captured", "added", "written down"] }, { label: "accountability", any: ["account", "follow up", "responsib", "assigned", "owner", "done"] }, { label: "not forgotten", any: ["not forgot", "remember", "track", "chase", "progress", "visible"] }], sample: "They're logged into the action tracker so they're not forgotten and someone is accountable for following them through.", explanation: "New actions are logged in the tracker for accountability and follow-through." },
      { t: "short", q: "On days 2 and 3, teammates represent their own store. Why is it important each rep is 'fully aware and updated' about their store?", need: 2, concepts: [{ label: "accurate reporting", any: ["accura", "correct", "reliable", "true", "up to date", "informed"] }, { label: "answer/represent", any: ["represent", "answer", "speak for", "report", "account", "stand in"] }, { label: "good decisions", any: ["decision", "action", "respond", "address", "resolve", "help"] }], sample: "Because they speak for their store, so they must have accurate, up-to-date knowledge to report correctly and help the team make good decisions.", explanation: "Reps must be fully updated to represent their store accurately and support good decisions." },
    ],
  },
  "Online & In-store Purchase": {
    color: "#7B9E87", icon: "②", category: "Process",
    description: "Procedures for organic online, manual (WhatsApp) and in-store purchases",
    questions: [
      { t: "mcq", q: "Why check online orders constantly?", options: ["Customers complain", "POS has no notifications", "Online is more valuable", "Site goes offline"], answer: 1, explanation: "The POS has no notifications." },
      { t: "mcq", q: "Manual order number is valid for:", options: ["30 min", "1 hour", "2 hours", "24 hours"], answer: 2, explanation: "Two hours." },
      { t: "mcq", q: "Online store prioritises which store for consumption?", options: ["Most stock", "Nearest", "The mother store", "Lowest sales"], answer: 2, explanation: "The mother store." },
      { t: "mcq", q: "EFT payment reference should be:", options: ["ID number", "Full name", "The order number", "Phone number"], answer: 2, explanation: "The order number." },
      { t: "mcq", q: "Cash presented in store must be:", options: ["Put in till", "Counted and checked with money detector immediately", "Given to manager", "Receipted first"], answer: 1, explanation: "Counted and inspected immediately." },
      { t: "mcq", q: "Manual online purchase is completed via:", options: ["Website", "WhatsApp/social media", "In-store POS", "Phone only"], answer: 1, explanation: "Manual = via WhatsApp/social media." },
      { t: "mcq", q: "Reference details when ringing up should come from:", options: ["Memory", "Customer's description", "The item's tag", "A printed list"], answer: 2, explanation: "All reference on the item's tag." },
      { t: "mcq", q: "Process is only complete when:", options: ["Payment clears", "Item dispatched", "Customer receives items", "Receipt sent"], answer: 2, explanation: "Once the customer receives their items." },
      { t: "mcq", q: "If item of interest is unavailable:", options: ["Say check later", "Present alternative colours/products", "Discount similar item", "Escalate"], answer: 1, explanation: "Present alternatives." },
      { t: "mcq", q: "POS payment type must be selected on POS and:", options: ["Card machine", "Ikhokha", "Bank app", "EFT only"], answer: 1, explanation: "On the POS and on Ikhokha." },
      { t: "short", q: "A customer places an organic online order. Describe the first actions you take and why verification matters.", need: 2, concepts: [{ label: "contact customer", any: ["contact", "call", "message", "reach out", "get in touch"] }, { label: "verify item/size/order", any: ["verify", "confirm", "check", "item", "size", "correct order"] }, { label: "avoid errors", any: ["error", "wrong", "mistake", "mismatch", "right item", "accura"] }], sample: "I contact the customer to verify the item ordered, sizes and the order details, so we don't dispatch the wrong thing.", explanation: "Contact the customer to verify item, sizes and order to avoid errors." },
      { t: "short", q: "Walk through the full manual (WhatsApp) purchase process from details to completion.", need: 3, concepts: [{ label: "collect details", any: ["name", "surname", "email", "address", "cellphone", "details", "contact"] }, { label: "order number + banking", any: ["order number", "banking", "bank detail", "forward", "send"] }, { label: "POP to Ops", any: ["proof of payment", "pop", "ops group", "confirm"] }, { label: "complete on receipt", any: ["receive", "received", "complete", "deliver", "got their"] }], sample: "Collect the customer's name, surname, email, address and cellphone and create an unpaid order; send the order number with banking details; they pay using the order number as reference and send proof of payment; forward the POP to the Ops group for confirmation; the process completes once the customer receives their items.", explanation: "Manual purchase: details → order number + banking → POP to Ops → complete on receipt." },
      { t: "short", q: "Why is the manual order number only valid for two hours? Explain the reasoning.", need: 2, concepts: [{ label: "stock reserved", any: ["reserve", "hold", "stock", "availab", "tie up", "allocat"] }, { label: "prevent overselling/expiry", any: ["oversell", "expire", "release", "free up", "someone else", "not held forever", "timeout"] }, { label: "prompt payment", any: ["pay quickly", "prompt", "commit", "serious", "act fast"] }], sample: "The item is effectively held against that order, so the two-hour limit stops stock being tied up indefinitely and encourages prompt payment before it's released again.", explanation: "The 2-hour validity prevents stock being held too long and prompts quick payment." },
      { t: "short", q: "Explain the inspection you perform on shoes before completing a sale. Name at least three checks.", need: 3, concepts: [{ label: "stitching", any: ["stitch", "seam", "sewing"] }, { label: "glue", any: ["glue", "stuck", "sole", "adhesive"] }, { label: "sizes align", any: ["size", "align", "pair", "match", "same size"] }, { label: "material/colour", any: ["material", "colour", "color", "consistent", "finish"] }, { label: "zips/buttons", any: ["zip", "button", "fasten", "clasp"] }], sample: "Check for stitching defects, that the glue is fully stuck, that the pair's sizes align, that material/colour is consistent, and that zips/buttons are reliable.", explanation: "Shoe inspection: stitching, glue, size alignment, material/colour, zips/buttons." },
      { t: "short", q: "If the size on the box/tag doesn't match the actual item, what must you do and why?", need: 2, concepts: [{ label: "escalate", any: ["escalate", "report", "raise", "flag", "inform"] }, { label: "system adjustment", any: ["system", "adjust", "correct", "update", "fix the record", "pos"] }, { label: "accuracy", any: ["accura", "correct", "match", "integrity", "right", "avoid error"] }], sample: "Escalate it so there's a system adjustment, keeping the system accurate and matching the physical item.", explanation: "Mismatched size → escalate for a system adjustment to keep records accurate." },
      { t: "short", q: "Explain the difference between an 'online purchase' and a 'manual online purchase' at Lufiano.", need: 2, concepts: [{ label: "online organic website", any: ["organic", "website", "web", "site", "comes through"] }, { label: "manual via social/whatsapp", any: ["manual", "whatsapp", "social media", "initiated", "completed via"] }, { label: "channel difference", any: ["channel", "different", "versus", "whereas", "while"] }], sample: "An online purchase is an organic sale through the website, while a manual online purchase is initiated and completed via social media/WhatsApp.", explanation: "Online = organic website sale; manual = via WhatsApp/social media." },
      { t: "short", q: "Who is responsible for tracking an order until the customer receives it, and what does that responsibility involve?", need: 2, concepts: [{ label: "teammate who handled", any: ["teammate", "handled", "who took", "person who", "the one who", "staff member"] }, { label: "track to destination", any: ["track", "follow", "until", "reaches", "destination", "received", "monitor"] }, { label: "ensure delivery", any: ["ensure", "make sure", "receive", "arrive", "complete", "gets"] }], sample: "The teammate who handled the order — they must keep tracking it until it reaches its destination and the customer receives it.", explanation: "The handling teammate tracks the order through to delivery." },
      { t: "short", q: "Why must cash be counted and checked with a money detector immediately when presented? Explain the risk of not doing so.", need: 2, concepts: [{ label: "counterfeit", any: ["counterfeit", "fake", "forged", "fraud", "genuine", "real note"] }, { label: "count accuracy", any: ["count", "correct amount", "short", "accura", "right amount"] }, { label: "before it's mixed/disputed", any: ["immediately", "before", "mixed", "dispute", "later", "in front", "at once"] }], sample: "To catch counterfeit notes and confirm the amount is correct there and then; if you wait, a fake or shortfall can't be traced once cash is mixed in the till.", explanation: "Immediate counting/detector check catches fakes and shortfalls before cash is mixed." },
      { t: "short", q: "A customer's item of interest is out of stock. Describe the best way to handle this and keep the sale alive.", need: 2, concepts: [{ label: "offer alternatives", any: ["alternativ", "other colour", "other product", "similar", "different option", "substitute"] }, { label: "present positively", any: ["present", "show", "suggest", "recommend", "offer"] }, { label: "keep engaged", any: ["engage", "keep", "retain", "relationship", "interest", "satisf"] }], sample: "Present alternative colours and products so the customer still has good options and stays engaged, rather than just turning them away.", explanation: "Offer alternative colours/products to keep the customer engaged." },
      { t: "short", q: "Why does the online store prioritise the 'mother store' for consumption, and where is this confirmed?", need: 2, concepts: [{ label: "mother store first", any: ["mother store", "main store", "primary", "default", "priorit"] }, { label: "stock/consistency", any: ["stock", "consisten", "central", "manage", "control", "source"] }, { label: "confirmed in Ops group", any: ["ops group", "ops", "confirmed", "communicat", "group"] }], sample: "The mother store is prioritised as the default source for online consumption, and where consumption actually happened is confirmed in the Ops group.", explanation: "Online prioritises the mother store; consumption location is confirmed in the Ops group." },
    ],
  },
  "Return & Exchange Process": {
    color: "#E07B7B", icon: "③", category: "Process",
    description: "Step-by-step process for handling exchanges and refunds in store",
    questions: [
      { t: "mcq", q: "First step in processing an exchange?", options: ["Inspect item", "Check policy eligibility", "Process on system", "Ask why"], answer: 1, explanation: "Check policy eligibility first." },
      { t: "mcq", q: "Inspection checks for:", options: ["Same product only", "Foreign odours and use/damage", "Receipt only", "Purchase history"], answer: 1, explanation: "Odours and signs of use/damage." },
      { t: "mcq", q: "Negative balance (new item costs more) means:", options: ["Store credit", "Customer pays difference", "Lufiano absorbs", "Declined"], answer: 1, explanation: "Customer pays the difference." },
      { t: "mcq", q: "Positive balance (new item costs less):", options: ["Forfeit difference", "Offer gift card/store credit", "Auto refund", "Ignore"], answer: 1, explanation: "Offer gift card or store credit." },
      { t: "mcq", q: "Refunds apply to which channels?", options: ["In-store only", "In-store and online", "Manual and online only", "All"], answer: 2, explanation: "Manual and online only." },
      { t: "mcq", q: "Use correct codes/colours to:", options: ["Save time", "Avoid system discrepancies", "Meet targets", "Apply pricing"], answer: 1, explanation: "Avoid discrepancies on the system." },
      { t: "mcq", q: "Final step of an exchange:", options: ["New receipt", "Log in register", "Package items and hand over", "Confirmation message"], answer: 2, explanation: "Package and hand over." },
      { t: "mcq", q: "Exchange flowchart's two lanes are:", options: ["Store Lead & Head Office", "Customer & Sales Assistant", "Coordinator & Lead", "Online & In-store"], answer: 1, explanation: "Customer and Sales Assistant." },
      { t: "mcq", q: "Manual exchange top-up payment uses:", options: ["Cash", "PJN", "EFT with proof", "Card"], answer: 2, explanation: "EFT, customer sends proof." },
      { t: "mcq", q: "Number of steps in the exchange process:", options: ["4", "5", "6", "7"], answer: 2, explanation: "6 steps." },
      { t: "short", q: "List the exchange process in order, from a customer requesting an exchange to handing over the item.", need: 3, concepts: [{ label: "check policy", any: ["check policy", "eligib", "qualif", "against the policy"] }, { label: "inspect item", any: ["inspect", "condition", "odour", "used", "damage"] }, { label: "process on system", any: ["process", "system", "pos", "correct code", "colour"] }, { label: "handle balance", any: ["balance", "difference", "pay", "credit", "gift card"] }, { label: "package/hand over", any: ["package", "pack", "hand over", "give", "complete"] }], sample: "Check policy eligibility, inspect the item's condition, process the exchange on the system using correct codes/colours, handle any balance difference (customer pays or gets credit), then package and hand over.", explanation: "Exchange: check policy → inspect → process on system → handle balance → package/hand over." },
      { t: "short", q: "Explain how you decide whether a customer qualifies for an exchange in the first place.", need: 2, concepts: [{ label: "check policy", any: ["policy", "against the", "eligib", "rules", "criteria"] }, { label: "within 7 days", any: ["7 day", "seven day", "within", "window", "time"] }, { label: "condition ok", any: ["condition", "not worn", "not used", "no odour", "good condition", "original"] }], sample: "I check them against the return and exchange policy — within 7 calendar days and the item in good, unused condition — to confirm they qualify.", explanation: "Qualification = within policy window (7 days) and item in acceptable condition." },
      { t: "short", q: "A customer's replacement item costs MORE than the original. Explain what happens and how payment is taken for a manual order.", need: 2, concepts: [{ label: "pay difference", any: ["pay", "difference", "top up", "balance", "extra", "owe"] }, { label: "negative balance", any: ["negative balance", "costs more", "more expensive", "higher"] }, { label: "EFT + proof", any: ["eft", "proof of payment", "pop", "send proof", "transfer"] }], sample: "There's a negative balance so the customer pays the difference; for a manual order they pay by EFT and send proof of payment.", explanation: "Costs more = negative balance; customer pays difference (EFT + proof for manual)." },
      { t: "short", q: "A customer's replacement item costs LESS than the original. Explain the options you can offer.", need: 2, concepts: [{ label: "positive balance", any: ["positive balance", "costs less", "cheaper", "lower"] }, { label: "gift card", any: ["gift card", "voucher"] }, { label: "store credit", any: ["store credit", "credit", "account"] }], sample: "There's a positive balance, so I can offer the customer a gift card or store credit for the difference.", explanation: "Costs less = positive balance; offer gift card or store credit." },
      { t: "short", q: "Why is it critical to use the correct codes and colours when processing an exchange? Explain what goes wrong otherwise.", need: 2, concepts: [{ label: "avoid discrepancy", any: ["discrepan", "mismatch", "wrong stock", "error", "imbalance", "don't add up"] }, { label: "system accuracy", any: ["system", "accura", "inventory", "records", "correct", "stock level"] }, { label: "traceability", any: ["trace", "track", "account", "audit", "find"] }], sample: "Using the exact codes and colours keeps the system accurate; the wrong ones create stock discrepancies that are hard to trace later.", explanation: "Correct codes/colours prevent system discrepancies and keep inventory accurate." },
      { t: "short", q: "Explain why refunds are NOT available for in-store purchases but exchanges are. What's the reasoning?", need: 2, concepts: [{ label: "tried before buying", any: ["tried", "try on", "saw", "inspect", "in person", "before buying", "physically"] }, { label: "no in-store refund", any: ["no refund", "not refund", "exchange only", "can't refund"] }, { label: "exchange available", any: ["exchange", "swap", "replace", "different item"] }], sample: "In-store customers inspect and try before buying, so refunds don't apply; but they can still exchange if the item isn't right.", explanation: "In-store buyers inspect before purchase, so exchange (not refund) is offered." },
      { t: "short", q: "During inspection, what specific things make you REFUSE an exchange? Give examples.", need: 2, concepts: [{ label: "worn/used", any: ["worn", "used", "signs of use", "damaged", "dirty"] }, { label: "odours", any: ["odour", "odor", "smell", "fragrance", "contaminat"] }, { label: "fails condition", any: ["condition", "not original", "no packaging", "fails", "doesn't meet", "poor"] }], sample: "If the item shows signs of use or wear, has foreign odours, or is damaged/contaminated, it fails inspection and I refuse the exchange.", explanation: "Refuse if item is worn/used, carries odours, or otherwise fails the condition check." },
      { t: "short", q: "Describe the two 'lanes' in the exchange flowchart and what each is responsible for.", need: 2, concepts: [{ label: "customer lane", any: ["customer", "client", "brings", "requests", "returns"] }, { label: "sales assistant lane", any: ["sales assistant", "assistant", "staff", "checks", "processes", "inspects"] }, { label: "handover", any: ["hand over", "package", "process", "complete", "exchange"] }], sample: "The Customer requests the exchange and brings the item; the Sales Assistant checks policy, inspects, processes on the system and hands over the exchanged item.", explanation: "Two lanes: Customer (requests/returns) and Sales Assistant (checks, inspects, processes, hands over)." },
      { t: "short", q: "At what point in the exchange is the 'decision point', and what are the two outcomes?", need: 2, concepts: [{ label: "after inspection", any: ["after inspect", "inspection", "condition check", "checking the item"] }, { label: "good = continue", any: ["good condition", "yes", "qualif", "continue", "proceed", "pass"] }, { label: "bad = end/decline", any: ["not good", "no", "decline", "refuse", "end", "fail", "stop"] }], sample: "The decision point is after inspecting the item: if it's in good condition (Yes) the exchange continues; if not (No) it's declined and the process ends.", explanation: "Decision point after inspection: good condition continues, otherwise decline/end." },
      { t: "short", q: "Why does the process only truly finish once the item is packaged and handed over? Explain.", need: 1, concepts: [{ label: "customer has item", any: ["customer", "receives", "has the", "hand over", "gets", "in their hand"] }, { label: "complete/closed", any: ["complete", "finish", "closed", "done", "concluded"] }, { label: "professional finish", any: ["professional", "proper", "presentable", "packaged", "neat", "care"] }], sample: "The exchange isn't complete until the customer actually has the new item properly packaged in hand — that's the point the transaction is truly closed.", explanation: "Packaging and handover is what completes/closes the exchange." },
    ],
  },
  "Cash Up & Admin Compliance": {
    color: "#A07DC0", icon: "④", category: "Process",
    description: "Cash up procedures, note box usage and administrative books",
    questions: [
      { t: "mcq", q: "The cash up sheet is filled in:", options: ["End of day only", "At open and close", "Throughout the day as purchases/payments happen", "Per shift"], answer: 2, explanation: "Throughout the day." },
      { t: "mcq", q: "Incorrect cash ups are:", options: ["Fixed next day", "A warning", "Taken as an offence", "Auto-flagged"], answer: 2, explanation: "Taken as an offence." },
      { t: "mcq", q: "Cash up amount must match:", options: ["Projected sales", "Ikhokha/financial statement", "Previous day", "Inventory system"], answer: 1, explanation: "Ikhokha and/or financial statement." },
      { t: "mcq", q: "Unconfirmed payments go:", options: ["Not noted", "In the note box as a note", "Highlighted red", "Emailed to HO"], answer: 1, explanation: "Written as a note in the note box." },
      { t: "mcq", q: "Payment at Store A, consumed at Store B — reflects on:", options: ["Store A", "Store B", "Both", "Head office"], answer: 1, explanation: "Store B (where consumed)." },
      { t: "mcq", q: "Online cash up entries must show:", options: ["Bank name", "PayFlex or PayFast", "Order number only", "Nothing special"], answer: 1, explanation: "PayFlex or PayFast." },
      { t: "mcq", q: "Unfulfilled orders need attached:", options: ["Stock sheet", "The pre-order disclaimer", "A photo", "Customer ID"], answer: 1, explanation: "The pre-order disclaimer." },
      { t: "mcq", q: "The Client Book is for customers who:", options: ["Are loyal", "Want an item not in stock and won't pay a deposit", "Complained", "Do lay-buy"], answer: 1, explanation: "Interested but no size/stock and unwilling to deposit." },
      { t: "mcq", q: "Escalations rule:", options: ["Any direction", "Only escalate up", "To manager first", "In writing only"], answer: 1, explanation: "We only escalate up." },
      { t: "mcq", q: "Partial Order Book tracks:", options: ["Sales targets", "Expiry and reminders for partial orders", "Completed lay-buys", "Unpaid accounts"], answer: 1, explanation: "When partial orders expire and reminders." },
      { t: "short", q: "Explain when and how often the cash up sheet should be filled in, and why doing it incorrectly is treated seriously.", need: 2, concepts: [{ label: "throughout day", any: ["throughout", "as and when", "each purchase", "during the day", "every transaction", "ongoing"] }, { label: "accuracy/match", any: ["accura", "match", "correspond", "ikhokha", "statement", "correct"] }, { label: "offence/serious", any: ["offence", "serious", "discipl", "consequence", "accountab", "trust", "money"] }], sample: "It's filled in throughout the day as each purchase or confirmed payment happens, and it must match Ikhokha/the financial statement — errors are treated as an offence because it involves money and trust.", explanation: "Fill throughout the day; must match records; errors are an offence because money is involved." },
      { t: "short", q: "What is the note box used for on the cash up? List at least three things that belong there.", need: 3, concepts: [{ label: "unconfirmed payments", any: ["unconfirmed", "pending payment", "not confirmed", "awaiting"] }, { label: "open/pending orders", any: ["open order", "pending order", "outstanding"] }, { label: "dispatches", any: ["dispatch", "delivery", "sent", "booking"] }, { label: "unfulfilled orders", any: ["unfulfilled", "pre-order", "not fulfilled", "disclaimer"] }, { label: "escalations", any: ["escalat", "raise", "flag"] }], sample: "For order-related matters: unconfirmed payments, open/pending orders, dispatch confirmations, unfulfilled orders (with the pre-order disclaimer), and escalations.", explanation: "Note box: unconfirmed payments, open orders, dispatches, unfulfilled orders, escalations." },
      { t: "short", q: "A payment is made at your store but the item is consumed at another store. Explain whose cash up reflects it and why.", need: 2, concepts: [{ label: "consuming store", any: ["consumed", "where used", "other store", "store b", "consuming", "where item"] }, { label: "reflects there", any: ["reflect", "record", "shown on", "appear", "goes on"] }, { label: "accuracy per store", any: ["accura", "correct", "true sales", "per store", "attribut", "match"] }], sample: "The cash up should reflect items consumed at that specific store, so the store where the item was consumed records it — keeping each store's sales accurate.", explanation: "The consuming store's cash up reflects it, keeping per-store sales accurate." },
      { t: "short", q: "Explain the purpose of the Client Book and what details it records.", need: 2, concepts: [{ label: "interested no stock/size", any: ["interested", "not in stock", "no size", "hasn't arrived", "want", "waiting for"] }, { label: "no deposit", any: ["no deposit", "won't deposit", "not willing", "without deposit", "unwilling"] }, { label: "details recorded", any: ["name", "surname", "item", "code", "colour", "size", "contact"] }], sample: "It's for customers interested in an item that's out of stock or sizeless who won't leave a deposit; it records their name/surname, the item (code and colour), sizes and contact details so we can call them when it arrives.", explanation: "Client Book: interested customers without deposit; records name, item, size, contact." },
      { t: "short", q: "What is a 'Partial Order' and what is the purpose of the Partial Order Book?", need: 2, concepts: [{ label: "deposit toward item", any: ["deposit", "part payment", "pays some", "toward", "partial payment"] }, { label: "pay difference later", any: ["difference", "balance", "remainder", "later", "outstanding", "pay the rest"] }, { label: "track expiry/remind", any: ["expir", "remind", "due", "track", "almost due", "follow up"] }], sample: "A partial order is when a customer pays a deposit toward an item and pays the balance later per policy; the Partial Order Book tracks when each expires so customers can be reminded before their order is due.", explanation: "Partial order = deposit now, balance later; the book tracks expiry and reminders." },
      { t: "short", q: "Why does Lufiano keep separate admin books (Stock Take, Sales, Client, Partial Order)? Explain the benefit.", need: 2, concepts: [{ label: "organised records", any: ["organis", "separate", "categor", "structured", "order", "tidy"] }, { label: "easy to find/track", any: ["find", "track", "reference", "look up", "retrieve", "clear"] }, { label: "efficiency/accountability", any: ["efficien", "productiv", "account", "control", "accura", "manage"] }], sample: "Separate books keep records organised by purpose, making information easy to find and track, which supports efficiency and accountability.", explanation: "Separate books organise records for easy tracking, efficiency and accountability." },
      { t: "short", q: "Once an item a customer wanted (in the Client Book) arrives, what is the store's responsibility?", need: 1, concepts: [{ label: "contact client", any: ["contact", "call", "message", "notify", "reach", "let them know", "inform"] }, { label: "because recorded", any: ["recorded", "noted", "book", "interested", "waiting", "details"] }, { label: "follow through", any: ["follow", "responsib", "duty", "ensure", "service"] }], sample: "It's the store's responsibility to contact the client to let them know the item they wanted has arrived.", explanation: "When the item arrives, the store must contact the client." },
      { t: "short", q: "What does 'we only escalate up' mean, and why is that the rule?", need: 2, concepts: [{ label: "upward to senior", any: ["up", "senior", "manager", "higher", "above", "supervisor", "leadership"] }, { label: "not sideways/down", any: ["not down", "not sideways", "not peers", "not below", "only up"] }, { label: "proper handling/authority", any: ["authority", "decision", "handled", "resolve", "proper", "accountab", "right person"] }], sample: "It means issues are raised upward to someone with more authority, not sideways or down, so they reach the right person to resolve them.", explanation: "Escalate upward to the right authority — not sideways or down." },
      { t: "short", q: "Explain what must be recorded in the Stock Take Book and give two examples of movements it captures.", need: 2, concepts: [{ label: "inventory movement", any: ["movement", "inventory", "stock", "received", "transfer", "discrepan", "fault"] }, { label: "code/size/colour/qty", any: ["code", "size", "colour", "quantity", "line item", "detail"] }, { label: "examples", any: ["received", "transfer", "discrepan", "factory fault", "between stores"] }], sample: "All inventory movement recorded by code, size, colour and quantity — e.g. stock received from the factory and transfers between stores (also discrepancies and factory faults).", explanation: "Stock Take Book: inventory movements (received, transfers, discrepancies, faults) by code/size/colour/qty." },
      { t: "short", q: "Why is accurate administration described as central to daily operations? Give your reasoning.", need: 2, concepts: [{ label: "bookkeeping/records", any: ["bookkeep", "record", "admin", "document", "track", "log"] }, { label: "productivity/efficiency", any: ["productiv", "efficien", "smooth", "organis", "run well"] }, { label: "decisions/accountability", any: ["decision", "account", "control", "reliable", "trust", "accura"] }], sample: "Good admin is the bookkeeping of daily operations; accurate records keep the store productive and efficient and let managers make reliable decisions.", explanation: "Accurate admin underpins productivity, efficiency and reliable decision-making." },
    ],
  },
  "Stock Take Process": {
    color: "#6BA3C8", icon: "⑤", category: "Process",
    description: "Four-day stock counting, investigation, escalation and reporting process",
    questions: [
      { t: "mcq", q: "Total stock take duration?", options: ["2 days", "3 days", "4 days", "5 days"], answer: 2, explanation: "4 days." },
      { t: "mcq", q: "Day 1 is:", options: ["Investigations", "Report", "Counting", "Escalations"], answer: 2, explanation: "Counting." },
      { t: "mcq", q: "Day 2 is:", options: ["Counting", "Investigations", "Escalations", "Report"], answer: 1, explanation: "Investigations." },
      { t: "mcq", q: "Day 3 is:", options: ["Counting", "Investigations", "Escalations", "Report"], answer: 2, explanation: "Escalations." },
      { t: "mcq", q: "Day 4 is:", options: ["Counting", "Investigations", "Escalations", "Report submission"], answer: 3, explanation: "Report submission." },
      { t: "mcq", q: "Minimum people to execute a stock take?", options: ["1", "2", "3", "Full team"], answer: 1, explanation: "At least two people." },
      { t: "mcq", q: "Sheets must include:", options: ["Store name/signature", "Time, date, page numbers", "Totals", "Store name only"], answer: 1, explanation: "Time, date and page numbers." },
      { t: "mcq", q: "Lime/green highlight means:", options: ["Restock", "Available and sellable", "Pricing issue", "On hold"], answer: 1, explanation: "Available and in sellable condition." },
      { t: "mcq", q: "Red highlight means:", options: ["Damaged", "Quantity or details incorrect", "Out of stock", "To transfer"], answer: 1, explanation: "Quantity or descriptive details incorrect." },
      { t: "mcq", q: "Investigation starting points are:", options: ["Red items", "Green items", "Items left open (not highlighted)", "New stock"], answer: 2, explanation: "Items left open." },
      { t: "short", q: "Describe the four days of the stock take process and what happens on each.", need: 3, concepts: [{ label: "day1 counting", any: ["day 1 count", "counting", "count day", "first day count"] }, { label: "day2 investigations", any: ["day 2 invest", "investigation", "investigat"] }, { label: "day3 escalations", any: ["day 3 escalat", "escalation", "escalat"] }, { label: "day4 report", any: ["day 4 report", "report", "submit"] }], sample: "Day 1 counting, Day 2 investigations, Day 3 escalations, Day 4 report submission.", explanation: "Day 1 count, Day 2 investigate, Day 3 escalate, Day 4 report." },
      { t: "short", q: "Explain the highlighting system used during counting (green, red, and items left open) and what each signals.", need: 3, concepts: [{ label: "green available", any: ["green", "lime", "available", "sellable", "in store", "present", "correct"] }, { label: "red incorrect", any: ["red", "incorrect", "wrong", "quantity off", "details wrong", "mismatch"] }, { label: "open = investigate", any: ["open", "not highlight", "left", "blank", "investigate", "starting point"] }], sample: "Green/lime means the item is present and sellable; red means the quantity or details are incorrect; items left open (not highlighted) become the starting points for investigation.", explanation: "Green = present/sellable; red = incorrect qty/details; open = investigate." },
      { t: "short", q: "Why must at least two people do a stock take together? Explain the benefit of the caller/recorder method.", need: 2, concepts: [{ label: "two people", any: ["two", "2 people", "pair", "both", "together"] }, { label: "one calls one records", any: ["call out", "calls", "record", "highlight", "recipient", "one reads"] }, { label: "accuracy/check", any: ["accura", "check", "verify", "reduce error", "cross", "double", "honest"] }], sample: "Two people work as a pair — one calls out code, size, colour and quantity while the other highlights/records — which improves accuracy and provides a built-in check.", explanation: "Two-person caller/recorder method improves accuracy and provides a check." },
      { t: "short", q: "Why is putting the time and date on each stock take sheet important? Explain what it helps with.", need: 2, concepts: [{ label: "track sales during", any: ["sales during", "sold during", "transactions", "account for", "movement"] }, { label: "account for missing", any: ["missing", "discrepan", "account", "explain", "reconcile", "gap"] }, { label: "reference/order", any: ["reference", "order", "sequence", "when counted", "timeline"] }], sample: "The time and date help track any sales made during the count and account for inventory that might otherwise appear missing, giving a clear reference point.", explanation: "Time/date help track sales during the count and account for missing stock." },
      { t: "short", q: "Explain the investigation phase: where you start and at least three reference points you use to resolve discrepancies.", need: 3, concepts: [{ label: "start open items", any: ["open", "not highlight", "left", "starting point", "begin with"] }, { label: "previous stock take", any: ["previous stock take", "last count", "prior"] }, { label: "received/transfer", any: ["received", "stock received", "transfer", "moved"] }, { label: "other stores/online", any: ["other store", "physical stock", "online order", "sister store"] }], sample: "Start with the open (un-highlighted) items, then cross-check against the previous stock take, stock received, stock transfers, physical stock in other stores and online orders.", explanation: "Start with open items; reference previous count, received, transfers, other stores, online orders." },
      { t: "short", q: "The manual says that 'in theory there should be no discrepancies.' Explain why, and what a discrepancy therefore tells you.", need: 2, concepts: [{ label: "procedures followed", any: ["procedure", "followed", "process", "correctly", "properly", "if everything"] }, { label: "no discrepancy expected", any: ["no discrepan", "should match", "balance", "align", "zero"] }, { label: "signals a gap/error", any: ["error", "gap", "missed", "something wrong", "slipped", "not followed", "problem"] }], sample: "If every procedure is followed the system and physical stock should match, so a discrepancy signals that something wasn't done correctly and needs investigating.", explanation: "Correct procedures mean no discrepancies; a discrepancy flags a process gap." },
      { t: "short", q: "How should items that don't appear on the stock take sheet be handled? Explain the rule.", need: 2, concepts: [{ label: "write separately", any: ["separate page", "behind", "write down", "list", "note", "extra page"] }, { label: "staple together", any: ["staple", "attach", "together", "keep with", "clip"] }, { label: "account for all", any: ["every item", "account", "all items", "nothing missed", "complete"] }], sample: "Write them on a separate page or behind the sheet and staple it together, so every single item is accounted for.", explanation: "Unlisted items: write on a separate page, staple together, account for everything." },
      { t: "short", q: "Explain how an online order can cause a stock discrepancy across stores.", need: 2, concepts: [{ label: "different size/exchange", any: ["different size", "exchange", "swap", "opted", "changed"] }, { label: "processed other store", any: ["other store", "different store", "another store", "in the system", "where processed"] }, { label: "mismatch", any: ["mismatch", "discrepan", "doesn't match", "appears missing", "wrong store"] }], sample: "A customer might opt for a different size, so the exchange gets processed against another store in the system, creating a mismatch where the sale should sit under that store.", explanation: "Online exchanges processed at a different store can cause cross-store discrepancies." },
      { t: "short", q: "How does the stock take process end, and why is that the right stopping point?", need: 2, concepts: [{ label: "every discrepancy dealt", any: ["every discrepan", "all discrepan", "each line", "dealt with", "resolved", "cleared"] }, { label: "nothing outstanding", any: ["nothing left", "outstanding", "unresolved", "complete", "accounted"] }, { label: "accurate system", any: ["accura", "correct", "match", "clean", "integrity", "reliable"] }], sample: "It ends when every line item with a discrepancy has been dealt with, so nothing is left unresolved and the system is accurate.", explanation: "Ends when every discrepancy is resolved, leaving an accurate system." },
      { t: "short", q: "Why is the stock take described as a 'counter-measure' rather than routine admin? Explain.", need: 2, concepts: [{ label: "catches errors", any: ["catch", "find", "detect", "identif", "surface", "picks up"] }, { label: "safeguard/check", any: ["safeguard", "check", "control", "verify", "backstop", "protect"] }, { label: "if procedures fail", any: ["procedure", "slipped", "not followed", "error", "gap", "went wrong", "mistake"] }], sample: "It's a safeguard that catches anything that slipped through when procedures weren't followed perfectly — a check against errors rather than just paperwork.", explanation: "It's a counter-measure that catches errors slipping past normal procedures." },
    ],
  },
  "Stock Received Process": {
    color: "#9BC86E", icon: "⑥", category: "Process",
    description: "Process for receiving, checking and distributing new stock at stores",
    questions: [
      { t: "mcq", q: "Donor's first step on factory delivery?", options: ["Sort by colour", "Fill sheets", "Account for number of boxes", "Notify Ops"], answer: 2, explanation: "Account for the number of boxes." },
      { t: "mcq", q: "After accounting for boxes, the donor:", options: ["Notifies stores", "Fills sheets", "Sorts by code and colour", "Distributes"], answer: 2, explanation: "Sorts by code and colour." },
      { t: "mcq", q: "Who fills the stock receipt sheets?", options: ["Requesting stores", "The donor", "Coordinator", "Head office"], answer: 1, explanation: "The donor." },
      { t: "mcq", q: "Date written on the sheet is:", options: ["Today", "Date received from factory", "Dispatch date", "Delivery date"], answer: 1, explanation: "Date received from factory." },
      { t: "mcq", q: "On receipt, Ops group is told:", options: ["Stock count", "Acknowledgement + number of boxes", "QA sign-off", "Transfer request"], answer: 1, explanation: "Acknowledge receipt + number of boxes." },
      { t: "mcq", q: "Every shoe box is checked so that:", options: ["Price is right", "Shoe inside matches size on box", "Matches online listing", "Certificate included"], answer: 1, explanation: "Shoe inside aligns with the size on the box." },
      { t: "mcq", q: "After inspection, items are organised by:", options: ["PO number", "Codes and sizes", "Delivery date", "Store"], answer: 1, explanation: "Codes and sizes." },
      { t: "mcq", q: "Final column checks:", options: ["Manager signs", "System qty vs physical count — tick if aligned", "Retail price", "Date"], answer: 1, explanation: "System vs physical alignment, tick." },
      { t: "mcq", q: "When everything aligns, recipient:", options: ["Returns sheets", "Signs and sends to Ops to confirm", "Calls HO", "Files sheets"], answer: 1, explanation: "Signs and sends to Ops group." },
      { t: "mcq", q: "Two main roles in the process:", options: ["Manager and staff", "Donor and receiving stores", "HO and stores", "Coordinator and lead"], answer: 1, explanation: "Donor and stores." },
      { t: "short", q: "Describe the donor store's responsibilities from the moment factory stock arrives to sending it out.", need: 3, concepts: [{ label: "account boxes", any: ["account", "count box", "number of box", "boxes received"] }, { label: "sort code/colour", any: ["sort", "code", "colour", "organis", "arrange"] }, { label: "fill sheets", any: ["fill", "sheet", "receipt sheet", "record", "line item"] }, { label: "distribute + Ops", any: ["distribut", "pack", "send", "ops group", "visibility"] }], sample: "Account for the number of boxes, sort items by code and colour, fill in the stock receipt sheets, then distribute to the respective stores and send the items and sheets to the Ops group.", explanation: "Donor: account boxes → sort → fill sheets → distribute → send to Ops." },
      { t: "short", q: "When a receiving store gets its allocation, walk through the checks it performs before signing off.", need: 3, concepts: [{ label: "physical count", any: ["physical", "count", "actually have", "on hand", "check quantity"] }, { label: "vs system", any: ["system", "aligns", "match", "compare", "reflect", "pos"] }, { label: "tick/write actual", any: ["tick", "write", "note", "record actual", "if not"] }, { label: "sign + Ops", any: ["sign", "bottom", "send", "ops group", "confirm"] }], sample: "Check whether the allocated sizes/quantities are physically present, compare against the system, tick where they align (or write the actual physical quantity if not), then sign at the bottom and send to the Ops group.", explanation: "Receiving store: physical count vs system, tick/write actual, sign and send to Ops." },
      { t: "short", q: "Why must stock receiving be done 'with utmost accuracy'? Explain what inaccurate receiving causes downstream.", need: 2, concepts: [{ label: "system accuracy", any: ["accura", "correct", "match", "system", "records", "true"] }, { label: "discrepancies later", any: ["discrepan", "stock take", "mismatch", "missing", "problem later", "error"] }, { label: "knock-on/trust", any: ["knock", "downstream", "sales", "wrong stock", "oversell", "trust", "chain"] }], sample: "Accurate receiving keeps the system matching physical stock; if it's wrong, discrepancies show up later at stock take and can cause overselling or missing stock.", explanation: "Accurate receiving prevents downstream discrepancies and stock errors." },
      { t: "short", q: "What check is done on each shoe box, and what do you do if the shoe inside doesn't match the size on the box?", need: 2, concepts: [{ label: "shoe matches box size", any: ["shoe", "inside", "match", "align", "size on box", "correspond"] }, { label: "set aside if mismatch", any: ["set aside", "separate", "put aside", "apart", "remove"] }, { label: "check for pair", any: ["pair", "similar issue", "other shoe", "matching problem", "counterpart"] }], sample: "Check that the shoe inside aligns with the size written on the box; if it doesn't, set it aside to see if there's a pair with the same mismatch.", explanation: "Verify shoe matches box size; if not, set aside and look for a matching-issue pair." },
      { t: "short", q: "Explain the two roles in the stock received process and how they work together.", need: 2, concepts: [{ label: "donor distributes", any: ["donor", "distribut", "sort", "allocate", "sends", "fills sheet"] }, { label: "stores receive/check", any: ["store", "receive", "check", "count", "confirm", "verify"] }, { label: "confirmation loop", any: ["confirm", "ops group", "acknowledge", "sign", "feedback", "back to donor"] }], sample: "The donor sorts, records and distributes stock; the receiving stores check it against the system and confirm back via the Ops group, with the donor acknowledging once satisfied.", explanation: "Donor distributes; stores receive/check/confirm; donor acknowledges — a confirmation loop." },
      { t: "short", q: "Why does the receiving store sign at the bottom and send to the Ops group when everything aligns?", need: 2, concepts: [{ label: "confirm alignment", any: ["confirm", "aligns", "match", "agree", "verify", "stock matches"] }, { label: "accountability/record", any: ["account", "record", "evidence", "proof", "responsib", "sign off"] }, { label: "visibility", any: ["ops group", "visibility", "team", "everyone sees", "transparen"] }], sample: "Signing and sending to Ops confirms the physical stock matches the system, creating a record and giving the team visibility that receiving is complete.", explanation: "Signing/sending to Ops confirms alignment, creates a record, and gives visibility." },
      { t: "short", q: "What communication must go to the Ops group when stock is received, and why include the number of boxes?", need: 2, concepts: [{ label: "acknowledge receipt", any: ["acknowledge", "confirm", "receipt", "received", "let know", "inform"] }, { label: "number of boxes", any: ["number of box", "box count", "how many box", "boxes"] }, { label: "visibility/cross-check", any: ["visibility", "cross-check", "verify", "match", "reconcile", "track", "transparen"] }], sample: "Acknowledge receipt of the inventory including how many boxes arrived, so the team has visibility and the box count can be cross-checked against what was sent.", explanation: "Acknowledge receipt + box count for visibility and cross-checking." },
      { t: "short", q: "After inspection, how should items be organised, and why does organisation help the next steps?", need: 2, concepts: [{ label: "by codes and sizes", any: ["code", "size", "organis", "group", "sort", "arrange"] }, { label: "easier distribution", any: ["distribut", "allocate", "pack", "split", "easier", "faster"] }, { label: "accuracy/find", any: ["accura", "find", "count", "track", "less error", "clear"] }], sample: "Organise items into codes and sizes, which makes distributing and counting them faster and more accurate.", explanation: "Organise by codes and sizes to make distribution and counting accurate." },
      { t: "short", q: "If you previously held a specific code, what extra check is required when more of it arrives? Explain why.", need: 2, concepts: [{ label: "system vs physical", any: ["system", "physical", "on hand", "reflect", "match", "align"] }, { label: "existing plus new", any: ["existing", "already had", "previous", "add", "total", "combined"] }, { label: "catch discrepancy", any: ["discrepan", "error", "mismatch", "correct", "accura", "catch"] }], sample: "Ensure the number reflecting on the system aligns with the physical count you now hold (existing plus new), so any discrepancy is caught immediately.", explanation: "Check system reflects the combined physical count to catch discrepancies." },
      { t: "short", q: "Why is the donor's acknowledgement at the end of the process important? What does it confirm?", need: 2, concepts: [{ label: "satisfied with info", any: ["satisf", "happy", "agree", "reviewed", "checked", "accept"] }, { label: "closes loop", any: ["close", "complete", "final", "confirm", "concluded", "loop"] }, { label: "both sides agree", any: ["both", "agree", "match", "aligned", "consistent", "two sides"] }], sample: "The donor acknowledges once satisfied with the receiving store's confirmation, closing the loop and confirming both sides agree the stock and records match.", explanation: "Donor acknowledgement closes the loop, confirming both sides agree." },
    ],
  },
  "Payment Confirmations": {
    color: "#C88E6E", icon: "⑦", category: "Process",
    description: "Process for verifying, tracking and confirming EFT payments",
    questions: [
      { t: "mcq", q: "First step of payment confirmation?", options: ["Collect payment", "Customer sends POP after EFT", "Generate order number", "Contact customer"], answer: 1, explanation: "Customer sends proof of payment." },
      { t: "mcq", q: "After receiving a POP you first:", options: ["Dispatch", "Acknowledge, tell customer, forward to Ops", "Mark paid", "Call customer"], answer: 1, explanation: "Acknowledge and forward to Ops group." },
      { t: "mcq", q: "Confirmed payments on the template are:", options: ["Asterisked", "Highlighted", "Moved to a column", "Deleted"], answer: 1, explanation: "Highlighted to show confirmed." },
      { t: "mcq", q: "Payment is confirmed by:", options: ["The POP itself", "A screenshot of incoming payments", "System update", "Dispatch"], answer: 1, explanation: "Screenshot of payments received." },
      { t: "mcq", q: "On the POP, note the:", options: ["Bank name", "Beneficiary reference", "Amount only", "Account number"], answer: 1, explanation: "Beneficiary reference (appears on Lufiano's end)." },
      { t: "mcq", q: "Pay special attention if the bank is:", options: ["FNB", "Other than FNB", "Capitec", "Any bank"], answer: 1, explanation: "Note if it's a bank other than FNB." },
      { t: "mcq", q: "Follow-ups continue until:", options: ["End of day", "Payment is confirmed", "3 days", "First follow-up"], answer: 1, explanation: "Until confirmed." },
      { t: "mcq", q: "Pending payments at end of day are:", options: ["Cancelled", "Left unmarked", "Moved to a list", "Escalated to HO"], answer: 1, explanation: "Left unmarked to show unconfirmed." },
      { t: "mcq", q: "Template is sent:", options: ["When all confirmed", "Daily with the cash ups", "Weekly", "Only if pending"], answer: 1, explanation: "Daily with the cash ups." },
      { t: "mcq", q: "Order updated in the system:", options: ["When POP received", "Once payment clears", "When ready", "End of day"], answer: 1, explanation: "Once payment clears." },
      { t: "short", q: "Walk through the full payment confirmation process from the customer's proof of payment to informing them it's confirmed.", need: 3, concepts: [{ label: "receive POP", any: ["proof of payment", "pop", "receives", "sends proof", "eft"] }, { label: "acknowledge + forward Ops", any: ["acknowledge", "forward", "ops group", "send for confirm"] }, { label: "template tracking", any: ["template", "write", "record", "track", "log"] }, { label: "confirm via screenshot", any: ["screenshot", "payments received", "reflects", "check for", "incoming"] }, { label: "inform customer", any: ["inform", "tell", "confirm to", "let customer", "receipt"] }], sample: "Receive the POP, acknowledge it and forward to the Ops group, record it on the payment confirmation template, confirm it against the screenshot of incoming payments, highlight it as confirmed, then inform the customer and send the receipt after collecting on the system.", explanation: "POP → acknowledge/forward to Ops → track on template → confirm via screenshot → inform customer." },
      { t: "short", q: "Explain how a payment is actually 'confirmed' and what you do if your payment doesn't reflect.", need: 2, concepts: [{ label: "screenshot of incoming", any: ["screenshot", "incoming", "payments received", "comes in", "reflects", "list of payments"] }, { label: "check for yours", any: ["check", "find", "look for", "match", "your payment", "locate"] }, { label: "escalate if missing", any: ["escalate", "raise", "report", "flag", "if not", "doesn't reflect", "follow up"] }], sample: "You confirm by checking your payment against the screenshot of payments that have come in; if it doesn't reflect, you escalate it.", explanation: "Confirm against the incoming-payments screenshot; escalate if it's not there." },
      { t: "short", q: "Why is the 'beneficiary reference' on a proof of payment so important? Explain what it's used for.", need: 2, concepts: [{ label: "appears on Lufiano end", any: ["lufiano", "our end", "our side", "appears", "shows up", "reflects"] }, { label: "identify the payment", any: ["identif", "match", "link", "which payment", "recognise", "trace"] }, { label: "order number", any: ["order number", "reference", "order no"] }], sample: "It's the reference that appears on Lufiano's end, so it's used to identify and match the incoming payment to the correct order.", explanation: "The beneficiary reference appears on Lufiano's side and identifies the payment." },
      { t: "short", q: "Why must you note when a payment is from a bank other than FNB? Explain the practical reason.", need: 2, concepts: [{ label: "clearing delay", any: ["delay", "slower", "take longer", "clear", "not immediate", "time to reflect"] }, { label: "flag for Ops", any: ["flag", "note", "ops", "attention", "highlight", "tell them"] }, { label: "track/expect", any: ["track", "expect", "follow up", "watch", "wait", "confirm later"] }], sample: "Payments from banks other than FNB can take longer to reflect, so you flag it for the Ops group and know to track it rather than expecting instant confirmation.", explanation: "Non-FNB payments may clear slower, so flag them and track accordingly." },
      { t: "short", q: "Explain what happens to pending vs confirmed payments on the template, and when the template is submitted.", need: 2, concepts: [{ label: "confirmed highlighted", any: ["highlight", "confirmed", "mark", "colour", "shown"] }, { label: "pending unmarked", any: ["unmarked", "not highlight", "left", "blank", "pending", "not confirmed"] }, { label: "sent daily with cash ups", any: ["daily", "cash up", "end of day", "with the cash", "each day"] }], sample: "Confirmed payments are highlighted and pending ones are left unmarked; the template is sent daily along with the cash ups.", explanation: "Confirmed = highlighted, pending = unmarked; template sent daily with cash ups." },
      { t: "short", q: "After a payment clears, describe the remaining steps to get the customer their goods.", need: 2, concepts: [{ label: "update system", any: ["update", "system", "order", "pos", "mark paid", "receipt"] }, { label: "inspect/package", any: ["inspect", "package", "pack", "qa", "check item", "prepare"] }, { label: "dispatch/collection", any: ["dispatch", "collection", "deliver", "book", "send", "pick up"] }], sample: "Update the order in the system and send the updated receipt, then inspect and package the items for dispatch or in-store collection.", explanation: "After clearing: update system/receipt, inspect/package, dispatch or collect." },
      { t: "short", q: "Why is it important to make frequent follow-ups on pending payments rather than waiting? Explain the risk.", need: 2, concepts: [{ label: "avoid missing", any: ["miss", "missed", "overlook", "forget", "slip", "lost"] }, { label: "confirm promptly", any: ["confirm", "prompt", "quick", "timely", "catch", "up to date"] }, { label: "customer/dispatch delay", any: ["customer", "delay", "held up", "dispatch", "waiting", "stuck", "service"] }], sample: "Frequent follow-ups stop a confirmation being missed, so payments are caught promptly and the customer's order isn't delayed.", explanation: "Frequent follow-ups prevent missed confirmations and customer delays." },
      { t: "short", q: "When you forward a POP to the Ops group, what note should accompany it and why?", need: 2, concepts: [{ label: "order number", any: ["order number", "order no", "reference", "which order"] }, { label: "immediate or not", any: ["immediate", "not immediate", "timing", "when paid", "instant"] }, { label: "bank flag", any: ["bank", "other than fnb", "fnb", "which bank"] }], sample: "Include the order number and whether it was an immediate payment or not, and flag if it's from a bank other than FNB, so Ops can identify and expect it correctly.", explanation: "Note the order number, immediacy, and non-FNB bank when forwarding a POP." },
      { t: "short", q: "What must you check about a proof of payment before acting on it, and why?", need: 2, concepts: [{ label: "legitimate/genuine", any: ["legitim", "genuine", "real", "valid", "authentic", "not fake"] }, { label: "all info present", any: ["all information", "complete", "details", "required", "reference", "amount"] }, { label: "prevent fraud/error", any: ["fraud", "fake", "error", "mistake", "protect", "wrong", "dispute"] }], sample: "Check that it's legitimate and that all required information is present, to protect against fake or incomplete proofs of payment.", explanation: "Verify the POP is legitimate and complete to prevent fraud/errors." },
      { t: "short", q: "What is the overall purpose of the payment confirmation template? Explain in your own words.", need: 2, concepts: [{ label: "track payments", any: ["track", "record", "log", "monitor", "keep tabs", "list"] }, { label: "follow-ups", any: ["follow up", "chase", "pending", "outstanding"] }, { label: "nothing missed", any: ["not miss", "missed", "every payment", "complete", "accountab", "all confirmed"] }], sample: "It's used to record and track payment details and follow-ups so no payment confirmation is ever missed.", explanation: "The template tracks payments and follow-ups so none are missed." },
    ],
  },
  "Dispatch Quality Assurance": {
    color: "#7B9E87", icon: "⑧", category: "Process",
    description: "Quality inspection standards before dispatching any item to a customer",
    questions: [
      { t: "mcq", q: "Purpose of the Dispatch QA form?", options: ["Record costs", "Check product standard before dispatch", "Confirm payment", "Record customer details"], answer: 1, explanation: "Check standard before dispatching." },
      { t: "mcq", q: "An item is ready for QA when:", options: ["Customer asks", "Order fulfilled and fully paid", "Packaged", "Courier booked"], answer: 1, explanation: "Fulfilled and fully paid." },
      { t: "mcq", q: "NOT on the QA checklist:", options: ["Stitching", "Glue stuck", "Price matches receipt", "Sizes align"], answer: 2, explanation: "Price verification isn't a QA check." },
      { t: "mcq", q: "If defects are found:", options: ["Dispatch anyway", "Note on the form", "Return to factory", "Replace silently"], answer: 1, explanation: "Note it on the form." },
      { t: "mcq", q: "When all boxes are ticked and no issues:", options: ["Wait for sign-off", "Item ready — send for booking", "Re-inspect", "Notify customer"], answer: 1, explanation: "Ready — send for booking." },
      { t: "mcq", q: "Who signs to approve dispatch?", options: ["Dispatcher only", "Store lead or stand-in lead", "Any teammate", "Coordinator"], answer: 1, explanation: "Store lead or stand-in." },
      { t: "mcq", q: "Sizes should align because:", options: ["Aesthetics", "A pair can have two different sizes", "Customer asked", "Listing check"], answer: 1, explanation: "A pair can have two different sizes." },
      { t: "mcq", q: "Material and colour should be:", options: ["Any variation", "Consistent with previous stock", "Only colour checked", "Only material checked"], answer: 1, explanation: "Consistent with previous stock." },
      { t: "mcq", q: "Steps in the Dispatch QA procedure:", options: ["4", "5", "6", "7"], answer: 2, explanation: "6 steps." },
      { t: "mcq", q: "The form is used when dispatching to:", options: ["Customers only", "Stores only", "Customers OR stores", "International only"], answer: 2, explanation: "Customers or stores." },
      { t: "short", q: "Explain what the Dispatch QA form is for and at what point an order becomes eligible for it.", need: 2, concepts: [{ label: "check standard", any: ["standard", "quality", "inspect", "check", "condition"] }, { label: "before dispatch", any: ["before dispatch", "prior to", "before sending", "before booking"] }, { label: "fulfilled and paid", any: ["fulfil", "paid", "fully paid", "complete order", "settled"] }], sample: "It's used to check a product's standard before dispatch to a customer or store, and an order becomes eligible as soon as it's fulfilled and fully paid.", explanation: "Dispatch QA checks quality before dispatch; triggered once fulfilled and fully paid." },
      { t: "short", q: "List at least four checks on the Dispatch QA inspection and confirm one thing that is NOT checked.", need: 3, concepts: [{ label: "stitching", any: ["stitch", "seam"] }, { label: "glue", any: ["glue", "stuck", "sole"] }, { label: "sizes align", any: ["size", "align", "pair", "match"] }, { label: "material/colour", any: ["material", "colour", "color", "consistent"] }, { label: "zips/buttons", any: ["zip", "button", "fasten"] }, { label: "not price", any: ["not price", "price is not", "price isn't", "no price check"] }], sample: "Check stitching, glue fully stuck, sizes aligning, box/tag matching the item, material/colour consistency, and reliable zips/buttons — price against the receipt is NOT a QA check.", explanation: "QA checks stitching, glue, sizes, box/tag, material/colour, zips/buttons — not price." },
      { t: "short", q: "Describe the sign-off requirements to approve an item as ready for dispatch. Who is involved?", need: 2, concepts: [{ label: "dispatcher signs clause", any: ["dispatch", "person responsible", "fills", "signs the clause", "dispatcher"] }, { label: "store lead signs", any: ["store lead", "stand-in", "lead", "approve", "signs"] }, { label: "both/authority", any: ["both", "approv", "authority", "confirm", "two signatures"] }], sample: "The person dispatching fills in and signs the clause, and the store lead (or stand-in lead) signs to approve the item as ready for dispatch.", explanation: "Dispatcher signs the clause; store lead/stand-in approves with a signature." },
      { t: "short", q: "If you find a defect during Dispatch QA, explain exactly what you do and why documentation matters.", need: 2, concepts: [{ label: "note on form", any: ["note", "record", "write", "document", "form", "log"] }, { label: "reference", any: ["reference", "evidence", "proof", "trace", "later", "record of"] }, { label: "not dispatch faulty", any: ["not dispatch", "hold", "don't send", "fix", "address", "stop"] }], sample: "Note the defect on the form for reference and don't send a faulty item; the documentation gives a traceable record of the issue.", explanation: "Note defects on the form for a traceable record; don't dispatch faulty items." },
      { t: "short", q: "Why does dispatch use the same inspection standard as receiving stock and selling? Explain the logic.", need: 2, concepts: [{ label: "consistent standard", any: ["same standard", "consistent", "one standard", "uniform", "aligned"] }, { label: "quality at every stage", any: ["every stage", "throughout", "each point", "quality", "catch"] }, { label: "customer gets good item", any: ["customer", "good item", "no defect", "standard met", "satisf", "protect"] }], sample: "Using one consistent standard at receiving, selling and dispatch means quality is checked at every stage, so the customer always gets an item that meets the standard.", explanation: "A single standard across stages ensures consistent quality reaches the customer." },
      { t: "short", q: "Why must sizes be checked even within a single pair of shoes at dispatch? Explain.", need: 2, concepts: [{ label: "pair mismatched", any: ["pair", "two different", "mismatch", "odd", "don't match", "different size"] }, { label: "possible/happens", any: ["possible", "can happen", "sometimes", "occur", "risk"] }, { label: "customer issue", any: ["customer", "wrong", "unwearable", "return", "complaint", "problem"] }], sample: "Because a pair can actually contain two different sizes; checking catches this before it reaches the customer as an unwearable mismatch.", explanation: "A pair may have two different sizes; checking prevents a mismatch reaching the customer." },
      { t: "short", q: "What must be true before an item is sent for courier booking? Explain the gate.", need: 2, concepts: [{ label: "all boxes ticked", any: ["all box", "ticked", "checklist", "complete", "every check"] }, { label: "no issues", any: ["no issue", "no defect", "no fault", "clear", "pass", "clean"] }, { label: "signed", any: ["sign", "signed", "approv", "clause", "authoris"] }], sample: "All checklist boxes must be ticked with no issues, and the form signed off, before the item goes for booking.", explanation: "Gate to booking: all boxes ticked, no issues, form signed." },
      { t: "short", q: "Explain why the store lead (not just the dispatcher) must sign off dispatch. What's the value of the second signature?", need: 2, concepts: [{ label: "accountability/authority", any: ["account", "authority", "responsib", "approv", "senior", "oversight"] }, { label: "second check", any: ["second check", "double", "verify", "review", "extra", "oversight"] }, { label: "quality assurance", any: ["quality", "standard", "assur", "catch", "protect", "confidence"] }], sample: "The store lead's signature adds a second layer of accountability and an extra check, giving assurance that quality standards were genuinely met before dispatch.", explanation: "The lead's sign-off adds accountability and a second quality check." },
      { t: "short", q: "A fully paid, fulfilled order has a small stitching fault. Walk through what should happen.", need: 2, concepts: [{ label: "note defect", any: ["note", "record", "form", "document", "flag"] }, { label: "don't dispatch/hold", any: ["not dispatch", "hold", "stop", "don't send", "address", "fix", "set aside"] }, { label: "resolve/replace", any: ["replace", "fix", "resolve", "sort", "correct", "escalate", "swap"] }], sample: "Note the stitching fault on the QA form, don't dispatch it, and have it addressed or replaced before the order can pass and go for booking.", explanation: "Note the fault, hold the item, resolve/replace before it can pass QA." },
      { t: "short", q: "In your own words, why is Dispatch QA the last line of defence for customer satisfaction?", need: 2, concepts: [{ label: "last check before customer", any: ["last", "final", "before customer", "leaves", "goes out", "before it reaches"] }, { label: "catch defects", any: ["catch", "defect", "fault", "issue", "problem", "mistake"] }, { label: "protect reputation/satisfaction", any: ["satisf", "reputation", "trust", "experience", "brand", "impression", "protect"] }], sample: "It's the final check before the item leaves for the customer, so it's the last chance to catch defects and protect the customer's experience and Lufiano's reputation.", explanation: "Dispatch QA is the final chance to catch faults before the customer, protecting satisfaction." },
    ],
  },
  "PayJustNow (PJN)": {
    color: "#C8A96E", icon: "⑨", category: "Process",
    description: "How PayJustNow works for online, in-store and exchange transactions",
    questions: [
      { t: "mcq", q: "PayJustNow is:", options: ["In-house credit", "A credit facility with 3 interest-free instalments", "A debit order", "BNPL with interest"], answer: 1, explanation: "3 equal interest-free instalments." },
      { t: "mcq", q: "Number of instalments?", options: ["2", "3", "4", "6"], answer: 1, explanation: "3 equal instalments." },
      { t: "mcq", q: "PJN is available for:", options: ["Online only", "Manual only", "Online, manual AND in-store", "Over R5000 only"], answer: 2, explanation: "All three channels." },
      { t: "mcq", q: "Customer receives goods:", options: ["After 2nd instalment", "When fully paid", "Immediately on successful purchase", "After 7 days"], answer: 2, explanation: "Immediately, then keeps paying." },
      { t: "mcq", q: "In-store PJN: customer scans:", options: ["Any QR", "Store's unique QR code", "Personal QR", "No QR"], answer: 1, explanation: "Store's unique QR code." },
      { t: "mcq", q: "Facility amount is:", options: ["Max purchase", "Amount PJN splits into 3", "Credit limit", "First instalment"], answer: 1, explanation: "Amount split into 3 instalments." },
      { t: "mcq", q: "Store releases goods only when:", options: ["QR scanned", "1st instalment paid", "Confirmation email received", "48h passed"], answer: 2, explanation: "On confirmation email to release." },
      { t: "mcq", q: "No confirmation email means:", options: ["Release anyway", "Do not release until go-ahead", "Call PJN", "Show app receipt"], answer: 1, explanation: "Do not release the goods." },
      { t: "mcq", q: "Online PJN exchanges are:", options: ["Same as in-store", "Handled differently", "Not permitted", "Via PJN directly"], answer: 1, explanation: "Handled differently." },
      { t: "mcq", q: "In-store PJN exchanges are:", options: ["Handled differently", "As per normal exchange (store credit at purchase)", "Not permitted", "Special portal"], answer: 1, explanation: "Normal exchange process." },
      { t: "short", q: "Explain what PayJustNow is and how the payment structure works for a customer.", need: 2, concepts: [{ label: "credit facility", any: ["credit", "facility", "buy now", "instal", "finance", "borrow"] }, { label: "3 instalments", any: ["3", "three", "instal", "split"] }, { label: "interest-free", any: ["interest-free", "no interest", "free of interest", "0 interest"] }], sample: "It's a credit facility that lets customers buy now and pay in 3 equal, interest-free instalments.", explanation: "PJN = credit facility, 3 equal interest-free instalments." },
      { t: "short", q: "Walk through an in-store PJN purchase from the customer scanning to you releasing the goods.", need: 3, concepts: [{ label: "scan QR", any: ["scan", "qr", "code", "login", "log in"] }, { label: "insert amount", any: ["insert", "enter", "total", "purchase value", "amount"] }, { label: "monthly shown", any: ["monthly", "instalment", "amount payable", "shows", "highlight"] }, { label: "release on email", any: ["confirmation email", "email", "release", "go-ahead", "received"] }], sample: "The customer logs into PJN and scans the store's unique QR code, inserts the total purchase value, PJN shows the monthly amount, and you release the goods only once the store receives the confirmation email.", explanation: "In-store PJN: scan QR → insert amount → PJN shows monthly → release on confirmation email." },
      { t: "short", q: "Why must a store NOT release goods until it receives the PJN confirmation email? Explain the risk.", need: 2, concepts: [{ label: "not confirmed yet", any: ["not confirm", "unconfirmed", "not verified", "no proof", "pending", "not gone through"] }, { label: "payment/purchase may fail", any: ["fail", "not complete", "not paid", "fall through", "declined", "not successful"] }, { label: "loss to store", any: ["loss", "lose", "out of pocket", "gave away", "no payment", "stuck"] }], sample: "Without the confirmation email the purchase isn't verified as successful; releasing goods early risks handing over stock for a purchase that never completed, causing a loss.", explanation: "No email = purchase unverified; releasing risks giving away goods with no payment." },
      { t: "short", q: "Explain what the 'facility amount' is and what happens if the purchase exceeds it.", need: 2, concepts: [{ label: "amount split in 3", any: ["split", "3 instal", "three instal", "facility", "divides"] }, { label: "pay difference", any: ["difference", "extra", "exceed", "more than", "top up", "balance"] }, { label: "with first instalment", any: ["first instal", "together with", "upfront", "with the first", "initial"] }], sample: "The facility amount is what PJN splits into 3 instalments; if the purchase exceeds it, the customer pays the difference together with the first instalment and pays off the rest in instalments.", explanation: "Facility amount = the sum split in 3; excess is paid with the first instalment." },
      { t: "short", q: "Describe how an ONLINE PJN order is confirmed after the customer pays, and what Customer Care checks.", need: 2, concepts: [{ label: "order comes to Lufiano", any: ["comes through", "order comes", "received", "lufiano gets", "online order"] }, { label: "customer care contacts", any: ["customer care", "contact", "reach out", "call", "confirm purchase"] }, { label: "address or collection", any: ["address", "delivery", "collection", "pick-up", "pick up", "date"] }], sample: "Once the customer pays, the online order comes through to Lufiano and Customer Care contacts them to confirm the purchase and their delivery address or collection date.", explanation: "Online PJN: order arrives, Customer Care confirms purchase + address/collection." },
      { t: "short", q: "Explain why online PJN exchanges and in-store PJN exchanges are handled differently.", need: 2, concepts: [{ label: "in-store used store credit", any: ["store credit", "at purchase", "collected", "in-store credit", "paid in store"] }, { label: "in-store normal exchange", any: ["normal exchange", "as per", "standard exchange", "regular"] }, { label: "online handled differently", any: ["differently", "separate", "not the same", "special", "online differ"] }], sample: "An in-store PJN item was collected using store credit at purchase, so it follows the normal exchange process; an online PJN exchange is handled differently/separately.", explanation: "In-store PJN = normal exchange (store credit at purchase); online PJN = handled differently." },
      { t: "short", q: "A customer completes PJN in store and asks to walk out with the item immediately. How do you respond?", need: 2, concepts: [{ label: "need confirmation email", any: ["confirmation email", "email", "go-ahead", "received", "confirm"] }, { label: "cannot release without", any: ["cannot release", "don't release", "not until", "hold", "wait", "can't hand"] }, { label: "explain politely", any: ["explain", "let them know", "polite", "inform", "tell them", "reason"] }], sample: "I'd explain politely that I can only release the goods once the store has received the PJN confirmation email, so we may need to wait for that go-ahead.", explanation: "Only release on the confirmation email; explain this politely to the customer." },
      { t: "short", q: "Across which channels can customers use PJN, and why is it useful to offer it?", need: 2, concepts: [{ label: "online/manual/in-store", any: ["online", "manual", "in-store", "all channel", "three", "everywhere"] }, { label: "affordability", any: ["afford", "spread", "easier", "budget", "manage cost", "instal"] }, { label: "more sales/access", any: ["more sales", "access", "convenien", "attract", "enable", "help buy"] }], sample: "PJN works online, on manual orders and in-store; it's useful because it makes items more affordable by spreading the cost, helping customers buy and supporting sales.", explanation: "PJN spans online/manual/in-store; it aids affordability and supports sales." },
      { t: "short", q: "After a customer scans the in-store QR and inserts the amount, what does PJN show, and what does the customer do next?", need: 2, concepts: [{ label: "shows monthly amount", any: ["monthly", "amount payable", "instalment amount", "highlight", "displays", "shows"] }, { label: "customer proceeds/pays", any: ["proceed", "pay", "accept", "complete", "confirm", "goes ahead"] }, { label: "then release on email", any: ["email", "confirmation", "release", "go-ahead"] }], sample: "PJN highlights the monthly amount payable; the customer proceeds with the purchase, and the store releases the goods once the confirmation email arrives.", explanation: "PJN shows the monthly amount; customer proceeds, goods released on confirmation email." },
      { t: "short", q: "When does the customer actually receive their goods on a successful PJN purchase, and what do they continue to do?", need: 2, concepts: [{ label: "immediately/on success", any: ["immediately", "straight away", "on success", "once successful", "right away", "at purchase"] }, { label: "keep paying instalments", any: ["keep paying", "continue", "instal", "pay off", "remaining", "pays pjn"] }, { label: "store confirmation", any: ["confirmation", "email", "release", "go-ahead"] }], sample: "They receive the goods immediately once the purchase is successful and the store has the confirmation email, and they continue paying off the remaining PJN instalments.", explanation: "Goods released immediately on a successful purchase; customer keeps paying instalments." },
    ],
  },
};
const TOPIC_KEYS = Object.keys(QUIZ_DATA);
const CATEGORIES = ["Foundation", "Policy", "Process"];
const CAT_LABELS = { Foundation: "Foundation", Policy: "Policies", Process: "Processes & Procedures" };

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function fmt(n) { return String(n).padStart(2, "0"); }
function fmtTime(s) { return `${fmt(Math.floor(s / 60))}:${fmt(s % 60)}`; }
function getGrade(pct) {
  if (pct >= 90) return { label: "Outstanding", col: "#C8A96E" };
  if (pct >= 75) return { label: "Competent", col: "#7B9E87" };
  if (pct >= 60) return { label: "Developing", col: "#E0B45A" };
  return { label: "Needs Review", col: "#E07B7B" };
}
function nowStr() {
  const d = new Date();
  return d.toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short" });
}

// ─── SHORT-ANSWER CONCEPT GRADING ─────────────────────────────────────────────
// Marks a typed answer by detecting how many required concepts appear in it.
// Each concept has a list of accepted phrasings ("any"). A concept counts as
// matched if ANY of its phrasings appears in the (normalised) answer text.
//   matched >= need            → auto-correct
//   matched >= need-1 (and >0) → partial → BORDERLINE (flagged for manager)
//   below that                 → auto-incorrect (still visible for manager override)
function normaliseText(s) {
  return " " + String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9%\s]/g, " ")   // keep letters, numbers, %
    .replace(/\s+/g, " ")
    .trim() + " ";
}
function gradeShort(text, concepts, need) {
  const norm = normaliseText(text);
  const wordCount = norm.trim() ? norm.trim().split(" ").length : 0;
  const matchedLabels = [];
  concepts.forEach(c => {
    const hit = c.any.some(syn => norm.indexOf(normaliseText(syn).trim()) !== -1);
    if (hit) matchedLabels.push(c.label);
  });
  const matched = matchedLabels.length;
  const required = need || 1;

  // Guard against effectively empty / junk answers
  const tooShort = wordCount < 3;

  let status; // "correct" | "partial" | "incorrect"
  if (!tooShort && matched >= required) status = "correct";
  else if (!tooShort && matched >= required - 1 && matched > 0) status = "partial";
  else status = "incorrect";

  return {
    status,
    correct: status === "correct",
    borderline: status === "partial",   // manager should review these
    matched,
    required,
    matchedLabels,
    wordCount,
  };
}

// ─── RESULT TOKEN SYSTEM ──────────────────────────────────────────────────────
// Staff copy their result token after finishing. Manager pastes it into the
// dashboard. 100% reliable across any device — no shared storage needed.
// Token now carries per-question type, typed short answers, auto-score and
// borderline flags so the manager can override.
function encodeResult(result) {
  try {
    const compact = {
      v: 2, ts: result.timestamp, dt: result.datetime,
      fn: result.fullName, st: result.store, tp: result.topic,
      sc: result.score, tot: result.total, pct: result.pct,
      to: result.timedOut ? 1 : 0, tu: result.timeUsed,
      ans: result.answers.map(a => {
        if (a.type === "short") {
          // [type, status(0/1/2), typedText, matched]
          const code = a.status === "correct" ? 1 : a.status === "partial" ? 2 : 0;
          return ["s", code, a.text || "", a.matched || 0];
        }
        // [type, selectedIdx, correct(0/1), correctIdx]
        return ["m", a.selected, a.correct ? 1 : 0, a.correctAnswer];
      }),
    };
    return btoa(unescape(encodeURIComponent(JSON.stringify(compact))));
  } catch (e) { return null; }
}

function decodeResult(token) {
  try {
    const raw = JSON.parse(decodeURIComponent(escape(atob(token.trim()))));
    if (!raw || (raw.v !== 1 && raw.v !== 2)) return null;
    const answers = raw.ans.map((a, i) => {
      if (raw.v === 2 && a[0] === "s") {
        const [, code, text, matched] = a;
        const status = code === 1 ? "correct" : code === 2 ? "partial" : "incorrect";
        return {
          questionIdx: i, type: "short", text, matched,
          status, correct: status === "correct", borderline: status === "partial",
        };
      }
      // mcq (either v2 ["m",...] or legacy v1 [selected,correct,correctAnswer])
      const sel = raw.v === 2 ? a[1] : a[0];
      const cor = raw.v === 2 ? a[2] : a[1];
      const cans = raw.v === 2 ? a[3] : a[2];
      return {
        questionIdx: i, type: "mcq", selected: sel,
        correct: cor === 1, correctAnswer: cans,
      };
    });
    return {
      key: 'imported_' + raw.ts + '_' + Math.random().toString(36).slice(2, 6),
      timestamp: raw.ts, datetime: raw.dt, fullName: raw.fn, store: raw.st,
      topic: raw.tp, score: raw.sc, total: raw.tot, pct: raw.pct,
      timedOut: raw.to === 1, timeUsed: raw.tu,
      answers,
      overrides: {}, // manager manual overrides applied in dashboard
    };
  } catch (e) { return null; }
}

// ─── ONE-ATTEMPT LOCK ─────────────────────────────────────────────────────────
// Stops a person retaking the SAME topic on the SAME device/browser.
// localStorage is unavailable inside the Claude artifact preview, so we guard it
// and fall back to an in-memory store there. In the deployed (Vercel) build it
// uses localStorage and persists. NOTE: this is an on-device lock — switching
// device, clearing the browser, or changing the name/surname/store bypasses it.
const MEM_LOCK = {};
function lockSignature(fullName, store, topic) {
  const clean = s => String(s || "").trim().toLowerCase().replace(/\s+/g, " ");
  return "lufiano_lock::" + clean(fullName) + "::" + clean(store) + "::" + clean(topic);
}
function hasAttempted(fullName, store, topic) {
  const key = lockSignature(fullName, store, topic);
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(key) !== null;
    }
  } catch (e) { /* fall through to memory */ }
  return !!MEM_LOCK[key];
}
function recordAttempt(fullName, store, topic, pct) {
  const key = lockSignature(fullName, store, topic);
  const val = JSON.stringify({ at: Date.now(), pct });
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, val);
      return;
    }
  } catch (e) { /* fall through to memory */ }
  MEM_LOCK[key] = val;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function LufianoQuiz() {
  // screens: home | register | quiz | results | review | pin | dashboard | locked
  const [screen, setScreen] = useState("home");
  const [filterCat, setFilterCat] = useState("All");

  // Registration
  const [fullName, setFullName] = useState("");
  const [store, setStore] = useState("");
  const [nameErr, setNameErr] = useState("");

  // Quiz state
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);      // mcq chosen index
  const [shortText, setShortText] = useState("");       // short-answer textbox
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastGrade, setLastGrade] = useState(null);     // grade result for current short q
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME_SECONDS);
  const [timedOut, setTimedOut] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [localCompleted, setLocalCompleted] = useState({});
  const [resultToken, setResultToken] = useState(null);
  const [currentResult, setCurrentResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [lockedTopic, setLockedTopic] = useState(null);

  // Manager / dashboard
  const [pin, setPin] = useState("");
  const [pinErr, setPinErr] = useState("");
  const [dashResults, setDashResults] = useState([]);
  const [dashLoading, setDashLoading] = useState(false);
  const [pasteInput, setPasteInput] = useState("");
  const [pasteError, setPasteError] = useState("");
  const [selectedResult, setSelectedResult] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [overrideDraft, setOverrideDraft] = useState({}); // { "resultKey::qIdx": reasonText }

  const advanceRef = useRef(null);
  const timerRef = useRef(null);
  const answersRef = useRef([]);
  const timeLeftRef = useRef(QUIZ_TIME_SECONDS);
  const selectedTopicRef = useRef(null);
  const fullNameRef = useRef("");
  const storeRef = useRef("");
  const finishCalledRef = useRef(false);

  const topic = selectedTopic ? QUIZ_DATA[selectedTopic] : null;
  const questions = topic ? topic.questions : [];

  useEffect(() => { fullNameRef.current = fullName; }, [fullName]);
  useEffect(() => { storeRef.current = store; }, [store]);
  useEffect(() => { selectedTopicRef.current = selectedTopic; }, [selectedTopic]);

  // ── Timer ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (screen !== "quiz") { clearInterval(timerRef.current); return; }
    finishCalledRef.current = false;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        const next = t - 1;
        timeLeftRef.current = next;
        if (next <= 0) {
          clearInterval(timerRef.current);
          clearTimeout(advanceRef.current);
          if (!finishCalledRef.current) {
            finishCalledRef.current = true;
            finishQuizWithRefs(answersRef.current, true, 0);
          }
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [screen, selectedTopic]); // eslint-disable-line

  // ── Attempt gate → start or lock ──────────────────────────────────────────────
  function attemptStart(key) {
    if (hasAttempted(fullNameRef.current, storeRef.current, key)) {
      setLockedTopic(key);
      setScreen("locked");
      return;
    }
    startQuiz(key);
  }

  // ── Kick off quiz ─────────────────────────────────────────────────────────────
  function startQuiz(key) {
    clearTimeout(advanceRef.current);
    clearInterval(timerRef.current);
    answersRef.current = [];
    timeLeftRef.current = QUIZ_TIME_SECONDS;
    selectedTopicRef.current = key;
    finishCalledRef.current = false;
    setSelectedTopic(key);
    setAnswers([]);
    setCurrentQ(0);
    setSelected(null);
    setShortText("");
    setLastGrade(null);
    setShowFeedback(false);
    setTimedOut(false);
    setTimeLeft(QUIZ_TIME_SECONDS);
    setScreen("quiz");
  }

  function goNextOrFinish(newAnswers) {
    const topicKey = selectedTopicRef.current;
    const qs = QUIZ_DATA[topicKey].questions;
    if (currentQ + 1 < qs.length) {
      setCurrentQ(q => q + 1);
      setSelected(null);
      setShortText("");
      setLastGrade(null);
      setShowFeedback(false);
    } else {
      if (!finishCalledRef.current) {
        finishCalledRef.current = true;
        finishQuizWithRefs(newAnswers, false, timeLeftRef.current);
      }
    }
  }

  // ── MCQ answer ────────────────────────────────────────────────────────────────
  function handleSelect(idx) {
    if (showFeedback) return;
    setSelected(idx);
    setShowFeedback(true);
    const topicKey = selectedTopicRef.current;
    const q = QUIZ_DATA[topicKey].questions[currentQ];
    const correct = idx === q.answer;
    const newAnswers = [...answersRef.current, {
      type: "mcq", selected: idx, correct, correctAnswer: q.answer,
    }];
    answersRef.current = newAnswers;
    setAnswers(newAnswers);
    advanceRef.current = setTimeout(() => goNextOrFinish(newAnswers), 1900);
  }

  // ── Short answer submit ───────────────────────────────────────────────────────
  function handleShortSubmit() {
    if (showFeedback) return;
    const topicKey = selectedTopicRef.current;
    const q = QUIZ_DATA[topicKey].questions[currentQ];
    const g = gradeShort(shortText, q.concepts, q.need);
    setLastGrade(g);
    setShowFeedback(true);
    const newAnswers = [...answersRef.current, {
      type: "short",
      text: shortText.trim(),
      status: g.status,
      correct: g.correct,
      borderline: g.borderline,
      matched: g.matched,
      required: g.required,
    }];
    answersRef.current = newAnswers;
    setAnswers(newAnswers);
    advanceRef.current = setTimeout(() => goNextOrFinish(newAnswers), 3200);
  }

  // ── Finish ────────────────────────────────────────────────────────────────────
  function finishQuizWithRefs(finalAnswers, didTimeout, tLeft) {
    clearInterval(timerRef.current);
    const topicKey = selectedTopicRef.current;
    const qs = QUIZ_DATA[topicKey]?.questions || [];
    // Auto-score: correct answers count as 1. Borderline/partial count as 0 for
    // the auto number but are flagged so the manager can override upward.
    const score = finalAnswers.filter(a => a.correct).length;
    const total = qs.length;
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    const timeUsed = QUIZ_TIME_SECONDS - tLeft;

    setTimedOut(didTimeout);
    setLocalCompleted(prev => ({ ...prev, [topicKey]: pct }));

    // Record the one-attempt lock now that the quiz is finished.
    recordAttempt(fullNameRef.current, storeRef.current, topicKey, pct);

    const result = {
      timestamp: Date.now(),
      datetime: nowStr(),
      fullName: fullNameRef.current,
      store: storeRef.current,
      topic: topicKey,
      score, total, pct,
      timedOut: didTimeout,
      timeUsed,
      answers: finalAnswers.map((a, i) => {
        if (a.type === "short") {
          return {
            questionIdx: i, type: "short", text: a.text,
            status: a.status, correct: a.correct, borderline: a.borderline,
            matched: a.matched, required: a.required,
          };
        }
        return {
          questionIdx: i, type: "mcq", selected: a.selected,
          correct: a.correct, correctAnswer: qs[i]?.answer ?? -1,
        };
      }),
    };

    const token = encodeResult(result);
    setResultToken(token);
    setCurrentResult(result);
    setScreen("results");
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────────
  function openDashboard() { setScreen("dashboard"); }

  function handleDeleteResult(key) {
    setDashResults(prev => prev.filter(r => r.key !== key));
    if (selectedResult?.key === key) setSelectedResult(null);
  }

  // Manager override: flip a single short-answer question's credit up or down,
  // optionally with a reason note the manager typed.
  function applyOverride(resultKey, qIdx, makeCorrect, reason) {
    setDashResults(prev => prev.map(r => {
      if (r.key !== resultKey) return r;
      const answers = r.answers.map(a => {
        if (a.questionIdx !== qIdx || a.type !== "short") return a;
        return {
          ...a, correct: makeCorrect, overridden: true, borderline: false,
          overrideReason: (reason || "").trim() || a.overrideReason || "",
        };
      });
      const score = answers.filter(a => a.correct).length;
      const pct = r.total > 0 ? Math.round((score / r.total) * 100) : 0;
      const updated = { ...r, answers, score, pct };
      if (selectedResult?.key === resultKey) setSelectedResult(updated);
      return updated;
    }));
    setOverrideDraft(prev => { const n = { ...prev }; delete n[resultKey + "::" + qIdx]; return n; });
  }

  // ── CSV export of every result on the dashboard ───────────────────────────────
  function csvCell(v) {
    const s = String(v == null ? "" : v).replace(/"/g, '""');
    return `"${s}"`;
  }
  function exportResultsCSV() {
    if (!dashResults.length) return;
    const header = [
      "Name", "Store", "Topic", "Category", "Score", "Total", "Percent", "Grade",
      "Timed out", "Time used", "Completed", "Q#", "Type", "Question",
      "Their answer", "Auto/Manager result", "Overridden", "Override reason",
    ];
    const rows = [header.map(csvCell).join(",")];
    dashResults.forEach(r => {
      const t = QUIZ_DATA[r.topic];
      const qs = t ? t.questions : [];
      const grade = getGrade(r.pct).label;
      r.answers.forEach((a, i) => {
        const q = qs[i] || {};
        let their = "";
        if (a.type === "short") their = a.text || "";
        else their = (q.options && q.options[a.selected] != null) ? q.options[a.selected] : "";
        const outcome = a.correct ? "Correct" : a.borderline ? "Review needed" : "Incorrect";
        rows.push([
          r.fullName, r.store, r.topic, t?.category || "", r.score, r.total, r.pct + "%", grade,
          r.timedOut ? "Yes" : "No", fmtTime(r.timeUsed || 0), r.datetime,
          i + 1, a.type === "short" ? "Written" : "Multiple choice", q.q || "",
          their, outcome, a.overridden ? "Yes" : "No", a.overrideReason || "",
        ].map(csvCell).join(","));
      });
    });
    const csv = "\ufeff" + rows.join("\r\n"); // BOM so Excel reads UTF-8
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `lufiano-quiz-results-${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function handlePasteToken(raw) {
    setPasteInput(raw);
    if (!raw.trim()) { setPasteError(""); return; }
    const decoded = decodeResult(raw.trim());
    if (!decoded) {
      setPasteError("Invalid result code. Make sure you copied the full code.");
      return;
    }
    if (dashResults.some(r => r.timestamp === decoded.timestamp && r.fullName === decoded.fullName)) {
      setPasteError("This result has already been added.");
      return;
    }
    setPasteError("");
    setDashResults(prev => [decoded, ...prev].sort((a, b) => b.timestamp - a.timestamp));
    setPasteInput("");
  }

  // ── PIN gate ──────────────────────────────────────────────────────────────────
  function submitPin() {
    if (pin === MANAGER_PIN) {
      setPinErr(""); setPin(""); openDashboard();
    } else {
      setPinErr("Incorrect PIN. Please try again."); setPin("");
    }
  }

  // ── Shared styles ─────────────────────────────────────────────────────────────
  const base = {
    minHeight: "100vh", background: "#09090B", color: "#E8E2D9",
    fontFamily: "'Georgia', 'Palatino', serif", position: "relative",
  };
  const card = {
    background: "#111113", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 14, padding: 24,
  };
  const btn = (col = "#C8A96E", outline = false) => ({
    padding: "13px 22px", borderRadius: 11, cursor: "pointer", fontSize: 13,
    fontFamily: "sans-serif", fontWeight: outline ? 400 : 700, letterSpacing: "0.04em",
    border: outline ? `1px solid ${col}` : "none",
    background: outline ? "transparent" : col,
    color: outline ? col : "#09090B",
    transition: "opacity 0.15s",
  });
  const input = {
    background: "#161618", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, padding: "13px 16px", color: "#E8E2D9",
    fontSize: 14, fontFamily: "sans-serif", width: "100%", boxSizing: "border-box",
    outline: "none",
  };

  const timerColor = timeLeft <= 120 ? "#E07B7B" : timeLeft <= 300 ? "#E0B45A" : "#7B9E87";

  // ─── HOME ─────────────────────────────────────────────────────────────────────
  if (screen === "home") {
    const allDone = Object.keys(localCompleted).length;
    const avg = allDone > 0 ? Math.round(Object.values(localCompleted).reduce((a, b) => a + b, 0) / allDone) : null;
    return (
      <div style={base}>
        <div style={{ maxWidth: 1020, margin: "0 auto", padding: "52px 24px 80px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 52 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.4em", color: "#C8A96E", textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: 14 }}>Training Assessment Portal</div>
              <h1 style={{ fontSize: "clamp(36px,5.5vw,58px)", fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.06, margin: 0, color: "#F7F2EA" }}>
                Lufiano <em style={{ color: "#C8A96E" }}>Knowledge</em><br />Assessment
              </h1>
              <p style={{ color: "#5A5248", fontSize: 14, lineHeight: 1.7, fontFamily: "sans-serif", margin: "14px 0 0", maxWidth: 430 }}>
                15 topics · 20 questions each (10 multiple-choice + 10 written) · 20-minute limit per topic.<br />
                <span style={{ color: "#8A8078" }}>One attempt per topic.</span> {fullName ? <span style={{ color: "#C8A96E" }}>Welcome back, {fullName.split(" ")[0]}.</span> : "Enter your name on the next screen before starting."}
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexDirection: "column", alignItems: "flex-end" }}>
              {avg !== null && (
                <div style={{ ...card, textAlign: "center", minWidth: 140 }}>
                  <div style={{ fontSize: 40, color: "#C8A96E", fontWeight: 300 }}>{avg}%</div>
                  <div style={{ fontSize: 11, color: "#4A4440", fontFamily: "sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>
                    {allDone}/{TOPIC_KEYS.length} done
                  </div>
                </div>
              )}
              <button onClick={() => setScreen("pin")} style={{ ...btn("#C8A96E", true), fontSize: 12, padding: "9px 18px" }}>
                Manager Dashboard →
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
            {["All", ...CATEGORIES].map(c => (
              <button key={c} onClick={() => setFilterCat(c)}
                style={{ padding: "8px 16px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontFamily: "sans-serif", letterSpacing: "0.03em",
                  border: `1px solid ${filterCat === c ? "#C8A96E" : "rgba(255,255,255,0.1)"}`,
                  background: filterCat === c ? "rgba(200,169,110,0.12)" : "transparent",
                  color: filterCat === c ? "#C8A96E" : "#6A6258" }}>
                {c === "All" ? "All Topics" : CAT_LABELS[c]}
              </button>
            ))}
          </div>

          {CATEGORIES.filter(c => filterCat === "All" || filterCat === c).map(cat => {
            const keys = TOPIC_KEYS.filter(k => QUIZ_DATA[k].category === cat);
            if (!keys.length) return null;
            return (
              <div key={cat} style={{ marginBottom: 40 }}>
                <div style={{ fontSize: 11, color: "#4A4440", fontFamily: "sans-serif", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>{CAT_LABELS[cat]}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 14 }}>
                  {keys.map(key => {
                    const t = QUIZ_DATA[key];
                    const done = localCompleted[key];
                    const grade = done !== undefined ? getGrade(done) : null;
                    const locked = fullName && store && hasAttempted(fullName, store, key);
                    return (
                      <button key={key} onClick={() => { setSelectedTopic(key); setScreen("register"); }}
                        style={{ ...card, position: "relative", overflow: "hidden", cursor: "pointer", textAlign: "left", padding: 20, background: "#111113", transition: "all 0.18s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#161618"; e.currentTarget.style.borderColor = t.color + "44"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#111113"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                          <span style={{ fontSize: 18, color: t.color }}>{t.icon}</span>
                          {grade && <span style={{ fontSize: 11, fontFamily: "sans-serif", color: grade.col, background: grade.col + "22", padding: "2px 10px", borderRadius: 20 }}>{done}% · {grade.label}</span>}
                          {!grade && locked && <span style={{ fontSize: 10, fontFamily: "sans-serif", color: "#E0B45A", background: "rgba(224,180,90,0.14)", padding: "2px 10px", borderRadius: 20 }}>✓ Attempted</span>}
                        </div>
                        <div style={{ fontSize: 14, color: "#F0EAE0", marginBottom: 5, letterSpacing: "-0.01em", lineHeight: 1.35 }}>{key}</div>
                        <div style={{ fontSize: 12, color: "#3A3530", fontFamily: "sans-serif", lineHeight: 1.55, marginBottom: 12 }}>{t.description}</div>
                        <div style={{ fontSize: 11, color: t.color, fontFamily: "sans-serif" }}>{locked ? "View / Locked →" : "Begin →"}</div>
                        <div style={{ position: "absolute", bottom: 0, left: 0, width: done !== undefined ? `${done}%` : "0%", height: 2, background: t.color, opacity: 0.4 }} />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── REGISTER ─────────────────────────────────────────────────────────────────
  if (screen === "register") {
    const t = selectedTopic ? QUIZ_DATA[selectedTopic] : null;
    return (
      <div style={base}>
        <div style={{ maxWidth: 500, margin: "0 auto", padding: "80px 24px" }}>
          <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: "#5A5248", cursor: "pointer", fontSize: 13, fontFamily: "sans-serif", padding: 0, marginBottom: 40 }}>← Back</button>
          <div style={{ fontSize: 10, color: t?.color || "#C8A96E", letterSpacing: "0.35em", textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: 14 }}>
            {t?.icon} {selectedTopic}
          </div>
          <h2 style={{ fontSize: 30, fontWeight: 400, color: "#F0EAE0", margin: "0 0 8px", letterSpacing: "-0.02em" }}>Before you begin</h2>
          <p style={{ color: "#5A5248", fontSize: 13, fontFamily: "sans-serif", lineHeight: 1.65, margin: "0 0 20px" }}>
            Please enter your details. Your results will be saved and accessible to your manager.<br />
            <strong style={{ color: "#E0B45A" }}>⏱ 20-minute time limit applies.</strong>
          </p>
          <div style={{ background: "rgba(224,123,123,0.08)", border: "1px solid rgba(224,123,123,0.25)", borderRadius: 10, padding: "12px 16px", marginBottom: 32 }}>
            <div style={{ fontSize: 12, color: "#E09898", fontFamily: "sans-serif", lineHeight: 1.6 }}>
              <strong>One attempt only.</strong> You can take this topic once. Enter your name and surname exactly as you'll use them — the assessment locks to your details on this device once you begin.
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 28 }}>
            <div>
              <label style={{ fontSize: 11, color: "#5A5248", fontFamily: "sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Full Name &amp; Surname *</label>
              <input style={input} placeholder="e.g. Thabo Nkosi" value={fullName}
                onChange={e => { setFullName(e.target.value); setNameErr(""); }}
              />
              {nameErr && <div style={{ fontSize: 12, color: "#E07B7B", fontFamily: "sans-serif", marginTop: 6 }}>{nameErr}</div>}
            </div>
            <div>
              <label style={{ fontSize: 11, color: "#5A5248", fontFamily: "sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Store / Location *</label>
              <select style={{ ...input, appearance: "none" }} value={store} onChange={e => { setStore(e.target.value); setNameErr(""); }}>
                <option value="">Select your store…</option>
                {STORES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <button onClick={() => {
            const nm = fullName.trim();
            if (!nm) { setNameErr("Please enter your full name and surname."); return; }
            if (nm.split(/\s+/).length < 2) { setNameErr("Please enter BOTH your name and surname."); return; }
            if (!store) { setNameErr("Please select your store."); return; }
            attemptStart(selectedTopic);
          }} style={{ ...btn(t?.color || "#C8A96E"), width: "100%", padding: "15px" }}>
            Start Quiz →
          </button>
        </div>
      </div>
    );
  }

  // ─── LOCKED (already attempted) ───────────────────────────────────────────────
  if (screen === "locked") {
    const t = lockedTopic ? QUIZ_DATA[lockedTopic] : null;
    return (
      <div style={base}>
        <div style={{ maxWidth: 500, margin: "0 auto", padding: "90px 24px" }}>
          <div style={{ fontSize: 10, color: t?.color || "#C8A96E", letterSpacing: "0.35em", textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: 14 }}>
            {t?.icon} {lockedTopic}
          </div>
          <div style={{ fontSize: 46, marginBottom: 12 }}>🔒</div>
          <h2 style={{ fontSize: 28, fontWeight: 400, color: "#F0EAE0", margin: "0 0 12px", letterSpacing: "-0.02em" }}>You've already taken this one</h2>
          <p style={{ color: "#6A6258", fontSize: 14, fontFamily: "sans-serif", lineHeight: 1.7, margin: "0 0 30px" }}>
            Our records on this device show that <strong style={{ color: "#C0B8B0" }}>{fullName}</strong> ({store}) has already completed the <strong style={{ color: "#C0B8B0" }}>{lockedTopic}</strong> assessment. Each topic can only be taken once.
            <br /><br />
            If you believe this is a mistake, please speak to your manager.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => { setLockedTopic(null); setScreen("home"); }} style={{ ...btn("#C8A96E"), flex: 1 }}>← Back to Topics</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── QUIZ ─────────────────────────────────────────────────────────────────────
  if (screen === "quiz" && topic) {
    const q = questions[currentQ];
    const progress = (currentQ / questions.length) * 100;
    const isShort = q.t === "short";
    return (
      <div style={base}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "36px 24px" }}>
          {/* Top bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <button onClick={() => { clearTimeout(advanceRef.current); clearInterval(timerRef.current); setScreen("home"); }}
              style={{ background: "none", border: "none", color: "#5A5248", cursor: "pointer", fontSize: 12, fontFamily: "sans-serif", padding: 0 }}>← Exit</button>
            <div style={{ fontSize: 10, color: topic.color, fontFamily: "sans-serif", letterSpacing: "0.25em", textTransform: "uppercase" }}>{topic.icon} {selectedTopic}</div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ fontSize: 13, color: "#4A4440", fontFamily: "sans-serif" }}>{currentQ + 1}/{questions.length}</div>
              <div style={{ fontSize: 15, fontFamily: "sans-serif", fontWeight: 700, color: timerColor, minWidth: 52, textAlign: "right", letterSpacing: "0.05em" }}>
                {fmtTime(timeLeft)}
              </div>
            </div>
          </div>

          {/* Timer bar */}
          <div style={{ background: "#1A1A1C", borderRadius: 100, height: 2, marginBottom: 6, overflow: "hidden" }}>
            <div style={{ height: "100%", background: timerColor, width: `${(timeLeft / QUIZ_TIME_SECONDS) * 100}%`, transition: "width 1s linear, background 0.5s", borderRadius: 100 }} />
          </div>
          {/* Progress bar */}
          <div style={{ background: "#1A1A1C", borderRadius: 100, height: 2, marginBottom: 40, overflow: "hidden" }}>
            <div style={{ height: "100%", background: topic.color, width: `${progress}%`, transition: "width 0.35s ease", borderRadius: 100 }} />
          </div>

          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "#3A3530", fontFamily: "sans-serif", letterSpacing: "0.12em" }}>QUESTION {currentQ + 1}</div>
              <div style={{ fontSize: 9, fontFamily: "sans-serif", letterSpacing: "0.12em", textTransform: "uppercase", color: isShort ? "#E0B45A" : "#7B9E87", background: (isShort ? "#E0B45A" : "#7B9E87") + "1E", padding: "2px 9px", borderRadius: 20 }}>
                {isShort ? "Written answer" : "Multiple choice"}
              </div>
            </div>
            <h2 style={{ fontSize: "clamp(17px,2.8vw,23px)", fontWeight: 400, lineHeight: 1.5, color: "#F5EFE7", margin: 0 }}>{q.q}</h2>
          </div>

          {/* ── MCQ ── */}
          {!isShort && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {q.options.map((opt, idx) => {
                const isCorrect = idx === q.answer;
                const isWrong = idx === selected && !isCorrect;
                let bg = "#111113", border = "rgba(255,255,255,0.07)", col = "#B0A89E";
                if (showFeedback && isCorrect) { bg = "rgba(123,158,135,0.14)"; border = "#7B9E87"; col = "#A8D4B8"; }
                if (showFeedback && isWrong) { bg = "rgba(224,123,123,0.14)"; border = "#E07B7B"; col = "#E09898"; }
                return (
                  <button key={idx} onClick={() => handleSelect(idx)}
                    style={{ background: bg, border: `1px solid ${border}`, borderRadius: 11, padding: "15px 18px", cursor: showFeedback ? "default" : "pointer", textAlign: "left", color: col, fontSize: 13, lineHeight: 1.55, fontFamily: "sans-serif", transition: "all 0.18s", display: "flex", alignItems: "center", gap: 12 }}
                    onMouseEnter={e => { if (!showFeedback) { e.currentTarget.style.background = "#171719"; e.currentTarget.style.borderColor = topic.color + "55"; } }}
                    onMouseLeave={e => { if (!showFeedback) { e.currentTarget.style.background = bg; e.currentTarget.style.borderColor = border; } }}
                  >
                    <span style={{ minWidth: 24, height: 24, borderRadius: "50%", background: showFeedback ? (isCorrect ? "#7B9E87" : isWrong ? "#E07B7B" : "#1E1E20") : "#1E1E20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#F5EFE7", flexShrink: 0 }}>
                      {showFeedback ? (isCorrect ? "✓" : isWrong ? "✗" : String.fromCharCode(65 + idx)) : String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {/* ── SHORT ANSWER ── */}
          {isShort && (
            <div style={{ marginBottom: 24 }}>
              <textarea
                value={shortText}
                onChange={e => setShortText(e.target.value)}
                disabled={showFeedback}
                placeholder="Type your answer in your own words. Explain the key points fully…"
                rows={5}
                style={{ ...input, resize: "vertical", minHeight: 120, lineHeight: 1.6, opacity: showFeedback ? 0.7 : 1 }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, flexWrap: "wrap", gap: 10 }}>
                <div style={{ fontSize: 11, color: "#4A4440", fontFamily: "sans-serif" }}>
                  {shortText.trim() ? shortText.trim().split(/\s+/).length : 0} words · aim for {q.need}+ key ideas
                </div>
                {!showFeedback && (
                  <button onClick={handleShortSubmit} disabled={!shortText.trim()}
                    style={{ ...btn(topic.color), opacity: shortText.trim() ? 1 : 0.4, cursor: shortText.trim() ? "pointer" : "default", padding: "11px 26px" }}>
                    Submit Answer →
                  </button>
                )}
              </div>

              {showFeedback && lastGrade && (
                <div style={{ marginTop: 18, borderRadius: 11, padding: "16px 18px",
                  background: lastGrade.status === "correct" ? "rgba(123,158,135,0.10)" : lastGrade.status === "partial" ? "rgba(224,180,90,0.10)" : "rgba(224,123,123,0.10)",
                  border: `1px solid ${lastGrade.status === "correct" ? "#7B9E8755" : lastGrade.status === "partial" ? "#E0B45A55" : "#E07B7B55"}` }}>
                  <div style={{ fontSize: 12, fontFamily: "sans-serif", fontWeight: 700, letterSpacing: "0.04em", marginBottom: 8,
                    color: lastGrade.status === "correct" ? "#A8D4B8" : lastGrade.status === "partial" ? "#E0C27A" : "#E09898" }}>
                    {lastGrade.status === "correct" ? "✓ Well answered" : lastGrade.status === "partial" ? "◐ Partially there — your manager will review this one" : "✗ Key points missing"}
                    <span style={{ color: "#6A6258", fontWeight: 400 }}> · {lastGrade.matched}/{lastGrade.required} key ideas detected</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#8A8078", fontFamily: "sans-serif", lineHeight: 1.6, marginBottom: 10 }}>
                    <span style={{ color: "#5A5248" }}>Model answer:</span> {q.sample}
                  </div>
                  <div style={{ fontSize: 12, color: "#6A6258", lineHeight: 1.6, fontFamily: "sans-serif", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 9 }}>
                    {q.explanation}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MCQ explanation */}
          {!isShort && showFeedback && (
            <div style={{ padding: "14px 18px", background: "rgba(200,169,110,0.05)", borderRadius: 10, borderLeft: `2px solid ${topic.color}` }}>
              <div style={{ fontSize: 10, color: topic.color, fontFamily: "sans-serif", letterSpacing: "0.15em", marginBottom: 6, textTransform: "uppercase" }}>Explanation</div>
              <div style={{ fontSize: 13, color: "#6A6258", lineHeight: 1.65, fontFamily: "sans-serif" }}>{q.explanation}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── RESULTS ──────────────────────────────────────────────────────────────────
  if (screen === "results" && currentResult) {
    const r = currentResult;
    const grade = getGrade(r.pct);
    const topicObj = QUIZ_DATA[r.topic];
    const borderlineCount = r.answers.filter(a => a.type === "short" && a.borderline).length;
    return (
      <div style={base}>
        <div style={{ maxWidth: 660, margin: "0 auto", padding: "52px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 10, color: topicObj?.color || "#C8A96E", fontFamily: "sans-serif", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: 16 }}>
              {topicObj?.icon} {r.topic} · Complete
            </div>
            {r.timedOut && <div style={{ background: "rgba(224,123,123,0.12)", border: "1px solid #E07B7B44", borderRadius: 10, padding: "10px 20px", fontSize: 13, color: "#E07B7B", fontFamily: "sans-serif", marginBottom: 18 }}>⏱ Time expired — quiz was automatically submitted.</div>}
            <div style={{ fontSize: 80, fontWeight: 300, color: grade.col, lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 6 }}>{r.pct}%</div>
            <div style={{ fontSize: 22, color: "#F0EAE0", marginBottom: 8, letterSpacing: "-0.01em" }}>{grade.label}</div>
            <div style={{ fontSize: 13, color: "#5A5248", fontFamily: "sans-serif" }}>{r.score}/{r.total} auto-marked correct · {fmtTime(r.timeUsed)} used</div>
            <div style={{ fontSize: 12, color: "#3A3530", fontFamily: "sans-serif", marginTop: 5 }}>{r.fullName} · {r.store} · {r.datetime}</div>
            {borderlineCount > 0 && (
              <div style={{ fontSize: 12, color: "#E0B45A", fontFamily: "sans-serif", marginTop: 12, background: "rgba(224,180,90,0.10)", border: "1px solid rgba(224,180,90,0.3)", borderRadius: 8, padding: "8px 14px", display: "inline-block" }}>
                ◐ {borderlineCount} written answer{borderlineCount !== 1 ? "s" : ""} flagged for your manager to review — your final mark may go up.
              </div>
            )}
          </div>

          {resultToken && (
            <div style={{ ...card, marginBottom: 20, border: "1px solid rgba(200,169,110,0.3)" }}>
              <div style={{ fontSize: 11, color: "#C8A96E", fontFamily: "sans-serif", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>
                ✉ Send to your manager
              </div>
              <div style={{ fontSize: 12, color: "#7A7068", fontFamily: "sans-serif", lineHeight: 1.55, marginBottom: 14 }}>
                Copy the code below and send it to your manager via WhatsApp or message. They paste it into the Manager Dashboard to view your full results, including your written answers.
              </div>
              <div style={{ background: "#0A0A0C", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "12px 14px", marginBottom: 12, wordBreak: "break-all", fontSize: 11, color: "#6A6258", fontFamily: "monospace", lineHeight: 1.5, maxHeight: 80, overflow: "hidden" }}>
                {resultToken.slice(0, 140)}{resultToken.length > 140 ? "…" : ""}
              </div>
              <button
                onClick={() => {
                  const copy = (text) => {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                      return navigator.clipboard.writeText(text);
                    }
                    const el = document.createElement("textarea");
                    el.value = text; document.body.appendChild(el);
                    el.select(); document.execCommand("copy");
                    document.body.removeChild(el);
                    return Promise.resolve();
                  };
                  copy(resultToken).then(() => { setCopied(true); setTimeout(() => setCopied(false), 3000); });
                }}
                style={{ background: copied ? "rgba(123,158,135,0.2)" : "rgba(200,169,110,0.15)", border: `1px solid ${copied ? "#7B9E87" : "#C8A96E55"}`, borderRadius: 8, padding: "11px 20px", color: copied ? "#7B9E87" : "#C8A96E", cursor: "pointer", fontSize: 13, fontFamily: "sans-serif", fontWeight: 600, width: "100%" }}
              >
                {copied ? "✓ Copied! Now send this to your manager" : "📋 Copy result code"}
              </button>
            </div>
          )}

          <div style={{ ...card, marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: "#3A3530", fontFamily: "sans-serif", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>Question Breakdown</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {r.answers.map((a, i) => {
                const bg = a.correct ? "rgba(123,158,135,0.18)" : a.borderline ? "rgba(224,180,90,0.18)" : "rgba(224,123,123,0.18)";
                const bd = a.correct ? "#7B9E87" : a.borderline ? "#E0B45A" : "#E07B7B";
                const cl = a.correct ? "#7B9E87" : a.borderline ? "#E0B45A" : "#E07B7B";
                return (
                  <div key={i} title={a.type === "short" ? "Written answer" : "Multiple choice"} style={{ position: "relative", width: 30, height: 30, borderRadius: 7, background: bg, border: `1px solid ${bd}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: cl, fontFamily: "sans-serif", fontWeight: 700 }}>
                    {i + 1}{a.type === "short" && <span style={{ position: "absolute", bottom: -2, right: -2, fontSize: 7, color: "#8A8078" }}>✎</span>}
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 10, color: "#3A3530", fontFamily: "sans-serif", marginTop: 12 }}>✎ = written answer · amber = flagged for manager review</div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => { setReviewIndex(0); setScreen("review"); }} style={{ ...btn("#C8A96E", true), flex: 1 }}>Review Answers</button>
            <button onClick={() => setScreen("home")} style={{ ...btn("#C8A96E"), flex: 1 }}>All Topics →</button>
          </div>
          <div style={{ fontSize: 11, color: "#3A3530", fontFamily: "sans-serif", textAlign: "center", marginTop: 16 }}>
            This topic is now locked — one attempt only.
          </div>
        </div>
      </div>
    );
  }

  // ─── REVIEW ───────────────────────────────────────────────────────────────────
  if (screen === "review" && currentResult) {
    const reviewTopic = QUIZ_DATA[currentResult.topic];
    const reviewQs = reviewTopic ? reviewTopic.questions : [];
    const q = reviewQs[reviewIndex];
    const ans = currentResult.answers[reviewIndex];
    if (!q || !ans) return null;
    const statusColor = ans.correct ? "#7B9E87" : ans.borderline ? "#E0B45A" : "#E07B7B";
    return (
      <div style={base}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "36px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
            <button onClick={() => setScreen("results")} style={{ background: "none", border: "none", color: "#5A5248", cursor: "pointer", fontSize: 12, fontFamily: "sans-serif", padding: 0 }}>← Results</button>
            <span style={{ fontSize: 10, color: reviewTopic?.color || '#C8A96E', fontFamily: "sans-serif", letterSpacing: "0.2em" }}>REVIEW {reviewIndex + 1}/{reviewQs.length}</span>
            <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: "#5A5248", cursor: "pointer", fontSize: 12, fontFamily: "sans-serif", padding: 0 }}>Home</button>
          </div>
          <div style={{ ...card, marginBottom: 16, border: `1px solid ${statusColor}33`, background: `${statusColor}0D` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "#3A3530", fontFamily: "sans-serif" }}>Q{reviewIndex + 1}</div>
              <div style={{ fontSize: 9, fontFamily: "sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", color: q.t === "short" ? "#E0B45A" : "#7B9E87" }}>
                {q.t === "short" ? "✎ Written" : "Multiple choice"}
              </div>
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 400, color: "#F0EAE0", lineHeight: 1.5, margin: "0 0 20px" }}>{q.q}</h3>

            {/* MCQ review */}
            {q.t === "mcq" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {q.options.map((opt, idx) => {
                  const isC = idx === q.answer, isSel = idx === ans.selected;
                  return (
                    <div key={idx} style={{ padding: "10px 14px", borderRadius: 9, background: isC ? "rgba(123,158,135,0.14)" : isSel ? "rgba(224,123,123,0.14)" : "rgba(255,255,255,0.02)", border: `1px solid ${isC ? "#7B9E87" : isSel ? "#E07B7B" : "rgba(255,255,255,0.04)"}`, fontSize: 13, color: isC ? "#A8D4B8" : isSel ? "#E09898" : "#4A4440", fontFamily: "sans-serif", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ width: 18, height: 18, borderRadius: "50%", background: isC ? "#7B9E87" : isSel ? "#E07B7B" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#09090B", fontWeight: 700, flexShrink: 0 }}>{isC ? "✓" : isSel ? "✗" : ""}</span>
                      {opt}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Short review */}
            {q.t === "short" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontSize: 11, fontFamily: "sans-serif", fontWeight: 700, letterSpacing: "0.04em", color: statusColor }}>
                  {ans.correct ? "✓ Answered well" : ans.borderline ? "◐ Partially there — flagged for manager review" : "✗ Key points missing"}
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#5A5248", fontFamily: "sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 5 }}>Your answer</div>
                  <div style={{ fontSize: 13, color: "#C0B8B0", fontFamily: "sans-serif", lineHeight: 1.6, background: "rgba(255,255,255,0.02)", borderRadius: 8, padding: "10px 14px", whiteSpace: "pre-wrap" }}>
                    {ans.text ? ans.text : <em style={{ color: "#4A4440" }}>(no answer given)</em>}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#5A5248", fontFamily: "sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 5 }}>Model answer</div>
                  <div style={{ fontSize: 13, color: "#A8D4B8", fontFamily: "sans-serif", lineHeight: 1.6, background: "rgba(123,158,135,0.08)", borderRadius: 8, padding: "10px 14px" }}>
                    {q.sample}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div style={{ padding: "14px 18px", background: "rgba(200,169,110,0.05)", borderRadius: 10, borderLeft: `2px solid ${reviewTopic?.color || '#C8A96E'}`, marginBottom: 22 }}>
            <div style={{ fontSize: 10, color: reviewTopic?.color || '#C8A96E', fontFamily: "sans-serif", letterSpacing: "0.15em", marginBottom: 6, textTransform: "uppercase" }}>Explanation</div>
            <div style={{ fontSize: 13, color: "#6A6258", lineHeight: 1.65, fontFamily: "sans-serif" }}>{q.explanation}</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setReviewIndex(r => Math.max(0, r - 1))} disabled={reviewIndex === 0}
              style={{ ...btn("#C8A96E", true), flex: 1, opacity: reviewIndex === 0 ? 0.3 : 1, cursor: reviewIndex === 0 ? 'default' : 'pointer' }}>← Previous</button>
            <button onClick={() => setReviewIndex(r => Math.min(reviewQs.length - 1, r + 1))} disabled={reviewIndex === reviewQs.length - 1}
              style={{ ...btn(reviewTopic?.color || "#C8A96E"), flex: 1, opacity: reviewIndex === reviewQs.length - 1 ? 0.4 : 1 }}>Next →</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── PIN SCREEN ───────────────────────────────────────────────────────────────
  if (screen === "pin") {
    return (
      <div style={base}>
        <div style={{ maxWidth: 400, margin: "0 auto", padding: "100px 24px" }}>
          <button onClick={() => { setPin(""); setPinErr(""); setScreen("home"); }} style={{ background: "none", border: "none", color: "#5A5248", cursor: "pointer", fontSize: 13, fontFamily: "sans-serif", padding: 0, marginBottom: 44 }}>← Back</button>
          <div style={{ fontSize: 10, color: "#C8A96E", letterSpacing: "0.35em", textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: 16 }}>Manager Access</div>
          <h2 style={{ fontSize: 28, fontWeight: 400, color: "#F0EAE0", margin: "0 0 8px", letterSpacing: "-0.02em" }}>Enter PIN</h2>
          <p style={{ fontSize: 13, color: "#5A5248", fontFamily: "sans-serif", margin: "0 0 32px", lineHeight: 1.6 }}>Enter your 4-digit manager PIN to access the results dashboard.</p>
          <input
            type="password" maxLength={4} placeholder="••••"
            style={{ ...input, fontSize: 28, letterSpacing: "0.5em", textAlign: "center", marginBottom: 16 }}
            value={pin} onChange={e => { setPin(e.target.value.replace(/\D/g, "")); setPinErr(""); }}
            onKeyDown={e => e.key === "Enter" && submitPin()}
          />
          {pinErr && <div style={{ fontSize: 12, color: "#E07B7B", fontFamily: "sans-serif", marginBottom: 16, textAlign: "center" }}>{pinErr}</div>}
          <button onClick={submitPin} style={{ ...btn("#C8A96E"), width: "100%", padding: "14px" }}>Access Dashboard →</button>
        </div>
      </div>
    );
  }

  // ─── DASHBOARD ────────────────────────────────────────────────────────────────
  if (screen === "dashboard") {
    return (
      <div style={base}>
        <div style={{ maxWidth: 1020, margin: "0 auto", padding: "44px 24px 80px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 44 }}>
            <div>
              <div style={{ fontSize: 10, color: "#C8A96E", letterSpacing: "0.35em", textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: 12 }}>Manager Dashboard</div>
              <h2 style={{ fontSize: 32, fontWeight: 400, color: "#F0EAE0", margin: 0, letterSpacing: "-0.02em" }}>Quiz Results</h2>
              <p style={{ color: "#5A5248", fontSize: 13, fontFamily: "sans-serif", margin: "8px 0 0" }}>{dashResults.length} result{dashResults.length !== 1 ? "s" : ""} across all staff</p>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flexWrap: "wrap" }}>
              <button onClick={exportResultsCSV} disabled={!dashResults.length}
                style={{ ...btn("#7B9E87"), fontSize: 12, padding: "9px 16px", opacity: dashResults.length ? 1 : 0.4, cursor: dashResults.length ? "pointer" : "default" }}>
                ⬇ Export CSV
              </button>
              <button onClick={() => { setPasteInput(""); setPasteError(""); }}
                style={{ ...btn("#C8A96E", true), fontSize: 12, padding: "9px 16px" }}>✕ Clear input</button>
              <button onClick={() => setScreen("home")} style={{ ...btn("#C8A96E", true), fontSize: 12, padding: "9px 16px" }}>← Exit</button>
            </div>
          </div>

          {/* Paste-in area */}
          <div style={{ ...card, marginBottom: 28, border: "1px solid rgba(200,169,110,0.2)" }}>
            <div style={{ fontSize: 11, color: "#C8A96E", fontFamily: "sans-serif", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Add Result</div>
            <div style={{ fontSize: 12, color: "#5A5248", fontFamily: "sans-serif", marginBottom: 12, lineHeight: 1.55 }}>
              Staff send you a result code after completing a quiz. Paste it below to add it to the dashboard.
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input
                placeholder="Paste result code here…"
                value={pasteInput}
                onChange={e => handlePasteToken(e.target.value)}
                style={{ flex: 1, background: "#161618", border: `1px solid ${pasteError ? "#E07B7B" : "rgba(255,255,255,0.1)"}`, borderRadius: 9, padding: "11px 14px", color: "#E8E2D9", fontSize: 13, fontFamily: "sans-serif", outline: "none", minWidth: 200 }}
              />
              <button
                onClick={() => { navigator.clipboard?.readText().then(text => handlePasteToken(text)).catch(() => {}); }}
                style={{ ...btn("#C8A96E", true), fontSize: 12, padding: "9px 16px", whiteSpace: "nowrap" }}
              >
                📋 Paste from clipboard
              </button>
            </div>
            {pasteError && <div style={{ fontSize: 12, color: "#E07B7B", fontFamily: "sans-serif", marginTop: 8 }}>{pasteError}</div>}
          </div>

          {dashResults.length === 0 && (
            <div style={{ textAlign: "center", color: "#3A3530", fontFamily: "sans-serif", padding: "60px 0", fontSize: 14 }}>
              No results yet. Ask staff to complete a quiz and send you their result code.
            </div>
          )}

          {dashResults.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "minmax(280px,340px) 1fr", gap: 20 }}>
              {/* Left: list */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: "72vh", overflowY: "auto", paddingRight: 4 }}>
                {dashResults.map(r => {
                  const grade = getGrade(r.pct);
                  const isSel = selectedResult?.key === r.key;
                  const flagged = r.answers.filter(a => a.type === "short" && a.borderline).length;
                  return (
                    <div key={r.key} onClick={() => setSelectedResult(r)}
                      style={{ ...card, cursor: "pointer", border: `1px solid ${isSel ? QUIZ_DATA[r.topic]?.color || "#C8A96E" : "rgba(255,255,255,0.06)"}`, background: isSel ? "#161618" : "#111113", transition: "all 0.18s" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                        <div style={{ fontSize: 14, color: "#F0EAE0", fontWeight: 400 }}>{r.fullName}</div>
                        <div style={{ fontSize: 16, fontWeight: 300, color: grade.col, fontFamily: "sans-serif" }}>{r.pct}%</div>
                      </div>
                      <div style={{ fontSize: 11, color: "#5A5248", fontFamily: "sans-serif", marginBottom: 4 }}>{r.store}</div>
                      <div style={{ fontSize: 11, color: QUIZ_DATA[r.topic]?.color || "#C8A96E", fontFamily: "sans-serif", marginBottom: 4 }}>
                        {QUIZ_DATA[r.topic]?.icon} {r.topic}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <div style={{ fontSize: 11, color: "#3A3530", fontFamily: "sans-serif" }}>{r.datetime}</div>
                        <div style={{ display: "flex", gap: 5 }}>
                          {flagged > 0 && <div style={{ fontSize: 10, color: "#E0B45A", fontFamily: "sans-serif", background: "rgba(224,180,90,0.12)", padding: "2px 8px", borderRadius: 20 }}>◐ {flagged} to review</div>}
                          {r.timedOut && <div style={{ fontSize: 10, color: "#E07B7B", fontFamily: "sans-serif", background: "rgba(224,123,123,0.12)", padding: "2px 8px", borderRadius: 20 }}>Timed out</div>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right: detail */}
              <div>
                {!selectedResult && (
                  <div style={{ ...card, textAlign: "center", padding: "60px 24px", color: "#3A3530", fontFamily: "sans-serif", fontSize: 14 }}>
                    Select a result on the left to view details
                  </div>
                )}
                {selectedResult && (() => {
                  const r = selectedResult;
                  const grade = getGrade(r.pct);
                  const t = QUIZ_DATA[r.topic];
                  const qs = t ? t.questions : [];
                  const timeUsed = r.timeUsed || 0;
                  return (
                    <div style={{ ...card, maxHeight: "72vh", overflowY: "auto" }}>
                      {/* Header */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
                        <div>
                          <div style={{ fontSize: 10, color: t?.color || "#C8A96E", letterSpacing: "0.25em", textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: 8 }}>
                            {t?.icon} {r.topic}
                          </div>
                          <div style={{ fontSize: 22, color: "#F0EAE0", letterSpacing: "-0.01em", marginBottom: 4 }}>{r.fullName}</div>
                          <div style={{ fontSize: 13, color: "#5A5248", fontFamily: "sans-serif" }}>{r.store} · {r.datetime}</div>
                          {r.timedOut && <div style={{ fontSize: 12, color: "#E07B7B", fontFamily: "sans-serif", marginTop: 4 }}>⏱ Quiz timed out</div>}
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 48, fontWeight: 300, color: grade.col, lineHeight: 1 }}>{r.pct}%</div>
                          <div style={{ fontSize: 13, color: grade.col, fontFamily: "sans-serif" }}>{grade.label}</div>
                          <div style={{ fontSize: 12, color: "#3A3530", fontFamily: "sans-serif", marginTop: 4 }}>
                            {r.score}/{r.total} correct · {fmtTime(timeUsed)} used
                          </div>
                        </div>
                      </div>

                      {/* Score bar */}
                      <div style={{ background: "#1A1A1C", borderRadius: 100, height: 6, marginBottom: 20, overflow: "hidden" }}>
                        <div style={{ height: "100%", background: grade.col, width: `${r.pct}%`, borderRadius: 100 }} />
                      </div>

                      {/* Review-flag banner */}
                      {r.answers.some(a => a.type === "short" && a.borderline) && (
                        <div style={{ background: "rgba(224,180,90,0.08)", border: "1px solid rgba(224,180,90,0.3)", borderRadius: 10, padding: "12px 16px", marginBottom: 24 }}>
                          <div style={{ fontSize: 12, color: "#E0C27A", fontFamily: "sans-serif", lineHeight: 1.55 }}>
                            ◐ Some written answers were partially correct and need your judgement. Review them below and tap <strong>Mark correct</strong> or <strong>Mark wrong</strong> — the score updates automatically.
                          </div>
                        </div>
                      )}

                      {/* Full Q&A breakdown */}
                      <div>
                        <div style={{ fontSize: 10, color: "#3A3530", fontFamily: "sans-serif", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>Full Breakdown</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                          {r.answers.map((a, i) => {
                            const q = qs[i];
                            if (!q) return null;
                            const sColor = a.correct ? "#7B9E87" : a.borderline ? "#E0B45A" : "#E07B7B";
                            const sLabel = a.correct ? (a.overridden ? "✓ CORRECT (manager)" : "✓ CORRECT") : a.borderline ? "◐ REVIEW NEEDED" : (a.overridden ? "✗ WRONG (manager)" : "✗ INCORRECT");
                            return (
                              <div key={i} style={{ borderLeft: `3px solid ${sColor}`, paddingLeft: 16 }}>
                                <div style={{ fontSize: 11, color: sColor, fontFamily: "sans-serif", marginBottom: 5, letterSpacing: "0.08em" }}>
                                  {sLabel} · Q{i + 1} · {a.type === "short" ? "Written" : "Multiple choice"}
                                </div>
                                <div style={{ fontSize: 13, color: "#C0B8B0", marginBottom: 8, lineHeight: 1.45 }}>{q.q}</div>

                                {/* MCQ detail */}
                                {a.type === "mcq" && !a.correct && (
                                  <>
                                    <div style={{ fontSize: 12, color: "#E09898", fontFamily: "sans-serif", marginBottom: 4 }}>
                                      Their answer: <em>{q.options[a.selected] ?? "—"}</em>
                                    </div>
                                    <div style={{ fontSize: 12, color: "#A8D4B8", fontFamily: "sans-serif", marginBottom: 6 }}>
                                      Correct answer: <strong>{q.options[q.answer]}</strong>
                                    </div>
                                  </>
                                )}

                                {/* Short detail + override */}
                                {a.type === "short" && (
                                  <div style={{ marginBottom: 8 }}>
                                    <div style={{ fontSize: 11, color: "#5A5248", fontFamily: "sans-serif", marginBottom: 3 }}>Their written answer{typeof a.matched === "number" ? ` · ${a.matched}/${a.required || 1} key ideas auto-detected` : ""}:</div>
                                    <div style={{ fontSize: 12, color: "#D8CFC4", fontFamily: "sans-serif", lineHeight: 1.55, background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "9px 13px", marginBottom: 8, whiteSpace: "pre-wrap" }}>
                                      {a.text ? a.text : <em style={{ color: "#4A4440" }}>(no answer given)</em>}
                                    </div>
                                    <div style={{ fontSize: 11, color: "#5A5248", fontFamily: "sans-serif", marginBottom: 3 }}>Model answer:</div>
                                    <div style={{ fontSize: 12, color: "#8FB89C", fontFamily: "sans-serif", lineHeight: 1.55, marginBottom: 10 }}>{q.sample}</div>
                                    {(() => {
                                      const draftKey = r.key + "::" + i;
                                      const reasonVal = overrideDraft[draftKey] ?? "";
                                      return (
                                        <>
                                          <input
                                            value={reasonVal}
                                            onChange={e => setOverrideDraft(prev => ({ ...prev, [draftKey]: e.target.value }))}
                                            placeholder="Optional: reason for your decision (e.g. worded differently but correct)"
                                            style={{ width: "100%", boxSizing: "border-box", background: "#161618", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px", color: "#E8E2D9", fontSize: 12, fontFamily: "sans-serif", outline: "none", marginBottom: 8 }}
                                          />
                                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                            <button onClick={() => applyOverride(r.key, i, true, reasonVal)} disabled={a.correct}
                                              style={{ fontSize: 11, fontFamily: "sans-serif", fontWeight: 600, padding: "6px 14px", borderRadius: 8, cursor: a.correct ? "default" : "pointer", border: "1px solid #7B9E87", background: a.correct ? "rgba(123,158,135,0.25)" : "transparent", color: "#7B9E87", opacity: a.correct ? 0.6 : 1 }}>
                                              ✓ Mark correct
                                            </button>
                                            <button onClick={() => applyOverride(r.key, i, false, reasonVal)} disabled={!a.correct}
                                              style={{ fontSize: 11, fontFamily: "sans-serif", fontWeight: 600, padding: "6px 14px", borderRadius: 8, cursor: !a.correct ? "default" : "pointer", border: "1px solid #E07B7B", background: !a.correct ? "rgba(224,123,123,0.25)" : "transparent", color: "#E07B7B", opacity: !a.correct ? 0.6 : 1 }}>
                                              ✗ Mark wrong
                                            </button>
                                          </div>
                                        </>
                                      );
                                    })()}
                                    {a.overrideReason && (
                                      <div style={{ fontSize: 11, color: "#8A8078", fontFamily: "sans-serif", lineHeight: 1.5, marginTop: 8, background: "rgba(200,169,110,0.06)", borderLeft: "2px solid #C8A96E55", borderRadius: 4, padding: "6px 10px" }}>
                                        <span style={{ color: "#C8A96E" }}>Manager note:</span> {a.overrideReason}
                                      </div>
                                    )}
                                  </div>
                                )}

                                <div style={{ fontSize: 12, color: "#4A4440", fontFamily: "sans-serif", lineHeight: 1.55, borderTop: "1px solid #1A1A1C", paddingTop: 8, marginTop: 6 }}>
                                  {q.explanation}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Delete */}
                      <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid #1A1A1C" }}>
                        <button onClick={() => handleDeleteResult(r.key)}
                          style={{ background: "rgba(224,123,123,0.1)", border: "1px solid #E07B7B44", borderRadius: 9, padding: "9px 18px", color: "#E07B7B", cursor: "pointer", fontSize: 12, fontFamily: "sans-serif" }}>
                          Remove from dashboard
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
