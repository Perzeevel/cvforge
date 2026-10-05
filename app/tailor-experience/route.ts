import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "../lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // =========================
    // AUTHENTICATION
    // =========================

    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const idToken = authHeader.split("Bearer ")[1];

    let decodedToken;

    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (error) {
      console.error("AUTH ERROR:", error);

      return NextResponse.json(
        { error: "Invalid authentication token." },
        { status: 401 }
      );
    }

    const userId = decodedToken.uid;

    // =========================
    // GET REQUEST DATA
    // =========================

    const {
      experience,
      jobTitle,
      jobDescription,
      skills,
    } = body;

    if (!experience?.description?.trim()) {
      return NextResponse.json(
        {
          error:
            "Please enter an experience description before improving it.",
        },
        { status: 400 }
      );
    }

    if (!jobDescription?.trim()) {
      return NextResponse.json(
        {
          error: "Job description is required.",
        },
        { status: 400 }
      );
    }

    // =========================
    // CHECK OPENROUTER KEY
    // =========================

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        {
          error: "OPENROUTER_API_KEY is missing.",
        },
        { status: 500 }
      );
    }

    // =========================
    // CHECK AI USAGE
    // =========================

    const userRef = adminDb.collection("users").doc(userId);

    const usage = await adminDb.runTransaction(
      async (transaction) => {
        const snapshot = await transaction.get(userRef);
        const data = snapshot.data();

        const plan =
          data?.plan === "pro" ? "pro" : "free";

        const used = data?.aiUses ?? 0;

        // Pro users have unlimited AI
        if (plan === "pro") {
          return { allowed: true };
        }

        // Free users get 2 total AI uses
        if (used >= 2) {
          return { allowed: false };
        }

        transaction.set(
          userRef,
          {
            aiUses: used + 1,
          },
          {
            merge: true,
          }
        );

        return { allowed: true };
      }
    );

    if (!usage.allowed) {
      return NextResponse.json(
        {
          error:
            "You have used your 2 free AI uses. Upgrade to Pro to continue.",
        },
        { status: 403 }
      );
    }

    // =========================
    // AI PROMPT
    // =========================

    const prompt = `
You are an expert professional CV writer.

Improve the candidate's work experience description so it is:

- Professional
- Clear
- Concise
- ATS-friendly
- Relevant to the target job

IMPORTANT RULES:

- Use ONLY information already provided by the candidate.
- Do NOT invent responsibilities.
- Do NOT invent achievements.
- Do NOT invent numbers or percentages.
- Do NOT invent skills.
- Do NOT invent companies.
- Do NOT invent qualifications.
- Do NOT add technologies that were not provided.
- Keep everything truthful.
- Improve the wording and structure only.
- Return ONLY the improved experience description.
- Do not use markdown headings.
- Do not use "[object Object]".

TARGET JOB:

${jobTitle || "Not provided"}

CANDIDATE SKILLS:

${skills || "Not provided"}

JOB DESCRIPTION:

${jobDescription || "Not provided"}

WORK EXPERIENCE:

Job Title:
${experience.jobTitle || "Not provided"}

Company:
${experience.company || "Not provided"}

Location:
${experience.location || "Not provided"}

Start Date:
${experience.startDate || "Not provided"}

End Date:
${experience.endDate || "Not provided"}

Original Description:
${experience.description || "Not provided"}
`;

    // =========================
    // OPENROUTER REQUEST
    // =========================

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.2,
        }),
      }
    );

    const data = await response.json();

    console.log(
      "EXPERIENCE OPENROUTER RESPONSE:",
      JSON.stringify(data, null, 2)
    );

    // =========================
    // HANDLE AI ERROR
    // =========================

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            "OpenRouter request failed.",
        },
        {
          status: response.status,
        }
      );
    }

    // =========================
    // GET AI RESULT
    // =========================

    const result =
      typeof data?.choices?.[0]?.message?.content ===
      "string"
        ? data.choices[0].message.content.trim()
        : "";

    if (!result) {
      return NextResponse.json(
        {
          error:
            "OpenRouter returned an empty response.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error(
      "EXPERIENCE TAILORING ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Experience improvement failed.",
      },
      { status: 500 }
    );
  }
}