const { Groq } = require('groq-sdk');

class GroqService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    if (this.apiKey) {
      this.client = new Groq({ apiKey: this.apiKey });
    } else {
      console.warn('[GroqService] GROQ_API_KEY not found in environment. AI insight generation will be limited.');
    }
  }

  /**
   * Generate data-grounded HR Retention Analysis from employee data & ML prediction
   */
  async generateAnalysis(employeeData, predictionResult) {
    if (!this.client) {
      throw new Error('GROQ_API_KEY is not configured in backend environment.');
    }

    const riskDrivers = predictionResult.topRiskDrivers || predictionResult.Top_Risk_Drivers || [];
    const protectiveFactors = predictionResult.topProtectiveFactors || predictionResult.Top_Protective_Factors || [];

    const prompt = `
You are an expert AI HR Decision Support Assistant for an Employee Attrition & Analytics platform.

Analyze the employee information, the machine learning prediction, and the quantitative model explainability drivers below.

IMPORTANT COMPLIANCE & ETHICAL GUIDELINES:
- Do not change or question the ML prediction.
- Use the ML prediction and feature importance drivers as evidence-based decision-support information.
- Specifically address the top quantitative risk factors identified by the ML model in your recommendations.
- Frame all insights as recommendations for HR professionals, not definitive employment decisions.
- Keep the response professional, concise, and structured.

EMPLOYEE PROFILE:
${JSON.stringify(employeeData, null, 2)}

ML PREDICTION RESULT:
- Attrition Prediction: ${predictionResult.prediction || predictionResult.Prediction}
- Probability of Leaving: ${predictionResult.probabilityLeaving || predictionResult.Probability_Leaving}%
- Probability of Staying: ${predictionResult.probabilityStaying || predictionResult.Probability_Staying}%
- Risk Level: ${predictionResult.riskLevel || predictionResult.Risk_Level}
- Baseline Recommendation: ${predictionResult.recommendation || predictionResult.Recommendation}

QUANTITATIVE ATTRITION RISK DRIVERS (FROM ML EXPLAINABILITY):
- Key Factors Increasing Risk: ${JSON.stringify(riskDrivers)}
- Protective Factors Reducing Risk: ${JSON.stringify(protectiveFactors)}

Provide your analysis in the following strict sections:

EMPLOYEE PRIORITY:
State clearly: Low, Medium, or High, followed by a 1-2 sentence executive summary.

KEY RISK FACTORS (DATA-BACKED):
Analyze the top factors that are mathematically and contextually driving this employee's attrition risk.

RECOMMENDED HR ACTIONS:
Provide 3 to 5 practical, prioritized actions HR and leadership can take, directly targeting the identified risk factors.

RETENTION STRATEGY:
Provide a personalized retention and engagement roadmap to mitigate the primary drivers of turnover and foster long-term commitment.
`;

    try {
      const completion = await this.client.chat.completions.create({
        model: 'openai/gpt-oss-20b',
        messages: [
          {
            role: 'system',
            content: 'You are a professional AI HR decision support assistant. Provide practical, ethical, and evidence-based HR guidance.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500
      });

      const rawResponse = completion.choices[0]?.message?.content || '';

      // Parse structured sections
      const parsed = this.parseSections(rawResponse, predictionResult);

      return {
        ...parsed,
        rawResponse,
        model: 'openai/gpt-oss-20b',
        disclaimer: 'AI-generated insights are decision-support tools and should be reviewed by qualified HR professionals. They should not be used as the sole basis for employment decisions.'
      };
    } catch (error) {
      console.error('[GroqService Error]', error);
      throw new Error(`Groq AI request failed: ${error.message}`);
    }
  }

  /**
   * Parse markdown text into structured fields
   */
  parseSections(text, predictionResult) {
    let priority = 'Medium';
    if (predictionResult.riskLevel) {
      priority = predictionResult.riskLevel;
    } else if (text.toLowerCase().includes('priority: high') || text.toLowerCase().includes('priority\nhigh') || text.toLowerCase().includes('**employee priority:**\nhigh') || text.toLowerCase().includes('priority**\nhigh')) {
      priority = 'High';
    } else if (text.toLowerCase().includes('priority: low') || text.toLowerCase().includes('priority\nlow')) {
      priority = 'Low';
    }

    const extractSection = (heading, nextHeadings) => {
      const pattern = new RegExp(`${heading}[:\\s*]*\\n([\\s\\S]*?)(?=(?:${nextHeadings.join('|')})|$)`, 'i');
      const match = text.match(pattern);
      return match ? match[1].trim() : '';
    };

    const summary = extractSection('EMPLOYEE PRIORITY', ['KEY RISK FACTORS', 'RECOMMENDED HR ACTIONS', 'RETENTION STRATEGY']) ||
      `Employee evaluated with ${predictionResult.probabilityLeaving || predictionResult.Probability_Leaving}% attrition probability.`;

    const keyRiskFactors = extractSection('KEY RISK FACTORS', ['RECOMMENDED HR ACTIONS', 'RETENTION STRATEGY']) || '';
    const recommendedActions = extractSection('RECOMMENDED HR ACTIONS', ['RETENTION STRATEGY']) || '';
    const retentionStrategy = extractSection('RETENTION STRATEGY', ['DISCLAIMER', '$']) || '';

    return {
      priority,
      summary,
      keyRiskFactors,
      recommendedActions,
      retentionStrategy
    };
  }
}

module.exports = new GroqService();
