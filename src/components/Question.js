import React from "react";
import {decode} from 'html-entities';
export default function question(props) {
    
    //putStyle: check -> {submitted => mark true and false}: {!submitted => mark the selected answer}
    function putStyle(idxOption) {
        if(props.isSubmitted) {
            console.log(question)
            if(props.choices[idxOption] === props.correct) return {backgroundColor: "#94D7A2"}
            
            if(props.correct !== props.choices[props.selectedAnswer] && props.selectedAnswer === idxOption)    return {backgroundColor:"#F8BCBC"}
        } else {
            return(props.selectedAnswer === idxOption && !props.isSubmitted? {backgroundColor: "#D6DBF5"} : {backgroundColor: "white"})
        }
    }

    //options: generate options btns with value and color
    let options = props.choices.map((option, idx) => {
        return (
            <button style={putStyle(idx)} onClick={() => props.chooseAnswer(props.id, idx)} className="choice">{decode(option)}</button>
        )
    })
    
    return(
        <div className="question" key={props.id}>
            <h1 id="question-value">{decode(props.question)}</h1>
            <div className="choices">
                {options}
            </div>
            <hr/>
        </div>
    )
}