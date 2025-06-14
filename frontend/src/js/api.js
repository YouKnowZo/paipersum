// This file contains backend code and should not be in the frontend. Please move this file to the backend/routes directory if needed, or delete it from the frontend.
// If you need frontend API utilities, implement them using fetch or axios for browser use.
// Implements the missing scrapeAndAnalyze function for frontend use
export async function scrapeAndAnalyze(url) {
    try {
        const response = await fetch('/api/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });
        if (!response.ok) {
            throw new Error('Failed to analyze URL');
        }
        return await response.json();
    } catch (error) {
        throw new Error(error.message || 'Unknown error');
    }
}