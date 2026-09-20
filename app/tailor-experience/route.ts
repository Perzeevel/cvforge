import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

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

Rewrite the candidate's work experience description into a clear, professional, ATS-friendly format.

IMPORTANT RULES:
- Use only information already provided by the candidate.
- Do not invent achievements, numbers, percentages, responsibilities, tools, software, certifications, employers, or qualifications.
- Do not add responsibilities that are not mentioned.
- Keep the meaning truthful.
- Use strong professional action verbs when appropriate.
- Return 3 to 5 concise bullet points.
- Return only the bullet points.
- Do not use markdown headings.
- Each bullet point must start with "- ".

TARGET JOB TITLE:
${jobTitle || "Not provided"}

CANDIDATE SKILLS:
${skills || "Not provided"}

JOB DESCRIPTION:
${jobDescription || "Not provided"}

CURRENT EXPERIENCE:

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

Description:
${experience.description}
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
      "EXPERIENCE OPENROUTER RESPONSE:",
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

    const message = data?.choices?.[0]?.message;

const result =
  typeof message?.content === "string"
    ? message.content.trim()
    : "";

if (!result) {
  console.error(
    "OPENROUTER EMPTY EXPERIENCE RESPONSE:",
    JSON.stringify(data, null, 2)
  );

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
    console.error("EXPERIENCE TAILORING ERROR:", error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Experience tailoring failed.",
      },
      { status: 500 }
    );
  }
}