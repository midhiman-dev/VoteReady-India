import { describe, it, expect } from "vitest";
import { SAFE_DEMO_SOURCE_FRAGMENTS } from "./sourceFragmentFixtures";
import { INITIAL_SOURCE_REGISTRY } from "./sourceRegistry";

describe("SAFE_DEMO_SOURCE_FRAGMENTS Integrity", () => {
  it("should verify that every fragment has all required fields", () => {
    for (const fragment of SAFE_DEMO_SOURCE_FRAGMENTS) {
      expect(fragment.id).toBeDefined();
      expect(typeof fragment.id).toBe("string");
      expect(fragment.id.trim()).not.toBe("");

      expect(fragment.sourceId).toBeDefined();
      expect(typeof fragment.sourceId).toBe("string");

      expect(fragment.title).toBeDefined();
      expect(typeof fragment.title).toBe("string");

      expect(fragment.content).toBeDefined();
      expect(typeof fragment.content).toBe("string");

      expect(fragment.language).toBeDefined();
      expect(typeof fragment.language).toBe("string");

      expect(fragment.freshnessStatus).toBeDefined();
      expect(typeof fragment.freshnessStatus).toBe("string");

      expect(fragment.useScope).toBeDefined();
      expect(typeof fragment.useScope).toBe("string");
    }
  });

  it("should verify that every fragment sourceId exists in INITIAL_SOURCE_REGISTRY", () => {
    const validSourceIds = INITIAL_SOURCE_REGISTRY.map((source) => source.id);
    for (const fragment of SAFE_DEMO_SOURCE_FRAGMENTS) {
      expect(validSourceIds).toContain(fragment.sourceId);
    }
  });

  it("should verify that every demo fragment is marked demo_safe or not_for_user_guidance", () => {
    const allowedScopes = ["demo_safe", "not_for_user_guidance"];
    for (const fragment of SAFE_DEMO_SOURCE_FRAGMENTS) {
      expect(allowedScopes).toContain(fragment.useScope);
    }
  });

  it("should verify that no demo fragment is marked verified", () => {
    for (const fragment of SAFE_DEMO_SOURCE_FRAGMENTS) {
      expect(fragment.freshnessStatus).not.toBe("verified");
    }
  });

  it("should verify that no demo fragment contains unsafe procedural trigger terms", () => {
    const unsafeTerms = [
      "deadline",
      "Form 6",
      "eligible",
      "polling date",
      "register by",
      "voter ID required"
    ];

    for (const fragment of SAFE_DEMO_SOURCE_FRAGMENTS) {
      const contentLower = fragment.content.toLowerCase();
      const titleLower = fragment.title.toLowerCase();
      
      for (const term of unsafeTerms) {
        expect(contentLower).not.toContain(term.toLowerCase());
        expect(titleLower).not.toContain(term.toLowerCase());
      }
    }
  });
});
