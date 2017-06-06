import { trigger, animate, transition, style } from "@angular/animations";

/**
 * 
 * @param delay animation delay
 */
export function shrinkAnimation(delay) {
  return trigger('shrink', [
    style({
      oppacity: 1
    }), 
    transition('void => *' , [
      style({
        opacity: 0,
        fontSize: '18px'
      }),
      animate(delay)
    ])
  ]);
}

/**
 * 
 * @param delay animation delay
 */
export function turnAnimation(delay) {
  return trigger('turn', [
    style({
      transform: 'rotate(0)'
    }),
    transition('void => *', [
      style({
        transform: 'rotate(180deg)'
      }),
      animate(delay)
    ])
  ]);
}

/**
 * 
 * @param delay animation delay
 */
export function slideUpAnimation(delay) {
  return trigger('slideUp', [
    style({
      opacity: 1,
      transform: 'translateY(0)'
    }),
    transition('void => *', [
      style({
        opacity: 0,
        transform: 'translateY(100px)'
      }),
      animate(delay)
    ])
  ]);
}

/**
 * 
 * @param delay animation delay
 */
export function slideInAnimation(delay) {
  return trigger('slideIn',[
    style({
      opacity: 1,
      transform: 'translateX(0)'
    }),
    transition('void => *', [
      style({
        opacity: 0,
        transform: 'translateX(-100px)'
      }),
      animate(delay)
    ])
  ]);
}

/**
 * 
 * @param delay animation delay
 */
export function slideInRightAnimation(delay) {
  return trigger('slideInRight',[
    style({
      opacity: 1,
      transform: 'translateX(0)'
    }),
    transition('void => *', [
      style({
        opacity: 0,
        transform: 'translateX(100px)'
      }),
      animate(delay)
    ])
  ]);
}