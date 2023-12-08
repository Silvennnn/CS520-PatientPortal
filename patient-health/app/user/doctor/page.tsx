"use client";
import React, {Fragment, useEffect, useRef, useState} from "react";
import {logout} from "@/api/log_in";
import {getCookie} from "typescript-cookie";
import app_init from "@/app/initialize";
import {baseURL, getUserByAccountName} from "@/api/profile";
import {parse_time, sortAppointmentByTime, sortRecordsByTime} from "@/app/tools";
import {cancelAppointmentByUUID, completeAppointmentByUUID, updateAppointmentByUUID} from "@/api/appointment";
import {Dialog, Transition} from "@headlessui/react";
import {MutatingDots} from "react-loader-spinner";
import {
    createMedicalRecord,
    deleteMedicalRecordByUUID,
    getMedicalByAccountName,
    updateMedicalRecordByUUID
} from "@/api/record";
// import "react-datetime/css/react-datetime.css";

export default function DoctorHome() {

    const [userProfile, setUserProfile] = useState({
        "user_uuid": "",
        "account_name": "",
        "account_type": 0,
        "first_name": "",
        "last_name": "",
        "middle_name": "",
        "phone_number": "",
        "date_of_birth": "",
        "gender": "male",
        "address": ""
    })
    const [accessToken, setAccessToken] = useState('')
    const [userProfileAddress, setProfileAddress] = useState('')
    const [userContact, setUserContact] = useState('')
    const [userAppointmentList, setUserAppointmentList] = useState([])
    const cancelButtonRef = useRef(null)
    const cancelButtonRef2 = useRef(null)

    const patient_lst = [
        { value: "patient_1", label: "MMZ M"},
        { value: "patient_6", label: "Stone Johnson"},
        { value: "patient_demo", label: "Gavin Duan"}
    ]

    const getPatientNameByValue = (value) => {
        const patient = patient_lst.find(patient => patient.value === value);
        return patient.label
    }

    const getPatientValueByLabel = (label) => {
        const doctor = patient_lst.find(patient => patient.label === label);
        return doctor.value
    }

    const location_options = [
        { value: "UMass Health Service", label: "UMass Health Service"},
        { value: "Amherst Health Service", label: "Amherst Health Service"},
        { value: "Hadley Health", label: "Hadley Health"}
    ]

    const doctor_options = [
        { value: "doctor_3", label: "John Smith"},
        { value: "doctor_4", label: "JR Smith"},
        { value: "doctor_5", label: "Kevin Zhang"},
        { value: "doctor_2", label: "Scissors Johnson"},
        { value: "doctor_1", label: "Paper Johnson"}
    ]

    const getDoctorNameByValue = (value) => {
        const doctor = doctor_options.find(doctor => doctor.value === value);
        return doctor.label
    }

    const getDoctorValueByLabel = (label) => {
        const doctor = doctor_options.find(doctor => doctor.label === label);
        return doctor.value
    }

    // Initialize
    useEffect(() => {
        app_init()
        setMode("loading")
        window.scrollTo({top:0, left:0, behavior: "smooth"})
        setWindowOpen(true)
        let token = getCookie("access_token")
        setAccessToken(token)

        // load profile
        const getUserProfileByToken = async (token: string) => {
            const response = await fetch(baseURL + `/user/getMe?token=${token}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            })
            const json = await response.json()
            return json
        }

        // load appointment
        const getAppointmentByToken = async (token: string) => {
            const response = await fetch(baseURL + `/appointment/getAppointmentByToken/?token=${token}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            })
            const json = await response.json()
            return json
        }

        getUserProfileByToken(token).then(r => {
            console.log("Profile loaded!")
            // console.log(r)
            setUserProfile(r)
            setProfileAddress(r.address)
            setUserContact(r.phone_number)
        })

        getAppointmentByToken(token).then(r => {
            console.log("Appointment loaded!")
            const sorted_app = sortAppointmentByTime(r)
            setUserAppointmentList(sorted_app)
        })

        setWindowOpen(false)
    }, []);

    const [isEditing, setIsEditing] = useState(false)
    const editButtonClick = () => {
        setIsEditing(!isEditing)
    }

    const [mode, setMode] = useState('schedule')
    const [windowOpen, setWindowOpen] = useState(false)
    // const cancelButtonRef = useRef(null)


    // ************************************** Appointment Section *************************************************************
    // Schedule Appointment
    const [selectAppIndex, setSelectAppIndex] = useState(-1)
    const [selectApp, setSelectApp] = useState({
        "datetime": '',
        "location": '',
        "doctor_account_name": '',
        "patient_account_name": '',
        "message": '',
        "status": '',
        "appointment_uuid": ''
    })
    const [modAppLocation, setModAppLocation] = useState(location_options[0].value)
    const [modAppDoctor, setModAppDoctor] = useState(doctor_options[0].value)
    const [modAppTime, setModAppTime] = useState('')
    const [modAppMessage, setModAppMessage] = useState('')

    // Appointment Cancellation
    const appointmentCancelClick = (app_index) => {
        setSelectAppIndex(app_index)
        setMode('cancel')
        setWindowOpen(true)
    }

    const appointmentCancelConfirm = async () => {
        setMode('loading')
        setWindowOpen(true)
        const target_app_uuid = userAppointmentList[selectAppIndex].appointment_uuid
        try {
            let response = await cancelAppointmentByUUID(accessToken, target_app_uuid).then(
                e => {
                    setWindowOpen(true)
                    setMode('success')

                }
            )
        } catch (error) {
            console.error('Error during appointment cancellation:', error);
            setMode("error")
        }
    }

    // Appointment Reschedule
    const appointmentRescheduleClick = (app_index) => {
        setSelectApp(userAppointmentList[app_index])
        setSelectAppIndex(app_index)
        setModAppLocation(userAppointmentList[app_index].location)
        setModAppTime(userAppointmentList[app_index].datetime)
        // setModAppDoctor(userAppointmentList[app_index].doctor_account_name)
        setModAppMessage(userAppointmentList[app_index].message)
        setMode('reschedule')
        setWindowOpen(true)
    }

    const appointmentRescheduleConfirm = async () => {
        setMode('loading')
        setWindowOpen(true)
        const target_app_uuid = userAppointmentList[selectAppIndex].appointment_uuid
        // console.log(target_app_uuid)
        try {
            let response = await updateAppointmentByUUID(accessToken, target_app_uuid, modAppTime, modAppLocation, modAppMessage).then(
                e => {
                    setWindowOpen(true)
                    setMode('success')
                }
            )
        } catch (error) {
            console.error('Error during appointment cancellation:', error);
            setMode("error")
        }
    }

    const successWindowButtonClick = () => {
        window.location.reload()
    }

    const appointmentCompleteClick = (index) => {
        setSelectApp(userAppointmentList[index])
        setSelectAppIndex(index)
        setMode("complete_app")
        setWindowOpen(true)
    }

    const appointmentCompleteConfirm = async () => {
        console.log("1111")
        setMode('loading')
        setWindowOpen(true)
        const target_app_uuid = userAppointmentList[selectAppIndex].appointment_uuid
        console.log(target_app_uuid)
        try {
            let response = await completeAppointmentByUUID(accessToken, target_app_uuid).then(
                e => {
                    setWindowOpen(true)
                    setMode('success')
                }
            )
        } catch (error) {
            console.error('Error during appointment cancellation:', error);
            setMode("error")
        }
    }

    // ************************************** Patient Record Section *************************************************************
    const [viewPatientWindowOpen, setViewPatientWindowOpen] = useState(false)
    const [targetPatientProfile, setTargetPatientProfile] = useState({
        "user_uuid": "",
        "account_name": "",
        "account_type": 0,
        "first_name": "",
        "last_name": "",
        "middle_name": "",
        "phone_number": "",
        "date_of_birth": "",
        "gender": "male",
        "address": ""
    })
    const [targetPatientRecords, setTargetPatientRecords] = useState([])
    const [selectRecordIndex, setSelectRecordIndex] = useState(-1)
    const [newRecordDate, setNewRecordDate] = useState('')
    const [newRecordSymptom, setNewRecordSymptom] = useState("")
    const [newRecordDiag, setNewRecordDiag] = useState("")
    const [newRecordMed, setNewRecordMed] = useState("")
    const viewRecordButtonClick = async (index) => {
        const target_patient_account_username = userAppointmentList[index].patient_account_name
        console.log(target_patient_account_username)
        setMode("loading")
        setWindowOpen(true)
        try {
            let response = await getUserByAccountName(target_patient_account_username, accessToken).then(
                e => {
                    setTargetPatientProfile(e)
                }
            )

            let response2 = await getMedicalByAccountName(accessToken, target_patient_account_username).then(
                e => {
                    const sorted_record = sortRecordsByTime(e)
                    setTargetPatientRecords(sorted_record)
                }
            )
        } catch (error) {
            console.error('Error during appointment cancellation:', error);
            setMode("error")
        }
        setWindowOpen(false)
        setViewPatientWindowOpen(true)
    }

    const recordCreateClick = async (index) => {
        setMode('add_record')
        setWindowOpen(true)
        setSelectAppIndex(index)
    }

    const recordCreate = async () => {
        // console.log(newRecordDoctor)
        const data = {
            "symptom": newRecordSymptom,
            "diagnosis": newRecordDiag,
            "Medication": newRecordMed,
            "date_of_visit": newRecordDate,
            "doctor_account_name": userProfile.account_name,
            "patient_account_name": userAppointmentList[selectAppIndex].patient_account_name
        }
        // console.log(data)
        try {
            let response = await createMedicalRecord(accessToken, data).then(
                e => {
                    setWindowOpen(true)
                    setMode('success')
                }
            )
        } catch (error) {
            console.error('Error during record create:', error);
            setMode("error")
        }
    }


    return (
        <>
            <Transition.Root show={windowOpen} as={Fragment}>
                <Dialog className="relative z-10" initialFocus={cancelButtonRef} onClose={setWindowOpen}>
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
                                            mode == 'loading' && (
                                                <div>
                                                    <div className="mt-3 text-center sm:mt-5">
                                                        <Dialog.Title className="text-base font-semibold text-gray-900">
                                                            Loading ...
                                                        </Dialog.Title>
                                                    </div>
                                                    <div className="mt-5 w-full h-full flex flex-row justify-center items-center">
                                                        <MutatingDots
                                                            height="100"
                                                            width="100"
                                                            color="#5AA49F"
                                                            secondaryColor= '#5AA49F'
                                                            radius='12.5'
                                                            ariaLabel="mutating-dots-loading"
                                                            wrapperStyle={{}}
                                                            wrapperClass=""
                                                            visible={true}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        }
                                        {
                                            mode == 'success' && (
                                                <div>
                                                    <div className="mt-3 text-center sm:mt-5">
                                                        <Dialog.Title className="text-base font-semibold text-gray-900">
                                                            Success!
                                                        </Dialog.Title>
                                                    </div>
                                                    <div className="mt-5 flex flex-row justfy-center w-full">
                                                        <button
                                                            type="button"
                                                            className="mt-3 w-full justify-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-teal-700 sm:col-start-1 sm:mt-0"
                                                            onClick={() => successWindowButtonClick()}
                                                        >
                                                            Confirm
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        {
                                            mode == 'error' && (
                                                <div>
                                                    <div>
                                                        <div className="mt-3 text-center sm:mt-5">
                                                            <Dialog.Title className="text-base font-semibold text-gray-900">
                                                                Something is wrong!
                                                            </Dialog.Title>
                                                        </div>
                                                    </div>
                                                    <div className="mt-5">
                                                        <button
                                                            type="button"
                                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                                            onClick={() => setWindowOpen(false)}
                                                            ref={cancelButtonRef}
                                                        >
                                                            Close
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        {
                                            mode == 'cancel' && (
                                                <div>
                                                    <div>
                                                        <div className="mt-3 text-center sm:mt-5">
                                                            <Dialog.Title className="text-base font-semibold text-gray-900">
                                                                Confirm Appointment Cancellation?
                                                            </Dialog.Title>
                                                        </div>
                                                    </div>
                                                    <div className="mt-5 flex flex-row gap-x-5">
                                                        <button
                                                            type="button"
                                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                                            onClick={() => setWindowOpen(false)}
                                                            ref={cancelButtonRef}
                                                        >
                                                            Close
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-700 sm:col-start-1 sm:mt-0"
                                                            onClick={() => appointmentCancelConfirm()}
                                                        >
                                                            Confirm
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        {
                                            mode == 'reschedule' && (
                                                <div>
                                                    <div>
                                                        <div className="mt-3 text-center sm:mt-5">
                                                            <Dialog.Title className="text-base font-semibold text-gray-900">
                                                                Modify Your Appointment
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
                                                                        value={modAppLocation}
                                                                        onChange={e => {
                                                                            setModAppLocation(e.target.value.toString())
                                                                        }
                                                                        }
                                                                    >
                                                                        {
                                                                            location_options.map(e => (<option key={e.value}>{e["label"]}</option>))
                                                                        }
                                                                    </select>
                                                                </div>

                                                                <div className={"flex flex-row gap-x-3 items-center w-full"}>
                                                                    <label htmlFor="new_appointment_datetime" className="text-sm font-medium  text-gray-900 w-[60px] text-start">Time</label>
                                                                    <input type="datetime-local" id="new_appointment_datetime"
                                                                           value={modAppTime}
                                                                           onChange={e => {
                                                                               setModAppTime(e.target.value.toString())
                                                                           }
                                                                           }
                                                                           name="new_appointment_datetime" className="pl-3 block w-2/3 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                                                </div>

                                                                {/*<div className={"flex flex-col gap-y-3 w-full"}>*/}
                                                                {/*    <label htmlFor="new_appointment_message" className="text-sm font-medium text-gray-900 w-full text-start">Leave a Message</label>*/}
                                                                {/*    <textarea*/}
                                                                {/*        id="new_appointment_message"*/}
                                                                {/*        name="new_appointment_message"*/}
                                                                {/*        rows={3}*/}
                                                                {/*        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"*/}
                                                                {/*        placeholder={"Describe your symptom here ..."}*/}
                                                                {/*        value={modAppMessage}*/}
                                                                {/*        onChange={e => {*/}
                                                                {/*            setModAppMessage(e.target.value)*/}
                                                                {/*        }*/}
                                                                {/*        }*/}
                                                                {/*    />*/}
                                                                {/*</div>*/}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                                        <button
                                                            type="button"
                                                            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                                                            onClick={() => appointmentRescheduleConfirm()}
                                                        >
                                                            Reschedule
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                                            onClick={() => setWindowOpen(false)}
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
                                                                           value={newRecordDate}
                                                                           onChange={e => {
                                                                               setNewRecordDate(e.target.value)
                                                                           }
                                                                           }
                                                                           name="new_record_datetime" className="pl-3 block w-2/3 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                                                </div>
                                                            </div>

                                                            <div className={"flex flex-col gap-y-3 w-full"}>
                                                                <label htmlFor="new_record_symptom" className="text-sm font-medium text-gray-900 w-full text-start">Symptom</label>
                                                                <textarea
                                                                    id="new_record_symptom"
                                                                    name="new_record_symptom"
                                                                    rows={3}
                                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                    value={newRecordSymptom}
                                                                    onChange={e => {
                                                                        setNewRecordSymptom(e.target.value)
                                                                    }}
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
                                                                    value={newRecordDiag}
                                                                    onChange={e => {
                                                                        setNewRecordDiag(e.target.value)
                                                                    }}
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
                                                                    value={newRecordMed}
                                                                    onChange={e => {
                                                                        setNewRecordMed(e.target.value)
                                                                    }}
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
                                                        onClick={() => recordCreate()}
                                                    >
                                                        Create
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                                        onClick={() => setWindowOpen(false)}
                                                        ref={cancelButtonRef}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    }
                                    {
                                        mode == 'complete_app' && (
                                            <div>
                                                <div>
                                                    <div className="mt-3 text-center sm:mt-5">
                                                        <Dialog.Title className="text-base font-semibold text-gray-900">
                                                            Marked as Complete?
                                                        </Dialog.Title>
                                                    </div>
                                                </div>
                                                <div className="mt-5 flex flex-row gap-x-5">
                                                    <button
                                                        type="button"
                                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                                        onClick={() => setWindowOpen(false)}
                                                        ref={cancelButtonRef}
                                                    >
                                                        Close
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-teal-300 hover:bg-teal-700 sm:col-start-1 sm:mt-0"
                                                        onClick={() => {
                                                            appointmentCompleteConfirm()
                                                        }
                                                        }
                                                    >
                                                        Confirm
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

            <Transition.Root show={viewPatientWindowOpen} as={Fragment}>
                <Dialog className="relative z-10" initialFocus={cancelButtonRef2} onClose={setViewPatientWindowOpen}>
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

                    <div className="fixed inset-0 z-20 w-screen overflow-y-auto">
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
                                    <Dialog.Panel className="relative min-w-[70%] transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                        <div>
                                            <div className={"absolute right-0 top-7 text-black cursor-pointer"}
                                            onClick={() => {
                                                setViewPatientWindowOpen(false)
                                            }
                                            }>
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                     className="icon icon-tabler icon-tabler-x" width="44" height="44"
                                                     viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none"
                                                     strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                    <path d="M18 6l-12 12"/>
                                                    <path d="M6 6l12 12"/>
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="mt-3 text-center sm:mt-5">
                                                    <Dialog.Title className="text-base font-semibold text-gray-900">
                                                        Patient Profile
                                                    </Dialog.Title>
                                                </div>
                                            </div>
                                            <div className="mt-7 flex flex-col gap-y-1">
                                                <div className={"flex flex-row gap-x-3"}>
                                                    <div className={"font-bold text-black text-[18px] font-sans"}>Name: </div>
                                                    <div className={"text-black text-[18px] font-sans"}>{targetPatientProfile.first_name + ' ' + targetPatientProfile.last_name}</div>
                                                </div>
                                                <div className={"flex flex-row gap-x-3"}>
                                                    <div className={"font-bold text-black text-[18px] font-sans"}>Date of Birth: </div>
                                                    <div className={"text-black text-[18px] font-sans"}>{userProfile.date_of_birth}</div>
                                                </div>
                                                <div className={"flex flex-row gap-x-3"}>
                                                    <div className={"font-bold text-black text-[18px] font-sans"}>Gender: </div>
                                                    <div className={"text-black text-[18px] font-sans"}>{userProfile.gender}</div>
                                                </div>
                                                <div className={"flex flex-row gap-x-3"}>
                                                    <div className={"font-bold text-black text-[18px] font-sans"}>Contact: </div>
                                                    <div className={"text-black text-[18px] font-sans"}>{userContact}</div>
                                                </div>
                                                <div className={"flex flex-row gap-x-3"}>
                                                    <div className={"font-bold text-black text-[18px] font-sans"}>Address: </div>
                                                    <div className={"text-black text-[18px] font-sans"}>{userProfileAddress}</div>
                                                </div>

                                                <div className="w-full border-[1px] border-black shadow-lg" />

                                                {targetPatientRecords.map((ele, index) => {
                                                    return (
                                                        <div className={"flex flex-col w-full border-dashed border-gray-500 border-2 p-5"} key={'record' + index.toString()}>
                                                            <div className={"flex flex-row gap-x-3"}>
                                                                <div className={"font-bold text-teal-700 text-[18px] font-sans w-[130px]"}>Date of Visit: </div>
                                                                <div className={"text-black text-[18px] font-sans"}>{parse_time(ele.date_of_visit)}</div>
                                                            </div>
                                                            <div className={"flex flex-row gap-x-3"}>
                                                                <div className={"font-bold text-teal-700 text-[18px] font-sans w-[130px]"}>Doctor: </div>
                                                                <div className={"text-black text-[18px] font-sans"}>{getDoctorNameByValue(ele.doctor_account_name)}</div>
                                                            </div>
                                                            {/*<div className={"flex flex-row gap-x-3"}>*/}
                                                            {/*    <div className={"font-bold text-teal-700 text-[18px] font-sans w-[130px]"}>Location: </div>*/}
                                                            {/*    <div className={"text-black text-[18px] font-sans"}>{ele.}</div>*/}
                                                            {/*</div>*/}
                                                            <div className={"flex flex-col w-full gap-x-3 "}>
                                                                <div className={"font-bold text-teal-700 text-[18px] font-sans w-[130px]"}>Symptom</div>
                                                                <div className={"text-black text-[18px] font-sans"}>{ele.symptom}</div>
                                                            </div>

                                                            <div className={"flex flex-col w-full gap-x-3 pt-7"}>
                                                                <div className={"font-bold text-teal-700 text-[18px] font-sans w-auto"}>Diagnosis</div>
                                                                <div className={"text-black text-[18px] font-sans"}>{ele.diagnosis}</div>
                                                            </div>

                                                            <div className={"flex flex-col w-full gap-x-3 pt-7"}>
                                                                <div className={"font-bold text-teal-700 text-[18px] font-sans w-auto"}>Medication</div>
                                                                <div className={"text-black text-[18px] font-sans"}>
                                                                    {ele.Medication}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

            <div className={"bg-white min-h-screen flex flex-col relative"}>
                <header className="absolute inset-x-0 top-0 z-50 bg-[#316798] shadow-xl">
                    <div className="mx-auto flex flex-row justify-between">
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
                        <div className={"pt-5 pb-2 pr-5 text-md font-semibold text-white cursor-pointer"} onClick={logout}>Log Out</div>
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
                                    Welcome Back, <br />Doctor <span className={"text-[33px] font-mono font-semibold text-[#FFCBA5] underline decoration-solid"}>{userProfile.first_name + ' ' + userProfile.last_name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"min-h-[950px] flex justify-center "}>
                    <div className={"w-[1080px] min-h-[389px] flex flex-col gap-y-5"}>

                        <div className={"min-w-full min-h-[329px] flex flex-col items-center"}>
                            <div className={"flex flex-row pt-5 pl-2 justify-between w-full"}>
                                <div className={"text-[22px] font-sans font-semibold text-amber-600"}>
                                    View Your Upcoming <br />Appointment
                                </div>
                            </div>

                            {
                                userAppointmentList.map((ele, index) => {
                                    if (ele.status === 0) {
                                        return (
                                            <div className={"pt-5 w-[95%] flex flex-col gap-y-5"} key={"app" + index.toString()}>
                                                <div className="w-full border-t border-gray-300 shadow-lg" />

                                                <div className={"flex flex-col w-full pt-5"}>
                                                    <div className={"flex flex-row gap-x-3"}>
                                                        <div className={"font-bold text-[#5C90B6] text-[18px] font-sans w-[80px]"}>Time: </div>
                                                        <div className={"text-black text-[18px] font-sans"}>{parse_time(ele.datetime)}</div>
                                                    </div>
                                                    <div className={"flex flex-row gap-x-3"}>
                                                        <div className={"font-bold text-[#5C90B6] text-[18px] font-sans w-[80px]"}>Patient: </div>
                                                        <div className={"text-black text-[18px] font-sans"}>{getPatientNameByValue(ele.patient_account_name)}</div>
                                                    </div>
                                                    <div className={"flex flex-row gap-x-3"}>
                                                        <div className={"font-bold text-[#5C90B6] text-[18px] font-sans w-[80px]"}>Location: </div>
                                                        <div className={"text-black text-[18px] font-sans"}>{ele.location}</div>
                                                    </div>
                                                    <div className={"flex flex-row gap-x-3"}>
                                                        <div className={"font-bold text-[#5C90B6] text-[18px] font-sans w-[80px]"}>Message: </div>
                                                        <div className={"text-black text-[18px] font-sans"}>{ele.message}</div>
                                                    </div>

                                                    <div className={"flex flex-row justify-end gap-x-3 pt-[50px]"}>
                                                        <div
                                                            onClick={()=>{
                                                                appointmentCompleteClick(index)
                                                            }}
                                                            className="cursor-pointer  rounded-md bg-teal-600 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                                                        >
                                                            Complete
                                                        </div>
                                                        <div
                                                            onClick={()=>{
                                                                recordCreateClick(index)
                                                            }}
                                                            className="cursor-pointer  rounded-md bg-teal-600 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                                                        >
                                                            Create Record
                                                        </div>
                                                        <div
                                                            onClick={()=>{
                                                                viewRecordButtonClick(index)
                                                            }}
                                                            className="cursor-pointer  rounded-md bg-sky-600 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
                                                        >
                                                            View Profile
                                                        </div>
                                                        <div
                                                            onClick={()=>{
                                                                appointmentRescheduleClick(index)
                                                            }}
                                                            className="cursor-pointer  rounded-md bg-amber-600 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-amber-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
                                                        >
                                                            Reschedule
                                                        </div>
                                                        <div
                                                            onClick={() => {appointmentCancelClick(index)}}
                                                            className="cursor-pointer  rounded-md bg-red-600 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                                                        >
                                                            Cancel
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        )
                                    }
                                })
                            }

                        </div>

                        <div className="w-full border-[1px] border-[#316798] shadow-lg" />

                        <div className={"min-w-full min-h-[329px] flex flex-col items-center"}>
                            <div className={"flex flex-row pt-5 pl-2 justify-between w-full"}>
                                <div className={"text-[22px] font-sans font-semibold text-amber-600"}>
                                    Completed Appointment
                                </div>
                            </div>

                            {
                                userAppointmentList.map((ele, index) => {
                                    if (ele.status === 1) {
                                        return (
                                            <div className={"pt-5 w-[95%] flex flex-col gap-y-5"} key={"app" + index.toString()}>
                                                <div className="w-full border-t border-gray-300 shadow-lg" />

                                                <div className={"flex flex-col w-full pt-5"}>
                                                    <div className={"flex flex-row gap-x-3"}>
                                                        <div className={"font-bold text-[#5C90B6] text-[18px] font-sans w-[80px]"}>Time: </div>
                                                        <div className={"text-black text-[18px] font-sans"}>{parse_time(ele.datetime)}</div>
                                                    </div>
                                                    <div className={"flex flex-row gap-x-3"}>
                                                        <div className={"font-bold text-[#5C90B6] text-[18px] font-sans w-[80px]"}>Patient: </div>
                                                        <div className={"text-black text-[18px] font-sans"}>{getPatientNameByValue(ele.patient_account_name)}</div>
                                                    </div>
                                                    <div className={"flex flex-row gap-x-3"}>
                                                        <div className={"font-bold text-[#5C90B6] text-[18px] font-sans w-[80px]"}>Location: </div>
                                                        <div className={"text-black text-[18px] font-sans"}>{ele.location}</div>
                                                    </div>
                                                    <div className={"flex flex-row gap-x-3"}>
                                                        <div className={"font-bold text-[#5C90B6] text-[18px] font-sans w-[80px]"}>Message: </div>
                                                        <div className={"text-black text-[18px] font-sans"}>{ele.message}</div>
                                                    </div>

                                                    <div className={"flex flex-row justify-end gap-x-3 pt-[50px]"}>
                                                        <div
                                                            onClick={()=>{
                                                                recordCreateClick(index)
                                                            }}
                                                            className="cursor-pointer  rounded-md bg-teal-600 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                                                        >
                                                            Create Record
                                                        </div>
                                                        <div
                                                            onClick={()=>{
                                                                viewRecordButtonClick(index)
                                                            }}
                                                            className="cursor-pointer  rounded-md bg-sky-700 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
                                                        >
                                                            View Profile
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        )
                                    }
                                })
                            }

                        </div>

                        <div className="w-full border-[1px] border-[#316798] shadow-lg" />

                        <div className={"min-w-full min-h-[329px] flex flex-col items-center"}>
                            <div className={"flex flex-row pt-5 pl-2 justify-between w-full"}>
                                <div className={"text-[22px] font-sans font-semibold text-amber-600"}>
                                    Canceled Appointment
                                </div>
                            </div>

                            {
                                userAppointmentList.map((ele, index) => {
                                    if (ele.status === -1) {
                                        return (
                                            <div className={"pt-5 w-[95%] flex flex-col gap-y-5"} key={"app" + index.toString()}>
                                                <div className="w-full border-t border-gray-300 shadow-lg" />

                                                <div className={"flex flex-col w-full pt-5"}>
                                                    <div className={"flex flex-row gap-x-3"}>
                                                        <div className={"font-bold text-[#5C90B6] text-[18px] font-sans w-[80px]"}>Time: </div>
                                                        <div className={"text-black text-[18px] font-sans"}>{parse_time(ele.datetime)}</div>
                                                    </div>
                                                    <div className={"flex flex-row gap-x-3"}>
                                                        <div className={"font-bold text-[#5C90B6] text-[18px] font-sans w-[80px]"}>Patient: </div>
                                                        <div className={"text-black text-[18px] font-sans"}>{getPatientNameByValue(ele.patient_account_name)}</div>
                                                    </div>
                                                    <div className={"flex flex-row gap-x-3"}>
                                                        <div className={"font-bold text-[#5C90B6] text-[18px] font-sans w-[80px]"}>Location: </div>
                                                        <div className={"text-black text-[18px] font-sans"}>{ele.location}</div>
                                                    </div>
                                                    <div className={"flex flex-row gap-x-3"}>
                                                        <div className={"font-bold text-[#5C90B6] text-[18px] font-sans w-[80px]"}>Message: </div>
                                                        <div className={"text-black text-[18px] font-sans"}>{ele.message}</div>
                                                    </div>
                                                </div>

                                            </div>
                                        )
                                    }
                                })
                            }

                        </div>

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
