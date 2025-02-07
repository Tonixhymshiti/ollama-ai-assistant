type PostGenerateParams = {
    model: string;
    prompt: string;
    context?: string;
}

const OLLAMA_BASE_URL = 'http://localhost:11434'

export const postGenerateCompletion = async (parameters: PostGenerateParams) => {
    return fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(parameters)
    }).then((response) => { 
        if (response.status > 300)
            { 
                throw Error("Api error")
            }
        return response; 
        }
        
    ).then((response) => consumeStream(response));
}

export const consumeStream = async (response: Response): Promise<string> => {
    const reader = response.body?.getReader()

    if (!reader) {
        throw Error("Could not access reader");
    }

    let text = "";

    while(true) {
        const { done, value } = await reader.read();

        if (done) {
            break;   
        }

        const decodedValue = new TextDecoder().decode(value);
        const parsed = JSON.parse(decodedValue);

        text = text + parsed.response;
    }
    return text;
}