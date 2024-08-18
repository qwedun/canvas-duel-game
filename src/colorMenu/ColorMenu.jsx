import {useEffect, useRef} from "react";

const ColorMenu = ({colors, setColor, setIsChange, isChange}) => {

    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef) return

        let context, gradient, hue;

        context = canvasRef.current.getContext("2d");

        gradient = context.createLinearGradient(20, 100,20,0);

        hue = [[255,0,0],[255,255,0],[0,255,0],[0,255,255],[0,0,255],[255,0,255],[255,0,0]];

        for (let i=0; i <= 6;i++) {

            let color = 'rgb('+hue[i][0]+','+hue[i][1]+','+hue[i][2]+')';

            gradient.addColorStop(i*1/6, color);

        }

        context.fillStyle = gradient;

        context.fillRect(0,0, 20 ,100);

    }, [canvasRef]);

    const handleClick = (e) => {

        const context = canvasRef.current.getContext("2d");
        const color = context.getImageData(e.clientX - e.target.offsetLeft - 10, e.clientY - e.target.offsetTop - 10, 1, 1).data

        if (isChange === 'left') {
            setColor({...colors, left: `rgb(${color[0]},${color[1]},${color[2]})`})
        } else {
            setColor({...colors, right: `rgb(${color[0]},${color[1]},${color[2]})`})
        }
        setIsChange(false);
    }


    return (
        <div className='left'>
            Изменить цвет заклинания:
            <canvas onClick={(e) => handleClick(e)} width='20' height='100' ref={canvasRef}></canvas>
        </div>
    );
};

export default ColorMenu;