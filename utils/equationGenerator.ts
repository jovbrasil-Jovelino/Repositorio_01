
export interface Equation {
  text: string;
  solution: number;
}

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateEquation(): Equation {
  // Generate equations of the form ax + b = c, ensuring x is a whole number.
  
  const a = getRandomInt(2, 9);
  const x = getRandomInt(-10, 10);
  const b_sign = Math.random() < 0.5 ? 1 : -1;
  const b_val = getRandomInt(1, 20);
  const b = b_sign * b_val;
  
  const c = a * x + b;
  
  const b_text = b > 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
  
  const equationText = `${a}x ${b_text} = ${c}`;
  
  return {
    text: equationText.replace(/\s/g, ' '),
    solution: x,
  };
}
