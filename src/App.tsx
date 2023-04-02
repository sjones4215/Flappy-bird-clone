import React, {useCallback, useEffect, useRef, useState} from 'react';
import flappyImg from './assets/yellowbird-midflap.png'
import './App.css';

function App() {
    const canvas = useRef<HTMLCanvasElement>(null)
    let ctx: any;
    useEffect(() => {
        if(canvas.current) {
            ctx = canvas.current.getContext("2d");
        }}, [canvas, ctx])
    const [showMenu, setShowMenu] = useState(false);
    const [highscore, setHighScore] = useState(0);
    const [FLAP_SPEED] = useState(-5);
    const [BIRD_WIDTH] = useState(40);
    const [BIRD_HEIGHT] = useState(-30);
    const [PIPE_WIDTH] = useState(50);
    const [PIPE_GAP] = useState(125);



    useEffect(() => {
        pipeY = canvas?.current!.height
   }, [canvas])

    useEffect(() => {
         loop()
        document.addEventListener("keydown", handleSpaceClick);
        return () => document.removeEventListener("keydown", handleSpaceClick);
    }, [])


    const handleSpaceClick = (event: any) => {
        if(event.code === "Space") {
            birdVelocity = FLAP_SPEED
        }
    }

    const flappy = new Image()
    flappy.src = flappyImg


    //Bird variables
    let birdX = 50;
    let birdY = 50;
    let birdVelocity = 0;
    let birdAcceleration = 0.1;

    //Pipe variables
    let pipeX = 400;
    let pipeY = 400;

    //score and highscore variables
    let scoreDiv = document.getElementById('score-display')
    let score = 0;
    let scored = false

    const increaseScore = () => {
        if(birdX > pipeX + PIPE_WIDTH && (birdY < pipeY + PIPE_GAP ||
            birdY + BIRD_HEIGHT > pipeY + PIPE_GAP) &&
        !scored) {
            score++
           if(scoreDiv) {
               scoreDiv  .innerHTML = score.toString()
           }
            scored = true
        }

        if(birdX < pipeX + PIPE_WIDTH) {
            scored = false
        }
    }

    const collisionCheck = () => {
        const birdBox = {
            x: birdX,
            y: birdY,
            width: BIRD_WIDTH,
            height: BIRD_HEIGHT
        }

        const topPipeBox = {
            x: pipeX,
            y: pipeY - PIPE_GAP + BIRD_HEIGHT,
            width: PIPE_WIDTH,
            height: pipeY
        }

        const bottomPipeBox = {
            x: pipeX,
            y: pipeY + PIPE_GAP + BIRD_HEIGHT,
            width: PIPE_WIDTH,
            height: canvas?.current?.height! - pipeY - PIPE_GAP
        }

        if(birdBox.x + birdBox.width > topPipeBox.x
            && birdBox.x < topPipeBox.x + topPipeBox.width
            && birdBox.y < topPipeBox.y) {
            return true
        }

        if(birdBox.x + birdBox.width > bottomPipeBox.x &&
            birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
            birdBox.y + birdBox.height > bottomPipeBox.y
        ) {
            return true
        }

        return birdY < 0 || birdY + BIRD_HEIGHT > canvas?.current?.height!;
    }

    const restartGame = () => {
        document.addEventListener("keydown", handleSpaceClick);
        resetGame();
        hideEndMenu();
        loop();
        loop();
    }

    const hideEndMenu = ( ) => {
        setShowMenu(false)
    }

    const handleShowEndMenu = () => {
        setShowMenu(true)
        document.getElementById('end-score')!.innerHTML = score.toString()
        if(highscore < score) {
            document.getElementById('best-score')!.innerHTML = score.toString()
            setHighScore(score)
        } else {
            document.getElementById('best-score')!.innerHTML = highscore.toString()
        }
    }

    const resetGame = () => {
        if(canvas.current) {
            ctx = canvas.current.getContext("2d");
        }
        document.getElementById('score-display')!.innerHTML = '0'
        birdVelocity = 0;
        birdAcceleration = 0.1;
        birdX = 50;
        birdY = 50;

        pipeX = 400;
        pipeY = 400;

        score = 0;
    }

    const endGame = () => {
        handleShowEndMenu()
    }

    const loop = () => {
        ctx?.clearRect(0, 0, canvas?.current?.width!, canvas?.current?.height!)
        ctx?.drawImage(flappy, birdX, birdY);
        birdVelocity += birdAcceleration;
        birdY += birdVelocity;
        ctx?.fillRect(pipeX, -100, PIPE_WIDTH, pipeY)
        ctx?.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas?.current?.height! - pipeY)
        pipeX -= 1.5;

        if(collisionCheck()) {
            endGame();
            return
        }



        if(pipeX < -50) {
            pipeX = 400
            pipeY = Math.random() * (canvas?.current?.height! - PIPE_GAP) + PIPE_WIDTH;
        }

        ///ctx?.fillStyle = '#333'
        increaseScore()
        requestAnimationFrame(loop);
    }

    return (
            <>
                <div id="end-menu" className={ showMenu ? 'display-menu' : 'hide-menu'}>
                    <h1>Game-over!</h1>
                    <p> Score:  <span id="end-score"></span></p>
                    <p> Best Score:  <span id="best-score"></span></p>
                    <button onClick={() => restartGame()} id="restart-button">Restart</button>
                </div>
                <div id="game-container" className={ showMenu ? "backdrop-blur" : ''}>
                    <canvas ref={canvas} id="game-canvas" width="400" height="600">
                    </canvas>
                        <div id="score-display">0</div>
                </div>
            </>
    )
}



export default App;
