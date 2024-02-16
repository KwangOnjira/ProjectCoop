const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, './uploads/medical')
    },
    filename:(req,file,cb)=>{
        const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9)
        cb(null,`MDC_${uniqueSuffix+path.extname(file.originalname)}`)
    }
})

exports.upload = multer({storage:storage})