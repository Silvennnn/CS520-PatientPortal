"use client";
import React, {Fragment, useRef, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {login_call} from "@/api/log_in";
import { getCookie, setCookie } from 'typescript-cookie'
import {redirect} from "next/navigation";

export default function Login() {
    const [account, setAccount] = useState('')
    const [psw, setPsw] = useState('')
    const signInButtonClick = async () => {
        // let login_result =
        if (account === '' || psw === '') {
            setMode('empty')
            setWindowOpen(true)
        }
        console.log("login")
        let data = {
            "account_name": account,
            "password": psw,
        }
        // login_call(data);
        try {
            let response = await login_call(data);
            console.log(response);
            if (response.status === 401) {
                setMode("incorrect")
                setWindowOpen(true)
            } else {
                // Login success
                const data = response.json().then(
                   e => {
                       let account_type = e.account_type
                       let access_token = e.access_token
                       setCookie("access_token", access_token)
                       setCookie("account_type", account_type)
                       if (account_type === 1) {
                           // if doctor
                           window.location.replace('/user/doctor')
                       } else {
                           // if patient
                           window.location.replace('/user/patient')
                       }

                   }
                )
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    }

    const [mode, setMode] = useState('')
    const [windowOpen, setWindowOpen] = useState(false)
    const cancelButtonRef = useRef(null)
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
                                        mode == 'empty' && (
                                            <div>
                                                <div>
                                                    <div className="mt-3 text-center sm:mt-5">
                                                        <Dialog.Title className="text-base font-semibold text-gray-900">
                                                            Account or password is empty!
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
                                        mode == 'incorrect' && (
                                            <div>
                                                <div>
                                                    <div className="mt-3 text-center sm:mt-5">
                                                        <Dialog.Title className="text-base font-semibold text-gray-900">
                                                            Account or password is incorrect! Please try again
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
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

            <div className={"bg-gray-50 min-h-screen"}>
                <div className="flex min-h-screen flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 ">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <div className="flex items-center justify-center gap-x-1">
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
                            <p className="font-mono text-teal-600 font-bold text-lg">PatientHealth</p>
                        </div>
                        <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Sign in to your account
                        </h2>
                    </div>

                    <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-[480px]">
                        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
                            <form className="space-y-6" action="#" method="POST">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                        Account
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="account"
                                            name="text"
                                            type="text"
                                            required
                                            value={account}
                                            onChange={e => {
                                                setAccount(e.target.value)
                                            }}
                                            className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                        Password
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            value={psw}
                                            onChange={e => {
                                                setPsw(e.target.value)
                                            }}
                                            className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        />
                                        <label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-gray-900">
                                            Remember me
                                        </label>
                                    </div>

                                    <div className="text-sm leading-6">
                                        <a href="#" className="font-semibold text-teal-600 hover:text-teal-500">
                                            Forgot password?
                                        </a>
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        onClick={signInButtonClick}
                                        className="flex w-full justify-center rounded-md bg-teal-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                                    >
                                        Sign in
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Not a member?{' '}
                        <a href="/register" className="font-semibold leading-6 text-teal-600 hover:text-teal-500">
                            Register today!
                        </a>
                    </p>
                </div>
            </div>
        </>
    )
}
