"use client";
import React, {Fragment, useRef, useState} from "react";
// import "react-datetime/css/react-datetime.css";

export default function DoctorHome() {
    const [isEditing, setIsEditing] = useState(false)
    const editButtonClick = () => {
        setIsEditing(!isEditing)
    }

    const [mode, setMode] = useState('schedule')
    const [scheduleWindowOpen, setScheduleWindowOpen] = useState(false)
    const cancelButtonRef = useRef(null)

    const location_options = [
        { value: "UMass Health Service", label: "UMass Health Service"},
        { value: "Amherst Health Service", label: "Amherst Health Service"},
        { value: "Hadley Health", label: "Hadley Health"}
    ]

    const doctor_options = [
        { value: "John Smith", label: "John Smith"},
        { value: "Alex Chen", label: "Alex Chen"},
        { value: "Chris Wang", label: "Chris Wang"}
    ]


    return (
        <>
            <div className={"bg-white min-h-screen flex flex-col relative"}>
                <header className="absolute inset-x-0 top-0 z-50 bg-[#316798] shadow-xl">
                    <div className="mx-auto">
                        <div className="pt-2 pb-2 lg:max-w-4xl lg:pl-8 lg:pr-0">
                            <nav className="flex items-center justify-between lg:justify-start gap-x-2" aria-label="Global">
                                <a href="#" className="-m-1.5 p-1.5">
                                    <span className="sr-only">PatientHealth</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-brand-hexo"
                                         width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                                         fill="#487DAD" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <path
                                            d="M19.875 6.27c.7 .398 1.13 1.143 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z"/>
                                        <path d="M9 8v8"/>
                                        <path d="M15 8v8"/>
                                        <path d="M9 12h6"/>
                                    </svg>
                                </a>
                                <p className="font-mono text-white font-bold text-lg">PatientHealth - Doctor Portal</p>

                            </nav>
                        </div>
                    </div>
                </header>
                <div className={"pt-[60px] min-h-[389px] bg-[#5C90B6] flex justify-center"}>
                    <div className={"w-[1080px] min-h-[389px] relative overflow-hidden"}>
                        <div className={'absolute right-0 bottom-[150px] w-[50%] h-[50%] '}>
                            <img
                                src="../pablo-man.png"
                            />
                        </div>
                        <div className={"absolute left-0 top-[40px] w-[50%]"}>
                            <div className={"pl-[50px] flex flex-col"}>
                                <div className={"tracking-tight text-[30px] font-mono font-semibold"}>
                                    Welcome Back, <br />Doctor <span className={"text-[33px] font-mono font-semibold text-[#FFCBA5] underline decoration-solid"}>John Smith</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"min-h-[950px] flex justify-center "}>
                    <div className={"w-[1080px] min-h-[389px] flex flex-col gap-y-5"}>

                        <div className={"min-w-full min-h-[329px] flex flex-col items-center"}>
                            <div className={"flex flex-row pt-5 pl-2 justify-between w-full"}>
                                <div className={"text-[22px] font-sans font-semibold text-[#5C90B6]"}>
                                    View Your Upcoming <br />Appointment
                                </div>
                            </div>

                            <div className={"pt-5 w-[95%] flex flex-col gap-y-5"}>
                                <div className="w-full border-t border-gray-300 shadow-lg" />

                                <div className={"flex flex-col w-full pt-5"}>
                                    <div className={"flex flex-row gap-x-3"}>
                                        <div className={"font-bold text-[#5C90B6] text-[18px] font-sans w-[80px]"}>Time: </div>
                                        <div className={"text-black text-[18px] font-sans"}>11/01/2023, Wednesday 10:30AM</div>
                                    </div>
                                    <div className={"flex flex-row gap-x-3"}>
                                        <div className={"font-bold text-[#5C90B6] text-[18px] font-sans w-[80px]"}>Patient: </div>
                                        <div className={"text-black text-[18px] font-sans"}>John Smith</div>
                                    </div>
                                    <div className={"flex flex-row gap-x-3"}>
                                        <div className={"font-bold text-[#5C90B6] text-[18px] font-sans w-[80px]"}>Location: </div>
                                        <div className={"text-black text-[18px] font-sans"}>UMass Health Service</div>
                                    </div>
                                    <div className={"flex flex-row gap-x-3"}>
                                        <div className={"font-bold text-[#5C90B6] text-[18px] font-sans w-[80px]"}>Message: </div>
                                        <div className={"text-black text-[18px] font-sans"}>Message: Hello Doctor! I'm concerned about the sudden weight loss I've experienced over the last month, despite not making any changes to my diet or exercise routine.</div>
                                    </div>

                                    <div className={"flex flex-row justify-end gap-x-3 pt-[100px]"}>
                                        <div
                                            onClick={()=>{
                                                setMode("reschedule")
                                            }}
                                            className="cursor-pointer  rounded-md bg-amber-600 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-amber-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
                                        >
                                            Reschedule
                                        </div>
                                        <div
                                            // onClick={editButtonClick}
                                            className="cursor-pointer  rounded-md bg-red-600 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                                        >
                                            Cancel
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full border-t border-gray-300 shadow-lg" />

                            </div>

                        </div>

                        <div className="w-full border-[1px] border-[#316798] shadow-lg" />

                    </div>
                </div>

                <div className={"pt-[60px] min-h-[100px] bg-white flex justify-center"}>

                </div>

                <div className={"h-[40px] bg-[#316798] flex justify-center"}>

                </div>
            </div>
        </>

    )
}
