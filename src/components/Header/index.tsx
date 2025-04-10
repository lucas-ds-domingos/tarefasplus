import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react";    

export function Header(){

    const {data: session, status} = useSession();
    const [buttonText, setButtonText] = useState("Acessar");
    const [userText, setUserText] = useState(session?.user?.name || "");


    return(
        <header
            className="w-full h-[76px] bg-[#0f0f0f] flex items-center justify-center"
        >
            <section
                className=" w-full max-w-[1024px] flex items-center py-0 px-3 justify-between"
            >
                <nav 
                    className="flex items-center"
                >
                    <Link 
                        href="/"
                    >
                    <h1 
                        className="text-[#fff] text-3xl"
                    >
                    Tarefas 
                    <span
                    className="text-[#ea3140] ps-[2px]"
                    >
                    +
                    </span>
                    </h1>
                    </Link>
                    { status === "loading" ?(
                        <></>
                    ): session ? (
                        <Link 
                        href="/dashboard"
                        className="bg-[#f1f1f1] text-[#0f0f0f] px-[14px] py-[4px] rounded-[6px] ml-[14px]"
                    >
                        Meu Painel
                    </Link>
                    ): (
                        <></>
                    )}
                </nav>
                { status === "loading" ? (
                    <></>
                ) : session ? (
                    <button
                    className="bg-transparent py-[8px] px-[32px] rounded-[24px] text-[#fff] border-[1.5px] 
                             border-[#fff] cursor-pointer transition-all duration-300 ease-in-out 
                               hover:scale-105 hover:bg-[#fff] hover:text-[#0f0f0f]"
                    onClick={ () => signOut()}
                    onMouseEnter={() => setUserText("Sair da conta?")}
                >
                    {session?.user?.name}
                </button>
                ): (
                    <button
                    className="bg-transparent py-[8px] px-[32px] rounded-[24px] text-[#fff] border-[1.5px] 
                             border-[#fff] cursor-pointer transition-all duration-300 ease-in-out 
                               hover:scale-105 hover:bg-[#fff] hover:text-[#0f0f0f]"
                    onClick={() => signIn("google")}
                    onMouseEnter={() => setButtonText("Entrar com Google")}
                    onMouseLeave={() => setButtonText("Acessar")}
                >
                    {buttonText}
                </button>
                )}
            </section>
        </header>
    )
}