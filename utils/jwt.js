export const getJwtSecret = ()=>{
  if(process.env.JWT_SECRET && process.env.JWT_SECRET.trim()){
    return process.env.JWT_SECRET;
  }
  console.warn("Warning: JWT_SECRET is not set. Using insecure fallback secret. Set JWT_SECRET in .env for production.");
  return "dev-insecure-secret";
};
