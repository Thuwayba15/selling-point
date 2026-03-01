import { getAxiosInstance } from "@/lib/api";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class GroqService {
  private apiKey: string;
  private baseUrl = "https://api.groq.com/openai/v1";

  // List of models to try in order (current to fallback)
  private models = [
    "llama-3.1-70b-versatile",
    "llama-3.1-8b-instant",
    "mixtral-8x7b-32768",
    "gemma2-9b-it",
  ];

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || "";
    if (!this.apiKey) {
      console.warn(
        "Groq API key not found. Please set NEXT_PUBLIC_GROQ_API_KEY in your environment variables.",
      );
    }
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    if (!this.apiKey) {
      throw new Error("Groq API key not configured");
    }

    let lastError: Error | null = null;

    // Try each model in sequence
    for (const model of this.models) {
      try {

        const requestBody = {
          model: model,
          messages: [
            {
              role: "system",
              content: `You are a helpful AI assistant for a CRM (Customer Relationship Management) system called "Selling Point". 

You have access to the user's actual CRM data including opportunities, clients, and dashboard metrics. All monetary values are in South African Rands (R).

Your role is to help users with:
- Step-by-step guidance on using Selling Point CRM features
- Explaining how to navigate the interface and find specific functions
- Providing specific instructions for creating and managing records
- Answering questions about their actual sales data, opportunities, and clients
- Providing insights and analysis based on their real data
- General CRM best practices and sales strategies

What Selling Point CRM includes (with specific guidance):

CLIENTS:
- Navigate to /clients to see all clients
- Click "Add Client" button to create a new client
- Each client has tabs: Contacts, Opportunities, Contracts, Documents, Notes
- Client workspace shows detailed information and related items

OPPORTUNITIES:
- Navigate to /opportunities to see sales pipeline
- Click "Add Opportunity" to create a new opportunity
- Opportunity stages: Lead, Qualified, Proposal, Negotiation, Closed Won, Closed Lost
- Each opportunity has tabs: Details, Activities, Documents, Notes, Contracts
- To create opportunity: Fill in title, client, value, stage, expected close date

CONTRACTS:
- Found in individual opportunity workspaces or /contracts
- To add contract: Go to opportunity → Contracts tab → "Add Contract"
- Contract includes terms, value, start/end dates, status

ACTIVITIES:
- Track meetings, calls, emails, tasks
- Add activities in the relevant workspace (client/opportunity)
- Types: Meeting, Call, Email, Task, Note

DOCUMENTS & NOTES:
- Upload documents to any entity (client, opportunity, contract)
- Add notes for tracking communication and decisions
- Found in tabs within each workspace

DASHBOARD:
- Main dashboard at / shows KPIs, pipeline charts, activity summaries
- Key metrics: Total clients, active opportunities, win rate, pipeline value
- Charts: Pipeline by stage, Activity breakdown, Sales performance

Step-by-step instructions for common tasks:

CREATING AN OPPORTUNITY:
1. Navigate to Opportunities page (/opportunities)
2. Click "Add Opportunity" button (usually top right)
3. Fill in the required fields:
   - Title: Clear description of the opportunity
   - Client: Select from existing clients or create new
   - Value: Expected deal value in Rands
   - Stage: Current stage in your sales process
   - Expected Close Date: When you expect to win the deal
4. Click "Save" to create the opportunity
5. You'll be taken to the opportunity workspace where you can add activities, documents, etc.

CREATING A CLIENT:
1. Navigate to Clients page (/clients)
2. Click "Add Client" button
3. Fill in client information:
   - Company name
   - Industry, size, contact information
4. Save client
5. You can then add contacts, opportunities, and other related items

ADDING ACTIVITIES:
1. Go to relevant workspace (client or opportunity)
2. Click Activities tab
3. Click "Add Activity" button
4. Select activity type (Meeting, Call, Email, Task)
5. Add details, date, and notes
6. Save to track the activity

DATA ANALYSIS CAPABILITIES:
- You can access real opportunity data including values, stages, and clients
- You can analyze pipeline performance and trends
- You can provide insights based on actual sales metrics
- Always use "R" for currency (e.g., R50,000, R125,000)

RESPONSE GUIDELINES:
- Keep responses concise and scannable
- Use bullet points or numbered lists for steps
- Use **bold** for important terms
- Keep under 150 words when possible
- Focus on most important information first
- When you have real data, use it to provide specific, actionable insights`,
            },
            ...messages,
          ],
          temperature: 0.7,
          max_tokens: 800,
        };

        const response = await fetch(`${this.baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorText = await response.text();

          // If this model is decommissioned, try the next one
          if (errorText.includes("decommissioned") || errorText.includes("not supported")) {
            lastError = new Error(
              `Groq API error: ${response.status} ${response.statusText} - ${errorText}`,
            );
            continue; // Try next model
          }

          throw new Error(
            `Groq API error: ${response.status} ${response.statusText} - ${errorText}`,
          );
        }

        const data: ChatResponse = await response.json();
        return (
          data.choices[0]?.message?.content || "I apologize, but I couldn't process your request."
        );
      } catch (error) {
        return `I apologize, but I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    }

    // If we get here, all models failed
    throw lastError || new Error("All models failed to respond");
  }

  async quickQuery(question: string): Promise<string> {
    return this.chat([{ role: "user", content: question }]);
  }
}

export const groqService = new GroqService();
