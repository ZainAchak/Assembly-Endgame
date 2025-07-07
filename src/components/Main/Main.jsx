import { useEffect, useRef, useState } from "react";
import styles from "./Main.module.css"
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'
import { generate, count } from "random-words";
import { languagesDescription,languagesPattren } from "../LanguagesDescription";

function makeObject(WordString) {
    return WordString.toUpperCase().split("").map((char)=>({
                id:crypto.randomUUID(),
                value:char,
                show:false}))
}


export default function Main() {
    //------------------------------- INITIALIZATIONS ---------------------------------
    const { width, height } = useWindowSize()
    const word = useRef(generate({ maxLength: 10 }).toUpperCase())
    // console.log(word.current)
    const counter = useRef(0)

    const userInputIndexes = useRef([]);
    const gameWon = useRef(false)
    const [gameOver,setGameOver] = useState(false)
    const [languages, setLanguages] = useState(languagesPattren)
    const [wordObj,setWordObj] = useState(()=>makeObject(word.current))
    const [keyboardChars,setKeyboardChars] = useState(()=>makeObject("ABCDEFGHIJKLMNOPQRSTUVWXYZ"))
    const languageDie = useRef(languagesDescription)

    useEffect(()=>{
        if(gameOver === true){
            setKeyboardChars(prev=>(
            prev.map((item)=>(
                {...item,show:true}
            ))
        ))}
    },[gameOver])
    // ################################################################################
    
    // ------------------------- UI Consts --------------------------------------------
    const languagesDisplay = languages.map((language)=>(
        <div 
            key={language.id}
            className={language.show ? styles.landDesc : styles.landDescOff}
            style={{backgroundColor:language.color}}>
            {language.show ? language.value :<><span>💀</span>{language.value}</>}
        </div>
    ))

    const wordBoxDisplay = wordObj.map((w)=>(
        <span key={w.id} className={styles.word}>{w.show ? w.value : ""}</span>
    ))

    const keyboardDisplay = keyboardChars.map((char)=>(
        <button 
            key={char.id}
            onClick={char.show ? ()=>{} : ()=>onKeyboardClick(char.value)}
            className={char.show ? styles.keyboardBtnOff : styles.keyboardBtn}>{char.value}</button>
    ))
    // ################################################################################


    // ------------------------- FUNCTIONS --------------------------------------------
    function onKeyboardClick(keyboardKey) {
        setWordObj(prev=>
            prev.map((item)=>{
                if(item.value === keyboardKey && item.show!=true){
                    return {...item,show:true}
                }
                return item
            })
        )

        if(word.current.indexOf(keyboardKey) === -1){
            counter.current = counter.current + 1
            // console.log(counter.current)
            if(counter.current <= 8){
                setLanguages(prev => prev.map((languageItem,index)=> (
                    index === counter.current - 1 ? {...languageItem,show:false} : languageItem
                )))
            }else{
                counter.current = counter.current - 1
                gameWon.current = false;
                setGameOver(true)
            }
        }

        setKeyboardChars(prev=>
            prev.map((item)=>{
                if(item.value === keyboardKey){
                    return {...item,show:true}
                }
                return item
            })
        )

        userInputIndexes.current.push(
                    word.current.split("")
                    .map((char, index) => (char === keyboardKey ? index : -1))
                    .filter(index => index !== -1));
        userInputIndexes.current = userInputIndexes.current.flat()
                
        if(userInputIndexes.current.length === wordObj.length){
            gameWon.current = true;
            setGameOver(true)
        }
    }

    function restartGame() {
        word.current = generate({ maxLength: 10 }).toUpperCase()
        counter.current = 0
        userInputIndexes.current = []
        gameWon.current = false
        setGameOver(false)
        setLanguages(languagesPattren)
        setWordObj(()=>makeObject(word.current))
        setKeyboardChars(()=>makeObject("ABCDEFGHIJKLMNOPQRSTUVWXYZ"))
        languageDie.current = languagesDescription
    }
    // ################################################################################


    return(
        <>
            {gameWon.current && <Confetti width={width} height={height}/>}
            <main>
                <div
                    style={{opacity: gameOver && !gameWon.current ? 1 : 0 }}
                    className={styles.answer}>
                        {gameOver && !gameWon.current ? word.current : "******"}
                </div>
                
                <div 
                    style={{backgroundColor:languageDie.current[counter.current].color}} 
                    className={styles.languageResponse}>
                    {gameWon.current ? <h3>Congrats 🎉 You saved the world from Assembly</h3> : <h3>{languageDie.current[counter.current].value}</h3>}
                </div>
                
                <div className={styles.languages}>
                    {languagesDisplay}
                </div>

                <div className={styles.wordBox}>
                    {wordBoxDisplay}

                </div>

                <div className={styles.keyboard}>
                    {keyboardDisplay}
                </div>
                {gameOver && <button onClick={restartGame}>Restart</button>}
            </main>
        </>
    )
}