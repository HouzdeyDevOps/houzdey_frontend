import Image from "next/image";

export default function UploadImages(){
    const UploadImag = [
        {
            id : 1,
            image : "/assets/images/Rectangle 89.png"
        },
        {
            id: 2 ,
            image : "/assets/images/Rectangle 89.png"
        },
        {
            id: 3 ,
            image : "/assets/images/Rectangle 89.png"
        },

    ]
    return(
        <div>
            <div className="flex gap-14 pb-10">
                <h1 className="font-semibold text-base">Upload Images</h1>
                <h1 className="font-semibold text-base">Use Links</h1>
            </div>
            <div>
                <h1 className="pb-4">Cover Images</h1>
                <input style={{display: "none"}} type="file" id="file" className="sin-input"/>
                    <label htmlFor="file">
                    <div className="relative pb-10">
                        <Image 
                            src="/assets/images/Rectangle 89.png" 
                            alt="" 
                            width={592}
                            height={319}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Image 
                            src="/assets/images/Frame 2608.png" 
                            alt="" 
                            width={50}
                            height={50}
                            />
                        </div>
                    </div>  
                    </label>
                    <div className="pb-10 border-b" >
                        <h1 className="mb-5">Other Images</h1>
                        <div className="flex gap-8">
                        {UploadImag.map((item)=>{
                            return(
                                <div key={item.id}>
                                <input style={{display: "none", borderRadius:"24px"}} type="file" id="file" className="sin-input"/>
                                <label htmlFor="file">
                                    <div className="relative  ">
                                        <div className="h-[135px] w-[140px]">
                                        <Image 
                                            src={item.image}
                                            alt="" 
                                            width={140}
                                            height={135}
                                            className="object-cover w-full h-full rounded-2xl" 
                                        />
                                      </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Image 
                            src="/assets/images/Frame 2608.png" 
                            alt="" 
                            width={50}
                            height={50}
                            />
                        </div>
                    </div>  
                    </label>
                                </div>
                            )
                        })}
                        </div>
                    </div>
            </div>
        </div>
    )
}