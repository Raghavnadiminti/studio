// Summarizes the booking request using OCR and Gemini API to provide a short summary for HOD/Principal.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeBookingRequestInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "A PDF document or image of a booking request letter, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SummarizeBookingRequestInput = z.infer<typeof SummarizeBookingRequestInputSchema>;

const SummarizeBookingRequestOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the booking request.'),
});
export type SummarizeBookingRequestOutput = z.infer<typeof SummarizeBookingRequestOutputSchema>;

export async function summarizeBookingRequest(
  input: SummarizeBookingRequestInput
): Promise<SummarizeBookingRequestOutput> {
  return summarizeBookingRequestFlow(input);
}

const summarizeBookingRequestPrompt = ai.definePrompt({
  name: 'summarizeBookingRequestPrompt',
  input: {schema: SummarizeBookingRequestInputSchema},
  output: {schema: SummarizeBookingRequestOutputSchema},
  prompt: `You are an administrative assistant tasked with summarizing booking requests. Extract the text from the following document and summarize it in a concise manner.

Document: {{media url=fileDataUri}}`,
});

const summarizeBookingRequestFlow = ai.defineFlow(
  {
    name: 'summarizeBookingRequestFlow',
    inputSchema: SummarizeBookingRequestInputSchema,
    outputSchema: SummarizeBookingRequestOutputSchema,
  },
  async input => {
    const {output} = await summarizeBookingRequestPrompt(input);
    return output!;
  }
);
