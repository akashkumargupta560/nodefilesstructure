//not Found 
const notFound =(req,resp,next) =>{
    const errors =new Error(`Not Found : ${req.originalUrl}`);
    resp.status(404);
    next(errors);
};
//Error Handler
const errorHandler = (err,req,resp,next) => {
    const statusCodes = resp.statusCode == 200 ? 500 :resp.statusCode;
    resp.status(statusCodes);
    resp.json({
        message:err?.message,
        stack:err?.stack
    });
};

module.exports ={errorHandler,notFound};