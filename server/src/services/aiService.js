const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const getAIResponse = async (message, order) => {
    try {
        let orderInfo = 'No order information available.';

        if (order) {
            orderInfo = `
Order ID: ${order.orderId}
Status: ${order.status}
Total Amount: ${order.totalAmount}
Estimated Delivery: ${order.estimatedDelivery || 'Not available'}
Items: ${order.items
                    .map(item => `${item.name} x${item.quantity}`)
                    .join(', ')}
`;
        }

        const prompt = `
You are an AI customer support assistant.

Help the customer with their query.

Order information:
${orderInfo}

Customer message:
${message}

Rules:
- Be friendly and concise.
- Use the order information when answering order-related questions.
- Do not invent order information.
- If the required information is unavailable, clearly say so.
`;

        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: prompt
        });

        return response.text;

    } catch (error) {
        console.error('Gemini API error:', error.message);
        throw new Error('AI service unavailable');
    }
};

module.exports = {
    getAIResponse
};