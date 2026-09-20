import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      education,
      jobTitle,
      jobDescription,
      skills,
    } = body;

    if (!education?.degree?.trim() && !education?.institution?.trim()) {
      return NextResponse.json(
        {
          error:
            "Please enter your education information before improving it.",
        },
        { status: 400 }
      );
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        {
          error: "OPENROUTER_API_KEY is missing.",
        },
        { status: 500 }
      );
    }

    const prompt = `
You are an expert professional CV writer.

Improve the candidate's education section so it is clear, professional, and ATS-friendly for the target job.

IMPORTANT RULES:
- Use only information already provided by the candidate.
- Do not invent degrees, institutions, dates, grades, certifications, courses, achievements, or qualifications.
- Do not add information that is not provided.
- Keep all information truthful.
- Return only a concise professional education description.
- Do not use markdown headings.

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

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
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

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            "OpenRouter request failed.",
        },
        { status: response.status }
      );
    }

    const result =
      typeof data?.choices?.[0]?.message?.content === "string"
        ? data.choices[0].message.content.trim()
        : "";

    if (!result) {
      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            data?.choices?.[0]?.finish_reason ||
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
    console.error("EDUCATION TAILORING ERROR:", error);

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