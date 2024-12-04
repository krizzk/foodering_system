import { Request,Response } from "express"; 
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { BASE_URL } from "../global";
import fs from "fs"

const prisma = new PrismaClient({errorFormat: "pretty" })

//GET ALL MENU
export const getAllMenus = async (request:Request, response:Response) =>{
    try {
        const {search} = request.query
        const allMenus = await prisma.menu.findMany({
            where: { name: {contains: search?.toString() || ""}}
        })
        //Output
        return response.json({
            status:true,
            data: allMenus,
            massage: `Menus has retrived`
        }).status(200)
    } catch (error) {
        return response
        .json({
            status:false,
            massage: `There is an error. ${error}`
        })
        .status(400)
    }
}

//CREATE MENU
export const createMenu = async (request: Request, response:Response) =>{
    try {
        const {name, price, category, description} = request.body
        const uuid = uuidv4()

        let filename=""
        if (request.file) filename= request.file?.filename /** get filename of upload file*/

        const newMenu = await prisma.menu.create({
            data:{uuid,name, price: Number(price),category,description,picture: filename}
        })
        //Output
        return response.json({
            status: true,
            data: newMenu,
            massage:`New menu has created`
        }).status(200)
        
    } catch (error) {
        return response.json({
            status: false,
            massage:`There is an error. ${error}`
        })
        .status(400)
    }
}

//UPDATE MENU
export const updateMenu = async (request:Request, response:Response) =>{
    try {
        const {id} = request.params
        const {name,price,category,description} = request.body

        const findMenu = await prisma.menu.findFirst({where: {id: Number(id)}})
        if (!findMenu)return response 
        .status(200)
        .json({ status: false, massage:`id: ${id} is not found`})

        let filename = findMenu.picture 
        if (request.file) {
            /**update filename by new uploaded picture */
            filename = request.file.filename
            /**check the old picture in the folder */
            let path = `${BASE_URL}/../public/menu_picture/${findMenu.picture}`
            let exist = fs.existsSync(path)
            /**delet the old exist picture if reupload new file  */
            if (exist && findMenu.picture !==``) fs.unlinkSync(path)
        }

        const updateMenu = await prisma.menu.update ({
            data:{
                name: name || findMenu.name,
                price: price ? Number(price) : findMenu.price,
                category: category || findMenu.category,
                description: description || findMenu.description,
                picture: filename
            },
            where: {id: Number(id)}
        })
        return response.json({
            status: true,
            data:updateMenu,
            massage: `Menu has been updated`
        }).status(200)

    } catch (error) {
        return response.json({
            status: false,
            massage:`There is an error. ${error}`
        })
        .status(400)
    }
}

//CHANGE PICTURE
export const changePicture = async (request:Request, response:Response)=>{
    try {
        const {id} = request.params
        const findMenu = await prisma.menu.findFirst({where: {id: Number(id)}})
        if (!findMenu)return response 
        .status(200).json({ status: false, massage:`Menu with id ${id} is not found`})

        /** default value  filename of  saved data*/
        let filename = findMenu.picture 
        if (request.file) {
            /**update filename by new uploaded picture */
            filename = request.file.filename
            /**check the old picture in the folder */
            let path = `${BASE_URL}/../public/menu_picture/${findMenu.picture}`
            let exist = fs.existsSync(path)
            /**delet the old exist picture if reupload new file  */
            if (exist && findMenu.picture !==``) fs.unlinkSync(path)
        }

        /**process to update picture  in database */
        const  updatePicture = await prisma.menu.update ({
            data:{picture:filename},
            where: {id: Number(id)}
            })
            return response.json({
                status: true,
                data:updatePicture,
                message:`picture has change`
            }).status(200)

    } catch (error) {
        return response.json({
            status: false,
            massage:`There is an error. ${error}`
            }).status(400)
    }                   
}

//DELETE MENU
export const deleteMenu = async(request:Request, response:Response) =>{
    try {
        const {id} = request.params
        const findMenu = await prisma.menu.findFirst({where: {id: Number(id)}})
        if (!findMenu)return response 
        .status(200).json({ status: false, massage:`Menu with id ${id}  not found`})
    
        /**check the old picture in the folder */
        let path = `${BASE_URL}/../public/menu_picture/${findMenu.picture}`
        let exist = fs.existsSync(path)
        /**delete the old exist picture if reupload new file  */
        if (exist && findMenu.picture !==``) fs.unlinkSync(path)

        /**process to delet menu's data */
        const result = await prisma.menu.delete({
            where:{ id: Number(request.params.id)}
        })
        return response.json({
            status: true,
            data: result,
            massage: `Menu with id ${id} has been Deleted`
        }).status(200)

    } catch (error) {
        return response.json({
        status: false,
        massage:`There is an error. ${error}`
        })
        .status(400)
    }
}