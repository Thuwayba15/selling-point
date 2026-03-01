import { groqService } from './groq-service';
import { IOpportunity } from '@/providers/opportunities/context';
import { IClient } from '@/providers/clients/context';
import { getAxiosInstance } from '@/lib/api';

export class DataAwareAIService {
  private api = getAxiosInstance();

  private async fetchOpportunities(): Promise<IOpportunity[]> {
    try {
      const response = await this.api.get("/api/opportunities", {
        params: { pageNumber: 1, pageSize: 100, isDeleted: false }
      });
      
      const opportunities = response.data?.items || [];
      return opportunities;
    } catch (error) {
      return [];
    }
  }

  private async fetchClients(): Promise<IClient[]> {
    try {
      const response = await this.api.get("/api/clients", {
        params: { pageNumber: 1, pageSize: 100, isDeleted: false }
      });
      
      const clients = response.data?.items || [];
      return clients;
    } catch (error) {
      return [];
    }
  }

  private async fetchDashboardData(): Promise<any> {
    try {
      const response = await this.api.get("/api/dashboard/overview");
      return response.data || {};
    } catch (error) {
      return {};
    }
  }

  private formatOpportunitiesForAI(opportunities: IOpportunity[]): string {
    if (opportunities.length === 0) return "No opportunities found.";
    
    // Show all opportunities, sorted by value
    const sortedOpportunities = opportunities
      .filter(opp => opp.estimatedValue && opp.estimatedValue > 0)
      .sort((a, b) => (b.estimatedValue || 0) - (a.estimatedValue || 0));

    const result = [
      `Total Opportunities: ${opportunities.length}`,
      `All Opportunities (sorted by value):`,
      ...sortedOpportunities.map(opp => 
        `• ${opp.title} (${opp.clientName}) - R${(opp.estimatedValue || 0).toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} - Stage: ${this.getStageName(opp.stage)}${opp.expectedCloseDate ? ` - Closing: ${new Date(opp.expectedCloseDate).toLocaleDateString()}` : ''}`
      )
    ];

    return result.join('\n');
  }

  private formatClientsForAI(clients: IClient[]): string {
    if (clients.length === 0) return "No clients found.";
    
    // Show all active clients, sorted by name
    const activeClients = clients
      .filter(client => client.isActive)
      .sort((a, b) => a.name.localeCompare(b.name));

    const result = [
      `Total Clients: ${clients.length}`,
      `All Active Clients:`,
      ...activeClients.map(client => 
        `• ${client.name} (${client.industry}) - ${client.companySize || 'Unknown size'} - ${client.opportunitiesCount || 0} opportunities`
      )
    ];

    return result.join('\n');
  }

  private getStageName(stage?: number): string {
    const stages = {
      1: 'Lead',
      2: 'Qualified', 
      3: 'Proposal',
      4: 'Negotiation',
      5: 'Closed Won',
      6: 'Closed Lost'
    };
    return stages[stage as keyof typeof stages] || 'Unknown';
  }

  private async getRelevantData(userQuery: string): Promise<string> {
    const query = userQuery.toLowerCase();
    let dataContext = "";

    // Fetch data based on query content
    if (query.includes('opportunity') || query.includes('opportunities') || query.includes('pipeline') || query.includes('deal') || query.includes('negotiation') || query.includes('stage') || query.includes('closing') || query.includes('close') || query.includes('follow-up') || query.includes('followup')) {
      const opportunities = await this.fetchOpportunities();
      dataContext += `\n\nCURRENT OPPORTUNITIES:\n${this.formatOpportunitiesForAI(opportunities)}`;
      
      // Add pipeline analysis
      const pipelineAnalysis = this.analyzePipeline(opportunities);
      dataContext += `\n\nPIPELINE ANALYSIS:\n${pipelineAnalysis}`;
    }

    if (query.includes('client') || query.includes('customer')) {
      const clients = await this.fetchClients();
      dataContext += `\n\nCURRENT CLIENTS:\n${this.formatClientsForAI(clients)}`;
    }

    if (query.includes('dashboard') || query.includes('overview') || query.includes('metrics') || query.includes('win rate')) {
      const dashboardData = await this.fetchDashboardData();
      dataContext += `\n\nDASHBOARD OVERVIEW:\n${this.formatDashboardForAI(dashboardData)}`;
      
      // Also fetch opportunities for dashboard context
      const opportunities = await this.fetchOpportunities();
      dataContext += `\n\nCURRENT OPPORTUNITIES:\n${this.formatOpportunitiesForAI(opportunities)}`;
      
      // Add pipeline analysis
      const pipelineAnalysis = this.analyzePipeline(opportunities);
      dataContext += `\n\nPIPELINE ANALYSIS:\n${pipelineAnalysis}`;
    }

    if (query.includes('user') || query.includes('users') || query.includes('organization') || query.includes('org') || query.includes('team') || query.includes('employees')) {
      try {
        const response = await this.api.get("/api/users", {
          params: { pageNumber: 1, pageSize: 100 }
        });
        const users = response.data?.items || [];
        dataContext += `\n\nCURRENT USERS:\nTotal Users: ${users.length}\nAll Users:`;
        users.forEach((user: any, index: number) => {
          dataContext += `\n• ${user.firstName} ${user.lastName} (${user.email}) - Roles: ${user.roles?.join(', ') || 'None'} - Active: ${user.isActive ? 'Yes' : 'No'}`;
        });
      } catch (error) {
        dataContext += `\n\nCURRENT USERS:\nNo users found or error fetching user data.`;
      }
    }

    return dataContext;
  }

  private analyzePipeline(opportunities: IOpportunity[]): string {
    const totalValue = opportunities.reduce((sum, opp) => sum + (opp.estimatedValue || 0), 0);
    const stageCounts = opportunities.reduce((acc, opp) => {
      const stage = this.getStageName(opp.stage);
      acc[stage] = (acc[stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const highValueOpportunities = opportunities.filter(opp => (opp.estimatedValue || 0) > 50000);
    const closingSoon = opportunities.filter(opp => {
      if (!opp.expectedCloseDate) return false;
      const closeDate = new Date(opp.expectedCloseDate);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return closeDate <= thirtyDaysFromNow;
    });

    return `• Total Pipeline Value: R${totalValue.toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
• Total Opportunities: ${opportunities.length}
• High Value Opportunities (>R50,000): ${highValueOpportunities.length}
• Closing in 30 days: ${closingSoon.length}
• By Stage: ${Object.entries(stageCounts).map(([stage, count]) => `${stage} (${count})`).join(', ')}`;
  }

  private formatDashboardForAI(data: any): string {
    return `• Total Clients: ${data.totalClients || 'N/A'}
• Active Opportunities: ${data.activeOpportunities || 'N/A'}
• Win Rate: ${data.winRate ? `${(data.winRate * 100).toFixed(1)}%` : 'N/A'}
• Pipeline Value: ${data.pipelineValue ? `R${data.pipelineValue.toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : 'N/A'}
• Upcoming Activities: ${data.upcomingActivities || 'N/A'}`;
  }

  async chatWithRealData(userMessage: string): Promise<string> {
    try {
      // Get relevant data based on the user's query
      const realData = await this.getRelevantData(userMessage);
      
      // Create enhanced prompt with real data
      console.log('=== AI DEBUG: Real data being sent to AI ===');
      console.log(realData);
      console.log('=== END DEBUG DATA ===');
      
      const enhancedPrompt = `You are a helpful AI assistant for Selling Point CRM system.

IMPORTANT: All monetary values are in **South African Rands (R)**, not dollars. Use "R" prefix for all currency amounts.

REAL DATA PROVIDED:
${realData}

CRITICAL INSTRUCTIONS - READ CAREFULLY:
1. You MUST use ONLY the real data shown in the "REAL DATA PROVIDED" section above
2. DO NOT ignore real data - it contains your actual answers
3. DO NOT say "no data available" when real data is clearly provided
4. DO NOT make up generic responses - use specific numbers from real data
5. The PIPELINE ANALYSIS section contains calculated metrics like win rate and stage counts
6. Use the exact numbers and values shown in the real data above
7. NEVER make up opportunity names, values, or client names - use ONLY what's in CURRENT OPPORTUNITIES
8. NEVER create fake examples like "Opportunity 1: R125,000, Client: ABC Company" - use the ACTUAL opportunity names from your data
9. If user asks about high-value opportunities, filter the REAL opportunities in CURRENT OPPORTUNITIES that have estimatedValue > 50000 and list those exact opportunities with their real names and values

User Question: "${userMessage}"

ANSWER USING ONLY THE REAL DATA ABOVE:
- Look at the PIPELINE ANALYSIS section for calculated metrics
- Use the opportunity values and stages shown in CURRENT OPPORTUNITIES
- Calculate from the real numbers provided, not from assumptions
- If the data shows "Closed Won: 19" then say "19", not "0"
- If the data shows "Negotiation: 5" then use that, not "no opportunities"

RESPONSE GUIDELINES:
- BE CONCISE - Give direct answers, not step-by-step calculations
- BE BRIEF - Maximum 2-3 sentences when possible
- USE REAL DATA - Reference specific numbers from the data provided
- NO MATH LESSONS - Don't explain how to calculate, just give the answer
- BE ACCURATE - "Follow-up" means opportunities NOT in Closed Won/Closed Lost stages
- BE SPECIFIC - Look at actual stages, don't assume all opportunities need follow-up

FOLLOW-UP DEFINITION:
- Opportunities that need follow-up are those in stages: Lead, Qualified, Proposal, Negotiation
- Closed Won and Closed Lost opportunities do NOT need follow-up
- Look at the "Stage" field for each opportunity in CURRENT OPPORTUNITIES

CLOSING SOON DEFINITION:
- "Closing soon" means opportunities with expectedCloseDate within 30 days
- Look at the PIPELINE ANALYSIS section for "Closing in 30 days: X" count
- Use the actual number from PIPELINE ANALYSIS, don't calculate manually

ANSWER THE ACTUAL QUESTION:
- If user asks "closing soon" → use "Closing in 30 days" count from PIPELINE ANALYSIS
- If user asks "follow-up" → count active stages (Lead, Qualified, Proposal, Negotiation)
- If user asks "name the opportunities" → LIST the actual opportunity names from CURRENT OPPORTUNITIES that match the criteria
- Read the question carefully and answer exactly what was asked
- If user wants names, provide the list - don't just give counts

Answer based ONLY on the real data provided above: "${userMessage}"`;

      // Get AI response with enhanced context
      const response = await groqService.chat([
        { role: "user", content: enhancedPrompt }
      ]);

      return response;
    } catch (error) {
      console.error('Data-aware AI service error:', error);
      // Fallback to regular service if data fetch fails
      return groqService.chat([{ role: "user", content: userMessage }]);
    }
  }
}

export const dataAwareAIService = new DataAwareAIService();
