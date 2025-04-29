import { GetServerSideProps } from "next"
import { ChangeEvent, FormEvent, useState, useEffect } from "react";   
import Head from "next/head"
import { getSession } from "next-auth/react"    
import { getServerSession } from "next-auth";
import { authOptions } from '../api/auth/[...nextauth]';
import { Textarea } from "../../components/textarea/index";
import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { db } from "@/src/services/firebaseConnection";
import { addDoc, collection, query, orderBy, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";    
import Link from "next/link";
import toast from "react-hot-toast";


interface HomePros{
    user:{
        email: string;
    }
}

interface TaskProps{
    id:         string;
    created:    Date;
    public:     boolean;
    tarefa:     string;
    user:       string;
}

export default function Dashboard({ user }: HomePros){
    const [input, setInput] = useState("")
    const [publicTask, setPublictask] = useState(false)
    const [task, setTask] = useState<TaskProps[]>([])
    useEffect (() =>{
        async function loadTaredas() {

            const tarefasRef = collection ( db, "tarefas")
            const q = query(
                tarefasRef,
                orderBy("created", "desc"),
                where("user", "==", user?.email)
            )
            
            onSnapshot(q, (snapshot) => {
                let lista = [] as TaskProps[];

                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        tarefa: doc.data().tarefa,
                        created: doc.data().created,
                        user: doc.data().user,
                        public: doc.data().public
                    })
                });
                console.log(lista)
                setTask(lista);
            })
        }
        loadTaredas();
    },[user?.email]);
    function handleChangePublic(event: ChangeEvent<HTMLInputElement>) {
        setPublictask(event.target.checked);
      }

    async function handleRegisterTask(event: FormEvent){
        event.preventDefault();

        if (input === "") return;
        
        try{
            await addDoc(collection(db, "tarefas"),{
                tarefa: input,
                created: new Date(),
                user: user?.email,
                public: publicTask
            });
            setInput("")
            setPublictask(false);
        }catch(err){
            console.log(err);
        }
    }

     async function handleShare(id: string){
        await navigator.clipboard.writeText(
            `${process.env.NEXT_PUBLIC_URL}/task/${id}`
        ) 
        toast.success('Link Copiado!')
    }

    async function handleDeleteTask(id: string){
        const docRef = doc(db, "tarefas" , id)
        await deleteDoc(docRef)
    }


    return(
        <div 
            className="w-full"    
        >
        <Head>
            <title>Meu painel de tarefas</title>
        </Head>
        <main>

            <section 
                className="bg-[#0f0f0f] w-full flex items-center justify-center"
            >
                <div
                    className="w-full max-w-[1024px] pt-0 pr-[18px] pb-[28px] pl-[18px] mt-[18px]"
                >
                    <h1
                        className="text-[#FFF] mb-2 text-2xl"
                    >
                    Qual a sua tarefa?
                    </h1>
                        <form onSubmit={handleRegisterTask}>
                            <Textarea
                            placeholder="Digite qual sua tarefa..."
                            value={input}
                            onChange={(event: ChangeEvent <HTMLTextAreaElement>) => setInput(event.target.value)}
                            />
                            <div
                                className="my-[14px]"
                            >
                                <input 
                                    className="w-[18px] h-[18px]"
                                    type="checkbox" 
                                    checked={publicTask}
                                    onChange={handleChangePublic}
                                />
                                <label
                                    className="ml-[8px] text-[#fff]"
                                >
                                Deixar tarefa publica?
                                </label>
                            </div>
                            <button 
                                type="submit"
                                className="w-full border-[0] bg-[#3183ff] text-[#fff] rounded-[4px] py-[12px] text-[18px]"
                            >
                                Registrar
                            </button>
                        </form>border border-[1.5px] border-[#909090]
                </div>
            </section>
            <section
                className="mt-[34px] mx-auto mb-0 py-0 px-[18px] w-full max-w-[1024px] flex flex-col "
            >
                <h1
                    className="text-center text-3xl mb-[14px]"
                >Minhas tarefas</h1>
            {task.map((item) => (
                <article
                    key={item.id}
                    className="mb-[14px] leading-[150%] flex flex-col  border-[1.5px] border-[#909090] rounded-[4px] p-[14px] items-start"
            >
                {item.public && (
                    <div
                    className="flex items-center  justify-center mb-[8px] "
                >
                    <label
                        className="bg-[#3183ff] py-[2px] px-[6px] text-[#fff] text-[12px] rounded-[4px] "
                    >
                    PUBLICO
                    </label>
                    <button>
                        <FiShare2
                            size={22}
                            color="#3183ff"
                            className="mx-[8px] cursor-pointer"
                            onClick={( ) => handleShare(item.id)}
                        />
                    </button>
                </div>
                )}
                <div
                    className="flex items-center justify-between w-full"
                >
                    {item.public ? (
                        <Link href={`/task/${item.id}`}>
                        <p
                            className="whitespace-pre-wrap"
                        >
                        {item.tarefa}
                        </p>
                        </Link>
                    ): (
                        <p
                        className="whitespace-pre-wrap"
                        >
                        {item.tarefa}
                        </p>
                    )}
                    <button
                    className="cursor-pointer mx-[8px]"
                    onClick={() => handleDeleteTask(item.id)}
                    >
                        <FaTrash
                        size={24}
                        color="#ea3140"
                        />
                    </button>
                </div>
            </article>
            ))}
            </section>
        </main>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);
  
    if (!session?.user) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
  
    return {
      props: {
        user: {
            email: session?.user?.email,
        }
      },
    };
  };