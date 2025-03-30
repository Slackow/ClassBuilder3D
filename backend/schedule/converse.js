import OpenAI from "openai";

/**
 * Generates a course schedule for a user by providing their academic Plan,
 * a sample study plan, and a list of requests for courses.
 *
 * @param {Object} plan - The Plan object representing courses already taken.
 * @param {string} sampleStudyPlan - The sample study plan text.
 * @param {Array} requests - An array of course request strings.
 * @returns {Promise<Object>} - A promise that resolves to a schedule object,
 * where keys are term names and values are arrays of course codes.
 */
export async function generateSchedule(plan, sampleStudyPlan, requests) {

  const prompt = `
The student Plan is as follows:
${JSON.stringify(plan, null, 2)}

The sample study plan is:
${sampleStudyPlan}

The student requests are:
${JSON.stringify(requests, null, 2)}

Based on the above, please generate a course schedule that:
- Meets the student's academic needs based on the sample plan.
- Takes into account prerequisites, credit requirements, and course sequencing.
- Is output as a JSON object where keys are term names (e.g., "Term I", "Term II", etc.)
  and values are arrays of course codes.

Return only valid JSON.
`;


  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  try {

    const response = await client.responses.create({
      model: "gpt-4o-2024-08-06",
      input: [
        { role: "system", content: "You are an academic advisor AI that uses a student's academic plan, a sample study plan, and a list of requests to generate a course schedule. Your output should be a valid JSON object that adheres to the provided schema. Do not include any extra commentary outside of the JSON response." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      text: {
        format: {
          type: "json_schema",
          strict: true,
          name: "course_schedule",
          schema: {
            type: "object",
            properties: {
              schedule: {
                type: "object",
                properties: {},
                additionalProperties: {
                  type: "array",
                  items: { type: "string" }
                }
              }
            },
            required: ["schedule"],
            additionalProperties: false
          }
        }
      }
    });

    const result = response.output_text;
    
    return JSON.parse(result);
  } catch (error) {
    console.error("Error generating schedule:", error);
    throw error;
  }
}



export const studyPlans = {
  stevens: `
Term I:
  CS 115 - Introduction to Computer Science
  MA 121 - Differential Calculus
  MA 122 - Integral Calculus
  Science I

Term II:
  CS 135 - Discrete Structures
  CS 284 - Data Structures
  MA 125 - Vectors and Matrices
  MA 126 - Multivariable Calculus I
  Science II

Term III:
  CS 382	Computer Architecture and Organization	4
  CS 385	Algorithms	4
  MA 222	Probability and Statistics	3
  Science/Math Elective	3
  MGT 103	Introduction to Entrepreneurial Thinking	2
  PRV 20X	Frontiers of Technology	1

Term IV:
  CS 392	Systems Programming	3
  CS 496	Principles of Programming Languages	3
  MA 331	Intermediate Statistics	3
  Humanities	3
  T.E. Technical Elective	3
  PRV 20X	Frontiers of Technology	1
  PRV 20X	Frontiers of Technology	1

Term V:
  CS 334	Theory of Computation	3
  CS 396	Security, Privacy and Society	4
  HSSC 371	Computers and Society	3
  Or
  HPL 455	Ethical Issues in Science and Technology	3
  T.E. Technical Elective	3
  General Elective	3

Term VI:
  T.E. Technical Elective	3
  T.E. Technical Elective	3
  T.E. Technical Elective	3
  T.E. Technical Elective	3
  Science/Math Elective	3

Term VII:
  CS 423	Senior Design I	3
  T.E. Technical Elective	3
  T.E. Technical Elective	3
  T.E. Technical Elective	3
  Humanities	3

Term VIII:
  CS 424	Senior Design II	3
  T.E. Technical Elective	3
  T.E. Technical Elective	3
  General Elective	3
  Humanities	3
`};