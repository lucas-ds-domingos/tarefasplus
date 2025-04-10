import Head from "next/head"; 
import Image from "next/image";
import Heroimg from "../../public/assets/hero.png"
import { GetStaticProps } from "next";
import { collection, getDoc, getDocs} from "firebase/firestore";
import { db } from "../services/firebaseConnection";

interface HomeProps{
  posts:    number;
  comments: number;
}

export default function Home({posts, comments}: HomeProps) {
  return (
    <div 
      className="bg-[#0f0f0f] w-full h-[calc(100vh-76px)] flex justify-center items-center flex-col"
    >
      <Head>
        <title>Tarefas+</title>
      </Head>
      <main>
        <div 
          className=" flex flex-col items-center justify-center"
        >
          <Image 
            alt="Logo Tarefas+"
            src={Heroimg}
            priority
            className="w-[480px] min-w-[240px] h-auto object-contain" 
          />
        </div>
        <h1 
          className="text-[#FFF] text-center m-[20px] leading-[150%] text-lg"
        >
          Sistema feito para você organizar <br/> seus estudos e tarefas
        </h1>

        <div 
          className="flex items-center justify-around "
        >
          <section 
            className="bg-[#fafafa] px-[44px] py-[14px] rounded-[4px] transition-[0.4s]  hover:scale-[1.08]"
          >
            <span>
              +{posts} posts
            </span>
          </section>
          <section
            className="bg-[#fafafa] px-[44px] py-[14px] rounded-[4px] transition-[0.4s]  hover:scale-[1.08]"
          >
            <span>
              +{comments} comentarios
            </span>
          </section> 
        </div>
      </main>
    </div>
  );
}


export const getStaticProps: GetStaticProps = async () => {
   const commentRef = collection(db, "comments")
   const postRef = collection(db, "tarefas")
   const commentSnapshot = await getDocs(commentRef)
   const postSnapshot = await getDocs(postRef)

   return{
    props:{
      posts: postSnapshot.size || 0,
      comments: commentSnapshot.size || 0
    },
    revalidate: 60,
   }
}
