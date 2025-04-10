import { HTMLProps } from "react";


export function Textarea({ ...rest }: HTMLProps<HTMLTextAreaElement>){
    return <textarea
        className="w-full resize-none h-[160px] rounded-[8px] outline-none p-[8px] bg-[#FFF]"
        {...rest}
        ></textarea>
    
}