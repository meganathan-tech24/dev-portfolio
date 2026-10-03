/**
 * The animated border for a `.border-flow` card: a thin ring drawn over the card's edge
 * with a colour sweep that travels around it. Put it first inside the card.
 *
 * It is a real element (not a pseudo-element of the card) because the mask that cuts the
 * ring has to stay still while the gradient inside it rotates. That keeps the animation
 * on `transform`, so it runs on the compositor. See `.border-flow` in globals.css.
 */
export function BorderFlowRing() {
  return <span aria-hidden="true" className="border-flow-ring" />;
}
