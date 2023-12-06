"use client";
import React, {Fragment, useEffect, useRef, useState} from "react";
import Link from 'next/link';
import {Dialog, Transition} from "@headlessui/react";
import app_init from "@/app/initialize";
import {logout} from "@/api/log_in";

export default function PatientHome() {
    // Initialize
    useEffect(() => {
        app_init()
    });

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
            <Transition.Root show={scheduleWindowOpen} as={Fragment}>
                <Dialog className="relative z-10" initialFocus={cancelButtonRef} onClose={setScheduleWindowOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                    {
                                        mode == 'schedule' && (
                                            <div>
                                                <div>
                                                    <div className="mt-3 text-center sm:mt-5">
                                                        <Dialog.Title className="text-base font-semibold text-gray-900">
                                                            Schedule a New Appointment
                                                        </Dialog.Title>
                                                        <div className="mt-4 flex flex-col items-start gap-y-4 ">
                                                            <div className={"flex flex-row gap-x-3 items-center w-full"}>
                                                                <label htmlFor="location" className="text-sm font-medium  text-gray-900 w-[60px] text-start">
                                                                    Location
                                                                </label>
                                                                <select
                                                                    id="new_appointment_location"
                                                                    name="new_appointment_location"
                                                                    className="block w-2/3 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                    defaultValue={location_options[0]["label"]}
                                                                >
                                                                    {
                                                                        location_options.map(e => (<option>{e["label"]}</option>))
                                                                    }
                                                                </select>
                                                            </div>

                                                            <div className={"flex flex-row gap-x-3 items-center w-full"}>
                                                                <label htmlFor="new_appointment_doctor" className="text-sm font-medium text-gray-900 w-[60px] text-start">Doctor</label>
                                                                <select
                                                                    id="new_appointment_doctor"
                                                                    name="new_appointment_doctor"
                                                                    className="block w-2/3 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                    defaultValue={doctor_options[0]["label"]}
                                                                >
                                                                    {
                                                                        doctor_options.map(e => (<option>{e["label"]}</option>))
                                                                    }
                                                                </select>
                                                            </div>



                                                            <div className={"flex flex-row gap-x-3 items-center w-full"}>
                                                                <label htmlFor="new_appointment_datetime" className="text-sm font-medium  text-gray-900 w-[60px] text-start">Time</label>
                                                                <input type="datetime-local" id="new_appointment_datetime"
                                                                       name="new_appointment_datetime" className="pl-3 block w-2/3 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                                            </div>

                                                            <div className={"flex flex-col gap-y-3 w-full"}>
                                                                <label htmlFor="new_appointment_message" className="text-sm font-medium text-gray-900 w-full text-start">Leave a Message</label>
                                                                <textarea
                                                                    id="new_appointment_message"
                                                                    name="new_appointment_message"
                                                                    rows={3}
                                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                    defaultValue={''}
                                                                    placeholder={"Describe your symptom here ..."}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                                    <button
                                                        type="button"
                                                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                                                        onClick={() => setScheduleWindowOpen(false)}
                                                    >
                                                        Schedule
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                                        onClick={() => setScheduleWindowOpen(false)}
                                                        ref={cancelButtonRef}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    }

                                    {
                                        mode == 'add_record' && (
                                            <div>
                                                <div>
                                                    <div className="text-center sm:mt-5">
                                                        <Dialog.Title className="text-base font-semibold text-gray-900">
                                                            Add a Record
                                                        </Dialog.Title>
                                                        <div className="mt-4 flex flex-col items-start gap-y-4 ">
                                                            <div className={"flex flex-row gap-x-3 items-center w-full"}>
                                                                <div className={"flex flex-row gap-x-3 items-center w-full"}>
                                                                    <label htmlFor="new_record_datetime" className="text-sm font-medium  text-gray-900 w-[60px] text-start">Date of Visit</label>
                                                                    <input type="datetime-local" id="new_record_datetime"
                                                                           name="new_record_datetime" className="pl-3 block w-2/3 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                                                </div>
                                                            </div>

                                                            <div className={"flex flex-row gap-x-3 items-center w-full"}>
                                                                <label htmlFor="new_record_location" className="text-sm font-medium  text-gray-900 w-[60px] text-start">
                                                                    Location
                                                                </label>
                                                                <select
                                                                    id="new_record_location"
                                                                    name="new_record_location"
                                                                    className="block w-2/3 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                    defaultValue={location_options[0]["label"]}
                                                                >
                                                                    {
                                                                        location_options.map(e => (<option>{e["label"]}</option>))
                                                                    }
                                                                </select>
                                                            </div>

                                                            <div className={"flex flex-row gap-x-3 items-center w-full"}>
                                                                <label htmlFor="new_record_doctor" className="text-sm font-medium text-gray-900 w-[60px] text-start">Doctor</label>
                                                                <select
                                                                    id="new_record_doctor"
                                                                    name="new_record_doctor"
                                                                    className="block w-2/3 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                    defaultValue={doctor_options[0]["label"]}
                                                                >
                                                                    {
                                                                        doctor_options.map(e => (<option>{e["label"]}</option>))
                                                                    }
                                                                </select>
                                                            </div>


                                                            <div className={"flex flex-col gap-y-3 w-full"}>
                                                                <label htmlFor="new_record_symptom" className="text-sm font-medium text-gray-900 w-full text-start">Symptom</label>
                                                                <textarea
                                                                    id="new_record_symptom"
                                                                    name="new_record_symptom"
                                                                    rows={3}
                                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                    defaultValue={''}
                                                                    placeholder={"Describe symptom here ..."}
                                                                />
                                                            </div>

                                                            <div className={"flex flex-col gap-y-3 w-full"}>
                                                                <label htmlFor="new_record_diagnosis" className="text-sm font-medium text-gray-900 w-full text-start">Diagnosis</label>
                                                                <textarea
                                                                    id="new_record_diagnosis"
                                                                    name="new_record_diagnosis"
                                                                    rows={3}
                                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                    defaultValue={''}
                                                                    placeholder={"Enter diagnosis here ..."}
                                                                />
                                                            </div>

                                                            <div className={"flex flex-col gap-y-3 w-full"}>
                                                                <label htmlFor="new_record_medication" className="text-sm font-medium text-gray-900 w-full text-start">Medication</label>
                                                                <textarea
                                                                    id="new_record_medication"
                                                                    name="new_record_medication"
                                                                    rows={3}
                                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                    defaultValue={''}
                                                                    placeholder={"Enter medication here ..."}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                                    <button
                                                        type="button"
                                                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                                                        onClick={() => setScheduleWindowOpen(false)}
                                                    >
                                                        Schedule
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                                        onClick={() => setScheduleWindowOpen(false)}
                                                        ref={cancelButtonRef}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    }
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

            <div className={"bg-white min-h-screen flex flex-col relative"}>
                <header className="absolute inset-x-0 top-0 z-50 bg-[#2D9298] shadow-xl">
                    <div className="mx-auto flex flex-row justify-between">
                        <div className="pt-2 pb-2 lg:max-w-4xl lg:pl-8 lg:pr-0">
                            <nav className="flex items-center justify-between lg:justify-start gap-x-2" aria-label="Global">
                                <a href="#" className="-m-1.5 p-1.5">
                                    <span className="sr-only">PatientHealth</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-brand-hexo"
                                         width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                                         fill="#009988" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <path
                                            d="M19.875 6.27c.7 .398 1.13 1.143 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z"/>
                                        <path d="M9 8v8"/>
                                        <path d="M15 8v8"/>
                                        <path d="M9 12h6"/>
                                    </svg>
                                </a>
                                <p className="font-mono text-white font-bold text-lg">PatientHealth - Patient Portal</p>

                            </nav>
                        </div>
                        <div className={"pt-5 pb-2 pr-5 text-md font-semibold text-white cursor-pointer"} onClick={logout}>Log Out</div>
                    </div>
                </header>
                <div className={"pt-[60px] min-h-[389px] bg-[#5AA49F] flex justify-center"}>
                    <div className={"w-[1080px] min-h-[389px] relative overflow-hidden"}>
                        <div className={'absolute left-0 bottom-[-1] w-[50%] h-[50%] '}>
                            <img
                                src="../pablo-summer.png"
                            />
                        </div>
                        <div className={"absolute right-0 bottom-[80px] w-[50%]"}>
                            <div className={"pl-[50px] flex flex-col"}>
                                <div className={"tracking-tight text-[30px] font-mono font-semibold"}>
                                    Welcome Back, <span className={"text-[33px] font-mono font-semibold text-[#FFCBA5] underline decoration-solid"}>John Smith</span> <br />How are you feeling today?
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"min-h-[950px] flex justify-center "}>
                    <div className={"w-[1080px] min-h-[389px] flex flex-col gap-y-5"}>
                        <div className={"min-w-full min-h-[329px] flex flex-col"}>
                            <div className={"pt-5 pl-2 text-[22px] font-sans font-semibold text-[#2D9298]"}>
                                Personal Profile
                            </div>

                            {!isEditing && (
                                <div className={"flex flex-row min-h-full"}>
                                    <div className={"w-1/2 pl-2 pt-3 text-black text-[18px] font-sans flex flex-col"}>
                                        <div className={"flex flex-row gap-x-3"}>
                                            <div className={"font-bold text-black text-[18px] font-sans"}>Name: </div>
                                            <div className={"text-black text-[18px] font-sans"}>John Smith</div>
                                        </div>
                                        <div className={"flex flex-row gap-x-3"}>
                                            <div className={"font-bold text-black text-[18px] font-sans"}>Gender: </div>
                                            <div className={"text-black text-[18px] font-sans"}>Male</div>
                                        </div>
                                        <div className={"flex flex-row gap-x-3"}>
                                            <div className={"font-bold text-black text-[18px] font-sans"}>Contact: </div>
                                            <div className={"text-black text-[18px] font-sans"}>413-444-1234</div>
                                        </div>
                                        <div className={"flex flex-row gap-x-3"}>
                                            <div className={"font-bold text-black text-[18px] font-sans"}>Address: </div>
                                            <div className={"text-black text-[18px] font-sans"}>12 UMass Ave, Amherst, MA, 01002</div>
                                        </div>
                                    </div>
                                    <div className={"w-1/2 pl-2 pt-3 flex flex-col"}>
                                        <div className={"flex flex-row gap-x-3"}>
                                            <div className={"font-bold text-black text-[18px] font-sans"}>Date of Birth: </div>
                                            <div className={"text-black text-[18px] font-sans"}>11/20/2000</div>
                                        </div>
                                        <div className={"flex flex-row gap-x-3"}>
                                            <div className={"font-bold text-black text-[18px] font-sans"}>Pronouns: </div>
                                            <div className={"text-black text-[18px] font-sans"}>He/Him</div>
                                        </div>
                                        <div className={"flex flex-row gap-x-3"}>
                                            <div className={"font-bold text-black text-[18px] font-sans"}>Emergency Contact:</div>
                                            <div className={"text-black text-[18px] font-sans"}>413-444-1234</div>
                                        </div>
                                        <div className={"w-full flex flex-row justify-end gap-x-3 pt-[100px]"}>
                                            <div
                                                onClick={editButtonClick}
                                                className="cursor-pointer  rounded-md bg-teal-600 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                                            >
                                                Edit
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isEditing && (
                                <div className={"flex flex-row min-h-full"}>
                                    <div className={"w-2/5 pl-2 pt-3 text-black text-[18px] font-sans flex flex-col gap-y-3"}>
                                        <div className={"flex flex-row gap-x-3"}>
                                            <div className={"font-bold text-black text-[18px] font-sans w-[80px]"}>Name: </div>
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                autoComplete="given-name"
                                                value="John Smith"
                                                className="font-semibold pl-3 block w-2/3 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                        <div className={"flex flex-row gap-x-3"}>
                                            <div className={"font-bold text-black text-[18px] font-sans w-[80px]"}>Gender: </div>
                                            <input
                                                type="text"
                                                name="gender"
                                                id="gender"
                                                autoComplete="gender"
                                                value="Male"
                                                className="font-semibold pl-3 block w-2/3  rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                        <div className={"flex flex-row gap-x-3"}>
                                            <div className={"font-bold text-black text-[18px] font-sans w-[80px]"}>Contact: </div>
                                            <input
                                                type="text"
                                                name="contact"
                                                id="contact"
                                                autoComplete="contact"
                                                value="413-444-1234"
                                                className="font-semibold pl-3 block w-2/3 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                        <div className={"flex flex-row gap-x-3"}>
                                            <div className={"font-bold text-black text-[18px] font-sans w-[80px]"}>Address: </div>
                                            <input
                                                type="text"
                                                name="address"
                                                id="address"
                                                autoComplete="address"
                                                value="12 UMass Ave, Amherst, MA, 01002"
                                                className="font-semibold pl-3 block w-2/3 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    <div className={"w-3/5 pl-2 pt-3 flex flex-col gap-y-3"}>
                                        <div className={"flex flex-row gap-x-3"}>
                                            <div className={"font-bold text-black text-[18px] font-sans w-[120px]"}>Date of Birth: </div>
                                            <input
                                                type="text"
                                                name="birth"
                                                id="birth"
                                                autoComplete="birth"
                                                value="11/20/2000"
                                                className="font-semibold pl-3 block w-1/2 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                        <div className={"flex flex-row gap-x-3"}>
                                            <div className={"font-bold text-black text-[18px] font-sans w-[120px]"}>Pronouns: </div>
                                            <input
                                                type="text"
                                                name="pronouns"
                                                id="pronouns"
                                                autoComplete="pronouns"
                                                value="He/Him"
                                                className="font-semibold pl-3 block w-1/2 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                        <div className={"flex flex-row gap-x-3"}>
                                            <div className={"font-bold text-black text-[18px] font-sans w-[200px]"}>Emergency Contact:</div>
                                            <input
                                                type="text"
                                                name="emergency"
                                                id="emergency"
                                                autoComplete="emergency"
                                                value="413-444-1234"
                                                className="font-semibold pl-3 block w-1/2 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                        <div className={"flex flex-row justify-end gap-x-3 pt-[100px]"}>
                                            <div
                                                onClick={editButtonClick}
                                                className="cursor-pointer  rounded-md bg-red-600 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                                            >
                                                Cancel
                                            </div>
                                            <div
                                                // onClick={editButtonClick}
                                                className="cursor-pointer  rounded-md bg-teal-600 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                                            >
                                                Update
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="w-full border-[1px] border-teal-600 shadow-lg" />

                        <div className={"min-w-full min-h-[329px] flex flex-col items-center"}>
                            <div className={"flex flex-row pt-5 pl-2 justify-between w-full"}>
                                <div className={"text-[22px] font-sans font-semibold text-[#2D9298]"}>
                                    View Your Upcoming <br />Appointment
                                </div>
                                <div
                                    onClick={()=>{
                                        setScheduleWindowOpen(true)
                                        setMode("schedule")
                                    }
                                }
                                    className="cursor-pointer h-[45px] rounded-md bg-teal-600 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                                >
                                    Schedule Appointment
                                </div>
                            </div>

                            <div className={"pt-5 w-[95%] flex flex-col gap-y-5"}>
                                <div className="w-full border-t border-gray-300 shadow-lg" />

                                <div className={"flex flex-col w-full pt-5"}>
                                    <div className={"flex flex-row gap-x-3"}>
                                        <div className={"font-bold text-teal-700 text-[18px] font-sans w-[80px]"}>Time: </div>
                                        <div className={"text-black text-[18px] font-sans"}>11/01/2023, Wednesday 10:30AM</div>
                                    </div>
                                    <div className={"flex flex-row gap-x-3"}>
                                        <div className={"font-bold text-teal-700 text-[18px] font-sans w-[80px]"}>Doctor: </div>
                                        <div className={"text-black text-[18px] font-sans"}>John Smith</div>
                                    </div>
                                    <div className={"flex flex-row gap-x-3"}>
                                        <div className={"font-bold text-teal-700 text-[18px] font-sans w-[80px]"}>Location: </div>
                                        <div className={"text-black text-[18px] font-sans"}>UMass Health Service</div>
                                    </div>
                                    <div className={"flex flex-row gap-x-3"}>
                                        <div className={"font-bold text-teal-700 text-[18px] font-sans w-[80px]"}>Message: </div>
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

                        <div className="w-full border-[1px] border-teal-600 shadow-lg" />

                        <div className={"min-w-full min-h-[329px] flex flex-col items-center gap-y-5"}>
                            <div className={"flex flex-row pt-5 pl-2 justify-between w-full"}>
                                <div className={"text-[22px] font-sans font-semibold text-[#2D9298]"}>
                                    Medical Records
                                </div>
                                <div
                                    onClick={()=>{
                                        setScheduleWindowOpen(true)
                                        setMode("add_record")
                                    }
                                    }
                                    className="cursor-pointer h-[45px] rounded-md bg-teal-600 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                                >
                                    Add Record
                                </div>
                            </div>

                            <div className="w-full border-t border-gray-300 shadow-lg" />

                            <div className={"flex flex-col w-full border-dashed border-2 p-5"}>
                                <div className={"flex flex-row gap-x-3"}>
                                    <div className={"font-bold text-teal-700 text-[18px] font-sans w-[130px]"}>Date of Visit: </div>
                                    <div className={"text-black text-[18px] font-sans"}>02/01/2022, Wednesday 12:30PM</div>
                                </div>
                                <div className={"flex flex-row gap-x-3"}>
                                    <div className={"font-bold text-teal-700 text-[18px] font-sans w-[130px]"}>Doctor: </div>
                                    <div className={"text-black text-[18px] font-sans"}>John Smith</div>
                                </div>
                                <div className={"flex flex-row gap-x-3"}>
                                    <div className={"font-bold text-teal-700 text-[18px] font-sans w-[130px]"}>Location: </div>
                                    <div className={"text-black text-[18px] font-sans"}>UMass Health Service</div>
                                </div>
                                <div className={"flex flex-col w-full gap-x-3 "}>
                                    <div className={"font-bold text-teal-700 text-[18px] font-sans w-[130px]"}>Symptom</div>
                                    <div className={"text-black text-[18px] font-sans"}>The patient presents with a complaint of recurrent headaches over the past two weeks.</div>
                                </div>

                                {/*<div className={"flex flex-col w-full gap-x-3 pt-10"}>*/}
                                {/*    <div className={"font-bold text-teal-700 text-[18px] font-sans w-auto"}>History of Present Illness</div>*/}
                                {/*    <div className={"text-black text-[18px] font-sans"}>The patient describes the headaches as bilateral, throbbing in nature, and often accompanied by sensitivity to light and sound. The headaches typically last for several hours and have been affecting the patient's daily activities.</div>*/}
                                {/*</div>*/}

                                {/*<div className={"flex flex-col w-full gap-x-3 pt-10"}>*/}
                                {/*    <div className={"font-bold text-teal-700 text-[18px] font-sans w-auto"}>Past Medical History</div>*/}
                                {/*    <div className={"text-black text-[18px] font-sans w-full"}>- No history of migraines or chronic headaches. <br />*/}
                                {/*        - No known allergies to medications.</div>*/}
                                {/*</div>*/}

                                <div className={"flex flex-col w-full gap-x-3 pt-7"}>
                                    <div className={"font-bold text-teal-700 text-[18px] font-sans w-auto"}>Diagnosis</div>
                                    <div className={"text-black text-[18px] font-sans"}>The patient's presentation is consistent with episodic tension-type headaches.</div>
                                </div>

                                <div className={"flex flex-col w-full gap-x-3 pt-7"}>
                                    <div className={"font-bold text-teal-700 text-[18px] font-sans w-auto"}>Medication</div>
                                    <div className={"text-black text-[18px] font-sans"}>
                                        - Acetaminophen (Tylenol): 500mg, 1-2 tablets every 4-6 hours as needed for headache relief. <br />
                                        - Ibuprofen (Advil): 200mg, 1-2 tablets every 4-6 hours as needed for headache relief.
                                    </div>
                                </div>

                                <div className={"flex flex-row justify-end gap-x-3 pt-[70px]"}>
                                    <div
                                        // onClick={()=>{
                                        //     setMode("reschedule")
                                        // }}
                                        className="cursor-pointer  rounded-md bg-amber-600 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-amber-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
                                    >
                                        Edit
                                    </div>
                                    <div
                                        // onClick={editButtonClick}
                                        className="cursor-pointer  rounded-md bg-red-600 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                                    >
                                        Delete
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className={"pt-[60px] min-h-[100px] bg-white flex justify-center"}>

                </div>

                <div className={"h-[40px] bg-[#2D9298] flex justify-center"}>

                </div>
            </div>
        </>

    )
}
