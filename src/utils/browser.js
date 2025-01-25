/**
* Detects if the current device is a mobile device
* @returns {boolean} True if mobile device, false otherwise
*/
export const isMobile = () => {
return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
)
}

/**
* Gets detailed information about the user's browser
* @returns {{
*   name: string,
*   version: string,
*   isMobile: boolean,
*   userAgent: string,
*   platform: string,
*   language: string
* }} Browser information object
*/
export const getBrowserInfo = () => {
try {
    const userAgent = navigator.userAgent
    let browserName = 'Unknown'
    let browserVersion = 'Unknown'

    if (userAgent.match(/chrome|chromium|crios/i)) {
    browserName = 'Chrome'
    } else if (userAgent.match(/firefox|fxios/i)) {
    browserName = 'Firefox'
    } else if (userAgent.match(/safari/i)) {
    browserName = 'Safari'
    } else if (userAgent.match(/opr\//i)) {
    browserName = 'Opera'
    } else if (userAgent.match(/edg/i)) {
    browserName = 'Edge'
    }

const version = userAgent.match(/(version|chrome|firefox|safari|opr|edge|msie)\/?\s*(\d+)/i)
if (version) {
    browserVersion = version[2]
}

return {
    name: browserName,
    version: browserVersion,
    isMobile: isMobile(),
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language
}
}

/**
* Checks if MetaMask is installed in the browser
* @returns {boolean} True if MetaMask is installed, false otherwise
*/
export const isMetaMaskInstalled = () => {
try {
    return typeof window !== 'undefined' && 
    typeof window.ethereum !== 'undefined' && 
    window.ethereum.isMetaMask
} catch (err) {
    console.error('Error checking MetaMask installation:', err)
    return false
}
}

/**
* Checks if WalletConnect is supported in the current environment
* @returns {boolean} True if WalletConnect is supported, false otherwise
*/
export const isWalletConnectSupported = () => {
try {
    return !isMobile() || (isMobile() && !isMetaMaskInstalled())
} catch (err) {
    console.error('Error checking WalletConnect support:', err)
    return false
}
}

/**
* Opens a URL in a new tab with security best practices
* @param {string} url - The URL to open
* @returns {void}
*/
export const openInNewTab = (url) => {
try {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
} catch (err) {
    console.error('Error opening new tab:', err)
}
}

/**
* Copies text to the clipboard
* @param {string} text - The text to copy
* @returns {Promise<boolean>} True if copy succeeded, false otherwise
*/
export const copyToClipboard = async (text) => {
try {
    await navigator.clipboard.writeText(text)
    return true
} catch (err) {
    console.error('Error copying to clipboard:', err)
    return false
}
}

