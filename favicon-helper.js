// favicon-helper.js - 网站图标辅助函数（独立文件，避免 inline JS 转义问题）
function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function getWebIconHtml(w, type) {
    const icon = w.icon || (type === 'app' ? '🖥️' : type === 'dir' ? '📁' : '🌐');
    if (type !== 'url') return escapeHtml(icon);
    try {
        const domain = new URL(w.url).hostname;
        const escapedIcon = escapeHtml(icon);
        return `<img class="web-favicon" src="https://www.google.com/s2/favicons?domain=${domain}&sz=64" onerror="this.style.display=\'none\';var s=this.nextElementSibling;if(s)s.style.display=\'inline\'"><span class="web-icon-fallback" style="display:none;font-size:1.1rem">${escapedIcon}</span>`;
    } catch(e) {
        return escapeHtml(icon);
    }
}