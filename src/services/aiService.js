const buildAiMessages = (messages, systemPrompt) => {
    const formattedMessages = [
        {
            role: 'system',
            content: systemPrompt,
        },
    ];

    for (const message of messages) {
        let role = 'user';

        if (message.senderType === 'ai') {
            role = 'assistant';
        }

        formattedMessages.push({
            role,
            content: message.text,
        });
    }

    return formattedMessages;
};

const generateAiReply = async ({ messages, systemPrompt }) => {
    const formattedMessages = buildAiMessages(messages, systemPrompt);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: formattedMessages
        })
    });

    if (!response.ok) {
        console.log(await response.text());
        throw new Error('AI request failed');
    };
    const data = await response.json();
    return {
        reply: data.choices[0].message.content,
    };
};

module.exports = {
    buildAiMessages,
    generateAiReply,
};