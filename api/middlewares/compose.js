export function applyMiddleware(handler, ...middlewares) {
    return middlewares.reduce((acc, middleware) => middleware(acc), handler);
  }
  
  export default applyMiddleware(handler, withAuth, withAnotherMiddleware);
  