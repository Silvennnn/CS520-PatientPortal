"use client";
import React, {useState} from "react";
import {registerUser} from "@/api/profile";
import {User} from "@/api/profile";

export default function Registry() {

    const account_type_option = [
        { value: 0, label: "Patient Account"},
        { value: 1, label: "Doctor Account"},
    ]

    const getAccountTypeNumByLabel = (label) => {
        const account = account_type_option.find(account => account.label === label);
        return account.value
    }

    const [address, setAddress] = useState('');
    const [accountName, setAccountName] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('male')
    const [dateOfBirth, setDateOfBirth] = useState('')


    const [accountType, setAccountType] = useState(account_type_option[0].label)

    const buttonClick = () => {
        console.log("123")
    }
    const submitButtonClick = async () => {
        console.log(accountType)
        let data = {
              "account_name": accountName,
              "password": password,
              "account_type": getAccountTypeNumByLabel(accountType),
              "first_name": firstName,
              "last_name": lastName,
              "middle_name": '',
              "phone_number": phone,
              "date_of_birth": dateOfBirth,
              "gender": gender,
              "address": address,
        }
        console.log(data)
        try{
            const response = await registerUser(data);
            console.log(response);
            if(response.status == 422){
                console.log("error");
            }
            else{
                console.log('User Registered');
                window.location.href = '/login';
            }

        }
        catch (error) {
            console.error('Error during login:', error);
        }
    }



    return (
        <>
            {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-50">
        <body class="h-full">
        ```
      */}
            <div className={"bg-gray-50 min-h-screen flex flex-row justify-center"}>
                <header className="inset-x-0 z-50">
                    <div className="mx-auto max-w-7xl">
                        <div className="px-6 pt-6 lg:max-w-2xl lg:pl-8 lg:pr-0">
                            <nav className="flex items-center justify-between lg:justify-start gap-x-1" aria-label="Global">
                                <a href="/" className="-m-1.5 p-1.5">
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
                                <p className="font-mono text-teal-600 font-bold text-lg">PatientHealth</p>

                                {/*<div className="hidden lg:ml-12 lg:flex lg:gap-x-14">*/}
                                {/*    {navigation.map((item) => (*/}
                                {/*        <a key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-gray-900">*/}
                                {/*            {item.name}*/}
                                {/*        </a>*/}
                                {/*    ))}*/}
                                {/*</div>*/}
                            </nav>
                        </div>
                    </div>
                </header>



                <div className="min-h-screen w-[1080px] mt-[100px] flex flex-col gap-y-10">
                    <div className={"text-3xl text-black max-w-3xl font-sans font-bold cursor-default"}>Registration</div>
                    <div className="mx-auto w-[1080px]">
                        <form>
                            <div className={"space-y-12"}>
                                <div className="grid grid-cols-1 gap-x-10 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                                    <div className={"w-full"}>
                                        <h2 className="text-base font-semibold leading-7 text-gray-900">Account Type</h2>
                                        <p className="mt-1 text-sm leading-6 text-gray-600">
                                            Are you Doctor or Patient?
                                        </p>
                                    </div>

                                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                                        <div className="sm:col-span-4">
                                            <select
                                                id="account_type"
                                                name="account_type"
                                                className="block w-2/3 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                defaultValue={account_type_option[0]["label"]}
                                                onChange={e => {
                                                    setAccountType(e.target.value)
                                                }}
                                            >
                                                {
                                                    account_type_option.map(e => (<option key={"account_type" + e.value}>{e["label"]}</option>))
                                                }
                                            </select>
                                        </div>


                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-x-10 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                                    <div className={"w-full"}>
                                        <h2 className="text-base font-semibold leading-7 text-gray-900">Account Information</h2>
                                        <p className="mt-1 text-sm leading-6 text-gray-600">
                                           Your email is your login credentials.
                                        </p>
                                    </div>

                                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                                        <div className="sm:col-span-4">
                                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                               Account Name
                                            </label>
                                            <div className="mt-2">
                                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                                    <input
                                                        id="accountName"
                                                        name="accountName"
                                                        type="input"
                                                        value={accountName}
                                                        onChange={e => {
                                                                setAccountName(e.target.value)
                                                            }
                                                        }
                                                        className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="sm:col-span-4">
                                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                                Password
                                            </label>
                                            <div className="mt-2">
                                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                                    <input
                                                        id="psw"
                                                        name="psw"
                                                        type="password"
                                                        value={password}
                                                        onChange={e => {
                                                            setPassword(e.target.value)
                                                        }
                                                        }
                                                        className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="sm:col-span-4">
                                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                                Re-Enter your password
                                            </label>
                                            <div className="mt-2">
                                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                                    <input
                                                        id="psw2"
                                                        name="psw2"
                                                        type="password"
                                                        value={password2}
                                                        onChange={e => {
                                                            setPassword2(e.target.value)
                                                        }
                                                        }
                                                        className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                                    <div>
                                        <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                                        <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>
                                    </div>

                                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                                        <div className="sm:col-span-3">
                                            <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                                First name
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    name="first-name"
                                                    id="first-name"
                                                    value={firstName}
                                                    onChange={e => {
                                                        setFirstName(e.target.value)
                                                    }
                                                    }
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                                                Last name
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    name="last-name"
                                                    id="last-name"
                                                    value={lastName}
                                                    onChange={e => {
                                                        setLastName(e.target.value)
                                                    }
                                                    }
                                                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>


                                        <div className="sm:col-span-3">
                                            <label htmlFor="gender" className="block text-sm font-medium leading-6 text-gray-900">
                                                Gender
                                            </label>
                                            <div className="mt-2">
                                                <select
                                                    id="gender"
                                                    name="gender"
                                                    value={gender}
                                                    onChange={e => {
                                                        setGender(e.target.value)
                                                    }
                                                    }
                                                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                                >
                                                    <option key={'male'} value={'male'}>Male</option>
                                                    <option key={'female'} value={'female'}>Female</option>
                                                    <option key={'other'} value={'other'}>other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="dob" className="block text-sm font-medium leading-6 text-gray-900">
                                                Date of Birth
                                            </label>
                                            <div className="mt-2">
                                                <input type="date" id="dob"
                                                value={dateOfBirth}
                                                onChange={e => {
                                                setDateOfBirth(e.target.value.toString())
                                             }
                                            }
                                                name="new_appointment_datetime" className="pl-3 block w-2/3 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>

                                            </div>
                                        </div>

                                        <div className="col-span-full">
                                            <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                                                Contact Number
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    name="phone"
                                                    id="phone"
                                                    value={phone}
                                                    onChange={e => {
                                                    setPhone(e.target.value)}
                                                    }
                                                    className="pl-2 block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="col-span-full">
                                            <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                                                Address
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    name="address"
                                                    id="address"
                                                    value={address}
                                                    onChange={e => {
                                                    setAddress(e.target.value)}
                                                    }
                                                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-x-6">
                                <button
                                    type="button"
                                    onClick={() => submitButtonClick()}
                                    className="cursor-pointer rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                                >
                                    Submit
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
