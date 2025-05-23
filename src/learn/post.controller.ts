import { Controller, Get } from "@nestjs/common";

@Controller('/api/v1/posts')
class postController{

    @Get()
    getPost(){
        return {
            success:true,
            message:"Posts"
        }
    }
}

export default postController;