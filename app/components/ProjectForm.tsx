"use client";

import { ProjectInterface, SessionInterface } from "@/common.types";
import Image from "next/image";
import FormField from "@/app/components/FormField";
import { categoryFilters } from "../constants/index";
import CustomMenu from "./CustomMenu";
import { useState } from "react";
import Button from "./Button";
import { createNewProject, updateProject } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { fetchToken } from "@/lib/actions";

type Props = {
    type: string;
    session: SessionInterface;
    project?:ProjectInterface;
};

const ProjectForm = ({ type, session,project}: Props) => {
    const router=useRouter();
    const [isSubmitting,setIsSubmitting]=useState(false)
    const [form,setform]=useState({
        title:project?.title || "",
        description:project?.description || "",
        image:project?.image || "",
        liveSiteUrl:project?.liveSiteUrl || "",
        githubUrl:project?.githubUrl || "",
        category:project?.category || "",
    })


    const handleFormSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // console.log(form);

        const token=await fetchToken();
        try{
            if(type==='create'){
               const newData=await createNewProject(form,session?.user?.id,token);
               console.log("NEW DATA",newData);
                router.push('/');
            }

            if(type==='edit'){
                await updateProject(form,token,project?.id as string);
                router.push('/');
            }
        }
        catch(error){

            console.log("Entering the form submit catch block:",error);
        }
        finally{
            setIsSubmitting(false);
        }
     };

    const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {e.preventDefault() 
        const file=e.target.files?.[0]

        if(!file)
        return;

        if(!file.type.includes('image')){
            return alert("Please upload an image file");
        }
        const reader=new FileReader();


        reader.readAsDataURL(file);

        reader.onloadend=()=>{
            const result=reader.result as string;

            handleStateChange('image',result);
        }
    };

    const handleStateChange = (fieldName: string, value: string) => { 
        setform((pre)=>({...pre,[fieldName]:value}))
    };


    return (
        <form onSubmit={handleFormSubmit} className="flexStart form">
            <div className="flexStart form_image-container">
                <label htmlFor="poster" className="flexCenter form_image-label">
                    {!form?.image && 'UPLOAD IMAGE'}
                </label>
                <input placeholder="upload" id="image" type="file" accept='image/*'
        required={type==='create'?true:false} className="form_image-input"
        onChange={(e) => handleChangeImage(e)}
        />
                {form?.image && (
                    <Image 
                        src={form?.image}
                        className="left-[50%] translate-x-[-50%] object-contain z-20 absolute" alt="image"
                        width={200}
                        height={150}
                    />
                )}
            </div>
            <FormField
                title="Title"
                state={form.title}
                placeholder="Flexxible"
                setState={(value) => handleStateChange("title", value)}
            />
            <FormField
                title="Description"
                state={form.description}
                placeholder="Showcase and discover remarkable developer projects"
                setState={(value) => handleStateChange("description", value)}
            />
            <FormField
                type="url"
                title="website url"
                state={form.liveSiteUrl}
                placeholder="https://flexxible/"
                setState={(value) => handleStateChange("liveSiteUrl", value)}
            />
            <FormField
                type='url'
                title="GITHUB URL"
                state={form.githubUrl}
                placeholder="github url"
                setState={(value) => handleStateChange("githubUrl", value)}
            />

            {/* custominput category */}
                <CustomMenu
                title="Category"
                state={form.category}
                filters={categoryFilters}
                setState={(value)=>handleStateChange('category',value)}
                />

            <div className="flexStart w-full">
            <Button
                    title={isSubmitting ? `${type === "create" ? "Creating" : "Editing"}` : `${type === "create" ? "Create" : "Edit"}`}
                    type="submit"
                    leftIcon={isSubmitting ? "" : "/plus.svg"}
                    isSubmitting={isSubmitting}
                />
            </div>


        </form>
    );
};

export default ProjectForm;
function userRouter() {
    throw new Error("Function not implemented.");
}

