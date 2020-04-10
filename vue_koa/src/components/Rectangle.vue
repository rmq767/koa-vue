<template>
    <div>
        <div class="rectangle" ref="rectangle">
            <img src="../assets/people.jpg" alt="" style="width:2rem;height:2rem;">
            <div class="front"></div>
            <div class="back"></div>
            <div class="left"></div>
            <div class="right"></div>
            <div class="top"></div>
            <div class="bottom"></div>
        </div>
    </div>
</template>

<style scoped lang='less'>
.rectangle{
    width: 2rem;
    height: 2rem;
    /* perspective: 1000px; */
    position: relative;
    transform-style: preserve-3d;
    /* flat是平面， preserve-3d是3d */
    transform: rotate3d(1,1,1,0deg);

    animation: rec_rotate 3s infinite;
    img{
        border-radius: 50%;
    }
}
@keyframes rec_rotate {
    /* 旋转动画 */
    from{
        transform: rotate3d(1,1,1,0deg);
    }
    to{
        transform: rotate3d(1,1,1,360deg);
    }
}
.front,.back,.left,.right,.top,.bottom{
    height: 100%;
    width: 100%;
    display: block;
    line-height: 1rem;
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.7;
}
.left{
    background: pink;
    transform: translateX(-1rem) rotateY(90deg);
}
.right{
    background: orange;
    transform: translateX(1rem) rotateY(90deg);
}
.front{
    background: yellow;
    transform: translateZ(1rem);
}
.back{
    background: greenyellow;
    transform: translateZ(-1rem);
}
.top{
    background: bisque;
    transform: translateY(-1rem) rotateX(90deg);
}
.bottom{
    background: blue;
    transform: translateY(1rem) rotateX(90deg);
}
</style>