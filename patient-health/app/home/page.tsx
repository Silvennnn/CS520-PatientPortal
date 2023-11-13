import Image from 'next/image'
import React from "react";
import Link from 'next/link';


//     <a href="#" className="-m-1.5 p-1.5">
//     <span className="sr-only">PatientHealth</span>
// <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-brand-hexo"
//      width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
//      fill="#009988" strokeLinecap="round" strokeLinejoin="round">
//     <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
//     <path
//         d="M19.875 6.27c.7 .398 1.13 1.143 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z"/>
//     <path d="M9 8v8"/>
//     <path d="M15 8v8"/>
//     <path d="M9 12h6"/>
// </svg>
// </a>
export default function Home() {
    return (
        // <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white">
        //   <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        //         Page
        //   </div>
        // </main>
        <div className={"bg-white min-h-screen"}>
            <header className="absolute inset-x-0 top-0 z-50">
                <div className="mx-auto">
                    <div className="pt-6 lg:max-w-4xl lg:pl-8 lg:pr-0">
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

            <div className="relative min-h-screen">
                <div className="mx-auto max-w-7xl">
                    <div className="relative z-10 pt-14 lg:w-full lg:max-w-4xl">
                        <svg
                            className="absolute inset-y-0 right-[260px] hidden h-full w-80 translate-x-1/2 transform fill-white lg:block"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                            aria-hidden="true"
                        >
                            <polygon points="0,0 90,0 50,100 0,100" />
                        </svg>

                        <div className="relative px-6 py-32 sm:py-40 lg:px-1 lg:py-56 lg:pr-0">
                            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
                                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                    Looking for your patient portal?
                                </h1>
                                <div className="text-xl pt-10 font-bold tracking-tight text-black">
                                    Manage your patient profile and make appointment <br /><span className={"text-teal-600 underline decoration-wavy "}>Anytime, Anywhere</span> with <span className={"text-teal-600 underline decoration-wavy "}>PatientHealth</span>
                                </div>
                                <div className="mt-5 flex items-center gap-x-6">
                                    <Link
                                        href="/register"
                                        className="rounded-md bg-teal-600 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                                    >
                                        Register
                                    </Link>
                                    <Link href="/login" className="text-lg font-semibold leading-6 text-gray-900 hover:text-teal-600">
                                        Login <span aria-hidden="true">→</span>
                                    </Link>
                                </div>

                                <div className="mt-20 text-lg leading-8 text-gray-600">
                                    PatientHealth, the free app that allows you to:
                                    <ul className="list-disc">
                                        <li>Access your patient profile anytime, anywhere</li>
                                        <li>View all your medical records online</li>
                                        <li>Never worry about missing paper report</li>
                                        <li>Make appointment with your doctors</li>
                                        <li>And More ...</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <img
                        className="aspect-[3/2] object-cover lg:aspect-auto lg:h-full lg:w-full"
                        src="patient.pdf"
                        alt=""
                    />
                </div>
            </div>

        </div>
    )
}
