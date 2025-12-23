

import { GoogleGenAI, Type, Schema, Chat } from "@google/genai";
import { ValuationRequest, ValuationResponse, InvestmentProfile, InvestmentOpportunity } from '../types';

// Check if API key is available
const apiKey = process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const model = 'gemini-2.5-flash';

// Singleton chat session for the application lifecycle
let chatSession: Chat | null = null;
let chatLanguage = 'en';

export const getAIValuation = async (request: ValuationRequest, lang: 'en' | 'ar' = 'en'): Promise<ValuationResponse> => {
  if (!ai) {
    // Fallback mock response
    console.warn("No API_KEY found. Using mock data.");
    return new Promise((resolve) => {
      setTimeout(() => {
        const isAr = lang === 'ar';
        resolve({
          estimatedPrice: {
            min: request.area * 4500,
            max: request.area * 5200,
            confidence: 85
          },
          pricePerMeter: 4850,
          marketAnalysis: isAr 
            ? `بناءً على الاتجاهات الحالية في ${request.district}، ${request.city}، يتزايد الطلب على العقارات من نوع ${request.type}. من المتوقع أن تعزز مشاريع البنية التحتية القريبة القيمة بنسبة 12% خلال العام المقبل.`
            : `Based on current trends in ${request.district}, ${request.city}, the demand for ${request.type} properties is rising. Infrastructure projects nearby are expected to boost value by 12% over the next year.`,
          riskLevel: 'Low',
          comparables: isAr
            ? [`عقار مشابه من نوع ${request.type} في الملقا بيع بسعر ${(request.area * 4800).toLocaleString()} ر.س`, `عرض جديد في مربع قريب بسعر ${(request.area * 5100).toLocaleString()} ر.س`]
            : [`Similar ${request.type} in Al Malqa sold for ${(request.area * 4800).toLocaleString()} SAR`, `New listing in nearby block at ${(request.area * 5100).toLocaleString()} SAR`],
          locationScore: 8.5,
          futureGrowth: 12.4,
          propertyRating: {
            location: 85,
            services: 78,
            price: 92,
            future: 88
          }
        });
      }, 2000);
    });
  }
  
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      estimatedPrice: {
        type: Type.OBJECT,
        properties: {
          min: { type: Type.NUMBER, description: "Minimum estimated price in SAR" },
          max: { type: Type.NUMBER, description: "Maximum estimated price in SAR" },
          confidence: { type: Type.NUMBER, description: "Confidence score from 0 to 100" },
        },
        required: ["min", "max", "confidence"]
      },
      pricePerMeter: { type: Type.NUMBER, description: "Average price per square meter in SAR" },
      marketAnalysis: { type: Type.STRING, description: "A comprehensive 3-4 sentence analysis of the market conditions, neighborhood trends, and valuation rationale." },
      riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"], description: "Investment risk level." },
      comparables: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "List of 3 comparable recent sales or listings."
      },
      locationScore: { type: Type.NUMBER, description: "Score from 0 to 10 based on proximity to amenities, roads, and future projects." },
      futureGrowth: { type: Type.NUMBER, description: "Projected percentage growth in value over the next 12 months." },
      propertyRating: {
        type: Type.OBJECT,
        description: "Scores from 0 to 100 for specific aspects",
        properties: {
          location: { type: Type.NUMBER },
          services: { type: Type.NUMBER },
          price: { type: Type.NUMBER },
          future: { type: Type.NUMBER }
        },
        required: ["location", "services", "price", "future"]
      }
    },
    required: ["estimatedPrice", "pricePerMeter", "marketAnalysis", "riskLevel", "comparables", "locationScore", "futureGrowth", "propertyRating"]
  };

  const prompt = `
    Act as a certified expert real estate appraiser in Saudi Arabia.
    Perform a detailed valuation for the following property:
    - City: ${request.city}
    - District: ${request.district}
    - Area: ${request.area} sqm
    - Type: ${request.type}
    - Bedrooms: ${request.bedrooms}
    - Property Age: ${request.age} years
    - Street Width: ${request.streetWidth || 'Standard'}
    - Facade Direction: ${request.direction || 'Unspecified'}
    - Finishing Quality: ${request.finishing || 'Standard'}

    Consider:
    1. The specific value impact of the street width and facade direction (e.g., North facing is often preferred).
    2. Current Saudi market trends (Vision 2030, major infrastructure projects like Metro, Qiddiya, etc.).
    3. Comparables in the specific district.
    
    Provide a realistic valuation range in SAR.

    IMPORTANT: Respond in the following language: ${lang === 'ar' ? 'Arabic' : 'English'}.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.4, 
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as ValuationResponse;
  } catch (error) {
    console.error("AI Valuation failed:", error);
    throw error;
  }
};

export const getAIInvestmentMatches = async (profile: InvestmentProfile, lang: 'en' | 'ar' = 'en'): Promise<InvestmentOpportunity[]> => {
  if (!ai) {
    // Fallback mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const isAr = lang === 'ar';
        resolve([
          {
            id: '1',
            title: isAr ? 'شقة فاخرة تحت الإنشاء' : 'Off-plan Luxury Apartment',
            location: isAr ? 'النرجس، الرياض' : 'Al Narjis, Riyadh',
            type: isAr ? 'سكني' : 'Residential',
            price: profile.budget * 0.8,
            expectedROI: 15.5,
            matchScore: 94,
            reason: isAr ? "يطابق هدفك في زيادة رأس المال. يقع بالقرب من محطة مترو قادمة." : "Matches your high appreciation goal. Located near upcoming metro station.",
            riskFactors: isAr ? ["مخاطر تأخير البناء", "تشبع السوق في شمال الرياض"] : ["Construction delay risk", "Market saturation in North Riyadh"]
          },
          {
            id: '2',
            title: isAr ? 'وحدة تجارية في مجمع' : 'Commercial Strip Mall Unit',
            location: isAr ? 'طريق الملك عبدالعزيز، جدة' : 'King Abdulaziz Rd, Jeddah',
            type: isAr ? 'تجاري' : 'Commercial',
            price: profile.budget * 0.95,
            expectedROI: 8.2,
            matchScore: 88,
            reason: isAr ? "إمكانات تأجير ممتازة تتماشى مع تفضيلاتك." : "Excellent rental income potential aligned with your preferences.",
            riskFactors: isAr ? ["دوران المستأجرين", "تخاليف الصيانة"] : ["Tenant turnover", "Maintenance costs"]
          }
        ]);
      }, 2500);
    });
  }

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        title: { type: Type.STRING },
        location: { type: Type.STRING },
        type: { type: Type.STRING },
        price: { type: Type.NUMBER },
        expectedROI: { type: Type.NUMBER, description: "Expected annual ROI percentage" },
        matchScore: { type: Type.NUMBER, description: "Match score 0-100" },
        reason: { type: Type.STRING, description: "Why this matches the user profile" },
        riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["id", "title", "location", "type", "price", "expectedROI", "matchScore", "reason", "riskFactors"]
    }
  };

  const prompt = `
    Act as a real estate investment advisor for the Saudi Arabia market.
    Generate 3 specific, realistic investment opportunities based on this investor profile:
    - Budget: ${profile.budget} SAR
    - Preferred Cities: ${profile.cities.join(', ')}
    - Strategy: ${profile.goal}
    - Risk Tolerance: ${profile.riskTolerance}
    - Property Types: ${profile.propertyTypes.join(', ')}

    The opportunities should be representative of actual market conditions in Saudi Arabia (Riyadh, Jeddah, Dammam, etc.).
    Ensure the price is within or close to the budget.
    Generate a unique ID for each.

    IMPORTANT: Respond in the following language: ${lang === 'ar' ? 'Arabic' : 'English'}.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7, 
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as InvestmentOpportunity[];
  } catch (error) {
    console.error("AI Matching failed:", error);
    throw error;
  }
};

export const getChatResponse = async (message: string, lang: 'en' | 'ar' = 'en'): Promise<string> => {
  if (!ai) {
    // Fallback mock response
    return new Promise((resolve) => {
      setTimeout(() => {
        if (lang === 'ar') {
          resolve(`أنا أعمل في الوضع التجريبي (بدون مفتاح API). في سيناريو حقيقي، سأقوم بتحليل السوق السعودي للإجابة على: "${message}". يمكنني مساعدتك في تقييم العقارات، واتجاهات السوق في الرياض، أو العثور على فرص استثمارية.`);
        } else {
          resolve(`I am running in demo mode (no API Key). In a real scenario, I would analyze the Saudi market to answer: "${message}". I can help you with property valuations, market trends in Riyadh, or finding investment opportunities.`);
        }
      }, 1000);
    });
  }

  // Reset chat if language changes significantly, or just append instruction
  if (!chatSession || chatLanguage !== lang) {
    chatLanguage = lang;
    chatSession = ai.chats.create({
      model: model,
      config: {
        systemInstruction: `You are Nawafiz AI, an intelligent real estate consultant for the Saudi Arabian market. 
        Assist investors and home buyers. 
        Answer questions about property prices, market trends (Riyadh, Jeddah, Dammam), investment strategies, and Saudi Vision 2030's impact.
        Always use Saudi Riyals (SAR).
        
        CRITICAL: You must ALWAYS reply in the following language: ${lang === 'ar' ? 'Arabic' : 'English'}.`
      }
    });
  }

  try {
    const result = await chatSession.sendMessage({ message });
    if (!result.text) throw new Error("Empty response");
    return result.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return lang === 'ar' 
      ? "أواجه حالياً ضغطاً كبيراً. يرجى محاولة طرح سؤالك مرة أخرى بعد قليل."
      : "I'm currently experiencing high traffic. Please try asking your question again in a moment.";
  }
};