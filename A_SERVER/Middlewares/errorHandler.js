//   const errorHandler = (err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send({ error: 'Something went wrong!' });
//   }
  
//   export default errorHandler 



const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  };
  
  export default errorHandler 