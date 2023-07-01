export function getMarkerClassName(symbol: number) {
  switch (symbol) {
    case 0:
      return "marker circle";
    case 1:
      return "marker cross";
    case 2:
      return "marker triangle";
    case 3:
      return "marker square";
  }
}

export function getDebuffClassName(debuff: number) {
  switch (debuff) {
    case 0:
      return "debuff alpha";
    case 1:
      return "debuff beta";
  }
}

export function getIconClassName(symbol: number) {
  switch (symbol) {
    case 1:
      return "icon blue";
    case 2:
      return "icon red";
    case 3:
      return "icon yellow";
  }
}

export function getButtonClassName(clicked: boolean, showAnswer: boolean) {
  if (!showAnswer) return "";
  return "reveal" + (clicked ? " clicked" : "");
}
