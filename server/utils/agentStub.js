// Fake AI Stub (Rule-based)
export function classify(description) {
  const keywords = {
    billing: ["payment", "invoice", "bill", "refund"],
    tech: ["error", "bug", "crash", "issue", "500", "login"],
    other: ["general", "question", "help", "info"]
  };

  let category = "other";
  for (const [cat, words] of Object.entries(keywords)) {
    if (words.some(w => description.toLowerCase().includes(w))) {
      category = cat;
      break;
    }
  }

  return category;
}

export function draftReply(description, category) {
  return `Hello, based on your issue: "${description}".\n` +
    `Here are some related KB articles:\n- ${category.toUpperCase()}_DOC_1\n- ${category.toUpperCase()}_DOC_2\n`;
}

export function generateConfidence() {
  // Random confidence between 0.55 and 0.95
  return (Math.random() * 0.4 + 0.55).toFixed(2);
}
