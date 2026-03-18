"use client"
import { useContext, useEffect, useMemo, useState } from "react"
import styles from './Button.module.css'
import { useRouter, useSearchParams } from "next/navigation"

type ButtonProps = {
    props: number 
}

export default function Pagination(numOfPages: ButtonProps){
    const [currentPage, setCurrentPage] = useState(1);
    const [currentRow, setCurrentRow] = useState(0);

    const searchParams = useSearchParams();
    const pageParam = searchParams.get("page")

    const router = useRouter();
    const numOfRows = Math.ceil(numOfPages.props / 3);

    const arr: number[][] = useMemo(() => {
    const arr: number[][] = [];
    let number = 1;

    for (let row = 0; row < numOfRows; row++) {
    arr[row] = new Array(3);

    let index = 0;
    while (number <= numOfPages.props && index < 3) {
      arr[row][index] = number;
      number++;
      index++;
    }
    }

    return arr;
    }, [numOfPages.props, numOfRows]);

    const pageRowMap = useMemo(() => {
        const map: Record<number, number> = {}

        arr.forEach((row, rowIndex) => {
        row.forEach((value) => {
        map[value] = rowIndex
        })
    })

  return map
}, [arr])

    useEffect(() => {

    if(pageParam == null){
    router.replace('/?page=1&filters=&maxPrice=&search=');
    }
    
    if(pageParam != null){

    const defaultPage = ()=>{setCurrentPage(Number(pageParam))
    const rowIndex = pageRowMap[Number(pageParam)];
    setCurrentRow(rowIndex)
    }

    defaultPage()
    }

    }, [searchParams]);

    const nextPage = () =>{

        if(currentPage != numOfPages.props){
            const index = arr[currentRow].lastIndexOf(currentPage);

            if(index == 2 && currentRow != numOfRows){
                setCurrentPage(currentPage+1)
                setCurrentRow(currentRow+1)
            }

            else if(index < 2){
                setCurrentPage(currentPage+1);
            }
            
            const params = new URLSearchParams(searchParams.toString())
            params.set("page", (currentPage + 1).toString())

            router.push(`?${params.toString()}`)
          }

        }
        const prevPage = () =>{

        if(currentPage != 1){
            const index = arr[currentRow].lastIndexOf(currentPage);

            if(index == 0 && currentRow != 0){
                setCurrentPage(currentPage-1)
                setCurrentRow(currentRow-1)
            }

            else if(index >= 1){
                setCurrentPage(currentPage-1);
            }

            const params = new URLSearchParams(searchParams.toString())
            params.set("page", (currentPage -1).toString())

            router.push(`?${params.toString()}`)
          }

        }

        const mystyle = {

            backgroundColor: "#007BFF",
            color: "white"
        }
        
        const click = (page: number)=>{
            setCurrentPage(page)

            const params = new URLSearchParams(searchParams.toString())
            params.set("page", (page).toString())

            router.push(`?${params.toString()}`)
        }

    return(
        <>
        {numOfPages.props > 1 && <div style={{margin:0, paddingBottom: "10px", paddingTop: "15px", textAlign: "center"}}>
            {currentPage != 1 && <button className ={styles.pageNumber} onClick={prevPage}>prev</button>}
            
            {arr[currentRow].map((page,index) => 
            <button className = {styles.pageNumber} key={index} onClick = {()=>click(page)} style={currentPage == page ? mystyle: {}}>{page} </button>
            )}

            {currentPage != numOfPages.props && numOfPages.props != 1 && <button className = {styles.pageNumber} onClick={nextPage}>next</button>}
        </div>}
        </>
    );
}





