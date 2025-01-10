export const calculateImpermanentLoss = (initialPrice, currentPrice, rangeMin, rangeMax) => {
    if (!initialPrice || !currentPrice || initialPrice <= 0 || currentPrice <= 0) {
        return 0;
    }
    
    // Bound prices to range
    const effectiveCurrentPrice = Math.min(Math.max(currentPrice, rangeMin), rangeMax);
    const effectiveInitialPrice = Math.min(Math.max(initialPrice, rangeMin), rangeMax);
    
    const priceRatio = effectiveCurrentPrice / effectiveInitialPrice;
    const sqrtRatio = Math.sqrt(priceRatio);
    
    // Calculate IL within range
    const ilInRange = -100 * (2 * sqrtRatio / (1 + priceRatio) - 1);
    
    // Add out-of-range impact
    let totalIL = ilInRange;
    if (currentPrice < rangeMin) {
        totalIL += -100 * (1 - rangeMin/currentPrice);
    } else if (currentPrice > rangeMax) {
        totalIL += -100 * (1 - currentPrice/rangeMax);
    }
    
    return totalIL;
};
  
export const calculateFeeAPR = (volume24h = 0, tvl = 0, fee = 0) => {
    if (!volume24h || !tvl || !fee) return 0;
    return (volume24h * fee * 365) / tvl;
};

export const calculateFeeLast24 = (volume24h = 0, tvl = 0, fee = 0) => {
    if (!volume24h || !tvl || !fee) return 0;
    return (volume24h * fee) / tvl;
};
