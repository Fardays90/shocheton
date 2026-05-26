import { FactCheckResult } from "@/lib/types/factcheck";

/**
 * Simulates an AI fact-checking analysis with a short delay.
 * Returns a mock FactCheckResult based on the input text.
 */
export async function simulateFactCheck(inputText: string): Promise<FactCheckResult> {
  // Simulate network / AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    inputText,
    summary: {
      overallCredibilityScore: 62,
      overallVerdict: "Conflicting",
      confidenceLevel: "Medium",
      aiReasoningSummary:
        "The submitted text contains multiple factual claims with mixed accuracy. Some claims are well-supported by scientific consensus and reputable sources, while others propagate common misconceptions that have been debunked by experts.",
      totalClaimsAnalyzed: 3,
      analyzedAt: now,
    },
    claims: [
      {
        id: crypto.randomUUID(),
        claimText: "The Great Wall of China is visible from space.",
        credibilityScore: 15,
        verdict: "Refuted",
        reasoning:
          "This is a widely-held misconception. According to NASA astronauts and multiple space agencies, the Great Wall of China is not visible to the unaided eye from low Earth orbit. The wall is narrow (about 6 meters wide) and blends with the natural landscape.",
        evidenceSources: [
          {
            id: crypto.randomUUID(),
            sourceName: "NASA",
            url: "https://www.nasa.gov/vision/space/workinginspace/great_wall.html",
            snippet:
              "The Great Wall can barely be seen from the Shuttle, so it would not be possible to see it with the naked eye from the Moon.",
            relevanceScore: 95,
            publishedDate: "2005-05-09",
          },
          {
            id: crypto.randomUUID(),
            sourceName: "Scientific American",
            url: "https://www.scientificamerican.com/article/is-chinas-great-wall-visible-from-space/",
            snippet:
              "Astronaut William Pogue thought he had seen it from Skylab but discovered he was actually looking at the Grand Canal of China.",
            relevanceScore: 88,
            publishedDate: "2008-02-21",
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        claimText: "Humans only use 10% of their brain.",
        credibilityScore: 10,
        verdict: "Refuted",
        reasoning:
          "This is one of the most persistent neuroscience myths. Brain imaging studies (PET, fMRI) show that virtually all regions of the brain have known functions and are active over a 24-hour period. While not all neurons fire simultaneously, all areas of the brain are utilised.",
        evidenceSources: [
          {
            id: crypto.randomUUID(),
            sourceName: "Scientific American",
            url: "https://www.scientificamerican.com/article/do-people-only-use-10-percent-of-their-brains/",
            snippet:
              "Evidence would show over a day you use 100 percent of the brain.",
            relevanceScore: 92,
            publishedDate: "2008-02-07",
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        claimText: "Water boils at 100 degrees Celsius at sea level.",
        credibilityScore: 97,
        verdict: "Supported",
        reasoning:
          "This claim is accurate under standard atmospheric pressure (1 atm / 101.325 kPa). Pure water boils at exactly 100 °C (212 °F) at sea level, a fundamental physical constant used to calibrate thermometers.",
        evidenceSources: [
          {
            id: crypto.randomUUID(),
            sourceName: "Britannica",
            url: "https://www.britannica.com/science/boiling-point",
            snippet:
              "The boiling point of water at sea level is 100 °C (212 °F).",
            relevanceScore: 96,
            publishedDate: "2023-01-15",
          },
          {
            id: crypto.randomUUID(),
            sourceName: "NIST",
            url: "https://www.nist.gov/pml/owm/metric-si/si-units-temperature",
            snippet:
              "The Celsius scale defines 100 °C as the boiling point of water at standard atmospheric pressure.",
            relevanceScore: 90,
          },
        ],
      },
    ],
  };
}
