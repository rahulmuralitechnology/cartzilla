import axios from 'axios';
import { logger } from '../utils/logger';

interface Service {
  url: string;
  status: 'UP' | 'DOWN';
  lastChecked: Date;
}

const serviceCache: Record<string, Service> = {};

export function registerService(name: string, url: string): Service {
  const service: Service = {
    url,
    status: 'UP', // Explicitly type as 'UP'
    lastChecked: new Date()
  };
  
  serviceCache[name] = service;
  
  // Start health checks
  setInterval(() => checkServiceHealth(name, url), 30000);
  
  return service;
}

async function checkServiceHealth(name: string, url: string) {
  try {
    await axios.get(`${url}/health`);
    serviceCache[name].status = 'UP'; // Explicitly set to 'UP'
    serviceCache[name].lastChecked = new Date();
  } catch (err: any) {
    serviceCache[name].status = 'DOWN'; // Explicitly set to 'DOWN'
    serviceCache[name].lastChecked = new Date();
    logger.error(`Service ${name} at ${url} is down: ${err.message}`);
  }
}

export function getService(name: string): Service | undefined {
  return serviceCache[name];
}