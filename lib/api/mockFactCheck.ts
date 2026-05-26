import { FactCheckResult, Claim, EvidenceSource, Verdict } from "@/lib/types/factcheck";

/**
 * Realistic claim database keyed by topic category.
 * Each entry provides a structured claim with its own verdict,
 * credibility score, reasoning, and 2–3 evidence sources.
 */
const CLAIM_BANK: Claim[] = [
  {
    id: "claim-great-wall",
    claimText: "The Great Wall of China is visible from space with the naked eye.",
    credibilityScore: 12,
    verdict: "Refuted",
    reasoning:
      "This is one of the most persistent geographical myths. Multiple NASA astronauts, including Yang Liwei (China's first astronaut), have confirmed that the Great Wall is not visible to the unaided eye from low Earth orbit. The wall averages only 6 meters in width — far too narrow to resolve at orbital altitudes of 350+ km. Satellite imagery can detect it, but human vision cannot.",
    evidenceSources: [
      {
        id: "ev-nasa-wall",
        sourceName: "NASA Science",
        url: "https://www.nasa.gov/vision/space/workinginspace/great_wall.html",
        snippet:
          "The Great Wall can barely be seen from the Shuttle, so it would not be possible to see it with the naked eye from the Moon.",
        relevanceScore: 96,
        publishedDate: "2005-05-09",
      },
      {
        id: "ev-sa-wall",
        sourceName: "Scientific American",
        url: "https://www.scientificamerican.com/article/is-chinas-great-wall-visible-from-space/",
        snippet:
          "Astronaut William Pogue initially believed he spotted the wall from Skylab, but later confirmed he had been looking at the Grand Canal of China near Beijing.",
        relevanceScore: 89,
        publishedDate: "2008-02-21",
      },
      {
        id: "ev-esa-wall",
        sourceName: "European Space Agency",
        url: "https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration",
        snippet:
          "ESA astronaut André Kuipers confirmed that man-made structures like highways and airports are more visible from the ISS than the Great Wall.",
        relevanceScore: 82,
        publishedDate: "2012-07-15",
      },
    ],
  },
  {
    id: "claim-brain-10pct",
    claimText: "Humans only use 10% of their brain capacity.",
    credibilityScore: 8,
    verdict: "Refuted",
    reasoning:
      "This is a deeply entrenched neuroscience myth with no empirical basis. Modern neuroimaging technologies such as fMRI and PET scans demonstrate that virtually all regions of the brain have known functions and exhibit activity over a 24-hour cycle. While not all 86 billion neurons fire simultaneously at every moment, no area of healthy brain tissue is permanently dormant or unused.",
    evidenceSources: [
      {
        id: "ev-sa-brain",
        sourceName: "Scientific American",
        url: "https://www.scientificamerican.com/article/do-people-only-use-10-percent-of-their-brains/",
        snippet:
          "Neurologist Barry Gordon describes the myth as laughably false, stating 'we use virtually every part of the brain, and most of the brain is active almost all of the time.'",
        relevanceScore: 94,
        publishedDate: "2008-02-07",
      },
      {
        id: "ev-nature-brain",
        sourceName: "Nature Neuroscience",
        url: "https://www.nature.com/neuro/",
        snippet:
          "Brain mapping studies consistently show that over a 24-hour period, virtually 100% of brain regions demonstrate detectable metabolic activity.",
        relevanceScore: 91,
        publishedDate: "2019-03-12",
      },
    ],
  },
  {
    id: "claim-water-boil",
    claimText: "Water boils at 100 degrees Celsius at sea level under standard atmospheric pressure.",
    credibilityScore: 97,
    verdict: "Supported",
    reasoning:
      "This claim is accurate under standard atmospheric pressure (1 atm / 101.325 kPa). Pure water boils at exactly 100 °C (212 °F) at sea level. This is a fundamental physical constant defined by the Celsius temperature scale itself and verified by countless laboratory measurements worldwide.",
    evidenceSources: [
      {
        id: "ev-britannica-boil",
        sourceName: "Encyclopædia Britannica",
        url: "https://www.britannica.com/science/boiling-point",
        snippet:
          "The boiling point of water at standard sea-level atmospheric pressure (760 mm [29.92 inches] of mercury) is 100 °C (212 °F).",
        relevanceScore: 97,
        publishedDate: "2023-01-15",
      },
      {
        id: "ev-nist-boil",
        sourceName: "NIST (National Institute of Standards and Technology)",
        url: "https://www.nist.gov/pml/owm/metric-si/si-units-temperature",
        snippet:
          "The Celsius scale defines 0 °C as the freezing point of water and 100 °C as its boiling point at standard atmospheric pressure.",
        relevanceScore: 93,
      },
      {
        id: "ev-iupac-boil",
        sourceName: "IUPAC Gold Book",
        url: "https://goldbook.iupac.org/terms/view/B00715",
        snippet:
          "Boiling point: The temperature at which the vapour pressure of a liquid equals the external pressure on the liquid, defined as 100 °C for water at 1 atm.",
        relevanceScore: 88,
        publishedDate: "2020-06-01",
      },
    ],
  },
  {
    id: "claim-lightning-same",
    claimText: "Lightning never strikes the same place twice.",
    credibilityScore: 6,
    verdict: "Refuted",
    reasoning:
      "This is a common misconception. Lightning frequently strikes the same location multiple times, especially tall or isolated structures. The Empire State Building in New York City, for example, is struck by lightning approximately 20–25 times per year. Lightning rods are specifically designed to be repeatedly struck to protect buildings.",
    evidenceSources: [
      {
        id: "ev-noaa-lightning",
        sourceName: "NOAA (National Weather Service)",
        url: "https://www.weather.gov/safety/lightning-myths",
        snippet:
          "Lightning often strikes the same place repeatedly, especially if it is a tall, pointy, isolated object. The Empire State Building is hit nearly 25 times a year.",
        relevanceScore: 96,
        publishedDate: "2022-06-10",
      },
      {
        id: "ev-nasa-lightning",
        sourceName: "NASA Earth Observatory",
        url: "https://earthobservatory.nasa.gov/",
        snippet:
          "Satellite data reveals that certain geographic hotspots experience hundreds of lightning strikes per square kilometer annually, contradicting the 'never strikes twice' myth.",
        relevanceScore: 84,
        publishedDate: "2021-09-05",
      },
    ],
  },
  {
    id: "claim-vitamin-c-cold",
    claimText: "Taking vitamin C supplements prevents the common cold.",
    credibilityScore: 35,
    verdict: "Conflicting",
    reasoning:
      "The evidence on vitamin C and the common cold is mixed. While regular supplementation does not prevent colds in the general population, some studies suggest it may slightly reduce the duration and severity of symptoms (by about 8% in adults). Supplementation appears more beneficial for individuals under extreme physical stress (marathon runners, soldiers in sub-arctic conditions). The relationship is nuanced and does not support the blanket claim of prevention.",
    evidenceSources: [
      {
        id: "ev-cochrane-vitc",
        sourceName: "Cochrane Database of Systematic Reviews",
        url: "https://www.cochranelibrary.com/",
        snippet:
          "Regular vitamin C supplementation had a modest but consistent effect in reducing the duration of common cold symptoms. However, it did not reduce cold incidence in the general population.",
        relevanceScore: 95,
        publishedDate: "2013-01-31",
      },
      {
        id: "ev-nih-vitc",
        sourceName: "NIH Office of Dietary Supplements",
        url: "https://ods.od.nih.gov/factsheets/VitaminC-HealthProfessional/",
        snippet:
          "Overall, the evidence to date suggests that regular intakes of vitamin C at doses of at least 200 mg/day do not reduce the incidence of the common cold in the general population.",
        relevanceScore: 91,
        publishedDate: "2021-03-26",
      },
      {
        id: "ev-bmj-vitc",
        sourceName: "The BMJ",
        url: "https://www.bmj.com/",
        snippet:
          "While prophylactic vitamin C modestly reduced cold duration by 8% in adults and 14% in children, therapeutic supplementation initiated after onset showed no consistent benefit.",
        relevanceScore: 87,
        publishedDate: "2020-04-18",
      },
    ],
  },
  {
    id: "claim-earth-sun-distance",
    claimText: "The Earth is approximately 150 million kilometers from the Sun.",
    credibilityScore: 95,
    verdict: "Supported",
    reasoning:
      "This is accurate. The mean distance between Earth and the Sun, known as one Astronomical Unit (AU), is approximately 149.6 million kilometers (92.96 million miles). This value varies between roughly 147.1 million km at perihelion (early January) and 152.1 million km at aphelion (early July), making 150 million km a widely accepted approximation.",
    evidenceSources: [
      {
        id: "ev-nasa-au",
        sourceName: "NASA Solar System Exploration",
        url: "https://solarsystem.nasa.gov/planets/earth/overview/",
        snippet:
          "Earth orbits the Sun at an average distance of about 150 million km (93 million miles), known as one Astronomical Unit (AU).",
        relevanceScore: 98,
        publishedDate: "2023-08-01",
      },
      {
        id: "ev-iau-au",
        sourceName: "International Astronomical Union",
        url: "https://www.iau.org/",
        snippet:
          "In 2012, the IAU officially defined 1 astronomical unit as exactly 149,597,870,700 meters, approximately 150 million kilometers.",
        relevanceScore: 94,
        publishedDate: "2012-09-14",
      },
    ],
  },
];

/**
 * Selects 2–4 random claims from the claim bank and computes
 * aggregate summary metrics to simulate a full backend response.
 */
function buildMockResult(inputText: string): FactCheckResult {
  // Shuffle and pick 2–4 claims
  const shuffled = [...CLAIM_BANK].sort(() => Math.random() - 0.5);
  const count = Math.min(2 + Math.floor(Math.random() * 3), shuffled.length);
  const selectedClaims = shuffled.slice(0, count);

  // Compute aggregate credibility
  const avgScore = Math.round(
    selectedClaims.reduce((sum, c) => sum + c.credibilityScore, 0) / selectedClaims.length
  );

  // Derive overall verdict from aggregate
  let overallVerdict: Verdict;
  const verdicts = selectedClaims.map((c) => c.verdict);
  const hasRefuted = verdicts.includes("Refuted");
  const hasSupported = verdicts.includes("Supported");
  if (hasRefuted && hasSupported) {
    overallVerdict = "Conflicting";
  } else if (hasRefuted) {
    overallVerdict = "Refuted";
  } else if (hasSupported) {
    overallVerdict = "Supported";
  } else {
    overallVerdict = "Conflicting";
  }

  // Derive confidence from spread of scores
  const scoreSpread = Math.max(...selectedClaims.map((c) => c.credibilityScore)) -
    Math.min(...selectedClaims.map((c) => c.credibilityScore));
  const confidenceLevel: "High" | "Medium" | "Low" =
    scoreSpread < 30 ? "High" : scoreSpread < 60 ? "Medium" : "Low";

  return {
    id: crypto.randomUUID(),
    inputText,
    summary: {
      overallCredibilityScore: avgScore,
      overallVerdict,
      confidenceLevel,
      aiReasoningSummary: `Our AI cross-referenced ${selectedClaims.length} identifiable factual claims extracted from the submitted text against ${selectedClaims.reduce((n, c) => n + c.evidenceSources.length, 0)} trusted academic and institutional sources. The aggregate credibility score of ${avgScore}/100 reflects a ${overallVerdict.toLowerCase()} consensus across the evidence base. ${confidenceLevel === "High" ? "The evidence strongly converges in one direction." : confidenceLevel === "Medium" ? "Some claims show mixed evidence requiring nuanced interpretation." : "Wide divergence in claim accuracy was detected, with individual scores spanning the full credibility range."}`,
      totalClaimsAnalyzed: selectedClaims.length,
      analyzedAt: new Date().toISOString(),
    },
    claims: selectedClaims,
  };
}

/**
 * Simulates an asynchronous fact-check API call with realistic
 * network latency (1.2–2.5 seconds) and returns a full result payload.
 */
export async function mockFactCheck(inputText: string): Promise<FactCheckResult> {
  const latency = 1200 + Math.random() * 1300; // 1.2s – 2.5s

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(buildMockResult(inputText));
    }, latency);
  });
}
