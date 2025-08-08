import axios from 'axios';

const API_BASE_URL = 'https://orderkuota.com/api/v2';
const API_KEY = process.env.NEXT_PUBLIC_ORDERKUOTA_API_KEY;

export const createOrder = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/order`, data, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error creating order:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create order'
    };
  }
};

export const checkOrderStatus = async (orderId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/order/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    
    return {
      success: true,
      status: response.data.data.status,
      metadata: response.data.data.metadata
    };
  } catch (error) {
    console.error('Error checking order status:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to check order status'
    };
  }
};