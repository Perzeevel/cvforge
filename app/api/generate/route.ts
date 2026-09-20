import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      jobTitle,
      summary,
      experience,
      education,
      skills,
      jobDescription,
    } = body;

    console.log("EXPERIENCE FROM API:", experience);
console.log("EDUCATION FROM API:", education);

    if (!jobDescription?.trim()) {
      return NextResponse.json(
        { error: "Job description is required." },
        { status: 400 }
      );
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY is missing." },
        { status: 500 }
      );
    }

    const prompt = `
You are an expert ATS resume analyzer.

Analyze this CV against the job description.

Do not invent qualifications or experience.

Experience and Education are provided as JSON data. Read the JSON fields directly.
Never output "[object Object]" anywhere in your response.

CANDIDATE:

Name: ${name || "Not provided"}

Target Job: ${jobTitle || "Not provided"}

Summary:
${summary || "Not provided"}

Experience:
${
  Array.isArray(experience)
    ? experience
        .map(
          (item: any, index: number) => `
Experience ${index + 1}:
Job Title: ${item.jobTitle || "Not provided"}
Company: ${item.company || "Not provided"}
Location: ${item.location || "Not provided"}
Start Date: ${item.startDate || "Not provided"}
End Date: ${item.endDate || "Not provided"}
Description:
${item.description || "Not provided"}
`
        )
        .join("\n")
    : experience || "Not provided"
}

Education:
${
  Array.isArray(education)
    ? education
        .map(
          (item: any, index: number) => `
Education ${index + 1}:
Degree: ${item.degree || "Not provided"}
Institution: ${item.institution || "Not provided"}
Location: ${item.location || "Not provided"}
Graduation Year: ${item.graduationYear || "Not provided"}
Details:
${item.details || "Not provided"}
`
        )
        .join("\n")
    : education || "Not provided"
}

Skills:
${skills || "Not provided"}

JOB DESCRIPTION:

${jobDescription}

Return ONLY valid JSON.

Use exactly this structure:

{
  "score": 0,
  "matchPercentage": 0,
  "matchedKeywords": [],
  "missingKeywords": [],
  "recommendations": [],
  "summary": "",
  "tailoredSummary": ""
}

Rules:
- - score: integer 0-100
- matchPercentage: integer 0-100
- matchedKeywords: array of strings
- missingKeywords: array of strings
- recommendations: array of strings
- summary: short string
- tailoredSummary: improved professional CV summary based only on the candidate's actual information
- Never invent experience, qualifications, skills, employers, education, certifications, or achievements.
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
          response_format: {
            type: "json_object",
          },
        }),
      }
    );

    const data = await response.json();

    console.log("OPENROUTER RESPONSE:", data);

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

    const text =
      data?.choices?.[0]?.message?.content?.trim() || "";

    if (!text) {
      return NextResponse.json(
        { error: "OpenRouter returned an empty response." },
        { status: 500 }
      );
    }

    console.log("AI RESPONSE:", text);

    // Remove markdown code fences if the model adds them
    const cleaned = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let analysis;

    try {
      analysis = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("JSON PARSE ERROR:", parseError);
      console.error("AI RAW RESPONSE:", text);

      return NextResponse.json(
        {
          error: "AI returned an invalid analysis format.",
          raw: text,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      analysis,
      result: cleaned,
    });
  } catch (error: any) {
    console.error("OPENROUTER API ERROR:", error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Unknown error occurred while analyzing the CV.",
      },
      { status: 500 }
    );
  }
}