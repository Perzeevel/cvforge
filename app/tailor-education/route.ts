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
    // REQUEST DATA
    // =========================

    const {
      education,
      jobTitle,
      jobDescription,
      skills,
    } = body;

    if (
      !education?.degree?.trim() &&
      !education?.institution?.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Please enter your education information before improving it.",
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
    // OPENROUTER KEY
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
    // SHARED AI USAGE LIMIT
    // =========================

    const userRef = adminDb.collection("users").doc(userId);

    const usage = await adminDb.runTransaction(
      async (transaction) => {
        const snapshot = await transaction.get(userRef);
        const data = snapshot.data();

        const plan =
          data?.plan === "pro" ? "pro" : "free";

        const used = data?.aiUses ?? 0;

        // Pro = unlimited
        if (plan === "pro") {
          return { allowed: true };
        }

        // Free = maximum 2 total AI uses
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

Improve the candidate's education section so it is clear,
professional, concise, and ATS-friendly for the target job.

IMPORTANT RULES:

- Use only information already provided by the candidate.
- Do not invent degrees.
- Do not invent institutions.
- Do not invent dates.
- Do not invent grades.
- Do not invent certifications.
- Do not invent courses.
- Do not invent achievements.
- Do not invent qualifications.
- Do not add information that is not provided.
- Keep all information truthful.
- Improve wording and structure only.
- Return only a concise professional education description.
- Do not use markdown headings.
- Never output "[object Object]".

TARGET JOB:

${jobTitle || "Not provided"}

CANDIDATE SKILLS:

${skills || "Not provided"}

JOB DESCRIPTION:

${jobDescription || "Not provided"}

EDUCATION:

Degree:
${education.degree || "Not provided"}

Institution:
${education.institution || "Not provided"}

Location:
${education.location || "Not provided"}

Graduation Year:
${education.graduationYear || "Not provided"}
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
      "EDUCATION OPENROUTER RESPONSE:",
      JSON.stringify(data, null, 2)
    );

    // =========================
    // AI ERROR
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
    // AI RESULT
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
      "EDUCATION TAILORING ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Education tailoring failed.",
      },
      { status: 500 }
    );
  }
}