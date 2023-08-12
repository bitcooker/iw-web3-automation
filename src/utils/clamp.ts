export const clamp = (test: string): string => {
    return `${test.slice(0, 5)}...${test.slice(-5)}`;
}