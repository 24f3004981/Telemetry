import { NextResponse } from "next/server";
import { DealProfile, CaseOutput } from "@/lib/business-case/types";

export async function POST(req: Request) {
  try {
    const { profile, caseOutput } = (await req.json()) as {
      profile: DealProfile;
      caseOutput: CaseOutput;
    };

    if (!profile || !caseOutput) {
      return NextResponse.json({ error: "Profile and caseOutput are required" }, { status: 400 });
    }

    const openaiKey = process.env.OPENAI_API_KEY;

    if (openaiKey && openaiKey.trim() !== "") {
      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey.trim()}`,
          },
          body: JSON.stringify({
            model: process.env.OPENAI_MODEL || "gpt-4.1",
            messages: [
              {
                role: "system",
                content:
                  "Draft a formal 1-page executive board memo for IOMETE. Audience: CIO, CFO, CISO. Conservative, rigorous tone. CRITICAL: NEVER invent numbers; only cite values passed in. Output JSON matching: { title: string, executiveSummary: string, recommendation: string, financialSummary: string, sovereigntyPosition: string, risksAndUnknowns: string[], nextSteps: string[] }.",
              },
              {
                role: "user",
                content: JSON.stringify({ profile, caseOutput }),
              },
            ],
            response_format: { type: "json_object" },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const memo = JSON.parse(data.choices[0].message.content);
          return NextResponse.json({ memo, status: "live_llm" });
        }
      } catch (err) {
        console.warn("LLM API in generate-memo fallback:", err);
      }
    }

    // High-polish deterministic executive memo synthesis
    const formattedSavings = caseOutput.projectedThreeYearSavings
      ? `$${caseOutput.projectedThreeYearSavings.toLocaleString()}`
      : "Pending current spend confirmation";

    const memo = {
      title: `Executive Approval Memo: IOMETE Deployment Evaluation for ${profile.companyName}`,
      executiveSummary: `${profile.companyName} is assessing its data-platform architecture across ${profile.dataVolumeTb} TB of critical workloads in the ${profile.region} jurisdiction. Telemetry recommends transitioning to a ${caseOutput.recommendedDeployment} with IOMETE ${caseOutput.recommendedPlan}, eliminating multi-tenant cloud storage markups and asserting full data sovereignty within customer infrastructure.`,
      recommendation: `Approve a 90-day technical evaluation of IOMETE ${caseOutput.recommendedPlan} to benchmark high-priority queries and validate the estimated $${caseOutput.threeYearTotalCost.toLocaleString()} three-year total cost of ownership.`,
      financialSummary: `Year 1 projected expenditure is $${caseOutput.yearOneCost.toLocaleString()} ($${caseOutput.yearOneIometeLicense.toLocaleString()} platform license + $${caseOutput.yearOneInfraCost.toLocaleString()} underlying compute). Three-year projected cumulative cost is $${caseOutput.threeYearTotalCost.toLocaleString()}${caseOutput.projectedThreeYearSavings ? `, projecting cumulative savings of ${formattedSavings} against the current $${profile.currentAnnualSpendUsd?.toLocaleString()}/year run-rate with an estimated payback within ${caseOutput.paybackMonths || 4} months.` : '. Current annual spend baseline required for comparative ROI.'}`,
      sovereigntyPosition: `Sovereignty Score: ${caseOutput.sovereigntyScore}/100. ${caseOutput.sovereigntyRationale}`,
      risksAndUnknowns: caseOutput.risksAndUnknowns,
      nextSteps: [
        `Deploy IOMETE Helm chart in ${profile.companyName}'s test Kubernetes environment.`,
        `Execute 30-day benchmarking run across primary workloads: ${profile.primaryWorkloads.slice(0, 3).join(", ")}.`,
        `Finalize shared security responsibility matrix with the CISO team.`,
      ],
    };

    return NextResponse.json({ memo, status: "deterministic_engine" });
  } catch (error) {
    console.error("Generate memo error:", error);
    return NextResponse.json({ error: "Failed to generate memo" }, { status: 500 });
  }
}
