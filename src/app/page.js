'use client'
import {useRef, useEffect, useState} from "react";
import Canvas from '@/canvas/canvas';
import Circle from "@/canvas/circle";
import ColorMenu from "@/colorMenu/ColorMenu";

export default function Game() {

    const canvasRef = useRef(null);
    
    const [rightCircle, setRightCircle] = useState(new Circle(900 - 25, 600 - 25, 2, -2, 24, 'blue'));
    const [leftCircle, setLeftCircle] = useState(new Circle(24, 24, 2, 2, 24, 'green'));

    const [leftTimeout, setLeftTimeout] = useState(500);
    const [rightTimeout, setRightTimeout] = useState(500);

    const [leftCirclesArray, setLeftCirclesArray] = useState([]);
    const [rightCirclesArray, setRightCirclesArray] = useState([]);

    const [canvas, setCanvas] = useState(null);

    const [score, setScore] = useState({left: 0, right: 0});
    const [colors, setColors] = useState({left: 'darkgreen', right: 'darkblue'});
    const [isChange, setIsChange] = useState('');

    useEffect(() => {
        if (!canvasRef.current) return

        const ctx = canvasRef.current.getContext('2d');
        ctx.strokeRect(0, 0, 900, 600);

        const canvas = new Canvas(ctx, 900, 600);
        setCanvas(canvas);
    }, [canvasRef.current]);

    useEffect(() => {
        if (!canvas) return

        const timer = setInterval(() => {
            canvas.clear();

            leftCirclesArray.forEach(circle => {
                canvas.drawCircle(circle.x, circle.y, circle.radius, colors.left);
                circle.checkCollision(canvas.height, canvas.width);

                if (Circle.isHeroTouched(rightCircle, circle.x, circle.y))
                    setScore({...score, left: score.left += 1})

                circle.y += circle.dy;
                circle.x += circle.dx;
            })

            rightCirclesArray.forEach(circle => {
                canvas.drawCircle(circle.x, circle.y, circle.radius, colors.right)
                circle.checkCollision(canvas.height, canvas.width);

                if (Circle.isHeroTouched(leftCircle, circle.x, circle.y))
                    setScore({...score, right: score.right += 1})

                circle.y += circle.dy;
                circle.x += circle.dx;
            })

            canvas.drawCircle(25, leftCircle.y, 24, leftCircle.color);
            canvas.drawCircle(canvas.width - 25, rightCircle.y, 24, rightCircle.color);

            leftCircle.checkCollision(canvas.height, canvas.width, 24);
            rightCircle.checkCollision(canvas.height, canvas.width, 24);

            leftCircle.y += leftCircle.dy;
            rightCircle.y += rightCircle.dy;
        }, 10)

        return () => clearInterval(timer);
    }, [canvas, leftCirclesArray, rightCirclesArray])


    useEffect(() => {

        const leftTimer = setInterval(() => {
            setLeftCirclesArray(prev =>
                [...prev, new Circle(50, leftCircle.y, ((Math.random() < 0.5) ? -1 : 1) * Math.random() * 3, 2, 6)])
        }, 1000 - leftTimeout)

        return () => {
            clearInterval(leftTimer);
        }
    }, [leftTimeout]);

    useEffect(() => {

        const rightTimer = setInterval(() => {
            setRightCirclesArray(prev =>
                [...prev, new Circle(850, rightCircle.y, ((Math.random() < 0.5) ? -1 : 1) * Math.random() * 3, -2, 6)]);
        }, 1000 - rightTimeout)

        return () => {
            clearInterval(rightTimer);
        }
    }, [rightTimeout]);

    useEffect(() => {
        setLeftCirclesArray([]);
        setRightCirclesArray([]);
    }, [score])

    const handleMouseMove = (e) => {
        e.preventDefault();

        const color = canvas.ctx.getImageData(e.clientX - e.target.offsetLeft, e.clientY - e.target.offsetTop, 1, 1).data
        if (color[0] === 0 && color[1] === 128 && color[2] === 0)
            leftCircle.dy = -leftCircle.dy;

        else if (color[0] === 0 && color[1] === 0 && color[2] === 255)
            rightCircle.dy = -rightCircle.dy
    }

    const handleMouseClick = (e) => {
        if (Circle.isHeroTouched(leftCircle, e.clientX - e.target.offsetLeft, e.clientY - e.target.offsetTop))
            setIsChange('left');
        else if (Circle.isHeroTouched(rightCircle, e.clientX - e.target.offsetLeft, e.clientY - e.target.offsetTop))
            setIsChange('right');
    }

    return (
        <>
            <div className='score'>{score.left}:{score.right}</div>
            <div className='main'>
                <div>
                    <div>Скорострельность <input type='range' min='10' max='800' value={leftTimeout}
                                                 onChange={(e) => setLeftTimeout(+e.target.value)}/></div>
                    <div>Скорость героя <input type='range' min='1' max='10' value={Math.abs(leftCircle.dy)}
                                               onChange={(e) => leftCircle.dy = leftCircle.dy < 0 ? -e.target.value : +e.target.value}/>
                    </div>
                </div>
                {isChange && <ColorMenu colors={colors} setColor={setColors} setIsChange={setIsChange} isChange={isChange} />}
                <div className='canvas-container'>
                    <canvas
                        onClick={(e) => handleMouseClick(e)}
                        onMouseMove={(e) => handleMouseMove(e)} ref={canvasRef} width='900' height='600'></canvas>
                </div>
                <div>
                    <div>Скорострельность <input type='range' min='10' max='800' value={rightTimeout}
                                                 onChange={(e) => setRightTimeout(+e.target.value)}/>
                    </div>
                    <div>Скорость героя <input type='range' min='1' max='10' value={Math.abs(rightCircle.dy)}
                                               onChange={(e) => rightCircle.dy = rightCircle.dy < 0 ? -e.target.value : +e.target.value}/>
                    </div>
                </div>
            </div>
        </>
    );
}
