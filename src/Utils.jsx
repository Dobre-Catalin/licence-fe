// Queue Utility Functions
export const queueRequest = (url, method, body) => {
    const queuedRequests = JSON.parse(localStorage.getItem('queuedRequests') || '[]');
    queuedRequests.push({ url, method, body });
    localStorage.setItem('queuedRequests', JSON.stringify(queuedRequests));
};

export const popQueueRequest = () => {
    const queuedRequests = JSON.parse(localStorage.getItem('queuedRequests') || '[]');
    if (queuedRequests.length === 0) {
        return null;
    }
    const poppedRequest = queuedRequests.shift();
    localStorage.setItem('queuedRequests', JSON.stringify(queuedRequests));
    return poppedRequest;
};