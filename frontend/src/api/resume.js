import client from './client';

export const analyzeResume = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await client.post("/resume/analyze", formData, {
        // Remove the shared JSON content type so Axios/browser can set the multipart boundary.
        headers: { 'Content-Type': undefined },
    });
    return response.data;
};
