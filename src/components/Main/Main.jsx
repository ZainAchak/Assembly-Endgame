import { useEffect, useRef, useState } from "react";
import styles from "./Main.module.css"
import React from 'react'
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'
import { generate, count } from "random-words";

const languagesPattren = [
  { id: crypto.randomUUID(), value: "HTML", color: "#e34c26", show:true},
  { id: crypto.randomUUID(), value: "CSS", color: "#264de4", show:true},
  { id: crypto.randomUUID(), value: "Javascript", color: "#d4c132", show:true},
  { id: crypto.randomUUID(), value: "React", color: "#61dafb", show:true},
  { id: crypto.randomUUID(), value: "Typescript", color: "#3178c6", show:true},
  { id: crypto.randomUUID(), value: "Node.js", color: "#68a063", show:true},
  { id: crypto.randomUUID(), value: "Python", color: "#3572A5", show:true},
  { id: crypto.randomUUID(), value: "Ruby", color: "#cc342d", show:true},
  { id: crypto.randomUUID(), value: "Assembly", color: "#6e4c13", show:true}
];

const languagesDescription = [
  {
    id: crypto.randomUUID(),
    value: "HTML, it's been real.",
    color: "#e34c26",
    die: false,
  },
  {
    id: crypto.randomUUID(),
    value: "CSS, I guess you just couldn't style your way out of this.",
    color: "#264de4",
    die: false,
  },
  {
    id: crypto.randomUUID(),
    value: "JavaScript, too dynamic for your own good.",
    color: "#d4c132",
    die: false,
  },
  {
    id: crypto.randomUUID(),
    value: "React, even hooks couldn’t save you.",
    color: "#61dafb",
    die: false,
  },
  {
    id: crypto.randomUUID(),
    value: "TypeScript, type-safe but not safe enough.",
    color: "#3178c6",
    die: false,
  },
  {
    id: crypto.randomUUID(),
    value: "Node.js, no more event loops for you.",
    color: "#68a063",
    die: false,
  },
  {
    id: crypto.randomUUID(),
    value: "Python, your simplicity met a complex end.",
    color: "#3572A5",
    die: false,
  },
  {
    id: crypto.randomUUID(),
    value: "Ruby, elegant to the last exception.",
    color: "#cc342d",
    die: false,
  },
  {
    id: crypto.randomUUID(),
    value: "Assembly, Will RULE now.",
    color: "#6e4c13",
    die: false,
  }
];

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
    console.log(word.current)
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
            console.log(counter.current)
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
                    <h3>{languageDie.current[counter.current].value}</h3>
                </div>
                
                <div className={styles.languages}>
                    {languagesDisplay}
                    {/* <div className={styles.landDesc}>HTML</div>
                    <div className={styles.landDesc}>CSS</div>
                    <div className={styles.landDesc}>Javascript</div>
                    <div className={styles.landDesc}>React</div>
                    <div className={styles.landDesc}>Typescript</div>
                    <div className={styles.landDesc}>Node.js</div>
                    <div className={styles.landDesc}>Python</div>
                    <div className={styles.landDesc}>Ruby</div>
                    <div className={styles.landDesc}>Assembly</div> */}
                </div>

                <div className={styles.wordBox}>
                    {wordBoxDisplay}
                    {/* <span className={styles.word}>Z</span>
                    <span className={styles.word}>A</span>
                    <span className={styles.word}>I</span>
                    <span className={styles.word}>N</span>
                    <span className={styles.word}>U</span>
                    <span className={styles.word}>L</span>
                    <span className={styles.word}>L</span>
                    <span className={styles.word}>A</span>
                    <span className={styles.word}>H</span> */}

                </div>

                <div className={styles.keyboard}>
                    {keyboardDisplay}
                    {/* <button className={styles.keyboardBtn}>A</button>
                    <button className={styles.keyboardBtn}>B</button>
                    <button className={styles.keyboardBtn}>C</button>
                    <button className={styles.keyboardBtn}>D</button>
                    <button className={styles.keyboardBtn}>E</button>
                    <button className={styles.keyboardBtn}>F</button>
                    <button className={styles.keyboardBtn}>G</button>
                    <button className={styles.keyboardBtn}>H</button>
                    <button className={styles.keyboardBtn}>I</button>
                    <button className={styles.keyboardBtn}>J</button>
                    <button className={styles.keyboardBtn}>K</button>
                    <button className={styles.keyboardBtn}>L</button>
                    <button className={styles.keyboardBtn}>M</button>
                    <button className={styles.keyboardBtn}>N</button>
                    <button className={styles.keyboardBtn}>O</button>
                    <button className={styles.keyboardBtn}>P</button>
                    <button className={styles.keyboardBtn}>Q</button>
                    <button className={styles.keyboardBtn}>R</button>
                    <button className={styles.keyboardBtn}>S</button>
                    <button className={styles.keyboardBtn}>T</button>
                    <button className={styles.keyboardBtn}>U</button>
                    <button className={styles.keyboardBtn}>V</button>
                    <button className={styles.keyboardBtn}>W</button>
                    <button className={styles.keyboardBtn}>X</button>
                    <button className={styles.keyboardBtn}>Y</button>
                    <button className={styles.keyboardBtn}>Z</button> */}
                </div>
                {gameOver && <button onClick={restartGame}>Restart</button>}
            </main>
        </>
    )
}