<script setup lang="ts">
import pop from '@/popup'
</script>

<template>
  <main grow>
    <router-view v-slot="{ Component }">
      <suspense>
        <layout>
          <component grow :is="Component" />
        </layout>

        <template #fallback>
          <row grow>
            <div class="content">
              <div class="die">
                <figure class="face face-1"></figure>
                <figure class="face face-2"></figure>
                <figure class="face face-3"></figure>
                <figure class="face face-4"></figure>
                <figure class="face face-5"></figure>
                <figure class="face face-6"></figure>
                <figure class="face face-7"></figure>
                <figure class="face face-8"></figure>
                <figure class="face face-9"></figure>
                <figure class="face face-10"></figure>
                <figure class="face face-11"></figure>
                <figure class="face face-12"></figure>
                <figure class="face face-13"></figure>
                <figure class="face face-14"></figure>
                <figure class="face face-15"></figure>
                <figure class="face face-16"></figure>
                <figure class="face face-17"></figure>
                <figure class="face face-18"></figure>
                <figure class="face face-19"></figure>
                <figure class="face face-20"></figure>
              </div>
              <p>LOADING...</p>
            </div>
          </row>
        </template>
      </suspense>
    </router-view>
    <popup shrink v-if="pop.shown">{{ pop.content }}</popup>
  </main>
</template>

<style lang="scss">
@use "sass:math";
$containerWidth: 200px;
$containerHeight: $containerWidth;

$faceWidth: $containerWidth*0.5;
$faceHeight: $faceWidth*0.86;

$transitionDuration: 0.5s;
$animationDuration: 5s;

$angle: 53deg;
$ringAngle: -11deg;
$sideAngle: math.div(360deg, 5);
$opacity: 0.75;
$color: #bdbdbd4b;

$rotateX: -$angle;
$translateZ: $faceWidth*0.335;
$translateY: -$faceHeight*0.15;
$translateRingZ: $faceWidth*0.75;
$translateRingY: $faceHeight*0.78 + $translateY;
$translateLowerZ: $translateZ;
$translateLowerY: $faceHeight*0.78 + $translateRingY;

@keyframes roll {
  0% {
    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg)
  }

  50% {
    transform: rotateX(40deg) rotateY(180deg) rotateZ(320deg)
  }

  100% {
    transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg)
  }
}

@keyframes blink {
  0% {
    opacity: 1;
  }

  100% {
    opacity: .2;
  }
}

p {
  margin: $containerWidth + 20px auto;
  color: #fff;
  letter-spacing: .5em;
  text-indent: .5em;
  font-size: 18px;
  animation: blink 1s ease-in-out infinite alternate;
}

.content {
  margin: auto auto;
  position: relative;
  width: $containerWidth;
  height: $containerHeight;
  perspective: 1500px;
}

.die {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform $transitionDuration ease-out;
  cursor: pointer;
  animation: roll $animationDuration linear infinite;
  transform: rotateX($rotateX);

  @for $i from 1 through 5 {
    &[data-face="#{$i}"] {
      $angleMultiplier: $i - 1;
      transform: rotateX(-$angle) rotateY($sideAngle * $angleMultiplier);
    }
  }

  @for $i from 16 through 20 {
    &[data-face="#{$i}"] {
      $angleMultiplier: $i - 15;
      transform: rotateX(-$angle + 180deg) rotateY(-$sideAngle * $angleMultiplier);
    }
  }

  @for $i from 6 through 10 {
    &[data-face="#{$i}"] {
      $angleMultiplier: $i - 6;
      transform: rotateX(-$ringAngle) rotateZ(180deg) rotateY($sideAngle * $angleMultiplier);
    }
  }

  @for $i from 11 through 15 {
    &[data-face="#{$i}"] {
      $angleMultiplier: $i - 8;
      transform: rotateX(-$ringAngle) rotateY(-$sideAngle * $angleMultiplier - math.div($sideAngle, 22));
    }
  }

  .face {
    $horizontalMargin: -$faceWidth*0.5;

    position: absolute;
    left: 50%;
    top: 0;
    margin: 0 $horizontalMargin;
    border-left: $faceWidth*0.5 solid transparent;
    border-right: $faceWidth*0.5 solid transparent;
    border-bottom: $faceHeight solid $color;
    width: 0px;
    height: 0px;
    transform-style: preserve-3d;
    backface-visibility: hidden;

    counter-increment: steps 1;

    &:before {
      content: counter(steps);
      position: absolute;
      top: $faceHeight*0.25;
      left: -$faceWidth;
      color: #fff;
      font-size: $faceHeight*0.4;
      text-align: center;
      line-height: $faceHeight*0.9;
      width: $faceWidth*2;
      height: $faceHeight;
    }

    @for $i from 1 through 5 {
      &:nth-child(#{$i}) {
        $angleMultiplier: $i - 1;
        transform: rotateY(-$sideAngle * $angleMultiplier) translateZ($translateZ) translateY($translateY) rotateX($angle);
      }
    }

    @for $i from 16 through 20 {
      &:nth-child(#{$i}) {
        $angleMultiplier: $i - 18;
        transform: rotateY($sideAngle * $angleMultiplier + math.div($sideAngle, 22)) translateZ($translateLowerZ) translateY($translateLowerY) rotateZ(180deg) rotateX($angle);
      }
    }

    @for $i from 6 through 10 {
      &:nth-child(#{$i}) {
        $angleMultiplier: $i - 11;
        transform: rotateY(-$sideAngle * $angleMultiplier) translateZ($translateRingZ) translateY($translateRingY) rotateZ(180deg) rotateX($ringAngle);
      }
    }

    @for $i from 11 through 15 {
      &:nth-child(#{$i}) {
        $angleMultiplier: $i - 8;
        transform: rotateY($sideAngle * $angleMultiplier + math.div($sideAngle, 2)) translateZ($translateRingZ) translateY($translateRingY) rotateX($ringAngle);
      }
    }
  }
}
</style>