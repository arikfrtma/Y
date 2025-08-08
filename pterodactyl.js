import axios from 'axios';

const PTERODACTYL_URL = process.env.PTERODACTYL_URL;
const API_KEY = process.env.PTERODACTYL_API_KEY;

export const createServer = async (data) => {
  try {
    // Untuk demo, kita buat request sederhana
    // Di implementasi real, sesuaikan dengan API Pterodactyl yang sebenarnya
    const response = await axios.post(`${PTERODACTYL_URL}/api/application/servers`, {
      name: data.name,
      user: data.userId,
      egg: 1, // ID egg/default
      docker_image: 'ghcr.io/pterodactyl/yolks:java_17',
      startup: 'java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}',
      environment: {
        SERVER_JARFILE: 'server.jar',
        SERVER_MEMORY: data.memory.toString(),
        EULA: 'TRUE'
      },
      limits: {
        memory: data.memory,
        swap: 0,
        disk: 10240, // 10GB disk
        io: 500,
        cpu: 100
      },
      feature_limits: {
        databases: data.isAdmin ? 10 : 1,
        backups: data.isAdmin ? 10 : 1,
        allocations: data.isAdmin ? 5 : 1
      },
      allocation: {
        default: 1 // ID allocation
      }
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error creating server:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.errors?.[0]?.detail || 'Failed to create server'
    };
  }
};