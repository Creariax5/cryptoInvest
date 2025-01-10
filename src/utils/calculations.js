export const calculateImpermanentLoss = (initialPrice, currentPrice, rangeMin, rangeMax) => {
    if (!initialPrice || !currentPrice || currentPrice < rangeMin || currentPrice > rangeMax) return 0;
    const priceRatio = currentPrice / initialPrice;
    const sqrtRatio = Math.sqrt(priceRatio);
    return -100 * (2 * sqrtRatio / (1 + priceRatio) - 1);
};
  
export const calculateFeeAPR = (volume24h = 0, tvl = 0, fee = 0) => {
    if (!volume24h || !tvl || !fee) return 0;
    return (volume24h * fee * 365) / tvl;
};

export const calculateFeeLast24 = (volume24h = 0, tvl = 0, fee = 0) => {
    if (!volume24h || !tvl || !fee) return 0;
    return (volume24h * fee) / tvl;
};
