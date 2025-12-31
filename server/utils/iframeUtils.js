export const extractSrcFromIframe = (iframe) => {
    if (!iframe) return '';
    const match = iframe.match(/src="([^"]+)"/);
    return match ? match[1] : iframe;
};