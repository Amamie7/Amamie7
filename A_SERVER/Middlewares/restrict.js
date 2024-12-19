// const Restrict = (req, res, next) => {
//     console.log('req.user.role ', req.user.role )
//  if(req.user.role !== 'admin'){
//             const error = new Error('You do not have permision to perform this action', 403)
//             next(error)
//         }
//         next()
//   };
  
//   export default Restrict
  


// const Restrict = (role) => {//wrapper function
//     return (req, res, next) => {
//         if(req.user.role !== role){
//             const error = new Error('You do not have permision to perform this action', 403)
//             next(error)
//         }
//         next()
//     }
// }

// export default Restrict


const Restrict = (...role) => {//wrapper function
    return (req, res, next) => {
        if(!role.includes(req.user.role)){
            const error = new Error('You do not have permision to perform this action', 403)
            next(error)
        }
        next()
    }
}

export default Restrict