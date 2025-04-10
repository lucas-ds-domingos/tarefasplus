import { ChangeEvent, FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { db } from "@/src/services/firebaseConnection";
import {doc, collection, query, where, getDoc, addDoc, getDocs, deleteDoc} from 'firebase/firestore'
import { Textarea } from "@/src/components/textarea";
import { FaTrash } from "react-icons/fa";

interface TaskProps{
    item:{
        tarefa:  string;
        created: string;
        public:  boolean;
        user:    string;
        taskId:  string
    };
    allComments:CommentsProps[]
}

interface CommentsProps{
    comment:string,
    id:     string,
    taskId: string,
    user:   string,
    name:   string
}

export default function Task({item, allComments}: TaskProps){
  
    const {data: session} = useSession();
    const [input, setInput] = useState("");
    const [comments, setComments] = useState<CommentsProps[]>(allComments || [])

    async function handleComent(event: FormEvent){
        event.preventDefault();

        if(input === "") return;

        if (!session?.user?.email || !session?.user?.name) return;

        try{
            const docRef = await addDoc(collection(db, "comments"),{
                comment: input,
                created: new Date(),
                user: session?.user?.email,
                name: session?.user?.name,
                taskId: item?.taskId
            });

            const data = { 
                id: docRef.id,
                comment: input,
                user: session?.user?.email,
                name: session?.user?.name,
                taskId: item?.taskId
            }
            setComments((oldItem) => [...oldItem, data])
            setInput("")
        }catch(err){
            console.log(err);
        }
    }  
    
    async function handleDeleteComment(id: string){
        try{
            const docRef = doc(db, "comments", id)
            await deleteDoc(docRef);

            const deletComment = comments.filter((item) => item.id !== id )

            setComments(deletComment)
        }catch(err){
            console.log(err);
        }   
    
    }
  return(
  <div
    className="w-full max-w-[1024px] mt-[40px] mx-auto px-[18px] flex flex-col justify-center items-center"
  >
        <Head>
            <title>Detalhes da tarefa</title>
        </Head>

        <main 
         className=" w-full"
        >
            <h1
                className="mb-[14px] text-3xl"
            >
            Tarefa</h1>
            <article 
                className="mb-[14px] leading-[150%] flex flex-col  border-[1.5px] border-[#909090] rounded-[4px] p-[14px] items-center justify-center"
            >
                <p
                className="whitespace-pre-wrap w-full"
                >
                    {item.tarefa}
                </p>
            </article>
        </main>

        <section
            className="w-full my-[18px] max-w-[1024px]"
        >
            <h2
                className="my-[14px]"
            >
            Deixar comentário</h2>
            <form
                onSubmit={handleComent}
            >
                <Textarea
                    value={input}
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setInput(event.target.value) }
                    placeholder="Digite seu comentário..."
                    className="w-full resize-none h-[160px] rounded-[8px] outline-none p-[8px] bg-[#FFF] border-[1.5px] border-[#909090]"
                />
                <button
                    className="w-full py-[12px] rounded-[4px] bg-[#3183ff] text-[#fff] text-[18px] 
                               cursor-pointer my-[12px] disabled:cursor-not-allowed disabled:bg-[rgba(49,131,255,0.47)]"
                    disabled={!session?.user}
                >
                Enviar comentário
                </button>
            </form>
        </section>
        <section
        className="w-full max-w-[1024px]"
        >
            <h2>Todos comentários</h2>
            {comments.length === 0 && (
                <span>Nenhum comentário foi encontrado...</span>
            )}

            {comments.map((item) => (
                <article
                    key={item.id}
                    className="border-[1px] border-[#ddd] p-[14px] rounded-[4px] mb-[14px]"
                >
                    <div
                        className="flex items-center"
                    >
                        <label
                            className="bg-[#ccc] py-[4px] px-[8px] mr-[8px] rounded-[4px]"
                        >
                        {item.name}
                        </label>
                    {item.user === session?.user?.email &&(
                        <button
                            className="cursor-pointer"
                            onClick={() => handleDeleteComment(item.id)}
                        >
                        <FaTrash
                        size={18}
                        color="#ea3140"
                        />
                        </button>
                    )}
                    </div>
                    <p
                        className="mt-[14px] whitespace-pre-wrap"
                    >
                    {item.comment}</p>
                </article>
            ))}
        </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({params}) => {
    const id = params?.id as string
    const docRef = doc(db, "tarefas", id)
    const q = query(collection(db,"comments"), where("taskId", "==", id))
    const snapshotComments = await getDocs(q)

    let allComments: CommentsProps[] = [];
    snapshotComments.forEach((doc) =>{
        allComments.push({
            id: doc.id,
            comment: doc.data().comment,
            user: doc.data().user,
            name:doc.data().name,
            taskId: doc.data().taskId
        })
    })

    console.log(allComments)

    const snapshot = await getDoc(docRef)
    if (snapshot.data() === undefined){
        return {
            redirect: {
                destination:"/",
                permanent: false
            }
        };
    }

    if(!snapshot.data()?.public){
        return {
            redirect: {
                destination:"/",
                permanent: false
            }
        };
    }

    const miliseconds = snapshot.data()?.created?.seconds * 1000;
    const task = {
        tarefa:  snapshot.data()?.tarefa,
        public:  snapshot.data()?.public,
        created: new Date(miliseconds).toLocaleDateString(),
        user:    snapshot.data()?.user,
        taskId:  id,
    }
    return{
        props: {
            item: task,
            allComments: allComments,
        }
    }
}