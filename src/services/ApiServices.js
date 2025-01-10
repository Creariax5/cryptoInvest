// apiServices.js
const API_BASE_URL = 'https://crypto-api-xi.vercel.app/api/v1/crypto';

export const fetchPoolInfo = async (poolAddress) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pool/${poolAddress}`);
    if (!response.ok) {
      throw new Error('Failed to fetch pool info');
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching pool info: ${error.message}`);
  }
};

export const fetchPoolAnalytics = async (poolAddress, days = 30) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pool/${poolAddress}/analytics?days=${days}`);
    if (!response.ok) {
      throw new Error('Failed to fetch pool analytics');
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching pool analytics: ${error.message}`);
  }
};

export const fetchPoolTicks = async (poolAddress) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pool/${poolAddress}/ticks`);
    if (!response.ok) {
      throw new Error('Failed to fetch pool ticks');
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching pool ticks: ${error.message}`);
  }
};