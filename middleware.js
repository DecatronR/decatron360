export default function middleware(req) {
    return new Response('Middleware');
  }
  
  export const config = {
    matcher: ['/properties/add', '/profile', '/properties/saved', '/messages'],
  };