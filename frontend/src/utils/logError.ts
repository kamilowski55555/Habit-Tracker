const logError = (action: string, error: any, extraInfo?: string) => {
    const status = error?.response?.status || 'Unknown';
    const message = error?.response?.data || error.message || 'No additional error details';
    console.error(`[Service Error] ${action} failed.`, {
        status,
        message,
        extraInfo,
        fullError: error,
    });
};

export default logError;