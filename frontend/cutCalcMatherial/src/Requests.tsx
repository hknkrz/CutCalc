const apiUrl = 'http://localhost:8000';


export const calculateNesting = async (input_pipes, output_pipes) => {
    try {
        const response = await fetch(`${apiUrl}/calculate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"input_pipes": input_pipes, "output_pipes": output_pipes}),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
