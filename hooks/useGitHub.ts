import { useState } from 'react';

const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = 'mvalencia464';
const REPO_NAME = 'testphotography';
const BRANCH = 'main';

interface CommitResponse {
    success: boolean;
    message: string;
    commitSha?: string;
}

export const useGitHub = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const token = import.meta.env.VITE_GITHUB_TOKEN;

    if (!token) {
        console.warn("GitHub token missing from .env.local");
    }

    const saveFile = async (filePath: string, content: any, commitMessage: string): Promise<CommitResponse> => {
        setLoading(true);
        setError(null);

        try {
            const contentString = JSON.stringify(content, null, 2);
            const encodedContent = btoa(unescape(encodeURIComponent(contentString)));

            // Step 1: Get the current file SHA (required for updating)
            const getFileResponse = await fetch(
                `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}?ref=${BRANCH}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/vnd.github.v3+json',
                    },
                }
            );

            let currentSha: string | undefined;
            if (getFileResponse.ok) {
                const fileData = await getFileResponse.json();
                currentSha = fileData.sha;
            }

            // Step 2: Commit the updated file
            const commitPayload = {
                message: commitMessage,
                content: encodedContent,
                branch: BRANCH,
                ...(currentSha && { sha: currentSha }),
            };

            const commitResponse = await fetch(
                `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(commitPayload),
                }
            );

            if (!commitResponse.ok) {
                const errorData = await commitResponse.json();
                throw new Error(errorData.message || 'Failed to commit changes to GitHub');
            }

            const commitData = await commitResponse.json();

            return {
                success: true,
                message: 'Changes saved and deployed successfully!',
                commitSha: commitData.commit.sha,
            };
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to save changes to GitHub';
            setError(errorMessage);
            return {
                success: false,
                message: errorMessage,
            };
        } finally {
            setLoading(false);
        }
    };

    return {
        saveFile,
        loading,
        error,
    };
};
