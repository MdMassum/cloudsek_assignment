import { Body, Controller, Get, Header, Headers, HttpCode, HttpStatus, Param, Post, Put, Query, Redirect, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { url } from "inspector";

@Controller("/api/v1/users")
class UserController{

    @Get('/profile')
    getProfile(){
        return {
            success:true,
            message:"djfl dfklj"
        }
    }
    @Post('/profile')
    @HttpCode(200)// what response code we want to send
    @HttpCode(HttpStatus.OK)// another approach to send status code or we can use response below parameter
    @Header('Cache-control','none') // for setting header in response
    @Redirect('/login') // this will redirect into login page (i dont think we will use much instead use dynamic route below)
    CreateProfile(@Req() req:Request, @Res({passthrough:true}) res:Response, @Body() requestData:Record<string,any>){
        console.log(req.params)
        console.log(req.body) 
        console.log(requestData) // either get this way or req.body

        // since we have added response in paramater this return will not send response now we need to send res like express
        // return {
        //     success:true,
        //     message:"djfl dfklj"
        // }

        // res.status(200).json({   // usually we dont use res and let nestjs handle response so dont add res in parameter 
        //     success:true,
        //     message:"djfl dfklj"
        // })

        // or we can do passthrough in res parameter to just handle status and let nest handle response so we can use return
        res.status(200);
        return{
            success:true,
            message:"dlkfj"
        }

        const val = 1;
        if(val ==1){ return {url:'/users/profile',statusCode:302}} // dynamic redirect
        else{
            return {
                url:"/login",
                statusCode:302
            }
        }

    }
    @Put('/profile/:id')
    UpdateProfile(@Param() params:any, @Query() query:any, @Headers() headers:any){ // extract params, query & header
        console.log(params)
        console.log(query);
        console.log(headers)
        return {
            success:true,
            message:"djfl dfklj"
        }
    }
}

export default UserController