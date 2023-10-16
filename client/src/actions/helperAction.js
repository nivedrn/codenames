export const generateRandomAvatar = () => {
    return Math.random().toString(36).substring(2,17)+Date.now();
}
